import journalSearchKeywordsEnhancer from './journalSearchKeywordsEnhancer';
import { keywordsSearch } from 'mock/data/journals/search/keyword/virus';

describe('Journal Search Keyword enhancer', () => {
    const next = jest.fn();
    it('calls loading', () => {
        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADING',
            payload: {},
            query: '',
        });
        expect(next).toBeCalledWith(
            expect.objectContaining({
                payload: {},
                query: '',
                type: 'JOURNAL_SEARCH_KEYWORDS_LOADING',
            }),
        );
    });
    it('has all payload elements populated', () => {
        const searchTerm = 'virus';
        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: keywordsSearch.data,
            query: searchTerm,
        });
        expect(next).toBeCalledWith(
            expect.objectContaining({
                payload: expect.objectContaining({
                    exactMatch: expect.arrayContaining([
                        expect.objectContaining({
                            href: expect.any(String),
                            keyword: expect.any(String),
                            title: expect.any(String),
                        }),
                    ]),
                    keywordMatch: expect.arrayContaining([
                        expect.objectContaining({
                            keyword: expect.any(String),
                        }),
                    ]),
                    subjectMatch: false,
                    titleMatch: expect.arrayContaining([
                        expect.objectContaining({
                            keyword: expect.any(String),
                        }),
                    ]),
                }),
                query: searchTerm,
                type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            }),
        );
    });
    it('have no exactMatch value', () => {
        const mockSearchData = {
            ...keywordsSearch.data,
            titleExactMatch: null,
        };
        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: mockSearchData,
            query: '',
        });
        expect(next).toBeCalledWith(
            expect.objectContaining({
                payload: expect.objectContaining({
                    exactMatch: [],
                    keywordMatch: expect.any(Object),
                    subjectMatch: expect.any(Boolean),
                    titleMatch: expect.any(Object),
                }),
                type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            }),
        );
    });
    it('Has no KeywordMatch values', () => {
        const mockSearchData = {
            ...keywordsSearch.data,
            descriptionFuzzyMatch: [{ ...keywordsSearch.data.descriptionFuzzyMatch, fez_journal_issn: null }],
        };
        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: mockSearchData,
            query: 'virus',
        });
        expect(next).toBeCalledWith(
            expect.objectContaining({
                payload: expect.objectContaining({
                    exactMatch: expect.any(Object),
                    keywordMatch: [],
                    subjectMatch: false,
                    titleMatch: expect.any(Object),
                }),
                type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            }),
        );
    });

    it('Has no fez ulrichs information returned', () => {
        const mockSearchData = {
            ...keywordsSearch.data,
            descriptionFuzzyMatch: [
                {
                    ...keywordsSearch.data.descriptionFuzzyMatch,
                    fez_journal_issn: [
                        {
                            fez_ulrichs: {},
                        },
                    ],
                },
            ],
        };
        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: mockSearchData,
            query: 'virus',
        });
        expect(next).toBeCalledWith(
            expect.objectContaining({
                payload: expect.objectContaining({
                    exactMatch: expect.any(Object),
                    keywordMatch: [],
                    subjectMatch: false,
                    titleMatch: expect.any(Object),
                }),
                type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            }),
        );
    });
    it('Have no keyword match if no description fuzzy match', () => {
        const mockSearchData = {
            ...keywordsSearch.data,
            descriptionFuzzyMatch: [],
        };
        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: mockSearchData,
            query: 'virus',
        });
        expect(next).toBeCalledWith(
            expect.objectContaining({
                payload: expect.objectContaining({
                    exactMatch: expect.any(Object),
                    keywordMatch: [],
                    subjectMatch: expect.any(Boolean),
                    titleMatch: expect.any(Object),
                }),
                type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            }),
        );
    });

    it('Have no titleMatch value', () => {
        const mockSearchData = {
            ...keywordsSearch.data,
            titleFuzzyMatch: [],
        };
        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: mockSearchData,
            query: 'virus',
        });
        expect(next).toBeCalledWith(
            expect.objectContaining({
                payload: expect.objectContaining({
                    exactMatch: expect.any(Object),
                    keywordMatch: expect.any(Object),
                    subjectMatch: expect.any(Boolean),
                    titleMatch: [],
                }),
                type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            }),
        );
    });
    it('Have subject Fuzzy match value', () => {
        const mockSearchData = {
            ...keywordsSearch.data,
            subjectFuzzyMatch: [
                {
                    jnl_subject_sources: 'Virus Journal A, Virus Journal B',
                },
            ],
        };
        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: mockSearchData,
            query: 'virus',
        });
        expect(next).toBeCalledWith(
            expect.objectContaining({
                payload: expect.objectContaining({
                    exactMatch: expect.any(Object),
                    keywordMatch: expect.any(Object),
                    subjectMatch: expect.any(Object),
                    titleMatch: expect.any(Object),
                }),
                type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            }),
        );
    });
});
