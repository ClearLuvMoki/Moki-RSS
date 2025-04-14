import { FeedListEntities } from "@/database/entities";
import { getRSSQueryBuilder } from "@/database/server/rss";
import Logger from "@/src/main/logger";
import to from "await-to-js";
import * as cheerio from "cheerio";
import Database from "../";
import RSSServer from "./rss";

export const getFeedQueryBuilder = async () => {
  return Database.getRepository(FeedListEntities);
};
class FeedServer {
  static async validateFavicon(url: string) {
    let flag = false;
    try {
      const result = await fetch(url, {
        credentials: "omit",
      });
      if (
        result.status === 200 &&
        result.headers.has("Content-Type") &&
        result.headers.get("Content-Type")?.startsWith("image")
      ) {
        flag = true;
        return flag;
      }
      return flag;
    } catch (err) {
      return flag;
    }
  }
  static onFeedDetails({
    url,
    feedXml,
    originXml,
    isNeedIcon,
  }: {
    url: string;
    feedXml: string;
    originXml: string;
    isNeedIcon: boolean;
  }): Promise<{
    title: string;
    base: string;
    faviconUrl: string;
  } | null> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!feedXml) reject("No Xml!");
        const $ = cheerio.load(feedXml);
        const title =
          $("title").text().trim() ||
          $('meta[property="og:title"]').attr("content") ||
          $("h1").first().text().trim() ||
          "";
        let faviconUrl =
          $('link[rel="icon"]').attr("href") ||
          $('link[rel="shortcut icon"]').attr("href") ||
          $('link[rel="apple-touch-icon"]').attr("href") ||
          "";
        // 如果 feed 的 xml 没有解析到 icon 则去 origin 上解析
        if (!faviconUrl && originXml) {
          const $ = cheerio.load(originXml);
          faviconUrl =
            $('link[rel="icon"]').attr("href") ||
            $('link[rel="shortcut icon"]').attr("href") ||
            $('link[rel="apple-touch-icon"]').attr("href") ||
            "";
        }
        if (faviconUrl && !faviconUrl.startsWith("http")) {
          const { origin } = new URL(url);
          faviconUrl = new URL(faviconUrl, origin).href;
        }
        let faviconBase64 = "";
        if (isNeedIcon) {
          const isValidateFavicon = await FeedServer.validateFavicon(faviconUrl);
          if (isValidateFavicon) {
            const faviconRes = await fetch(faviconUrl, {
              credentials: "omit",
            }).then((res) => res.arrayBuffer());
            const buffer = Buffer.from(faviconRes);
            const base64 = buffer.toString("base64");
            const mimeType = "image/png";
            faviconBase64 = base64 ? `data:${mimeType};base64,${base64}` : "";
          }
        }
        return resolve({
          title,
          base: faviconBase64,
          faviconUrl,
        });
      } catch (err) {
        Logger.error(`获取Feed详情失败: ${err}`);
        reject(err);
      }
    });
  }

  static async allFeeds() {
    const feedQueryBuilder = await getFeedQueryBuilder();
    return feedQueryBuilder.find();
  }

  static async removeFeedByID(id: string) {
    const feedQueryBuilder = await getFeedQueryBuilder();
    return feedQueryBuilder.delete(id);
  }

  static async getImageFormRSSContent(content: string) {
    return new Promise((resolve) => {
      try {
        if (!content) {
          return resolve([]);
        }
        const $ = cheerio.load(content);
        const images =
          $("img")
            .map((_, el) => $(el).attr("src"))
            .get()
            .filter((link) => link) || [];
        return resolve(images);
      } catch (err) {
        Logger.error(`解析RSS content 的图片失败: ${err}!`);
        resolve([]);
      }
    });
  }

  static insertFeed({
    url,
    feedXml,
    originXml,
    faviconUrl,
    faviconBase64,
  }: {
    url: string;
    feedXml: string;
    originXml: string;
    faviconUrl: string;
    faviconBase64: string;
  }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!feedXml) {
          Logger.error("保存Feed详情失败，未传入Xml!");
          return reject("保存Feed详情失败,未传入Xml!");
        }
        const [feedErr, feedData] = await to(
          FeedServer.onFeedDetails({
            url,
            feedXml,
            originXml,
            isNeedIcon: !faviconBase64,
          }),
        );
        const [rssErr, rssData] = await to(RSSServer.getRSSByFeedURL(feedXml));

        if (rssErr) {
          Logger.error(`获取订阅源失败， ${rssErr}`);
          return reject("Get RSS Data fail");
        }
        if (feedErr || !feedData) {
          return reject(`保存Feed详情失败: ${feedErr}`);
        }
        const feedQueryBuilder = await getFeedQueryBuilder();
        const queryData = await feedQueryBuilder.findOne({
          where: {
            feedUrl: url,
          },
        });
        const data = await feedQueryBuilder.save({
          id: queryData?.id,
          title: rssData?.title || feedData?.title || "",
          avatar: feedData?.faviconUrl || faviconUrl || "",
          avatarBase64: feedData?.base || faviconBase64 || "",
          feedUrl: url,
        });
        if (rssData?.list.length) {
          const rssQuery = await getRSSQueryBuilder();
          Promise.allSettled(
            rssData?.list.map(async (item) => {
              const images = await FeedServer.getImageFormRSSContent(item?.content || "");
              const existItem = await rssQuery.findOne({
                where: {
                  feedId: queryData?.id,
                  rssId: item?.id || item?.guid || "",
                },
              });
              if (item?.mediaContent && item?.mediaContent?.length > 0) {
                console.log(url, JSON.stringify(item?.mediaContent || []), "item?.fullContent");
              }
              return rssQuery.save({
                id: existItem?.id,
                feedId: data?.id,
                mediaContent: JSON.stringify(
                  (item?.mediaContent || [])
                    ?.filter((item: any) => item?.$ && item?.$.medium === "image" && item?.$.url)
                    ?.map((item: any) => item?.$.url),
                ),
                rssId: item?.id || item?.guid || "",
                rssLink: item?.link || "",
                author: item?.author || item?.creator || item["dc:creator"] || "",
                content: item?.fullContent || item?.content || "",
                contentSnippet: item?.contentSnippet || "",
                pubDate: item?.pubDate || "",
                isoDate: item?.isoDate || "",
                summary: item?.summary || "",
                title: item?.title || "",
                images: JSON.stringify(images || []),
              });
            }),
          );
        }
        return resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default FeedServer;
