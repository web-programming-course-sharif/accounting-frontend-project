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

                if (accessToken && isValidToken(accessToken)) {
                    setSession(accessToken);

                    const response = await axios.get('/myAccount');


                    const user = response.data.data;

                    // user.email = user.email.String
                    user.displayName = user.firstName
                    // user = {
                    //   "id": "8864c717-587d-472a-929a-8e5f298024da-0",
                    //   "displayName": `${user.FirstName  } ${  user.LastName}`,
                    //   "email": user.Email.String,
                    //   "password": user.Password,
                    //   "firstName": user.FirstName,
                    //   "lastName": user.LastName,
                    //   "photoURL": "https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_default.jpg",
                    //   "phoneNumber": user.PhoneNumber,
                    //   "country": "United States",
                    //   "address": "90210 Broadway Blvd",
                    //   "state": "California",
                    //   "city": "San Francisco",
                    //   "about": "Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.",
                    //   "role": "admin",
                    //   "isPublic": true
                    // }

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
                // console.error(err);
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
            phoneNumber,
            password,
        });
        const {token: accessToken, user} = response.data.data;

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
        dispatch({type: 'LOGOUT'});
    };

    const verify = async (phoneNumber, code) => {
        const response = await axios.post('/verify', {
            "phone_number": phoneNumber,
            "code": code,
        });

        const {token: accessToken} = response.data.data;
        const user = response.data.data;

        // user.email = user.email.String
        user.displayName = user.firstName

        window.localStorage.setItem('accessToken', accessToken);

        dispatch({
            type: 'VERIFY',
            payload: {
                user
            },
        });
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'jwt',
                login,
                logout,
                register,
                verify,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export {AuthContext, AuthProvider};
