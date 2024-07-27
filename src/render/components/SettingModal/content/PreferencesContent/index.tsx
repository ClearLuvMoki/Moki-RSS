import {memo} from 'react';
import deepEqual from "deep-equal";
import {Select, SelectItem} from "@nextui-org/react";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react";
import Store from "@render/store";
import {DefaultLang} from "@render/i18n";

// const UpdateFrequencyArr = [
//     {label: "从不", value: "never"},
//     {label: "每次打开软件", value: "open-app"},
//     {label: "10分钟", value: "10min"},
//     {label: "20分钟", value: "20min"},
//     {label: "30分钟", value: "30min"},
//     {label: "1小时", value: "60min"},
// ]

const LanguageArr = [
    {label: "中文 (简体)", value: "zh-CN"},
    {label: "German", value: "de"},
    {label: "한국인", value: "ko"},
    {label: "日本語", value: "ja"},
    {label: "Français", value: "fr"},
    {label: "English", value: "en-US"},
]

const PreferencesContent = memo(observer(() => {
    const {t} = useTranslation();
    const { OSConfig, updateOSConfig } = Store;

    return (
        <div>
            <div>
                {/*<div>自动更新订阅频率</div>*/}
                {/*<Select*/}
                {/*    label="请选择自动更新更新订阅频率"*/}
                {/*    className="max-w-xs"*/}
                {/*>*/}
                {/*    {UpdateFrequencyArr.map((animal) => (*/}
                {/*        <SelectItem key={animal.value}>*/}
                {/*            {animal.label}*/}
                {/*        </SelectItem>*/}
                {/*    ))}*/}
                {/*</Select>*/}
                <h2 className="text-lg select-none">{t("preferences.language")}</h2>
                <Select
                    placeholder={t("preferences.language-placeholder")}
                    className="max-w-xs my-2"
                    selectedKeys={[OSConfig?.locale || DefaultLang]}
                    onChange={(event) => {
                        updateOSConfig({
                            locale: event.target.value || DefaultLang
                        })
                    }}
                >
                    {LanguageArr.map((lang) => (
                        <SelectItem key={lang.value}>
                            {lang.label}
                        </SelectItem>
                    ))}
                </Select>
            </div>
        </div>
    );
}), (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default PreferencesContent;
