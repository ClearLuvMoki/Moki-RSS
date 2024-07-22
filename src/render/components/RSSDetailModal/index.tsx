import {Fragment, memo} from 'react';
import deepEqual from "deep-equal";
import {Modal, ModalBody, ModalContent, ModalHeader} from "@nextui-org/react";
import {observer} from "mobx-react";
import Store from "@render/store";
import RSSDetail from "@render/components/RSSDetail";


/*
*    allowpopups={"true" as unknown as boolean}
     webpreferences="contextIsolation,disableDialogs,autoplayPolicy=document-user-activation-required"
     partition={this.state.loadWebpage ? "sandbox" : undefined}
* */

const RSSDetailModal = memo(observer(() => {
    const {rssDetailState, activeFeed, updateRSSDetailState} = Store;

    return (
        <Modal
            backdrop={"blur"}
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
                                <h1 className="text-lg"> {activeFeed?.title}</h1>
                                <div className="flex items-center gap-2">
                                    {/*<IconWrapper*/}
                                    {/*    onClick={() => setIsWeb(true)}*/}
                                    {/*><Globe size={18}/></IconWrapper>*/}
                                </div>
                            </ModalHeader>
                            <ModalBody className="px-6 py-4">
                                <RSSDetail detail={rssDetailState}/>
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
