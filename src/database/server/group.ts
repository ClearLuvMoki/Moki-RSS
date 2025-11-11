import type { GroupType } from "@/domains/types/group";
import Logger from "@/src/main/logger";
import { Not } from "typeorm";
import Database from "../";
import { GroupEntities } from "../entities";
import { getFeedQueryBuilder } from "./feed";

export const getGroupQueryBuilder = async () => {
  return Database.getRepository(GroupEntities);
};

class GroupSever {
  static async all() {
    const groupQueryBuilder = await getGroupQueryBuilder();
    const list = await groupQueryBuilder.find();
    const value = await Promise.allSettled(
      list.map(async (item) => {
        const feedQuery = await getFeedQueryBuilder();
        const feeds = await feedQuery.find({
          where: {
            groupId: item?.id && item.id !== "" ? item.id : Not(""),
          },
        });
        return {
          ...item,
          feeds: feeds || [],
        };
      }),
    );

    const data = value.filter((item) => item?.status === "fulfilled").map((item) => item?.value);
    return data;
  }

  static async delete(id: string, feedIds: string[]) {
    const groupQueryBuilder = await getGroupQueryBuilder();
    const feedBuilder = await getFeedQueryBuilder();
    await Promise.allSettled(
      feedIds.map(async (id) => {
        await feedBuilder.update(id, { groupId: "" });
      }),
    );
    return groupQueryBuilder.delete(id);
  }

  static insert(
    group: Pick<GroupType, "id" | "name" | "description"> & {
      feeds: string[];
    },
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const feeds = group?.feeds || [];
        const groupQueryBuilder = await getGroupQueryBuilder();
        let groupId = group?.id;
        if (group?.id) {
          await groupQueryBuilder.update(groupId, {
            name: group?.name || "",
            description: group?.description || "",
          });
        } else {
          const data = await groupQueryBuilder.save(
            {
              name: group?.name || "",
              description: group?.description || "",
            },
            { reload: true },
          );
          groupId = data?.id || "";
        }
        const feedBuilder = await getFeedQueryBuilder();
        if (feeds?.length > 0) {
          // 找到订阅源然后设置上 group-id
          await Promise.allSettled(
            feeds.map(async (id) => {
              const findOne = await feedBuilder.findOne({
                where: {
                  id,
                },
              });
              if (findOne) {
                await feedBuilder.update(findOne?.id!, {
                  groupId: groupId,
                });
              }
            }),
          );
        }
        const prevGroupFeeds = await feedBuilder.find({
          where: {
            groupId: groupId && groupId !== "" ? groupId : Not(""),
          },
        });
        await Promise.allSettled(
          prevGroupFeeds
            .filter((item) => !feeds.includes(item?.id!))
            .map(async (item) => {
              await feedBuilder.update(item.id!, {
                groupId: "",
              });
            }),
        );
        resolve(null);
      } catch (err) {
        Logger.error(`新增/修改Group失败: ${err}`);
        reject(err);
      }
    });
  }
}

export default GroupSever;
