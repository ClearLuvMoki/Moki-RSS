import { FeedServer } from "@/database/server";
import Channels from "@/domains/channel";
import { ipcMain } from "electron";

const FeedIPC = () => {
  ipcMain.handle(Channels.AllFeed, async () => {
    const list = await FeedServer.allFeeds();
    return list || [];
  });

  ipcMain.handle(Channels.RemoveFeed, async (_, { id }: { id: string }) => {
    return FeedServer.removeFeedByID(id);
  });

  ipcMain.handle(Channels.InsertFeed, async (_, { url }: { url: string }) => {
    return FeedServer.insertFeed(url);
  });
};

export default FeedIPC;
