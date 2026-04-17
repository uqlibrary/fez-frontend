import {
    JOURNAL_LOOKUP_LOADING,
    JOURNAL_LOOKUP_LOADED,
    JOURNAL_LOOKUP_FAILED,
    JOURNAL_SEARCH_KEYWORDS_LOADED,
    JOURNAL_SEARCH_KEYWORDS_LOADING,
    JOURNAL_SEARCH_KEYWORDS_FAILED,
    CLEAR_JOURNAL_SEARCH_KEYWORDS,
} from 'actions/actionTypes';

import journalReducer, { initialJournalSearchKeywords, keywordOnlySuffix } from './journals';

const initialState = {
    itemsList: [],
    itemsLoading: false,
    itemsLoadingError: false,
    journalSearchKeywordsLoading: false,
    journalSearchKeywords: { ...initialJournalSearchKeywords },
    journalSearchKeywordsError: null,
    isInitialValues: true,
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

    describe('keywords', () => {
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
                ...previousState,
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
                ...previousState,
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

        describe('keywordsOnly', () => {
            it('sets search keywords loading state', () => {
                const expected = {
                    ...initialState,
                    [keywordOnlySuffix]: {
                        journalSearchKeywordsError: null,
                        journalSearchKeywordsLoading: true,
                    },
                };
                const test = journalReducer(
                    { ...initialState },
                    {
                        type: `${JOURNAL_SEARCH_KEYWORDS_LOADING}${keywordOnlySuffix}`,
                        payload: 'test1',
                    },
                );
                expect(test).toEqual(expected);
            });

            it('sets search keywords loaded state', () => {
                const previousState = {
                    ...initialState,
                    journalSearchKeywordsLoading: true,
                };
                const expected = {
                    ...previousState,
                    [keywordOnlySuffix]: {
                        isInitialValues: false,
                        journalSearchKeywordsLoading: false,
                        journalSearchKeywords: [
                            {
                                exactMatch: ['test1'],
                            },
                        ],
                        journalSearchKeywordsError: null,
                    },
                };
                const test = journalReducer(previousState, {
                    type: `${JOURNAL_SEARCH_KEYWORDS_LOADED}${keywordOnlySuffix}`,
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
                    ...previousState,
                    [keywordOnlySuffix]: {
                        journalSearchKeywordsLoading: false,
                        journalSearchKeywordsError: true,
                        journalSearchKeywords: { ...initialJournalSearchKeywords },
                    },
                };
                const test = journalReducer(previousState, {
                    type: `${JOURNAL_SEARCH_KEYWORDS_FAILED}${keywordOnlySuffix}`,
                    payload: true,
                });
                expect(test).toEqual(expected);
            });
        });
    });
});
