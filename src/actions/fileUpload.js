import * as actions from './actionTypes';

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
