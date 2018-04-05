import React from 'react';
import * as routes from './routes';

describe('Backend routes method', () => {
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
                four: {
                    from: 2000,
                    to: 2013
                }
            }
        };

        const expected = {
            [`filters[facets][one]`]: 'one key',
            [`filters[facets][two]`]: 'two key',
            [`filters[facets][three]`]: 'three key',
            ['ranges[facets][four]']: '[2000 TO 2013]'
        };

        expect(routes.getFacetsParams(testCases)).toEqual(expected);
    });

    it('should construct url for SEARCH_EXTERNAL_RECORDS_API', () => {
        const testCases = [
            {
                searchQuery: 'title search',
                expected: {
                    apiUrl: 'external/records/search',
                    options: {
                        params: {
                            source: 'wos',
                            title: 'title search'
                        }
                    }
                }
            },
            {
                searchQuery: '10.1163/9789004326828',
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
                searchQuery: '28131963',
                expected: {
                    apiUrl: 'external/records/search',
                    options: {
                        params: {
                            source: 'wos',
                            id: 'pmid:28131963'
                        }
                    }
                }
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
                expected: {
                    apiUrl: 'records/search',
                    options: {
                        params: {
                            order_by: 'desc',
                            page: 1,
                            per_page: 20,
                            rule: 'mine',
                            sort: 'published_date'
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

    it('should construct url for SEARCH_INTERNAL_RECORDS_API', () => {
        const testCases = [
            {
                values: {searchQuery: 'title search'},
                expected: {
                    apiUrl: 'records/search',
                    options: {
                        params: {
                            order_by: 'desc',
                            page: 1,
                            per_page: 20,
                            sort: 'published_date',
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

    it('should getStandardSearchParameters', () => {
        const testCases = [
            {
                values: {},
                expected: {
                    order_by: 'desc',
                    page: 1,
                    per_page: 20,
                    sort: 'published_date'
                }
            },
            {
                values: {page: 2, pageSize: 30, sortBy: 'score', sortDirection:'asc', facets : { filters: {one: 'one facet'}}},
                expected: {
                    order_by: 'asc',
                    page: 2,
                    per_page: 30,
                    sort: 'score',
                    ['filters[facets][one]']: 'one facet'
                }
            },
            {
                values: {page: 2, pageSize: 30, sortBy: 'score', sortDirection:'asc', facets : { showOpenAccessOnly: true, filters: {one: 'one facet'}}},
                expected: {
                    order_by: 'asc',
                    page: 2,
                    per_page: 30,
                    sort: 'score',
                    ['filters[facets][one]']: 'one facet',
                    "rek_oa_status": [453693, 453695, 453696, 453697, 453954]
                }
            }
        ];

        testCases.map(item => {
            expect(routes.getStandardSearchParams({...item.values})).toEqual(item.expected);
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
                    apiUrl: 'records/search',
                    options: {
                        params: {
                            rule: 'possible'
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
                            rule: 'possible',
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

    it('should construct url for RECORDS_ISSUES_API', () => {
        expect(routes.EXISTING_RECORD_API({pid: 'UQ:1001'})).toEqual({apiUrl: 'records/UQ:1001'});
    });

    it('should construct url for RECORDS_ISSUES_API', () => {
        expect(routes.RECORDS_ISSUES_API({pid: 'UQ:1001'})).toEqual({apiUrl: 'records/UQ:1001/issues'});
    });

    it('should construct url for AUTHORS_SEARCH_API', () => {
        expect(routes.AUTHORS_SEARCH_API({query: 'jane'})).toEqual({apiUrl: 'fez-authors/search', options: {params: {query: 'jane'}}});
    });

    it('should construct url for AUTHOR_DETAILS_API', () => {
        expect(routes.AUTHOR_DETAILS_API({userId: '410'})).toEqual({apiUrl: 'authors/details/410'});
    });

    it('should construct url for VOCABULARIES_API', () => {
        expect(routes.VOCABULARIES_API({id: '410'})).toEqual({apiUrl: 'vocabularies/410'});
    });
});
