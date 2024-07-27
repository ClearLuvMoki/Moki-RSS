import React, {memo, useState} from 'react';
import deepEqual from "deep-equal";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {Copy, ExternalLink, ImageDown, Images} from "lucide-react";
import {useTranslation} from "react-i18next";


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
    {label: "copy-link", value: "copy-link", icon: <Copy size={18}/>},
    {label: "open-link", value: "open-link", icon: <ExternalLink size={18}/>}
]

const ImageActions: ActionType[] = [
    {label: "copy-link", value: "copy-link", icon: <Copy size={18}/>},
    {label: "open-link", value: "open-link", icon: <ExternalLink size={18}/>},
    {label: "save-img", value: "save-image", icon: <ImageDown size={18}/>},
    {label: "copy-img", value: "copy-image", icon: <Images size={18}/>}
]

const ContextMenu = memo(({trigger, type, onAction}: Props) => {
    const [open, setOpen] = useState(false);
    const {t} = useTranslation()
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
                            key={item.value}>{t(`action.${item.label}`)}</DropdownItem>
                    ))
                }
            </DropdownMenu>
        </Dropdown>
    );
}, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default ContextMenu;

