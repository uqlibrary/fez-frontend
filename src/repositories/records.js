import {post, patch} from './generic';

export const POST_RECORDS_API = 'records';
export const PATCH_RECORDS_API = 'records';

/**
 * Posts a records item
 * @param {object} data to be posted, refer to backend API
 * @returns {Promise}
 */
export function postRecord(data) {
    return post(POST_RECORDS_API, data);
}

/**
 * Patches a records item
 * @param {object} data to be posted, refer to backend API
 * @returns {Promise}
 */
export function patchRecord(data) {
    return patch(PATCH_RECORDS_API, data);
}
