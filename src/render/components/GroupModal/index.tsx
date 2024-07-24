import {Fragment, memo, useEffect} from 'react';
import deepEqual from "deep-equal";
import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea} from "@nextui-org/react";
import {useSetState, useUpdateEffect} from "ahooks";
import {RIPCAddGroup, RIPCUpdateGroup} from "@render/ripc";
import {toast} from "sonner";
import Store from "@render/store";
import {GroupType} from "@src/types/group";
import {observer} from "mobx-react";

interface Props {
    open: boolean;
    groupItem?: GroupType | null;
    onClose: VoidFunction;
}

const GroupModal = memo(observer(({open, groupItem, onClose}: Props) => {
    const {handleGetGroupList} = Store;

    const [formState, setFormState] = useSetState({
        name: "",
        description: ""
    })
    const [formErr, setFormErr] = useSetState({
        nameErr: "",
    })

    useEffect(() => {
        if (open && groupItem?.id) {
            setFormState({
                name: groupItem?.name,
                description: groupItem?.description || ""
            })
        }
    }, [open, groupItem?.id])

    useUpdateEffect(() => {
        if (!formState.name) {
            setFormErr({
                nameErr: "请输入分组名称!"
            })
        } else {
            setFormErr({
                nameErr: ""
            })
        }
    }, [formState?.name])


    const handleAddGroup = () => {
        if (groupItem?.id) {
            RIPCUpdateGroup({
                id: groupItem?.id,
                name: formState.name || "",
                description: formState.description || ""
            })
                .then(() => {
                    handleGetGroupList();
                    toast.success("修改成功!");
                    handleClean();
                })
                .catch(() => {
                    toast.error("修改失败!")
                })
        } else {
            RIPCAddGroup({
                name: formState.name || "",
                description: formState.description || ""
            })
                .then(() => {
                    handleGetGroupList();
                    toast.success("新增成功!");
                    handleClean();
                })
                .catch(() => {
                    toast.error("新增失败!")
                })
        }
    }

    const handleClean = () => {
        setFormErr({
            nameErr: ""
        })
        setFormState({
            name: "",
            description: ""
        })
        onClose();
    }

    return (
        <Modal
            isOpen={open}
            onClose={handleClean}
            backdrop={"blur"}
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
                        <ModalHeader
                            className="flex flex-col gap-1">{groupItem?.id ? "编辑分组" : "新增分组"}</ModalHeader>
                        <ModalBody>
                            <Input
                                type="name"
                                label="分组名称"
                                isInvalid={Boolean(formErr.nameErr)}
                                errorMessage={formErr.nameErr}
                                value={formState?.name}
                                onValueChange={(value) => {
                                    setFormState({name: value})
                                }}
                            />
                            <Textarea
                                name="description"
                                label="分组描述"
                                placeholder="请输入分组描述"
                                value={formState?.description}
                                onValueChange={(value) => setFormState({description: value})}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={handleClean}>
                                取消
                            </Button>
                            <Button
                                isDisabled={!formState.name}
                                color="primary" onPress={handleAddGroup}>
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

export default GroupModal;
