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
import { isDevEnv, isTest } from '../helpers/general';
import { FIELD_OF_RESEARCH_VOCAB_ID, AIATSIS_CODES_VOCAB_ID } from 'config/general';

let apiClient = axios.create({
    baseURL: API_URL,
    crossdomain: true,
});

if (!isDevEnv() && !isTest()) {
    // note: axios-cache-interceptor is not compatible with axios response mocks & tests
    // upon updating it or changing config settings, make sure to test it using prodtest env
    apiClient = setupCache(apiClient, {
        // the option below only works when importing from "axios-cache-interceptor.dev"
        // (make sure to disable stripping of console.* funcs in webpack-dist.config.json)
        // debug: dc,
        ttl: 15 * 60 * 1000,
    });

    // the place the below is declared matters - see https://axios-cache-interceptor.js.org/guide/interceptors
    const nonCachedRoutes = ['records/search', 'journals/search', 'orcid'];
    const ignoreServerHeaderRoutes = [`vocabularies?cvo_ids=${FIELD_OF_RESEARCH_VOCAB_ID},${AIATSIS_CODES_VOCAB_ID}`];
    apiClient.interceptors.request.use(request => {
        const queryStringParams = Object.keys(request.params || {});
        if (!!request.cache && ignoreServerHeaderRoutes.find(route => request.url.includes(route))) {
            request.cache.interpretHeader = false;
        } else if (
            !!request.cache &&
            // disabled it when querystring params are present or when it partially matches a non cached route
            (queryStringParams.length ||
                request.url.includes('?') ||
                nonCachedRoutes.find(route => request.url.includes(route)))
        ) {
            /* eslint-disable max-len */
            // dc(`disabling cache for: ${request.url}${queryStringParams.length ? `?${JSON.stringify(request.params)}` : ''}`);
            // disabled cache
            request.cache = false;
            return request;
        }
        /* eslint-disable max-len */
        // dc(`the following request will be cached: ${request.url}${queryStringParams.length ? `?${JSON.stringify(request.params)}` : ''}`);
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
        request.paramsSerializer = { serialize: params => param(params) };
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
 * @param message
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
        // 403 for tool api lookup is handled in actions/thirdPartyLookupTool.js
        const handlesErrorsInternally =
            !error?.config ||
            (error.config.url && error.config.url.includes(pathConfig.admin.thirdPartyTools.slice(1)));

        const reportHttpStatusToSentry = [422];
        if (!!error?.response?.status && reportHttpStatusToSentry.includes(error.response.status)) {
            reportToSentry(error);
        }

        let errorMessage = null;
        const errorStatus = error?.response?.status || -1;
        if (!handlesErrorsInternally) {
            if (errorStatus === 403) {
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

            if (!!error.message && errorStatus === 500) {
                errorMessage =
                    ((error.response || {}).data || {}).message || locale.global.errorMessages[error.response.status];
                if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'cc') {
                    global.mockActionsStore.dispatch(showAppAlert(error.response.data));
                } else {
                    store.dispatch(showAppAlert(error.response.data));
                }
            } else if (!!error.response && !!error.response.status) {
                const statusMessages = locale.global.errorMessages;
                errorMessage = statusMessages.hasOwnProperty(errorStatus)
                    ? statusMessages[errorStatus]
                    : statusMessages.generic;
                if ([410, 422].includes(errorStatus)) {
                    // override for these statuses
                    errorMessage = {
                        ...errorMessage,
                        ...error.response.data,
                    };
                }
            }
        }

        const shouldNotAppearInSentry =
            document.location.hostname === 'localhost' || // testing on AWS sometimes fires these
            [401, 403, 404, 410].includes(errorStatus) || // login expired - no notice required
            errorStatus === 0 || // catch those "the network request was interrupted" we see so much
            errorStatus === '0' || // don't know what format it comes in
            errorStatus === 500 || // api should handle these
            errorStatus === 502; // connection timed out - it happens, FE can't do anything about it
        if (!shouldNotAppearInSentry) {
            reportToSentry(error);
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
            return Promise.reject(error);
        }
    },
);
