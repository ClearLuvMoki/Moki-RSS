import React, {memo} from 'react';
import deepEqual from "deep-equal";
import {Settings} from "lucide-react";
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@nextui-org/react";
import Store from "@render/store";
import {GroupType} from "@src/types/group";
import {RIPCDeleteGroup} from "@render/ripc";
import {toast} from "sonner";
import {useTranslation} from "react-i18next";

interface Props {
    groupItem: GroupType;
}

const GroupAction = memo(({groupItem}: Props) => {
    const {updateGroupModalState, handleGetGroupList} = Store;
    const {t} = useTranslation();

    const handleAction = (key: string) => {
        switch (key) {
            case "edit": {
                return updateGroupModalState({
                    open: true,
                    groupItem: groupItem
                })
            }
            case "delete": {
                return handleDelete();
            }
        }
    }

    const handleDelete = () => {
        RIPCDeleteGroup(groupItem?.id)
            .then(() => {
                handleGetGroupList();
                toast.success(t('toast.success.delete'))
            })
            .catch(() => {
                toast.error(t('toast.failed.delete'))
            })
    }


    return (
        <React.Fragment>
            <Dropdown placement="right-start">
                <DropdownTrigger>
                    <Settings size={16}/>
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
        </React.Fragment>
    );
}, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default GroupAction;
