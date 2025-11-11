import ScrollContent from "@/components/scroll-content";
import { Card, CardBody, CardFooter, Image as HeroImage } from "@heroui/react";
import clsx from "clsx";
import { Rss } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useGlobalStore } from "../../store";
import { UnReadPoint } from "../unreaded";

const ImageWidth = 200;
const ImageHeight = 230;

const ImageCardFooterContent = ({
  content,
  imageUrl,
}: {
  content: string;
  imageUrl?: string;
}) => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    imageUrl && onGetIsLight(imageUrl);
  }, [imageUrl]);

  const onGetIsLight = useCallback((imageUrl: string) => {
    try {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const bottomHeight = 44;
        const containerRatio = ImageWidth / ImageHeight;
        const imageRatio = img.naturalWidth / img.naturalHeight;
        let renderedWidth = 0;
        let renderedHeight = 0;
        let offsetX = 0;
        let offsetY = 0;

        if (containerRatio > imageRatio) {
          renderedWidth = img.naturalWidth;
          renderedHeight = img.naturalWidth / containerRatio;
          offsetY = (img.naturalHeight - renderedHeight) / 2;
        } else {
          renderedHeight = img.naturalHeight;
          renderedWidth = img.naturalHeight * containerRatio;
          offsetX = (img.naturalWidth - renderedWidth) / 2;
        }
        canvas.width = renderedWidth;
        canvas.height = renderedHeight;

        ctx?.drawImage(
          img,
          offsetX,
          offsetY,
          renderedWidth,
          renderedHeight,
          0,
          0,
          renderedWidth,
          renderedHeight,
        );

        const bottomRatio = bottomHeight / ImageHeight;
        const detectHeight = Math.max(1, Math.floor(renderedHeight * bottomRatio));
        const startY = renderedHeight - detectHeight;
        const imageData = ctx?.getImageData(0, startY, renderedWidth, detectHeight);
        const data = imageData?.data;
        if (!data) return setIsLight(false);

        let r = 0;
        let g = 0;
        let b = 0;
        const pixelCount = renderedWidth * detectHeight;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        r = Math.round(r / pixelCount);
        g = Math.round(g / pixelCount);
        b = Math.round(b / pixelCount);

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        setIsLight(brightness > 128);
      };
    } catch (err) {
      setIsLight(false);
    }
  }, []);

  return (
    <div
      className={clsx("text-tiny line-clamp-2 select-none", {
        "text-gray-900": isLight,
        "text-white/80": !isLight,
      })}
    >
      {content}
    </div>
  );
};

const RSSCard = () => {
  const { rssList, activeFeed, nextPage, updateRSSDetail, updateRSSReadedStatus } =
    useGlobalStore();

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
            className={"border-none"}
            style={{
              width: ImageWidth,
              height: ImageHeight,
            }}
            radius="lg"
            key={item?.id}
          >
            <CardBody
              className={"p-0 w-full h-full"}
              onClick={() => {
                updateRSSDetail(item);
                updateRSSReadedStatus({ id: item.id });
              }}
            >
              {isShowImage ? (
                <Fragment>
                  <HeroImage
                    alt="RSS Image"
                    className="object-cover"
                    src={item?.images?.[0]}
                    width={ImageWidth}
                    isZoomed
                    height={ImageHeight}
                  />
                  <CardFooter className="flex gap-2 items-start justify-between h-[44px] before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <UnReadPoint show={!item.isRead} className="mt-1" />
                    <ImageCardFooterContent
                      imageUrl={item?.images?.[0]}
                      content={item?.title || ""}
                    />
                  </CardFooter>
                </Fragment>
              ) : (
                <div className="w-full h-full p-4">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2 flex-nowrap shrink">
                      {activeFeed?.avatarBase64 || activeFeed?.avatar ? (
                        <HeroImage
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
                    <UnReadPoint show={!item?.isRead} />
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
