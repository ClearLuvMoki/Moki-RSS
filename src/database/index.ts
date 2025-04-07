import { join } from "node:path";
import { app } from "electron";
import { DataSource } from "typeorm";
import { ConfigEntities, FeedListEntities } from "./entities";

const DatabasePath = join(app.getPath("appData"), app.getName(), "./MokiRSSDatabase/index.db");

console.log("Database init path: ", DatabasePath);

const Database = new DataSource({
  type: "better-sqlite3",
  entities: [FeedListEntities, ConfigEntities],
  database: DatabasePath,
  synchronize: true,
  logging: ["error"],
  nativeBinding: join(__dirname, "./better_sqlite3.node"),
});

export default Database;
