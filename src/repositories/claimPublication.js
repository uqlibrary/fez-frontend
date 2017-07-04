import {api} from '../config';

/**
 * Searches for potential publications for the user
 * @returns {Promise}
 */
export function loadUsersPublicationData(username) {
    return new Promise((resolve, reject) => {
        api.get(`publications/possible-unclaimed/${username}`).then(response => {
            resolve(response.data);
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}

export function markPublicationsNotMine(username) {
    return new Promise((resolve, reject) => {
        api.get(`publications/hide-possible/${username}`).then(response => {
            resolve(response.data);
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}
