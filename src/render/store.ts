import Channels from "@/domains/channel";
import Inject from "@/render/inject";
import { create } from "zustand";
import type { ConfigType } from "../domains/types/config";
import type { FeedType } from "../domains/types/feed";
import type { RSSType } from "../domains/types/rss";

interface GlobalState {
  feedList: FeedType[];
  rssList: RSSType[];
  config: ConfigType | null;
  activeFeed: FeedType | null;
  updateActiveFeed: (feed: FeedType | null) => void;
  reloadFeed: () => void;
  reloadConfig: () => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  feedList: [],
  rssList: [],
  config: null,
  activeFeed: null,
  reloadConfig: () => {
    Inject.invoke<null, ConfigType>(Channels.GetConfig).then((res) => {
      set({ config: res });
    });
  },
  updateActiveFeed: (item) => {
    set({ activeFeed: item });
    Inject.invoke<{ id?: string }, RSSType[]>(Channels.GetRSSByFeedId, {
      id: item?.id,
    }).then((res) => {
      set({ rssList: res });
    });
  },
  reloadFeed: () => {
    Inject.invoke<null, FeedType[]>(Channels.AllFeed).then((res) => {
      set({ feedList: res });
    });
  },
}));
