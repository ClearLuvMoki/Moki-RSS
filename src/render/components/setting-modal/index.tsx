import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { Button, Tab, Tabs } from "@heroui/react";
import { SlidersHorizontal } from "lucide-react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import FeedContent from "./feed-content";
import GroupContent from "./group-content";
import SystemContent from "./system-content";

const TabList = [
  { value: "feed", label: "feed.index", content: <FeedContent /> },
  { value: "group", label: "group.index", content: <GroupContent /> },
  {
    value: "preferences",
    label: "preferences.index",
    content: <SystemContent />,
  },
];

const SettingModal = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <Button
        className="flex-shrink-0"
        color="default"
        variant="light"
        onPress={() => setOpen(true)}
        size="md"
        isIconOnly
      >
        <SlidersHorizontal size={16} />
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
                <ModalHeader>{t("action.setting")}</ModalHeader>
                <ModalBody>
                  <Tabs items={TabList}>
                    {(item) => {
                      return (
                        <Tab key={item.value} title={t(item.label)}>
                          {item?.content}
                        </Tab>
                      );
                    }}
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
