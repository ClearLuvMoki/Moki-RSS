import ScrollContent from "@/components/scroll-content";
import { Card, CardBody, Image } from "@heroui/react";
import dayjs from "dayjs";
import { Rss } from "lucide-react";
import { useGlobalStore } from "../../store";

const RSSMagazine = () => {
  const { rssList, activeFeed, nextPage, updateRSSDetail } = useGlobalStore();

  return (
    <ScrollContent
      suppressScrollX={false}
      classNames={{
        root: "w-full h-full overflow-y-scroll p-6",
      }}
      onScroll={(event) => {
        const { scrollTop, clientHeight, scrollHeight } = event.target as any;
        if (scrollTop + clientHeight === scrollHeight) {
          nextPage();
        }
      }}
    >
      {rssList.map((item) => {
        return (
          <Card key={item?.id} className="mb-4 h-[200px]">
            <CardBody
              className="flex flex-row flex-nowrap gap-4 "
              onClick={() => {
                updateRSSDetail(item);
              }}
            >
              {item?.images?.[0] && (
                <Image
                  alt="RSS Image"
                  className="object-cover min-w-[200px]"
                  src={item?.images?.[0]}
                  isZoomed
                  width={180}
                  height={180}
                />
              )}
              <div className="flex-1 h-full flex flex-col justify-between items-center">
                <div className="w-full">
                  <h2 className="text-lg font-bold">{item?.title}</h2>
                  <p className="text-gray-400 light:text-gray-700 text-sm mt-2 line-clamp-4">
                    {item?.contentSnippet}
                  </p>
                </div>
                <div className="flex w-full flex-row justify-between items-center">
                  <div className="flex items-center">
                    {activeFeed?.avatarBase64 || activeFeed?.avatar ? (
                      <Image
                        src={activeFeed?.avatarBase64 || activeFeed.avatar}
                        className="w-4 min-w-4 h-4"
                      />
                    ) : (
                      <Rss className="w-4 min-w-4" />
                    )}
                    <span className="text-xs ml-2 text-gray-700 dark:text-gray-400">
                      {activeFeed?.title}
                    </span>
                  </div>
                  <span className="text-xs text-gray-700 dark:text-gray-400">
                    {item?.pubDate || item?.isoDate
                      ? dayjs(item?.pubDate || item?.isoDate).format("YYYY-MM-DD HH:mm:ss")
                      : ""}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </ScrollContent>
  );
};

export default RSSMagazine;
