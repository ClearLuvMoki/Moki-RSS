import RSSDetail from "@/components/rss-detail";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { Fragment } from "react";
import { useGlobalStore } from "../../store";

const ContentModal = () => {
  const { rssDetail, updateRSSDetail, activeFeed } = useGlobalStore();

  return (
    <Modal
      isOpen={Boolean(rssDetail?.id)}
      size={"4xl"}
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
        },
      }}
      onClose={() => {
        updateRSSDetail(null);
      }}
    >
      <ModalContent>
        {() => (
          <Fragment>
            <ModalHeader className="border-b border-b-gray-300 flex justify-between items-center">
              <h1 className="text-2xl">
                {activeFeed?.title}
                {rssDetail?.author && (
                  <span className="text-sm font-medium text-gray-500">
                    &nbsp;/&nbsp;{rssDetail.author}
                  </span>
                )}
              </h1>
            </ModalHeader>
            <ModalBody className="px-16 py-4 rss-content">
              <RSSDetail detail={rssDetail} />
            </ModalBody>
          </Fragment>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ContentModal;
