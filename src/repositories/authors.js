import {api} from '../config';

/**
 * Fetches the the current list of authors
 * @returns {Promise}
 */
export function getListOfAuthors() {
    return new Promise((resolve, reject) => {
        api.get('authors/search').then(response => {
            resolve(response.data);
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}
