import {Fragment, memo, useState} from 'react';
import deepEqual from "deep-equal";
import {Modal, ModalBody, ModalContent, ModalHeader, Tooltip} from "@nextui-org/react";
import {observer} from "mobx-react";
import Store from "@render/store";
import RSSDetail from "@render/components/RSSDetail";
import {Ellipsis, Globe} from "lucide-react";
import IconWrapper from "@render/components/IconWrapper";
import {useTranslation} from "react-i18next";
import ContextMenu, {ActionValueType} from "@render/components/ContextMenu";
import {RIPCCopy, RIPCOpenUrl} from "@render/ripc";
import {toast} from "sonner";
import WebviewWrapper from "@render/components/WebviewWrapper";


const RSSDetailModal = memo(observer(() => {
    const {rssDetailState, activeFeed, updateRSSDetailState} = Store;
    const {t} = useTranslation()
    const [isWeb, setIsWeb] = useState(false);

    const handleAction = (type: ActionValueType) => {
        switch (type) {
            case "copy-link": {
                return RIPCCopy("text", rssDetailState?.rssLink || "")
                    .then(() => {
                        toast.success(t("toast.success.copy"))
                    })
                    .catch(() => {
                        toast.error(t("toast.failed.copy"))
                    })
            }
            case "open-link": {
                return RIPCOpenUrl(rssDetailState?.rssLink || "")
            }
            default: {
                return
            }
        }
    }

    return (
        <Modal
            size={"4xl"}
            className="h-[calc(100%-100px)] !m-0"
            isOpen={Boolean(rssDetailState?.id)}
            onClose={() => {
                updateRSSDetailState(null)
            }}
            scrollBehavior={"inside"}
            hideCloseButton={true}
            motionProps={{
                variants: {
                    enter: {
                        y: 0,
                        opacity: 1,
                        transition: {
                            duration: 0.3,
                            ease: "easeOut",
                        },
                    },
                    exit: {
                        y: -20,
                        opacity: 0,
                        transition: {
                            duration: 0.2,
                            ease: "easeIn",
                        },
                    },
                }
            }}
        >
            <ModalContent>
                {
                    () => (
                        <Fragment>
                            <ModalHeader className="border-b border-b-gray-300 flex justify-between items-center">
                                <h1 className="text-lg">
                                    {activeFeed?.title}
                                    {rssDetailState?.author && <span
                                        className="text-sm font-medium text-gray-500">&nbsp;/&nbsp;{rssDetailState.author}</span>}
                                </h1>
                                <div className="flex items-center gap-2">
                                    <Tooltip
                                        showArrow={true}
                                        closeDelay={0}
                                        placement="bottom-end"
                                        color="foreground"
                                        content={t("action.open-source-web")}
                                    >
                                        <IconWrapper
                                            isActive={isWeb}
                                            onClick={() => setIsWeb(!isWeb)}
                                        ><Globe size={18}/></IconWrapper>
                                    </Tooltip>
                                    <ContextMenu
                                        triggerType={"click"}
                                        type="rss-detail"
                                        placement="bottom-end"
                                        showArrow={true}
                                        trigger={<IconWrapper
                                        ><Ellipsis size={18}/></IconWrapper>}
                                        onAction={(type) => {
                                            handleAction(type)
                                        }}
                                    />
                                </div>
                            </ModalHeader>
                            <ModalBody className="px-6 py-4">
                                {
                                    isWeb && (<WebviewWrapper
                                        src={rssDetailState?.rssLink || ""}
                                        classNames={{webview: "w-full h-full"}}
                                    />)
                                }
                                {
                                    !isWeb && (<RSSDetail detail={rssDetailState}/>)
                                }
                            </ModalBody>
                        </Fragment>
                    )
                }
            </ModalContent>
        </Modal>
    );
}), (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default RSSDetailModal;
