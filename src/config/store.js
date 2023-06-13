import { applyMiddleware, compose, createStore } from 'redux';
import { createReduxHistoryContext } from 'redux-first-history';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import { publicationEnhancer, saveReducerOnSessionExpired, journalSearchKeywordsEnhancer } from 'middleware';
import rootReducer from '../reducer';
import { history } from './history';

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
    history: history,
    selectRouterState: state => state.get('router'),
});

export const reducers = rootReducer({ routerReducer });

export const getStore = (initialState = Immutable.Map()) => {
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(
        reducers,
        initialState,
        composeEnhancer(
            applyMiddleware(
                routerMiddleware,
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

export const reduxHistory = createReduxHistory(store);
