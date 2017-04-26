import {api} from '../config';

/**
 * Generic search function that searches externally
 * @returns {Promise}
 */
function performExternalSearch(querystring) {
    return new Promise((resolve, reject) => {
        api.get(`search/external?${querystring}`).then(response => {
            resolve(response.data);
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}

/**
 * Generic search function that searches internally first and if it fails, does an external search
 * @returns {Promise}
 */
function performSearch(querystring) {
    return new Promise((resolve) => {
        api.get(`search/internal?${querystring}`).then(response => {
            if (response.data.length > 0) {
                resolve(response.data);
            } else {
                resolve(performExternalSearch(querystring));
            }
        }).catch(() => {
            // if it errors, try an external search
            resolve(performExternalSearch(querystring));
        });
    });
}

/**
 * Searches internally and externally for a requested doi
 * @returns {Promise}
 */
export function searchDoi(doi) {
    return performSearch(`doi=${doi}`);
}

/**
 * Searches internally and externally for a requested pubmedId
 * @returns {Promise}
 */
export function searchPubMed(pubMedId) {
    return performSearch(`pubMedId=${pubMedId}`);
}


/**
 * Searches internally and externally for a requested title
 * @returns {Promise}
 */
export function searchTitle(rekDisplayType, title) {
    return performSearch(`rek_display_type=${rekDisplayType}&title=${title}`);
}
