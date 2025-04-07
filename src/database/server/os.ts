import { ConfigEntities } from "@/database/entities";
import type { ConfigType } from "@/src/domains/types/config";
import Logger from "@/src/main/logger";
import { Config } from "tailwind-merge";
import Database from "../";

export const getConfigQueryBuilder = async () => {
  return Database.getRepository(ConfigEntities);
};

class OSServer {
  static async getConfig() {
    const configQueryBuilder = await getConfigQueryBuilder();
    const list = await configQueryBuilder.find();
    const data = list?.[0];
    if (!data) {
      const _data = {
        locale: "en-US",
        theme: "light",
        listMode: "magazine",
      };
      await configQueryBuilder.save(_data);
      return _data;
    }
    return data;
  }

  static async updateConfig(config: Partial<ConfigType>) {
    return new Promise(async (resolve, reject) => {
      try {
        const configQueryBuilder = await getConfigQueryBuilder();
        const list = await configQueryBuilder.find();
        const data = list?.[0];
        if (!data) {
          Logger.error("未获取配置信息!");
          return reject("未获取配置信息!");
        }
        const _data = await configQueryBuilder.save({
          ...data,
          ...config,
        });
        resolve(_data);
      } catch (err) {
        Logger.error(`修改配置出错: ${err}`);
        reject(err);
      }
    });
  }
}

export default OSServer;
