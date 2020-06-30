import * as actions from 'actions/actionTypes';
import doiReducer from './doi';

describe('batchImportDirectories reducer', () => {
    const initialState = {
        doiRequesting: false,
        doiUpdated: null,
    };
    it('should run reducer for loading state', () => {
        const test = doiReducer(initialState, {
            type: actions.RECORD_DOI_UPDATE_REQUESTING,
        });
        const expected = {
            ...initialState,
            doiRequesting: true,
        };
        expect(test).toEqual(expected);
    });
    it('should run reducer for loading state', () => {
        const test = doiReducer(initialState, {
            type: actions.RECORD_DOI_UPDATE_SUCCEEDED,
        });
        const expected = {
            ...initialState,
            doiUpdated: true,
        };
        expect(test).toEqual(expected);
    });
    it('should run reducer for loading failed state', () => {
        const test = doiReducer(initialState, {
            type: actions.RECORD_DOI_UPDATE_FAILED,
        });
        const expected = {
            ...initialState,
            doiUpdated: false,
        };
        expect(test).toEqual(expected);
    });
});
