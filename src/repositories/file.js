import {api, generateCancelToken} from 'config';

export const GET_FILE_UPLOAD_API = 'file/upload/presigned';

/**
 * Uploads a file directly into an S3 bucket via API
 * @param {string} PID of object, folder name to where file will be uploaded
 * @param {object} file to be uploaded
 * @returns {Promise}
 */
export function putUploadFile(pid, file) {
    return new Promise((resolve, reject) => {
        api.get(`${GET_FILE_UPLOAD_API}/${pid}/${file.name}`).then(getPresignedResponse => {
            const options = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: event => {
                    // TODO: dispatch file upload progress
                    const completed = Math.floor((event.loaded * 100) / event.total);
                    console.log(`File upload (${file.name}): ${completed} %`);
                },
                cancelToken: generateCancelToken().token
            };

            api.put(getPresignedResponse.data, file, options).then(uploadResponse => {
                resolve(uploadResponse.data);
            }).catch(uploadError => {
                console.log(uploadError);
                reject(uploadError);
            });
        }).catch(getPresignedError => {
            console.log(getPresignedError);
            reject(getPresignedError);
        });
    });
}

/**
 * Uploads a list of files
 * @param {string} PID of object, folder name to where file will be uploaded
 * @param {array} files to be uploaded
 * @returns {Promise.all}
 */
export function putUploadFiles(pid, files) {
    const uploadFilesPromises = files.map(file => {
        return putUploadFile(pid, file);
    });

    return  Promise.all(uploadFilesPromises);
}
