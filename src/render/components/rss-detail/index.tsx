import MarkDownRender from "@/components/markdown-render";
import type { RSSType } from "@/domains/types/rss";
import { Divider } from "@heroui/react";
import dayjs from "dayjs";

interface Props {
  detail: RSSType | null;
}

const RSSDetail = ({ detail }: Props) => {
  return (
    <div id="RSSDetail">
      <div className="text-xl font-bold mb-4">{detail?.title}</div>
      <div className="mb-6 text-gray-400 text-sm flex items-center">
        {detail?.author}
        {detail?.author && <Divider orientation="vertical" className="mx-2 h-4 text-black" />}
        {dayjs(detail?.pubDate).format("YYYY-MM-DD")}
      </div>
      <MarkDownRender content={detail?.content || ""} />
    </div>
  );
};

export default RSSDetail;
