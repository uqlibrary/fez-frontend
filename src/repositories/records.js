import {api} from 'config';

/**
 * Submits the metadata for approval
 * @returns {Promise}
 */
export function postRecord(data) {
    return new Promise((resolve, reject) => {
        api.post('records', data).then(response => {
            resolve(response.data);
        }).catch(e => {
            reject(e);
        });
    });
}

export function patchRecord(data) {
    return new Promise((resolve, reject) => {
        api.patch('records', data).then(response => {
            resolve(response.data);
        }).catch(e => {
            reject(e);
        });
    });
}
