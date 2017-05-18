import {api} from 'config';

/**
 * Fetches the publication sub types
 * @returns {Promise}
 */
export function loadPublicationSubTypeData(id) {
    return new Promise((resolve, reject) => {
        api.get(`vocabularies/${id}`).then(response => {
            resolve(response.data);
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}
