import {generateCancelToken} from 'config';
import * as fileUploadActions from 'uqlibrary-react-toolbox/build/FileUploader/actions';
import * as routes from './routes';
import {get, put, post} from './generic';

/**
 * Uploads a file directly into an S3 bucket via API
 * @param {string} pid of object, folder name to where file will be uploaded
 * @param {object} file to be uploaded
 * @param {function} dispatch
 * @returns {Promise}
 */
export function putUploadFile(pid, file, dispatch) {
    const fileUploadUrl = routes.FILE_UPLOAD_API({pid: pid, fileName: file.name});
    return get(fileUploadUrl)
        .then(uploadUrl => {
            const options = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: event => {
                    const completed = Math.floor((event.loaded * 100) / event.total);
                    dispatch(fileUploadActions.notifyProgress(file.name, completed));
                },
                cancelToken: generateCancelToken().token
            };
            const fileUrl = Array.isArray(uploadUrl) && uploadUrl.length > 0 ? uploadUrl[0] : uploadUrl;
            return put(fileUrl, file, options);

        })
        .then(uploadResponse => (Promise.resolve(uploadResponse)))
        .catch(error => {
            const issue = {issue: `File upload failed: app: ${navigator.appVersion}, connection downlink: ${navigator.connection ? navigator.connection.downlink : 'n/a'},
            connection type: ${navigator.connection ? navigator.connection.effectiveType : 'n/a'}, user agent: ${navigator.userAgent}`};
            post(routes.RECORDS_ISSUES_API({pid: pid}), issue);
            dispatch(fileUploadActions.notifyUploadFailed(file.name));
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
