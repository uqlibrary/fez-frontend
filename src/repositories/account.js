import {get} from './generic';
import * as routes from './routes';

/**
 * Fetches the user's account
 * @returns {Promise}
 */
export function getAccount() {
    return get(routes.ACCOUNT_API())
        .then(account => {
            if (account.hasOwnProperty('hasSession') && account.hasSession === true) {
                return Promise.resolve(account);
            } else {
                return Promise.reject('Session expired. User is unauthorized.');
            }
        }).catch((error) => {
            return Promise.reject(error);
        });
}
