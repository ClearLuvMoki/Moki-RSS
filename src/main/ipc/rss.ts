import { RSSServer } from "@/database/server";
import Channels from "@/domains/channel";
import { ipcMain } from "electron";

const RSSIPC = () => {
  ipcMain.handle(
    Channels.GetRSSByFeedId,
    async (
      _,
      data: {
        id: string;
        pageNo?: number;
        pageSize?: number;
      },
    ) => {
      const list = await RSSServer.getRSSByFeedId(data);
      return list || [];
    },
  );
};

export default RSSIPC;
