import React, {useEffect} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import {getToken} from "../global/Storages";
import {signUpApiCall} from "../global/ApiCalls";


export const SignUp = () => {
    return (
        <div>
            <input placeholder={'First Name'}/>
            <input placeholder={'Last Name'}/>
            <input placeholder={'Email Address'}/>
            <input placeholder={'Password'}/>
            <button onClick={() => signUpApiCall({firstName: 'aaa', lastName: 'aaa', email: 'fakhimi.amirmohamad@gmail.com', password: 'aaaaaaaa'})}>Register</button>
        </div>
    );
}