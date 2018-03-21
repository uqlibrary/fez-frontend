import {generateCancelToken} from 'config';
import * as fileUploadActions from 'uqlibrary-react-toolbox/build/FileUploader/actions';
import * as routes from './routes';
import {get, put, post} from './generic';
import Raven from 'raven-js';

/**
 * Uploads a file directly into an S3 bucket via API
 * @param {string} pid of object, folder name to where file will be uploaded
 * @param {object} file to be uploaded
 * @param {function} dispatch
 * @returns {Promise}
 */
export function putUploadFile(pid, file, dispatch) {
    return get(routes.FILE_UPLOAD_API({pid: pid, fileName: file.name}))
        .then(uploadUrl => {
            const options = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: fileUploadActions.notifyFileUploadProgress(file.name, dispatch),
                cancelToken: generateCancelToken().token
            };
            const fileUrl = Array.isArray(uploadUrl) && uploadUrl.length > 0 ? uploadUrl[0] : uploadUrl;
            return put({apiUrl: fileUrl}, file, options);
        })
        .then(uploadResponse => (Promise.resolve(uploadResponse)))
        .catch(error => {
            // file uploading failed
            Raven.captureException(error);

            // only send issues for PIDs
            if (/^UQ:\d+/g.test(pid)) {
                const issue = {issue:
                        `File upload failed: app: ${navigator.appVersion}, 
                    connection downlink: ${navigator.connection ? navigator.connection.downlink : 'n/a'},
                    connection type: ${navigator.connection ? navigator.connection.effectiveType : 'n/a'}, 
                    user agent: ${navigator.userAgent}
                    error status: ${error.status}
                    error message: ${error.message}
                    file name: ${file.name}`
                };

                post(routes.RECORDS_ISSUES_API({pid: pid}), issue).catch(() => {});
            }
            if (fileUploadActions) {
                dispatch(fileUploadActions.notifyUploadFailed(file.name));
            }
            return Promise.reject(new Error(error.message));
        });
}

/**
 * Uploads a list of files
 * @param {string} pid of object, folder name to where file will be uploaded
 * @param {array} files to be uploaded
 * @param {function} dispatch
 * @returns {Promise.all}
 */
export function putUploadFiles(pid, files, dispatch) {
    const uploadFilesPromises = files.map(file => {
        return putUploadFile(pid, file, dispatch);
    });

    return Promise.all(uploadFilesPromises);
}
