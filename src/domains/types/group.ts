import type { FeedType } from "./feed";

export interface GroupType {
  id: string;
  name: string;
  description?: string;
  feeds?: FeedType[];
}
