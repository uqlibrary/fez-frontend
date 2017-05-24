import {api} from 'config';

/**
 * Fetches the publication Types
 * @returns {Promise}
 */
export function loadPresignedData(file) {
    return new Promise((resolve, reject) => {
        // get the pre-signed url
        api.get(`file/upload/presigned/${file.name}`).then(response => {
            const options = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: progressEvent => {
                    const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
                    resolve({
                        file: file.name,
                        progress: percentCompleted
                    });
                }
            };

            // push the file into the S3 bucket
            api.put(response.data, file, options).then(result => {
                console.log(result);
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}
