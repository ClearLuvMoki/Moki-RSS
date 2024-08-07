import {memo} from 'react';
import deepEqual from "deep-equal";
import {observer} from "mobx-react";
import {Accordion, AccordionItem} from "@nextui-org/accordion";
import {
    Listbox,
    ListboxItem, Tooltip, Image
} from "@nextui-org/react";
import Store from "@render/store";
import FeedAction from "@render/components/FeedAction";
import GroupAction from "@render/components/GroupAction";
import IconWrapper from "@render/components/IconWrapper";
import {ListPlus, Rss} from "lucide-react";
import {useTranslation} from "react-i18next";

const itemClasses = {
    base: "py-0 w-full",
    title: "font-bold text-lg",
    trigger: "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-[32px] flex items-center",
    indicator: "text-medium",
    content: "text-small px-2",
};

const SideBar = memo(observer(() => {
    const {t} = useTranslation();

    const {
        feedList,
        activeFeed,
        groupList,
        updateGroupModalState,
        updateActiveFeed
    } = Store;

    return (
        <div className={"w-[240px] h-full border-r py-4 px-[10px] light:border-r-gray-200 dark:border-r-gray-600"}>
            <Accordion
                itemClasses={itemClasses}
                defaultExpandedKeys={["all"]}
            >
                <AccordionItem
                    key="all"
                    aria-label={t("feed.all-feed")} title={t("feed.all-feed")}
                >
                    <Listbox
                        variant="flat"
                    >
                        {
                            feedList.filter(item => !item.groupId).map(item => (
                                <ListboxItem
                                    className={item.id === activeFeed?.id ? "bg-default/40 h-[36px]" : "h-[36px]"}
                                    key={item.id}
                                    onClick={() => {
                                        updateActiveFeed(item)
                                    }}
                                    startContent={(item?.avatarBase64 || item?.avatar) ? <Image
                                            src={item?.avatarBase64 || item.avatar}
                                            className="w-4 min-w-4 h-4"/> :
                                        <Rss className="w-4 min-w-4 w-4"/>
                                    }
                                    endContent={item.id === activeFeed?.id ?
                                        <FeedAction item={item}/> : null
                                    }
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
                        {t("group.index")}
                    </div>
                    <Tooltip placement="bottom" showArrow={true} color="foreground" closeDelay={0}
                             content={t("group.create")}>
                        <IconWrapper
                            onClick={() => {
                                updateGroupModalState({
                                    open: true,
                                    groupItem: null
                                })
                            }}
                        >
                            <ListPlus size={16}/>
                        </IconWrapper>
                    </Tooltip>
                </div>
                {
                    groupList.length === 0 && (
                        <div className=" select-none text-gray-400 text-sm">{t("empty.group")}</div>)
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
                            indicator={
                                <GroupAction
                                    groupItem={item}
                                />
                            }
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
                                                    startContent={(item?.avatarBase64 || item?.avatar) ? <Image
                                                            src={item?.avatarBase64 || item.avatar}
                                                            className="w-4 min-w-4 h-4"/> :
                                                        <Rss className="w-4 min-w-4 w-4"/>
                                                    }
                                                    endContent={item.id === activeFeed?.id ?
                                                        <FeedAction item={item}/> : null
                                                    }
                                                >
                                                    {item.title}
                                                </ListboxItem>
                                            ))
                                        }
                                    </Listbox>
                                ) : <span className=" select-none text-gray-400 text-sm">{t('empty.index')}</span>
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
