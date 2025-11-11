import Channels from "@/domains/channel";
import OSServer from "@/src/database/server/os";
import type { ConfigType } from "@/src/domains/types/config";
import { ipcMain, shell } from "electron";

const OSIPC = () => {
  ipcMain.handle(Channels.GetConfig, () => {
    return OSServer.getConfig();
  });

  ipcMain.handle(Channels.UpdateConfig, (_, { config }: { config: Partial<ConfigType> }) => {
    return OSServer.updateConfig(config);
  });

  ipcMain.handle(Channels.OpenLocalBrowser, (_, { url }: { url: string }) => {
    if (!url) return Promise.reject(new Error("url is required"));
    return shell.openExternal(url);
  });
};

export default OSIPC;
