import * as actions from 'actions/actionTypes';

export const initialState = {
    loading: false,
    data: null,
    error: null,
};

const handlers = {
    [actions.JOURNALS_LISTS_LOADING]: state => ({
        ...state,
        loading: true,
    }),
    [actions.JOURNALS_LISTS_SUCCESS]: (state, action) => ({
        ...state,
        loading: false,
        error: null,
        ...(action.payload !== undefined && { data: action.payload }),
    }),
    [actions.JOURNALS_LISTS_FAILED]: (state, action) => ({
        ...state,
        loading: false,
        error: action.payload?.message,
    }),
};

export default function journalListsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
