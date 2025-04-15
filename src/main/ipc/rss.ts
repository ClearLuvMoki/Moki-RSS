import { RSSServer } from "@/database/server";
import Channels from "@/domains/channel";
import { ipcMain } from "electron";

const RSSIPC = () => {
  ipcMain.handle(
    Channels.GetRSSByFeedId,
    async (
      _,
      data: {
        id: string;
        pageNo?: number;
        pageSize?: number;
      },
    ) => {
      const list = await RSSServer.getRSSByFeedId(data);
      return ((list || []) as any[]).map((item: any) => {
        return {
          ...item,
          images: JSON.parse(item?.images || "[]"),
          mediaContent: JSON.parse(item?.mediaContent || "[]"),
        };
      });
    },
  );

  ipcMain.handle(
    Channels.SearchRSS,
    async (
      _,
      {
        keyword,
      }: {
        keyword: string;
      },
    ) => {
      const list = await RSSServer.getRSSByKeyword(keyword);
      return ((list || []) as any[]).map((item: any) => {
        return {
          ...item,
          images: JSON.parse(item?.images || "[]"),
          mediaContent: JSON.parse(item?.mediaContent || "[]"),
        };
      });
    },
  );
};

export default RSSIPC;
