import * as actions from 'actions/actionTypes';
import batchImportDirectoriesReducer from './batchImportDirectories';

describe('batchImportDirectories reducer', () => {
    const initialState = {
        batchImportDirectoryList: [],
        batchImportDirectoryLoading: false,
        batchImportDirectoryLoadingError: false,
    };
    it('should run reducer for loading state', () => {
        const test = batchImportDirectoriesReducer(initialState, {
            type: actions.DIRECTORY_LIST_LOADING,
        });
        const expected = {
            ...initialState,
            batchImportDirectoryLoading: true,
        };
        expect(test).toEqual(expected);
    });
    it('should run reducer for loading state', () => {
        const testPayload = {};
        const test = batchImportDirectoriesReducer(initialState, {
            type: actions.DIRECTORY_LIST_LOADED,
            payload: testPayload,
        });
        const expected = {
            ...initialState,
            batchImportDirectoryList: testPayload,
        };
        expect(test).toEqual(expected);
    });
    it('should run reducer for loading failed state', () => {
        const test = batchImportDirectoriesReducer(initialState, {
            type: actions.DIRECTORY_LIST_FAILED,
        });
        const expected = {
            ...initialState,
            batchImportDirectoryLoadingError: true,
        };
        expect(test).toEqual(expected);
    });
});
