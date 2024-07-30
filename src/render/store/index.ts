import {action, makeAutoObservable, observable} from "mobx"
import {FeedType} from "@src/types/feed";
import {PaginationType, RSSType} from "@src/types/rss";
import {RIPCGetFeedList, RIPCGetGroup, RIPCGetRSSList, RIPCUpdateOSConfig} from "@render/ripc";
import {GroupType} from "@src/types/group";
import {DefaultValue, OSType} from "@src/types/os";
import {toast} from "sonner";
import i18n from '../i18n'


class _Store {
    constructor() {
        makeAutoObservable(this, {
            OSConfig: observable,
            updateOSConfig: action,
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
            groupModalState: observable,
            updateGroupModalState: action
        })
    }

    OSConfig: Partial<OSType> | null = null;
    updateOSConfig = (config: Partial<OSType> | null, isInit: boolean = false) => {
        this.OSConfig = {
            ...this.OSConfig,
            ...config,
        }
        i18n.changeLanguage(config?.locale || this.OSConfig.locale || DefaultValue.lang)
            .then(() => {
                if (!isInit) {
                    RIPCUpdateOSConfig({
                        ...(JSON.parse(JSON.stringify(this.OSConfig || {}))),
                        id: "1",
                    })
                        .then(() => {
                            toast.success(i18n.t("toast.success.update"))
                        })
                        .catch(() => {
                            toast.error(i18n.t("toast.failed.update"))
                        })
                }
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
            pageSize: this.paginationState.pageSize,
            pageNo: 1,
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

    groupModalState: { open: boolean; groupItem: GroupType | null } = {
        open: false,
        groupItem: null,
    }
    updateGroupModalState = (params: {
        open: boolean; groupItem: GroupType | null
    }) => {
        this.groupModalState = {
            ...this.groupModalState,
            ...params
        }
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
