import {ipcMain} from "electron";
import {IPCChannel} from "@src/types/rss";
import GroupService from "@src/dataBase/server/group";
import {GroupType} from "@src/types/group";

const GroupIpc = () => {
    ipcMain.handle(IPCChannel.GetGroup, async () => {
        const res = await GroupService.getAllGroup();
        return res;
    })

    ipcMain.handle(IPCChannel.AddGroup, async (_, group: Omit<GroupType, "id">) => {
        const res = await GroupService.createGroup(group);
        return res;
    })

    ipcMain.handle(IPCChannel.UpdateGroup, async (_, group: GroupType) => {
        const res = await GroupService.updateGroup(group);
        return res;
    })

    ipcMain.handle(IPCChannel.DeleteGroup, async (_, id: string) => {
        const res = await GroupService.deleteGroup(id);
        return res;
    })
}
export default GroupIpc
