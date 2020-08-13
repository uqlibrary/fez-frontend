import * as actions from 'actions/actionTypes';
import viewRecordReducer from './viewRecord';
import { initialState } from './viewRecord';

describe('viewRecord reducer', () => {
    const mockRecord = {
        rek_pid: 'UQ:123456',
        rek_title: 'This is a title',
        rek_description: 'This is a description.',
    };

    it('should return loading in progress', () => {
        const testState = viewRecordReducer(initialState, { type: actions.VIEW_RECORD_LOADING });
        const expectedState = {
            loadingRecordToView: true,
            isRecordLocked: false,
            isDeleted: false,
            recordToView: null,
            recordToViewError: null,
            hideCulturalSensitivityStatement: false,
        };
        expect(testState).toEqual(expectedState);
    });

    it('should set cultural message to hide', () => {
        const testState = viewRecordReducer(initialState, {
            type: actions.VIEW_RECORD_CULTURAL_SENSITIVITY_STATEMENT_HIDE,
        });
        const expectedState = {
            loadingRecordToView: true,
            isRecordLocked: false,
            isDeleted: false,
            recordToView: null,
            recordToViewError: null,
            hideCulturalSensitivityStatement: true,
        };
        expect(testState).toEqual(expectedState);
    });

    it('should return a record to be viewed', () => {
        const test = viewRecordReducer(initialState, { type: actions.VIEW_RECORD_LOADED, payload: mockRecord });
        expect(test.loadingRecordToView).toBeFalsy();
        expect(test.hideCulturalSensitivityStatement).toEqual(false);
        expect(test.recordToView).toEqual(mockRecord);
        expect(test.recordToViewError).toBeNull();
    });

    it("should return a record to be viewed and keep hidden cultural statemet if it's hidden", () => {
        const test = viewRecordReducer(
            { ...initialState, hideCulturalSensitivityStatement: true },
            { type: actions.VIEW_RECORD_LOADED, payload: mockRecord },
        );
        expect(test.loadingRecordToView).toBeFalsy();
        expect(test.hideCulturalSensitivityStatement).toEqual(true);
        expect(test.recordToView).toEqual(mockRecord);
        expect(test.recordToViewError).toBeNull();
    });

    it('should return that it has failed to load data', () => {
        const errorMsg = 'This is an error';
        const test = viewRecordReducer(initialState, { type: actions.VIEW_RECORD_LOAD_FAILED, payload: errorMsg });
        expect(test.recordToView).toBeNull();
        expect(test.loadingRecordToView).toBeFalsy();
        expect(test.recordToViewError).toEqual(errorMsg);
    });

    it('should clear a record to view', () => {
        const test = viewRecordReducer(initialState, { type: actions.VIEW_RECORD_CLEAR });
        expect(test).toEqual(initialState);
    });

    it('should return unchanged state if action is invalid', () => {
        const test = viewRecordReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });

    it('should set isRecordUnlock flag to true', () => {
        const test = viewRecordReducer(initialState, {
            type: actions.VIEW_RECORD_LOADED,
            payload: {
                rek_pid: 'UQ:1234',
                rek_title: 'This is a title',
                rek_description: 'This is a description.',
                rek_editing_user: 'uqtest',
            },
        });
        expect(test).toEqual({
            ...initialState,
            isRecordLocked: true,
            loadingRecordToView: false,
            recordToView: {
                rek_pid: 'UQ:1234',
                rek_title: 'This is a title',
                rek_description: 'This is a description.',
                rek_editing_user: 'uqtest',
            },
        });
    });

    it('should set isRecordUnlock flag to false on unlocking the record', () => {
        const test = viewRecordReducer(initialState, {
            type: actions.VIEW_RECORD_UNLOCK,
        });
        expect(test).toEqual({ ...initialState, isRecordLocked: false });
    });

    it('should set isDeleted flag to true', () => {
        const test = viewRecordReducer(initialState, {
            type: actions.VIEW_RECORD_DELETED,
            payload: {
                rek_pid: 'UQ:1234',
                rek_title: 'This is a title',
                rek_description: 'This is a description.',
                rek_editing_user: 'uqtest',
            },
        });

        expect(test).toEqual({
            ...initialState,
            isRecordLocked: false,
            hideCulturalSensitivityStatement: true,
            loadingRecordToView: false,
            isDeleted: true,
            recordToView: {
                rek_pid: 'UQ:1234',
                rek_title: 'This is a title',
                rek_description: 'This is a description.',
                rek_editing_user: 'uqtest',
            },
        });
    });
});
