import {post, get} from './generic';

export const GET_POSSIBLE_PUBLICATIONS_API = 'publications/possible-unclaimed/';
export const POST_HIDE_POSSIBLE_PUBLICATIONS_API = 'publications/hide-possible';
export const POST_CLAIM_POSSIBLE_PUBLICATIONS_API = 'publications/claim-possible';

/**
 * Loads a list of possible unclaimed publications per user name
 * @param {string} userName of user for whom to apply the action
 * @returns {Promise}
 */
export function getPossibleUnclaimedPublications(userName) {
    return get(`${GET_POSSIBLE_PUBLICATIONS_API}${userName}`);
}

/**
 * Hide a list of PIDS for a user
 * @param {object} data to be posted, refer to backend API
 * @returns {Promise}
 */
export function postHidePossiblePublications(data) {
    return post(POST_HIDE_POSSIBLE_PUBLICATIONS_API, data);
}

/**
 * Post a request to claim possible publication with additional data
 * @param {object} data to be posted, refer to backend API
 * @returns {Promise}
 */
export function postClaimPossiblePublication(data) {
    return post(POST_CLAIM_POSSIBLE_PUBLICATIONS_API, data);
}
