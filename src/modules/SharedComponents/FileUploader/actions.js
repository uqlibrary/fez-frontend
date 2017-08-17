export const FILE_UPLOAD_PROGRESS = 'FILE_UPLOAD_PROGRESS';
export const FILE_UPLOADED_FAILED = 'FILE_UPLOADED_FAILED';
export const FILE_UPLOAD_CLEARED = 'FILE_UPLOAD_CLEARED';

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
