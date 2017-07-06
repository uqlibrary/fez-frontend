// Repositories
import {searchDoiEndpoint, searchPubmedEndpoint, searchTitleEndpoint} from 'repositories/publicationSearch';

// Types
export const DOI_SEARCH_LOADING = 'DOI_SEARCH_LOADING';
export const DOI_SEARCH_COMPLETED = 'DOI_SEARCH_COMPLETED';
export const PUBMED_SEARCH_LOADING = 'PUBMED_SEARCH_LOADING';
export const PUBMED_SEARCH_COMPLETED = 'PUBMED_SEARCH_COMPLETED';
export const TITLE_SEARCH_LOADING = 'TITLE_SEARCH_LOADING';
export const TITLE_SEARCH_COMPLETED = 'TITLE_SEARCH_COMPLETED';

// search is performed on multiple sources, flatten search results into a single array of items

function flattenResults(results) {
    const flattenedResults = [].concat.apply([], results);
    return flattenedResults.slice(0, Math.min(5, flattenedResults.length));
}

/**
 * Performs a DOI search
 * @returns {function(*)}
 */
export function loadDoiResultsList(doi) {
    return dispatch => {
        dispatch({type: DOI_SEARCH_LOADING});
        searchDoiEndpoint(doi).then(results => {
            dispatch({
                type: DOI_SEARCH_COMPLETED,
                payload: flattenResults(results)
            });
        }).catch(() => {
            // throw(error);
            // TODO: send loading fail action
            dispatch({
                type: DOI_SEARCH_COMPLETED,
                payload: []
            });
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
        searchPubmedEndpoint(pubMedId).then(results => {
            dispatch({
                type: PUBMED_SEARCH_COMPLETED,
                payload: flattenResults(results)
            });
        }).catch(() => {
            // throw(error);
            dispatch({
                type: PUBMED_SEARCH_COMPLETED,
                payload: []
            });
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
        searchTitleEndpoint(rekDisplayType, title).then(results => {
            dispatch({
                type: TITLE_SEARCH_COMPLETED,
                payload: flattenResults(results)
            });
        }).catch(() => {
            // throw(error);
            dispatch({
                type: TITLE_SEARCH_COMPLETED,
                payload: []
            });
        });
    };
}
