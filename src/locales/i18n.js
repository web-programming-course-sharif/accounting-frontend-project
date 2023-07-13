import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
//
import faLocales from './fa.json';

// ----------------------------------------------------------------------

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            fa: {translations: faLocales},
        },
        lng: localStorage.getItem('i18nextLng') || 'en',
        fallbackLng: 'en',
        debug: false,
        ns: ['translations'],
        defaultNS: 'translations',
        interpolation: {
            escapeValue: false
        },
    });