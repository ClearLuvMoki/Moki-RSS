import Database from "@src/dataBase";
import {GroupEntities} from "@src/dataBase/entities/group";
import FeedService from "@src/dataBase/server/feed";

const getGroupQueryBuilder = async () => {
    return Database.getRepository(GroupEntities)
};

class GroupService {
    // 查询所有分组, 并且获取分组下面的订阅源
    static async getAllGroup() {
        return new Promise(async (resolve, reject) => {
            try {
                const groupQueryBuilder = await getGroupQueryBuilder();
                const groupArr = await groupQueryBuilder.find();
                const groupItemsArr: any[] = await Promise.allSettled(groupArr.filter(item => item.id).map(async item => {
                    const feedList = item.id ? await FeedService.getFeedByGroupId(item.id) : [];
                    return {
                        ...item,
                        feedList
                    }
                }))
                resolve(groupItemsArr.filter(item => item.status === "fulfilled").map(item => item.value));
            } catch (err) {
                reject(err)
            }
        })
    }


    // 创建一个新的分组
    static async createGroup(group: GroupEntities) {
        return new Promise(async (resolve, reject) => {
            const groupQueryBuilder = await getGroupQueryBuilder();
            groupQueryBuilder.save(group).then(resolve).catch(reject)
        })
    }


    // 删除一个分组
    static async deleteGroup(id: string) {
        return new Promise(async (resolve, reject) => {
            const groupQueryBuilder = await getGroupQueryBuilder();
            groupQueryBuilder.delete(id).then(resolve).catch(reject)
        })
    }

}

export default GroupService;
