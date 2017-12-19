import axios from 'axios';
import Cookies from 'js-cookie';
import {setupCache} from 'axios-cache-adapter';
import {API_URL, SESSION_COOKIE_NAME, TOKEN_NAME} from './general';
import {store} from 'config/store';
import {logout} from 'actions/account';

export const cache = setupCache({
    maxAge: 15 * 60 * 1000,
    key: (request) => {
        return request.url + JSON.stringify(request.params);
    },
    exclude: {
        query: false,
        paths: [
            'external/records/search',
            'records/search?rule=lookup',
            'records/search?title=',
            'records/search?doi=',
            'records/search?id=pmid:',
            'orcid'
        ]
    },
});

export const api = axios.create({
    baseURL: API_URL,
    adapter: process.env.NODE_ENV === 'test' ? undefined : cache.adapter
});

// need to generate a new token for each request otherwise if you try a new request with the old token,
// axios will appear to cancel your request automatically
export const generateCancelToken = () => {
    const CancelToken = axios.CancelToken;
    return CancelToken.source();
};

api.defaults.headers.common[TOKEN_NAME] = Cookies.get(SESSION_COOKIE_NAME);
api.isCancel = axios.isCancel; // needed for cancelling requests and the instance created does not have this method

let isGet = null;
api.interceptors.request.use(request => {
    isGet = request.method === 'get';
    return request;
});

api.interceptors.response.use(response => {
    if (!isGet) {
        return cache.store.clear().then(() => Promise.resolve(response));
    }
    return response;
}, error => {
    if (error.response && error.response.status === 403) {
        if (process.env.NODE_ENV === 'test') {
            global.mockActionsStore.dispatch(logout());
        } else {
            store.dispatch(logout());
        }
    }

    const errorMessage = {
        status: error.response ? error.response.status : null,
        message: error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : `Request error with status code ${error.response.status}. `

    };
    return Promise.reject(errorMessage);
});
