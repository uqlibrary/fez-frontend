import {
    getAccount,
    fetchCurrentAuthor,
    fetchAuthorDetails
} from 'repositories';

export const ACCOUNT_LOADING = 'ACCOUNT_LOADING';
export const ACCOUNT_LOADED = 'ACCOUNT_LOADED';
export const ACCOUNT_ANONYMOUS = 'ACCOUNT_ANONYMOUS';

export const ACCOUNT_AUTHOR_LOADING = 'ACCOUNT_AUTHOR_LOADING';
export const ACCOUNT_AUTHOR_FAILED = 'ACCOUNT_AUTHOR_LOADING';
export const ACCOUNT_AUTHOR_LOADED = 'ACCOUNT_AUTHOR_LOADING';

export const ACCOUNT_AUTHOR_DETAILS_LOADING = 'ACCOUNT_AUTHOR_DETAILS_LOADING';
export const ACCOUNT_AUTHOR_DETAILS_FAILED = 'ACCOUNT_AUTHOR_DETAILS_FAILED';
export const ACCOUNT_AUTHOR_DETAILS_LOADED = 'ACCOUNT_AUTHOR_DETAILS_LOADED';

/**
 * Loads the user's account and author details into the application
 * @returns {function(*)}
 */
export function loadCurrentAccount() {
    return dispatch => {
        dispatch({type: ACCOUNT_LOADING});

        let account = null;
        let currentAuthor = null;

        // load UQL account (based on token)
        getAccount().then(accountResponse => {
            account = accountResponse;
            dispatch({
                type: ACCOUNT_LOADED,
                payload: accountResponse
            });

            // load current author details (based on token)
            dispatch({type: ACCOUNT_AUTHOR_LOADING});
            return fetchCurrentAuthor();
        }).then(currentAuthorResponse => {
            // TODO: to be decommissioned when author/details will become a part of author api
            currentAuthor = currentAuthorResponse;
            dispatch({
                type: ACCOUNT_AUTHOR_LOADED,
                payload: currentAuthorResponse
            });

            // load repository author details
            dispatch({type: ACCOUNT_AUTHOR_DETAILS_LOADING});
            return fetchAuthorDetails(currentAuthor.aut_org_username);
        }).then(authorDetailsResponse => {
            dispatch({
                type: ACCOUNT_AUTHOR_DETAILS_LOADED,
                payload: authorDetailsResponse
            });
        }).catch(() => {
            if (!account) {
                dispatch({type: ACCOUNT_ANONYMOUS});
            } else if (!currentAuthor) {
                dispatch({type: ACCOUNT_AUTHOR_FAILED});
                dispatch({type: ACCOUNT_AUTHOR_DETAILS_FAILED});
            }
        });
    };
}


