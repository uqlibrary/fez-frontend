import {api} from 'config';

/**
 * Fetches the user's account
 * @returns {Promise}
 */
export function getAccount() {
    return new Promise((resolve, reject) => {
        api.get('account').then(response => {
            if (response.data.hasSession === true) {
                resolve(response.data);
            } else {
                reject('You are not logged in.');
            }
            resolve(response.data);
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}
