import * as actions from './actionTypes';
import { get, patch } from 'repositories/generic';
import { AUTHOR_API, AUTHOR_ORCID_DETAILS_API, SEARCH_AUTHOR_LOOKUP_API } from 'repositories/routes';
import { pathConfig } from 'config/pathConfig';
import { getAuthorIdentifierOrcidPatchRequest } from './transformers';

/**
 * Returns the authors list based on a query, filtered locally by filterBy function
 * @param {string} query passed on to api call
 * @param {function} filterBy function to filter/transform results from api list, eg users with org ids only
 * @returns {action}
 */
export function searchAuthors(query) {
    return dispatch => {
        dispatch({ type: actions.AUTHORS_LOADING });

        return get(SEARCH_AUTHOR_LOOKUP_API({ searchQuery: query }))
            .then(response => {
                dispatch({
                    type: actions.AUTHORS_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.AUTHORS_LOAD_FAILED,
                    payload: error.message,
                });
            });
    };
}

/**
 * Update current author record
 * @param {string|number} authorId
 * @param {object} patch request
 * @returns {Promise}
 */
export function updateCurrentAuthor(authorId, data) {
    return dispatch => {
        dispatch({ type: actions.CURRENT_AUTHOR_SAVING });

        return patch(AUTHOR_API({ authorId }), data)
            .then(response => {
                dispatch({
                    type: actions.CURRENT_AUTHOR_SAVED,
                    payload: response.data,
                });

                return Promise.resolve(response.data);
            })
            .catch(error => {
                dispatch({
                    type: actions.CURRENT_AUTHOR_SAVE_FAILED,
                    payload: error.message,
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
        if (!userId || !authorId || !orcidCode) {
            return Promise.reject(new Error(' ')).catch(error => {
                dispatch({
                    type: actions.CURRENT_AUTHOR_SAVE_FAILED,
                    payload: error.message,
                });
            });
        }

        dispatch({ type: actions.CURRENT_AUTHOR_SAVING });

        let orcidId = null;

        // parameters required for AUTHOR_ORCID_DETAILS_API call
        // TODO: redirUri should be moved to backend (API update pending)
        const params = {
            code: orcidCode,
            redirUri: pathConfig.authorIdentifiers.orcid.absoluteLink,
        };

        // get ORCID id for current user
        return get(AUTHOR_ORCID_DETAILS_API({ userId: userId, params: params }))
            .then(response => {
                orcidId = response.orcid;

                // response should contain orcid id
                if (!orcidId) {
                    return Promise.reject(new Error('ORCID id is missing in API response.'));
                }

                // patch author record with corresponding ORCID id
                const authorPatchRequest = getAuthorIdentifierOrcidPatchRequest(authorId, orcidId, response);
                return patch(AUTHOR_API({ authorId }), authorPatchRequest);
            })
            .then(response => {
                // author details saved successfully
                dispatch({
                    type: actions.CURRENT_AUTHOR_SAVED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.CURRENT_AUTHOR_SAVE_FAILED,
                    payload: error.message,
                });
            });
    };
}

/**
 * Dispatch action to notify reducer to clean up current author saving state (eg progress, errors)
 * @returns {action}
 */
export function resetSavingAuthorState() {
    return dispatch => {
        dispatch({ type: actions.CURRENT_AUTHOR_SAVE_RESET });
    };
}

export const clearAuthorsSuggestions = () => ({
    type: actions.CLEAR_AUTHORS_LIST,
});
