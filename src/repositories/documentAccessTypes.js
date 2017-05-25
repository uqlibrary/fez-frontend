import {api} from 'config';

/**
 * Fetches the document access types
 * @returns {Promise}
 */
export function loadDocumentAccessData() {
    return new Promise((resolve, reject) => {
        api.get('records/access-types').then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}
