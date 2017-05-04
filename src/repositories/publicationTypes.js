import {api} from '../config';
import {publicationTypeList} from '../mock/data/publicationTypes';

/**
 * TODO: Remove the USE_MOCK if statement once endpoint is in staging
 * Fetches the publication Types
 * @returns {Promise}
 */
export function loadPublicationTypesData() {
    if (process.env.USE_MOCK) {
        return new Promise((resolve, reject) => {
            api.get('records/types').then(response => {
                resolve(response.data);
            }).catch(e => {
                reject(e);
                throw e;
            });
        });
    } else {
        return new Promise((resolve) => {
            resolve(publicationTypeList);
        });
    }
}
