export const FILE_UPLOAD_PROGRESS = 'FILE_UPLOAD_PROGRESS';
export const FILE_UPLOADED_FAILED = 'FILE_UPLOADED_FAILED';
export const FILE_UPLOAD_CLEARED = 'FILE_UPLOAD_CLEARED';
export const FILE_UPLOAD_STARTED = 'FILE_UPLOAD_STARTED';

/**
 * Notify progress for individual file
 *
 * @param name
 * @param progress
 * @returns {{type: string, complete: *}}
 */
export const notifyProgress = (name, progress) => {
    return {
        type: `${FILE_UPLOAD_PROGRESS}@${name}`,
        complete: progress
    };
};

export const notifyFileUploadProgress = (name, dispatch) => (event) => {
    const progress = Math.floor((event.loaded * 100) / event.total);
    dispatch(notifyProgress(name, progress));
};

/**
 * Notify file upload failed for individual file
 *
 * @param name
 * @returns {{type: string}}
 */
export const notifyUploadFailed = (name) => {
    return {
        type: `${FILE_UPLOADED_FAILED}@${name}`
    };
};

/**
 * Clear file upload state
 *
 * @returns {{type: string}}
 */
export const clearFileUpload = () => {
    return {
        type: FILE_UPLOAD_CLEARED
    };
};

/**
 * Start file upload
 *
 * @returns {{type: *}}
 */
export const startFileUpload = () => {
    return {
        type: FILE_UPLOAD_STARTED
    };
};

