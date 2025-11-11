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

  ipcMain.handle(Channels.SearchFeed, async (_, { feedId }: { feedId: string }) => {
    if (!feedId) return null;
    return FeedServer.getFeedByID(feedId);
  });

  ipcMain.handle(
    Channels.InsertFeed,
    async (
      _,
      {
        url,
        feedXml,
        originXml,
        faviconUrl,
        faviconBase64,
      }: {
        url: string;
        feedXml: string;
        originXml: string;
        faviconUrl: string;
        faviconBase64: string;
      },
    ) => {
      return FeedServer.insertFeed({
        url,
        feedXml,
        originXml,
        faviconUrl,
        faviconBase64,
      });
    },
  );
};

export default FeedIPC;
