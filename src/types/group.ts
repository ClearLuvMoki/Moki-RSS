import {FeedType} from "@src/types/feed";

export interface GroupType {
    id: string;
    name: string;
    description?: string;
    feedList?: FeedType[];
}
