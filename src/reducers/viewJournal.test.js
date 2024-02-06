import {
    VIEW_JOURNAL_LOADED,
    VIEW_JOURNAL_LOADING,
    VIEW_JOURNAL_LOAD_FAILED,
    ADMIN_JOURNAL_CLEAR,
    ADMIN_JOURNAL_UNLOCK,
} from 'actions/actionTypes';

import viewJournalReducer, { initialState } from './viewJournal';

describe('viewJournalReducer reducer', () => {
    it('sets details loading state', () => {
        const previousState = {
            ...initialState,
        };
        const expected = {
            ...previousState,
            loadingJournalToView: true,
        };
        const test = viewJournalReducer(previousState, { type: VIEW_JOURNAL_LOADING });
        expect(test).toEqual(expected);
    });

    it('sets details loaded state', () => {
        const previousState = {
            ...initialState,
            loadingJournalToView: true,
            isJournalLocked: false,
        };
        const expected = {
            ...previousState,
            journalToView: [
                {
                    test: 'test1',
                },
            ],
            loadingJournalToView: false,
        };
        const test = viewJournalReducer(previousState, {
            type: VIEW_JOURNAL_LOADED,
            payload: [
                {
                    test: 'test1',
                },
            ],
        });
        expect(test).toEqual(expected);
    });

    it('sets details load failed state', () => {
        const previousState = {
            ...initialState,
            loadingJournalToView: true,
        };
        const expected = {
            ...previousState,
            loadingJournalToView: false,
            journalLoadingError: true,
            journalToViewError: 'Test error message',
        };
        const test = viewJournalReducer(previousState, {
            type: VIEW_JOURNAL_LOAD_FAILED,
            payload: 'Test error message',
        });
        expect(test).toEqual(expected);
    });

    it('should clear a journal to view', () => {
        const test = viewJournalReducer(initialState, { type: ADMIN_JOURNAL_CLEAR });
        expect(test).toEqual({ ...initialState, isJournalLocked: false });
    });

    it('should set isJournalLocked flag to false on unlocking the journal', () => {
        const test = viewJournalReducer(initialState, {
            type: ADMIN_JOURNAL_UNLOCK,
        });
        expect(test).toEqual({ ...initialState, isJournalLocked: false });
    });
});
