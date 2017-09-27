import {
    getAccount,
    fetchCurrentAuthor,
    fetchAuthorDetails
} from 'repositories';
import * as actions from './actionTypes';

/**
 * Loads the user's account and author details into the application
 * @returns {function(*)}
 */
export function loadCurrentAccount() {
    return dispatch => {
        dispatch({type: actions.ACCOUNT_LOADING});

        let account = null;
        let currentAuthor = null;

        // load UQL account (based on token)
        getAccount().then(accountResponse => {
            account = accountResponse;
            dispatch({
                type: actions.ACCOUNT_LOADED,
                payload: accountResponse
            });

            // load current author details (based on token)
            dispatch({type: actions.ACCOUNT_AUTHOR_LOADING});
            return fetchCurrentAuthor();
        }).then(currentAuthorResponse => {
            // TODO: to be decommissioned when author/details will become a part of author api
            currentAuthor = currentAuthorResponse;
            dispatch({
                type: actions.ACCOUNT_AUTHOR_LOADED,
                payload: currentAuthorResponse
            });

            // load repository author details
            dispatch({type: actions.ACCOUNT_AUTHOR_DETAILS_LOADING});
            console.log(currentAuthor);
            return fetchAuthorDetails(currentAuthor.aut_org_username);
        }).then(authorDetailsResponse => {
            dispatch({
                type: actions.ACCOUNT_AUTHOR_DETAILS_LOADED,
                payload: authorDetailsResponse
            });
        }).catch(() => {
            if (!account) {
                dispatch({type: actions.ACCOUNT_ANONYMOUS});
            } else if (!currentAuthor) {
                dispatch({type: actions.ACCOUNT_AUTHOR_FAILED});
            }
            dispatch({type: actions.ACCOUNT_AUTHOR_DETAILS_FAILED});
        });
    };
}


