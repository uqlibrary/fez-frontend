import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router/immutable';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import { publicationEnhancer, saveReducerOnSessionExpired, journalSearchKeywordsEnhancer } from 'middleware';
import rootReducer from '../reducer';
import { history } from './history';

export const getStore = (initialState = Immutable.Map()) => {
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(
        rootReducer,
        initialState,
        composeEnhancer(
            applyMiddleware(
                routerMiddleware(history),
                thunk,
                publicationEnhancer,
                saveReducerOnSessionExpired,
                journalSearchKeywordsEnhancer,
            ),
        ),
    );

    if (window.Cypress) {
        window.__store__ = store;
    }

    return store;
};

export const store = getStore();
