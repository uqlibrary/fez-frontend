import {
    JOURNAL_LOOKUP_LOADING,
    JOURNAL_LOOKUP_LOADED,
    JOURNAL_LOOKUP_FAILED,
    JOURNAL_LOADED,
    JOURNAL_LOADING,
    JOURNAL_LOAD_FAILED,
    JOURNAL_SEARCH_KEYWORDS_LOADED,
    JOURNAL_SEARCH_KEYWORDS_LOADING,
    JOURNAL_SEARCH_KEYWORDS_FAILED,
    CLEAR_JOURNAL_SEARCH_KEYWORDS,
    ADMIN_JOURNAL_CLEAR,
    ADMIN_JOURNAL_UNLOCK,
} from 'actions/actionTypes';

import journalReducer, { initialJournalSearchKeywords } from './journals';

const initialState = {
    itemsList: [],
    itemsLoading: false,
    itemsLoadingError: false,
    journalDetails: {},
    journalLoading: false,
    journalLoadingError: false,
    journalSearchKeywordsLoading: false,
    journalSearchKeywords: { ...initialJournalSearchKeywords },
    journalSearchKeywordsError: null,
    isInitialValues: true,
    isJournalLocked: true,
    journalToViewError: null,
};

describe('journalReducer reducer', () => {
    it('sets lookup loading state', () => {
        const previousState = {
            ...initialState,
        };
        const expected = {
            ...previousState,
            itemsLoading: true,
        };
        const test = journalReducer(previousState, { type: JOURNAL_LOOKUP_LOADING, payload: 'test1' });
        expect(test).toEqual(expected);
    });

    it('sets lookup loaded state', () => {
        const previousState = {
            ...initialState,
            itemsLoading: true,
        };
        const expected = {
            ...previousState,
            itemsLoading: false,
            itemsList: [
                {
                    test: 'test1',
                },
            ],
        };
        const test = journalReducer(previousState, {
            type: JOURNAL_LOOKUP_LOADED,
            payload: [
                {
                    test: 'test1',
                },
            ],
        });
        expect(test).toEqual(expected);
    });

    it('sets lookup failed state', () => {
        const previousState = {
            ...initialState,
            itemsLoading: true,
        };
        const expected = {
            ...previousState,
            itemsLoading: false,
            itemsLoadingError: true,
            itemsList: [],
        };
        const test = journalReducer(previousState, {
            type: JOURNAL_LOOKUP_FAILED,
        });
        expect(test).toEqual(expected);
    });

    it('sets details loading state', () => {
        const previousState = {
            ...initialState,
        };
        const expected = {
            ...previousState,
            journalLoading: true,
        };
        const test = journalReducer(previousState, { type: JOURNAL_LOADING });
        expect(test).toEqual(expected);
    });

    it('sets details loaded state', () => {
        const previousState = {
            ...initialState,
            journalLoading: true,
            isJournalLocked: false,
        };
        const expected = {
            ...previousState,
            journalDetails: [
                {
                    test: 'test1',
                },
            ],
            journalLoading: false,
        };
        const test = journalReducer(previousState, {
            type: JOURNAL_LOADED,
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
            journalLoading: true,
        };
        const expected = {
            ...previousState,
            journalLoading: false,
            journalLoadingError: true,
            journalToViewError: 'Test error message',
        };
        const test = journalReducer(previousState, {
            type: JOURNAL_LOAD_FAILED,
            payload: 'Test error message',
        });
        expect(test).toEqual(expected);
    });

    it('sets search keywords loading state', () => {
        const previousState = {
            ...initialState,
        };
        const expected = {
            ...previousState,
            journalSearchKeywordsLoading: true,
        };
        const test = journalReducer(previousState, { type: JOURNAL_SEARCH_KEYWORDS_LOADING, payload: 'test1' });
        expect(test).toEqual(expected);
    });

    it('sets search keywords loaded state', () => {
        const previousState = {
            ...initialState,
            journalSearchKeywordsLoading: true,
        };
        const expected = {
            journalSearchKeywordsLoading: false,
            journalSearchKeywords: [
                {
                    exactMatch: ['test1'],
                },
            ],
            journalSearchKeywordsError: null,
            isInitialValues: false,
        };
        const test = journalReducer(previousState, {
            type: JOURNAL_SEARCH_KEYWORDS_LOADED,
            payload: [
                {
                    exactMatch: ['test1'],
                },
            ],
        });
        expect(test).toEqual(expected);
    });

    it('sets search keywords failed state', () => {
        const previousState = {
            ...initialState,
            journalSearchKeywordsLoading: true,
        };
        const expected = {
            journalSearchKeywordsLoading: false,
            journalSearchKeywordsError: true,
            journalSearchKeywords: { ...initialJournalSearchKeywords },
        };
        const test = journalReducer(previousState, {
            type: JOURNAL_SEARCH_KEYWORDS_FAILED,
            payload: true,
        });
        expect(test).toEqual(expected);
    });

    it('sets search keywords clear state', () => {
        const previousState = {
            journalSearchKeywords: {
                exact: ['test1'],
            },
            isInitialValues: false,
        };
        const expected = {
            ...previousState,
            journalSearchKeywords: { ...initialJournalSearchKeywords },
            isInitialValues: true,
        };
        const test = journalReducer(previousState, {
            type: CLEAR_JOURNAL_SEARCH_KEYWORDS,
        });
        expect(test).toEqual(expected);
    });

    it('should clear a journal to view', () => {
        const test = journalReducer(initialState, { type: ADMIN_JOURNAL_CLEAR });
        expect(test).toEqual({ ...initialState, isJournalLocked: false });
    });

    it('should set isJournalLocked flag to false on unlocking the journal', () => {
        const test = journalReducer(initialState, {
            type: ADMIN_JOURNAL_UNLOCK,
        });
        expect(test).toEqual({ ...initialState, isJournalLocked: false });
    });
});
