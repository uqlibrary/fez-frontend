import * as actions from '../actions/actionTypes';
import viewRecordReducer from './viewRecord';
import {initialState} from './viewRecord';

describe('viewRecord reducer', () => {

    const mockRecord = {
        "rek_pid": "UQ:123456",
        "rek_title": "This is a title",
        "rek_description": "This is a description."
    };

    it('should return loading in progress', () => {
        const test = viewRecordReducer(initialState, {type: actions.VIEW_RECORD_LOADING});
        expect(test.loadingRecordToView).toBeTruthy();
        expect(test.recordToView).toBeNull();
        expect(test.recordToViewError).toBeNull();
    });

    it('should return a record to be viewed', () => {
        const test = viewRecordReducer(initialState, {type: actions.VIEW_RECORD_LOADED, payload: mockRecord});
        expect(test.loadingRecordToView).toBeFalsy();
        expect(test.recordToView).toEqual(mockRecord);
        expect(test.recordToViewError).toBeNull();
    });

    it('should return that it has failed to load data', () => {
        const errorMsg = 'This is an error';
        const test = viewRecordReducer(initialState, {type: actions.VIEW_RECORD_LOAD_FAILED, payload: errorMsg});
        expect(test.recordToView).toBeNull();
        expect(test.loadingRecordToView).toBeFalsy();
        expect(test.recordToViewError).toEqual(errorMsg);
    });

    it('should set a record to view', () => {
        const test = viewRecordReducer(initialState, {type: actions.VIEW_RECORD_SET, payload: mockRecord});
        expect(test.recordToView).toEqual(mockRecord);
    });

    it('should clear a record to view', () => {
        const test = viewRecordReducer(initialState, {type: actions.VIEW_RECORD_CLEAR});
        expect(test).toEqual(initialState);
    });

    it('should return unchanged state if action is invalid', () => {
        const test = viewRecordReducer(initialState, {type: 'INVALID_ACTION_TYPE'});
        expect(test).toEqual(initialState);
    });

});