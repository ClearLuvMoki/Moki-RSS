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

interface Props {
    groupItem: GroupType;
}

const GroupAction = memo(({groupItem}: Props) => {
    const {updateGroupModalState, handleGetGroupList} = Store;

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
                toast.success("删除成功!")
            })
            .catch(() => {
                toast.error("删除失败!")
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
                    <DropdownItem key="edit">编辑</DropdownItem>
                    <DropdownItem key="delete" className="text-danger" color="danger">
                        删除
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
}, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default GroupAction;
