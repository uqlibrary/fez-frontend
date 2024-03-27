import { applyMiddleware, compose, createStore } from 'redux';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import { publicationEnhancer, saveReducerOnSessionExpired, journalSearchKeywordsEnhancer } from 'middleware';
import rootReducer from '../reducer';

export const reducers = rootReducer();

export const getStore = (initialState = Immutable.Map()) => {
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(
        reducers,
        initialState,
        composeEnhancer(
            applyMiddleware(thunk, publicationEnhancer, saveReducerOnSessionExpired, journalSearchKeywordsEnhancer),
        ),
    );

    if (window.Cypress) {
        window.__store__ = store;
    }

    return store;
};

export const store = getStore();
