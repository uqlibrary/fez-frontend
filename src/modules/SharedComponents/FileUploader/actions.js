

// Repositories
import {putUploadFiles} from '../../../repositories';

// Types
export const FILE_DELETED = 'FILE_DELETED';
export const FILE_LIST_CREATED = 'FILE_LIST_CREATED';
export const FILE_LIST_DELETED = 'FILE_LIST_DELETED';
export const FILE_OPEN_ACCESS_CHECKBOX_ACCEPTED = 'FILE_OPEN_ACCESS_CHECKBOX_ACCEPTED';
export const FILE_STATE_RESTORED = 'FILE_STATE_RESTORED';
export const FILE_UPLOAD_CANCELLED = 'FILE_UPLOAD_CANCELLED';
export const FILE_UPLOAD_TERMINATED = 'FILE_UPLOAD_TERMINATED';
export const FILE_UPLOADING = 'FILE_UPLOADING';
export const FILE_UPLOADED = 'FILE_UPLOADED';

export const FILES_UPLOADING = 'FILES_UPLOADING';
export const FILES_UPLOADED = 'FILES_UPLOADED';
export const FILES_UPLOAD_FAILED = 'FILES_UPLOAD_FAILED';

export function uploadFile(acceptedFiles) {
    return dispatch => {
        dispatch({type: FILES_UPLOADING});

        putUploadFiles(acceptedFiles).then((data) => {
            dispatch({
                type: FILES_UPLOADED,
                payload: data
            });
        }).catch(error => {
            dispatch({
                type: FILES_UPLOAD_FAILED,
                payload: error
            });
        });
    };
}

/**
 * Loads the document access types from the endpoint
 * @returns {function(*)}
 */


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
