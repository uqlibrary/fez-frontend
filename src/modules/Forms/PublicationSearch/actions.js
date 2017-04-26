// Repositories
import {searchDoi, searchPubMed, searchTitle} from '../../../repositories/publicationSearchForm';

// Types
export const SEARCHING_DOI = 'SEARCHING_DOI';
export const DOI_SEARCH_COMPLETE = 'DOI_SEARCH_COMPLETE';
export const SEARCHING_PUBMED = 'SEARCHING_PUBMED';
export const PUBMED_SEARCH_COMPLETE = 'PUBMED_SEARCH_COMPLETE';
export const SEARCHING_TITLE = 'SEARCHING_TITLE';
export const TITLE_SEARCH_COMPLETE = 'TITLE_SEARCH_COMPLETE';

/**
 * Performs a DOI search
 * @returns {function(*)}
 */
export function doiSearch(doi) {
    return dispatch => {
        dispatch({type: SEARCHING_DOI});
        searchDoi(doi).then(authorList => {
            dispatch({
                type: DOI_SEARCH_COMPLETE,
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
export function pubMedSearch(pubMedId) {
    return dispatch => {
        dispatch({type: SEARCHING_PUBMED});
        searchPubMed(pubMedId).then(payload => {
            dispatch({
                type: PUBMED_SEARCH_COMPLETE,
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
export function titleSearch(rekDisplayType, title) {
    return dispatch => {
        dispatch({type: SEARCHING_TITLE});
        searchTitle(rekDisplayType, title).then(payload => {
            dispatch({
                type: DOI_SEARCH_COMPLETE,
                payload: payload
            });
        }).catch((error) => {
            throw(error);
        });
    };
}
