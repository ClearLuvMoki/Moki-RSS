import {memo} from 'react';
import deepEqual from "deep-equal";
import Store from "@render/store";
import {observer} from "mobx-react";
import {useSize} from "ahooks";
import {Card, CardBody, CardHeader} from "@nextui-org/react";

const GroupContent = memo(observer(() => {
    const {handleGetFeedList, feedList} = Store;
    const size = useSize(document?.getElementsByClassName("setting-body")?.[0])

    return (
        <div
            className="w-full flex items-center justify-between gap-4"
            style={{
                height: (size?.height || 0) - 100
            }}
        >
            <div
                className='w-1/2 h-full rounded-lg border-1.5 border-gray-200 p-2 overflow-y-scroll'
            >
                {
                    (feedList || []).map(item => (
                        <Card key={item.id} isHoverable={true} className="mb-2 cursor-pointer" shadow='sm'>
                            <CardBody className="select-none">{item.title}</CardBody>
                        </Card>
                    ))
                }
            </div>
            <div className='w-1/2 h-full rounded-lg border-1.5 border-gray-200 p-2'>12</div>
        </div>
    );
}), (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default GroupContent;
