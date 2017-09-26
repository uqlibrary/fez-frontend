import {get} from './generic';
import * as routes from './routes';

/**
 * Fetches author stats
 * eg. Open Access, Fully Embargoed, etc
 * @param {string} userName
 * @returns {Promise}
 */
export function getAuthorPublicationsByYear(userName) {
    return get(routes.ACADEMIC_STATS_PUBLICATION_YEARS_API({userId: userName}));
}


/**
 * Fetches author stats
 * eg. Open Access, Fully Embargoed, etc
 * @param {string} userName
 * @returns {Promise}
 */
export function getAuthorPublicationsHindex(userName) {
    return get(routes.ACADEMIC_STATS_PUBLICATION_HINDEX_API({userId: userName}));
}


/**
 * Fetches author stats
 * eg. Open Access, Fully Embargoed, etc
 * @param {string} userName
 * @returns {Promise}
 */
export function getAuthorPublicationsStats(userName) {
    return get(routes.ACADEMIC_STATS_PUBLICATION_STATS_API({userId: userName}));
}
