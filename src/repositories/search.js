import {get} from './generic';
import {validation} from 'config';

export const GET_SEARCH_INTERNAL_API = 'search/internal';
export const GET_SEARCH_EXTERNAL_API = 'search/external';

/**
 * Get search type
 * @param queryString
 * @returns {string}
 */
function getSearchType(queryString) {
    let searchType = `title=${queryString}`;
    if (validation.isValidDOIValue(queryString)) {
        searchType = `doi=${queryString}`;
    } else if (validation.isValidPubMedValue(queryString)) {
        searchType = `id=pmid:${queryString}`;
    }

    return searchType;
}

/**
 * Fetches publications from internal storage
 * @param queryString
 * @param titleOnly
 * @returns {Promise}
 */
export function getSearchInternal(queryString) {
    const searchType = getSearchType(queryString);
    return get(`${GET_SEARCH_INTERNAL_API}?${searchType}&per_page=5`);
}

/**
 * Fetches publications from internal storage
 * @param source {string} - wos|crossref|pubmed|scopus
 * @param queryString {string} - title or doi/pubmed id
 * @returns {Promise}
 */
export function getSearchExternal(source, queryString) {
    const searchType = getSearchType(queryString);
    return get(`${GET_SEARCH_EXTERNAL_API}?source=${source}&${searchType}`);
}
