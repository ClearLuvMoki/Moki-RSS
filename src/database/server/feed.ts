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
      const result = await fetch(url, { credentials: "omit" });
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
  static onFeedDetails(url: string): Promise<{
    title: string;
    base: string;
    faviconUrl: string;
  } | null> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!url) reject("No Url!");
        const [err, data] = await to(fetch(url, { credentials: "omit" }));
        const html = await data?.text();
        if (err || !data || !html) {
          Logger.error(`加载网页失败， url:${url}, err: ${err}`);
          return reject("Fetch Feed URL fail");
        }
        const $ = cheerio.load(html);
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
        if (faviconUrl && !faviconUrl.startsWith("http")) {
          const { origin } = new URL(url);
          faviconUrl = new URL(faviconUrl, origin).href;
        }
        if (!faviconUrl) {
          const urlObj = new URL(url);
          const baseURL = `${urlObj.protocol}//${urlObj.host}`;
          const [_, data] = await to(fetch(baseURL, { credentials: "omit" }));
          console.log(baseURL, "baseURL");
          const baseHtml = await data?.text();
          const $ = cheerio.load(baseHtml || "");
          faviconUrl =
            $('link[rel="icon"]').attr("href") ||
            $('link[rel="shortcut icon"]').attr("href") ||
            $('link[rel="apple-touch-icon"]').attr("href") ||
            `${baseURL}/favicon.ico`;
          const isValidateFavicon = await FeedServer.validateFavicon(faviconUrl);
          if (!isValidateFavicon) faviconUrl = "";
        }
        let base64Image = "";
        if (faviconUrl) {
          const data = await fetch(faviconUrl);
          const arraybufferData = await data?.arrayBuffer();
          const buffer = Buffer.from(arraybufferData);
          const base64 = buffer.toString("base64");
          const mimeType = "image/png";
          base64Image = `data:${mimeType};base64,${base64}`;
        }
        return resolve({
          title,
          base: base64Image,
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
            .map((i, el) => $(el).attr("src"))
            .get()
            .filter((link) => link) || [];
        return resolve(images);
      } catch (err) {
        Logger.error(`解析RSS content 的图片失败: ${err}!`);
        resolve([]);
      }
    });
  }

  static insertFeed(url: string) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!url.startsWith("http")) {
          Logger.error("保存Feed详情失败，URL不正确!");
          return reject("保存Feed详情失败,URL异常!");
        }
        const [feedErr, feedData] = await to(FeedServer.onFeedDetails(url));
        const [rssErr, rssData] = await to(RSSServer.getRSSByFeedURL(url));

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
          avatar: feedData?.faviconUrl,
          avatarBase64: feedData?.base,
          feedUrl: url,
        });
        if (rssData?.list.length) {
          const rssQuery = await getRSSQueryBuilder();
          Promise.allSettled(
            rssData?.list.map(async (item) => {
              const images = await FeedServer.getImageFormRSSContent(item?.content || "");
              return rssQuery.save({
                feedId: data?.id,
                rssId: item?.id || item?.guid || "",
                rssLink: item?.link || "",
                author: item?.author || item?.creator || item["dc:creator"] || "",
                content: item?.content || "",
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
