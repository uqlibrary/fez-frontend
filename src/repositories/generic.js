import { api } from 'config';

/**
 * Send a put request
 * @param {string} apiUrl
 * @param {object} data to be posted to API
 * @param {object} any query string parameters (defined in routes with apiUrl)
 * @param {object} any additional options (headers, responseType, etc)
 * @returns {Promise}
 */
export function put({ apiUrl, options = {} }, data, config = {}) {
    return api.put(apiUrl, data, { ...config, ...options });
}

/**
 * Send a post request
 * @param {string} apiUrl
 * @param {object} data to be posted to API
 * @param {object} any query string parameters (defined in routes with apiUrl)
 * @param {object} any additional options (headers, responseType, etc)
 * @returns {Promise}
 */
export function post({ apiUrl, options = {} }, data, config = {}) {
    return api.post(apiUrl, data, { ...config, ...options });
}

/**
 * Send a patch request
 * @param {string} apiUrl
 * @param {object} data to be posted to API
 * @param {object} any query string parameters (defined in routes with apiUrl)
 * @param {object} any additional options (headers, responseType, etc)
 * @returns {Promise}
 */
export function patch({ apiUrl, options = {} }, data, config = {}) {
    return api.patch(apiUrl, data, { ...config, ...options });
}

/**
 * Send a get request
 * @param {string} apiUrl
 * @param {object} any query string parameters (defined in routes with apiUrl)
 * @param {object} any additional options (headers, responseType, etc)
 * @returns {Promise}
 */
export function get({ apiUrl, options = {} }, config = {}) {
    return api.get(apiUrl, { ...config, ...options });
}

/**
 * Send a delete request
 * @param {string} apiUrl
 * @param {object} options any query string parameters (defined in routes with apiUrl)
 * @param {object} data any additional options (headers, responseType, etc)
 * @param {object} config any additional options (headers, responseType, etc)
 * @returns {Promise}
 */
export function destroy({ apiUrl, options = {} }, data = {}, config = {}) {
    return api.delete(apiUrl, { ...config, ...options, data: { ...data } });
}
