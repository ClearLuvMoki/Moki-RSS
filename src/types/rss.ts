export enum IPCChannel {
    "ParseRSS" = "notice:parse-rss",
    "GetFeedList" = "notice:get-feed-list",
    "GetRSSList" = "notice:get-rss-list",
    "UpdateFeedList" = "notice:update-feed-list",
    "UpdateFeed" = "notice:update-feed-item",
    "RemoveFeed" = "notice:remove-feed",
    "GetGroup" = "notice:get-group",
    "AddGroup" = "notice:add-group",
    "UpdateGroup" = "notice:update-group",
    "DeleteGroup" = "notice:delete-group",
    "OpenUrlLocalBrowser" = "os:open-url-local-browser",
    "CopyTextOrImage" = "os:copy",
    "SaveImageByBase64" = "os:save-image-base-64",
    "Search" = "os:search",
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
