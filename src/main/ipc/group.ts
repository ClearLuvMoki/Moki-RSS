import { GroupServer } from "@/database/server";
import Channels from "@/domains/channel";
import type { GroupType } from "@/domains/types/group";
import { ipcMain } from "electron";

const GroupIPC = () => {
  ipcMain.handle(Channels.AllGroup, async () => {
    return GroupServer.all();
  });

  ipcMain.handle(
    Channels.CreateOrUpdateGroup,
    async (
      _,
      {
        group,
      }: {
        group: Pick<GroupType, "id" | "name"> & {
          feeds: string[];
        };
      },
    ) => {
      return GroupServer.insert(group);
    },
  );
  ipcMain.handle(
    Channels.DeleteGroup,
    async (_, { id, feedIds }: { id: string; feedIds: string[] }) => {
      return GroupServer.delete(id, feedIds);
    },
  );
};

export default GroupIPC;
