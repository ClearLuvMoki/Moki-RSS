import {memo} from 'react';
import deepEqual from "deep-equal";
import {Select, SelectItem} from "@nextui-org/react";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react";
import Store from "@render/store";
import {MonitorCog, Moon, Sun} from "lucide-react";
import {DefaultValue} from "@src/types/os";

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
    {label: "Русский", value: "ru"},
    {label: "Italiano", value: "it"},
]

const ThemeArr = [
    {label: "theme.light", value: "light", icon: <Sun size={16}/>},
    {label: "theme.dark", value: "dark", icon: <Moon size={16}/>},
    {label: "theme.os-theme", value: "os", icon: <MonitorCog size={16}/>},
]

const ListModeArr = [
    {label: "list-view.magazine", value: "magazine"},
    {label: "list-view.compact", value: "compact"}
]

const PreferencesContent = memo(observer(() => {
    const {t} = useTranslation();
    const {OSConfig, updateOSConfig} = Store;

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
                    selectedKeys={[OSConfig?.locale || DefaultValue.lang]}
                    onChange={(event) => {
                        updateOSConfig({
                            locale: event.target.value || DefaultValue.lang
                        })
                    }}
                >
                    {LanguageArr.map((lang) => (
                        <SelectItem key={lang.value}>
                            {lang.label}
                        </SelectItem>
                    ))}
                </Select>

                <h2 className="text-lg select-none mt-4">{t("theme.index")}</h2>
                <Select
                    placeholder={t("theme.placeholder")}
                    className="max-w-xs my-2"
                    selectedKeys={[OSConfig?.theme || DefaultValue.theme]}
                    onChange={(event) => {
                        updateOSConfig({
                            theme: event?.target?.value as any
                        })
                    }}
                >
                    {ThemeArr.map((theme) => (
                        <SelectItem key={theme.value} startContent={theme.icon}>
                            {t(theme.label)}
                        </SelectItem>
                    ))}
                </Select>

                <h2 className="text-lg select-none mt-4">{t("list-view.index")}</h2>
                <Select
                    placeholder={t("list-view.placeholder")}
                    className="max-w-xs my-2"
                    selectedKeys={[OSConfig?.listMode || DefaultValue.listMode]}
                    onChange={(event) => {
                        updateOSConfig({
                            listMode: event?.target?.value as any
                        })
                    }}
                >
                    {ListModeArr.map((view) => (
                        <SelectItem key={view.value}>
                            {t(view.label)}
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
