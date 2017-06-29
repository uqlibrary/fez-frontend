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


/**
 * CURRENTLY GETTING A TYPE ERROR WHEN TRYING TO CONSOLIDATE THE CODE TO USE performSearch ABOVE
 * Searches for an author based on the querystring from the identifiers field
 * @returns {function(*)}
 */
export function searchFromIdentifiersField(querystring) {
    return dispatch => {
        loadAuthorsData(querystring).then(authors => {
            const formattedData = authors.map(author => {
                return {
                    identifier: author.aut_id,
                    label: `${author.aut_display_name} (UQ:${author.aut_id})`,
                    name: author.aut_display_name
                };
            });

            dispatch({
                type: IDENTIFIERS_SEARCH_COMPLETED,
                payload: formattedData
            });
        }).catch((error) => {
            throw(error);
        });
    };
}

/**
 * Searches for an author based on the querystring from the authors field
 * @returns {function(*)}
 */
export function searchFromAuthorsField(querystring) {
    return dispatch => {
        loadAuthorsData(querystring).then(authors => {
            const formattedData = authors.map(author => {
                return {
                    identifier: author.aut_id,
                    label: `${author.aut_display_name} (UQ:${author.aut_id})`,
                    name: author.aut_display_name
                };
            });

            dispatch({
                type: AUTHORS_SEARCH_COMPLETED,
                payload: formattedData
            });
        }).catch((error) => {
            throw(error);
        });
    };
}
