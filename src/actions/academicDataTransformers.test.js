import * as transformers from './academicDataTransformers';

describe('Academic data transformers ', () => {
    describe('getPublicationsPerType test', () => {
        it('should return number of publications per type', () => {
            const data = [
                {
                    doc_count: 22,
                    key: '2004',
                    stats_display_type_i_lookup_exact: {
                        buckets: [
                            {
                                doc_count: 19,
                                key: 'Journal Article',
                            },
                            {
                                doc_count: 2,
                                key: 'Book Chapter',
                            },
                            {
                                doc_count: 1,
                                key: 'Conference Paper',
                            },
                        ],
                    },
                },
                {
                    doc_count: 15,
                    key: '1999',
                    stats_display_type_i_lookup_exact: {
                        buckets: [
                            {
                                doc_count: 10,
                                key: 'Journal Article',
                            },
                            {
                                doc_count: 4,
                                key: 'Book Chapter',
                            },
                            {
                                doc_count: 1,
                                key: 'Book',
                            },
                        ],
                    },
                },
            ];
            const expected = [
                ['Journal Article', 29],
                ['Book Chapter', 6],
                ['Conference Paper', 1],
                ['Book', 1],
            ];
            const result = transformers.getPublicationsPerType(data);
            expect(result).toEqual(expected);
        });

        it('should return number of publications per type keep 2 & sum others', () => {
            const data = [
                {
                    doc_count: 22,
                    key: '2004',
                    stats_display_type_i_lookup_exact: {
                        buckets: [
                            {
                                doc_count: 19,
                                key: 'Journal Article',
                            },
                            {
                                doc_count: 2,
                                key: 'Book Chapter',
                            },
                            {
                                doc_count: 1,
                                key: 'Conference Paper',
                            },
                        ],
                    },
                },
                {
                    doc_count: 15,
                    key: '1999',
                    stats_display_type_i_lookup_exact: {
                        buckets: [
                            {
                                doc_count: 10,
                                key: 'Journal Article',
                            },
                            {
                                doc_count: 4,
                                key: 'Book Chapter',
                            },
                            {
                                doc_count: 1,
                                key: 'Book',
                            },
                        ],
                    },
                },
            ];
            const expected = [
                ['Journal Article', 29],
                ['Book Chapter', 6],
                ['Other', 2, 'Conference Paper, Book'],
            ];
            const result = transformers.getPublicationsPerType(data, 2);
            expect(result).toEqual(expected);
        });

        it('should return number of publications per type correctly sorted', () => {
            const data = [
                {
                    doc_count: 15,
                    key: '1999',
                    stats_display_type_i_lookup_exact: {
                        buckets: [
                            {
                                doc_count: 4,
                                key: 'Book Chapter',
                            },
                            {
                                doc_count: 1,
                                key: 'Book',
                            },
                            {
                                doc_count: 10,
                                key: 'Journal Article',
                            },
                        ],
                    },
                },
                {
                    doc_count: 22,
                    key: '2004',
                    stats_display_type_i_lookup_exact: {
                        buckets: [
                            {
                                doc_count: 19,
                                key: 'Journal Article',
                            },
                            {
                                doc_count: 2,
                                key: 'Book Chapter',
                            },
                            {
                                doc_count: 1,
                                key: 'Conference Paper',
                            },
                        ],
                    },
                },
            ];
            const expected = [
                ['Journal Article', 29],
                ['Book Chapter', 6],
                ['Book', 1],
                ['Other', 1, 'Conference Paper'],
            ];
            const result = transformers.getPublicationsPerType(data, 3);
            expect(result).toEqual(expected);
        });
    });

    describe('getPublicationsPerYearCategories test', () => {
        it('should return publications per year categories', () => {
            const data = [
                {
                    doc_count: 22,
                    key: '2004',
                    stats_display_type_i_lookup_exact: {
                        buckets: [
                            {
                                doc_count: 19,
                                key: 'Journal Article',
                            },
                            {
                                doc_count: 2,
                                key: 'Book Chapter',
                            },
                            {
                                doc_count: 1,
                                key: 'Conference Paper',
                            },
                        ],
                    },
                },
                {
                    doc_count: 15,
                    key: '1999',
                    stats_display_type_i_lookup_exact: {
                        buckets: [
                            {
                                doc_count: 10,
                                key: 'Journal Article',
                            },
                            {
                                doc_count: 4,
                                key: 'Book Chapter',
                            },
                            {
                                doc_count: 1,
                                key: 'Book',
                            },
                        ],
                    },
                },
            ];
            const expected = [1999, 2004];
            const result = transformers.getPublicationsPerYearCategories(data);
            expect(result).toEqual(expected);
        });
    });

    describe('getPublicationsPerYearSeries test', () => {
        it('should return number of publication per year series', () => {
            const data = [
                {
                    doc_count: 22,
                    key: '2004',
                    stats_display_type_i_lookup_exact: {
                        buckets: [
                            {
                                doc_count: 19,
                                key: 'Journal Article',
                            },
                            {
                                doc_count: 2,
                                key: 'Book Chapter',
                            },
                            {
                                doc_count: 1,
                                key: 'Conference Paper',
                            },
                        ],
                    },
                },
                {
                    doc_count: 15,
                    key: '1999',
                    stats_display_type_i_lookup_exact: {
                        buckets: [
                            {
                                doc_count: 10,
                                key: 'Journal Article',
                            },
                            {
                                doc_count: 4,
                                key: 'Book Chapter',
                            },
                            {
                                doc_count: 1,
                                key: 'Book',
                            },
                        ],
                    },
                },
            ];
            const topPublications = [
                ['Journal Article', 29],
                ['Book Chapter', 6],
                ['Conference Paper', 1],
                ['Book', 1],
            ];
            const expected = [
                {
                    name: 'Journal Article',
                    data: [10, 19],
                },
                {
                    name: 'Book Chapter',
                    data: [4, 2],
                },
                {
                    name: 'Conference Paper',
                    data: [0, 1],
                },
                {
                    name: 'Book',
                    data: [1, 0],
                },
            ];
            const result = transformers.getPublicationsPerYearSeries(data, topPublications);
            expect(result).toEqual(expected);
        });

        it('should return number of publications per year series 2 as top publications & others', () => {
            const data = [
                {
                    doc_count: 22,
                    key: '2004',
                    stats_display_type_i_lookup_exact: {
                        buckets: [
                            {
                                doc_count: 19,
                                key: 'Journal Article',
                            },
                            {
                                doc_count: 2,
                                key: 'Book Chapter',
                            },
                            {
                                doc_count: 1,
                                key: 'Conference Paper',
                            },
                        ],
                    },
                },
                {
                    doc_count: 15,
                    key: '1999',
                    stats_display_type_i_lookup_exact: {
                        buckets: [
                            {
                                doc_count: 10,
                                key: 'Journal Article',
                            },
                            {
                                doc_count: 4,
                                key: 'Book Chapter',
                            },
                            {
                                doc_count: 1,
                                key: 'Book',
                            },
                        ],
                    },
                },
            ];
            const topPublications = [
                ['Journal Article', 29],
                ['Book Chapter', 6],
                ['Other', 2],
            ];
            const expected = [
                {
                    name: 'Journal Article',
                    data: [10, 19],
                },
                {
                    name: 'Book Chapter',
                    data: [4, 2],
                },
                {
                    name: 'Other',
                    data: [1, 1],
                },
            ];
            const result = transformers.getPublicationsPerYearSeries(data, topPublications);
            expect(result).toEqual(expected);
        });
    });

    describe('transformTrendingPublicationsMetricsData', () => {
        it(
            'should transform trending publications response in correct order ' +
                'if more than one metrics data returned from api',
            () => {
                const data = [
                    {
                        rek_pid: 'UQ:111111',
                        rek_title: 'Test record 1',
                        rek_date: '2016-01-01T00:00:00Z',
                        fez_record_search_key_doi: {
                            fez_altmetric: {
                                as_score: 3,
                                as_3m: 3,
                                as_citation_url: 'https://queensland.altmetric.com/details/3638458',
                            },
                        },
                    },
                    {
                        rek_pid: 'UQ:222222',
                        rek_title: 'Test record 2',
                        rek_date: '2017-01-01T00:00:00Z',
                        fez_record_search_key_doi: {
                            fez_altmetric: {
                                as_score: 10,
                                as_3m: 4,
                                as_citation_url: 'https://queensland.altmetric.com/details/3638458',
                            },
                        },
                        fez_record_search_key_isi_loc: {
                            fez_thomson_citations: {
                                tc_count: 6,
                                tc_3m: 4,
                                tc_citation_url: 'http://www.wos.com?citation_id=123242',
                            },
                        },
                    },
                    {
                        rek_pid: 'UQ:333333',
                        rek_title: 'Test record 3',
                        rek_date: '2018-01-01T00:00:00Z',
                        fez_record_search_key_isi_loc: {
                            fez_thomson_citations: {
                                tc_count: 15,
                                tc_3m: 8,
                                tc_citation_url: 'http://www.wos.com?citation_id=123242',
                            },
                        },
                        fez_record_search_key_scopus_id: {
                            fez_scopus_citations: {
                                sc_count: 23,
                                sc_3m: 45,
                                sc_citation_url: 'http://www.scopus.com/details.php?citation_id=23432423',
                            },
                        },
                    },
                ];

                const expectedMetrics = [
                    {
                        key: 'scopus',
                        values: [
                            {
                                rek_pid: 'UQ:333333',
                                rek_title: 'Test record 3',
                                rek_date: '2018-01-01T00:00:00Z',
                                fez_record_search_key_isi_loc: {
                                    fez_thomson_citations: {
                                        tc_count: 15,
                                        tc_3m: 8,
                                        tc_citation_url: 'http://www.wos.com?citation_id=123242',
                                    },
                                },
                                fez_record_search_key_scopus_id: {
                                    fez_scopus_citations: {
                                        sc_count: 23,
                                        sc_3m: 45,
                                        sc_citation_url: 'http://www.scopus.com/details.php?citation_id=23432423',
                                    },
                                },
                                metricData: {
                                    count: 23,
                                    difference: 45,
                                    citation_url: 'http://www.scopus.com/details.php?citation_id=23432423',
                                    source: 'scopus',
                                },
                            },
                        ],
                    },
                    {
                        key: 'thomson',
                        values: [
                            {
                                rek_pid: 'UQ:333333',
                                rek_title: 'Test record 3',
                                rek_date: '2018-01-01T00:00:00Z',
                                fez_record_search_key_isi_loc: {
                                    fez_thomson_citations: {
                                        tc_count: 15,
                                        tc_3m: 8,
                                        tc_citation_url: 'http://www.wos.com?citation_id=123242',
                                    },
                                },
                                fez_record_search_key_scopus_id: {
                                    fez_scopus_citations: {
                                        sc_count: 23,
                                        sc_3m: 45,
                                        sc_citation_url: 'http://www.scopus.com/details.php?citation_id=23432423',
                                    },
                                },
                                metricData: {
                                    count: 15,
                                    difference: 8,
                                    citation_url: 'http://www.wos.com?citation_id=123242',
                                    source: 'thomson',
                                },
                            },
                            {
                                rek_pid: 'UQ:222222',
                                rek_title: 'Test record 2',
                                rek_date: '2017-01-01T00:00:00Z',
                                fez_record_search_key_doi: {
                                    fez_altmetric: {
                                        as_score: 10,
                                        as_3m: 4,
                                        as_citation_url: 'https://queensland.altmetric.com/details/3638458',
                                    },
                                },
                                fez_record_search_key_isi_loc: {
                                    fez_thomson_citations: {
                                        tc_count: 6,
                                        tc_3m: 4,
                                        tc_citation_url: 'http://www.wos.com?citation_id=123242',
                                    },
                                },
                                metricData: {
                                    count: 6,
                                    difference: 4,
                                    citation_url: 'http://www.wos.com?citation_id=123242',
                                    source: 'thomson',
                                },
                            },
                        ],
                    },
                    {
                        key: 'altmetric',
                        values: [
                            {
                                rek_pid: 'UQ:222222',
                                rek_title: 'Test record 2',
                                rek_date: '2017-01-01T00:00:00Z',
                                fez_record_search_key_doi: {
                                    fez_altmetric: {
                                        as_score: 10,
                                        as_3m: 4,
                                        as_citation_url: 'https://queensland.altmetric.com/details/3638458',
                                    },
                                },
                                fez_record_search_key_isi_loc: {
                                    fez_thomson_citations: {
                                        tc_count: 6,
                                        tc_3m: 4,
                                        tc_citation_url: 'http://www.wos.com?citation_id=123242',
                                    },
                                },
                                metricData: {
                                    count: 10,
                                    difference: 4,
                                    citation_url: 'https://queensland.altmetric.com/details/3638458',
                                    source: 'altmetric',
                                },
                            },
                            {
                                rek_pid: 'UQ:111111',
                                rek_title: 'Test record 1',
                                rek_date: '2016-01-01T00:00:00Z',
                                fez_record_search_key_doi: {
                                    fez_altmetric: {
                                        as_score: 3,
                                        as_3m: 3,
                                        as_citation_url: 'https://queensland.altmetric.com/details/3638458',
                                    },
                                },
                                metricData: {
                                    count: 3,
                                    difference: 3,
                                    citation_url: 'https://queensland.altmetric.com/details/3638458',
                                    source: 'altmetric',
                                },
                            },
                        ],
                    },
                ];

                const result = transformers.transformTrendingPublicationsMetricsData({ data });
                expect(result).toEqual(expectedMetrics);
            },
        );

        it(
            'should transform trending publications response correctly ' +
                'if only one metric data returned from the api',
            () => {
                const data = [
                    {
                        rek_pid: 'UQ:222222',
                        rek_title: 'Test record 2',
                        rek_date: '2017-01-01T00:00:00Z',
                        fez_record_search_key_isi_loc: {
                            fez_thomson_citations: {
                                tc_count: 6,
                                tc_3m: 4,
                                tc_citation_url: 'http://www.wos.com?citation_id=123242',
                            },
                        },
                    },
                    {
                        rek_pid: 'UQ:333333',
                        rek_title: 'Test record 3',
                        rek_date: '2018-01-01T00:00:00Z',
                        fez_record_search_key_isi_loc: {
                            fez_thomson_citations: {
                                tc_count: 15,
                                tc_3m: 8,
                                tc_citation_url: 'http://www.wos.com?details.php?citation_id=548872',
                            },
                        },
                    },
                ];
                const expectedMetrics = [
                    {
                        key: 'thomson',
                        values: [
                            {
                                rek_pid: 'UQ:333333',
                                rek_title: 'Test record 3',
                                rek_date: '2018-01-01T00:00:00Z',
                                fez_record_search_key_isi_loc: {
                                    fez_thomson_citations: {
                                        tc_count: 15,
                                        tc_3m: 8,
                                        tc_citation_url: 'http://www.wos.com?details.php?citation_id=548872',
                                    },
                                },
                                metricData: {
                                    count: 15,
                                    difference: 8,
                                    citation_url: 'http://www.wos.com?details.php?citation_id=548872',
                                    source: 'thomson',
                                },
                            },
                            {
                                rek_pid: 'UQ:222222',
                                rek_title: 'Test record 2',
                                rek_date: '2017-01-01T00:00:00Z',
                                fez_record_search_key_isi_loc: {
                                    fez_thomson_citations: {
                                        tc_count: 6,
                                        tc_3m: 4,
                                        tc_citation_url: 'http://www.wos.com?citation_id=123242',
                                    },
                                },
                                metricData: {
                                    count: 6,
                                    difference: 4,
                                    citation_url: 'http://www.wos.com?citation_id=123242',
                                    source: 'thomson',
                                },
                            },
                        ],
                    },
                ];

                const result = transformers.transformTrendingPublicationsMetricsData({ data });
                expect(result).toEqual(expectedMetrics);
            },
        );
    });

    it('should getPublicationsStats when data is provided', () => {
        const years = ['1999', '2001', '2004', '2005', '2007', '2009', '2010', '2014'];

        const data = {
            stats_thomson_citation_count_i: { count: 301, min: 0, max: 345, avg: 24.498338870432, sum: 7374 },
            stats_scopus_citation_count_i: { count: 210, min: 0, max: 373, avg: 25.22380952381, sum: 5297 },
        };
        const expected = {
            scopus_citation_count_i: {
                count: 210,
                min: 0,
                max: 373,
                avg: 25.22380952381,
                sum: 5297,
                years: '1999 - 2014',
            },
            thomson_citation_count_i: {
                count: 301,
                min: 0,
                max: 345,
                avg: 24.498338870432,
                sum: 7374,
                years: '1999 - 2014',
            },
        };
        const result = transformers.getPublicationsStats(years, data);
        expect(result).toEqual(expected);
    });

    describe('getAuthorArticleCount', () => {
        it('should transform correctly when data is provided', () => {
            const total = 40;
            const authorDetails = {
                espace: {
                    first_year: '1990',
                    last_year: '2015',
                    doc_count: 41,
                },
            };
            const expected = {
                articleCount: total,
                articleFirstYear: '1990',
                articleLastYear: '2015',
            };

            const result = transformers.getAuthorArticleCount(total, authorDetails);
            expect(result).toEqual(expected);
        });

        it('should transform correctly when data is null', () => {
            const total = 5;
            const authorDetails = null;

            const expected = {
                articleCount: total,
                articleFirstYear: null,
                articleLastYear: null,
            };

            const result = transformers.getAuthorArticleCount(total, authorDetails);
            expect(result).toEqual(expected);
        });

        it('should transform correctly when year data is null', () => {
            const total = 10;
            const authorDetails = {
                espace: {
                    first_year: null,
                    last_year: '2015',
                    doc_count: 8,
                },
            };

            const expected = {
                articleCount: total,
                articleFirstYear: null,
                articleLastYear: '2015',
            };
            const result = transformers.getAuthorArticleCount(total, authorDetails);
            expect(result).toEqual(expected);
        });

        it('should transform correctly when total and data is null', () => {
            const total = null;
            const authorDetails = {
                espace: {
                    first_year: null,
                    last_year: null,
                    doc_count: 8,
                },
            };
            const expected = {
                articleCount: total,
                articleFirstYear: null,
                articleLastYear: null,
            };
            const result = transformers.getAuthorArticleCount(total, authorDetails);
            expect(result).toEqual(expected);
        });
    });

    describe('transformTrendingPublicationsMetricsData', () => {
        it('should get a zero result on altmetric if altmetric has no trending data', () => {
            const data = [
                {
                    rek_pid: 'UQ:111111',
                    rek_title: 'Test record 1',
                    rek_date: '2016-01-01T00:00:00Z',
                    fez_record_search_key_doi: {
                        fez_altmetric: {
                            as_score: 3,
                            as_3m: 0,
                            as_citation_url: 'https://queensland.altmetric.com/details/3638458',
                        },
                    },
                },
                {
                    rek_pid: 'UQ:222222',
                    rek_title: 'Test record 2',
                    rek_date: '2017-01-01T00:00:00Z',
                    fez_record_search_key_doi: {
                        fez_altmetric: {
                            as_score: 10,
                            as_3m: 0,
                            as_citation_url: 'https://queensland.altmetric.com/details/3638458',
                        },
                    },
                    fez_record_search_key_isi_loc: {
                        fez_thomson_citations: {
                            tc_count: 6,
                            tc_3m: 4,
                            tc_citation_url: 'http://www.wos.com?citation_id=123242',
                        },
                    },
                },
                {
                    rek_pid: 'UQ:333333',
                    rek_title: 'Test record 3',
                    rek_date: '2018-01-01T00:00:00Z',
                    fez_record_search_key_isi_loc: {
                        fez_thomson_citations: {
                            tc_count: 15,
                            tc_3m: 8,
                            tc_citation_url: 'http://www.wos.com?citation_id=123242',
                        },
                    },
                    fez_record_search_key_scopus_id: {
                        fez_scopus_citations: {
                            sc_count: 23,
                            sc_3m: 45,
                            sc_citation_url: 'http://www.scopus.com/details.php?citation_id=23432423',
                        },
                    },
                },
            ];

            const expectedMetrics = [
                {
                    key: 'scopus',
                    values: [
                        {
                            fez_record_search_key_isi_loc: {
                                fez_thomson_citations: {
                                    tc_3m: 8,
                                    tc_citation_url: 'http://www.wos.com?citation_id=123242',
                                    tc_count: 15,
                                },
                            },
                            fez_record_search_key_scopus_id: {
                                fez_scopus_citations: {
                                    sc_3m: 45,
                                    sc_citation_url: 'http://www.scopus.com/details.php?citation_id=23432423',
                                    sc_count: 23,
                                },
                            },
                            metricData: {
                                citation_url: 'http://www.scopus.com/details.php?citation_id=23432423',
                                count: 23,
                                difference: 45,
                                source: 'scopus',
                            },
                            rek_date: '2018-01-01T00:00:00Z',
                            rek_pid: 'UQ:333333',
                            rek_title: 'Test record 3',
                        },
                    ],
                },
                {
                    key: 'thomson',
                    values: [
                        {
                            rek_pid: 'UQ:333333',
                            rek_title: 'Test record 3',
                            rek_date: '2018-01-01T00:00:00Z',
                            fez_record_search_key_isi_loc: {
                                fez_thomson_citations: {
                                    tc_count: 15,
                                    tc_3m: 8,
                                    tc_citation_url: 'http://www.wos.com?citation_id=123242',
                                },
                            },
                            fez_record_search_key_scopus_id: {
                                fez_scopus_citations: {
                                    sc_count: 23,
                                    sc_3m: 45,
                                    sc_citation_url: 'http://www.scopus.com/details.php?citation_id=23432423',
                                },
                            },
                            metricData: {
                                count: 15,
                                difference: 8,
                                citation_url: 'http://www.wos.com?citation_id=123242',
                                source: 'thomson',
                            },
                        },
                        {
                            rek_pid: 'UQ:222222',
                            rek_title: 'Test record 2',
                            rek_date: '2017-01-01T00:00:00Z',
                            fez_record_search_key_doi: {
                                fez_altmetric: {
                                    as_score: 10,
                                    as_3m: 0,
                                    as_citation_url: 'https://queensland.altmetric.com/details/3638458',
                                },
                            },
                            fez_record_search_key_isi_loc: {
                                fez_thomson_citations: {
                                    tc_count: 6,
                                    tc_3m: 4,
                                    tc_citation_url: 'http://www.wos.com?citation_id=123242',
                                },
                            },
                            metricData: {
                                count: 6,
                                difference: 4,
                                citation_url: 'http://www.wos.com?citation_id=123242',
                                source: 'thomson',
                            },
                        },
                    ],
                },
            ];

            const result = transformers.transformTrendingPublicationsMetricsData({ data });
            expect(result).toEqual(expectedMetrics);
        });

        it('should get a zero result on wos if wos has no trending data', () => {
            const data = [
                {
                    rek_pid: 'UQ:111111',
                    rek_title: 'Test record 1',
                    rek_date: '2016-01-01T00:00:00Z',
                    fez_record_search_key_doi: {
                        fez_altmetric: {
                            as_score: 3,
                            as_3m: 3,
                            as_citation_url: 'https://queensland.altmetric.com/details/3638458',
                        },
                    },
                },
                {
                    rek_pid: 'UQ:222222',
                    rek_title: 'Test record 2',
                    rek_date: '2017-01-01T00:00:00Z',
                    fez_record_search_key_doi: {
                        fez_altmetric: {
                            as_score: 10,
                            as_3m: 4,
                            as_citation_url: 'https://queensland.altmetric.com/details/3638458',
                        },
                    },
                    fez_record_search_key_isi_loc: {
                        fez_thomson_citations: {
                            tc_count: 6,
                            tc_3m: 0,
                            tc_citation_url: 'http://www.wos.com?citation_id=123242',
                        },
                    },
                },
                {
                    rek_pid: 'UQ:333333',
                    rek_title: 'Test record 3',
                    rek_date: '2018-01-01T00:00:00Z',
                    fez_record_search_key_isi_loc: {
                        fez_thomson_citations: {
                            tc_count: 15,
                            tc_3m: 0,
                            tc_citation_url: 'http://www.wos.com?citation_id=123242',
                        },
                    },
                    fez_record_search_key_scopus_id: {
                        fez_scopus_citations: {
                            sc_count: 23,
                            sc_3m: 45,
                            sc_citation_url: 'http://www.scopus.com/details.php?citation_id=23432423',
                        },
                    },
                },
            ];

            const expectedMetrics = [
                {
                    key: 'scopus',
                    values: [
                        {
                            fez_record_search_key_isi_loc: {
                                fez_thomson_citations: {
                                    tc_3m: 0,
                                    tc_citation_url: 'http://www.wos.com?citation_id=123242',
                                    tc_count: 15,
                                },
                            },
                            fez_record_search_key_scopus_id: {
                                fez_scopus_citations: {
                                    sc_3m: 45,
                                    sc_citation_url: 'http://www.scopus.com/details.php?citation_id=23432423',
                                    sc_count: 23,
                                },
                            },
                            metricData: {
                                citation_url: 'http://www.scopus.com/details.php?citation_id=23432423',
                                count: 23,
                                difference: 45,
                                source: 'scopus',
                            },
                            rek_date: '2018-01-01T00:00:00Z',
                            rek_pid: 'UQ:333333',
                            rek_title: 'Test record 3',
                        },
                    ],
                },
                {
                    key: 'altmetric',
                    values: [
                        {
                            rek_pid: 'UQ:222222',
                            rek_title: 'Test record 2',
                            rek_date: '2017-01-01T00:00:00Z',
                            fez_record_search_key_doi: {
                                fez_altmetric: {
                                    as_score: 10,
                                    as_3m: 4,
                                    as_citation_url: 'https://queensland.altmetric.com/details/3638458',
                                },
                            },
                            fez_record_search_key_isi_loc: {
                                fez_thomson_citations: {
                                    tc_count: 6,
                                    tc_3m: 0,
                                    tc_citation_url: 'http://www.wos.com?citation_id=123242',
                                },
                            },
                            metricData: {
                                count: 10,
                                difference: 4,
                                citation_url: 'https://queensland.altmetric.com/details/3638458',
                                source: 'altmetric',
                            },
                        },
                        {
                            rek_pid: 'UQ:111111',
                            rek_title: 'Test record 1',
                            rek_date: '2016-01-01T00:00:00Z',
                            fez_record_search_key_doi: {
                                fez_altmetric: {
                                    as_score: 3,
                                    as_3m: 3,
                                    as_citation_url: 'https://queensland.altmetric.com/details/3638458',
                                },
                            },
                            metricData: {
                                count: 3,
                                difference: 3,
                                citation_url: 'https://queensland.altmetric.com/details/3638458',
                                source: 'altmetric',
                            },
                        },
                    ],
                },
            ];

            const result = transformers.transformTrendingPublicationsMetricsData({ data });
            expect(result).toEqual(expectedMetrics);
        });

        it('should get a zero result on scopus if scopus has no trending data', () => {
            const data = [
                {
                    rek_pid: 'UQ:111111',
                    rek_title: 'Test record 1',
                    rek_date: '2016-01-01T00:00:00Z',
                    fez_record_search_key_doi: {
                        fez_altmetric: {
                            as_score: 3,
                            as_3m: 3,
                            as_citation_url: 'https://queensland.altmetric.com/details/3638458',
                        },
                    },
                },
                {
                    rek_pid: 'UQ:222222',
                    rek_title: 'Test record 2',
                    rek_date: '2017-01-01T00:00:00Z',
                    fez_record_search_key_doi: {
                        fez_altmetric: {
                            as_score: 10,
                            as_3m: 4,
                            as_citation_url: 'https://queensland.altmetric.com/details/3638458',
                        },
                    },
                    fez_record_search_key_isi_loc: {
                        fez_thomson_citations: {
                            tc_count: 6,
                            tc_3m: 4,
                            tc_citation_url: 'http://www.wos.com?citation_id=123242',
                        },
                    },
                },
                {
                    rek_pid: 'UQ:333333',
                    rek_title: 'Test record 3',
                    rek_date: '2018-01-01T00:00:00Z',
                    fez_record_search_key_isi_loc: {
                        fez_thomson_citations: {
                            tc_count: 15,
                            tc_3m: 8,
                            tc_citation_url: 'http://www.wos.com?citation_id=123242',
                        },
                    },
                    fez_record_search_key_scopus_id: {
                        fez_scopus_citations: {
                            sc_count: 23,
                            sc_3m: 0,
                            sc_citation_url: 'http://www.scopus.com/details.php?citation_id=23432423',
                        },
                    },
                },
            ];

            const expectedMetrics = [
                {
                    key: 'thomson',
                    values: [
                        {
                            rek_pid: 'UQ:333333',
                            rek_title: 'Test record 3',
                            rek_date: '2018-01-01T00:00:00Z',
                            fez_record_search_key_isi_loc: {
                                fez_thomson_citations: {
                                    tc_count: 15,
                                    tc_3m: 8,
                                    tc_citation_url: 'http://www.wos.com?citation_id=123242',
                                },
                            },
                            fez_record_search_key_scopus_id: {
                                fez_scopus_citations: {
                                    sc_count: 23,
                                    sc_3m: 0,
                                    sc_citation_url: 'http://www.scopus.com/details.php?citation_id=23432423',
                                },
                            },
                            metricData: {
                                count: 15,
                                difference: 8,
                                citation_url: 'http://www.wos.com?citation_id=123242',
                                source: 'thomson',
                            },
                        },
                        {
                            rek_pid: 'UQ:222222',
                            rek_title: 'Test record 2',
                            rek_date: '2017-01-01T00:00:00Z',
                            fez_record_search_key_doi: {
                                fez_altmetric: {
                                    as_score: 10,
                                    as_3m: 4,
                                    as_citation_url: 'https://queensland.altmetric.com/details/3638458',
                                },
                            },
                            fez_record_search_key_isi_loc: {
                                fez_thomson_citations: {
                                    tc_count: 6,
                                    tc_3m: 4,
                                    tc_citation_url: 'http://www.wos.com?citation_id=123242',
                                },
                            },
                            metricData: {
                                count: 6,
                                difference: 4,
                                citation_url: 'http://www.wos.com?citation_id=123242',
                                source: 'thomson',
                            },
                        },
                    ],
                },
                {
                    key: 'altmetric',
                    values: [
                        {
                            rek_pid: 'UQ:222222',
                            rek_title: 'Test record 2',
                            rek_date: '2017-01-01T00:00:00Z',
                            fez_record_search_key_doi: {
                                fez_altmetric: {
                                    as_score: 10,
                                    as_3m: 4,
                                    as_citation_url: 'https://queensland.altmetric.com/details/3638458',
                                },
                            },
                            fez_record_search_key_isi_loc: {
                                fez_thomson_citations: {
                                    tc_count: 6,
                                    tc_3m: 4,
                                    tc_citation_url: 'http://www.wos.com?citation_id=123242',
                                },
                            },
                            metricData: {
                                count: 10,
                                difference: 4,
                                citation_url: 'https://queensland.altmetric.com/details/3638458',
                                source: 'altmetric',
                            },
                        },
                        {
                            rek_pid: 'UQ:111111',
                            rek_title: 'Test record 1',
                            rek_date: '2016-01-01T00:00:00Z',
                            fez_record_search_key_doi: {
                                fez_altmetric: {
                                    as_score: 3,
                                    as_3m: 3,
                                    as_citation_url: 'https://queensland.altmetric.com/details/3638458',
                                },
                            },
                            metricData: {
                                count: 3,
                                difference: 3,
                                citation_url: 'https://queensland.altmetric.com/details/3638458',
                                source: 'altmetric',
                            },
                        },
                    ],
                },
            ];

            const result = transformers.transformTrendingPublicationsMetricsData({ data });
            expect(result).toEqual(expectedMetrics);
        });
    });
});
