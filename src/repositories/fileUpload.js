import {api} from 'config';

/**
 * Fetches the publication Types
 * @returns {Promise}
 */
export function loadPresignedData(file) {
    console.log('loadPresignedData');
    return new Promise((resolve, reject) => {
        api.get(`file/upload/presigned/${file[0].name}`).then(response => {
            console.log('PUTTING file ... ');
            const options = {
                headers: {
                    'Content-Type': file[0].type
                }
            };

            console.log(`PUTTING ${file[0].name} ... `);
            api.put(response.data, file, options).then(result => {
                console.log('SUCCESS', result);
            }).catch(err => {
                console.log('ERROR', err);
            });
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}
