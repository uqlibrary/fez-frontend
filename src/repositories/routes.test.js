import * as routes from './routes';
import {
    IN_CREATION,
    IN_DRAFT,
    IN_REVIEW,
    UNPUBLISHED,
    RETRACTED,
    SUBMITTED_FOR_APPROVAL
} from 'config/general';

describe('Backend routes method', () => {

    it('should get zer-padded year', () => {
        expect(routes.zeroPaddedYear(null)).toBe('*');
        expect(routes.zeroPaddedYear(83)).toBe('0083');
    })

    it('should return search by type', () => {
        const testCases = [
            {
                searchQuery: 'title search',
                expected: {title: 'title search'}
            },
            {
                searchQuery: '10.1163/9789004326828',
                expected: {doi: '10.1163/9789004326828'}
            },
            {
                searchQuery: '28131963',
                expected: {id: 'pmid:28131963'}
            }
        ];
        testCases.map(item => {
            expect(routes.getSearchType(item.searchQuery)).toEqual(item.expected);
        })
    });

    it('should return facets params for filters', () => {
        const testCases = {
            filters: {
                one: 'one key',
                two: 'two key',
                three: 'three key'
            }
        };

        const expected = {
            [`filters[facets][one]`]: 'one key',
            [`filters[facets][two]`]: 'two key',
            [`filters[facets][three]`]: 'three key'
        };

        expect(routes.getFacetsParams(testCases)).toEqual(expected);
    });

    it('should return facets params for filters and ranges', () => {
        const testCases = {
            filters: {
                one: 'one key',
                two: 'two key',
                three: 'three key'
            },
            ranges: {
                'Year published': {
                    from: 2000,
                    to: 2013
                },
                'test': 'testValue'
            }
        };

        const expected = {
            [`filters[facets][one]`]: 'one key',
            [`filters[facets][two]`]: 'two key',
            [`filters[facets][three]`]: 'three key',
            ['ranges[facets][Year published]']: '[2000 TO 2013]',
            ['ranges[facets][test]']: 'testValue'
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
                    searchQuery: 'title search'
                },
                expected: {
                    apiUrl: 'external/records/search',
                    options: {
                        params: {
                            source: 'test',
                            title: 'title search'
                        }
                    }
                }
            },
            {
                input: {
                    searchQuery: '10.1163/9789004326828'
                },
                expected: {
                    apiUrl: 'external/records/search',
                    options: {
                        params: {
                            source: 'wos',
                            doi: '10.1163/9789004326828'
                        }
                    }
                }
            },
            {
                input: {},
                expected: {
                    apiUrl: 'external/records/search',
                    options: {
                        params: {
                            source: 'wos'
                        }
                    }
                }
            }
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
                            sort: 'score'
                        }
                    }
                }
            },
            {
                values: {page: 2, pageSize: 30, sortBy: 'score', sortDirection:'asc', facets : { filters: { one: 'one facet'}}},
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
                            ['filters[facets][one]']: 'one facet'
                        }
                    }
                }
            }
        ];

        testCases.map(item => {
            expect(routes.CURRENT_USER_RECORDS_API({...item.values})).toEqual(item.expected);
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
                }
            }
        });
    });

    it('should construct url for SEARCH_INTERNAL_RECORDS_API', () => {
        const testCases = [
            {
                values: {searchQuery: 'title search'},
                expected: {
                    apiUrl: 'records/search',
                    options: {
                        params: {
                            export_to: '',
                            order_by: 'desc',
                            page: 1,
                            per_page: 20,
                            sort: 'score',
                            title: 'title search'
                        }
                    }
                }
            },
            {
                values: {searchQuery: 'title search', page: 2, pageSize: 30, sortBy: 'score', sortDirection:'asc', facets : { filters: { one: 'one facet' }}},
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
                            ['filters[facets][one]']: 'one facet'
                        }
                    }
                }
            }
        ];

        testCases.map(item => {
            expect(routes.SEARCH_INTERNAL_RECORDS_API({...item.values})).toEqual(item.expected);
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
                            value: [1, "a"],
                        },
                    },
                },
                expected: {
                    rek_genre_type: [
                        '"1"',
                        '"a"'
                    ],
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
                    rek_status: [
                        UNPUBLISHED,
                        SUBMITTED_FOR_APPROVAL,
                        IN_CREATION,
                        IN_REVIEW,
                        IN_DRAFT,
                        RETRACTED
                    ],
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
                    sort: 'score'
                }
            },
            {
                values: {
                    page: 2,
                    pageSize: 30,
                    sortBy: 'score',
                    sortDirection:'asc',
                    facets : {
                        filters: {
                            one: 'one facet'
                        }
                    }
                },
                expected: {
                    export_to: '',
                    order_by: 'asc',
                    page: 2,
                    per_page: 30,
                    sort: 'score',
                    ['filters[facets][one]']: 'one facet'
                }
            },
            {
                values: {
                    page: 2,
                    pageSize: 30,
                    sortBy: 'score',
                    sortDirection:'asc',
                    facets : {
                        showOpenAccessOnly: true,
                        filters: {
                            one: 'one facet'
                        }
                    }
                },
                expected: {
                    export_to: '',
                    order_by: 'asc',
                    page: 2,
                    per_page: 30,
                    sort: 'score',
                    ['filters[facets][one]']: 'one facet'
                }
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
                    with_unknown_authors: 1
                }
            },
        ];

        testCases.map(item => {
            expect(routes.getStandardSearchParams({...item.values})).toEqual(item.expected);
        });
    });

    it('should return parameters for search query string from getOpenAccessSearchParams method', () => {
        const testCases = [
            {
                values: {page: 2, pageSize: 30, sortBy: 'score', sortDirection:'asc', facets : { filters: {one: 'one facet'}}},
                expected: {}
            },
            {
                values: {page: 2, pageSize: 30, sortBy: 'score', sortDirection:'asc', facets : { showOpenAccessOnly: true, filters: {one: 'one facet'}}},
                expected: {
                    "rek_oa_status": [453693, 453694, 453695, 453696, 453697, 453954]
                }
            }
        ];

        testCases.map(item => {
            expect(routes.getOpenAccessSearchParams({...item.values})).toEqual(item.expected);
        });
    });

    it('should construct url for SEARCH_KEY_LOOKUP_API', () => {
        const testCases = [
            {
                values: {searchKey: 'series', searchQuery: 'title search'},
                expected: {
                    apiUrl: 'records/search',
                    options: {
                        params: {
                            lookup_value: 'title search',
                            rule: 'lookup',
                            search_key: 'series'
                        }
                    }
                }
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
                expected: {
                    apiUrl: "records/search",
                    options: {
                        params: {
                            export_to: "",
                            order_by: "desc",
                            page: 1,
                            per_page: 20,
                            rule: "possible",
                            sort: "score"
                        }
                    }
                }
            },
            {
                values: {facets: { filters: {one: 'one facet', two: 'two facets'}}},
                expected: {

                    apiUrl: 'records/search',
                    options: {
                        params: {
                            export_to: "",
                            order_by: "desc",
                            page: 1,
                            per_page: 20,
                            rule: "possible",
                            sort: "score",
                            ['filters[facets][one]']: 'one facet',
                            ['filters[facets][two]']: 'two facets'
                        }
                    }
                }
            }
        ];

        testCases.map(item => {
            expect(routes.POSSIBLE_RECORDS_API({...item.values})).toEqual(item.expected);
        });
    });

    it('should construct url for EXISTING_RECORD_API', () => {
        expect(routes.EXISTING_RECORD_API({pid: 'UQ:1001'})).toEqual({apiUrl: 'records/UQ:1001'});
    });

    it('should construct url for RECORDS_ISSUES_API', () => {
        expect(routes.RECORDS_ISSUES_API({pid: 'UQ:1001'})).toEqual({apiUrl: 'records/UQ:1001/issues'});
    });

    it('should construct url for NEW_COLLECTION_API', () => {
        expect(routes.NEW_COLLECTION_API()).toEqual({apiUrl: 'collections'});
    });

    it('should construct url for NEW_COMMUNITY_API', () => {
        expect(routes.NEW_COMMUNITY_API({})).toEqual({apiUrl: 'communities'});
    });

    it('should construct url for AUTHORS_SEARCH_API', () => {
        expect(routes.AUTHORS_SEARCH_API({query: 'jane'})).toEqual({apiUrl: 'fez-authors/search', options: {params: {query: 'jane', rule: 'lookup'}}});
    });

    it('should construct url for AUTHOR_DETAILS_API', () => {
        expect(routes.AUTHOR_DETAILS_API({userId: '410'})).toEqual({apiUrl: 'authors/details/410'});
    });

    it('should construct url for VOCABULARIES_API', () => {
        expect(routes.VOCABULARIES_API({id: '410'})).toEqual({apiUrl: 'vocabularies/410'});
    });

    it('should construct url for GET_PUBLICATION_TYPES_API', () => {
        expect(routes.GET_PUBLICATION_TYPES_API({id: '410'})).toEqual({apiUrl: 'records/types'});
    });

    it('should construct url for AUTHOR_PUBLICATIONS_STATS_ONLY_API', () => {
        const test = {
            values: {searchKey: 'series', searchQuery: 'title search'},
            expected: {
                apiUrl: 'records/search',
                options: {
                    params: {
                        lookup_value: 'title search',
                        rule: 'lookup',
                        search_key: 'series'
                    }
                }
            }
        };
        expect(routes.AUTHOR_PUBLICATIONS_STATS_ONLY_API({...test})).toEqual({
            apiUrl: "records/search",
            options: {
                params: {
                    "export_to": "",
                    "filters[stats_only]": true,
                    "order_by": "desc",
                    "page": 1,
                    "per_page": 20,
                    "rule": "mine",
                    "sort": "score"
                }
            }
        });
    });

    it('should construct url for TRENDING_PUBLICATIONS_API', () => {
        expect(routes.TRENDING_PUBLICATIONS_API({})).toEqual({apiUrl: 'records/trending'});
    });

    it('should construct url for HIDE_POSSIBLE_RECORD_API', () => {
        expect(routes.HIDE_POSSIBLE_RECORD_API({})).toEqual({apiUrl: 'records/search', options: {params: {rule: 'possible'}}});
    });

    it('should construct url for NEW_RECORD_API', () => {
        expect(routes.NEW_RECORD_API({})).toEqual({apiUrl: 'records'});
    });

    it('should construct url for FILE_UPLOAD_API', () => {
        expect(routes.FILE_UPLOAD_API({pid: '12345', fileName: 'test.jpg'})).toEqual({"apiUrl": "file/upload/presigned/12345/test.jpg"});
    });

    it('should construct url for GET_NEWS_API', () => {
        expect(routes.GET_NEWS_API()).toEqual({apiUrl: 'fez-news'});
    });

    it('should construct url for GET_ACML_QUICK_TEMPLATES_API', () => {
        expect(routes.GET_ACML_QUICK_TEMPLATES_API()).toEqual({apiUrl: 'acml/quick-templates'});
    });

    it('should construct url for AUTHOR_TRENDING_PUBLICATIONS_API', () => {
        expect(routes.AUTHOR_TRENDING_PUBLICATIONS_API()).toEqual({apiUrl: 'records/my-trending'});
    });

    it('should construct url for ACADEMIC_STATS_PUBLICATION_HINDEX_API', () => {
        expect(routes.ACADEMIC_STATS_PUBLICATION_HINDEX_API({userId: '12345'})).toEqual({apiUrl: `academic/12345/hindex`});
    });

    it('should construct url for AUTHOR_ORCID_DETAILS_API', () => {
        expect(routes.AUTHOR_ORCID_DETAILS_API({userId: '12345', params: {someParam: 'test'}})).toEqual({"apiUrl": "orcid/12345/request", "options": {"params": {"someParam": "test"}}});
    });

    it('should construct url for AUTHOR_API', () => {
        expect(routes.AUTHOR_API({authorId: '12345'})).toEqual({"apiUrl": "fez-authors/12345"});
    });

    it('should construct url for CURRENT_AUTHOR_API', () => {
        expect(routes.CURRENT_AUTHOR_API()).toEqual({apiUrl: 'fez-authors'});
    });

    it('should construct url for CURRENT_ACCOUNT_API', () => {
        const MockDate = require('mockdate');
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
        expect(routes.CURRENT_ACCOUNT_API()).toEqual({"apiUrl": "account", "options": {"params": {"ts": "1577836800000"}}});
        MockDate.reset();
    });

    it('should correctly construct url for SEARCH_INTERNAL_RECORDS_API when rek_status key value is less than 0', () => {
        const testCases = [
            {
                values: {searchMode: 'advanced', searchQueryParams: {rek_status: {value: -4}}},
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
                                rek_status: [1, 3, 4, 5, 6, 7]
                            }
                        }
                    }
                }
            },
            {
                values: {searchMode: 'advanced', searchQueryParams: {rek_status: {value: 4}}},
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
                                rek_status: 4
                            }
                        }
                    }
                }
            }
        ];

        testCases.map(item => {
            expect(routes.SEARCH_INTERNAL_RECORDS_API({...item.values})).toEqual(item.expected);
        });
    });

    it('should construct url for SEARCH_AUTHOR_LOOKUP_API', () => {
        expect(routes.SEARCH_AUTHOR_LOOKUP_API({
            searchQuery: 'a,b'
        })).toEqual({
            apiUrl: 'fez-authors/search',
            options: {
                params: {
                    rule: 'lookup',
                    query: 'ab'
                }
            }
        });
    });

    it('should construct url for THIRD_PARTY_LOOKUP_API_1FIELD', () => {
        expect(routes.THIRD_PARTY_LOOKUP_API_1FIELD({
            type: 'test1',
            field1: 'test2'
        })).toEqual({
            apiUrl: 'tool/lookup/test1/test2'
        });
    });

    it('should construct url for THIRD_PARTY_LOOKUP_API_2FIELD', () => {
        expect(routes.THIRD_PARTY_LOOKUP_API_2FIELD({
            type: 'test1',
            field1: 'test2',
            field2: 'test3'
        })).toEqual({
            apiUrl: 'tool/lookup/test1/test2/test3'
        });
    });
});
