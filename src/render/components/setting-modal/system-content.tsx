import type { ConfigType, ListModeType } from "@/domains/types/config";
import { LocaleEnum } from "@/domains/types/config";
import i18n from "@/render/i18n";
import Channels from "@/src/domains/channel";
import { Select, SelectItem, addToast } from "@heroui/react";
import { MonitorCog, Moon, Sun } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Inject from "../../inject";
import { useGlobalStore } from "../../store";

const LanguageArr = [
  { label: "中文 (简体)", value: LocaleEnum.Chinese },
  { label: "German", value: LocaleEnum.German },
  { label: "한국인", value: LocaleEnum.Korean },
  { label: "日本語", value: LocaleEnum.Japanese },
  { label: "Français", value: LocaleEnum.French },
  { label: "English", value: LocaleEnum.English },
  { label: "Русский", value: LocaleEnum.Russian },
  { label: "Italiano", value: LocaleEnum.Italian },
];

const ThemeArr = [
  { label: "theme.light", value: "light", icon: <Sun size={16} /> },
  { label: "theme.dark", value: "dark", icon: <Moon size={16} /> },
  { label: "theme.os-theme", value: "os", icon: <MonitorCog size={16} /> },
];

const ViewArr: { label: string; value: ListModeType }[] = [
  { label: "list-view.card", value: "card" },
  { label: "list-view.magazine", value: "magazine" },
];

const SystemContent = () => {
  const { t } = useTranslation();
  const { config, reloadConfig } = useGlobalStore();

  const onUpdate = useCallback(
    (config: Partial<ConfigType>) => {
      Inject.invoke<{ config: Partial<ConfigType> }, ConfigType>(Channels.UpdateConfig, {
        config,
      })
        .then(() => {
          reloadConfig();
          addToast({
            title: t("toast.success.index"),
            color: "success",
          });
        })
        .catch(() => {
          addToast({
            title: t("toast.failed.index"),
            color: "danger",
          });
        });
    },
    [t, reloadConfig],
  );

  return (
    <div>
      <h2 className="text-lg text-gray-700 font-semibold select-none my-4 dark:text-gray-200">
        {t("preferences.language")}
      </h2>
      <Select
        placeholder={t("preferences.language-placeholder")}
        className="max-w-xs my-2"
        selectedKeys={[config?.locale || LocaleEnum.English]}
        onChange={(event) => {
          const value = event?.target?.value as any;
          onUpdate({ locale: value });
          i18n.changeLanguage(value);
        }}
      >
        {LanguageArr.map((lang) => (
          <SelectItem key={lang.value}>{lang.label}</SelectItem>
        ))}
      </Select>
      <h2 className="text-lg text-gray-700 font-semibold select-none my-4 dark:text-gray-200">
        {t("theme.index")}
      </h2>
      <Select
        placeholder={t("theme.placeholder")}
        className="max-w-xs my-2"
        selectedKeys={[config?.theme!]}
        onChange={(event) => {
          const value = event?.target?.value as any;
          onUpdate({ theme: value });
        }}
      >
        {ThemeArr.map((theme) => (
          <SelectItem key={theme.value} startContent={theme.icon}>
            {t(theme.label)}
          </SelectItem>
        ))}
      </Select>
      <h2 className="text-lg text-gray-700 font-semibold select-none my-4 dark:text-gray-200">
        {t("list-view.index")}
      </h2>
      <Select
        placeholder={t("list-view.placeholder")}
        className="max-w-xs my-2"
        selectedKeys={[config?.listMode!]}
        onChange={(event) => {
          const value = event?.target?.value as any;
          onUpdate({ listMode: value });
        }}
      >
        {ViewArr.map((theme) => (
          <SelectItem key={theme.value}>{t(theme.label)}</SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default SystemContent;
