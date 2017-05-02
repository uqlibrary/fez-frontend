import {api} from '../config';

/**
 * Fetches the publication Types
 * @returns {Promise}
 */
export function loadPublicationTypesData() {
    return new Promise((resolve, reject) => {
        api.get('records/types').then(response => {
            resolve(response.data);
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}
