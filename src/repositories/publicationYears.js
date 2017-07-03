import {api} from 'config';

/**
 * Fetches the the current list of authors
 * @returns {Promise}
 */
export function loadAcademicPublicationYearsData(userName) {
    return new Promise((resolve, reject) => {
        api.get(`/academic/${userName}/publication-years`).then(response => {
            resolve(response.data);
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}
