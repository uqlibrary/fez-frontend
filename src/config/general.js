// Authentication
export const SESSION_COOKIE_NAME = 'UQLID';
export const TOKEN_NAME = 'X-Uql-Token';

// URLS
// export const API_URL = process.env.NODE_ENV === 'development' ? 'http://dev-api.library.uq.edu.au:8050/' : 'https://api.library.uq.edu.au/staging/';
export const API_URL = 'https://api.library.uq.edu.au/staging/';
export const AUTH_URL_LOGIN = 'https://auth.library.uq.edu.au/login';
export const AUTH_URL_LOGOUT = 'https://auth.library.uq.edu.au/logout';

// Default values for createNewRecord
export const NEW_RECORD_DEFAULT_VALUES = {
    rek_object_type: 3,
    rek_status: 3,
    fez_record_search_key_ismemberof: [
        {rek_ismemberof: 'UQ:218198'}
    ]
};
