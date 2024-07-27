import {Fragment, memo} from 'react';
import deepEqual from "deep-equal";
import {Modal, ModalBody, ModalContent, ModalHeader, Tab, Tabs} from "@nextui-org/react";
import FeedContent from "./content/FeedContent";
import {useTranslation} from "react-i18next";
import PreferencesContent from "@render/components/SettingModal/content/PreferencesContent";
import {observer} from "mobx-react";

interface Props {
    open: boolean;
    onClose: VoidFunction;
}

const SettingModal = memo(observer(({open, onClose}: Props) => {
    const { t } = useTranslation();

    return (
        <Modal
            size={"2xl"}
            isOpen={open}
            onClose={onClose}
            className="h-[calc(100%-100px)] !m-0"
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
                {() => (
                    <Fragment>
                        <ModalHeader className="flex flex-col gap-1">{t("action.setting")}</ModalHeader>
                        <ModalBody className="setting-body">
                            <Tabs>
                                <Tab key="feed" title={t("feed.index")}>
                                    <FeedContent/>
                                </Tab>
                                <Tab key="preferences" title={t("preferences.index")}>
                                    <PreferencesContent/>
                                </Tab>
                            </Tabs>
                        </ModalBody>
                    </Fragment>
                )}
            </ModalContent>
        </Modal>
    );
}), (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default SettingModal;
