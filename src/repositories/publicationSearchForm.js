import {api} from 'config';

/**
 * Searches internally and externally for a requested doi
 * @returns {Promise}
 */
export function searchDOI(doi) {
    return new Promise((resolve, reject) => {
        api.get(`search/external?doi=${doi}`).then(response => {
            resolve(response.data);
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}

/**
 * Searches internally and externally for a requested pubmedID
 * @returns {Promise}
 */
export function searchPubMed(pubMedID) {
    return new Promise((resolve, reject) => {
        api.get(`search/external?pubMedID=${pubMedID}`).then(response => {
            resolve(response.data);
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}


/**
 * Searches internally and externally for a requested title
 * @returns {Promise}
 */
export function searchTitle(rekDisplayType, title) {
    return new Promise((resolve, reject) => {
        api.get(`search/external?rek_display_type=${rekDisplayType}&title=${title}`).then(response => {
            resolve(response.data);
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}
