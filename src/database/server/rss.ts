import { RSSEntities } from "@/database/entities";
import Logger from "@/src/main/logger";
import to from "await-to-js";
import RSSParser from "rss-parser";
import Database from "../";

export const getRSSQueryBuilder = async () => {
  return Database.getRepository(RSSEntities);
};

class RSSServer {
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

  static getRSSByFeedURL(url: string): Promise<{
    title: string;
    list: any[];
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!url) {
          Logger.error("未根据URL搜索到对应的Feed!");
          reject("No Feed!");
        }
        const [err, data] = await to(fetch(url));
        const xml = await data?.text();
        if (err || !data || !xml) {
          Logger.error(`加载网页失败， url:${url}, err: ${err}`);
          return reject("Fetch Feed URL fail");
        }

        const parser = new RSSParser();
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
