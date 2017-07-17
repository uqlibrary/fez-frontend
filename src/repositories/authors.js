import {get} from './generic';

export const GET_AUTHORS_SEARCH_API = 'authors/search';

/**
 * Fetches the the current list of authors
 * @param {string} searchValue
 * @returns {Promise}
 */
export function getAuthorsSearch(searchValue) {
    return get(`${GET_AUTHORS_SEARCH_API}?query=${searchValue}`);
}
