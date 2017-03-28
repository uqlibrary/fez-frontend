// Authentication
export const COOKIE_NAME = 'UQLID';
export const TOKEN_NAME = 'X-Uql-Token';

// URLS
export const API_URL = process.env.NODE_ENV === 'development' ? 'http://dev-api.library.uq.edu.au:8050/' : 'https://api.library.uq.edu.au/v1/';
export const AUTH_URL = 'https://auth.library.uq.edu.au/login';
