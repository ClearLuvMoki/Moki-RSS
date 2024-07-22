import {memo, useEffect} from 'react';
import deepEqual from "deep-equal";
import {observer} from "mobx-react";
import {Accordion, AccordionItem} from "@nextui-org/accordion";
import {
    Listbox,
    ListboxItem
} from "@nextui-org/react";
import Store from "@render/store";
import GroupModal from "@render/components/GroupModal";

const itemClasses = {
    base: "py-0 w-full",
    title: "font-normal text-medium",
    trigger: "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-[32px] flex items-center",
    indicator: "text-medium",
    content: "text-small px-2",
};

const SideBar = memo(observer(() => {
    const {feedList, activeFeed, groupList, handleGetFeedList, handleGetGroupList, updateActiveFeed} = Store;

    useEffect(() => {
        handleGetFeedList();
        handleGetGroupList();
    }, [])

    return (
        <div className={"w-[240px] h-full border-r border-r-gray-200 py-4 px-[10px]"}>
            <Accordion
                itemClasses={itemClasses}
                defaultExpandedKeys={["all"]}
            >
                <AccordionItem
                    key="all"
                    aria-label="所有订阅源" title="所有订阅源"
                >
                    <Listbox
                        variant="flat"
                    >
                        {
                            feedList.map(item => (
                                <ListboxItem
                                    className={item.id === activeFeed?.id ? "bg-default/40" : ""}
                                    key={item.id}
                                    onClick={() => {
                                        updateActiveFeed(item)
                                    }}
                                >
                                    {item.title}
                                </ListboxItem>
                            ))
                        }
                    </Listbox>
                </AccordionItem>

            </Accordion>
            <div className="px-4  my-4">
                <div className="flex  mb-2 justify-between">
                    <div className="text-lg font-bold">
                        分组
                    </div>
                    <GroupModal/>
                </div>
                {
                    groupList.length === 0 && (<div className=" select-none text-gray-400 text-sm">暂无分组</div>)
                }
            </div>

            <Accordion
                itemClasses={itemClasses}
                selectionMode="multiple"
                showDivider={false}
            >
                {
                    groupList.map(item => (
                        <AccordionItem
                            key={item.id}
                            title={item.name}
                        >
                            {
                                item.feedList && item.feedList.length > 0 ? (
                                    <Listbox
                                        variant="flat"
                                    >
                                        {
                                            (item.feedList || []).map(item => (
                                                <ListboxItem
                                                    className={item.id === activeFeed?.id ? "bg-default/40" : ""}
                                                    key={item.id}
                                                    onClick={() => {
                                                        updateActiveFeed(item)
                                                    }}
                                                >
                                                    {item.title}
                                                </ListboxItem>
                                            ))
                                        }
                                    </Listbox>
                                ) : <span className=" select-none text-gray-400 text-sm">暂无</span>
                            }
                        </AccordionItem>
                    ))
                }
            </Accordion>
        </div>
    );
}), (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default SideBar;
