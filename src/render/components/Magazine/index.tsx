import {memo} from "react";
import deepEqual from "deep-equal";
import Store from "@render/store";
import {RSSType} from "@src/types/rss";
import {observer} from "mobx-react";
import Dayjs from "dayjs"
import {Spinner} from "@nextui-org/react";

const MagazineItem = memo(({item, onClick}: { item: RSSType, onClick: VoidFunction }) => {
    return (
        <div
            className="w-9/12 pb-4 px-1 border-b border-b-gray-300 mb-4"
            onClick={onClick}
        >
            <h1 className="text-lg font-bold">{item.title}</h1>
            <div className="mt-2 text-sm text-gray-600 line-clamp-2">{item.contentSnippet}</div>
            <div className="mt-2 flex justify-between text-xs text-gray-600">
                <span>{item.author}</span>
                <span>{Dayjs(item.isoDate).format("YYYY-MM-DD")}</span>
            </div>
        </div>
    )
}, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
})


const Magazine = memo(observer(() => {
    const {rssList, updateRSSDetailState, rssListLoading, paginationState, updatePaginationState} = Store;

    return (
        <div
            className="w-full h-full overflow-y-scroll flex flex-col items-center py-4"
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
                    <MagazineItem onClick={() => updateRSSDetailState(item)} item={item} key={item.id}/>
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

export default Magazine;
