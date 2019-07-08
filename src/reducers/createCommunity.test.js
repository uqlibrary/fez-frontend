import * as actions from 'actions/actionTypes';
import createCommunityReducer from './createCommunity';

describe('createCommunityReducer', () => {
    const initialState = {
        newRecord: null,
        newCommunityError: false,
        newCommunityErrorMessage: null,
        newCommunitySaving: false,
    };

    const aRecordToCreate = {
        rek_title: 'This is a title',
        rek_description: 'This is a description.',
    };

    it('clears the state of a new record and returns the initialState', () => {
        const test = createCommunityReducer(initialState, { type: actions.CREATE_COMMUNITY_RESET });
        expect(test).toEqual(initialState);
    });

    it('returns the payload of the created record, and whether the file upload was successful', () => {
        const test = createCommunityReducer(initialState, {
            type: actions.CREATE_COMMUNITY_SUCCESS,
            payload: aRecordToCreate,
        });
        expect(test).toEqual({ ...initialState, newRecord: aRecordToCreate });
    });

    it('returns the payload of the failed record and that there was an error', () => {
        const test = createCommunityReducer(initialState, {
            type: actions.CREATE_COMMUNITY_FAILED,
            payload: aRecordToCreate,
        });
        expect(test).toEqual({ ...initialState, newCommunityError: true, newCommunityErrorMessage: aRecordToCreate });
    });

    it('returns that the new record is currently being saved', () => {
        const test = createCommunityReducer(initialState, {
            type: actions.CREATE_COMMUNITY_SAVING,
            payload: aRecordToCreate,
        });
        expect(test).toEqual({ ...initialState, newCommunitySaving: true });
    });

    it('returns the initialState when an invalid action hander is supplied', () => {
        const test = createCommunityReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
