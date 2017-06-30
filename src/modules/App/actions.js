// Repositories
import {getAccount as apiGetAccount} from 'repositories/account';

// Types
export const APP_ACCOUNT_LOADING = 'APP_ACCOUNT_LOADING';
export const APP_ACCOUNT_LOADED = 'APP_ACCOUNT_LOADED';
export const APP_ACCOUNT_ANONYMOUS = 'APP_ACCOUNT_ANONYMOUS';

export const APP_MENU_DRAWER_TOGGLE = 'APP_MENU_DRAWER_TOGGLE';

export const APP_SNACKBAR_SHOW = 'CORE_SNACKBAR_SHOW';
export const APP_SNACKBAR_HIDE = 'CORE_SNACKBAR_HIDE';

export const APP_LOADING_ERROR = 'APP_LOADING_ERROR';

export const APP_DIALOGBOX_HIDE = 'APP_DIALOGBOX_HIDE';
export const APP_DIALOGBOX_SHOW = 'APP_DIALOGBOX_SHOW';

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
        }).catch(error => {
            if (error.hasOwnProperty('response') && error.response !== null && typeof(error.response) !== 'undefined'
                && error.response.hasOwnProperty('status') && (error.response.status === 401 || error.response.status === 403)) {
                dispatch({type: APP_ACCOUNT_ANONYMOUS});
            } else {
                dispatch({
                    type: APP_LOADING_ERROR,
                    payload: error
                });
                // throw(error);
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

/**
 * Shows the dialog box
 * @param config
 * @returns {{type: string, payload: *}}
 */
export function showDialogBox(config) {
    return {
        type: APP_DIALOGBOX_SHOW,
        payload: config
    };
}

/**
 * Hides the dialog box
 * @param config
 * @returns {{type: string, payload: *}}
 */
export function hideDialogBox(config) {
    return {
        type: APP_DIALOGBOX_HIDE,
        payload: config
    };
}
