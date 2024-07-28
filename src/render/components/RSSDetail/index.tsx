import {memo} from 'react';
import deepEqual from "deep-equal";
import {RSSType} from "@src/types/rss";
import MarkDownRender from "@render/components/MarkDownRender";
import dayjs from "dayjs";
import {Divider} from "@nextui-org/react";

interface Props {
    detail: RSSType | null;
}

const RSSDetail = memo(({detail}: Props) => {
    return (
        <div id="RSSDetail">
            <div className="text-xl font-bold mb-4">{detail?.title}</div>
            <div className="mb-6 text-gray-400 text-sm flex items-center">
                {detail?.author}
                { detail?.author && ( <Divider orientation="vertical" className="mx-2 h-4 text-black"/>) }
                {dayjs(detail?.pubDate).format("YYYY-MM-DD")}
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
