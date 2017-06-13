import {api, generateCancelToken} from 'config';
import {locale} from 'config';

// Repositories
import {loadDocumentAccessData} from 'repositories/documentAccessTypes';

// Types
export const FILE_DELETED = 'FILE_DELETED';
export const FILE_DOCUMENT_ACCESS_TYPES_LOADING = 'FILE_DOCUMENT_ACCESS_TYPES_LOADING';
export const FILE_DOCUMENT_ACCESS_TYPES_LOADED = 'FILE_DOCUMENT_ACCESS_TYPES_LOADED';
export const FILE_DIALOG_OPENED = 'FILE_DIALOG_OPENED';
export const FILE_DIALOG_CLOSED = 'FILE_DIALOG_CLOSED';
export const FILE_DIALOG_INITIALIZED = 'FILE_DIALOG_INITIALIZED';
export const FILE_LIST_CREATED = 'FILE_LIST_CREATED';
export const FILE_METADATA_INITIALIZED = 'FILE_METADATA_INITIALIZED';
export const FILE_METADATA_UPDATED = 'FILE_METADATA_UPDATED';
export const FILE_STEPPER_INDEX_INCREASED = 'FILE_STEPPER_INDEX_INCREASED';
export const FILE_STEPPER_INDEX_DECREASED = 'FILE_STEPPER_INDEX_DECREASED';
export const FILE_UPLOAD_CANCELLED = 'FILE_UPLOAD_CANCELLED';
export const FILE_UPLOAD_TERMINATED = 'FILE_UPLOAD_TERMINATED';
export const FILE_UPLOADING = 'FILE_UPLOADING';
export const FILE_UPLOADED = 'FILE_UPLOADED';

let cancelToken;

export const cancelUpload = () => {
    cancelToken.cancel();
};

const errorMsg = locale.sharedComponents.files.messages.uploadError;


function getErrorMssage(e) {
    return e.response ? errorMsg[e.response.status] : errorMsg.default;
}

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
                        dispatch({
                            type: FILE_UPLOAD_TERMINATED,
                            payload: getErrorMssage(e)
                        });
                        throw(e);
                    }
                });
            }).catch(e => {
                dispatch({
                    type: FILE_UPLOAD_TERMINATED,
                    payload: getErrorMssage(e)
                });
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
 * Loads the document access types from the endpoint
 * @returns {function(*)}
 */
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

/**
 * Sets the list of files that have been uploaded
 * @param files
 * @returns {{type: string, payload: object}}
 */
export function setAcceptedFileList(files) {
    return {
        type: FILE_LIST_CREATED,
        payload: files
    };
}

export function initializeMetadata() {
    return {
        type: FILE_METADATA_INITIALIZED
    };
}

export function updateFileMetadata(data) {
    return {
        type: FILE_METADATA_UPDATED,
        payload: data
    };
}

export function initializeDialog() {
    return {
        type: FILE_DIALOG_INITIALIZED
    };
}

export function deleteFile(file) {
    return {
        type: FILE_DELETED,
        payload: file
    };
}
