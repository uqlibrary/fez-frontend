import { applyMiddleware, compose, createStore } from 'redux';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import { publicationEnhancer, saveReducerOnSessionExpired, journalSearchKeywordsEnhancer } from 'middleware';
import rootReducer from '../reducer';

export const reducers = rootReducer();

export let storeInstance = null;
export const getStore = (state = {}) => {
    const composeEnhancer = window?.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    storeInstance = createStore(
        reducers,
        Immutable.Map(state),
        composeEnhancer(
            applyMiddleware(thunk, publicationEnhancer, saveReducerOnSessionExpired, journalSearchKeywordsEnhancer),
        ),
    );

    return storeInstance;
};

export const store = getStore();
