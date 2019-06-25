import {
    FIX_RECORD_LOADING,
    FIX_RECORD_LOADED,
    FIX_RECORD_LOAD_FAILED,
    FIX_RECORD_SET,
    FIX_RECORD_CLEAR
} from 'actions/actionTypes';

export const initialState = {
    recordToFix: null,
    loadingRecordToFix: true,
    recordToFixError: null,
};

const handlers = {
    [FIX_RECORD_LOADING]: () => ({
        ...initialState,
    }),

    [FIX_RECORD_LOADED]: (state, action) => ({
        ...initialState,
        loadingRecordToFix: false,
        recordToFix: action.payload,
    }),

    [FIX_RECORD_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        loadingRecordToFix: false,
        recordToFixError: action.payload,
    }),

    [FIX_RECORD_SET]: (state, action) => ({
        ...initialState,
        loadingRecordToFix: false,
        recordToFix: action.payload,
    }),

    [FIX_RECORD_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function fixRecordReducer(state = {...initialState}, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
