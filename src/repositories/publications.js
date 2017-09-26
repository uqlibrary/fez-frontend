import {post, get} from './generic';
import * as routes from './routes';

/**
 * Translate selected facets to query string parameters
 * @param {object} selected facets
 * @returns {string}
 */
function getFacetsQueryString(facets) {
    return Object.keys(facets).map(key => {
        return ('filters[facets][' + key + ']=' + facets[key]);
    }).join('&');
}

/**
 * Loads a list of possible unclaimed records for a current user
 * @param {Object} activeFacets to filter possible records for current user
 * @returns {Promise}
 */
export function getPossibleUnclaimedPublications({activeFacets = {}}) {
    return get(routes.POSSIBLE_RECORDS_API.replace('[facets]', getFacetsQueryString(activeFacets)));
}

/**
 * Returns published publications for user
 * @param {string} userName of user for whom to apply the action
 * @returns {Promise}
 */
export function getPublications({page = 1, pageSize = 20, sortBy = 'published_date', sortDirection = 'desc', facets = {}}) {
    return get(routes.CURRENT_USER_RECORDS_API
        .replace('[page]', page)
        .replace('[per_page]', pageSize)
        .replace('[sort]', sortBy)
        .replace('[order_by]', sortDirection)
        .repace('[facets]', getFacetsQueryString(facets)));
}

/**
 * Returns trending publications
 * @param {string} userName of user for whom to apply the action
 * @returns {Promise}
 */
export function getTrendingPublications(userName) {
    return get(routes.ACADEMIC_STATS_PUBLICATIONS_TRENDING_API.replace('[userId]', userName));
}

/**
 * Loads a count of possible unclaimed publications per user name
 * @param {string} userName of user for whom to apply the action
 * @returns {Promise}
 */
export function getCountPossibleUnclaimedPublications({userName}) {
    return get(`${routes.GET_COUNT_POSSIBLE_PUBLICATIONS_API}/${userName}`);
}

/**
 * Hide a list of PIDS for a user
 * @param {object} data to be posted, refer to backend API
 * @returns {Promise}
 */
export function postHidePossiblePublications(data) {
    return post(routes.HIDE_POSSIBLE_RECORD_API, data);
}

/**
 * Post a request to claim possible publication with additional data
 * @param {object} data to be posted, refer to backend API
 * @returns {Promise}
 */
export function postClaimPossiblePublication(data) {
    return post(routes.POST_CLAIM_POSSIBLE_PUBLICATIONS_API, data);
}
