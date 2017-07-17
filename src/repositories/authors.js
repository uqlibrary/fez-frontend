import {api} from '../config';

export const GET_AUTHORS_SEARCH_API = 'authors/search';

/**
 * Fetches the the current list of authors
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
