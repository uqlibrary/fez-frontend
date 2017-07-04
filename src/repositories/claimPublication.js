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

/**
 * Marks the pid list as not theirs
 * @returns {Promise}
 */
export function markPublicationsNotMine(username, pids) {
    return new Promise((resolve, reject) => {
        const data = {
            author_id: username,
            publications: pids
        };

        api.post('publications/hide-possible', data).then(response => {
            resolve(response.data);
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}
