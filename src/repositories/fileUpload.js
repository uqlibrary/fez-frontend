import {api} from '../config';

/**
 * Fetches the publication Types
 * @returns {Promise}
 */
export function loadPresignedData(file) {
    return new Promise((resolve, reject) => {
        api.get(`file/upload/presigned/${file[0].name}`).then(response => {
            const options = {
                headers: {
                    'Content-Type': file[0].type
                }
            };

            return api.put(response.data, file, options);
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}
