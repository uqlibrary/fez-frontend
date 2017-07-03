// Repositories
import {searchDoiEndpoint, searchPubmedEndpoint, searchTitleEndpoint} from 'repositories/publicationSearch';

// Types
export const DOI_SEARCH_LOADING = 'DOI_SEARCH_LOADING';
export const DOI_SEARCH_COMPLETED = 'DOI_SEARCH_COMPLETED';
export const PUBMED_SEARCH_LOADING = 'PUBMED_SEARCH_LOADING';
export const PUBMED_SEARCH_COMPLETED = 'PUBMED_SEARCH_COMPLETED';
export const TITLE_SEARCH_LOADING = 'TITLE_SEARCH_LOADING';
export const TITLE_SEARCH_COMPLETED = 'TITLE_SEARCH_COMPLETED';

/**
 * Performs a DOI search
 * @returns {function(*)}
 */
export function loadDoiResultsList(doi) {
    return dispatch => {
        dispatch({type: DOI_SEARCH_LOADING});
        searchDoiEndpoint(doi).then(authorList => {
            dispatch({
                type: DOI_SEARCH_COMPLETED,
                payload: authorList
            });
        }).catch((error) => {
            throw(error);
        });
    };
}

/**
 * Performs a pubmed ID search
 * @returns {function(*)}
 */
export function loadPubmedResultsList(pubMedId) {
    return dispatch => {
        dispatch({type: PUBMED_SEARCH_LOADING});
        searchPubmedEndpoint(pubMedId).then(payload => {
            dispatch({
                type: PUBMED_SEARCH_COMPLETED,
                payload: payload
            });
        }).catch((error) => {
            throw(error);
        });
    };
}

/**
 * Performs a Title search
 * @returns {function(*)}
 */
export function loadTitleResultsList(rekDisplayType, title) {
    return dispatch => {
        dispatch({type: TITLE_SEARCH_LOADING});
        searchTitleEndpoint(rekDisplayType, title).then(payload => {
            dispatch({
                type: TITLE_SEARCH_COMPLETED,
                payload: payload
            });
        }).catch((error) => {
            throw(error);
        });
    };
}
