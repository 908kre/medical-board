"use client";
import { useCallback } from "react";
import i18n from "i18next";
import {
  useTranslation as useTranslationOrg,
  initReactI18next,
} from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import i18nConfig from "./config";

import ja from "./locales/ja.json";
import en from "./locales/en.json";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    debug: false,
    ...i18nConfig,
    resources: {
      ja,
      en,
    },
  });

export const useTranslation = () => {
  const { i18n, t } = useTranslationOrg();
  const setLanguage = useCallback((lang: string) => {
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, []);
  return { language: i18n.language, setLanguage, t };
};
export default i18n;
