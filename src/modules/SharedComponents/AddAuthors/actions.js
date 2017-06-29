// Repositories
import {loadAuthorsData} from 'repositories/authors';

// Types
export const AUTHORS_LIST_UPDATED = 'AUTHORS_LIST_UPDATED';
export const AUTHORS_SEARCH_RESULTS_RESET = 'AUTHORS_SEARCH_RESULTS_RESET';
export const AUTHORS_SEARCH_COMPLETED = 'AUTHORS_SEARCH_COMPLETED';
export const IDENTIFIERS_SEARCH_COMPLETED = 'IDENTIFIERS_SEARCH_COMPLETED';
export const IDENTIFIERS_SEARCH_RESULTS_RESET = 'IDENTIFIERS_SEARCH_RESULTS_RESET';

/**
 * Updates the redux state with an empty author search results
 * @returns {{type: string}}
 */
export function clearAuthorsSearchResults() {
    return {
        type: AUTHORS_SEARCH_RESULTS_RESET
    };
}

/**
 * Updates the redux state with an empty identifier search results
 * @returns {{type: string}}
 */
export function clearIdentifiersSearchResults() {
    return {
        type: IDENTIFIERS_SEARCH_RESULTS_RESET
    };
}

/**
 * Updates the redux state with the latest authors list
 * @returns {{type: string, payload: array}}
 */
export function updateAuthorsList(authorsList) {
    return {
        type: AUTHORS_LIST_UPDATED,
        payload: authorsList
    };
}

export function performSearch(querystring, actionType) {
    return dispatch => {
        loadAuthorsData(querystring).then(authors => {
            let addUser = false;

            const formattedData = authors.map(author => {
                const username = author.aut_org_username ? ` (${author.aut_org_username})` : '';
                addUser = ((actionType === AUTHORS_SEARCH_COMPLETED) || (actionType === IDENTIFIERS_SEARCH_COMPLETED && username.length > 0));

                if (addUser) {
                    return {
                        identifier: author.aut_org_username || '',
                        label: `${author.aut_display_name}${username}`,
                        name: author.aut_display_name
                    };
                }

                return {};
            });

            dispatch({
                type: actionType,
                payload: formattedData
            });
        }).catch((error) => {
            throw(error);
        });
    };
}

/**
 * Searches for an author based on the querystring from the identifiers field
 * @returns {function(*)}
 */
export function searchFromIdentifiersField(querystring) {
    return performSearch(querystring, IDENTIFIERS_SEARCH_COMPLETED);
}

/**
 * Searches for an author based on the querystring from the authors field
 * @returns {function(*)}
 */
export function searchFromAuthorsField(querystring) {
    return performSearch(querystring, AUTHORS_SEARCH_COMPLETED);
}
