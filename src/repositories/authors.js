import {api} from '../config';
import {get} from './generic';
import * as routes from './routes';

/**
 * Fetches a list of authors based on search query
 * @param {string} searchValue
 * @returns {Promise}
 */
export function fetchAuthors(searchValue) {
    return new Promise((resolve, reject) => {
        const url = encodeURI(routes.AUTHORS_SEARCH_API({query: searchValue}));
        api.get(url).then(response => {
            resolve(
                response.data.data.map((item) => {
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
    return get(routes.CURRENT_AUTHOR_API());
}

/**
 * Fetches details for specified author
 * @returns {Promise}
 */
export function fetchAuthorDetails(userName) {
    return get(routes.AUTHOR_DETAILS_API({userId: userName}));
}
