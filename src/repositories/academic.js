import {get} from './generic';
import * as routes from './routes';

/**
 * Fetches author stats
 * eg. Open Access, Fully Embargoed, etc
 * @param {string} userName
 * @returns {Promise}
 */
export function getAuthorPublicationsByYear(userName) {
    return get(routes.GET_ACADEMIC_PUBLICATION_YEARS.replace('[userId]', userName));
}


/**
 * Fetches author stats
 * eg. Open Access, Fully Embargoed, etc
 * @param {string} userName
 * @returns {Promise}
 */
export function getAuthorPublicationsHindex(userName) {
    return get(routes.GET_ACADEMIC_PUBLICATION_HINDEX.replace('[userId]', userName));
}


/**
 * Fetches author stats
 * eg. Open Access, Fully Embargoed, etc
 * @param {string} userName
 * @returns {Promise}
 */
export function getAuthorPublicationsStats(userName) {
    return get(routes.GET_ACADEMIC_PUBLICATION_STATS.replace('[userId]', userName));
}
