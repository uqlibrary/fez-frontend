import React from 'react';
import * as transformers from './academicDataTransformers';
import {APP_URL} from 'config';

describe('Academic data transformers ', () => {
    describe('getPublicationsPerType test', () => {
        it('should return number of publications per type', () => {
            const data = [
                {
                    "count": 22,
                    "field": "date_year_t",
                    "value": "2004",
                    "pivot": [
                        {
                            "count": 19,
                            "field": "display_type_i_lookup_exact",
                            "value": "Journal Article"
                        },
                        {
                            "count": 2,
                            "field": "display_type_i_lookup_exact",
                            "value": "Book Chapter"
                        },
                        {
                            "count": 1,
                            "field": "display_type_i_lookup_exact",
                            "value": "Conference Paper"
                        }
                    ]
                },
                {
                    "count": 15,
                    "field": "date_year_t",
                    "value": "1999",
                    "pivot": [
                        {
                            "count": 10,
                            "field": "display_type_i_lookup_exact",
                            "value": "Journal Article"
                        },
                        {
                            "count": 4,
                            "field": "display_type_i_lookup_exact",
                            "value": "Book Chapter"
                        },
                        {
                            "count": 1,
                            "field": "display_type_i_lookup_exact",
                            "value": "Book"
                        }
                    ]
                }
            ];
            const expected = [
                ['Journal Article', 29], ['Book Chapter', 6], ['Conference Paper', 1], ['Book', 1]
            ];
            const result = transformers.getPublicationsPerType(data);
            expect(result).toEqual(expected);
        });

        it('should return number of publications per type keep 2 & sum others', () => {
            const data = [
                {
                    "count": 22,
                    "field": "date_year_t",
                    "value": "2004",
                    "pivot": [
                        {
                            "count": 19,
                            "field": "display_type_i_lookup_exact",
                            "value": "Journal Article"
                        },
                        {
                            "count": 2,
                            "field": "display_type_i_lookup_exact",
                            "value": "Book Chapter"
                        },
                        {
                            "count": 1,
                            "field": "display_type_i_lookup_exact",
                            "value": "Conference Paper"
                        }
                    ]
                },
                {
                    "count": 15,
                    "field": "date_year_t",
                    "value": "1999",
                    "pivot": [
                        {
                            "count": 10,
                            "field": "display_type_i_lookup_exact",
                            "value": "Journal Article"
                        },
                        {
                            "count": 4,
                            "field": "display_type_i_lookup_exact",
                            "value": "Book Chapter"
                        },
                        {
                            "count": 1,
                            "field": "display_type_i_lookup_exact",
                            "value": "Book"
                        }
                    ]
                }
            ];
            const expected = [
                ['Journal Article', 29], ['Book Chapter', 6], ['Other', 2]
            ];
            const result = transformers.getPublicationsPerType(data, 2);
            expect(result).toEqual(expected);
        });

        it('should return number of publications per type correctly sorted', () => {
            const data = [
                {
                    "count": 15,
                    "field": "date_year_t",
                    "value": "1999",
                    "pivot": [
                        {
                            "count": 4,
                            "field": "display_type_i_lookup_exact",
                            "value": "Book Chapter"
                        },
                        {
                            "count": 1,
                            "field": "display_type_i_lookup_exact",
                            "value": "Book"
                        },
                        {
                            "count": 10,
                            "field": "display_type_i_lookup_exact",
                            "value": "Journal Article"
                        }
                    ]
                },
                {
                    "count": 22,
                    "field": "date_year_t",
                    "value": "2004",
                    "pivot": [
                        {
                            "count": 19,
                            "field": "display_type_i_lookup_exact",
                            "value": "Journal Article"
                        },
                        {
                            "count": 2,
                            "field": "display_type_i_lookup_exact",
                            "value": "Book Chapter"
                        },
                        {
                            "count": 1,
                            "field": "display_type_i_lookup_exact",
                            "value": "Conference Paper"
                        }
                    ]
                }
            ];
            const expected = [
                ['Journal Article', 29], ['Book Chapter', 6], ['Book', 1], ['Other', 1]
            ];
            const result = transformers.getPublicationsPerType(data, 3);
            expect(result).toEqual(expected);
        });
    });

    describe('getPublicationsPerYearCategories test', () => {
        it('should return publications per year categories', () => {
            const data = [
                {
                    "count": 22,
                    "field": "date_year_t",
                    "value": "2004",
                    "pivot": [
                        {
                            "count": 19,
                            "field": "display_type_i_lookup_exact",
                            "value": "Journal Article"
                        },
                        {
                            "count": 2,
                            "field": "display_type_i_lookup_exact",
                            "value": "Book Chapter"
                        },
                        {
                            "count": 1,
                            "field": "display_type_i_lookup_exact",
                            "value": "Conference Paper"
                        }
                    ]
                },
                {
                    "count": 15,
                    "field": "date_year_t",
                    "value": "1999",
                    "pivot": [
                        {
                            "count": 10,
                            "field": "display_type_i_lookup_exact",
                            "value": "Journal Article"
                        },
                        {
                            "count": 4,
                            "field": "display_type_i_lookup_exact",
                            "value": "Book Chapter"
                        },
                        {
                            "count": 1,
                            "field": "display_type_i_lookup_exact",
                            "value": "Book"
                        }
                    ]
                }
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
                    "count": 22,
                    "field": "date_year_t",
                    "value": "2004",
                    "pivot": [
                        {
                            "count": 19,
                            "field": "display_type_i_lookup_exact",
                            "value": "Journal Article"
                        },
                        {
                            "count": 2,
                            "field": "display_type_i_lookup_exact",
                            "value": "Book Chapter"
                        },
                        {
                            "count": 1,
                            "field": "display_type_i_lookup_exact",
                            "value": "Conference Paper"
                        }
                    ]
                },
                {
                    "count": 15,
                    "field": "date_year_t",
                    "value": "1999",
                    "pivot": [
                        {
                            "count": 10,
                            "field": "display_type_i_lookup_exact",
                            "value": "Journal Article"
                        },
                        {
                            "count": 4,
                            "field": "display_type_i_lookup_exact",
                            "value": "Book Chapter"
                        },
                        {
                            "count": 1,
                            "field": "display_type_i_lookup_exact",
                            "value": "Book"
                        }
                    ]
                }
            ];
            const topPublications = [
                ['Journal Article', 29], ['Book Chapter', 6], ['Conference Paper', 1], ['Book', 1]
            ];
            const expected = [
                {
                    name: 'Journal Article',
                    data: [10, 19]
                },
                {
                    name: 'Book Chapter',
                    data: [4, 2]
                },
                {
                    name: 'Conference Paper',
                    data: [0, 1]
                },
                {
                    name: 'Book',
                    data: [1, 0]
                }
            ];
            const result = transformers.getPublicationsPerYearSeries(data, topPublications);
            expect(result).toEqual(expected);
        });

        it('should return number of publications per year series 2 as top publications & others', () => {
            const data = [
                {
                    "count": 22,
                    "field": "date_year_t",
                    "value": "2004",
                    "pivot": [
                        {
                            "count": 19,
                            "field": "display_type_i_lookup_exact",
                            "value": "Journal Article"
                        },
                        {
                            "count": 2,
                            "field": "display_type_i_lookup_exact",
                            "value": "Book Chapter"
                        },
                        {
                            "count": 1,
                            "field": "display_type_i_lookup_exact",
                            "value": "Conference Paper"
                        }
                    ]
                },
                {
                    "count": 15,
                    "field": "date_year_t",
                    "value": "1999",
                    "pivot": [
                        {
                            "count": 10,
                            "field": "display_type_i_lookup_exact",
                            "value": "Journal Article"
                        },
                        {
                            "count": 4,
                            "field": "display_type_i_lookup_exact",
                            "value": "Book Chapter"
                        },
                        {
                            "count": 1,
                            "field": "display_type_i_lookup_exact",
                            "value": "Book"
                        }
                    ]
                }
            ];
            const topPublications = [
                ['Journal Article', 29], ['Book Chapter', 6], ['Other', 2]
            ];
            const expected = [
                {
                    name: 'Journal Article',
                    data: [10, 19]
                },
                {
                    name: 'Book Chapter',
                    data: [4, 2]
                },
                {
                    name: 'Other',
                    data: [1, 1]
                }
            ];
            const result = transformers.getPublicationsPerYearSeries(data, topPublications);
            expect(result).toEqual(expected);
        });
    });

    /*
    describe('getPublicationsStats', () => {

    });
    */
});
