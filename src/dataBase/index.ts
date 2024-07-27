import {join} from "path";
import {DataSource} from "typeorm";
import {app} from "electron";
import {RSSListEntities} from "@src/dataBase/entities/rss-list";
import {FeedListEntities} from "@src/dataBase/entities/feed";
import {GroupEntities} from "@src/dataBase/entities/group";
import {ConfigEntities} from "@src/dataBase/entities/config";


const dataBasePath = join(
    app.getPath("appData"),
    app.getName(),
    `./MokiRSSDatabase/index.db`
);

console.log("DataBase init path: ", dataBasePath)

const DataBase = new DataSource({
    type: "better-sqlite3",
    entities: [RSSListEntities, FeedListEntities, GroupEntities, ConfigEntities],
    database: dataBasePath,
    synchronize: true,
    logging: ["error"],
    nativeBinding: join(__dirname, "./better_sqlite3.node")
})


export default DataBase;
