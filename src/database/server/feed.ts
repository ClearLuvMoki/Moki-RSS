import { FeedListEntities } from "@/database/entities";
import Logger from "@/src/main/logger";
import to from "await-to-js";
import * as cheerio from "cheerio";
import Database from "../";

export const getFeedQueryBuilder = async () => {
  return Database.getRepository(FeedListEntities);
};

class FeedServer {
  static onFeedDetails(url: string): Promise<{
    title: string;
    base: string;
    faviconUrl: string;
  } | null> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!url) reject("No Url!");
        const [err, data] = await to(fetch(url));
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
          $('link[rel="apple-touch-icon"]').attr("href") ||
          "";
        if (faviconUrl && !faviconUrl.startsWith("http")) {
          const { origin } = new URL(url);
          faviconUrl = new URL(faviconUrl, origin).href;
        }
        if (faviconUrl) {
          const data = await fetch(faviconUrl);
          const arraybufferData = await data?.arrayBuffer();
          const buffer = Buffer.from(arraybufferData);
          const base64 = buffer.toString("base64");
          const mimeType = "image/png";
          const base64Image = `data:${mimeType};base64,${base64}`;
          return resolve({
            title,
            base: base64Image,
            faviconUrl,
          });
        }
        return resolve(null);
      } catch (err) {
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

  static insertFeed(url: string) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!url.startsWith("http")) {
          return reject("保存Feed详情失败,URL异常!");
        }
        const [feedErr, feedData] = await to(FeedServer.onFeedDetails(url));
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
          title: feedData?.title,
          avatar: feedData?.faviconUrl,
          avatarBase64: feedData?.base,
          feedUrl: url,
        });
        return feedQueryBuilder
          .save(data)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            Logger.error(`保存Feed失败：${err}`);
            reject(err);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default FeedServer;
