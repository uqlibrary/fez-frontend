import * as actions from 'actions/actionTypes';
import fixRecordReducer from './fixRecord';
import { initialState } from './fixRecord';

describe('fixRecord reducer', () => {
    const aMockRecordToFix = {
        rek_pid: 'UQ:123456',
        rek_title: 'This is a title',
        rek_description: 'This is a description.',
    };

    it('returns that the publication data is loading', () => {
        const test = fixRecordReducer(initialState, { type: actions.FIX_RECORD_LOADING });
        expect(test.loadingRecordToFix).toBeTruthy();
        expect(test.recordToFix).toBeNull();
        expect(test.recordToFixError).toBeNull();
    });

    it('returns a record to be fixed', () => {
        const test = fixRecordReducer(initialState, { type: actions.FIX_RECORD_LOADED, payload: aMockRecordToFix });
        expect(test.loadingRecordToFix).toBeFalsy();
        expect(test.recordToFix).toEqual(aMockRecordToFix);
        expect(test.recordToFixError).toBeNull();
    });

    it('returns that it has failed to return data', () => {
        const errorMsg = 'This is an error';
        const test = fixRecordReducer(initialState, { type: actions.FIX_RECORD_LOAD_FAILED, payload: errorMsg });
        expect(test.recordToFix).toBeNull();
        expect(test.loadingRecordToFix).toBeFalsy();
        expect(test.recordToFixError).toEqual(errorMsg);
    });

    it('returns a record that it been set to claim/fix', () => {
        const test = fixRecordReducer(initialState, { type: actions.FIX_RECORD_SET, payload: aMockRecordToFix });
        expect(test.recordToFix).toEqual(aMockRecordToFix);
    });

    it('returns just the initialState after clearing the record', () => {
        const test = fixRecordReducer(initialState, { type: actions.FIX_RECORD_CLEAR });
        expect(test).toEqual(initialState);
    });

    it('returns just the initialState if the action type is invalid', () => {
        const test = fixRecordReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
