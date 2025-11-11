import type { FeedType } from "@/domains/types/feed";
import Channels from "@/src/domains/channel";
import Inject from "@/src/render/inject";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  addToast,
} from "@heroui/react";
import { Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "../../store";
import FeedItem from "../feed-item";

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
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { feedList, reloadFeed, addFeed } = useGlobalStore();

  const renderCell = useCallback((item: FeedType, columnKey: any) => {
    const cellValue = (item as any)[columnKey];
    switch (columnKey) {
      case "title": {
        return (
          <div className="flex gap-2 max-w-md items-center">
            <FeedItem
              cover={item?.avatarBase64 || item?.avatar}
              name={cellValue}
              classNames={{
                image: "w-6 h-6 shrink rounded-full",
                name: "max-w-[200px] text-wrap break-words ml-2",
              }}
            />
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

  const onInsert = useCallback(
    (url: string) => {
      setLoading(true);
      addFeed(url)
        .then(() => {
          addToast({
            title: t("toast.success.index"),
            color: "success",
          });
        })
        .catch(() =>
          addToast({
            title: t("toast.failed.index"),
            color: "danger",
          }),
        )
        .finally(() => {
          reloadFeed();
          setLoading(false);
        });
    },
    [addFeed, reloadFeed, t],
  );

  const onRemoveFeed = useCallback(
    (id: string) => {
      Inject.invoke(Channels.RemoveFeed, { id })
        .catch(() =>
          addToast({
            title: t("toast.failed.index"),
            color: "danger",
          }),
        )
        .finally(reloadFeed);
    },
    [reloadFeed, t],
  );

  return (
    <div className="py-2">
      <h2 className="text-lg text-gray-700 font-semibold select-none mb-4 dark:text-gray-200">
        {t("feed.add")}
      </h2>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          placeholder={t("feed.placeholder")}
          value={url}
          onValueChange={(value) => {
            setUrl(value?.trim());
          }}
          onKeyDown={(event) => {
            if (event.code === "Enter") {
              onInsert(url);
            }
          }}
        />
        <Button
          type="submit"
          color="primary"
          isLoading={loading}
          isDisabled={!url}
          onPress={() => onInsert(url)}
        >
          {t("action.add")}
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
