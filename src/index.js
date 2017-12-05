// External
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, compose, createStore} from 'redux';
import Immutable from 'immutable';
import {routerMiddleware, connectRouter} from 'connected-react-router/immutable';
import thunk from 'redux-thunk';
import {createBrowserHistory, createHashHistory} from 'history';

import {AppContainer} from 'react-hot-loader';

// Tap fix for material-ui
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// Internal
import Root from './Root';
import rootReducer from './reducer';
import 'sass/index.scss';

const history = process.env.BRANCH === 'production' || process.env.BRANCH === 'staging'
    ? createBrowserHistory()
    : createHashHistory();

const initialState = Immutable.Map();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    connectRouter(history)(rootReducer),
    initialState,
    composeEnhancer(
        applyMiddleware(
            routerMiddleware(history),
            thunk
        ),
    ),
);

// Import mock data if required
if (process.env.BRANCH !== 'production' && process.env.USE_MOCK) {
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
