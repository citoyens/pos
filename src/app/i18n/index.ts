import i18n, { TFunction } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { esLocale } from "./es";
import { ptLocale } from "./pt";
import {
  enLocaleBaseTable,
  enLocaleDateRangePicker,
  enLocaleEmptyState,
  enLocaleLocationSelector,
  enLocaleMenu,
  enLocaleNotification,
  enLocaleRole,
  enLocaleTopBar,
  esLocaleBaseTable,
  esLocaleDateRangePicker,
  esLocaleEmptyState,
  esLocaleLocationSelector,
  esLocaleMenu,
  esLocaleNotification,
  esLocaleRole,
  esLocaleTopBar,
  ptLocaleBaseTable,
  ptLocaleDateRangePicker,
  ptLocaleEmptyState,
  ptLocaleLocationSelector,
  ptLocaleMenu,
  ptLocaleNotification,
  ptLocaleRole,
  ptLocaleTopBar,
} from "@foodology-co/alejandria";
import { enLocale } from "./en";

const initI18n = async (): Promise<TFunction> =>
  i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    .init({
      // the translations
      // (tip move them in a JSON file and import them,
      // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
      resources: {
        es: {
          translation: {
            ...esLocale,
            ...esLocaleDateRangePicker,
            ...esLocaleBaseTable,
            ...esLocaleTopBar,
            ...esLocaleLocationSelector,
            ...esLocaleNotification,
            ...esLocaleEmptyState,
            ...esLocaleMenu,
            ...esLocaleRole,
          },
        },
        pt: {
          translation: {
            ...ptLocale,
            ...ptLocaleDateRangePicker,
            ...ptLocaleBaseTable,
            ...ptLocaleTopBar,
            ...ptLocaleLocationSelector,
            ...ptLocaleNotification,
            ...ptLocaleEmptyState,
            ...ptLocaleMenu,
            ...ptLocaleRole,
          },
        },
        en: {
          translation: {
            ...enLocale,
            ...enLocaleDateRangePicker,
            ...enLocaleBaseTable,
            ...enLocaleTopBar,
            ...enLocaleLocationSelector,
            ...enLocaleNotification,
            ...enLocaleEmptyState,
            ...enLocaleMenu,
            ...enLocaleRole,
          },
        },
      },
      fallbackLng: "es",

      interpolation: {
        escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
      },
    });

export default initI18n;
