import {api, generateCancelToken} from 'config';

// Repositories
import {loadDocumentAccessData} from 'repositories/documentAccessTypes';

// Types
export const FILE_UPLOADING = 'FILE_UPLOADING';
export const FILE_UPLOADED = 'FILE_UPLOADED';
export const FILE_DIALOG_OPENED = 'FILE_DIALOG_OPENED';
export const FILE_DIALOG_CLOSED = 'FILE_DIALOG_CLOSED';
export const FILE_STEPPER_INDEX_INCREASED = 'FILE_STEPPER_INDEX_INCREASED';
export const FILE_STEPPER_INDEX_DECREASED = 'FILE_STEPPER_INDEX_DECREASED';
export const FILE_STEPPER_INDEX_ZEROED = 'FILE_STEPPER_INDEX_ZEROED';
export const FILE_UPLOAD_CANCELLED = 'FILE_UPLOAD_CANCELLED';
export const FILE_DOCUMENT_ACCESS_TYPES_LOADING = 'FILE_DOCUMENT_ACCESS_TYPES_LOADING';
export const FILE_DOCUMENT_ACCESS_TYPES_LOADED = 'FILE_DOCUMENT_ACCESS_TYPES_LOADED';

let cancelToken;

export const cancelUpload = () => {
    cancelToken.cancel();
};


/**
 * Uploads a file/s directly into an S3 bucket
 * @returns {function(*)}
 */
export function uploadFile(acceptedFiles) {
    cancelToken = generateCancelToken();

    return dispatch => {
        acceptedFiles.map(file => {
            api.get(`file/upload/presigned/${file.name}`).then(response => {
                const options = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: progressEvent => {
                        const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
                        dispatch({
                            type: FILE_UPLOADING,
                            payload: {
                                name: file.name,
                                progress: `${percentCompleted}%`
                            }
                        });
                    },
                    cancelToken: cancelToken.token
                };

                // push the file into the S3 bucket
                api.put(response.data, file, options).then(() => {
                    dispatch({
                        type: FILE_UPLOADED
                    });
                }).catch(e => {
                    if (api.isCancel(e)) {
                        dispatch({
                            type: FILE_UPLOAD_CANCELLED
                        });
                    } else {
                        throw e;
                    }
                });
            }).catch(e => {
                throw e;
            });
        });
    };
}

/**
 * Controls when the file uploader dialog is opened
 * @returns {{type: string, payload: boolean}}
 */
export function openDialog() {
    return {
        type: FILE_DIALOG_OPENED,
        payload: true
    };
}

/**
 * Controls when the file uploader dialog is closed
 * @returns {{type: string, payload: boolean}}
 */
export function closeDialog() {
    return {
        type: FILE_DIALOG_CLOSED,
        payload: false
    };
}

/**
 * Controls the stepper index by increasing the index
 * @returns {{type: string}}
 */
export function increaseStep() {
    return {
        type: FILE_STEPPER_INDEX_INCREASED
    };
}

/**
 * Controls the stepper index by decreasing the index
 * @returns {{type: string}}
 */
export function decreaseStep() {
    return {
        type: FILE_STEPPER_INDEX_DECREASED
    };
}

/**
 * Resets the stepper index to zero
 * @returns {{type: string}}
 */
export function resetSteps() {
    return {
        type: FILE_STEPPER_INDEX_ZEROED
    };
}

export function loadDocumentAccessTypes() {
    return dispatch => {
        dispatch({type: FILE_DOCUMENT_ACCESS_TYPES_LOADING});
        loadDocumentAccessData().then(accessTypes => {
            dispatch({
                type: FILE_DOCUMENT_ACCESS_TYPES_LOADED,
                payload: accessTypes
            });
        }).catch((error) => {
            throw(error);
        });
    };
}
