import {ipcMain} from "electron";
import {IPCChannel} from "@src/types/rss";
import FeedService from "@src/dataBase/server/feed";
import {handleInsertFeedByUrl} from "@main/ipc/rss";
import {FeedType} from "@src/types/feed";

const FeedIpc = () => {
    ipcMain.handle(IPCChannel.GetFeedList, async () => {
        const res = await FeedService.getALLFeed();
        return res;
    })

    ipcMain.handle(IPCChannel.UpdateFeed, async (_, feedItem: FeedType) => {
        const res = await FeedService.updateFeed(feedItem);
        return res;
    })

    ipcMain.handle(IPCChannel.RemoveFeed, async (_, id) => {
        const res = await FeedService.removeFeed(id);
        return res;
    })

    ipcMain.handle(IPCChannel.UpdateFeedList, async (_, xmlList: {xml: string; url: string}[]) => {
        if (!xmlList || xmlList.length === 0) {
            return Promise.resolve([])
        }
        const res = await Promise.all(xmlList.map(item => {
            return handleInsertFeedByUrl(item.xml, item.url)
        }))
        return res
    })

}
export default FeedIpc
