import i18next from "i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";
import {language_codes} from "./Variables";

const loadPath = process.env['REACT_APP_I18NEXUS_LOAD_PATH']!

i18next
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",

        ns: ["default"],
        defaultNS: "default",

        supportedLngs: language_codes,

        backend: {
            loadPath: loadPath
        }
    })