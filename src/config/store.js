import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware, connectRouter } from 'connected-react-router/immutable';
import { createBrowserHistory, createHashHistory } from 'history';

import rootReducer from '../reducer';
import Immutable from 'immutable';
import thunk from 'redux-thunk';

import { publicationEnhancer } from 'middleware';
import { saveReducerOnSessionExpired } from 'middleware';

export const history =
    process.env.USE_MOCK || process.env.BRANCH === 'production' || process.env.BRANCH === 'staging'
        ? createBrowserHistory()
        : createHashHistory();

export const getStore = (initialState = Immutable.Map()) => {
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    return createStore(
        connectRouter(history)(rootReducer),
        initialState,
        composeEnhancer(
            applyMiddleware(routerMiddleware(history), thunk, publicationEnhancer, saveReducerOnSessionExpired)
        )
    );
};

export const store = getStore();
