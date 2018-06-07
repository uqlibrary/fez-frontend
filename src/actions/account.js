import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import * as routes from 'repositories/routes';
import Raven from 'raven-js';

import Cookies from 'js-cookie';
import {SESSION_COOKIE_NAME} from 'config/general';

/**
 * Loads the user's account and author details into the application
 * @returns {function(*)}
 */
export function loadCurrentAccount() {
    return dispatch => {
        dispatch({type: actions.CURRENT_ACCOUNT_LOADING});

        let currentAuthor = null;

        // load UQL account (based on token)
        return get(routes.CURRENT_ACCOUNT_API())
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
                return get(routes.CURRENT_AUTHOR_API());
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
                return get(routes.AUTHOR_DETAILS_API({userId: currentAuthor.aut_org_username || currentAuthor.aut_student_username}));
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
    Cookies.remove(SESSION_COOKIE_NAME);

    return dispatch => {
        dispatch({type: actions.CURRENT_ACCOUNT_ANONYMOUS});
    };
}
