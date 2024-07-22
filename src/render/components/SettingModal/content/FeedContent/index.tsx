import {memo, useCallback} from 'react';
import deepEqual from "deep-equal";
import {
    Button,
    Input,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
import {useSetState} from "ahooks";
import {RIPCAddFeed, RIPCRemoveFeed} from "@render/ripc";
import {toast} from "sonner";
import Store from "@render/store";
import {observer} from "mobx-react";
import {Trash2} from "lucide-react";
import {FeedType} from "@src/types/feed";

const columns = [
    {
        key: "title",
        label: "订阅源",
    },
    {
        key: "feedUrl",
        label: "订阅源地址",
    },
    {
        key: "action",
        label: "操作"
    }
]

const FeedContent = memo(observer(() => {
    const {handleGetFeedList, feedList} = Store;
    const [urlState, setUrlState] = useSetState({
        value: "",
        loading: false
    })

    const handleAddFeed = () => {
        setUrlState({
            loading: true
        })
        RIPCAddFeed(urlState.value)
            .then((res) => {
                handleGetFeedList();
                setUrlState({
                    value: ""
                });
                toast.success("新增成功!");
                console.log('新增订阅数据:', res);
            })
            .catch(() => {
                toast.error("新增失败!")
            })
            .finally(() => {
                setUrlState({
                    loading: false
                })
            })
    }

    const handleRemoveFeed = (id: string) => {
        RIPCRemoveFeed(id)
            .then(() => {
                toast.success("删除成功!");
                handleGetFeedList();
            })
         .catch(() => {
                toast.error("删除失败!")
            })
    }

    const renderCell = useCallback((item: FeedType, columnKey: any) => {
        const cellValue = (item as any)[columnKey];
        switch (columnKey) {
            case "action": {
                return <Trash2 onClick={() => {
                    handleRemoveFeed(item?.id)
                }} size={16} className="text-danger cursor-pointer"/>
            }
            default: {
                return cellValue;
            }
        }
    }, [])

    return (
        <div>
            <h2 className="text-lg select-none">
                添加订阅源
            </h2>
            <div className="flex gap-2 my-2">
                <Input
                    value={urlState.value}
                    onValueChange={(value) => {
                        setUrlState({
                            value
                        })
                    }}
                    className={"flex-1"}
                    placeholder={"请输入订阅源URL"}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleAddFeed()
                        }
                    }}
                />
                <Button isDisabled={!urlState.value} color={"primary"} onPress={handleAddFeed}
                        isLoading={urlState.loading}>添加</Button>
            </div>
            <Table className="mt-4">
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={feedList}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}), (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default FeedContent;
