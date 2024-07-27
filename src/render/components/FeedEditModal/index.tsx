import {Fragment, memo, useEffect, useState} from 'react';
import deepEqual from "deep-equal";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem
} from "@nextui-org/react";
import {FeedType} from "@src/types/feed";
import {useSetState} from "ahooks";
import {observer} from "mobx-react";
import Store from "@render/store";
import {RIPCUpdateFeed} from "@render/ripc";
import {toast} from "sonner";
import {useTranslation} from "react-i18next";

interface Props {
    open: boolean;
    item: FeedType | null;
    onClose: () => void;
}

const FeedEditModal = memo(observer(({open, item, onClose}: Props) => {
    const { t } = useTranslation()
    const {groupList, handleGetGroupList, handleGetFeedList} = Store;
    const [loading, setLoading] = useState(false);
    const [feedValue, setFeedValue] = useSetState<{
        title: string;
        groupId: string;
    }>({
        title: "",
        groupId: ""
    })

    useEffect(() => {
        if (open && item?.id) {
            setFeedValue({
                title: item.title,
                groupId: item.groupId || ""
            })
        }
    }, [open, item])

    const handleClean = () => {
        setFeedValue({
            title: "",
            groupId: ""
        })
        onClose();
    }

    const handleUpdate = () => {
        if (!item?.id) return;
        setLoading(true)
        RIPCUpdateFeed({
            id: item?.id,
            title: feedValue?.title,
            groupId: feedValue?.groupId
        })
            .then(() => {
                handleGetGroupList();
                handleGetFeedList();
                toast.success(t("toast.success.update"))
                handleClean();
            })
            .catch(() => {
                toast.error(t("toast.failed.update"))
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
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
                        <ModalHeader className="flex flex-col gap-1">{t("feed.edit")}</ModalHeader>
                        <ModalBody>
                            <Input
                                label={t("feed.name")}
                                value={feedValue?.title}
                                onValueChange={(value) => {
                                    setFeedValue({
                                        title: value
                                    })
                                }}
                            />
                            <Select
                                label={t("group.index")}
                                placeholder={t("group.placeholder")}
                                value={feedValue?.groupId}
                                onChange={(event) => {
                                    setFeedValue({
                                        groupId: event.target.value
                                    })
                                }}
                            >
                                {
                                    [{id: "", name: t("empty.default")}].concat(groupList).map(item => (
                                        <SelectItem key={item.id}>
                                            {item.name}
                                        </SelectItem>
                                    ))
                                }
                            </Select>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={handleClean}>
                                {t("action.cancel")}
                            </Button>
                            <Button
                                isLoading={loading}
                                isDisabled={!feedValue.title}
                                color="primary" onPress={handleUpdate}>
                                 {t("action.submit")}
                            </Button>
                        </ModalFooter>
                    </Fragment>
                )}
            </ModalContent>

        </Modal>
    );
}), (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default FeedEditModal;
