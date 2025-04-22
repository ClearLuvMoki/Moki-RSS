import EmptyText from "@/components/empty-text";
import ScrollContent from "@/components/scroll-content";
import { Accordion, AccordionItem, Divider, Image, Listbox, ListboxItem } from "@heroui/react";
import { clsx } from "clsx";
import { Rss } from "lucide-react";
import { useTranslation } from "react-i18next";
import FeedItem from "../components/feed-item";
import { useGlobalStore } from "../store";

const itemClasses = {
  base: "py-0 w-full",
  title: "font-bold text-lg block",
  trigger: "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg min-h-[32px] flex items-center",
  indicator: "text-medium",
  content: "text-small px-2",
};

const Sider = () => {
  const { t } = useTranslation();
  const { feedList, groupList, activeFeed, updateActiveFeed } = useGlobalStore();

  return (
    <ScrollContent
      suppressScrollX={false}
      classNames={{
        root: "w-[240px] h-full border-r py-4 px-[10px] overflow-y-scroll light:border-r-gray-200 dark:border-r-gray-600",
      }}
    >
      <Accordion itemClasses={itemClasses} defaultExpandedKeys={["all"]}>
        <AccordionItem key="all" title={t("feed.all-feed")}>
          <Listbox variant="flat">
            {feedList.map((item) => (
              <ListboxItem
                className={clsx("h-[36px]", {
                  "bg-default/40": item.id === activeFeed?.id,
                })}
                key={item.id}
                onPress={() => {
                  updateActiveFeed(item);
                }}
                startContent={
                  item?.avatarBase64 || item?.avatar ? (
                    <Image src={item?.avatarBase64 || item.avatar} className="w-4 min-w-4 h-4" />
                  ) : (
                    <Rss className="w-4 min-w-4" />
                  )
                }
              >
                <div
                  style={{
                    width: 130,
                    maxWidth: 130,
                    overflow: "hidden",
                    textWrap: "nowrap",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </div>
              </ListboxItem>
            ))}
          </Listbox>
        </AccordionItem>
      </Accordion>
      <Divider className="my-2" />

      <div className="px-4 my-4">
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold">{t("group.index")}</div>
        </div>
        {groupList.length === 0 && <EmptyText content={t("empty.group")} />}
      </div>

      <Accordion itemClasses={itemClasses} selectionMode="multiple" isCompact showDivider={false}>
        {groupList.map((item) => (
          <AccordionItem
            key={item.id}
            title={
              <div
                style={{
                  width: 130,
                  maxWidth: 130,
                  overflow: "hidden",
                  textWrap: "nowrap",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
                className={"text-sm font-medium"}
              >
                {item?.name}
              </div>
            }
            subtitle={<div className={"w-[160px] line-clamp-1"}>{item?.description}</div>}
          >
            {item.feeds && item.feeds.length > 0 ? (
              <Listbox variant="flat">
                {(item.feeds || []).map((item) => (
                  <ListboxItem
                    className={item.id === activeFeed?.id ? "bg-default/40 " : ""}
                    key={item.id}
                    onPress={() => {
                      updateActiveFeed(item);
                    }}
                    startContent={<FeedItem cover={item?.avatarBase64 || item?.avatar} />}
                  >
                    {item.title}
                  </ListboxItem>
                ))}
              </Listbox>
            ) : (
              <EmptyText />
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollContent>
  );
};

export default Sider;
