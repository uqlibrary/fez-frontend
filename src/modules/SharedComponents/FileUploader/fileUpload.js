const handlers = {
    'FILE_UPLOAD_PROGRESS@': (state, action) => {
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
    }
};

export default function fileUploadReducer(state = { overall: 0 }, action) {
    const handler = handlers[action.type.substring(0, action.type.indexOf('@') + 1)];

    if (!handler) {
        return state;
    }
    return handler(state, action);
}
