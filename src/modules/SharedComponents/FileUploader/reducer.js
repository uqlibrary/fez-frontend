import { FILE_UPLOAD_PROGRESS, FILE_UPLOADED_FAILED, FILE_UPLOAD_CLEARED } from './actions';

const handlers = {
    [`${FILE_UPLOAD_PROGRESS}@`]: (state, action) => {
        const file = action.type.substring(action.type.indexOf('@') + 1, action.type.length);

        const uploadProgress = {
            ...state,
            [`${file}`]: action.complete
        };

        delete uploadProgress.overall;

        return {
            ...uploadProgress,
            overall: Object.values(uploadProgress).reduce((sum, current) => (sum + current), 0) / Object.values(uploadProgress).length
        };
    },
    [`${FILE_UPLOADED_FAILED}@`]: (state, action) => {
        const file = action.type.substring(action.type.indexOf('@') + 1, action.type.length);

        const uploadProgress = {
            ...state
        };

        delete uploadProgress.overall;
        delete uploadProgress.file;

        return {
            ...uploadProgress,
            [`${file}`]: 'failed',
            overall: Object.values(uploadProgress).reduce((sum, current) => (sum + current), 0) / Object.values(uploadProgress).length
        };
    },
    [FILE_UPLOAD_CLEARED]: () => {
        return {
            overall: 0
        };
    }
};

const fileUploadReducer = (state = { overall: 0 }, action) => {
    const handler = action.type === FILE_UPLOAD_CLEARED ? handlers[action.type] : handlers[action.type.substring(0, action.type.indexOf('@') + 1)];

    if (!handler) {
        return state;
    }
    return handler(state, action);
};

export default fileUploadReducer;
