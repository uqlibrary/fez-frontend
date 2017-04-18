import {api} from '../config';

/**
 * Generic search function that search internally first and if it fails, does an external search
 * @returns {Promise}
 */
function performSearch(querystring) {
    return new Promise((resolve, reject) => {
        api.get(`search/internal?${querystring}`).then(response => {
            if (response.data.length > 0) {
                resolve(response.data);
            } else {
                api.get(`search/external?${querystring}`).then(response => {
                    resolve(response.data);
                }).catch(e => {
                    reject(e);
                    throw e;
                });
            }
        });
    });
}

/**
 * Searches internally and externally for a requested doi
 * @returns {Promise}
 */
export function searchDOI(doi) {
    return performSearch(`doi=${doi}`);
}

/**
 * Searches internally and externally for a requested pubmedID
 * @returns {Promise}
 */
export function searchPubMed(pubMedID) {
    return performSearch(`pubMedID=${pubMedID}`);
}


/**
 * Searches internally and externally for a requested title
 * @returns {Promise}
 */
export function searchTitle(rekDisplayType, title) {
    return performSearch(`rek_display_type=${rekDisplayType}&title=${title}`);
}
