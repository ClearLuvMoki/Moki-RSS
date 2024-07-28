import RSSParser from "rss-parser";
import {ipcMain} from "electron"
import {IPCChannel, PaginationType} from "@src/types/rss";
import FeedService from "@src/dataBase/server/feed";
import to from "await-to-js";
import * as cheerio from 'cheerio';
import RSSListService from "@src/dataBase/server/rss";


export const handleInsertFeedByUrl = (xml: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            let parser = new RSSParser();
            parser.parseString(xml)
                .then(async (res) => {
                    const avatarRes = await handleGetLinkAvatar(res?.link || "");
                    const [_, saveRes] = await to(FeedService.insertFeed({
                        title: res?.title || "",
                        link: res?.link || "",
                        feedUrl: res?.feedUrl || "",
                        avatar: avatarRes?.url || "",
                        avatarBase64: avatarRes?.base || "",
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

export const handleGetLinkAvatar = (url: string): Promise<{base: string; url: string} | null> => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!url) return resolve(null);
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);
            let faviconUrl = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');
            if (faviconUrl && !faviconUrl.startsWith('http')) {
                const {origin} = new URL(url);
                faviconUrl = new URL(faviconUrl, origin).href;
            }
            if (faviconUrl) {
                const baseResponse = await fetch(faviconUrl);
                const arrayBuffer = await baseResponse.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const base64 = buffer.toString('base64');
                const mimeType = response.headers.get('content-type') || 'image/png';
                const base64Image = `data:${mimeType};base64,${base64}`;
                return resolve({
                    base: base64Image,
                    url: faviconUrl
                })
            }else {
                return resolve(null)
            }
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
