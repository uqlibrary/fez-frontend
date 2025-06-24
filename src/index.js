// External
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import * as Sentry from '@sentry/react';
import { useLocation, useNavigationType, createRoutesFromChildren, matchRoutes } from 'react-router-dom';
import { setup } from 'mock';

// pick utils
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

// Internal
import Root from './Root';
import AppErrorBoundary from './AppErrorBoundary';
import 'sass/index.scss';
import { store, reducers } from 'config/store';

// Increase default (10) event listeners to 30
require('events').EventEmitter.prototype._maxListeners = 30;

// Import mock data if required
if (process.env.BRANCH !== 'production' && process.env.USE_MOCK) {
    setup();
}

if (process.env.ENABLE_LOG) {
    Sentry.init({
        dsn: 'https://2e8809106d66495ba3023139b1bcfbe5@sentry.io/301681',
        integrations: [
            Sentry.reactRouterV6BrowserTracingIntegration({
                useEffect: React.useEffect,
                useLocation,
                useNavigationType,
                createRoutesFromChildren,
                matchRoutes,
            }),
        ],
        autoSessionTracking: true,
        environment: process.env.BRANCH,
        release: process.env.GIT_SHA,
        allowUrls: [/library\.uq\.edu\.au/],
        ignoreErrors: [
            // Ignore browser extension errors
            /window\.bannerNight/,
            /mce-visual-caret-hidden/,
            'Object Not Found Matching Id',
            'Network Error',
            'Request aborted',
            'timeout exceeded',
            'Failed to fetch',
        ],
        beforeBreadcrumb(breadcrumb, hint) {
            if (breadcrumb.category === 'xhr' && breadcrumb.data.method !== 'GET' && !!hint.xhr.__sentry_xhr__) {
                const data = {
                    ...breadcrumb.data,
                    requestPayload: hint.xhr.__sentry_xhr__.body,
                    response: hint.xhr.response,
                };
                return { ...breadcrumb, data };
            }
            return breadcrumb;
        },
    });
}

const render = () => {
    const root = createRoot(document.getElementById('react-root'));
    root.render(
        <AppErrorBoundary>
            <Provider store={store}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Root />
                </LocalizationProvider>
            </Provider>
        </AppErrorBoundary>,
    );
};

render();

// Hot reloading
if (module.hot) {
    // Reload components
    module.hot.accept('./Root', () => {
        render();
    });

    // Reload reducers
    module.hot.accept('./reducer', () => {
        store.replaceReducer(reducers);
    });
}
