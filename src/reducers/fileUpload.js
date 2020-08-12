import * as actions from 'actions/actionTypes';
export const initialState = {};

const handlers = {
    [`${actions.FILE_UPLOAD_COMPLETE}@`]: (state, action) => ({
        ...state,
        [action.payload.form]: {
            completedUploads: [
                ...((state[action.payload.form] && state[action.payload.form].completedUploads) || []),
                actions.getActionSuffix(action.type),
            ],
        },
    }),
};

export default function fileUploadReducer(state = initialState, action) {
    const handler = handlers[actions.getAction(action.type)];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
