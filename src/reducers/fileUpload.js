const handlers = {
    'FILE_UPLOAD_PROGRESS@': (state, action) => {
        const file = action.type.substring(action.type.indexOf('@') + 1, action.type.length);

        return {
            ...state,
            [`${file}`]: action.complete
        };
    }
};

export default function fileUploadReducer(state = {}, action) {
    const handler = handlers[action.type.substring(0, action.type.indexOf('@') + 1)];

    if (!handler) {
        return state;
    }
    return handler(state, action);
}
