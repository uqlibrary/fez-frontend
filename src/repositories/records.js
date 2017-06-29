import {api} from 'config';

/**
 * Submits the metadata for approval
 * @returns {Promise}
 */
export function submitRecord(data) {
    return new Promise((resolve, reject) => {
        api.post('records', data).then(response => {
            console.log(response);
            resolve(response.data);
        }).catch(e => {
            console.log('submitRecord:' + e);
            reject(e);
            // throw e;
        });
    });
}
