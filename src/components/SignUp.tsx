import React, {useState} from "react";
import {useTranslation} from "react-i18next";


// i18next.changeLanguage()

export const SignUp = () => {
    const { t } = useTranslation();
    const [lang, setLang] = useState('en');

    return (
        <div>
            {t('First Name')}
            <input placeholder={t('First Name')}/>
            <input placeholder={'Last Name'}/>
            <input placeholder={'Email Address'}/>
            <input placeholder={'Password'}/>
            {/*<button onClick={() => signUpApiCall({firstName: 'aaa', lastName: 'aaa', email: 'fakhimi.amirmohamad@gmail.com', password: 'aaaaaaaa'})}>Register</button>*/}
        </div>
    );
}