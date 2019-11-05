import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import {LocalizationLangs} from "./enum/localization";
import {LOCAL_STORAGE_LANG_KEY} from "./const/common";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./locales/dev/en/translation.json";
import translationRU from "./locales/dev/ru/translation.json";
import translationDE from "./locales/dev/de/translation.json";

const resources = {
  [LocalizationLangs.EN]: {
    translation: translationEN,
  },
  [LocalizationLangs.RU]: {
    translation: translationRU,
  },
  [LocalizationLangs.DE]: {
    translation: translationDE,
  },
};

const detectionOptions = {
  caches: ["localStorage"],
  lookupLocalStorage: LOCAL_STORAGE_LANG_KEY,
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    detection: detectionOptions,
    fallbackLng: LocalizationLangs.EN,
    react: {
      useSuspense: false,
    },
    resources,
  });

export default i18n;
