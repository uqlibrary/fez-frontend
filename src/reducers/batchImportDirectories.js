import * as actions from '../actions/actionTypes';

export const initialState = {
    batchImportDirectoryList: [],
    batchImportDirectoryLoading: false,
    batchImportDirectoryLoadingError: false,
};

const handlers = {
    [actions.DIRECTORY_LIST_LOADING]: state => ({
        ...state,
        batchImportDirectoryList: [],
        batchImportDirectoryLoading: true,
        batchImportDirectoryLoadingError: false,
    }),
    [actions.DIRECTORY_LIST_LOADED]: (state, action) => ({
        ...state,
        batchImportDirectoryList: action.payload,
        batchImportDirectoryLoading: false,
        batchImportDirectoryLoadingError: false,
    }),
    [actions.DIRECTORY_LIST_FAILED]: state => ({
        ...state,
        batchImportDirectoryList: [],
        batchImportDirectoryLoading: false,
        batchImportDirectoryLoadingError: true,
    }),
};

export default function batchImportDirectoriesReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
