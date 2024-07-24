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

interface Props {
    open: boolean;
    item: FeedType | null;
    onClose: () => void;
}

const FeedEditModal = memo(observer(({open, item, onClose}: Props) => {
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
                toast.success("修改成功!")
                handleClean();
            })
            .catch(() => {
                toast.error("修改失败!")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <Modal
            isOpen={open}
            backdrop={"blur"}
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
                        <ModalHeader className="flex flex-col gap-1">编辑订阅源</ModalHeader>
                        <ModalBody>
                            <Input
                                label="订阅源名称"
                                value={feedValue?.title}
                                onValueChange={(value) => {
                                    setFeedValue({
                                        title: value
                                    })
                                }}
                            />
                            <Select
                                label="分组"
                                placeholder="请选择分组"
                                value={feedValue?.groupId}
                                onChange={(event) => {
                                    setFeedValue({
                                        groupId: event.target.value
                                    })
                                }}
                            >
                                {
                                    [{id: "", name: "默认"}].concat(groupList).map(item => (
                                        <SelectItem key={item.id}>
                                            {item.name}
                                        </SelectItem>
                                    ))
                                }
                            </Select>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={handleClean}>
                                取消
                            </Button>
                            <Button
                                isLoading={loading}
                                isDisabled={!feedValue.title}
                                color="primary" onPress={handleUpdate}>
                                确定
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
