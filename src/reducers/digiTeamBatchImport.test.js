import * as actions from 'actions/actionTypes';
import digiTeamBatchImportReducer from './digiTeamBatchImport';

describe('digiTeambatchImport reducer', () => {
    const initialState = {
        communityCollectionsList: [],
        communityCollectionsLoading: false,
        communityCollectionsLoadingError: false,
    };
    it('should run reducer for loading state', () => {
        const test = digiTeamBatchImportReducer(initialState, {
            type: actions.COLLECTION_LIST_LOADING,
        });
        const expected = {
            ...initialState,
            communityCollectionsLoading: true,
        };
        expect(test).toEqual(expected);
    });
    it('should run reducer for loading state', () => {
        const testPayload = {};
        const test = digiTeamBatchImportReducer(initialState, {
            type: actions.COLLECTION_LIST_LOADED,
            payload: testPayload,
        });
        const expected = {
            ...initialState,
            communityCollectionsList: testPayload,
        };
        expect(test).toEqual(expected);
    });
    it('should run reducer for loading failed state', () => {
        const test = digiTeamBatchImportReducer(initialState, {
            type: actions.COLLECTION_LIST_FAILED,
        });
        const expected = {
            ...initialState,
            communityCollectionsLoadingError: true,
        };
        expect(test).toEqual(expected);
    });
});
