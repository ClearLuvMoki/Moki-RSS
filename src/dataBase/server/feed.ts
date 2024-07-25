import Database from "@src/dataBase";
import {FeedListEntities} from "@src/dataBase/entities/feed";

export const getFeedQueryBuilder = async () => {
    return Database.getRepository(FeedListEntities)
};

class FeedService {
    static async getALLFeed() {
        const feedQueryBuilder = await getFeedQueryBuilder();
        const list = await feedQueryBuilder.find()
        return list;
    }

    static async getFeedByGroupId(groupId: string) {
        const feedQueryBuilder = await getFeedQueryBuilder();
        const list = await feedQueryBuilder.find({
            where: {
                groupId
            }
        })
        return list;
    }


    //

    // TODO:更新其他字段，比如头像等
    static async updateFeed(feedItem: {
        id: string;
        title?: string;
        groupId?: string;
    }) {
        const feedQueryBuilder = await getFeedQueryBuilder();
        const feed = await feedQueryBuilder.findOne({
            where: {
                id: feedItem.id
            }
        });
        if (feed?.id) {
            const item = await feedQueryBuilder.save({
                id: feedItem.id,
                title: feedItem?.title || feed.title || "",
                groupId: feedItem?.groupId || "",
            })
            return item;
        } else {
            return null
        }
    }

    static async removeFeed(id: string) {
        const feedQueryBuilder = await getFeedQueryBuilder();
        const deleteResult = await feedQueryBuilder.delete(id);
        return deleteResult;
    }

    static async insertFeed(feed: FeedListEntities): Promise<FeedListEntities> {
        return new Promise(async (resolve) => {
            const feedQueryBuilder = await getFeedQueryBuilder();
            const existingFeed = await feedQueryBuilder.findOne({
                where: {
                    link: feed.link,
                }
            });
            if (!existingFeed) {
                feedQueryBuilder.save(feed)
                    .then((saveRes) => {
                        console.log("导入Feed成功: ", JSON.stringify(saveRes))
                        resolve(saveRes)
                    })
            } else {
                resolve(existingFeed)
            }
        })
    }

}

export default FeedService;
