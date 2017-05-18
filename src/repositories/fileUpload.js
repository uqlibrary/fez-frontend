import {api} from '../config';

/**
 * Fetches the publication Types
 * @returns {Promise}
 */
export function loadPresignedData(filename) {
    console.log('trtrtrt', filename);
    return new Promise((resolve, reject) => {
        console.log(`trtrtrt1 http://api.library.uq.edu.au/staging/file/upload/presigned/${filename}`);
        api.get(`file/upload/presigned/${filename}`).then(response => {
            console.log('trtrtrt2');
            resolve(response.data);
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}
