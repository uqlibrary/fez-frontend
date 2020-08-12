import * as actions from 'actions/actionTypes';

/**
 * Notify progress for individual file
 *
 * @param name
 * @param progress
 * @returns {{type: string, complete: *}}
 */
export const notifyProgress = (name, progress) => {
    return {
        type: `${actions.FILE_UPLOAD_PROGRESS}@${name}`,
        complete: progress,
    };
};

export const notifyFileUploadProgress = (name, dispatch) => event => {
    const progress = Math.floor((event.loaded * 100) / event.total);
    dispatch(notifyProgress(name, progress));
};

/**
 * Notify file upload failed for individual file
 *
 * @param name
 * @returns {{type: string}}
 */
export const notifyUploadFailed = name => {
    return {
        type: `${actions.FILE_UPLOAD_FAILED}@${name}`,
    };
};

/**
 * Clear file upload state
 *
 * @returns {{type: string}}
 */
export const clearFileUpload = () => {
    return {
        type: actions.FILE_UPLOAD_CLEARED,
    };
};

/**
 * Start file upload
 *
 * @returns {{type: *}}
 */
export const startFileUpload = () => {
    return {
        type: actions.FILE_UPLOAD_STARTED,
    };
};

/**
 * Mark an upload as completed.
 *
 * @param {{type: string}} formName
 * @param {{type: string}} fileName
 */
export const markCompletedUpload = (formName, fileName) => {
    return dispatch => {
        dispatch({
            type: `${actions.FILE_UPLOAD_COMPLETE}@${fileName}`,
            payload: {
                form: formName,
            },
        });
    };
};
