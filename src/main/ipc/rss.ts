import RSSParser from "rss-parser";
import {ipcMain} from "electron"
import {IPCChannel, PaginationType} from "@src/types/rss";
import FeedService from "@src/dataBase/server/feed";
import to from "await-to-js";
import RSSListService from "@src/dataBase/server/rss";

export const handleInsertFeedByUrl = (url: string) =>{
    return new Promise((resolve, reject) => {
        try {
             let parser = new RSSParser();
             parser.parseURL(url)
                .then(async (res) => {
                    const [_, saveRes] = await to(FeedService.insertFeed({
                        title: res?.title || "",
                        link: res?.link || "",
                        feedUrl: res?.feedUrl || "",
                        lastBuildDate: res?.lastBuildDate,
                    }))
                    if (saveRes?.id) {
                        const items = res.items;
                        items.forEach(item => {
                            RSSListService.insertRSS({
                                rssId: item.id || item.guid,
                                rssLink: item.link || "",
                                author: item.author || "",
                                content: item.content || "",
                                contentSnippet: item.contentSnippet || "",
                                pubDate: item.pubDate || "",
                                isoDate: item.isoDate || "",
                                summary: item.summary || "",
                                title: item.title || "",
                                feedId: saveRes?.id as string
                            })
                        })
                    }
                    resolve(res);
                })
                .catch(reject)
        }catch (err) {
            reject(err)
        }
    })
}

const RSSIpc = () => {
    ipcMain.handle(IPCChannel.GetRSSList, async (_, {
        feedId,
        pageNo,
        pageSize,
    }: { feedId: string }& PaginationType) => {
        const list = await RSSListService.getALLRSSListByFeed({
            feedId,
            pageNo,
            pageSize
        })
        return list;
    })

    ipcMain.handle(IPCChannel.ParseRSS, (_, url: string) => {
        return handleInsertFeedByUrl(url);
    })

}
export default RSSIpc;
