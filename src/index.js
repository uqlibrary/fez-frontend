// External
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

// pick utils
import MomentUtils from '@date-io/moment';

// Internal
import Root from './Root';
import AppErrorBoundary from './AppErrorBoundary';
import 'sass/index.scss';
import { store, reduxHistory, reducers } from 'config/store';

// Increase default (10) event listeners to 30
require('events').EventEmitter.prototype._maxListeners = 30;

// Import mock data if required
if (process.env.BRANCH !== 'production' && process.env.USE_MOCK) {
    require('./mock');
}

if (process.env.ENABLE_LOG) {
    Sentry.init({
        dsn: 'https://2e8809106d66495ba3023139b1bcfbe5@sentry.io/301681',
        integrations: [
            new Integrations.BrowserTracing({
                routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
            }),
        ],
        autoSessionTracking: true,
        environment: process.env.BRANCH,
        release: process.env.GIT_SHA,
        allowUrls: [/library\.uq\.edu\.au/],
        ignoreErrors: ['Object Not Found Matching Id'],
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
                <LocalizationProvider dateAdapter={MomentUtils}>
                    <Root history={reduxHistory} />
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
