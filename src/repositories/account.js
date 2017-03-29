import {api} from 'config';

/**
 * Fetches the user's account
 * @returns {Promise}
 */
export function getAccount() {
    return new Promise((resolve, reject) => {
        api.get('account').then(response => {
            if (response.data && response.data.hasOwnProperty('hasSession') && response.data.hasSession === true) {
                resolve(response.data);
            } else {
                reject({
                    status: 401,
                    message: 'Unauthorized user'
                });
            }
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}
