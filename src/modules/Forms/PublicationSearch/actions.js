// Repositories
import {searchDoiEndpoint, searchPubmedEndpoint, searchTitleEndpoint} from '../../../repositories/publicationSearchForm';

// Types
export const DOI_SEARCH = 'DOI_SEARCH';
export const DOI_SEARCH_COMPLETED = 'DOI_SEARCH_COMPLETED';
export const PUBMED_SEARCH = 'PUBMED_SEARCH';
export const PUBMED_SEARCH_COMPLETED = 'PUBMED_SEARCH_COMPLETED';
export const TITLE_SEARCH = 'TITLE_SEARCH';
export const TITLE_SEARCH_COMPLETED = 'TITLE_SEARCH_COMPLETED';

/**
 * Performs a DOI search
 * @returns {function(*)}
 */
export function loadDoiResultsList(doi) {
    return dispatch => {
        dispatch({type: DOI_SEARCH});
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
        dispatch({type: PUBMED_SEARCH});
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
        dispatch({type: TITLE_SEARCH});
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
