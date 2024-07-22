import {memo} from 'react';
import deepEqual from "deep-equal";
import {Select, SelectItem} from "@nextui-org/react";

const UpdateFrequencyArr = [
    {label: "从不", value: "never"},
    {label: "每次打开软件", value: "open-app"},
    {label: "10分钟", value: "10min"},
    {label: "20分钟", value: "20min"},
    {label: "30分钟", value: "30min"},
    {label: "1小时", value: "60min"},
]

const PreferencesContent = memo(() => {
    return (
        <div>
            <div>
                <div>自动更新订阅频率</div>
                <Select
                    label="请选择自动更新更新订阅频率"
                    className="max-w-xs"
                >
                    {UpdateFrequencyArr.map((animal) => (
                        <SelectItem key={animal.value}>
                            {animal.label}
                        </SelectItem>
                    ))}
                </Select>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default PreferencesContent;
