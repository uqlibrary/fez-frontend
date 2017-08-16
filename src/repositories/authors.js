import {api} from '../config';
import {get} from './generic';

export const GET_AUTHORS_SEARCH_API = 'fez-authors/search';
export const GET_CURRENT_AUTHOR_API = 'fez-authors';
export const GET_AUTHOR_DETAILS_API = 'authors/details';

/**
 * Fetches a list of authors based on search query
 * @param {string} searchValue
 * @returns {Promise}
 */
export function fetchAuthors(searchValue) {
    return new Promise((resolve, reject) => {
        const url = encodeURI(`${GET_AUTHORS_SEARCH_API}?query=${searchValue}`);
        api.get(url).then(response => {
            resolve(
                response.data.map((item) => {
                    item.displayName = item.aut_title + ' ' + item.aut_display_name +
                        (item.aut_org_username ? ' (' + item.aut_org_username + ')' : '');
                    return item;
                })
            );
        }).catch(error => {
            reject(error);
        });
    });
}

/**
 * Fetches currently logged in author
 * @returns {Promise}
 */
export function fetchCurrentAuthor() {
    return get(GET_CURRENT_AUTHOR_API);
}

/**
 * Fetches details for specified author
 * @returns {Promise}
 */
export function fetchAuthorDetails(authorId) {
    return get(`${GET_AUTHOR_DETAILS_API}/${authorId}`);
}
