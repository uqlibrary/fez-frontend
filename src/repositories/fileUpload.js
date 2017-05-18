import {api} from 'config';

/**
 * Fetches the publication Types
 * @returns {Promise}
 */
export function loadPresignedData(file) {
    console.log('loadPresignedData', file.name);
    return new Promise((resolve, reject) => {
        api.get(`file/upload/presigned/${file.name}`).then(response => {
            console.log('PUTTING file ... ', response);
            const options = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            console.log(`PUTTINGS ${file.name} ... `);
            api.put(response.data, file, options).then(result => {
                console.log('SUCCESS', result);
                resolve(result);
            }).catch(err => {
                console.log('ERROR', err);
                reject(err);
            });
        }).catch(e => {
            console.log('error', e);
            reject(e);
            throw e;
        });
    });
}
