import * as actions from 'actions/actionTypes';

const initialState = {
    authors: {},
};

const handlers = {
    [actions.ADMIN_AUTHORS_UPDATED]: (state, action) => ({
        ...initialState,
        authors: action.payload,
    }),
};

export default function adminAuthorsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
