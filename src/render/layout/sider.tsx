import { Accordion, AccordionItem, Image, Listbox, ListboxItem } from "@heroui/react";
import { clsx } from "clsx";
import { Rss } from "lucide-react";
import { useGlobalStore } from "../store";

const itemClasses = {
  base: "py-0 w-full",
  title: "font-bold text-lg",
  trigger: "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-[32px] flex items-center",
  indicator: "text-medium",
  content: "text-small px-2",
};

const Sider = () => {
  const { feedList, activeFeed, updateActiveFeed } = useGlobalStore();

  return (
    <div className="w-[240px] h-full border-r py-4 px-[10px] light:border-r-gray-200 dark:border-r-gray-600">
      <Accordion itemClasses={itemClasses} defaultExpandedKeys={["all"]}>
        <AccordionItem key="all" aria-label="Accordion 1" title="All feeds">
          <Listbox variant="flat">
            {feedList
              .filter((item) => !item.groupId)
              .map((item) => (
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
                  {item.title}
                </ListboxItem>
              ))}
          </Listbox>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Sider;
