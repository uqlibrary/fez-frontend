import axios from 'axios';
import Cookies from 'js-cookie';
import { setupCache } from 'axios-cache-interceptor';
import { API_URL, SESSION_COOKIE_NAME, SESSION_USER_GROUP_COOKIE_NAME, TOKEN_NAME } from './general';
import { store } from 'config/store';
import { logout } from 'actions/account';
import { showAppAlert } from 'actions/app';
import locale from 'locale/global';
import * as Sentry from '@sentry/react';
import param from 'can-param';
import { pathConfig } from 'config/pathConfig';
import { isTest } from '../helpers/general';

let apiClient = axios.create({
    baseURL: API_URL,
    crossdomain: true,
});

if (!isTest()) {
    // note: axios-cache-interceptor is not compatible with tests
    // upon updating it or changing config settings, make sure to test it using prodtest env while having "debug" config
    // key uncommented below (make sure to disable stripping of console functions in webpack-dist.config.js too)
    apiClient = setupCache(apiClient, {
        // debug: dc,
        ttl: 15 * 60 * 1000,
    });

    // the place the below is declared matters - see https://axios-cache-interceptor.js.org/guide/interceptors
    const nonCachedRoutes = ['records/search', 'orcid'];
    apiClient.interceptors.request.use(request => {
        if (
            request.cache &&
            // disabled it when querystring params are present or when it partially matches a non cached route
            (Object.keys(request.params || {}).length || nonCachedRoutes.find(route => request.url.includes(route)))
        ) {
            // disabled cache
            request.cache = false;
            return request;
        }
        return request;
    });
}

export const api = apiClient;

export const sessionApi = axios.create({
    baseURL: API_URL,
    crossdomain: true,
});

// need to generate a new token for each request otherwise if you try a new request with the old token,
// axios will appear to cancel your request automatically
export const generateCancelToken = () => {
    const CancelToken = axios.CancelToken;
    return CancelToken.source();
};

export const setupDefaults = () => {
    // If there is a local cookie available, then set the api headers for x-uql-token
    if (!!Cookies.get(SESSION_COOKIE_NAME) && !!Cookies.get(SESSION_USER_GROUP_COOKIE_NAME)) {
        api.defaults.headers.common[TOKEN_NAME] = Cookies.get(SESSION_COOKIE_NAME);
        sessionApi.defaults.headers.common[TOKEN_NAME] = Cookies.get(SESSION_COOKIE_NAME);
    }
    // allow us to safely force a given SESSION_COOKIE_NAME during development
    if (process.env.NODE_ENV === 'development' && !!process.env.SESSION_COOKIE_NAME) {
        api.defaults.headers.common[TOKEN_NAME] = process.env.SESSION_COOKIE_NAME;
        sessionApi.defaults.headers.common[TOKEN_NAME] = process.env.SESSION_COOKIE_NAME;
    }
};
setupDefaults();

api.isCancel = axios.isCancel; // needed for cancelling requests and the instance created does not have this method

export let lastRequest = null;
let isGet = null;
api.interceptors.request.use(request => {
    lastRequest = request;
    isGet = request.method === 'get';
    if (
        (request.url?.includes('records/search') || request.url?.includes('records/export')) &&
        !!request.params &&
        !!request.params.mode &&
        request.params.mode === 'advanced'
    ) {
        request.paramsSerializer = params => {
            return param(params);
        };
    }
    return request;
});

const reportToSentry = error => {
    let detailedError = '';
    if (error.response) {
        detailedError = `Data: ${JSON.stringify(error.response.data)}; Status: ${
            error.response.status
        }; Headers: ${JSON.stringify(error.response.headers)}`;
    } else {
        detailedError = `Something happened in setting up the request that triggered an Error: ${error.message}`;
    }

    Sentry.withScope(scope => {
        scope.setExtras({ error: detailedError });
        Sentry.captureException(error);
    });
};

/**
 * Return an instance of an alike in built-in Error class with a public message param and additional given properties
 *
 * @param error
 * @param extras
 * @return {{}}
 */
export const createSentryFriendlyError = (message, extras = {}) =>
    new (class {
        constructor(message) {
            Object.assign(this, { ...extras, message, stack: new Error(message).stack });
        }
    })(message);

api.interceptors.response.use(
    response => {
        if (!isGet) {
            const promise = Promise.resolve(response.status === 201 ? response : response.data);
            return api.store?.clear ? api.store?.clear().then(() => promise) : promise;
        }
        return Promise.resolve(response.data);
    },
    error => {
        const reportHttpStatusToSentry = [422, 500];
        if (
            !!error &&
            !!error.response &&
            !!error.response.status &&
            reportHttpStatusToSentry.indexOf(error.response.status) !== -1
        ) {
            reportToSentry(error);
        }

        // 403 for tool api lookup is handled in actions/thirdPartyLookupTool.js
        let errorMessage = null;
        if (
            !!error &&
            !!error.config &&
            (!error.config.url || !error.config.url.includes(pathConfig.admin.thirdPartyTools.slice(1)))
        ) {
            if (!!error.response && !!error.response.status && error.response.status === 403) {
                if (!!Cookies.get(SESSION_COOKIE_NAME)) {
                    Cookies.remove(SESSION_COOKIE_NAME, { path: '/', domain: '.library.uq.edu.au' });
                    Cookies.remove(SESSION_USER_GROUP_COOKIE_NAME, { path: '/', domain: '.library.uq.edu.au' });
                    delete api.defaults.headers.common[TOKEN_NAME];
                }

                if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'cc') {
                    global.mockActionsStore.dispatch(logout());
                } else {
                    store.dispatch(logout());
                }
            }

            if (!!error.message && !!error.response && !!error.response.status && error.response.status === 500) {
                errorMessage =
                    ((error.response || {}).data || {}).message || locale.global.errorMessages[error.response.status];
                if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'cc') {
                    global.mockActionsStore.dispatch(showAppAlert(error.response.data));
                } else {
                    store.dispatch(showAppAlert(error.response.data));
                }
            } else if (!!error.response && !!error.response.status) {
                errorMessage = locale.global.errorMessages[error.response.status];
                if ([410, 422].includes(error.response.status)) {
                    errorMessage = {
                        ...errorMessage,
                        ...error.response.data,
                    };
                }
            }
        }

        if (!!errorMessage) {
            return Promise.reject(
                createSentryFriendlyError(errorMessage?.message || null, {
                    request: error.request,
                    ...errorMessage,
                    // allow the original error message to be handled further down the stack
                    ...(error.response?.data ? { original: error.response.data } : {}),
                }),
            );
        } else {
            reportToSentry(error);
            return Promise.reject(error);
        }
    },
);
