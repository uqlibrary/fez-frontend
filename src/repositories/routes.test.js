import React from 'react';
import * as routes from './routes';

describe('Backend routes method', () => {
    it('should escape elastic search reserved characters', () => {
        const searchQuery = " The next chars should be escaped: + - = && || > < ! ( ) { } [ ] ^ \" ~ * ? : \\ / Did it work?  ";
        const expected = "The+next+chars+should+be+escaped\\:+\\++\\-+\\=+\\&\\&+\\|\\|+++\\!+\\(+\\)+\\{+\\}+\\[+\\]+\\^+\\\"+\\~+\\*+\\?+\\:+\\\\+\\/+Did+it+work\\?";
        expect(routes.prepareTextSearchQuery(searchQuery)).toEqual(expected);
    });

    it('should return search by type', () => {
        const testCases = [
            {
                searchQuery: 'title search',
                expected: 'title=title+search'
            },
            {
                searchQuery: '10.1163/9789004326828',
                expected: 'doi=10.1163/9789004326828'
            },
            {
                searchQuery: '28131963',
                expected: 'id=pmid:28131963'
            }
        ];
        testCases.map(item => {
            expect(routes.getSearchType(item.searchQuery)).toEqual(item.expected);
        })
    });

    it('should return facets query string', () => {
        const testCases = {
            one: 'one key',
            two: 'two key',
            three: 'three key',
        };

        expect(routes.getFacetsQueryString(testCases)).toEqual('filters[facets][one]=one key&filters[facets][two]=two key&filters[facets][three]=three key');
    });

    it('should construct url for SEARCH_EXTERNAL_RECORDS_API', () => {
        const testCases = [
            {
                searchQuery: 'title search',
                expected: 'external/records/search?source=wos&title=title+search'
            },
            {
                searchQuery: '10.1163/9789004326828',
                expected: 'external/records/search?source=wos&doi=10.1163/9789004326828'
            },
            {
                searchQuery: '28131963',
                expected: 'external/records/search?source=wos&id=pmid:28131963'
            }
        ];

        testCases.map(item => {
            expect(routes.SEARCH_EXTERNAL_RECORDS_API({source: 'wos', searchQuery: item.searchQuery})).toEqual(item.expected);
        });
    });

    it('should construct url for CURRENT_USER_RECORDS_API', () => {
        const testCases = [
            {
                values: '',
                expected: 'records/search?rule=mine&page=1&per_page=20&sort=published_date&order_by=desc&'
            },
            {
                values: {page: 2, pageSize: 30, sortBy: 'score', sortDirection:'asc', facets : { one: 'one facet'}},
                expected: 'records/search?rule=mine&page=2&per_page=30&sort=score&order_by=asc&filters[facets][one]=one facet'
            }
        ];

        testCases.map(item => {
            expect(routes.CURRENT_USER_RECORDS_API({...item.values})).toEqual(item.expected);
        });
    });

    it('should construct url for SEARCH_INTERNAL_RECORDS_API', () => {
        const testCases = [
            {
                values: {searchQuery: 'title search'},
                expected: 'records/search?title=title+search&page=1&per_page=20&sort=published_date&order_by=desc&'
            },
            {
                values: {searchQuery: 'title search', page: 2, pageSize: 30, sortBy: 'score', sortDirection:'asc', facets : { one: 'one facet'}},
                expected: 'records/search?title=title+search&page=2&per_page=30&sort=score&order_by=asc&filters[facets][one]=one facet'
            }
        ];

        testCases.map(item => {
            expect(routes.SEARCH_INTERNAL_RECORDS_API({...item.values})).toEqual(item.expected);
        });
    });

    it('should getStandardSearchParameters', () => {
        const testCases = [
            {
                values: {},
                expected: 'page=1&per_page=20&sort=published_date&order_by=desc&'
            },
            {
                values: {page: 2, pageSize: 30, sortBy: 'score', sortDirection:'asc', facets : { one: 'one facet'}},
                expected: 'page=2&per_page=30&sort=score&order_by=asc&filters[facets][one]=one facet'
            }
        ];

        testCases.map(item => {
            expect(routes.getStandardSearchParameters({...item.values})).toEqual(item.expected);
        });
    });

    it('should construct url for SEARCH_KEY_LOOKUP_API', () => {
        const testCases = [
            {
                values: {searchKey: 'series', searchQuery: 'title search'},
                expected: 'records/search?rule=lookup&search_key=series&lookup_value=title+search'
            }
        ];

        testCases.map(item => {
            expect(routes.SEARCH_KEY_LOOKUP_API({...item.values})).toEqual(item.expected);
        });
    });

    it('should construct url for POSSIBLE_RECORDS_API', () => {
        const testCases = [
            {
                values: {facets: {}},
                expected: 'records/search?rule=possible&'
            },
            {
                values: {facets: { one: 'one facet', two: 'two facets'}},
                expected: 'records/search?rule=possible&filters[facets][one]=one facet&filters[facets][two]=two facets'
            }
        ];

        testCases.map(item => {
            expect(routes.POSSIBLE_RECORDS_API({...item.values})).toEqual(item.expected);
        });
    });

    it('should construct url for RECORDS_ISSUES_API', () => {
        expect(routes.EXISTING_RECORD_API({pid: 'UQ:1001'})).toEqual('records/UQ:1001');
    });

    it('should construct url for RECORDS_ISSUES_API', () => {
        expect(routes.RECORDS_ISSUES_API({pid: 'UQ:1001'})).toEqual('records/UQ:1001/issues');
    });

    it('should construct url for AUTHORS_SEARCH_API', () => {
        expect(routes.AUTHORS_SEARCH_API({query: 'jane'})).toEqual('fez-authors/search?query=jane');
    });

    it('should construct url for AUTHOR_DETAILS_API', () => {
        expect(routes.AUTHOR_DETAILS_API({userId: '410'})).toEqual('authors/details/410');
    });

    it('should construct url for VOCABULARIES_API', () => {
        expect(routes.VOCABULARIES_API({id: '410'})).toEqual('vocabularies/410');
    });
});

