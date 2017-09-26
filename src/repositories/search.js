import {get} from './generic';
import * as routes from './routes';

/**
 * Fetches publications from internal storage
 * @param queryString
 * @param titleOnly
 * @returns {Promise}
 */
export function getSearchInternal(searchQuery) {
    return get(routes.SEARCH_INTERNAL_RECORDS_API({searchQuery: searchQuery, pageSize: 5}));
}

/**
 * Fetches publications from internal storage
 * @param source {string} - wos|crossref|pubmed|scopus
 * @param searchQuery {string} - title or doi/pubmed id
 * @returns {Promise}
 */
export function getSearchExternal(source, searchQuery) {
    return get(routes.SEARCH_EXTERNAL_RECORDS_API({source: source, searchQuery: searchQuery}));
}
