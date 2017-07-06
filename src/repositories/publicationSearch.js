import {api} from 'config';

const SOURCE_WOS = 'wos';
const SOURCE_CROSSREF = 'crossref';
const SOURCE_SCOPUS = 'scopus';
const SOURCE_PUBMED = 'pubmed';

function processError(error, resolve, reject) {
    if (error.hasOwnProperty('response') && error.response !== null && typeof(error.response) !== 'undefined'
        && error.response.hasOwnProperty('status') && (error.response.status === 404 || error.response.status === 500 || error.response.status === 422 || error.response.status === 504)) {
        resolve([]);
    } else {
        reject(error);
        throw error;
    }
}

function getPromise(url) {
    return new Promise((resolve, reject) => {
        api.get(url)
            .then(response => { resolve(response.data); })
            .catch(error => { processError(error, resolve, reject); });
    });
}

/**
 * Generic search function that searches externally
 * @returns {Promise}
 */
function performExternalSearch(querystring) {
    const url = encodeURI(`search/external?${querystring}`);
    return  Promise.all([
        getPromise(`${url}&source=${SOURCE_WOS}`),
        getPromise(`${url}&source=${SOURCE_SCOPUS}`),
        getPromise(`${url}&source=${SOURCE_PUBMED}`),
        getPromise(`${url}&source=${SOURCE_CROSSREF}`)
    ]);
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
export function searchDoiEndpoint(doi) {
    return performSearch(`doi=${doi}`);
}

/**
 * Searches internally and externally for a requested pubmedId
 * @returns {Promise}
 */
export function searchPubmedEndpoint(pubMedId) {
    return performSearch(`pub_med_id=${pubMedId}`);
}


/**
 * Searches internally and externally for a requested title
 * @returns {Promise}
 */
export function searchTitleEndpoint(rekDisplayType, title) {
    // TODO: update source API endpoint, needs to all all external sources
    return performSearch(`rek_display_type=${rekDisplayType}&title=${title}`);
}
