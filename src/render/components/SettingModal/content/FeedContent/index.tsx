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
import {useTranslation} from "react-i18next";

const columns = [
    {
        key: "title",
        label: "feed.index",
    },
    {
        key: "feedUrl",
        label: "feed.url",
    },
    {
        key: "action",
        label: "action.index"
    }
]

const FeedContent = memo(observer(() => {
    const {t} = useTranslation();
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
                console.log("新增订阅:", res)
                toast.success(t("toast.success.add"));
            })
            .catch(() => {
                toast.success(t("toast.failed.add"));
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
                toast.success(t("toast.success.delete"));
                handleGetFeedList();
            })
            .catch(() => {
                toast.error(t("toast.failed.delete"));
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
                {t("feed.add")}
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
                    placeholder={t("feed.placeholder")}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleAddFeed()
                        }
                    }}
                />
                <Button isDisabled={!urlState.value} color={"primary"} onPress={handleAddFeed}
                        isLoading={urlState.loading}>{t("action.add")}</Button>
            </div>
            <Table className="mt-4">
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{t(column.label)}</TableColumn>}
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
