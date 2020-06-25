import * as actions from 'actions/actionTypes';
import deleteRecordReducer from './deleteRecord';
import { initialState } from './deleteRecord';

describe('deleteRecord reducer', () => {
    const aMockRecordToDelete = {
        rek_pid: 'UQ:123456',
        rek_title: 'This is a title',
        rek_description: 'This is a description.',
    };

    it('returns that the publication data is loading', () => {
        const test = deleteRecordReducer(initialState, { type: actions.DELETE_RECORD_LOADING });
        expect(test.loadingRecordToDelete).toBeTruthy();
        expect(test.recordToDelete).toBeNull();
        expect(test.recordToDeleteError).toBeNull();
    });

    it('returns a record to be deleted', () => {
        const test = deleteRecordReducer(initialState, {
            type: actions.DELETE_RECORD_LOADED,
            payload: aMockRecordToDelete,
        });
        expect(test.loadingRecordToDelete).toBeFalsy();
        expect(test.recordToDelete).toEqual(aMockRecordToDelete);
        expect(test.recordToDeleteError).toBeNull();
    });

    it('returns that it has failed to return data', () => {
        const errorMsg = 'This is an error';
        const test = deleteRecordReducer(initialState, { type: actions.DELETE_RECORD_LOAD_FAILED, payload: errorMsg });
        expect(test.recordToDelete).toBeNull();
        expect(test.loadingRecordToDelete).toBeFalsy();
        expect(test.recordToDeleteError).toEqual(errorMsg);
    });

    it('returns a record that it been set to delete', () => {
        const test = deleteRecordReducer(initialState, {
            type: actions.DELETE_RECORD_SET,
            payload: aMockRecordToDelete,
        });
        expect(test.recordToDelete).toEqual(aMockRecordToDelete);
    });

    it('returns just the initialState after clearing the record', () => {
        const test = deleteRecordReducer(initialState, { type: actions.DELETE_RECORD_CLEAR });
        expect(test).toEqual(initialState);
    });
});
