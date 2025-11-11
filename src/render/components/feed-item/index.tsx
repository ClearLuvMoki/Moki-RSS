import { Image } from "@heroui/react";
import { clsx } from "clsx";
import { Rss } from "lucide-react";

interface Props {
  cover: string;
  name?: string;
  classNames?: {
    image?: string;
    name?: string;
  };
}
const FeedItem = ({ cover, name, classNames }: Props) => {
  return (
    <div className="flex items-center select-none">
      {cover ? (
        <Image src={cover} className={clsx("w-4 min-w-4 h-4", classNames?.image)} />
      ) : (
        <Rss className={clsx("w-4 min-w-4 h-4", classNames?.image)} />
      )}
      {name && <span className={classNames?.name}>{name}</span>}
    </div>
  );
};

export default FeedItem;
