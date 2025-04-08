import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { Button, Tab, Tabs } from "@heroui/react";
import { SlidersHorizontal } from "lucide-react";
import { Fragment, useState } from "react";
import FeedContent from "./feed-content";
import SystemContent from "./system-content";

const TabList = [
  { value: "feed", label: "Feed", content: <FeedContent /> },
  {
    value: "preferences",
    label: "App Preferences",
    content: <SystemContent />,
  },
];

const SettingModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <Button
        className="min-w-1 "
        color="default"
        variant="light"
        onPress={() => setOpen(true)}
        size="md"
      >
        <SlidersHorizontal size={18} />
      </Button>
      <Modal
        size={"2xl"}
        isOpen={open}
        className="h-[calc(100%-100px)] !m-0"
        onClose={() => setOpen(false)}
        scrollBehavior={"inside"}
        hideCloseButton={true}
      >
        <ModalContent>
          {() => {
            return (
              <Fragment>
                <ModalHeader>Setting</ModalHeader>
                <ModalBody>
                  <Tabs>
                    {TabList.map((item) => {
                      return (
                        <Tab key={item.value} title={item.label} value={item.value}>
                          {item?.content}
                        </Tab>
                      );
                    })}
                  </Tabs>
                </ModalBody>
              </Fragment>
            );
          }}
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default SettingModal;
