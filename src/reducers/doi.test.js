import * as actions from 'actions/actionTypes';
import doiReducer from './doi';

describe('DOI reducer', () => {
    const initialState = {
        doiRequesting: false,
        doiUpdated: false,
        doiFailed: false,
    };
    it('should set loading state', () => {
        const test = doiReducer(initialState, {
            type: actions.RECORD_DOI_UPDATE_REQUESTING,
        });
        const expected = {
            ...initialState,
            doiRequesting: true,
        };
        expect(test).toEqual(expected);
    });
    it('should set succeeded state', () => {
        const test = doiReducer(initialState, {
            type: actions.RECORD_DOI_UPDATE_SUCCEEDED,
        });
        const expected = {
            ...initialState,
            doiUpdated: true,
        };
        expect(test).toEqual(expected);
    });
    it('should set failed state', () => {
        const test = doiReducer(initialState, {
            type: actions.RECORD_DOI_UPDATE_FAILED,
        });
        const expected = {
            ...initialState,
            doiFailed: true,
        };
        expect(test).toEqual(expected);
    });
});
