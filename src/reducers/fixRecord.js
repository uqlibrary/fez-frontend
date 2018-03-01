import * as actions from 'actions/actionTypes';

export const initialState = {
    recordToFix: null,
    loadingRecordToFix: true,
    recordToFixError: null
};

const handlers = {
    [actions.FIX_RECORD_LOADING]: () => (
        {
            ...initialState
        }
    ),

    [actions.FIX_RECORD_LOADED]: (state, action) => (
        {
            ...initialState,
            loadingRecordToFix: false,
            recordToFix: action.payload
        }
    ),

    [actions.FIX_RECORD_LOAD_FAILED]: (state, action) => (
        {
            ...initialState,
            loadingRecordToFix: false,
            recordToFixError: action.payload
        }
    ),

    [actions.FIX_RECORD_SET]: (state, action) => (
        {
            ...initialState,
            loadingRecordToFix: false,
            recordToFix: action.payload
        }
    ),

    [actions.FIX_RECORD_CLEAR]: () => (
        {
            ...initialState
        }
    )
};

export default function fixRecordReducer(state = {...initialState}, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
