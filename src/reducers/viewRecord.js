import * as actions from 'actions/actionTypes';

export const initialState = {
    recordToView: null,
    loadingRecordToView: true,
    recordToViewError: null
};

const handlers = {
    [actions.VIEW_RECORD_LOADING]: () => (
        {
            ...initialState
        }
    ),

    [actions.VIEW_RECORD_LOADED]: (state, action) => (
        {
            ...initialState,
            loadingRecordToView: false,
            recordToView: action.payload
        }
    ),

    [actions.VIEW_RECORD_LOAD_FAILED]: (state, action) => (
        {
            ...initialState,
            loadingRecordToView: false,
            recordToViewError: action.payload
        }
    ),

    [actions.VIEW_RECORD_SET]: (state, action) => (
        {
            ...initialState,
            loadingRecordToView: false,
            recordToView: action.payload
        }
    ),

    [actions.VIEW_RECORD_CLEAR]: () => (
        {
            ...initialState
        }
    )
};

export default function viewRecordReducer(state = {...initialState}, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
