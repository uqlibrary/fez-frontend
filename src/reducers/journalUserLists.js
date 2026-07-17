import * as actions from 'actions/actionTypes';

export const initialState = {
    loading: false,
    data: null,
    error: null,
};

const handlers = {
    [actions.JOURNAL_USER_LISTS_LOADING]: state => ({
        ...state,
        loading: true,
    }),
    [actions.JOURNAL_USER_LISTS_SUCCESS]: (state, action) => ({
        ...state,
        loading: false,
        error: null,
        ...(action.payload !== undefined && { data: action.payload }),
    }),
    [actions.JOURNAL_USER_LISTS_FAILED]: (state, action) => ({
        ...state,
        loading: false,
        error: action.payload?.message,
    }),
};

export default function journalUserListsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
