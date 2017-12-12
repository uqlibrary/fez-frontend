import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import * as routes from 'repositories/routes';

/**
 * Loads the user's account and author details into the application
 * @returns {function(*)}
 */
export function loadCurrentAccount() {
    return dispatch => {
        dispatch({type: actions.CURRENT_ACCOUNT_LOADING});

        let account = null;
        let currentAuthor = null;

        // load UQL account (based on token)
        get(routes.CURRENT_ACCOUNT_API())
            .then(account => {
                if (account.hasOwnProperty('hasSession') && account.hasSession === true) {
                    return Promise.resolve(account);
                } else {
                    return Promise.reject('Session expired. User is unauthorized.');
                }
            })
            .then(accountResponse => {
                account = accountResponse;
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
                return get(routes.AUTHOR_DETAILS_API({userId: currentAuthor.aut_org_username}));
            })
            .then(authorDetailsResponse => {
                dispatch({
                    type: actions.CURRENT_AUTHOR_DETAILS_LOADED,
                    payload: authorDetailsResponse
                });
            })
            .catch(error => {
                if (!account) {
                    dispatch({type: actions.CURRENT_ACCOUNT_ANONYMOUS});
                } else if (!currentAuthor) {
                    console.log(error);
                    dispatch({type: actions.CURRENT_AUTHOR_FAILED});
                }
                dispatch({type: actions.CURRENT_AUTHOR_DETAILS_FAILED});
            });
    };
}

export function logout() {
    console.log('logout!!!');
    return dispatch => {
        dispatch({type: actions.CURRENT_ACCOUNT_ANONYMOUS});
    };
}


