import {api, generateCancelToken, locale} from 'config';

// Repositories
import {loadDocumentAccessData} from 'repositories/documentAccessTypes';

// Types
export const FILE_DELETED = 'FILE_DELETED';
export const FILE_DOCUMENT_ACCESS_TYPES_LOADING = 'FILE_DOCUMENT_ACCESS_TYPES_LOADING';
export const FILE_DOCUMENT_ACCESS_TYPES_LOADED = 'FILE_DOCUMENT_ACCESS_TYPES_LOADED';
export const FILE_LIST_CREATED = 'FILE_LIST_CREATED';
export const FILE_LIST_DELETED = 'FILE_LIST_DELETED';
export const FILE_OPEN_ACCESS_CHECKBOX_ACCEPTED = 'FILE_OPEN_ACCESS_CHECKBOX_ACCEPTED';
export const FILE_SET_OPEN_ACCESS = 'FILE_SET_OPEN_ACCESS';
export const FILE_STATE_RESTORED = 'FILE_STATE_RESTORED';
export const FILE_UPLOAD_CANCELLED = 'FILE_UPLOAD_CANCELLED';
export const FILE_UPLOAD_TERMINATED = 'FILE_UPLOAD_TERMINATED';
export const FILE_UPLOADING = 'FILE_UPLOADING';
export const FILE_UPLOADED = 'FILE_UPLOADED';

let cancelToken;
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
                                progress: percentCompleted
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


export function deleteFile(index) {
    return {
        type: FILE_DELETED,
        payload: index
    };
}

export function deleteAllFiles() {
    return {
        type: FILE_LIST_DELETED
    };
}

export function setCheckboxState(event, isInputChecked) {
    return {
        type: FILE_OPEN_ACCESS_CHECKBOX_ACCEPTED,
        payload: isInputChecked
    };
}

export function resetToInitialState() {
    return {
        type: FILE_STATE_RESTORED
    };
}
