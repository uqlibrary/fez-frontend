import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import {CURRENT_ACCOUNT_API, CURRENT_AUTHOR_API, AUTHOR_DETAILS_API} from 'repositories/routes';
import Raven from 'raven-js';
import {sessionApi} from 'config';
import Cookies from 'js-cookie';
import {SESSION_COOKIE_NAME, TOKEN_NAME} from 'config/general';
import {api} from 'config';

/**
 * Loads the user's account and author details into the application
 * @returns {function(*)}
 */
export function loadCurrentAccount() {
    return dispatch => {
        dispatch({type: actions.CURRENT_ACCOUNT_LOADING});

        let currentAuthor = null;

        // load UQL account (based on token)
        return get(CURRENT_ACCOUNT_API())
            .then(account => {
                if (account.hasOwnProperty('hasSession') && account.hasSession === true) {
                    if(process.env.ENABLE_LOG) Raven.setUserContext({id: account.id});
                    return Promise.resolve(account);
                } else {
                    dispatch({type: actions.CURRENT_ACCOUNT_ANONYMOUS});
                    return Promise.reject(new Error('Session expired. User is unauthorized.'));
                }
            })
            .then(accountResponse => {
                dispatch({
                    type: actions.CURRENT_ACCOUNT_LOADED,
                    payload: accountResponse
                });

                // load current author details (based on token)
                dispatch({type: actions.CURRENT_AUTHOR_LOADING});
                return get(CURRENT_AUTHOR_API());
            })
            .then(currentAuthorResponse => {
                // TODO: to be decommissioned when author/details will become a part of author api
                currentAuthor = currentAuthorResponse.data;
                dispatch({
                    type: actions.CURRENT_AUTHOR_LOADED,
                    payload: currentAuthor
                });

                // load repository author details
                dispatch({type: actions.CURRENT_AUTHOR_DETAILS_LOADING});
                return get(AUTHOR_DETAILS_API({userId: currentAuthor.aut_org_username || currentAuthor.aut_student_username}));
            })
            .then(authorDetailsResponse => {
                dispatch({
                    type: actions.CURRENT_AUTHOR_DETAILS_LOADED,
                    payload: authorDetailsResponse
                });
            })
            .catch(error => {
                if (!currentAuthor) {
                    dispatch({
                        type: actions.CURRENT_AUTHOR_FAILED,
                        payload: error.message
                    });
                }
                dispatch({
                    type: actions.CURRENT_AUTHOR_DETAILS_FAILED,
                    payload: error.message
                });
            });
    };
}

export function logout() {
    if (!!Cookies.get(SESSION_COOKIE_NAME)) {
        Cookies.remove(SESSION_COOKIE_NAME, {path: '/', domain: '.library.uq.edu.au'});
        delete api.defaults.headers.common[TOKEN_NAME];
    }

    return dispatch => {
        dispatch({type: actions.CURRENT_ACCOUNT_ANONYMOUS});
    };
}

/**
 * @param string reducerToSave
 */
export function checkSession(reducerToSave = 'form') {
    return (dispatch) => {
        return sessionApi.get(CURRENT_ACCOUNT_API().apiUrl)
            .then(() => {
                dispatch({type: actions.CURRENT_ACCOUNT_SESSION_VALID});
            })
            .catch(() => {
                dispatch({
                    type: actions.CURRENT_ACCOUNT_SESSION_EXPIRED,
                    payload: reducerToSave
                });
            });
    };
}

export function clearSessionExpiredFlag() {
    return dispatch => {
        dispatch({type: actions.CLEAR_CURRENT_ACCOUNT_SESSION_FLAG});
    };
}
