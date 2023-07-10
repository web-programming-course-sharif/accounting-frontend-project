import axios from "axios";
import {getToken, tokenKey} from "./Storages";
import {SignUpRequestType} from "./Types";

const customAxios = axios.create(
    {
        baseURL: 'http://192.168.235.147:3535',
        timeout: 5000
    }
);

axios.defaults.headers.common[tokenKey] = getToken();


export const signUpApiCall = (signUpRequest: SignUpRequestType) => customAxios.post('signUp', {
        email: signUpRequest.email,
        first_name: signUpRequest.firstName,
        last_name: signUpRequest.lastName,
        password: signUpRequest.password,
    }
)