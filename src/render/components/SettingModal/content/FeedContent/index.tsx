import {memo, useCallback} from 'react';
import deepEqual from "deep-equal";
import {
    Button, Image,
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
import {Rss, Trash2} from "lucide-react";
import {FeedType} from "@src/types/feed";
import {useTranslation} from "react-i18next";
import to from "await-to-js";

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

    const handleAddFeed = async () => {
        setUrlState({
            loading: true
        })
        const [err, res] = await to(fetch(urlState.value));
        if (err) {
            toast.error(t("toast.failed.add"));
            return setUrlState({
                loading: false
            })
        }
        const xml = await res?.text();
        RIPCAddFeed({
            xml: xml || "",
            url: urlState.value
        })
            .then((res) => {
                handleGetFeedList();
                setUrlState({
                    value: ""
                });
                console.log("新增订阅:", res)
                toast.success(t("toast.success.add"));
            })
            .catch(() => {
                toast.error(t("toast.failed.add"));
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
            case "title": {
                return (
                    <div className="flex gap-2 max-w-md">
                        {
                            (item?.avatarBase64 || item?.avatar) ? <Image
                                    src={item?.avatarBase64 || item.avatar}
                                    className="w-4 min-w-4 h-4"/> :
                                <Rss className="w-4 min-w-4 w-4"/>
                        }
                        <span>{cellValue}</span>
                    </div>
                )
            }
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
