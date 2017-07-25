import {get} from './generic';
import {validation} from 'config';

export const GET_SEARCH_INTERNAL_API = 'search/internal';
export const GET_SEARCH_EXTERNAL_API = 'search/external';

/**
 * Fetches publications from internal storage
 * @param queryString
 * @returns {Promise}
 */
export function getSearchInternal(queryString) {
    // TODO: check api for internal search when it's ready which parameters to include in query string
    return get(`${GET_SEARCH_INTERNAL_API}?${queryString}`);
}

/**
 * Fetches publications from internal storage
 * @param source {string} - wos|crossref|pubmed|scopus
 * @param queryString {string} - title or doi/pubmed id
 * @returns {Promise}
 */
export function getSearchExternal(source, queryString) {
    let searchType = `title=${queryString}&rek_display_type=179`;
    if (validation.isValidDOIValue(queryString)) {
        searchType = `doi=${queryString}`;
    } else if (validation.isValidPubMedValue(queryString)) {
        searchType = `id=pmid:${queryString}`;
    }
    return get(`${GET_SEARCH_EXTERNAL_API}?source=${source}&${searchType}`);
}
