import Immutable from 'immutable';

import {
    APP_ACCOUNT_LOADING,
    APP_ACCOUNT_LOADED,
    APP_ACCOUNT_ANONYMOUS,
    APP_MENU_DRAWER_TOGGLE,
    APP_SNACKBAR_HIDE,
    APP_SNACKBAR_SHOW,
    APP_LOADING_ERROR
} from './actions';

// Immutable state
const initialState = Immutable.fromJS({
    account: {},
    accountLoaded: false, // TODO: more indicative name to the variable - user might not have a session, eg anon user
    menuDrawerOpen: false,
    snackbar: {
        open: false,
        message: ''
    },
    error: {
        displayError: false,
        message: ''
    }
});

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case APP_LOADING_ERROR:
            return state.set('error', Immutable.fromJS(action.payload)).set('accountLoaded', true);
        case APP_ACCOUNT_LOADING:
            return state.set('accountLoading', true);
        case APP_ACCOUNT_LOADED:
            return state.set('account', Immutable.fromJS(action.payload)).set('accountLoaded', true);
        case APP_ACCOUNT_ANONYMOUS:
            return state.set('account', Immutable.fromJS(null)).set('accountLoaded', true);
        case APP_SNACKBAR_SHOW:
            return state.set('snackbar', Immutable.fromJS({
                open: true,
                message: action.payload
            }));
        case APP_SNACKBAR_HIDE:
            return state.set('snackbar', initialState.get('snackbar'));
        case APP_MENU_DRAWER_TOGGLE:
            return state.set('menuDrawerOpen', action.payload);
        default:
            return state;
    }
};

export default appReducer;
