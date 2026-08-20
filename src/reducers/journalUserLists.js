import * as actions from 'actions/actionTypes';

export const initialState = {
    loading: false,
    error: null,
    isDirty: false,
    data: null,
};

const loading = state => ({
    ...state,
    loading: true,
});

const success = (state, action) => ({
    ...state,
    loading: false,
    error: null,
    isDirty: false,
    ...(action.payload !== undefined && { data: action.payload }),
});

const dirtySuccess = (state, action) => ({
    ...success(state, action),
    isDirty: true,
});

const failed = (state, action) => ({
    ...state,
    loading: false,
    error: action.payload,
});

const handlers = {
    [actions.JOURNAL_USER_LISTS_LOADING]: loading,
    [actions.JOURNAL_USER_LISTS_SUCCESS]: success,
    [actions.JOURNAL_USER_LISTS_CRUD_SUCCESS]: dirtySuccess,
    [actions.JOURNAL_USER_LISTS_FAILED]: failed,
};

export default function journalUserListsReducer(state = initialState, action) {
    return (handlers[action.type] || (s => s))(state, action);
}
