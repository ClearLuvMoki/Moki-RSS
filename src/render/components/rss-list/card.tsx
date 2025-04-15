import ScrollContent from "@/components/scroll-content";
import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import { Rss } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { useGlobalStore } from "../../store";

const RSSCard = () => {
  const { rssList, activeFeed, nextPage, updateRSSDetail } = useGlobalStore();

  return (
    <ScrollContent
      suppressScrollX={false}
      classNames={{
        root: "w-full h-full overflow-y-scroll p-6",
        content: "flex flex-wrap gap-6",
      }}
      onScroll={(event) => {
        const { scrollTop, clientHeight, scrollHeight } = event.target as any;
        if (scrollTop + clientHeight === scrollHeight) {
          nextPage();
        }
      }}
    >
      {rssList.map((item) => {
        const isShowImage = Boolean(item?.images?.[0]);
        return (
          <Card
            isFooterBlurred
            className="border-none w-[200px] h-[230px]"
            radius="lg"
            key={item?.id}
          >
            <CardBody
              className={"p-0"}
              onClick={() => {
                updateRSSDetail(item);
              }}
            >
              {isShowImage ? (
                <Fragment>
                  <Image
                    alt="RSS Image"
                    className="object-cover"
                    src={item?.images?.[0]}
                    width={200}
                    isZoomed
                    height={230}
                  />
                  <CardFooter className="flex-col h-[44px] before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <div className="text-tiny text-gray-900 dark:text-white/80 line-clamp-2 select-none">
                      {item?.title}
                    </div>
                  </CardFooter>
                </Fragment>
              ) : (
                <div className="w-full h-full p-4">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2 flex-nowrap shrink">
                      {activeFeed?.avatarBase64 || activeFeed?.avatar ? (
                        <Image
                          src={activeFeed?.avatarBase64 || activeFeed.avatar}
                          className="w-4 min-w-4 h-4"
                        />
                      ) : (
                        <Rss className="w-4 min-w-4" />
                      )}
                      <span className="line-clamp-1 text-xs font-semibold">
                        {activeFeed?.title}
                      </span>
                    </div>
                  </div>
                  <div className="line-clamp-2 text-medium font-medium my-2">{item?.title}</div>
                  <div className="line-clamp-6  text-gray-400 light:text-gray-700 text-sm">
                    {item?.contentSnippet || item?.content}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        );
      })}
    </ScrollContent>
  );
};

export default RSSCard;
