import {api} from 'config';

/**
 * Fetches the the current list of authors
 * @returns {Promise}
 */
export function loadAuthorsData(querystring) {
    return new Promise((resolve, reject) => {
        api.get(`authors/search?query=${querystring}`).then(response => {
            resolve(response.data);
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}
