import {createContext, useEffect, useReducer} from 'react';
import PropTypes from 'prop-types';
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
    VERIFY: (state, action) => {
        const {user} = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        }
    },
    RESET_PASSWORD: (state, action) => {
        const {phoneNumber} = action.payload;

        return {
            ...state,
            phoneNumber,
        }
    },
    CHANGE_IS_PUBLIC: (state, action) => {
        const {user} = action.payload;

        return {
            ...state,
            user,
        }
    },
    CHANGE_PASSWORD: (state, action) => {
        const {user} = action.payload;

        return {
            ...state,
            user,
        }
    }
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
                const remeberMe = window.localStorage.getItem('remember') === 'true';

                if (accessToken && isValidToken(accessToken) && remeberMe) {
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
            type: 'VERIFY',
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
            type: 'CHANGE_IS_PUBLIC',
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
            type: 'CHANGE_PASSWORD',
            payload: {
                user
            }
        });
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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export {AuthContext, AuthProvider};
