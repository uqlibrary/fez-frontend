import Immutable from 'immutable';

import {
    APP_ACCOUNT_LOADING,
    APP_ACCOUNT_LOADED,
    APP_MENU_DRAWER_TOGGLE,
    APP_SNACKBAR_HIDE,
    APP_SNACKBAR_SHOW
} from './actions';

// Immutable state
const initialState = Immutable.fromJS({
    account: {},
    accountLoaded: false,
    menuDrawerOpen: false,
    snackbar: {
        open: false,
        message: ''
    },
});

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case APP_ACCOUNT_LOADING:
            return state.set('accountLoading', true);
        case APP_ACCOUNT_LOADED:
            return state.set('account', Immutable.fromJS(action.payload)).set('accountLoaded', true);
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
