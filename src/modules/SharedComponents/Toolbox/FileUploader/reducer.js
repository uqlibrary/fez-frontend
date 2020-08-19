import * as actions from 'actions/actionTypes';

const handlers = {
    [`${actions.FILE_UPLOAD_STARTED}`]: () => {
        return {
            isUploadInProgress: true,
        };
    },
    [`${actions.FILE_UPLOAD_PROGRESS}@`]: (state, action) => {
        const file = action.type.substring(action.type.indexOf('@') + 1, action.type.length);

        const uploadProgress = {
            ...state,
            [`${file}`]: action.complete,
        };

        return {
            ...uploadProgress,
            isUploadInProgress: true,
        };
    },
    [`${actions.FILE_UPLOAD_FAILED}@`]: (state, action) => {
        const file = action.type.substring(action.type.indexOf('@') + 1, action.type.length);

        const uploadProgress = {
            ...state,
        };

        delete uploadProgress.file;

        return {
            ...uploadProgress,
            [`${file}`]: 0,
            isUploadInProgress: false,
        };
    },
    [actions.FILE_UPLOAD_CLEARED]: () => {
        return {
            isUploadInProgress: false,
        };
    },
};

const fileUploadReducer = (state = { isUploadInProgress: false }, action) => {
    const handler =
        [actions.FILE_UPLOAD_STARTED, actions.FILE_UPLOAD_CLEARED].indexOf(action.type) > -1
            ? handlers[action.type]
            : handlers[action.type.substring(0, action.type.indexOf('@') + 1)];

    if (!handler) {
        return state;
    }
    return handler(state, action);
};

export default fileUploadReducer;
