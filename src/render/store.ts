import Channels from "@/domains/channel";
import Inject from "@/render/inject";
import { create } from "zustand";
import { type ConfigType, LocaleEnum } from "../domains/types/config";
import type { FeedType } from "../domains/types/feed";
import type { RSSType } from "../domains/types/rss";
import i18n from "./i18n";

interface GlobalState {
  feedList: FeedType[];
  rssList: RSSType[];
  rssDetail: RSSType | null;
  pageNo: number;
  config: ConfigType | null;
  activeFeed: FeedType | null;
  updateRSSDetail: (detail: RSSType | null) => void;
  updateActiveFeed: (feed: FeedType | null) => void;
  nextPage: () => void;
  reloadFeed: () => void;
  reloadConfig: () => void;
  addFeed: (url: string) => Promise<FeedType>;
}

export const useGlobalStore = create<GlobalState>((set, get) => ({
  feedList: [],
  rssList: [],
  rssDetail: null,
  config: null,
  pageNo: 1,
  activeFeed: null,
  nextPage: () => {
    const nextPage = get().pageNo + 1;
    const preList = get().rssList || [];
    set({
      pageNo: nextPage,
    });
    if (get().activeFeed?.id) {
      Inject.invoke<{ id?: string; pageNo: number }, RSSType[]>(Channels.GetRSSByFeedId, {
        id: get().activeFeed?.id,
        pageNo: nextPage,
      }).then((res) => {
        set({ rssList: [...preList].concat(res) });
      });
    }
  },
  updateRSSDetail: (detail: RSSType | null) => {
    set({ rssDetail: detail });
  },
  reloadConfig: () => {
    Inject.invoke<null, ConfigType>(Channels.GetConfig).then((res) => {
      set({ config: res });
      i18n.changeLanguage(res.locale || LocaleEnum.English);
      const theme = res?.theme;
      const root = document.documentElement;
      switch (theme) {
        case "dark": {
          root.classList.remove("light");
          root.classList.add("dark");
          break;
        }
        case "light": {
          root.classList.remove("dark");
          root.classList.add("light");
          break;
        }
        case "system": {
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          root.classList.toggle("dark", prefersDark);
          break;
        }
      }
    });
  },
  updateActiveFeed: (item) => {
    set({ activeFeed: item, pageNo: 1 });
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
  addFeed: (url: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!url || !url.startsWith("http")) {
          return reject("保存Feed详情失败,URL异常!");
        }
        const urlObj = new URL(url);
        const host = `${urlObj.protocol}//${urlObj.host}`;
        const faviconUrl = `${host}/favicon.ico`;
        const fetchProps: RequestInit = {
          credentials: "omit",
          method: "get",
        };
        Promise.allSettled([
          fetch(url, fetchProps).then((res) => res.text()),
          fetch(host, fetchProps).then((res) => res.text()),
          fetch(faviconUrl, fetchProps).then((res) => res.arrayBuffer()),
        ]).then(async (res) => {
          const feedXml = res?.[0]?.status === "fulfilled" ? res?.[0]?.value : "";
          const originXml = res?.[1]?.status === "fulfilled" ? res?.[1]?.value : "";
          const faviconRes = res?.[2]?.status === "fulfilled" ? res?.[2]?.value : "";
          let faviconBase64 = "";
          let isValidateFavicon = false;
          const result = await fetch(faviconUrl, {
            credentials: "omit",
            method: "get",
          });
          if (
            result.status === 200 &&
            result.headers.has("Content-Type") &&
            result.headers.get("Content-Type")?.startsWith("image")
          ) {
            isValidateFavicon = true;
          }
          if (isValidateFavicon && faviconRes) {
            const bytes = new Uint8Array(faviconRes);
            let binary = "";
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            const base64 = btoa(binary);
            const mimeType = "image/png";
            faviconBase64 = base64 ? `data:${mimeType};base64,${base64}` : "";
          }
          return Inject.invoke<
            {
              url: string;
              feedXml: string;
              originXml: string;
              faviconUrl: string;
              faviconBase64: string;
            },
            FeedType
          >(Channels.InsertFeed, {
            url,
            feedXml,
            originXml,
            faviconUrl: isValidateFavicon ? faviconUrl : "",
            faviconBase64: isValidateFavicon && faviconBase64 ? faviconBase64 : "",
          })
            .then(resolve)
            .catch(reject);
        });
      } catch (err) {
        console.log(`解析URL失败：${err}`);
        reject(err);
      }
    });
  },
}));
