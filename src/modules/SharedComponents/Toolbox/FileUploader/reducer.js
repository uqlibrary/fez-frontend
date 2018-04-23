import { FILE_UPLOAD_PROGRESS, FILE_UPLOADED_FAILED, FILE_UPLOAD_CLEARED, FILE_UPLOAD_STARTED } from './actions';

const handlers = {
    [`${FILE_UPLOAD_STARTED}`]: () => {
        return {
            isUploadInProgress: true
        };
    },
    [`${FILE_UPLOAD_PROGRESS}@`]: (state, action) => {
        const file = action.type.substring(action.type.indexOf('@') + 1, action.type.length);

        const uploadProgress = {
            ...state,
            [`${file}`]: action.complete
        };

        return {
            ...uploadProgress,
            isUploadInProgress: true
        };
    },
    [`${FILE_UPLOADED_FAILED}@`]: (state, action) => {
        const file = action.type.substring(action.type.indexOf('@') + 1, action.type.length);

        const uploadProgress = {
            ...state
        };

        delete uploadProgress.file;

        return {
            ...uploadProgress,
            [`${file}`]: 0,
            isUploadInProgress: false
        };
    },
    [FILE_UPLOAD_CLEARED]: () => {
        return {
            isUploadInProgress: false
        };
    }
};

const fileUploadReducer = (state = { isUploadInProgress: false }, action) => {
    const handler = [FILE_UPLOAD_STARTED, FILE_UPLOAD_CLEARED].indexOf(action.type) > -1 ? handlers[action.type] : handlers[action.type.substring(0, action.type.indexOf('@') + 1)];

    if (!handler) {
        return state;
    }
    return handler(state, action);
};

export default fileUploadReducer;
