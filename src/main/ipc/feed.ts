import {ipcMain} from "electron";
import {IPCChannel} from "@src/types/rss";
import FeedService from "@src/dataBase/server/feed";
import {handleInsertFeedByUrl} from "@main/ipc/rss";

const FeedIpc = () => {
    ipcMain.handle(IPCChannel.GetFeedList, async () => {
        const res = await FeedService.getALLFeed();
        return res;
    })

     ipcMain.handle(IPCChannel.RemoveFeed, async (_, id) => {
        const res = await FeedService.removeFeed(id);
        return res;
    })

    ipcMain.handle(IPCChannel.UpdateFeed, async () => {
        const feedList = await FeedService.getALLFeed();
        const urlList = feedList.map(item => {
            return item.feedUrl;
        }).filter(item => item);
        console.log("更新链接:", urlList);
        const res = await Promise.all(urlList.map(item => {
            return handleInsertFeedByUrl(item)
        }))
        return res
    })

}
export default FeedIpc
