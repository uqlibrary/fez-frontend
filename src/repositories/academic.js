import {get} from './generic';

const GET_ACADEMIC_PUBLICATION_YEARS = 'academic/[userId]/publication-years';
const GET_ACADEMIC_PUBLICATION_HINDEX = 'academic/[userId]/hindex'; // ?endYear=2017&startYear=1977
const GET_ACADEMIC_PUBLICATION_STATS = 'academic/[userId]/publication-stats'; // ?endYear=2017&startYear=1977

/**
 * Fetches author stats
 * eg. Open Access, Fully Embargoed, etc
 * @param {string} userName
 * @returns {Promise}
 */
export function getAuthorPublicationsByYear(userName) {
    return get(GET_ACADEMIC_PUBLICATION_YEARS.replace('[userId]', userName));
}


/**
 * Fetches author stats
 * eg. Open Access, Fully Embargoed, etc
 * @param {string} userName
 * @returns {Promise}
 */
export function getAuthorPublicationsHindex(userName) {
    return get(GET_ACADEMIC_PUBLICATION_HINDEX.replace('[userId]', userName));
}


/**
 * Fetches author stats
 * eg. Open Access, Fully Embargoed, etc
 * @param {string} userName
 * @returns {Promise}
 */
export function getAuthorPublicationsStats(userName) {
    return get(GET_ACADEMIC_PUBLICATION_STATS.replace('[userId]', userName));
}
