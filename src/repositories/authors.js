import {api} from 'config';
import {authorsList} from '../mock/data/authors';

/**
 * TODO: Remove the USE_MOCK if statement once endpoint is in staging
 * Fetches the the current list of authors
 * @returns {Promise}
 */
export function loadAuthorsData() {
    if (process.env.USE_MOCK) {
        return new Promise((resolve, reject) => {
            api.get('authors/search').then(response => {
                resolve(response.data);
            }).catch(e => {
                reject(e);
                throw e;
            });
        });
    } else {
        return new Promise((resolve) => {
            resolve(authorsList);
        });
    }
}
