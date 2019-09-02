// TODO: can load user preferences from cookies or local storage
// export const APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_LOADING =
//     'APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_LOADING';
// export const APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_LOADED =
//     'APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_LOADED';
// export const APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_HIDE =
//     'APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_HIDE';

import * as actions from './actionTypes';

/**
 * Hides possibly yours lure application-wide
 * @returns {action}
 */
export function hidePossiblyYourPublicationsLure() {
    return {
        type: actions.APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_HIDE,
    };
}

export function showAppAlert(appAlert) {
    return {
        type: actions.APP_ALERT_SHOW,
        payload: appAlert,
    };
}

export function dismissAppAlert() {
    return { type: actions.APP_ALERT_HIDE };
}

/**
 * Set redirect path for user to redirect
 * @param {string} redirectPath
 */
export function setRedirectPath(redirectPath) {
    return dispatch => {
        dispatch({
            type: actions.SET_REDIRECT_PATH,
            payload: redirectPath,
        });
    };
}

/**
 * Clears redirect path
 */
export function clearRedirectPath() {
    return dispatch => {
        dispatch({
            type: actions.CLEAR_REDIRECT_PATH,
        });
    };
}
