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
            // throw e;
        });
    });
}

/**
 * Marks the pid list as not theirs
 * @returns {Promise}
 */
export function markPublicationsDataNotMine(username, pids) {
    return new Promise((resolve, reject) => {
        const data = {
            author_id: username,
            publications: pids
        };

        api.post('publications/hide-possible', data).then(response => {
            resolve(response.data);
        }).catch(e => {
            console.log(e);
            reject(e);
            // throw e;
        });
    });
}

/**
 * Submits the record to be claimed
 * @returns {function(*)}
 */
export function claimPublicationRecord(data) {
    return new Promise((resolve, reject) => {
        api.post('publications/claim-possible', data).then(response => {
            resolve(response.data);
        }).catch(e => {
            console.log('claimRecord:' + e);
            reject(e);
            // throw e;
        });
    });
}
