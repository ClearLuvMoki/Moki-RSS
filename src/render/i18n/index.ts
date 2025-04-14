import { LocaleEnum } from "@/domains/types/config";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./locales";

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: LocaleEnum.English,
  lng: LocaleEnum.English,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
