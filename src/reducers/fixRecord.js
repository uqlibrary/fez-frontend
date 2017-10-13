import * as actions from 'actions/actionTypes';

export const initialState = {
    recordToFix: null,
    recordToFixLoading: false,
    recordToFixError: null
};

const handlers = {
    [actions.FIX_RECORD_LOADING]: () => (
        {
            ...initialState,
            recordToFixLoading: true
        }
    ),

    [actions.FIX_RECORD_LOADED]: (state, action) => (
        {
            ...initialState,
            recordToFix: action.payload
        }
    ),

    [actions.FIX_RECORD_LOAD_FAILED]: (state, action) => (
        {
            ...initialState,
            recordToFixError: action.payload
        }
    ),

    [actions.FIX_RECORD_SET]: (state, action) => (
        {
            ...initialState,
            recordToFix: action.payload
        }
    ),

    [actions.FIX_RECORD_CLEAR]: () => (
        {
            ...initialState
        }
    )
};

export default function fixRecordReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
