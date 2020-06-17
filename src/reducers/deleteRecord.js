import {
    DELETE_RECORD_LOADING,
    DELETE_RECORD_LOADED,
    DELETE_RECORD_LOAD_FAILED,
    DELETE_RECORD_SET,
    DELETE_RECORD_CLEAR,
} from 'actions/actionTypes';

export const initialState = {
    recordToDelete: null,
    loadingRecordToDelete: true,
    recordToDeleteError: null,
};

const handlers = {
    [DELETE_RECORD_LOADING]: () => ({
        ...initialState,
    }),

    [DELETE_RECORD_LOADED]: (state, action) => ({
        ...initialState,
        loadingRecordToDelete: false,
        recordToDelete: action.payload,
    }),

    [DELETE_RECORD_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        loadingRecordToDelete: false,
        recordToDeleteError: action.payload,
    }),

    [DELETE_RECORD_SET]: (state, action) => ({
        ...initialState,
        loadingRecordToDelete: false,
        recordToDelete: action.payload,
    }),

    [DELETE_RECORD_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function deleteRecordReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
