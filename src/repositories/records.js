import {post, patch} from './generic';
import * as routes from './routes';

/**
 * Posts a records item
 * @param {object} data to be posted, refer to backend API
 * @returns {Promise}
 */
export function postRecord(data) {
    if (data.rek_pid) return Promise.resolve(data);
    return post(routes.NEW_RECORD_API(), data);
}

/**
 * Patches a records item
 * @param {string} pid of object to be updated
 * @param {object} data to be posted, refer to backend API
 * @returns {Promise}
 */
export function patchRecord(pid, data) {
    return patch(routes.EXISTING_RECORD_API({pid: pid}), data);
}
