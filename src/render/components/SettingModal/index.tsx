import {Fragment, memo} from 'react';
import deepEqual from "deep-equal";
import {Modal, ModalBody, ModalContent, ModalHeader, Tab, Tabs} from "@nextui-org/react";
import FeedContent from "./content/FeedContent";

interface Props {
    open: boolean;
    onClose: VoidFunction;
}

const SettingModal = memo(({open, onClose}: Props) => {

    return (
        <Modal
            size={"2xl"}
            isOpen={open}
            backdrop={"blur"}
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
                        <ModalHeader className="flex flex-col gap-1">设置</ModalHeader>
                        <ModalBody className="setting-body">
                            <Tabs>
                                <Tab key="feed" title="订阅源">
                                    <FeedContent/>
                                </Tab>
                                {/*<Tab key="group" title="分组">*/}
                                {/*    <GroupContent/>*/}
                                {/*</Tab>*/}
                                {/*<Tab key="preferences" title="应用偏好">*/}
                                {/*    <PreferencesContent/>*/}
                                {/*</Tab>*/}
                            </Tabs>
                        </ModalBody>
                    </Fragment>
                )}
            </ModalContent>
        </Modal>
    );
}, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default SettingModal;
