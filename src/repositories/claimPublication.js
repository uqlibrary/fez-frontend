import {api} from '../config';
import {claimPublication} from '../mock/data/claimPublication';

/**
 * TODO: Remove the USE_MOCK if statement once endpoint is in staging
 * Searches for potential publications for the user
 * @returns {Promise}
 */
export function loadUsersPublicationData(userid) {
    if (process.env.USE_MOCK) {
        return new Promise((resolve, reject) => {
            api.get(`claimPublication/user_id=${userid}`).then(response => {
                resolve(response.data);
            }).catch(e => {
                reject(e);
                throw e;
            });
        });
    } else {
        return new Promise((resolve) => {
            resolve(claimPublication);
        });
    }
}
