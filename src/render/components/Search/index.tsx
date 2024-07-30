import {memo, useEffect, useRef, useState} from 'react';
import deepEqual from "deep-equal";
import {Input, Spinner, Tabs, Tab} from "@nextui-org/react";
import {Search as SearchIcon} from "lucide-react"
import {RIPCSearch, SearchType} from "@render/ripc";
import EmptyText from "@render/components/EmptyText";
import {observer} from "mobx-react";
import Store from "@render/store";
import {RSSType} from "@src/types/rss";
import {FeedType} from "@src/types/feed";
import {useTranslation} from "react-i18next";

const Search = memo(observer(() => {
    const {updateRSSDetailState, updateActiveFeed} = Store;
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState("");
    const [searchRes, setSearchRes] = useState<SearchType | null>(null)

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(event.target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false)
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = () => {
        setLoading(true);
        RIPCSearch(value)
            .then((res) => {
                setSearchRes(res)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleClickRSS = (item: RSSType) => {
        updateRSSDetailState(item);
        setOpen(false)
    }

    const handleClickFeed = (item: FeedType) => {
        updateActiveFeed(item);
        setOpen(false)
    }

    return (
        <div
            style={{
                // @ts-ignore
                WebkitAppRegion: "no-drag",
                width: "300px",
                position: 'relative',
                marginRight: 4
            }}
        >
            <Input
                ref={inputRef}
                size="sm"
                placeholder={t("search.placeholder")}
                startContent={<SearchIcon className="text-default-300"/>}
                onFocus={() => setOpen(true)}
                value={value}
                onValueChange={setValue}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        handleSearch()
                    }
                }}
            />
            <div
                ref={dropdownRef}
                style={{
                    color: "#919191",
                    position: 'absolute',
                    width: open ? "300px" : 0,
                    maxHeight: open ? "400px" : 0,
                    transition: "all .3s",
                    display: open ? "block" : "none",
                    boxShadow: "#919191 0px 0px 10px",
                }}
                className="light:bg-white dark:bg-[#18181B] rounded-lg z-10 top-[40px] py-2"
            >
                <Tabs variant={"underlined"} aria-label="Tabs variants">
                    <Tab key="RSS" title="RSS">
                        <div className="max-h-[330px] overflow-y-scroll">
                            <div className="px-2">
                                {loading && <Spinner color="default" size="sm"/>}
                                {!loading && (searchRes?.rss?.length == 0 || !searchRes?.rss) && <EmptyText/>}
                            </div>
                            {
                                !loading && searchRes?.rss && searchRes.rss.map(item => {
                                    const index = (item?.title).indexOf(value);
                                    const beforeStr = item?.title.substring(0, index);
                                    const afterStr = item?.title.slice(index + value.length);
                                    return <div
                                        onClick={() => handleClickRSS(item)}
                                        key={item.id}
                                        className='rounded-lg mb-2 light:hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all px-2 py-1'
                                    >
                                        <div className='text-sm light:text-black dark:text-white'>
                                            {index > -1 ? (
                                                <span>
                                                    {beforeStr}
                                                    <span className="text-yellow-500">{value}</span>
                                                    {afterStr}
                                                </span>
                                            ) : (<span>{item.title}</span>)}
                                        </div>
                                        <div className='text-xs line-clamp-2'>{item.contentSnippet}</div>
                                    </div>
                                })
                            }
                        </div>
                    </Tab>
                    <Tab key="Feed" title="Feed">
                        <div className="max-h-[330px] overflow-y-scroll">
                            <div className="px-2">
                                {loading && <Spinner color="default" size="sm"/>}
                                {!loading && (searchRes?.feed?.length == 0 || !searchRes?.feed) && <EmptyText/>}
                            </div>
                            {
                                !loading && searchRes?.feed && searchRes.feed.map(item => {
                                    const titleIndex = (item?.title).indexOf(value);
                                    const beforeTitleStr = item?.title.substring(0, titleIndex);
                                    const afterTitleStr = item?.title.slice(titleIndex + value.length);

                                    const urlIndex = (item?.feedUrl).indexOf(value);
                                    const beforeUrlStr = item?.feedUrl.substring(0, urlIndex);
                                    const afterUrlStr = item?.feedUrl.slice(urlIndex + value.length);
                                    return <div
                                        onClick={() => handleClickFeed(item)}
                                        key={item.id}
                                        className='rounded-lg mb-2 light:hover:bg-gray-100 dark:hover:bg-gray-800  cursor-pointer transition-all px-2 py-1'
                                    >
                                        <div className='text-sm light:text-black dark:text-white'>
                                            {titleIndex > -1 ? (
                                                <span>
                                                    {beforeTitleStr}
                                                    <span className="text-yellow-500">{value}</span>
                                                    {afterTitleStr}
                                                </span>
                                            ) : (<span>{item.title}</span>)}
                                        </div>
                                        <div className='text-xs line-clamp-2'>
                                             {urlIndex > -1 ? (
                                                <span>
                                                    {beforeUrlStr}
                                                    <span className="text-yellow-500">{value}</span>
                                                    {afterUrlStr}
                                                </span>
                                            ) : (<span>{item.feedUrl}</span>)}
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}), (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default Search;
