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


export const RIPCUpdateFeedList = (): Promise<RSSType[]> => {
    try {
        return window.IPC.invoke(IPCChannel.UpdateFeedList)
    } catch (err) {
        return Promise.resolve([])
    }
}

export const RIPCUpdateFeed = (item: { id: string } & Omit<Partial<FeedType>, "id">): Promise<FeedType | null> => {
    try {
        return window.IPC.invoke(IPCChannel.UpdateFeed, item)
    } catch (err) {
        return Promise.resolve(null)
    }

}

export const RIPCGetRSSList = (
    {
        feedId,
        pageNo,
        pageSize,
    }: {
        feedId: string
    } & PaginationType): Promise<RSSType[]> => {
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

// 新增分组
export const RIPCAddGroup = (group: Omit<GroupEntities, "id">): Promise<null> => {
    try {
        return window.IPC.invoke(IPCChannel.AddGroup, group)
    } catch (err) {
        return Promise.resolve(null)
    }
}

// 修改分组
export const RIPCUpdateGroup = (group: Partial<GroupType>): Promise<null> => {
    try {
        return window.IPC.invoke(IPCChannel.UpdateGroup, group)
    } catch (err) {
        return Promise.resolve(null)
    }
}

// 删除分组
export const RIPCDeleteGroup = (id: string): Promise<null> => {
    try {
        return window.IPC.invoke(IPCChannel.DeleteGroup, id)
    } catch (err) {
        return Promise.resolve(null)
    }
}

// 打开超链接
export const RIPCOpenUrl = (url: string): Promise<null> => {
    try {
        return window.IPC.invoke(IPCChannel.OpenUrlLocalBrowser, url)
    } catch (err) {
        return Promise.resolve(null)
    }
}

// 复制
export const RIPCCopy = (type: "image" | "text", content: string): Promise<null> => {
    try {
        return window.IPC.invoke(IPCChannel.CopyTextOrImage, {
            type, content
        })
    } catch (err) {
        return Promise.resolve(null)
    }
}

// 保存图片
export const RIPCSaveBase64Image = (base64Image: string): Promise<string> => {
    try {
        return window.IPC.invoke(IPCChannel.SaveImageByBase64, base64Image)
    } catch (err) {
        return Promise.resolve("")
    }
}

export interface SearchType {
     rss: RSSType[];
     feed: FeedType[];
}

// 搜索
export const RIPCSearch = (keyword: string): Promise<SearchType | null> => {
    try {
        return window.IPC.invoke(IPCChannel.Search, keyword)
    } catch (err) {
        return Promise.resolve(null)
    }
}
