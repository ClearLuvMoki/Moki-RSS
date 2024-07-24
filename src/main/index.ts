import {app, BrowserWindow} from 'electron';
import path from 'path';
import {isDev} from '@main/utils/tools';
import DataBase from "@src/dataBase";
import to from "await-to-js";
import RSSIpc from "@main/ipc/rss";
import FeedIpc from "@main/ipc/feed";
import GroupIpc from "@main/ipc/group";
import OSIpc from "@main/ipc/os";

let mainWindow: BrowserWindow | null = null;

const loadUrl: string = isDev
    ? `http://localhost:${process.env.PORT}`
    : `file://${path.resolve(__dirname, '../render/index.html')}`;

const initIpc = () => {
    RSSIpc();
    FeedIpc();
    GroupIpc();
    OSIpc();
}


const handleCreateMainWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1280,
        minWidth: 1280,
        height: 800,
        minHeight: 800,
        frame: false,
        titleBarStyle: "hiddenInset",
        trafficLightPosition: {x: 15, y: 15},
        icon: path.resolve(__dirname, "./icon.png"),
        webPreferences: {
            devTools: true,
            nodeIntegration: true,
            webSecurity: false,
            webviewTag: true,
            preload: path.resolve(__dirname, "./preload.js")
        },
    });
    if (process.platform === 'darwin') {
        app.dock.setIcon(path.join(__dirname, "./icon.png"));
    }
    mainWindow.loadURL(loadUrl);
};

app.on('ready', async () => {
    if (!DataBase.isInitialized) {
        const [err] = await to(DataBase.initialize());
        if (err) {
            console.log("数据库已初始化失败!")
        } else {
            console.log("数据库已初始化成功!")
        }
    } else {
        console.log("数据库已初始化成功!")
    }
    initIpc();
    handleCreateMainWindow();
});
