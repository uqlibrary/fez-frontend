import trendingPublicationsMiddleware, {transformTrendingPublicationsMetricsData} from './trendingPublicationsMiddleware';

describe('Trending publications middleware', () => {
    describe('transformTrendingPublicationsMetricsData', () => {
        it('should transform trending publications response in correct order if more than one metrics data returned from api', () => {
            const data = [
                {
                    rek_pid: 'UQ:111111',
                    rek_title: 'Test record 1',
                    rek_date: '2016-01-01T00:00:00Z'
                },
                {
                    rek_pid: 'UQ:222222',
                    rek_title: 'Test record 2',
                    rek_date: '2017-01-01T00:00:00Z'
                },
                {
                    rek_pid: 'UQ:333333',
                    rek_title: 'Test record 3',
                    rek_date: '2018-01-01T00:00:00Z'
                }
            ];
            const metrics = {
                altmetric: [
                    {
                        "rek_pid": "UQ:111111",
                        "rek_title": "Evaluation of candidate stromal epithelial cross-talk genes identifies association between risk of serous ovarian cancer and TERT, a cancer susceptibility \"Hot-Spot\"",
                        "authors": "Johnatty, Sharon E.;Beesley, Jonathan;Chen, Xiaoqing...",
                        "id": 3638458,
                        "count": "3",
                        "difference": "3",
                        "created": 1424092210,
                        "last_checked": 1517253819,
                        "citation_url": "http://www.altmetric.com/details.php?citation_id=3638458"
                    },
                    {
                        "rek_pid": "UQ:222222",
                        "rek_title": "Evaluation of candidate stromal epithelial cross-talk genes identifies association between risk of serous ovarian cancer and TERT, a cancer susceptibility \"Hot-Spot\"",
                        "authors": "Johnatty, Sharon E.;Beesley, Jonathan;Chen, Xiaoqing...",
                        "id": 3638458,
                        "count": "10",
                        "difference": "4",
                        "created": 1424092210,
                        "last_checked": 1517253819,
                        "citation_url": "http://www.altmetric.com/details.php?citation_id=3638458"
                    }
                ],
                thomson: [
                    {
                        "rek_pid": "UQ:222222",
                        "rek_title": "Evaluation of candidate stromal epithelial cross-talk genes identifies association between risk of serous ovarian cancer and TERT, a cancer susceptibility \"Hot-Spot\"",
                        "authors": "Johnatty, Sharon E.;Beesley, Jonathan;Chen, Xiaoqing...",
                        "id": 3638458,
                        "count": "6",
                        "difference": "4",
                        "created": 1424092210,
                        "last_checked": 1517253819,
                        "citation_url": "http://www.wos.com?citation_id=123242"
                    },
                    {
                        "rek_pid": "UQ:333333",
                        "rek_title": "Evaluation of candidate stromal epithelial cross-talk genes identifies association between risk of serous ovarian cancer and TERT, a cancer susceptibility \"Hot-Spot\"",
                        "authors": "Johnatty, Sharon E.;Beesley, Jonathan;Chen, Xiaoqing...",
                        "id": 3638458,
                        "count": "15",
                        "difference": "8",
                        "created": 1424092210,
                        "last_checked": 1517253819,
                        "citation_url": "http://www.wos.com?details.php?citation_id=548872"
                    }
                ],
                scopus: [
                    {
                        "rek_pid": "UQ:333333",
                        "rek_title": "Evaluation of candidate stromal epithelial cross-talk genes identifies association between risk of serous ovarian cancer and TERT, a cancer susceptibility \"Hot-Spot\"",
                        "authors": "Johnatty, Sharon E.;Beesley, Jonathan;Chen, Xiaoqing...",
                        "id": 3638458,
                        "count": "23",
                        "difference": "45",
                        "created": 1424092210,
                        "last_checked": 1517253819,
                        "citation_url": "http://www.scopus.com/details.php?citation_id=23432423"
                    }
                ]
            };
            const expectedMetrics = [
                {
                    key: 'scopus',
                    values: [
                        {
                            rek_pid: 'UQ:333333',
                            rek_title: 'Test record 3',
                            rek_date: '2018-01-01T00:00:00Z',
                            metricData: {
                                "rek_pid": "UQ:333333",
                                "rek_title": "Evaluation of candidate stromal epithelial cross-talk genes identifies association between risk of serous ovarian cancer and TERT, a cancer susceptibility \"Hot-Spot\"",
                                "authors": "Johnatty, Sharon E.;Beesley, Jonathan;Chen, Xiaoqing...",
                                "id": 3638458,
                                "count": "23",
                                "difference": "45",
                                "created": 1424092210,
                                "last_checked": 1517253819,
                                "citation_url": "http://www.scopus.com/details.php?citation_id=23432423",
                                "source": "scopus"
                            }
                        }

                    ]
                },
                {
                    key: 'thomson',
                    values: [
                        {
                            rek_pid: 'UQ:222222',
                            rek_title: 'Test record 2',
                            rek_date: '2017-01-01T00:00:00Z',
                            metricData: {
                                "rek_pid": "UQ:222222",
                                "rek_title": "Evaluation of candidate stromal epithelial cross-talk genes identifies association between risk of serous ovarian cancer and TERT, a cancer susceptibility \"Hot-Spot\"",
                                "authors": "Johnatty, Sharon E.;Beesley, Jonathan;Chen, Xiaoqing...",
                                "id": 3638458,
                                "count": "6",
                                "difference": "4",
                                "created": 1424092210,
                                "last_checked": 1517253819,
                                "citation_url": "http://www.wos.com?citation_id=123242",
                                "source": "thomson"
                            }
                        },
                        {
                            rek_pid: 'UQ:333333',
                            rek_title: 'Test record 3',
                            rek_date: '2018-01-01T00:00:00Z',
                            metricData: {
                                "rek_pid": "UQ:333333",
                                "rek_title": "Evaluation of candidate stromal epithelial cross-talk genes identifies association between risk of serous ovarian cancer and TERT, a cancer susceptibility \"Hot-Spot\"",
                                "authors": "Johnatty, Sharon E.;Beesley, Jonathan;Chen, Xiaoqing...",
                                "id": 3638458,
                                "count": "15",
                                "difference": "8",
                                "created": 1424092210,
                                "last_checked": 1517253819,
                                "citation_url": "http://www.wos.com?details.php?citation_id=548872",
                                "source": "thomson"
                            }
                        }
                    ]
                },
                {
                    key: 'altmetric',
                    values: [
                        {
                            rek_pid: 'UQ:111111',
                            rek_title: 'Test record 1',
                            rek_date: '2016-01-01T00:00:00Z',
                            metricData: {
                                "rek_pid": "UQ:111111",
                                "rek_title": "Evaluation of candidate stromal epithelial cross-talk genes identifies association between risk of serous ovarian cancer and TERT, a cancer susceptibility \"Hot-Spot\"",
                                "authors": "Johnatty, Sharon E.;Beesley, Jonathan;Chen, Xiaoqing...",
                                "id": 3638458,
                                "count": "3",
                                "difference": "3",
                                "created": 1424092210,
                                "last_checked": 1517253819,
                                "citation_url": "http://www.altmetric.com/details.php?citation_id=3638458",
                                "source": "altmetric"
                            }
                        },
                        {
                            rek_pid: 'UQ:222222',
                            rek_title: 'Test record 2',
                            rek_date: '2017-01-01T00:00:00Z',
                            metricData: {
                                "rek_pid": "UQ:222222",
                                "rek_title": "Evaluation of candidate stromal epithelial cross-talk genes identifies association between risk of serous ovarian cancer and TERT, a cancer susceptibility \"Hot-Spot\"",
                                "authors": "Johnatty, Sharon E.;Beesley, Jonathan;Chen, Xiaoqing...",
                                "id": 3638458,
                                "count": "10",
                                "difference": "4",
                                "created": 1424092210,
                                "last_checked": 1517253819,
                                "citation_url": "http://www.altmetric.com/details.php?citation_id=3638458",
                                "source": "altmetric"
                            }
                        }
                    ]
                }
            ];

            const result = transformTrendingPublicationsMetricsData({data, filters: {metrics}});
            expect(result).toEqual(expectedMetrics);
        });

        it('should transform trending publications response correctly if only one metric data returned from api', () => {
            const data = [
                {
                    rek_pid: 'UQ:222222',
                    rek_title: 'Test record 2',
                    rek_date: '2017-01-01T00:00:00Z'
                },
                {
                    rek_pid: 'UQ:333333',
                    rek_title: 'Test record 3',
                    rek_date: '2018-01-01T00:00:00Z'
                }
            ];
            const metrics = {
                thomson: [
                    {
                        "rek_pid": "UQ:222222",
                        "rek_title": "Evaluation of candidate stromal epithelial cross-talk genes identifies association between risk of serous ovarian cancer and TERT, a cancer susceptibility \"Hot-Spot\"",
                        "authors": "Johnatty, Sharon E.;Beesley, Jonathan;Chen, Xiaoqing...",
                        "id": 3638458,
                        "count": "6",
                        "difference": "4",
                        "created": 1424092210,
                        "last_checked": 1517253819,
                        "citation_url": "http://www.wos.com?citation_id=123242"
                    },
                    {
                        "rek_pid": "UQ:333333",
                        "rek_title": "Evaluation of candidate stromal epithelial cross-talk genes identifies association between risk of serous ovarian cancer and TERT, a cancer susceptibility \"Hot-Spot\"",
                        "authors": "Johnatty, Sharon E.;Beesley, Jonathan;Chen, Xiaoqing...",
                        "id": 3638458,
                        "count": "15",
                        "difference": "8",
                        "created": 1424092210,
                        "last_checked": 1517253819,
                        "citation_url": "http://www.wos.com?details.php?citation_id=548872"
                    }
                ]
            };
            const expectedMetrics = [
                {
                    key: 'thomson',
                    values: [
                        {
                            rek_pid: 'UQ:222222',
                            rek_title: 'Test record 2',
                            rek_date: '2017-01-01T00:00:00Z',
                            metricData: {
                                "rek_pid": "UQ:222222",
                                "rek_title": "Evaluation of candidate stromal epithelial cross-talk genes identifies association between risk of serous ovarian cancer and TERT, a cancer susceptibility \"Hot-Spot\"",
                                "authors": "Johnatty, Sharon E.;Beesley, Jonathan;Chen, Xiaoqing...",
                                "id": 3638458,
                                "count": "6",
                                "difference": "4",
                                "created": 1424092210,
                                "last_checked": 1517253819,
                                "citation_url": "http://www.wos.com?citation_id=123242",
                                "source": "thomson"
                            }
                        },
                        {
                            rek_pid: 'UQ:333333',
                            rek_title: 'Test record 3',
                            rek_date: '2018-01-01T00:00:00Z',
                            metricData: {
                                "rek_pid": "UQ:333333",
                                "rek_title": "Evaluation of candidate stromal epithelial cross-talk genes identifies association between risk of serous ovarian cancer and TERT, a cancer susceptibility \"Hot-Spot\"",
                                "authors": "Johnatty, Sharon E.;Beesley, Jonathan;Chen, Xiaoqing...",
                                "id": 3638458,
                                "count": "15",
                                "difference": "8",
                                "created": 1424092210,
                                "last_checked": 1517253819,
                                "citation_url": "http://www.wos.com?details.php?citation_id=548872",
                                "source": "thomson"
                            }
                        }
                    ]
                }
            ];

            const result = transformTrendingPublicationsMetricsData({data, filters: {metrics}});
            expect(result).toEqual(expectedMetrics);
        });
    });

    describe('trendingPublicationsMiddleware', () => {
        it('should add metric data to a list of publication and transform the incoming response for trending publications', () => {
            const payload = {
                total: 2,
                data: [
                    {rek_pid: 'UQ:1234', rek_title: 'Title', rek_description: 'Description', rek_formatted_abstract: 'Abstract'},
                    {rek_pid: 'UQ:1235', rek_title: 'Title', rek_description: 'Description', rek_formatted_abstract: 'Abstract'}
                ],
                filters: {
                    metrics: {
                        altmetric: [
                            {rek_pid: 'UQ:1234'}
                        ],
                        thomson: [
                            {rek_pid: 'UQ:1235'}
                        ]
                    }
                }
            };

            const next = jest.fn();
            const expectedPayload = [
                {
                    key: 'thomson',
                    values: [
                        {rek_pid: 'UQ:1235', rek_title: 'Title', rek_description: 'Description', rek_formatted_abstract: 'Abstract', metricData: {rek_pid: "UQ:1235", source: 'thomson'}},
                    ]
                },
                {
                    key: 'altmetric',
                    values: [
                        {rek_pid: 'UQ:1234', rek_title: 'Title', rek_description: 'Description', rek_formatted_abstract: 'Abstract', metricData: {rek_pid: "UQ:1234", source: 'altmetric'}},
                    ]
                }
            ];
            trendingPublicationsMiddleware()(next)({type: 'TRENDING_PUBLICATIONS_LOADED', payload: payload});

            expect(next).toBeCalledWith(expect.objectContaining({
                "payload": expectedPayload,
                "type": "TRENDING_PUBLICATIONS_LOADED"
            }));
        });

        it('should not touch list of publications for actions other than TRENDING_PUBLICATIONS_LOADED action type', () => {
            const payload = {
                total: 2,
                data: [
                    {rek_pid: 'UQ:1234', rek_title: 'Title', rek_description: 'Description', rek_formatted_abstract: 'Abstract'},
                    {rek_pid: 'UQ:1235', rek_title: 'Title', rek_description: 'Description', rek_formatted_abstract: 'Abstract'}
                ]
            };

            const next = jest.fn();

            trendingPublicationsMiddleware()(next)({type: 'LATEST_PUBLICATIONS_LOADED', payload: payload});

            expect(next).toBeCalledWith(expect.objectContaining({
                "payload": payload,
                "type": "LATEST_PUBLICATIONS_LOADED"
            }));
        })
    });
});
