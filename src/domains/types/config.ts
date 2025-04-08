export type ThemeType = "light" | "dark" | "system";
export type ListModeType = "magazine" | "card" | "masonry" | "list" | "compact";

export enum LocaleEnum {
  Chinese = "zh-CN",
  German = "de",
  Korean = "ko",
  Japanese = "ja",
  French = "fr",
  English = "en-US",
  Russian = "ru",
  Italian = "it",
}

export interface ConfigType {
  locale: LocaleEnum;
  theme: ThemeType;
  listMode: ListModeType;
}
