import {applyMiddleware, compose, createStore} from 'redux';
import {routerMiddleware, connectRouter} from 'connected-react-router/immutable';
import {createBrowserHistory, createHashHistory} from 'history';

import rootReducer from '../reducer';
import Immutable from 'immutable';
import thunk from 'redux-thunk';

export const history = process.env.BRANCH === 'production' || process.env.BRANCH === 'staging'
    ? createBrowserHistory()
    : createHashHistory();

const getStore = () => {
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    return createStore(
        connectRouter(history)(rootReducer),
        Immutable.Map(),
        composeEnhancer(
            applyMiddleware(
                routerMiddleware(history),
                thunk
            ),
        ),
    );
};

export const store = getStore();
