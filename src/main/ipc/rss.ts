import RSSParser from "rss-parser";
import {ipcMain} from "electron"
import {IPCChannel, PaginationType} from "@src/types/rss";
import FeedService from "@src/dataBase/server/feed";
import to from "await-to-js";
import * as cheerio from 'cheerio';
import RSSListService from "@src/dataBase/server/rss";
import axios from "axios";


export const handleInsertFeedByUrl = (xml: string, url: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!xml || !url) return Promise.reject();
            let parser = new RSSParser();
            return parser.parseString(xml)
                .then(async (res) => {
                    const [_, avatarRes] = await to(handleGetLinkAvatar(res?.link || ""));
                    const [saveErr, saveRes] = await to(FeedService.insertFeed({
                        title: res?.title || "",
                        link: res?.link || "",
                        feedUrl: url || "",
                        avatar: avatarRes?.url || "",
                        avatarBase64: avatarRes?.base || "",
                        lastBuildDate: res?.lastBuildDate,
                    }))
                    if(saveErr) {
                        console.log("保存订阅源失败:", saveErr);
                        return reject(saveErr)
                    }
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

export const handleGetLinkAvatar = (url: string): Promise<{ base: string; url: string } | null> => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!url) return resolve(null);
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);
            let faviconUrl = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');
            if (faviconUrl && !faviconUrl.startsWith('http')) {
                const {origin} = new URL(url);
                faviconUrl = new URL(faviconUrl, origin).href;
            }
            console.log("解析站点icon:", faviconUrl);
            if (faviconUrl) {
                const faviconRes = await axios({
                    url: faviconUrl,
                    method: "GET",
                    responseType: "arraybuffer"
                })
                const buffer = Buffer.from(faviconRes.data, "binary");
                const base64 = buffer.toString('base64');
                const mimeType = 'image/png';
                const base64Image = `data:${mimeType};base64,${base64}`;
                return resolve({
                    base: base64Image,
                    url: faviconUrl
                })
            } else {
                return resolve(null)
            }
        } catch (err) {
            console.log("解析站点icon失败", err);
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

    ipcMain.handle(IPCChannel.ParseRSS, (_, {xml, url}: {xml: string; url: string}) => {
        return handleInsertFeedByUrl(xml, url);
    })

    ipcMain.handle(IPCChannel.Search, (_, keyword: string) => {
        return RSSListService.searchRSS(keyword);
    })

}
export default RSSIpc;
