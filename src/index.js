/* eslint-disable */

// External
import {AppContainer} from 'react-hot-loader';
import {applyMiddleware, compose, createStore} from 'redux';
import {createBrowserHistory, createHashHistory} from 'history';
import {routerMiddleware, connectRouter} from 'connected-react-router/immutable';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import Immutable from 'immutable';
import React from 'react';
import ReactDOM from 'react-dom';

// Tap fix for material-ui
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// Internal
import Root from './Root';
import rootReducer from './reducer';
import 'sass/index.scss';

let history;

if (process.env.NODE_ENV === 'production') {
    history = createBrowserHistory();
} else {
    history = createHashHistory();
}

// TODO: testing analytics with middleware, does it actually pass data to Analytics???

(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-4365437-1', 'auto');

(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PX9H7R');


const analytics = () => next => action => {
    dataLayer = dataLayer || [];
    dataLayer.push({
        event: action.type,
        payload: action.payload
    });

    console.log(action.type);

    var fieldObject = {
        hitType: 'event',
        eventAction: action.type
    };


    ga('send', 'pageview');
    ga('send', fieldObject);

    return next(action);
};

const initialState = Immutable.Map();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    connectRouter(history)(rootReducer),
    initialState,
    composeEnhancer(
        applyMiddleware(
            routerMiddleware(history),
            analytics,
            thunk
        ),
    ),
);

// Import mock data if required
if (process.env.NODE_ENV !== 'production' && process.env.USE_MOCK) {
    require('./mock');
}

const render = () => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <Root history={history} />
            </Provider>
        </AppContainer>,
        document.getElementById('react-root')
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
        store.replaceReducer(connectRouter(history)(rootReducer));
    });
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}

