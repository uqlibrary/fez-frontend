import * as actions from 'actions/actionTypes';
import journalUserLists, { initialState } from './journalUserLists';

describe('reducer', () => {
    it('loading', () => {
        const test = journalUserLists(initialState, { type: actions.JOURNAL_USER_LISTS_LOADING });
        expect(test).toEqual({ ...initialState, loading: true });
    });

    it('success', () => {
        const payload = [1, 2, 3];
        const test = journalUserLists(initialState, {
            type: actions.JOURNAL_USER_LISTS_SUCCESS,
            payload: payload,
        });

        expect(test).toEqual({ ...initialState, data: payload });
    });

    it('error', () => {
        const error = {
            status: 500,
            message: 'Test error',
        };
        const test = journalUserLists(initialState, {
            type: actions.JOURNAL_USER_LISTS_FAILED,
            payload: error,
        });
        expect(test).toEqual({ ...initialState, error: error });
    });

    it('invalid', () => {
        const test = journalUserLists(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
