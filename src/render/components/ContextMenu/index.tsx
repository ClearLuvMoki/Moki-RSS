import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import deepEqual from "deep-equal";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {Copy, ExternalLink, ImageDown, Images} from "lucide-react";
import {useTranslation} from "react-i18next";
import {OverlayPlacement} from "@nextui-org/aria-utils";


interface Props {
    trigger: React.ReactNode;
    type: "link" | "image" | 'rss-detail'
    triggerType?: "context" | "click";
    showArrow?: boolean;
    placement?: OverlayPlacement;
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

const RSSDetailActions: ActionType[] = [
    {label: "copy-link", value: "copy-link", icon: <Copy size={18}/>},
    {label: "open-link", value: "open-link", icon: <ExternalLink size={18}/>},
]

const ContextMenu = memo(({trigger, triggerType = "context", showArrow, placement, type, onAction}: Props) => {
    const [open, setOpen] = useState(false);
    const {t} = useTranslation();
    const ref = useRef<HTMLSpanElement>(null);
    const action = triggerType == "click" ? "onclick" : "oncontextmenu";

    useEffect(() => {
        if (ref.current && action) {
            ref.current[action] = () => {
                setOpen(true)
            }
        }
    }, [ref, action])


    const $action = useMemo(() => {
        switch (type) {
            case "image": {
                return ImageActions
            }
            case "link": {
                return LinkActions;
            }
            case "rss-detail": {
                return RSSDetailActions
            }
            default: {
                return []
            }
        }
    }, [type])

    return (
        <Dropdown showArrow={showArrow} placement={placement} isOpen={open} onClose={() => setOpen(false)}>
            <DropdownTrigger>
                <span ref={ref}>
                    {trigger}
                </span>
            </DropdownTrigger>
            <DropdownMenu
            >
                {
                    $action.map(item => (
                        <DropdownItem
                            startContent={item.icon}
                            onClick={() => {
                                onAction(item?.value)
                            }}
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

