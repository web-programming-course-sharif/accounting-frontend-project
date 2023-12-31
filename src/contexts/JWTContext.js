import {createContext, useEffect, useReducer} from 'react';
import PropTypes from 'prop-types';
import isString from "lodash/isString";
// utils
import axios from '../utils/axios';
import {isValidToken, setSession} from '../utils/jwt';

// ----------------------------------------------------------------------

const initialState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};

const handlers = {
    INITIALIZE: (state, action) => {
        const {isAuthenticated, user} = action.payload;
        return {
            ...state,
            isAuthenticated,
            isInitialized: true,
            user,
        };
    },
    LOGIN: (state, action) => {
        const {user} = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
    LOGOUT: (state) => ({
        ...state,
        isAuthenticated: false,
        user: null,
    }),
    REGISTER: (state, action) => {
        const {phoneNumber} = action.payload;

        return {
            ...state,
            isAuthenticated: false,
            phoneNumber,
        };
    },
    RESET_PASSWORD: (state, action) => {
        const {phoneNumber} = action.payload;

        return {
            ...state,
            phoneNumber,
        }
    },
    NEW_USER: (state, action) => {
        const {user} = action.payload;

        return {
            ...state,
            user,
        }
    },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
    ...initialState,
    method: 'jwt',
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    register: () => Promise.resolve(),
    verify: () => Promise.resolve(),
    resendCode: () => Promise.resolve(),
    resetPassword: () => Promise.resolve(),
    changeIsPublic: () => Promise.resolve(),
    changePassword: () => Promise.resolve(),
    changeProfile: () => Promise.resolve(),
    changeSocialLinks: () => Promise.resolve(),
    getAllBanks: () => Promise.resolve(),
    getAllCards: () => Promise.resolve(),
    addCard: () => Promise.resolve(),
    getAllCategories: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
    children: PropTypes.node,
};

function AuthProvider({children}) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const initialize = async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const rememberMe = window.localStorage.getItem('remember') === 'true';

                if (accessToken && isValidToken(accessToken) && rememberMe) {
                    setSession(accessToken);

                    const response = await axios.get('/myAccount');
                    const user = response.data.data;
                    user.displayName = `${user.firstName} ${user.lastName}`;

                    dispatch({
                        type: 'INITIALIZE',
                        payload: {
                            isAuthenticated: true,
                            user,
                        },
                    });
                } else {
                    dispatch({
                        type: 'INITIALIZE',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    });
                }
            } catch (err) {
                console.info('User is not authenticated')
                dispatch({
                    type: 'INITIALIZE',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                });
            }
        };

        initialize();
    }, []);

    const login = async (phoneNumber, password) => {
        const response = await axios.post('/login', {
            "phone_number": phoneNumber,
            password,
        });
        const {token: accessToken, user} = response.data.data;
        user.displayName = `${user.firstName} ${user.lastName}`;

        setSession(accessToken);
        dispatch({
            type: 'LOGIN',
            payload: {
                user,
            },
        });
    };

    const register = async (phoneNumber, password, firstName, lastName) => {
        const response = await axios.post('/signUp', {
            "phone_number": phoneNumber,
            password,
            "first_name": firstName,
            "last_name": lastName,
        });
        const getPhoneNumber = response.data.data;

        // window.localStorage.setItem('accessToken', accessToken);
        dispatch({
            type: 'REGISTER',
            payload: {
                phoneNumber: getPhoneNumber,
            },
        });
    };

    const logout = async () => {
        setSession(null);
        localStorage.removeItem('remember');
        dispatch({type: 'LOGOUT'});
    };

    const verify = async (phoneNumber, code) => {
        const response = await axios.post('/verify', {
            "phone_number": phoneNumber,
            "code": code,
        });
        const {token: accessToken, user} = response.data.data;
        user.displayName = `${user.firstName} ${user.lastName}`;

        window.localStorage.setItem('accessToken', accessToken);

        dispatch({
            type: 'LOGIN',
            payload: {
                user
            },
        });
    }

    const resendCode = async (phoneNumber) => {
        await axios.post('/resendCode', {
            "phone_number": phoneNumber,
        });
    };

    const resetPassword = async (phoneNumber) => {
        const response = await axios.post('/forgot', {
            "phone_number": phoneNumber,
        });
        const getPhoneNumber = response.data.data;

        dispatch({
            type: 'RESET_PASSWORD',
            payload: {
                phoneNumber: getPhoneNumber,
            },
        });
    };

    const changeIsPublic = async (isPublic) => {
        const response = await axios.post('/editProfileStatus', {
            "is_public": isPublic
        })

        const user = response.data.data;
        user.displayName = `${user.firstName} ${user.lastName}`;

        dispatch({
            type: 'NEW_USER',
            payload: {
                user
            },
        });
    };

    const changePassword = async (oldPassword, newPassword, confirmNewPassword) => {
        const response = await axios.post('/changePassword', {
            "old_password": oldPassword,
            "new_password": newPassword,
            "confirm_new_password": confirmNewPassword,
        });

        const user = response.data.data;
        user.displayName = `${user.firstName} ${user.lastName}`;

        dispatch({
            type: 'NEW_USER',
            payload: {
                user
            }
        });
    };

    const changeProfile = async (firstName, lastName, email, country, state, city, zipCode, address, about, photo) => {
        const formData = new FormData();
        formData.set('first_name', firstName);
        formData.set('last_name', lastName);
        formData.set('email', email);
        formData.set('country', country);
        formData.set('state', state);
        formData.set('city', city);
        formData.set('zip_code', zipCode);
        formData.set('address', address);
        formData.set('about', about);

        if (isString(photo))
            formData.set('photo', photo);
        else
            formData.set('photo', photo, photo.name);

        const response = await axios.post('/changeProfile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const user = response.data.data;
        console.log(user)
        user.displayName = `${user.firstName} ${user.lastName}`;

        dispatch({
            type: 'NEW_USER',
            payload: {
                user
            }
        });
    };

    const changeSocialLinks = async (facebookLink, instagramLink, linkedinLink, twitterLink) => {
        const response = await axios.post('/changeSocialLinks', {
            "facebook_link": facebookLink,
            "instagram_link": instagramLink,
            "linkedin_link": linkedinLink,
            "twitter_link": twitterLink,
        });

        const user = response.data.data;
        user.displayName = `${user.firstName} ${user.lastName}`;

        dispatch({
            type: 'NEW_USER',
            payload: {
                user
            }
        });
    };


    // Billing
    const getAllBanks = async () => {
        const response = await axios.post('/getAllBank', {});
        return response.data.data
    };

    const getAllCards = async () => {
        const response = await axios.post('/getAllCards', {});
        return response.data.data
    };

    const addCard = async (cardNumber, bankId, balance, name) => {
        console.log(cardNumber, bankId, balance, name)
        const response = await axios.post('/createCard', {
            "card_number": cardNumber,
            "bank_id": bankId,
            "balance": balance,
            "name": name,
        });

        return response.data.data
    };

    // income and expenses
    const getAllCategories = async () => {
        const response = await axios.post('/getAllCategory', {});
        return response.data.data
    };


    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'jwt',
                login,
                logout,
                register,
                verify,
                resendCode,
                resetPassword,
                changeIsPublic,
                changePassword,
                changeProfile,
                changeSocialLinks,
                getAllBanks,
                getAllCards,
                addCard,
                getAllCategories,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export {AuthContext, AuthProvider};
