import {memo} from 'react';
import deepEqual from "deep-equal";
import Store from "@render/store";
import {observer} from "mobx-react";
import {RSSType} from "@src/types/rss";
import {Image, Spinner} from "@nextui-org/react";
import {FeedType} from "@src/types/feed";
import {Rss} from "lucide-react";

const CompactItem = memo(({item, feed, onClick}: { feed: FeedType | null, item: RSSType, onClick: VoidFunction }) => {
    return (
        <div className="w-full select-none cursor-pointer text-sm border-b border-b-gray-300 py-1 flex items-center"
             onClick={onClick}
        >
            <div className="inline-flex items-center">
                {
                    (feed?.avatarBase64 || feed?.avatar) ? <Image
                            src={feed?.avatarBase64 || feed.avatar}
                            className="w-4 min-w-4 h-4"/> :
                        <Rss className="w-4 min-w-4 w-4"/>
                }
                <span className="mx-2 text-xs">{feed?.title}</span>
            </div>
            <div className="flex-1 line-clamp-1 ">
                <span className="font-bold">{item.title}</span>
                <span className="ml-2 text-gray-400">{item.contentSnippet}</span>
            </div>
        </div>
    )
}, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
})

const Compact = memo(observer(() => {
    const {activeFeed, rssList, updateRSSDetailState, rssListLoading, paginationState, updatePaginationState} = Store;

    return (
        <div
            className="w-full h-full overflow-y-scroll flex flex-col items-center p-2"
            onScroll={(event) => {
                const {scrollTop, clientHeight, scrollHeight} = event.target as any;
                if (scrollTop + clientHeight === scrollHeight) {
                    updatePaginationState({
                        pageNo: paginationState.pageNo + 1
                    })
                }
            }}
        >
            {
                rssList.map(item => (
                    <CompactItem feed={activeFeed} item={item} onClick={() => updateRSSDetailState(item)}
                                 key={item.id}/>
                ))
            }
            {
                rssListLoading &&
                <div className="w-full flex justify-center items-center"><Spinner color="default"/></div>
            }

        </div>
    );
}), (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default Compact;
