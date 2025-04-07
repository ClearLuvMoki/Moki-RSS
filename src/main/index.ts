import path from "node:path";
import DataBase from "@/database/index";
import { isDev } from "@/utils/tool";
import to from "await-to-js";
import { BrowserWindow, app } from "electron";
import { FeedIPC, OSIPC } from "./ipc";

export let mainWindow: BrowserWindow | null = null;

const loadUrl: string = isDev
  ? `http://localhost:${process.env.PORT || 8088}`
  : `file://${path.resolve(__dirname, "../render/index.html")}`;

const initIpc = () => {
  FeedIPC();
  OSIPC();
};

const onCreateMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    minWidth: 1000,
    height: 700,
    minHeight: 700,
    frame: false,
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 15, y: 15 },
    icon: path.resolve(__dirname, "./icon.png"),
    webPreferences: {
      devTools: true,
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
});
