import React, {memo, useState} from 'react';
import deepEqual from "deep-equal";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {Copy, ExternalLink, ImageDown, Images} from "lucide-react";


interface Props {
    trigger: React.ReactNode;
    type: "link" | "image";
    onAction: (action: ActionValueType) => void;
}

export type ActionValueType = "copy-link" | "open-link" | "copy-image" | "save-image";

interface ActionType {
    label: string,
    value: ActionValueType;
    icon: React.ReactNode;
}

const LinkActions: ActionType[] = [
    {label: "复制链接", value: "copy-link", icon: <Copy size={18}/>},
    {label: "打开链接", value: "open-link", icon: <ExternalLink size={18}/>}
]

const ImageActions: ActionType[] = [
    {label: "复制链接", value: "copy-link", icon: <Copy size={18}/>},
    {label: "打开链接", value: "open-link", icon: <ExternalLink size={18}/>},
    {label: "保存图片", value: "save-image", icon: <ImageDown size={18}/>},
    {label: "复制图片", value: "copy-image", icon: <Images size={18}/>}
]

const ContextMenu = memo(({trigger, type, onAction}: Props) => {
    const [open, setOpen] = useState(false);
    return (
        <Dropdown isOpen={open} onClose={() => setOpen(false)}>
            <DropdownTrigger>
                <span onContextMenu={() => setOpen(true)}>
                    {trigger}
                </span>
            </DropdownTrigger>
            <DropdownMenu
                onAction={(key) => onAction(key as any)}
            >
                {
                    ((type === "image" ? ImageActions : LinkActions) || []).map(item => (
                        <DropdownItem
                            startContent={item.icon}
                            key={item.value}>{item.label}</DropdownItem>
                    ))
                }
            </DropdownMenu>
        </Dropdown>
    );
}, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default ContextMenu;

