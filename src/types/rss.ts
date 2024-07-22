export enum IPCChannel {
    "ParseRSS" = "notice:parse-rss",
    "GetFeedList" = "notice:get-feed-list",
    "GetRSSList" = "notice:get-rss-list",
    "UpdateFeed" = "notice:update-feed",
    "RemoveFeed" = "notice:remove-feed",
    "GetGroup" = "notice:get-group",
    "AddGroup" = "add:group",
}


export interface PaginationType {
    pageNo: number;
    pageSize: number;
}

export interface RSSType {
    id: string;
    feedId: string;
    rssId: string;
    rssLink: string;
    title: string;
    content: string;
    contentSnippet: string;
    summary: string;
    author: string;
    pubDate: string;
    isoDate: string;
    createDate: string;
}
