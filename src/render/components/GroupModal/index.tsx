import {Fragment, memo, useState} from 'react';
import deepEqual from "deep-equal";
import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea} from "@nextui-org/react";
import {ListPlus} from "lucide-react";
import IconWrapper from "@render/components/IconWrapper";
import {useSetState, useUpdateEffect} from "ahooks";
import {RIPCAddGroup} from "@render/ripc";
import {toast} from "sonner";
import Store from "@render/store";

const GroupModal = memo(() => {
    const { handleGetGroupList } = Store;
    const [open, setOpen] = useState(false);
    const [formState, setFormState] = useSetState({
        name: "",
        description: ""
    })
    const [formErr, setFormErr] = useSetState({
        nameErr: "",
    })

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

    const handleClean = () => {
        setFormErr({
            nameErr: ""
        })
        setFormState({
            name: "",
            description: ""
        })
        setOpen(false)
    }

    return (
        <Fragment>
            <IconWrapper
                onClick={() => setOpen(true)}
            >
                <ListPlus size={16} className="text-default-400"/>
            </IconWrapper>
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
                            <ModalHeader className="flex flex-col gap-1">新增分组</ModalHeader>
                            <ModalBody>
                                <Input
                                    type="name"
                                    label="分组名称"
                                    isInvalid={Boolean(formErr.nameErr)}
                                    errorMessage={formErr.nameErr}
                                    onValueChange={(value) => {
                                        setFormState({name: value})
                                    }}
                                />
                                <Textarea
                                    name="description"
                                    label="分组描述"
                                    placeholder="请输入分组描述"
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
        </Fragment>

    );
}, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default GroupModal;
