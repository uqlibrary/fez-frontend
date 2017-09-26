import {post, patch} from './generic';

export const POST_RECORDS_API = 'records';
export const PATCH_RECORDS_API = 'records';

/**
 * Posts a records item
 * @param {object} data to be posted, refer to backend API
 * @returns {Promise}
 */
export function postRecord(data) {
    if (data.rek_pid) return Promise.resolve(data);
    return post(POST_RECORDS_API, data);
}

/**
 * Patches a records item
 * @param {string} pid of object to be updated
 * @param {object} data to be posted, refer to backend API
 * @returns {Promise}
 */
export function patchRecord(pid, data) {
    return patch(`${PATCH_RECORDS_API}/${pid}`, data);
}
