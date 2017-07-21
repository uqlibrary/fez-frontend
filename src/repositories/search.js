import {get} from './generic';

export const GET_SEARCH_INTERNAL_API = 'search/internal';
export const GET_SEARCH_EXTERNAL_API = 'search/external';

/**
 * Fetches publications from internal storage
 * @param queryString
 * @returns {Promise}
 */
export function getSearchInternal(queryString) {
    return get(`${GET_SEARCH_INTERNAL_API}?${queryString}`);
}

/**
 * Fetches publications from internal storage
 * @param source {string} - wos|crossref|pubmed|scopus
 * @param queryString {string}
 * @returns {Promise}
 */
export function getSearchExternal(source, queryString) {
    // TODO: search URL temp searches by title only.... UPDATE to search by doi/pubmed
    // TODO: display type to be removed... for search by title
    return get(`${GET_SEARCH_EXTERNAL_API}?source=${source}&rek_display_type=179&title=${queryString}`);
}

//
// /**
//  * Get URL to perform either internal or external searches
//  *  -   provide a valid source to perform external search
//  *  -   leave source to perform internal search
//  *
//  * @param querystring
//  * @param source
//  * @returns {string}
//  */
// export const getSearchUrl = (querystring, source) => {
//     if (isValidSource(source)) {
//         return encodeURI(`search/external?${querystring}&source=${source}`);
//     }
//
//     return encodeURI(`search/internal?${querystring}`);
// };
//
// /**
//  * Convert given search text to valid DOI/PUBMED/TITLE search query string
//  *
//  * @param searchText
//  * @param rekDisplayType
//  * @returns {string}
//  */
// export const convertToQueryString = (searchText, rekDisplayType = 179) => {
//     if (isDOIValue(searchText)) {
//         return `doi=${searchText}`;
//     } else if (isPubMedValue(searchText)) {
//         return `pub_med_id=${searchText}`;
//     } else {
//         return `rek_display_type=${rekDisplayType}&title=${searchText}`;
//     }
// };
//
