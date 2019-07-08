import * as actions from 'actions/actionTypes';
import createCollectionReducer from './createCollection';

describe('createCollectionReducer', () => {
    const initialState = {
        newRecord: null,
        newCollectionError: false,
        newCollectionErrorMessage: null,
        newCollectionSaving: false,
    };

    const aRecordToCreate = {
        rek_title: 'This is a title',
        rek_description: 'This is a description.',
    };

    it('clears the state of a new record and returns the initialState', () => {
        const test = createCollectionReducer(initialState, { type: actions.CREATE_COLLECTION_RESET });
        expect(test).toEqual(initialState);
    });

    it('returns the payload of the created record, and whether the file upload was successful', () => {
        const test = createCollectionReducer(initialState, {
            type: actions.CREATE_COLLECTION_SUCCESS,
            payload: aRecordToCreate,
        });
        expect(test).toEqual({ ...initialState, newRecord: aRecordToCreate });
    });

    it('returns the payload of the failed record and that there was an error', () => {
        const test = createCollectionReducer(initialState, {
            type: actions.CREATE_COLLECTION_FAILED,
            payload: aRecordToCreate,
        });
        expect(test).toEqual({ ...initialState, newCollectionError: true, newCollectionErrorMessage: aRecordToCreate });
    });

    it('returns that the new record is currently being saved', () => {
        const test = createCollectionReducer(initialState, {
            type: actions.CREATE_COLLECTION_SAVING,
            payload: aRecordToCreate,
        });
        expect(test).toEqual({ ...initialState, newCollectionSaving: true });
    });

    it('returns the initialState when an invalid action hander is supplied', () => {
        const test = createCollectionReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
