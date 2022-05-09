import journalSearchKeywordsEnhancer from './journalSearchKeywordsEnhancer';
import { keywordsSearch } from 'mock/data/journals/search/keyword/virus';

const referenceObject = {
    payload: {
        exactMatch: [{ href: '/journal/view/32030', keyword: 'Virus', title: 'Virus' }],
        keywordMatch: [{ keyword: 'viruses' }, { keyword: 'virus' }],
        subjectMatch: [],
        titleMatch: [
            { keyword: 'virusologia' },
            { keyword: 'arbovirus' },
            { keyword: 'viruses' },
            { keyword: 'virus' },
            { keyword: 'virusdisease' },
            { keyword: 'papillomavirus' },
        ],
    },
    query: 'virus',
    type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
};
describe('Journal Search Keyword enhancer', () => {
    const next = jest.fn();
    const searchTerm = 'virus';
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
    it('returns exact, keyword and title', () => {
        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: keywordsSearch.data,
            query: searchTerm,
        });
        expect(next).toBeCalledWith(expect.objectContaining(referenceObject));
    });
    it('skip empty keywords', () => {
        const mockSearchData = {
            titleFuzzyMatch: [
                {
                    jnl_title: 'virus top list',
                },
            ],
            descriptionFuzzyMatch: [
                {
                    fez_journal_issn: [
                        {
                            fez_ulrichs: {
                                ulr_description: 'virus description',
                            },
                        },
                    ],
                },
            ],
        };
        const expectedObject = {
            payload: {
                exactMatch: [],
                keywordMatch: [{ keyword: 'virus' }],
                subjectMatch: [],
                titleMatch: [{ keyword: 'virus' }],
            },
            query: 'virus ',
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
        };
        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: mockSearchData,
            query: 'virus ',
        });
        expect(next).toBeCalledWith(expect.objectContaining(expectedObject));
    });
    it('returns title fuzzy match values without dups', () => {
        const mockSearchData = {
            titleFuzzyMatch: [
                {
                    jnl_title: 'virus to',
                },
            ],
        };
        const expectedObject = {
            payload: {
                exactMatch: [],
                keywordMatch: [],
                subjectMatch: [],
                titleMatch: [{ keyword: 'virus' }],
            },
            query: 'virus to & vir',
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
        };
        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: mockSearchData,
            query: 'virus to & vir',
        });
        expect(next).toBeCalledWith(expect.objectContaining(expectedObject));
    });
    it('returns title fuzzy match values with match on doaj title', () => {
        const mockSearchData = {
            titleFuzzyMatch: [
                {
                    jnl_title: 'no match',
                    fez_journal_doaj: {
                        jnl_doaj_title: 'virus to',
                    },
                },
            ],
        };
        const expectedObject = {
            payload: {
                exactMatch: [],
                keywordMatch: [],
                subjectMatch: [],
                titleMatch: [{ keyword: 'virus' }],
            },
            query: 'virus to & vir',
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
        };
        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: mockSearchData,
            query: 'virus to & vir',
        });
        expect(next).toBeCalledWith(expect.objectContaining(expectedObject));
    });
    it('returns title fuzzy match values with match on era title', () => {
        const mockSearchData = {
            titleFuzzyMatch: [
                {
                    jnl_title: 'no match',
                    fez_journal_era: [
                        {
                            jnl_era_title: 'virus to',
                        },
                    ],
                },
            ],
        };
        const expectedObject = {
            payload: {
                exactMatch: [],
                keywordMatch: [],
                subjectMatch: [],
                titleMatch: [{ keyword: 'virus' }],
            },
            query: 'virus to & vir',
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
        };
        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: mockSearchData,
            query: 'virus to & vir',
        });
        expect(next).toBeCalledWith(expect.objectContaining(expectedObject));
    });
    it('has no KeywordMatch values if no journal_issn data available', () => {
        const mockSearchData = {
            ...keywordsSearch.data,
            descriptionFuzzyMatch: [{ ...keywordsSearch.data.descriptionFuzzyMatch, fez_journal_issn: null }],
        };
        const mockReferenceObject = {
            ...referenceObject,
            payload: {
                ...referenceObject.payload,
                keywordMatch: [],
            },
        };
        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: mockSearchData,
            query: searchTerm,
        });

        expect(next).toBeCalledWith(expect.objectContaining(mockReferenceObject));
    });
    it('has no KeywordMatch values if theres no match', () => {
        const mockSearchData = {
            ...keywordsSearch.data,
        };
        const mockReferenceObject = {
            ...referenceObject,
            payload: {
                ...referenceObject.payload,
                keywordMatch: [],
            },
        };
        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: mockSearchData,
            query: 'empty',
        });

        expect(next).toBeCalledWith(expect.objectContaining(mockReferenceObject));
    });
    it('has no KeywordMatch values if no fez_ulrichs data available', () => {
        const mockSearchData = {
            ...keywordsSearch.data,
            descriptionFuzzyMatch: [
                {
                    ...keywordsSearch.data.descriptionFuzzyMatch,
                    fez_journal_issn: [
                        {
                            fez_ulrichs: null,
                        },
                    ],
                },
            ],
        };
        const mockReferenceObject = {
            ...referenceObject,
            payload: {
                ...referenceObject.payload,
                keywordMatch: [],
            },
        };
        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: mockSearchData,
            query: 'virus',
        });
        expect(next).toBeCalledWith(expect.objectContaining(mockReferenceObject));
    });
    it('has no titleMatch value if no titleFuzzyMatch data available', () => {
        const mockSearchData = {
            ...keywordsSearch.data,
            titleFuzzyMatch: [],
        };
        const mockReferenceObject = {
            ...referenceObject,
            payload: {
                ...referenceObject.payload,
                titleMatch: [],
            },
        };
        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: mockSearchData,
            query: 'virus',
        });
        expect(next).toBeCalledWith(expect.objectContaining(mockReferenceObject));
    });
    it('return empty arrays when API returned empty body', () => {
        const mockSearchData = {};
        const mockReferenceObject = {
            payload: {
                exactMatch: [],
                keywordMatch: [],
                subjectMatch: [],
                titleMatch: [],
            },
        };
        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: mockSearchData,
            query: 'virus',
        });
        expect(next).toBeCalledWith(expect.objectContaining(mockReferenceObject));
    });
    it('returns subjectMatch if subjectFuzzyMatch data is available', () => {
        const mockSearchData = {
            ...keywordsSearch.data,
            subjectFuzzyMatch: [
                {
                    jnl_subject_sources: 'Virus Journal X, Virus Journal Y',
                    jnl_subject_title: 'TestTitle',
                },
            ],
            query: 'virus',
        };
        const mockReferenceObject = {
            ...referenceObject,
            payload: {
                ...referenceObject.payload,
                subjectMatch: [
                    {
                        keyword: 'TestTitle',
                        sources: [{ name: 'virusjournalx' }, { name: 'virusjournaly' }],
                    },
                ],
            },
        };

        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: mockSearchData,
            query: 'virus',
        });
        expect(next).toBeCalledWith(expect.objectContaining(mockReferenceObject));
    });
    it('has no exactMatch value if no exactMatch data available', () => {
        const mockSearchData = {
            ...keywordsSearch.data,
            exactMatch: null,
        };
        const mockReferenceObject = {
            ...referenceObject,
            payload: {
                ...referenceObject.payload,
                exactMatch: [],
                keywordMatch: [{ keyword: 'descriptiontest' }],
                titleMatch: [{ keyword: 'titletest' }],
            },
            query: 'test',
        };
        // Mock the base data to a reasonable return set for testing.
        mockSearchData.descriptionFuzzyMatch.forEach(obj =>
            obj.fez_journal_issn.forEach(element => (element.fez_ulrichs.ulr_description = 'descriptionTest')),
        );
        mockSearchData.titleFuzzyMatch.forEach(obj => (obj.jnl_title = 'titleTest'));

        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: mockSearchData,
            query: 'test',
        });

        expect(next).toBeCalledWith(expect.objectContaining(mockReferenceObject));
    });
    it('has no keyword match if no descriptionFuzzyMatch data available', () => {
        const mockSearchData = {
            ...keywordsSearch.data,
            descriptionFuzzyMatch: [],
        };
        mockSearchData.titleFuzzyMatch.forEach(obj => (obj.jnl_title = 'titleTest'));
        const mockReferenceObject = {
            ...referenceObject,
            payload: {
                ...referenceObject.payload,
                keywordMatch: [],
                titleMatch: [{ keyword: 'titletest' }],
            },
            query: 'test',
        };

        journalSearchKeywordsEnhancer()(next)({
            type: 'JOURNAL_SEARCH_KEYWORDS_LOADED',
            payload: mockSearchData,
            query: 'test',
        });

        expect(next).toBeCalledWith(expect.objectContaining(mockReferenceObject));
    });
});
