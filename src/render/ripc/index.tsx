import {IPCChannel, PaginationType, RSSType} from "@src/types/rss";
import {FeedType} from "@src/types/feed";
import {GroupType} from "@src/types/group";
import {GroupEntities} from "@src/dataBase/entities/group";

export const RIPCGetFeedList = (): Promise<FeedType[]> => {
    try {
        return window.IPC.invoke(IPCChannel.GetFeedList)
    } catch (err) {
        return Promise.resolve([])
    }

}

export const RIPCAddFeed = (url: string) => {
    try {
        return window.IPC.invoke(IPCChannel.ParseRSS, url)
    } catch (err) {
        return Promise.resolve(null)
    }
}

export const RIPCRemoveFeed = (id: string) => {
    try {
        return window.IPC.invoke(IPCChannel.RemoveFeed, id)
    } catch (err) {
        return Promise.resolve(null)
    }
}


export const RIPCUpdateFeed = (): Promise<RSSType[]> => {
    try {
        return window.IPC.invoke(IPCChannel.UpdateFeed)
    } catch (err) {
        return Promise.resolve([])
    }

}

export const RIPCGetRSSList = (
    {
        feedId,
        pageNo,
        pageSize,
    }: {
        feedId: string
    }& PaginationType): Promise<RSSType[]> => {
    try {
        return window.IPC.invoke(IPCChannel.GetRSSList, {
            feedId,
            pageNo,
            pageSize
        })
    } catch (err) {
        return Promise.resolve([])
    }

}

// 获取分组
export const RIPCGetGroup = (): Promise<GroupType[]> => {
     try {
        return window.IPC.invoke(IPCChannel.GetGroup)
    } catch (err) {
        return Promise.resolve([])
    }
}

// 获取分组
export const RIPCAddGroup = (group: Omit<GroupEntities, "id">): Promise<null> => {
     try {
        return window.IPC.invoke(IPCChannel.AddGroup, group)
    } catch (err) {
        return Promise.resolve(null)
    }
}
