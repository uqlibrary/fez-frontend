import {api} from '../config';
import {publicationSubTypeList} from '../mock/data/publicationSubTypes';

/**
 * TODO: Remove the USE_MOCK if statement once endpoint is in staging
 * Fetches the publication sub types
 * @returns {Promise}
 */
export function loadPublicationSubTypeData() {
    if (process.env.USE_MOCK) {
        return new Promise((resolve, reject) => {
            api.get('records/sub/types').then(response => {
                resolve(response.data);
            }).catch(e => {
                reject(e);
                throw e;
            });
        });
    } else {
        return new Promise((resolve) => {
            resolve(publicationSubTypeList);
        });
    }
}
