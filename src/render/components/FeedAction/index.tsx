import React, {memo} from 'react';
import deepEqual from "deep-equal";
import IconWrapper from "@render/components/IconWrapper";
import {Ellipsis} from "lucide-react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger,} from "@nextui-org/react"
import {FeedType} from "@src/types/feed";
import {RIPCRemoveFeed} from "@render/ripc";
import {toast} from "sonner";
import Store from "@render/store";
import FeedEditModal from "@render/components/FeedEditModal";
import {useSetState} from "ahooks";
import {useTranslation} from "react-i18next";

interface Props {
    item: FeedType;
}

const FeedAction = memo(({item}: Props) => {
    const {handleGetFeedList, handleGetGroupList} = Store;
    const { t } = useTranslation()
    const [editState, setEditState] = useSetState<{
        open: boolean;
        feedItem: FeedType | null;
    }>({
        open: false,
        feedItem: null
    })

    const handleAction = (key: string) => {
        switch (key) {
            case "edit": {
                return setEditState({
                    open: true,
                    feedItem: item
                })
            }
            case "delete": {
                return handleDelete();
            }
        }
    }

    const handleDelete = () => {
        RIPCRemoveFeed(item.id)
            .then(() => {
                toast.success("删除成功!");
                handleGetFeedList();
                handleGetGroupList();
            })
            .catch(() => {
                toast.error("删除失败!")
            })
    }

    return (
        <React.Fragment>
            <Dropdown
                placement="right-start"
            >
                <DropdownTrigger>
                    <span>
                        <IconWrapper className="!p-1">
                            <Ellipsis size={16}/>
                        </IconWrapper>
                    </span>
                </DropdownTrigger>
                <DropdownMenu
                    onAction={(key) => {
                        handleAction(key as string)
                    }}
                >
                    <DropdownItem key="edit">{t("action.edit")}</DropdownItem>
                    <DropdownItem key="delete" className="text-danger" color="danger">
                        {t("action.delete")}
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <FeedEditModal
                open={editState?.open}
                item={editState?.feedItem}
                onClose={() => {
                    setEditState({
                        open: false,
                        feedItem: null
                    })
                }}
            />
        </React.Fragment>
    );
}, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default FeedAction;
