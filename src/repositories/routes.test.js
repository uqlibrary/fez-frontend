import * as routes from './routes';
import { IN_CREATION, IN_DRAFT, IN_REVIEW, UNPUBLISHED, RETRACTED, SUBMITTED_FOR_APPROVAL } from 'config/general';

describe('Backend routes method', () => {
    it('should get zer-padded year', () => {
        expect(routes.zeroPaddedYear(null)).toBe('*');
        expect(routes.zeroPaddedYear(83)).toBe('0083');
    });

    it('should return search by type', () => {
        const testCases = [
            {
                searchQuery: 'title search',
                expected: { title: 'title search' },
            },
            {
                searchQuery: '10.1163/9789004326828',
                expected: { doi: '10.1163/9789004326828' },
            },
            {
                searchQuery: '28131963',
                expected: { id: 'pmid:28131963' },
            },
        ];
        testCases.map(item => {
            expect(routes.getSearchType(item.searchQuery)).toEqual(item.expected);
        });
    });

    it('should return facets params for filters', () => {
        const testCases = {
            filters: {
                one: 'one key',
                two: 'two key',
                three: 'three key',
            },
        };

        const expected = {
            ['filters[facets][one]']: 'one key',
            ['filters[facets][two]']: 'two key',
            ['filters[facets][three]']: 'three key',
        };

        expect(routes.getFacetsParams(testCases)).toEqual(expected);
    });

    it('should return facets params for filters and ranges', () => {
        const testCases = {
            filters: {
                one: 'one key',
                two: 'two key',
                three: 'three key',
            },
            ranges: {
                'Year published': {
                    from: 2000,
                    to: 2013,
                },
                test: 'testValue',
            },
        };

        const expected = {
            ['filters[facets][one]']: 'one key',
            ['filters[facets][two]']: 'two key',
            ['filters[facets][three]']: 'three key',
            ['ranges[facets][Year published]']: '[2000 TO 2013]',
            ['ranges[facets][test]']: 'testValue',
        };

        expect(routes.getFacetsParams(testCases)).toEqual(expected);

        testCases.ranges['Year published'].from = 2015;
        testCases.ranges['Year published'].to = 2014;
        expected['ranges[facets][Year published]'] = '[2014 TO 2015]';
        expect(routes.getFacetsParams(testCases)).toEqual(expected);
    });

    it('should construct url for SEARCH_EXTERNAL_RECORDS_API', () => {
        const testCases = [
            {
                input: {
                    source: 'test',
                    searchQuery: 'title search',
                },
                expected: {
                    apiUrl: 'external/records/search',
                    options: {
                        params: {
                            source: 'test',
                            title: 'title search',
                        },
                    },
                },
            },
            {
                input: {
                    searchQuery: '10.1163/9789004326828',
                },
                expected: {
                    apiUrl: 'external/records/search',
                    options: {
                        params: {
                            source: 'wos',
                            doi: '10.1163/9789004326828',
                        },
                    },
                },
            },
            {
                input: {},
                expected: {
                    apiUrl: 'external/records/search',
                    options: {
                        params: {
                            source: 'wos',
                        },
                    },
                },
            },
        ];

        testCases.map(item => {
            expect(routes.SEARCH_EXTERNAL_RECORDS_API(item.input)).toEqual(item.expected);
        });
    });

    it('should construct url for CURRENT_USER_RECORDS_API', () => {
        const testCases = [
            {
                values: '',
                expected: {
                    apiUrl: 'records/search',
                    options: {
                        params: {
                            export_to: '',
                            order_by: 'desc',
                            page: 1,
                            per_page: 20,
                            rule: 'mine',
                            sort: 'score',
                        },
                    },
                },
            },
            {
                values: {
                    page: 2,
                    pageSize: 30,
                    sortBy: 'score',
                    sortDirection: 'asc',
                    facets: { filters: { one: 'one facet' } },
                },
                expected: {
                    apiUrl: 'records/search',
                    options: {
                        params: {
                            export_to: '',
                            order_by: 'asc',
                            page: 2,
                            per_page: 30,
                            rule: 'mine',
                            sort: 'score',
                            ['filters[facets][one]']: 'one facet',
                        },
                    },
                },
            },
        ];

        testCases.map(item => {
            expect(routes.CURRENT_USER_RECORDS_API({ ...item.values })).toEqual(item.expected);
        });
    });

    it('should construct url for INCOMPLETE_RECORDS_API', () => {
        expect(routes.INCOMPLETE_RECORDS_API({})).toEqual({
            apiUrl: 'records/search',
            options: {
                params: {
                    export_to: '',
                    order_by: 'desc',
                    page: 1,
                    per_page: 20,
                    rule: 'incomplete',
                    sort: 'score',
                },
            },
        });
    });

    it('should construct url for SEARCH_INTERNAL_RECORDS_API', () => {
        const testCases = [
            {
                query: { searchQuery: 'title search' },
                route: 'search',
                expected: {
                    apiUrl: 'records/search',
                    options: {
                        params: {
                            export_to: '',
                            order_by: 'desc',
                            page: 1,
                            per_page: 20,
                            sort: 'score',
                            title: 'title search',
                        },
                    },
                },
            },
            {
                query: {
                    searchQuery: 'title search',
                    page: 2,
                    pageSize: 30,
                    sortBy: 'score',
                    sortDirection: 'asc',
                    facets: { filters: { one: 'one facet' } },
                },
                route: 'search',
                expected: {
                    apiUrl: 'records/search',
                    options: {
                        params: {
                            export_to: '',
                            order_by: 'asc',
                            page: 2,
                            per_page: 30,
                            sort: 'score',
                            title: 'title search',
                            ['filters[facets][one]']: 'one facet',
                        },
                    },
                },
            },
            {
                query: {
                    searchQuery: 'title search',
                    page: 2,
                    pageSize: 500,
                    sortBy: 'score',
                    sortDirection: 'asc',
                    facets: { filters: { one: 'one facet' } },
                },
                route: 'export',
                expected: {
                    apiUrl: 'records/export',
                    options: {
                        params: {
                            export_to: '',
                            order_by: 'asc',
                            page: 2,
                            per_page: 500,
                            sort: 'score',
                            title: 'title search',
                            ['filters[facets][one]']: 'one facet',
                            querystring:
                                'searchQuery%3Dtitle%2Bsearch%26page%3D2%26pageSize%3D500%26sortBy%3Dscore%26sortDirection%3Dasc%26facets%255Bfilters%255D%255Bone%255D%3Done%2Bfacet',
                        },
                    },
                },
            },
        ];

        testCases.map(item => {
            expect(routes.SEARCH_INTERNAL_RECORDS_API({ ...item.query }, item.route)).toEqual(item.expected);
        });
    });

    it('should format search query parameters properly', () => {
        const testCases = [
            {
                input: {
                    result: {},
                    key: 'rek_pid',
                    searchQueryParams: {
                        rek_pid: {
                            value: '123',
                        },
                    },
                },
                expected: {
                    rek_pid: 'UQ:123',
                },
            },
            {
                input: {
                    result: {},
                    key: 'rek_pid',
                    searchQueryParams: {
                        rek_pid: {
                            value: 'UQ:123',
                        },
                    },
                },
                expected: {
                    rek_pid: 'UQ:123',
                },
            },
            {
                input: {
                    result: {},
                    key: 'rek_genre_type',
                    searchQueryParams: {
                        rek_genre_type: {
                            value: [1, 'a'],
                        },
                    },
                },
                expected: {
                    rek_genre_type: ['"1"', '"a"'],
                },
            },
            {
                input: {
                    result: {},
                    key: 'rek_status',
                    searchQueryParams: {
                        rek_status: {
                            value: -1,
                        },
                    },
                },
                expected: {
                    rek_status: [UNPUBLISHED, SUBMITTED_FOR_APPROVAL, IN_CREATION, IN_REVIEW, IN_DRAFT, RETRACTED],
                },
            },
            {
                input: {
                    result: {},
                    key: 'rek_status',
                    searchQueryParams: {
                        rek_status: {
                            value: 3,
                        },
                    },
                },
                expected: {
                    rek_status: 3,
                },
            },
            {
                input: {
                    result: {},
                    key: 'rek_created_date',
                    searchQueryParams: {
                        rek_created_date: {
                            value: 101010101,
                        },
                    },
                },
                expected: {},
            },
            {
                input: {
                    result: {},
                    key: 'rek_updated_date',
                    searchQueryParams: {
                        rek_updated_date: {
                            value: 101010101,
                        },
                    },
                },
                expected: {},
            },
            {
                input: {
                    result: {},
                    key: 'all',
                    searchQueryParams: {
                        all: {
                            value: 'test',
                        },
                    },
                },
                expected: {
                    all: 'test',
                },
            },
            {
                input: {
                    result: {},
                    key: 'blah',
                    searchQueryParams: {
                        blah: 'test',
                    },
                },
                expected: {
                    blah: 'test',
                },
            },
        ];
        testCases.forEach(item => {
            expect(routes.formatSearchQueryParams(item.input)).toEqual(item.expected);
        });
    });

    it('should return parameters for search query string from getStandardSearchParameters method', () => {
        const testCases = [
            {
                values: {},
                expected: {
                    export_to: '',
                    order_by: 'desc',
                    page: 1,
                    per_page: 20,
                    sort: 'score',
                },
            },
            {
                values: {
                    page: 2,
                    pageSize: 30,
                    sortBy: 'score',
                    sortDirection: 'asc',
                    facets: {
                        filters: {
                            one: 'one facet',
                        },
                    },
                },
                expected: {
                    export_to: '',
                    order_by: 'asc',
                    page: 2,
                    per_page: 30,
                    sort: 'score',
                    ['filters[facets][one]']: 'one facet',
                },
            },
            {
                values: {
                    page: 2,
                    pageSize: 30,
                    sortBy: 'score',
                    sortDirection: 'asc',
                    facets: {
                        showOpenAccessOnly: true,
                        filters: {
                            one: 'one facet',
                        },
                    },
                },
                expected: {
                    export_to: '',
                    order_by: 'asc',
                    page: 2,
                    per_page: 30,
                    sort: 'score',
                    ['filters[facets][one]']: 'one facet',
                },
            },
            {
                values: {
                    withUnknownAuthors: 1,
                },
                expected: {
                    export_to: '',
                    order_by: 'desc',
                    page: 1,
                    per_page: 20,
                    sort: 'score',
                    with_unknown_authors: 1,
                },
            },
        ];

        testCases.map(item => {
            expect(routes.getStandardSearchParams({ ...item.values })).toEqual(item.expected);
        });
    });

    it('should return parameters for search query string from getOpenAccessSearchParams method', () => {
        const testCases = [
            {
                values: {
                    page: 2,
                    pageSize: 30,
                    sortBy: 'score',
                    sortDirection: 'asc',
                    facets: { filters: { one: 'one facet' } },
                },
                expected: {},
            },
            {
                values: {
                    page: 2,
                    pageSize: 30,
                    sortBy: 'score',
                    sortDirection: 'asc',
                    facets: { showOpenAccessOnly: true, filters: { one: 'one facet' } },
                },
                expected: {
                    rek_oa_status: [453693, 453694, 453695, 453696, 453697, 453954, 454127, 454116],
                },
            },
        ];

        testCases.map(item => {
            expect(routes.getOpenAccessSearchParams({ ...item.values })).toEqual(item.expected);
        });
    });

    it('should construct url for SEARCH_KEY_LOOKUP_API', () => {
        const testCases = [
            {
                values: { searchKey: 'series', searchQuery: 'title search' },
                expected: {
                    apiUrl: 'records/search',
                    options: {
                        params: {
                            lookup_value: 'title search',
                            rule: 'lookup',
                            search_key: 'series',
                        },
                    },
                },
            },
        ];

        testCases.map(item => {
            expect(routes.SEARCH_KEY_LOOKUP_API({ ...item.values })).toEqual(item.expected);
        });
    });

    it('should construct url for POSSIBLE_RECORDS_API', () => {
        const testCases = [
            {
                values: { facets: {} },
                expected: {
                    apiUrl: 'records/search',
                    options: {
                        params: {
                            export_to: '',
                            order_by: 'desc',
                            page: 1,
                            per_page: 20,
                            rule: 'possible',
                            sort: 'score',
                        },
                    },
                },
            },
            {
                values: { facets: { filters: { one: 'one facet', two: 'two facets' } } },
                expected: {
                    apiUrl: 'records/search',
                    options: {
                        params: {
                            export_to: '',
                            order_by: 'desc',
                            page: 1,
                            per_page: 20,
                            rule: 'possible',
                            sort: 'score',
                            ['filters[facets][one]']: 'one facet',
                            ['filters[facets][two]']: 'two facets',
                        },
                    },
                },
            },
        ];

        testCases.map(item => {
            expect(routes.POSSIBLE_RECORDS_API({ ...item.values })).toEqual(item.expected);
        });
    });

    it('should construct url for EXISTING_RECORD_API', () => {
        expect(routes.EXISTING_RECORD_API({ pid: 'UQ:1001' })).toEqual({ apiUrl: 'records/UQ:1001' });
    });

    it('should construct url for EXISTING_RECORD_API for admin edit to get lock info', () => {
        expect(routes.EXISTING_RECORD_API({ pid: 'UQ:1001', isEdit: true })).toEqual({
            apiUrl: 'records/UQ:1001?from=admin-form',
        });
    });

    it('should construct url for RECORDS_ISSUES_API', () => {
        expect(routes.RECORDS_ISSUES_API({ pid: 'UQ:1001' })).toEqual({ apiUrl: 'records/UQ:1001/issues' });
    });

    it('should construct url for NEW_COLLECTION_API', () => {
        expect(routes.NEW_COLLECTION_API()).toEqual({ apiUrl: 'collections' });
    });

    it('should construct url for EXISTING_COLLECTION_API', () => {
        expect(routes.EXISTING_COLLECTION_API({ pid: 'UQ:123456' })).toEqual({ apiUrl: 'records/UQ:123456' });
    });

    it('should construct url for NEW_COMMUNITY_API', () => {
        expect(routes.NEW_COMMUNITY_API({})).toEqual({ apiUrl: 'communities' });
    });

    it('should construct url for EXISTING_COMMUNITY_API', () => {
        expect(routes.EXISTING_COMMUNITY_API({ pid: 'UQ:123456' })).toEqual({ apiUrl: 'records/UQ:123456' });
    });

    it('should construct url for AUTHORS_SEARCH_API', () => {
        expect(routes.AUTHORS_SEARCH_API({ query: 'jane' })).toEqual({
            apiUrl: 'fez-authors/search',
            options: { params: { query: 'jane', rule: 'lookup' } },
        });
    });

    it('should construct url for AUTHORS_SEARCH_API without search query', () => {
        expect(routes.AUTHORS_SEARCH_API()).toEqual({
            apiUrl: 'fez-authors/search',
        });
    });

    it('should construct url for AUTHOR_DETAILS_API', () => {
        expect(routes.AUTHOR_DETAILS_API({ userId: '410' })).toEqual({ apiUrl: 'authors/details/410' });
    });

    it('should construct url for VOCABULARIES_API', () => {
        expect(routes.VOCABULARIES_API({ id: '410' })).toEqual({ apiUrl: 'vocabularies?cvo_ids=410' });
    });

    it('should construct url for GET_PUBLICATION_TYPES_API', () => {
        expect(routes.GET_PUBLICATION_TYPES_API({ id: '410' })).toEqual({ apiUrl: 'records/types' });
    });

    it('should construct url for AUTHOR_PUBLICATIONS_STATS_ONLY_API', () => {
        const test = {
            values: { searchKey: 'series', searchQuery: 'title search' },
            expected: {
                apiUrl: 'records/search',
                options: {
                    params: {
                        lookup_value: 'title search',
                        rule: 'lookup',
                        search_key: 'series',
                    },
                },
            },
        };
        expect(routes.AUTHOR_PUBLICATIONS_STATS_ONLY_API({ ...test })).toEqual({
            apiUrl: 'records/search',
            options: {
                params: {
                    export_to: '',
                    'filters[stats_only]': true,
                    order_by: 'desc',
                    page: 1,
                    per_page: 20,
                    rule: 'mine',
                    sort: 'score',
                },
            },
        });
    });

    it('should construct url for TRENDING_PUBLICATIONS_API', () => {
        expect(routes.TRENDING_PUBLICATIONS_API({})).toEqual({ apiUrl: 'records/trending' });
    });

    it('should construct url for HIDE_POSSIBLE_RECORD_API', () => {
        expect(routes.HIDE_POSSIBLE_RECORD_API({})).toEqual({
            apiUrl: 'records/search',
            options: { params: { rule: 'possible' } },
        });
    });

    it('should construct url for NEW_RECORD_API', () => {
        expect(routes.NEW_RECORD_API({})).toEqual({ apiUrl: 'records' });
    });

    it('should construct url for FILE_UPLOAD_API', () => {
        expect(routes.FILE_UPLOAD_API()).toEqual({
            apiUrl: 'file/upload/presigned',
        });
    });

    it('should construct url for AUTHOR_TRENDING_PUBLICATIONS_API', () => {
        expect(routes.AUTHOR_TRENDING_PUBLICATIONS_API()).toEqual({ apiUrl: 'records/my-trending' });
    });

    it('should construct url for ACADEMIC_STATS_PUBLICATION_HINDEX_API', () => {
        expect(routes.ACADEMIC_STATS_PUBLICATION_HINDEX_API({ userId: '12345' })).toEqual({
            apiUrl: 'academic/12345/hindex',
        });
    });

    it('should construct url for AUTHOR_ORCID_DETAILS_API', () => {
        expect(routes.AUTHOR_ORCID_DETAILS_API({ userId: '12345', params: { someParam: 'test' } })).toEqual({
            apiUrl: 'orcid/12345/request',
            options: { params: { someParam: 'test' } },
        });
    });

    it('should construct url for AUTHOR_API', () => {
        expect(routes.AUTHOR_API({ authorId: '12345' })).toEqual({ apiUrl: 'fez-authors/12345' });
    });

    it('should construct url for CURRENT_AUTHOR_API', () => {
        expect(routes.CURRENT_AUTHOR_API()).toEqual({ apiUrl: 'fez-authors' });
    });

    it('should construct url for CURRENT_ACCOUNT_API', () => {
        const MockDate = require('mockdate');
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
        expect(routes.CURRENT_ACCOUNT_API()).toEqual({
            apiUrl: 'account',
            options: { params: { ts: '1577836800000' } },
        });
        MockDate.reset();
    });

    it(
        'should correctly construct url for SEARCH_INTERNAL_RECORDS_API ' +
            'when the rek_status key value is less than 0',
        () => {
            const testCases = [
                {
                    values: { searchMode: 'advanced', searchQueryParams: { rek_status: { value: -4 } } },
                    expected: {
                        apiUrl: 'records/search',
                        options: {
                            params: {
                                export_to: '',
                                order_by: 'desc',
                                page: 1,
                                per_page: 20,
                                sort: 'score',
                                mode: 'advanced',
                                key: {
                                    rek_status: [1, 3, 4, 5, 6, 7],
                                },
                            },
                        },
                    },
                },
                {
                    values: { searchMode: 'advanced', searchQueryParams: { rek_status: { value: 4 } } },
                    expected: {
                        apiUrl: 'records/search',
                        options: {
                            params: {
                                export_to: '',
                                order_by: 'desc',
                                page: 1,
                                per_page: 20,
                                sort: 'score',
                                mode: 'advanced',
                                key: {
                                    rek_status: 4,
                                },
                            },
                        },
                    },
                },
            ];

            testCases.map(item => {
                expect(routes.SEARCH_INTERNAL_RECORDS_API({ ...item.values })).toEqual(item.expected);
            });
        },
    );

    it('should construct url for SEARCH_AUTHOR_LOOKUP_API', () => {
        expect(
            routes.SEARCH_AUTHOR_LOOKUP_API({
                searchQuery: 'a,b-c!?     %',
            }),
        ).toEqual({
            apiUrl: 'fez-authors/search',
            options: {
                params: {
                    rule: 'lookup',
                    query: 'a b-c ',
                },
            },
        });
    });

    it('should construct url for THIRD_PARTY_LOOKUP_API_1FIELD', () => {
        expect(
            routes.THIRD_PARTY_LOOKUP_API_1FIELD({
                type: 'test1',
                field1: 'test2',
            }),
        ).toEqual({
            apiUrl: 'tool/lookup/test1/test2',
        });
    });

    it('should construct url for THIRD_PARTY_LOOKUP_API_2FIELD', () => {
        expect(
            routes.THIRD_PARTY_LOOKUP_API_2FIELD({
                type: 'test1',
                field1: 'test2',
                field2: 'test3',
            }),
        ).toEqual({
            apiUrl: 'tool/lookup/test1/test2/test3',
        });
    });

    it('should construct url for COLLECTIONS_BY_COMMUNITY_LOOKUP_API', () => {
        expect(
            routes.COLLECTIONS_BY_COMMUNITY_LOOKUP_API({
                communityPid: 'UQ:123456',
            }),
        ).toEqual({
            apiUrl: 'communities/UQ:123456/collections',
        });
    });

    it('should construct url for ROR_LOOKUP_API', () => {
        expect(routes.ROR_LOOKUP_API({ id: 'id' })).toEqual({ apiUrl: 'external/ror/id' });
    });

    it('should construct url for BATCH_IMPORT_DIRECTORIES_API', () => {
        expect(routes.BATCH_IMPORT_DIRECTORIES_API()).toEqual({
            apiUrl: 'external/records/batch-import/directories',
        });
    });

    it('should construct url for BATCH_IMPORT_API', () => {
        expect(routes.BATCH_IMPORT_API()).toEqual({
            apiUrl: 'external/records/batch-import',
        });
    });

    it('should construct url for ISSN_LINKS_API', () => {
        expect(routes.ISSN_LINKS_API({ type: 'test', issn: '1234-1234' })).toEqual({
            apiUrl: 'tool/lookup/local/test/1234-1234',
        });
    });

    it('should construct url for ORCID_SYNC_API', () => {
        expect(routes.ORCID_SYNC_API()).toEqual({
            apiUrl: 'external/orcid/jobs/sync',
        });
    });

    it('should construct url for BULK_UPDATES_API', () => {
        expect(routes.BULK_UPDATES_API()).toEqual({
            apiUrl: 'records/bulk-updates',
        });
    });

    it('should construct url for UNLOCK_RECORD_API', () => {
        const pid = 'UQ:123456';
        expect(routes.UNLOCK_RECORD_API({ pid })).toEqual({
            apiUrl: `records/${pid}/unlock`,
        });
    });

    it('should construct url for favourite search list api without id', () => {
        expect(routes.FAVOURITE_SEARCH_LIST_API()).toEqual({
            apiUrl: 'favourite_search',
        });
    });

    it('should construct url for favourite search list api with id', () => {
        expect(routes.FAVOURITE_SEARCH_LIST_API({ id: '1' })).toEqual({
            apiUrl: 'favourite_search/1',
        });
    });

    it('should construct url for journal lookup api', () => {
        expect(routes.JOURNAL_LOOKUP_API({ query: 'test + - = & | > < ! ( ) { } [ ] ^ " ~ * ? : \\ /' })).toEqual({
            apiUrl:
                'journals/search?rule=lookup&query=test%20%2B%20-%20%3D%20%26%20%7C%20%3E%20%3C%20!%20(%20)%20%7B%20%7D%20%5B%20%5D%20%5E%20%22%20~%20*%20%3F%20%3A%20%5C%20%2F',
        });
    });

    it('should construct url for journal keywords lookup api', () => {
        expect(
            routes.JOURNAL_KEYWORDS_LOOKUP_API({ query: 'test + - = & | > < ! ( ) { } [ ] ^ " ~ * ? : \\ /' }),
        ).toEqual({
            apiUrl:
                'journals/search?query=test%20%2B%20-%20%3D%20%26%20%7C%20%3E%20%3C%20!%20(%20)%20%7B%20%7D%20%5B%20%5D%20%5E%20%22%20~%20*%20%3F%20%3A%20%5C%20%2F',
        });
    });

    it('should construct url for journal details api', () => {
        expect(routes.JOURNAL_API({ id: '12' })).toEqual({
            apiUrl: 'journals/12',
        });
    });
    it('should construct url for journal details api in edit mode', () => {
        expect(routes.JOURNAL_API({ id: '12', isEdit: true })).toEqual({
            apiUrl: 'journals/12?from=admin-form',
        });
    });

    it('should construct url for journal search api', () => {
        const commonQueryParams = {
            export_to: '',
            order_by: 'asc',
            page: 1,
            per_page: 10,
            sort: 'highest_quartile',
        };

        expect(routes.JOURNAL_SEARCH_API('a')).toEqual({
            apiUrl: 'journals/search',
            options: {
                params: { ...commonQueryParams },
            },
        });

        expect(
            routes.JOURNAL_SEARCH_API({
                keywords: [
                    { type: 'Title', text: 'apple' },
                    { type: 'Keyword', text: 'apple' },
                    { type: 'Subject', text: 'apple', cvoId: 12345 },
                ],
            }),
        ).toEqual({
            apiUrl: 'journals/search',
            options: {
                params: {
                    ...commonQueryParams,
                    description: ['apple'],
                    subject: [12345],
                    title: ['apple'],
                },
            },
        });

        expect(
            routes.JOURNAL_SEARCH_API({
                keywords: [
                    { type: 'unknown', text: 'apple' },
                    { type: 'Title', text: 'apple' },
                ],
            }),
        ).toEqual({
            apiUrl: 'journals/search',
            options: {
                params: {
                    ...commonQueryParams,
                    description: [],
                    subject: [],
                    title: ['apple'],
                },
            },
        });

        expect(
            routes.JOURNAL_SEARCH_API({
                keywords: [{ type: 'Title', text: 'apple' }],
                pageSize: 1,
            }),
        ).toEqual({
            apiUrl: 'journals/search',
            options: {
                params: { ...commonQueryParams, description: [], subject: [], title: ['apple'], per_page: 20 }, // per_page should be 20, not 1
            },
        });
    });

    it('should construct url for journal favourites api', () => {
        const commonQueryParams = {
            export_to: '',
            order_by: 'desc',
            page: 1,
            per_page: 20,
            sort: 'score',
        };

        expect(routes.JOURNAL_FAVOURITES_API()).toEqual({
            apiUrl: 'journals/favourites',
        });

        expect(routes.JOURNAL_FAVOURITES_API({ query: 'a' })).toEqual({
            apiUrl: 'journals/favourites',
            options: {
                params: { ...commonQueryParams },
            },
        });

        expect(
            routes.JOURNAL_FAVOURITES_API({
                query: {
                    keywords: [
                        { type: 'Title', text: 'apple' },
                        { type: 'Keyword', text: 'apple' },
                        { type: 'Subject', text: 'apple', cvoId: 12345 },
                    ],
                },
            }),
        ).toEqual({
            apiUrl: 'journals/favourites',
            options: {
                params: {
                    ...commonQueryParams,
                    description: ['apple'],
                    subject: [12345],
                    title: ['apple'],
                },
            },
        });

        // with append
        expect(
            routes.JOURNAL_FAVOURITES_API({
                append: 'append',
                query: 'a',
            }),
        ).toEqual({
            apiUrl: 'journals/favourites/append',
            options: {
                params: { ...commonQueryParams },
            },
        });
    });
    it('should construct url for community list api', () => {
        expect(routes.COMMUNITY_LIST_API({ pageSize: 20, page: 1, direction: 'Asc', sortBy: 'title' })).toEqual({
            apiUrl: 'communities',
            options: {
                params: {
                    order_by: 'Asc',
                    page: 1,
                    per_page: 20,
                    sort: 'title',
                },
            },
        });
    });

    it('should construct url for collection list api', () => {
        expect(
            routes.COLLECTION_LIST_API({ pid: 'UQ:12345', pageSize: 20, page: 1, direction: 'Asc', sortBy: 'title' }),
        ).toEqual({
            apiUrl: 'communities/UQ:12345/collections',
            options: {
                params: {
                    order_by: 'Asc',
                    page: 1,
                    per_page: 20,
                    sort: 'title',
                },
            },
        });
    });

    it('should construct url for VOCAB_API', () => {
        expect(routes.VOCAB_API()).toEqual({ apiUrl: 'vocabularies' });
    });

    it('should construct url for VOCAB_LIST_API', () => {
        expect(routes.VOCAB_LIST_API({}).apiUrl).toMatch('vocabularies/list');
    });

    it('should construct url for CHILD_VOCAB_LIST_API', () => {
        expect(routes.CHILD_VOCAB_LIST_API(123).apiUrl).toMatch('vocabularies/admin/123');
    });

    it('should construct url for ADMIN_DASHBOARD_EXPORT_REPORT_API', () => {
        expect(routes.ADMIN_DASHBOARD_EXPORT_REPORT_API({ report_type: 123 }).apiUrl).toMatch(
            'dashboard/export-reports?sel_id=123',
        );
    });
    it('should construct url for ADMIN_DASHBOARD_DISPLAY_REPORT_API', () => {
        expect(
            routes.ADMIN_DASHBOARD_DISPLAY_REPORT_API({
                report_type: 1,
                date_from: '2024-01-01',
                date_to: '2024-01-10',
                record_id: 123,
            }).apiUrl,
        ).toMatch('dashboard/reports?report_type=1&date_from=2024-01-01&date_to=2024-01-10&record_id=123');

        expect(
            routes.ADMIN_DASHBOARD_DISPLAY_REPORT_API({
                report_type: 1,
                date_from: '2024-01-01',
                date_to: '2024-01-10',
            }).apiUrl,
        ).toMatch('dashboard/reports?report_type=1&date_from=2024-01-01&date_to=2024-01-10');

        expect(
            routes.ADMIN_DASHBOARD_DISPLAY_REPORT_API({
                report_type: 1,
                date_from: '2024-01-01',
            }).apiUrl,
        ).toMatch('dashboard/reports?report_type=1&date_from=2024-01-01');

        expect(
            routes.ADMIN_DASHBOARD_DISPLAY_REPORT_API({
                report_type: 1,
            }).apiUrl,
        ).toMatch('dashboard/reports?report_type=1');

        expect(routes.ADMIN_DASHBOARD_DISPLAY_REPORT_API({}).apiUrl).toMatch('dashboard/reports?');
    });
});
