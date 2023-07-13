import i18n from "i18next";
// '@mui
import {enUS, faIR} from '@mui/material/locale';
import useSettings from "./useSettings";

// ----------------------------------------------------------------------

const LANGS = [
    {
        label: 'English',
        value: 'en',
        systemValue: enUS,
        icon: '/icons/countries/england.svg',
    },
    {
        label: 'Persian',
        value: 'fa',
        systemValue: faIR,
        icon: '/icons/countries/iran.svg',
    },
];

export default function useLocales() {
    const langStorage = localStorage.getItem('i18nextLng');
    const currentLang = LANGS.find((_lang) => _lang.value === langStorage) || LANGS[1];

    const { changeDirection } = useSettings();

    const handleChangeLanguage = (newlang) => {
        i18n.changeLanguage(newlang)

        if (newlang === 'fa')
            changeDirection('rtl')
        else
            changeDirection('ltr')
    };

    return {
        onChangeLang: handleChangeLanguage,
        currentLang,
        allLang: LANGS,
    };
}
