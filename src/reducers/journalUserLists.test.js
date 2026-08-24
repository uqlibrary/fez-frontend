import * as actions from 'actions/actionTypes';
import journalUserLists, { initialState } from './journalUserLists';

describe('journalUserLists reducer', () => {
    describe.each([actions.JOURNAL_USER_LISTS_LOADING])('%s', type => {
        it('should set loading', () => {
            expect(journalUserLists(initialState, { type })).toEqual({
                ...initialState,
                loading: true,
            });
        });
    });

    describe.each([
        [actions.JOURNAL_USER_LISTS_SUCCESS, false],
        [actions.JOURNAL_USER_LISTS_CRUD_SUCCESS, true],
    ])('%s', (type, isDirty) => {
        it('should handle success', () => {
            const payload = [1, 2, 3];

            expect(journalUserLists(initialState, { type, payload })).toEqual({
                ...initialState,
                data: payload,
                isDirty,
            });
        });
    });

    describe.each([actions.JOURNAL_USER_LISTS_FAILED])('%s', type => {
        it('should handle failure', () => {
            const error = {
                status: 500,
                message: 'Test error',
            };

            expect(journalUserLists(initialState, { type, payload: error })).toEqual({
                ...initialState,
                error,
            });
        });
    });

    it('should ignore unknown actions', () => {
        expect(journalUserLists(initialState, { type: 'INVALID_ACTION_TYPE' })).toEqual(initialState);
    });
});
