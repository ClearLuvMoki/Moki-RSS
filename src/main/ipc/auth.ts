import Channels from "@/src/domains/channel";
import { ipcMain, shell } from "electron";
import logger from "../logger";

logger.info(`GITHUB_CLIENT_ID: ${process.env.GITHUB_CLIENT_ID}`);

const AuthIPC = () => {
  ipcMain.handle(Channels.AuthGithub, () => {
    const clinet_id = process.env.GITHUB_CLIENT_ID;
    const scope = "read:user user:email";
    const redirectUri =
      process.env.NODE_ENV === "production"
        ? "moki-rss://github-auth"
        : `http://localhost:${process.env.PORT}/github-auth`;
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clinet_id}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scope)}`;
    shell.openExternal(authUrl);
  });
};

export default AuthIPC;
