export interface FeedType {
    id: string;
    title: string;
    avatar: string;
    link: string;
    feedUrl: string;
    lastBuildDate: string;
    groupId: string;
    createDate: string;
}

export type FeedMenuType = "move-to" | "delete"
