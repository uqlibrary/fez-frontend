import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router/immutable';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import { publicationEnhancer } from 'middleware';
import { saveReducerOnSessionExpired } from 'middleware';
import rootReducer from '../reducer';
import { history } from './history';

export const getStore = (initialState = Immutable.Map()) => {
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    return createStore(
        rootReducer,
        initialState,
        composeEnhancer(
            applyMiddleware(
                routerMiddleware(history),
                thunk,
                publicationEnhancer,
                saveReducerOnSessionExpired
            ),
        ),
    );
};

export const store = getStore();
