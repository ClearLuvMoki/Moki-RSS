import Database from "@src/dataBase";
import {ConfigEntities} from "@src/dataBase/entities/config";

const getOSQueryBuilder = async () => {
    return Database.getRepository(ConfigEntities)
};


class OSService {
     static async getConfig() {
        return new Promise(async (resolve) => {
            const osQueryBuilder = await getOSQueryBuilder();
            const data = await osQueryBuilder.findOne({
                where: {
                    id: '1'
                }
            })
            resolve(data);
        })
    }
    static async updateConfig(config: ConfigEntities) {
        return new Promise(async (resolve, reject) => {
            const osQueryBuilder = await getOSQueryBuilder();
            return osQueryBuilder.save(config).then(resolve).catch(reject)
        })
    }
}

export default OSService;
