import {api, generateCancelToken} from 'config';

// Types
export const FILE_UPLOADING = 'FILE_UPLOADING';
export const FILE_UPLOADED = 'FILE_UPLOADED';
export const FILE_DIALOG_OPENED = 'FILE_DIALOG_OPENED';
export const FILE_DIALOG_CLOSED = 'FILE_DIALOG_CLOSED';
export const FILE_INCREASE_STEP = 'FILE_INCREASE_STEP';
export const FILE_DECREASE_STEP = 'FILE_DECREASE_STEP';
export const FILE_RESET_STEP = 'FILE_RESET_STEP';
export const FILE_LIST_CREATED = 'FILE_LIST_CREATED';
export const FILE_UPLOAD_CANCELLED = 'FILE_UPLOAD_CANCELLED';

let source;

export const cancelUpload = () => {
    source.cancel();
};


/**
 * Submits the record for approval
 * @returns {function(*)}
 */

export function uploadFile(acceptedFiles) {
    source = generateCancelToken();

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
                    cancelToken: source.token
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

export function setAcceptedFileList(files) {
    return {
        type: FILE_LIST_CREATED,
        payload: files
    };
}

export function openDialog() {
    return {
        type: FILE_DIALOG_OPENED,
        payload: true
    };
}

export function closeDialog() {
    return {
        type: FILE_DIALOG_CLOSED,
        payload: false
    };
}

export function increaseStep() {
    return {
        type: FILE_INCREASE_STEP
    };
}

export function decreaseStep() {
    return {
        type: FILE_DECREASE_STEP
    };
}

export function resetSteps() {
    return {
        type: FILE_RESET_STEP
    };
}
