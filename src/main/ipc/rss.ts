import RSSParser from "rss-parser";
import {ipcMain} from "electron"
import {IPCChannel, PaginationType} from "@src/types/rss";
import FeedService from "@src/dataBase/server/feed";
import to from "await-to-js";
import RSSListService from "@src/dataBase/server/rss";

export const handleInsertFeedByUrl = (xml: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            let parser = new RSSParser();
            parser.parseString(xml)
                .then(async (res) => {
                    const [_, saveRes] = await to(FeedService.insertFeed({
                        title: res?.title || "",
                        link: res?.link || "",
                        feedUrl: res?.feedUrl || "",
                        lastBuildDate: res?.lastBuildDate,
                    }))
                    if (saveRes?.id) {
                        const items = res.items;
                        await Promise.allSettled(items.map(async item => {
                             await RSSListService.insertRSS({
                                rssId: item.id || item.guid,
                                rssLink: item.link || "",
                                author: item.author || item.creator || item["dc:creator"] || "",
                                content: item.content || "",
                                contentSnippet: item.contentSnippet || "",
                                pubDate: item.pubDate || "",
                                isoDate: item.isoDate || "",
                                summary: item.summary || "",
                                title: item.title || "",
                                feedId: saveRes?.id as string
                            })
                        }))
                    }
                    resolve(res);
                })
                .catch((err) => {
                    console.log(err, 'err')
                    reject(err)
                })
        } catch (err) {
            reject(err)
        }
    })
}

const RSSIpc = () => {
    ipcMain.handle(IPCChannel.GetRSSList, async (_, {
        feedId,
        pageNo,
        pageSize,
    }: { feedId: string } & PaginationType) => {
        const list = await RSSListService.getALLRSSListByFeed({
            feedId,
            pageNo,
            pageSize
        })
        return list;
    })

    ipcMain.handle(IPCChannel.ParseRSS, (_, xml: string) => {
        return handleInsertFeedByUrl(xml);
    })

    ipcMain.handle(IPCChannel.Search, (_, keyword: string) => {
        return RSSListService.searchRSS(keyword);
    })

}
export default RSSIpc;
