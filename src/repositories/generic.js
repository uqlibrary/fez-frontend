import {api} from '../config';

/**
 * Send a post request
 * @param {string} apiUrl
 * @param {object} data to be posted, refer to backend API
 * @returns {Promise}
 */
export function post(apiUrl, data) {
    return new Promise((resolve, reject) => {
        api.post(apiUrl, data).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        });
    });
}

/**
 * Send a patch request
 * @param {string} apiUrl
 * @param {object} data to be posted, refer to backend API
 * @returns {Promise}
 */
export function patch(apiUrl, data) {
    return new Promise((resolve, reject) => {
        api.patch(apiUrl, data).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        });
    });
}

/**
 * Send a get request
 * @param {string} apiUrl
 * @returns {Promise}
 */
export function get(apiUrl) {
    return new Promise((resolve, reject) => {
        api.get(apiUrl).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        });
    });
}
