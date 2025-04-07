import type { ConfigType } from "@/domains/types/config";
import { LocaleEnum } from "@/domains/types/config";
import Channels from "@/src/domains/channel";
import { Select, SelectItem, addToast } from "@heroui/react";
import { MonitorCog, Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Inject from "../../inject";

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

const SystemContent = () => {
  const [config, setConfig] = useState<ConfigType>({
    locale: LocaleEnum.English,
    theme: "light",
    listMode: "magazine",
  });

  useEffect(() => {
    onInit();
  }, []);

  const onInit = useCallback(() => {
    Inject.invoke<null, ConfigType>(Channels.GetConfig).then(setConfig);
  }, []);

  const onUpdate = useCallback((config: Partial<ConfigType>) => {
    Inject.invoke<{ config: Partial<ConfigType> }, ConfigType>(Channels.UpdateConfig, {
      config,
    })
      .then((res) => {
        setConfig(res);
        addToast({
          title: "修改成功!",
          color: "success",
        });
      })
      .catch(() => {
        addToast({
          title: "修改失败!",
          color: "danger",
        });
      });
  }, []);

  return (
    <div>
      <h2 className="text-lg text-gray-700 font-semibold select-none mb-4">Language</h2>
      <Select
        placeholder={"Select language"}
        className="max-w-xs my-2"
        selectedKeys={[config?.locale]}
        onChange={(event) => {
          const value = event?.target?.value as any;
          onUpdate({ locale: value });
        }}
      >
        {LanguageArr.map((lang) => (
          <SelectItem key={lang.value}>{lang.label}</SelectItem>
        ))}
      </Select>
      <h2 className="text-lg text-gray-700 font-semibold select-none mb-4">Theme</h2>
      <Select
        placeholder={"Please select theme"}
        className="max-w-xs my-2"
        selectedKeys={[config?.theme]}
        onChange={(event) => {
          const value = event?.target?.value as any;
          onUpdate({ theme: value });
        }}
      >
        {ThemeArr.map((theme) => (
          <SelectItem key={theme.value} startContent={theme.icon}>
            {theme.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default SystemContent;
