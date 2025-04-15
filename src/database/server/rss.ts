import { RSSEntities } from "@/database/entities";
import Logger from "@/src/main/logger";
import RSSParser from "rss-parser";
import { Like } from "typeorm";
import Database from "../";

export const getRSSQueryBuilder = async () => {
  return Database.getRepository(RSSEntities);
};

class RSSServer {
  static getRSSByKeyword(keyword: string) {
    return new Promise(async (resolve) => {
      try {
        const rssQuery = await getRSSQueryBuilder();
        const list = await rssQuery.find({
          where: [
            { title: Like(`%${keyword}%`) },
            { author: Like(`%${keyword}%`) },
            { content: Like(`%${keyword}%`) },
          ],
          skip: 0,
          take: 30,
          order: {
            isoDate: "desc",
          },
        });

        resolve(list || []);
      } catch (err) {
        Logger.error(`搜索出错: ${err}`);
        resolve([]);
      }
    });
  }

  static getRSSByFeedId({
    id,
    pageNo = 1,
    pageSize = 30,
  }: {
    id: string;
    pageNo?: number;
    pageSize?: number;
  }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!id) {
          Logger.error("未根据ID搜索到对应的Feed!");
          reject("No id get RSS!");
        }
        const rssQuery = await getRSSQueryBuilder();
        const list = await rssQuery.find({
          where: {
            feedId: id,
          },
          skip: (pageNo - 1) * pageSize,
          take: pageSize,
          order: {
            isoDate: "desc",
          },
        });

        resolve(list || []);
      } catch (err) {
        reject(err);
      }
    });
  }

  static getRSSByFeedURL(xml: string): Promise<{
    title: string;
    list: any[];
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!xml) {
          Logger.error("未传入Xml!");
          reject("No Xml!");
        }
        const parser = new RSSParser({
          customFields: {
            item: [
              "thumb",
              "image",
              ["content:encoded", "fullContent"],
              ["media:content", "mediaContent", { keepArray: true }],
            ],
          },
        });
        return parser.parseString(xml).then((res) => {
          resolve({
            title: res?.title || "",
            list: res?.items || [],
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default RSSServer;
