import {action, makeAutoObservable, observable} from "mobx"
import {FeedType} from "@src/types/feed";
import {PaginationType, RSSType} from "@src/types/rss";
import {RIPCGetFeedList, RIPCGetGroup, RIPCGetRSSList} from "@render/ripc";
import {GroupType} from "@src/types/group";


class _Store {
    constructor() {
        makeAutoObservable(this, {
            isSideBarCollapsed: observable,
            updateSideBarCollapsed: action,
            feedList: observable,
            updateFeedList: action,
            activeFeed: observable,
            updateActiveFeed: action,
            rssListLoading: observable,
            updateRssListLoading: action,
            rssList: observable,
            updateRSSList: action,
            handleGetFeedList: action,
            rssDetailState: observable,
            updateRSSDetailState: action,
            paginationState: observable,
            updatePaginationState: action,
            groupList: observable,
            updateGroupList: action,
        })
    }


    isSideBarCollapsed: boolean = true;
    updateSideBarCollapsed = (isCollapsed: boolean) => {
        this.isSideBarCollapsed = isCollapsed;
    }

    activeFeed: FeedType | null = null;
    updateActiveFeed = (item: FeedType | null) => {
        if (item?.id === this.activeFeed?.id) return;
        this.activeFeed = item;
        this.paginationState = {
            pageNo: 1,
            pageSize: 10
        }
        this.updateRSSList([])
        this.handleGetRSSList();
    }

    feedList: FeedType[] = [];
    updateFeedList = (list: FeedType[]) => {
        this.feedList = list;
        if (!this.activeFeed) {
            this.updateActiveFeed(list[0])
        }
    }

    paginationState: PaginationType = {
        pageNo: 1,
        pageSize: 10
    }
    updatePaginationState = (paginationState: Partial<PaginationType>) => {
        this.paginationState = {
            ...this.paginationState,
            ...paginationState
        }
        this.handleGetRSSList()
    }

    rssListLoading: boolean = false;
    updateRssListLoading = (loading: boolean) => {
        this.rssListLoading = loading
    }
    rssList: RSSType[] = [];
    updateRSSList = (list: RSSType[]) => {
        this.rssList = list;
    }

    rssDetailState: RSSType | null = null;

    updateRSSDetailState = (item: RSSType | null) => {
        this.rssDetailState = item
    }

    groupList: GroupType[] = [];
    updateGroupList = (list: GroupType[]) => {
        this.groupList = list;
    }

    handleGetFeedList = () => {
        RIPCGetFeedList()
            .then((res) => {
                this.updateFeedList(res)
            })
    }

    handleGetGroupList = () => {
        RIPCGetGroup()
            .then((res) => {
                this.updateGroupList(res)
            })
    }


    handleGetRSSList = () => {
        if (this.activeFeed?.id) {
            this.rssListLoading = true;
            RIPCGetRSSList({
                feedId: this.activeFeed?.id,
                ...this.paginationState
            })
                .then((res) => {
                    if (!res || res.length === 0) {
                        this.paginationState = {
                            pageNo: this.paginationState?.pageNo > 1 ? this.paginationState?.pageNo - 1 : 1,
                            pageSize: 10
                        }
                    }
                    this.updateRSSList([...this.rssList].concat(res || []))
                })
                .then(() => {
                    this.rssListLoading = false;
                })
        }
    }


}

const Store = new _Store()
export default Store;
