import Database from "@src/dataBase";
import {RSSListEntities} from "@src/dataBase/entities/rss-list";
import {PaginationType} from "@src/types/rss";
import {getFeedQueryBuilder} from "@src/dataBase/server/feed";

const getRSSListQueryBuilder = async () => {
    return Database.getRepository(RSSListEntities)
};

class RSSListService {

    static async getALLRSSListByFeed({feedId, pageNo = 1, pageSize = 10}: {
        feedId: string;
    } & PaginationType) {
        const rssQueryBuilder = await getRSSListQueryBuilder();
        const list = await rssQueryBuilder.find({
            where: {
                feedId: feedId,
            },
            skip: (pageNo - 1) * pageSize,
            take: pageSize,
            order: {
                isoDate: "desc"
            }
        })
        return list;
    }

    static async searchRSS(keyword: string) {
        return new Promise(async (resolve) => {
            if(!keyword) return resolve(null)
            const rssQueryBuilder = await getRSSListQueryBuilder();
            const feedQueryBuilder = await getFeedQueryBuilder();
            const rssList  = await rssQueryBuilder.createQueryBuilder('rss')
                .where('rss.title LIKE :keyword', { keyword: `%${keyword}%` })
                .orWhere('rss.content LIKE :keyword', { keyword: `%${keyword}%` })
                .getMany()
            const feedList = await feedQueryBuilder.createQueryBuilder('feed')
                .where('feed.title LIKE :keyword', { keyword: `%${keyword}%` })
                .orWhere('feed.feedUrl LIKE :keyword', { keyword: `%${keyword}%` })
                .getMany()
            return resolve({
                rss: rssList || [],
                feed: feedList || []
            })
        })
    }


    static async insertRSS(rss: RSSListEntities) {
        return new Promise(async (resolve) => {
            const rssQueryBuilder = await getRSSListQueryBuilder();
            const existingRss = await rssQueryBuilder.findOne({
                where: {
                    rssId: rss.rssId,
                    feedId: rss.feedId
                }
            });
            if (!existingRss) {
                rssQueryBuilder.save(rss)
                    .then((saveRes) => {
                        console.log("导入RSS成功: ", JSON.stringify(saveRes))
                        resolve(saveRes)
                    })
            } else {
                resolve(existingRss)
            }
        })
    }

}

export default RSSListService;
