import {memo} from 'react';
import deepEqual from "deep-equal";
import {RSSType} from "@src/types/rss";
import MarkDownRender from "@render/components/MarkDownRender";
import dayjs from "dayjs";

interface Props {
    detail: RSSType | null;
}

const RSSDetail = memo(({detail}: Props) => {
    return (
        <div id="RSSDetail">
            <div className="text-xl font-bold mb-4">{detail?.title}</div>
            <div className="mb-6 text-gray-400 text-sm">
                <span >{dayjs(detail?.pubDate).format("YYYY年MM月DD日")}</span>
            </div>
            <MarkDownRender
                content={detail?.content || ""}
            />
        </div>
    );
}, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default RSSDetail;
