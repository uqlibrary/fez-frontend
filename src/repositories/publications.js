import {post, get} from './generic';
import * as routes from './routes';

/**
 * Loads a list of possible unclaimed records for a current user
 * @param {Object} activeFacets to filter possible records for current user
 * @returns {Promise}
 */
export function getPossibleUnclaimedPublications({activeFacets = {}}) {
    return get(routes.POSSIBLE_RECORDS_API({facets: activeFacets}));
}

/**
 * Returns published publications for user
 * @param {string} userName of user for whom to apply the action
 * @returns {Promise}
 */
export function getPublications(queryStringValues) {
    return get(routes.CURRENT_USER_RECORDS_API(queryStringValues));
}

/**
 * Returns trending publications
 * @param {string} userName of user for whom to apply the action
 * @returns {Promise}
 */
export function getTrendingPublications(userName) {
    return get(routes.ACADEMIC_STATS_PUBLICATIONS_TRENDING_API({userId: userName}));
}

/**
 * Hide a list of PIDS for a user
 * @param {object} data to be posted, refer to backend API
 * @returns {Promise}
 */
export function postHidePossiblePublications(data) {
    return post(routes.HIDE_POSSIBLE_RECORD_API(), data);
}

/**
 * Post a request to claim possible publication with additional data
 * @param {object} data to be posted, refer to backend API
 * @returns {Promise}28
 * 
 */
export function postClaimPossiblePublication(data) {
    return post(routes.RECORDS_API(), data);
}
