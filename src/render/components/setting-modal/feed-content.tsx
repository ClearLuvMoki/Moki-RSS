import type { FeedType } from "@/domains/types/feed";
import Channels from "@/src/domains/channel";
import Inject from "@/src/render/inject";
import {
  Button,
  Image,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  addToast,
} from "@heroui/react";
import { Rss, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const columns = [
  {
    key: "title",
    label: "Index",
  },
  {
    key: "feedUrl",
    label: "URL",
  },
  {
    key: "action",
    label: "Action",
  },
];

const FeedContent = () => {
  const [url, setUrl] = useState("");
  const [feedList, setFeedList] = useState<FeedType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onList();
  }, []);

  const renderCell = useCallback((item: FeedType, columnKey: any) => {
    const cellValue = (item as any)[columnKey];
    switch (columnKey) {
      case "title": {
        return (
          <div className="flex gap-2 max-w-md items-center">
            {item?.avatarBase64 || item?.avatar ? (
              <Image
                src={item?.avatarBase64 || item.avatar}
                className="w-6 h-6 shrink rounded-full"
              />
            ) : (
              <Rss className="w-6 h-6 shrink " />
            )}
            <span className="max-w-[200px] text-wrap break-words">{cellValue}</span>
          </div>
        );
      }
      case "action": {
        return (
          <Trash2
            onClick={() => {
              onRemoveFeed(item?.id);
            }}
            size={16}
            className="text-danger cursor-pointer"
          />
        );
      }
      default: {
        return cellValue;
      }
    }
  }, []);

  const onList = useCallback(() => {
    Inject.invoke<null, FeedType[]>(Channels.AllFeed).then((res) => {
      setFeedList(res);
    });
  }, []);

  const onInsert = useCallback(
    (url: string) => {
      setLoading(true);
      Inject.invoke(Channels.InsertFeed, {
        url,
      })
        .then(() => {
          addToast({
            title: "新增订阅源成功!",
            color: "success",
          });
        })
        .catch(() =>
          addToast({
            title: "新增订阅源失败!",
            color: "danger",
          }),
        )
        .finally(() => {
          onList();
          setLoading(false);
        });
    },
    [onList],
  );

  const onRemoveFeed = useCallback(
    (id: string) => {
      Inject.invoke(Channels.RemoveFeed, { id })
        .catch(() =>
          addToast({
            title: "移除订阅源失败!",
            color: "danger",
          }),
        )
        .finally(onList);
    },
    [onList],
  );

  return (
    <div className="py-2">
      <h2 className="text-lg text-gray-700 font-semibold select-none mb-4">Add feed</h2>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          placeholder="Please enter feed URL"
          value={url}
          onValueChange={(value) => {
            setUrl(value);
          }}
        />
        <Button
          type="submit"
          color="primary"
          isLoading={loading}
          isDisabled={!url}
          onPress={() => onInsert(url)}
        >
          Add
        </Button>
      </div>
      <Table className="mt-4">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={feedList} emptyContent={"No data."}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FeedContent;
