import {api} from '../config';

/**
 * Fetches the publication sub types
 * @returns {Promise}
 */
export function loadPublicationSubTypeList() {
    return new Promise((resolve, reject) => {
        api.get('records/sub/types').then(response => {
            resolve(response.data);
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}
