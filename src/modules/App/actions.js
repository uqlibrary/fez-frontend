// Repositories
import {getAccount as apiGetAccount} from 'repositories/account';

import {AUTH_URL} from 'config';

// Types
export const APP_ACCOUNT_LOADING = 'APP_ACCOUNT_LOADING';
export const APP_ACCOUNT_LOADED = 'APP_ACCOUNT_LOADED';

export const APP_MENU_DRAWER_TOGGLE = 'APP_MENU_DRAWER_TOGGLE';

export const APP_SNACKBAR_SHOW = 'CORE_SNACKBAR_SHOW';
export const APP_SNACKBAR_HIDE = 'CORE_SNACKBAR_HIDE';

/**
 * Loads the user's account into the application
 * @returns {function(*)}
 */
export function loadAccount() {
    return dispatch => {
        dispatch({type: APP_ACCOUNT_LOADING});
        apiGetAccount().then(account => {
            dispatch({
                type: APP_ACCOUNT_LOADED,
                payload: account
            });
        }).catch((error) => {
            if (error.hasOwnProperty(status) && error.status === 401) {
                const returnUrl = window.btoa(window.location.href);
                window.location.href = `${AUTH_URL}?return=${returnUrl}`;
            } else {
                throw(error);
            }
        });
    };
}

/**
 * Toggles the menu drawer
 * @param open
 * @returns {{type: string, payload: *}}
 */
export function toggleDrawer(open) {
    return {
        type: APP_MENU_DRAWER_TOGGLE,
        payload: open
    };
}

/**
 * Shows the snack bar
 * @param message
 * @returns {{type: string, payload: *}}
 */
export function showSnackbar(message) {
    return {
        type: APP_SNACKBAR_SHOW,
        payload: message
    };
}

/**
 * Hides the snack bar
 * @returns {{type: string}}
 */
export function hideSnackbar() {
    return {type: APP_SNACKBAR_HIDE};
}
