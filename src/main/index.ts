import path from "node:path";
import DataBase from "@/database/index";
import { isDev } from "@/utils/tool";
import { init } from "@sentry/electron/main";
import to from "await-to-js";

import "./protocol";
import { BrowserWindow, app } from "electron";
import { FeedIPC, GroupIPC, OSIPC, RSSIPC } from "./ipc";
import { initStatistics } from "./statistics";

init({
  dsn: "https://c8638c9bb80e7df188e56a7735b33d5b@o4507683589062656.ingest.us.sentry.io/4510316783403008",
});

export let mainWindow: BrowserWindow | null = null;

const loadUrl: string = isDev
  ? `http://localhost:${process.env.PORT || 8089}`
  : `file://${path.resolve(__dirname, "../render/index.html")}`;

const initIpc = () => {
  FeedIPC();
  OSIPC();
  RSSIPC();
  GroupIPC();
  // AuthIPC();
};

const onCreateMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    minWidth: 1000,
    height: 900,
    minHeight: 700,
    frame: false,
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 15, y: 15 },
    icon: path.resolve(__dirname, "./icon.png"),
    webPreferences: {
      devTools: isDev,
      nodeIntegration: true,
      webSecurity: false,
      webviewTag: true,
      preload: path.resolve(__dirname, "./preload.js"),
    },
  });
  if (process.platform === "darwin") {
    app.dock?.setIcon(path.join(__dirname, "./icon.png"));
  }
  mainWindow.loadURL(loadUrl);
};

app.on("ready", async () => {
  if (!DataBase.isInitialized) {
    const [err] = await to(DataBase.initialize());
    if (err) {
      console.log("数据库已初始化失败：", err);
    } else {
      console.log("数据库已初始化成功!");
    }
  } else {
    console.log("数据库已初始化成功!");
  }
  initIpc();
  onCreateMainWindow();
  initStatistics();
});
