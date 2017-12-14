import * as actions from './actionTypes';
import {get, patch} from 'repositories/generic';
import * as routes from 'repositories/routes';
import * as transformers from './transformers';
import {APP_URL} from 'config/general';

/**
 * Returns the authors list based on a query, filtered locally by filterBy function
 * @param {string} query passed on to api call
 * @param {function} filterBy function to filter/transform results from api list, eg users with org ids only
 * @returns {action}
 */
export function searchAuthors(query, filterBy) {
    return dispatch => {
        dispatch({type: actions.AUTHORS_LOADING});

        get(routes.AUTHORS_SEARCH_API({query: query}))
            .then(response => {
                return Promise.resolve(
                    response.data.data.map((item) => {
                        item.displayName = item.aut_title + ' ' + item.aut_display_name +
                            (item.aut_org_username ? ' (' + item.aut_org_username + ')' : '');
                        return item;
                    })
                );
            })
            .then((data) => {
                dispatch({
                    type: actions.AUTHORS_LOADED,
                    payload: filterBy ? data.filter(filterBy) : data
                });
            })
            .catch(error => {
                if (error.status === 403) dispatch({type: actions.CURRENT_ACCOUNT_ANONYMOUS});
                dispatch({
                    type: actions.AUTHORS_LOAD_FAILED,
                    payload: error
                });
            });
    };
}

/**
 * Update current author record
 * @param {string} authorId
 * @param {object} patch request
 * @returns {Promise}
 */
export function updateCurrentAuthor(authorId, data) {
    return dispatch => {
        dispatch({type: actions.CURRENT_AUTHOR_SAVING});

        return patch(routes.AUTHOR_API({authorId}), data)
            .then((response) => {
                dispatch({
                    type: actions.CURRENT_AUTHOR_SAVED,
                    payload: response.data
                });

                return Promise.resolve(response.data);
            })
            .catch(error => {
                if (error.status === 403) dispatch({type: actions.CURRENT_ACCOUNT_ANONYMOUS});

                dispatch({
                    type: actions.CURRENT_AUTHOR_SAVE_FAILED,
                    payload: error.message
                });

                return Promise.reject(error);
            });
    };
}

/**
 * Returns orcid access token for an author and updates author details with linked ORCID id
 * @param {string} userId
 * @param {string} authorId
 * @param {string} orcidCode - code return in query string from ORCID authorisation process
 * @returns {action}
 */
export function linkAuthorOrcidId(userId, authorId, orcidCode) {
    return dispatch => {
        dispatch({type: actions.CURRENT_AUTHOR_SAVING});

        let orcidId = null;

        // parameters required for AUTHOR_ORCID_DETAILS_API call
        const params = {
            code: orcidCode,
            redirUri: APP_URL
        };

        // get ORCID id for current user
        return get(routes.AUTHOR_ORCID_DETAILS_API({userId: userId, params: params}), false)
            .then((response) => {
                orcidId = response.data.orcid;
                if (!orcidId) return Promise.reject({message: 'ORCID id is missing in API response. '});
                const authorPatchRequest = transformers.getAuthorIdentifierOrcidPatchRequest(authorId, orcidId, response.data);
                // patch author record with corresponding ORCID id
                return patch(routes.AUTHOR_API({authorId}), authorPatchRequest);
            })
            .then((response) => {
                // author details saved successfully
                dispatch({
                    type: actions.CURRENT_AUTHOR_SAVED,
                    payload: response.data
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.CURRENT_AUTHOR_SAVE_FAILED,
                    payload: error.message
                });
            });
    };
}

/*
* Dispatch action to notify reducer to clean up current author saving state (eg progress, errors)
* @returns {action}
* */
export function resetSavingAuthorState() {
    return dispatch => {
        dispatch({type: actions.CURRENT_AUTHOR_SAVE_RESET});
    };
}
