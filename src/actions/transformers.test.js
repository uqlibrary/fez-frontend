import * as transformers from './transformers';
import {
    CONTENT_INDICATORS,
    contentIndicators,
    PLACEHOLDER_ISO8601_DATE,
    PUBLICATION_TYPE_CONFERENCE_PAPER,
    SENSITIVE_HANDLING_NOTE_OTHER_TYPE,
    SENSITIVE_HANDLING_NOTE_TYPE,
} from 'config/general';
import { FILE_SECURITY_POLICY_ADMIN, FILE_SECURITY_POLICY_PUBLIC } from 'modules/SharedComponents/Toolbox/FileUploader';

const moment = require('moment');

describe('transformers', () => {
    describe('getRecordDoiSearchKey test', () => {
        it('should return null with no doi data', () => {
            expect(transformers.getRecordDoiSearchKey({})).toEqual(null);
            expect(transformers.getRecordDoiSearchKey({ fez_record_search_key_doi: {} })).toEqual(null);
            expect(transformers.getRecordDoiSearchKey({ fez_record_search_key_doi: { rek_doi: '' } })).toEqual(null);
        });

        it('should return request object structure with sanitised doi', () => {
            const data = {
                fez_record_search_key_doi: {
                    rek_doi: 'https://doi.org/10.1007/s13596-023-00679-133333',
                },
            };
            const expected = {
                fez_record_search_key_doi: {
                    rek_doi: '10.1007/s13596-023-00679-133333',
                },
            };
            const result = transformers.getRecordDoiSearchKey(data);
            expect(result).toEqual(expected);
        });
    });

    describe('getRecordLinkSearchKey test', () => {
        it('should return request object structure with link and default description', () => {
            const data = {
                rek_link: 'http://google.com',
            };
            const expected = {
                fez_record_search_key_link: [
                    {
                        rek_link: 'http://google.com',
                        rek_link_order: 1,
                    },
                ],
                fez_record_search_key_link_description: [
                    {
                        rek_link_description: 'Link to work',
                        rek_link_description_order: 1,
                    },
                ],
            };
            const result = transformers.getRecordLinkSearchKey(data);
            expect(result).toEqual(expected);
        });

        it('should return request object structure with link and description', () => {
            const data = {
                rek_link: 'http://google.com',
                rek_link_description: 'my link title',
            };
            const expected = {
                fez_record_search_key_link: [
                    {
                        rek_link: 'http://google.com',
                        rek_link_order: 1,
                    },
                ],
                fez_record_search_key_link_description: [
                    {
                        rek_link_description: 'my link title',
                        rek_link_description_order: 1,
                    },
                ],
            };
            const result = transformers.getRecordLinkSearchKey(data);
            expect(result).toEqual(expected);
        });

        it('should return empty object structure with description on missing link', () => {
            const data = {
                rek_link_description: 'my link title',
            };
            const expected = null;
            const result = transformers.getRecordLinkSearchKey(data);
            expect(result).toEqual(expected);
        });

        it('should return empty request object structure if no link is provided', () => {
            const data = {};
            const expected = null;
            const result = transformers.getRecordLinkSearchKey(data);
            expect(result).toEqual(expected);
        });
    });

    describe('getRecordAlternateIdentifierSearchKey test', () => {
        it('should return request object structure with alternate identifier and identifier type', () => {
            const data = [
                {
                    rek_value: { key: 'id', value: '111' },
                    rek_order: 1,
                },
                {
                    rek_value: { key: 'id2', value: null },
                    rek_order: 2,
                },
            ];
            const expected = {
                fez_record_search_key_alternate_identifier: [
                    {
                        rek_alternate_identifier: 'id',
                        rek_alternate_identifier_order: 1,
                    },
                    {
                        rek_alternate_identifier: 'id2',
                        rek_alternate_identifier_order: 2,
                    },
                ],
                fez_record_search_key_alternate_identifier_type: [
                    {
                        rek_alternate_identifier_type: '111',
                        rek_alternate_identifier_type_order: 1,
                    },
                ],
            };

            expect(transformers.getAlternateIdentifierSearchKeys(data)).toEqual(expected);
        });

        it('should return empty object structure with missing alternate identifier', () => {
            expect(transformers.getAlternateIdentifierSearchKeys([])).toEqual({});
        });

        it('should return empty request object structure if no link is provided', () => {
            const data = {};
            const expected = null;
            const result = transformers.getRecordLinkSearchKey(data);
            expect(result).toEqual(expected);
        });
    });

    describe('getRecordAuthorExternalIdentifierSearchKey test', () => {
        it('should return request object structure with external identifiers', () => {
            const data = [
                {
                    externalIdentifier: 'ext id',
                    externalIdentifierType: '111',
                },
                {
                    externalIdentifier: 'ext id 2',
                },
                {
                    externalIdentifierType: '222',
                },
            ];
            const expected = {
                fez_record_search_key_author_identifier: [
                    {
                        rek_author_identifier: 'ext id',
                        rek_author_identifier_order: 1,
                    },
                ],
                fez_record_search_key_author_identifier_type: [
                    {
                        rek_author_identifier_type: '111',
                        rek_author_identifier_type_order: 1,
                    },
                ],
            };
            const result = transformers.getRecordAuthorsExternalIdSearchKey(data);
            expect(result).toEqual(expected);
        });

        it('should return empty request object structure if no external id is provided', () => {
            const data = [];
            const expected = {
                fez_record_search_key_author_identifier: [],
                fez_record_search_key_author_identifier_type: [],
            };
            const result = transformers.getRecordAuthorsExternalIdSearchKey(data);
            expect(result).toEqual(expected);
        });
    });

    describe('getCollectionsOnRecordWithSecurity', () => {
        it('should retrieve security policy of existing collections from search key', () => {
            const record = {
                rek_pid: 'UQ:0a963e6',
                collections: [
                    {
                        rek_pid: 'UQ:275689',
                        rek_title: 'UQ Library - Digitised Materials - Out of Print - UQ Staff and Students Only',
                        id: 'UQ:275689',
                        value: 'UQ Library - Digitised Materials - Out of Print - UQ Staff and Students Only',
                    },
                    {
                        rek_datastream_policy: 5,
                        rek_display_type_lookup: 'Collection',
                        rek_pid: 'UQ:120743',
                        rek_security_inherited: 0,
                        rek_security_policy: 5,
                        rek_title: '16th Australasian Fluid Mechanics Conference',
                    },
                ],
                fez_record_search_key_ismemberof: [
                    {
                        rek_ismemberof_id: 12704305,
                        rek_ismemberof_pid: 'UQ:0a963e6',
                        rek_ismemberof_xsdmf_id: null,
                        rek_ismemberof: 'UQ:275689',
                        rek_ismemberof_order: 1,
                        parent: {
                            rek_pid: 'UQ:275689',
                            rek_security_policy: 5,
                            rek_datastream_policy: 4,
                        },
                        rek_ismemberof_lookup:
                            'UQ Library - Digitised Materials - Out of Print - UQ Staff and Students Only',
                    },
                ],
            };
            const expected = [
                {
                    rek_pid: 'UQ:275689',
                    rek_title: 'UQ Library - Digitised Materials - Out of Print - UQ Staff and Students Only',
                    id: 'UQ:275689',
                    value: 'UQ Library - Digitised Materials - Out of Print - UQ Staff and Students Only',
                    rek_security_policy: 5,
                    rek_datastream_policy: 4,
                },
                {
                    rek_datastream_policy: 5,
                    rek_display_type_lookup: 'Collection',
                    rek_pid: 'UQ:120743',
                    rek_security_inherited: 0,
                    rek_security_policy: 5,
                    rek_title: '16th Australasian Fluid Mechanics Conference',
                },
            ];
            expect(transformers.getCollectionsOnRecordWithSecurity(record)).toEqual(expected);
        });

        it('should handle empty list of collections', () => {
            expect(transformers.getCollectionsOnRecordWithSecurity({ rek_pid: 'UQ:275689' })).toEqual([]);
        });
    });

    describe('getRecordRelatedServiceSearchKeys test', () => {
        it('should return request object structure with related service and related service description', () => {
            const data = {
                relatedServices: [
                    {
                        relatedServiceId: 'id',
                        relatedServiceDesc: 'desc',
                    },
                ],
            };
            const expected = {
                fez_record_search_key_related_service: [
                    {
                        rek_related_service: 'id',
                        rek_related_service_order: 1,
                    },
                ],
                fez_record_search_key_related_service_description: [
                    {
                        rek_related_service_description: 'desc',
                        rek_related_service_description_order: 1,
                    },
                ],
            };

            expect(transformers.getRelatedServiceSectionSearchKeys(data)).toEqual(expected);
        });

        it('should return request object structure with related service and empty related service description', () => {
            const data = {
                relatedServices: [
                    {
                        relatedServiceId: 'id',
                        relatedServiceDesc: '',
                    },
                ],
            };
            const expected = {
                fez_record_search_key_related_service: [
                    {
                        rek_related_service: 'id',
                        rek_related_service_order: 1,
                    },
                ],
                fez_record_search_key_related_service_description: [],
            };

            expect(transformers.getRelatedServiceSectionSearchKeys(data)).toEqual(expected);
        });

        it('should handle empty related service', () => {
            const data = { relatedServices: [] };
            const expected = {
                fez_record_search_key_related_service: [],
                fez_record_search_key_related_service_description: [],
            };

            expect(transformers.getRelatedServiceSectionSearchKeys(data)).toEqual(expected);
        });

        it('should handle undefined related service', () => {
            expect(transformers.getRelatedServiceSectionSearchKeys({})).toEqual({});
        });
    });

    describe('getRecordFileAttachmentSearchKey test', () => {
        const MockDate = require('mockdate');

        beforeEach(() => {
            MockDate.set('2018-01-01T00:00:00.000Z', 10);
        });

        afterEach(() => {
            MockDate.reset();
        });

        it('should return empty request object structure if no files are provided', () => {
            expect(transformers.getRecordFileAttachmentSearchKey([], {})).toEqual({});
        });

        it('should return request object structure for files with various open access status', () => {
            const files = [
                {
                    access_condition_id: 5, // open access, should stay open
                    name: 'file1.txt',
                    date: moment()
                        .clone()
                        .format('YYYY-MM-DD'), // today
                },
                {
                    access_condition_id: 5, // open access, should be closed 'cause in the future
                    name: 'file2.txt',
                    date: moment()
                        .clone()
                        .add(30, 'days')
                        .format('YYYY-MM-DD'), // future
                },
                {
                    access_condition_id: 5, // open access, should stay open 'cause in the past
                    name: 'file3.txt',
                    date: moment()
                        .clone()
                        .add(-30, 'days')
                        .format('YYYY-MM-DD'), // past
                },
                {
                    access_condition_id: 1, // closed access, should stay closed
                    name: 'file4.txt',
                },
            ];

            const record = null;
            const expected = {
                fez_record_search_key_file_attachment_name: [
                    {
                        rek_file_attachment_name: 'file1.txt',
                        rek_file_attachment_name_order: 1,
                    },
                    {
                        rek_file_attachment_name: 'file2.txt',
                        rek_file_attachment_name_order: 2,
                    },
                    {
                        rek_file_attachment_name: 'file3.txt',
                        rek_file_attachment_name_order: 3,
                    },
                    {
                        rek_file_attachment_name: 'file4.txt',
                        rek_file_attachment_name_order: 4,
                    },
                ],
                fez_record_search_key_file_attachment_security_policy: [],
                fez_record_search_key_file_attachment_embargo_date: [
                    {
                        rek_file_attachment_embargo_date: '2018-01-31',
                        rek_file_attachment_embargo_date_order: 2,
                    },
                    {
                        rek_file_attachment_embargo_date: '2017-12-02',
                        rek_file_attachment_embargo_date_order: 3,
                    },
                ],
                fez_record_search_key_file_attachment_access_condition: [
                    {
                        rek_file_attachment_access_condition: 5,
                        rek_file_attachment_access_condition_order: 1,
                    },
                    {
                        rek_file_attachment_access_condition: 1,
                        rek_file_attachment_access_condition_order: 2,
                    },
                    {
                        rek_file_attachment_access_condition: 5,
                        rek_file_attachment_access_condition_order: 3,
                    },
                    {
                        rek_file_attachment_access_condition: 1,
                        rek_file_attachment_access_condition_order: 4,
                    },
                ],
            };
            const result = transformers.getRecordFileAttachmentSearchKey(files, record);
            expect(result).toEqual(expected);
        });

        it('should return request object structure for files with various security policies', () => {
            const files = [
                {
                    security_policy: FILE_SECURITY_POLICY_PUBLIC, // Public access
                    name: 'file1.txt',
                    date: moment()
                        .clone()
                        .format('YYYY-MM-DD'), // today
                },
                {
                    security_policy: FILE_SECURITY_POLICY_PUBLIC, // Public access, should revert to admin
                    name: 'file2.txt',
                    date: moment()
                        .clone()
                        .add(30, 'days')
                        .format('YYYY-MM-DD'), // future
                },
                {
                    security_policy: FILE_SECURITY_POLICY_PUBLIC, // Public access
                    name: 'file3.txt',
                    date: moment()
                        .clone()
                        .add(-30, 'days')
                        .format('YYYY-MM-DD'), // past
                },
                {
                    security_policy: FILE_SECURITY_POLICY_ADMIN, // closed access
                    name: 'file4.txt',
                },
            ];
            const record = null;
            const expected = {
                fez_record_search_key_file_attachment_name: [
                    {
                        rek_file_attachment_name: 'file1.txt',
                        rek_file_attachment_name_order: 1,
                    },
                    {
                        rek_file_attachment_name: 'file2.txt',
                        rek_file_attachment_name_order: 2,
                    },
                    {
                        rek_file_attachment_name: 'file3.txt',
                        rek_file_attachment_name_order: 3,
                    },
                    {
                        rek_file_attachment_name: 'file4.txt',
                        rek_file_attachment_name_order: 4,
                    },
                ],
                fez_record_search_key_file_attachment_security_policy: [
                    {
                        rek_file_attachment_security_policy: 5,
                        rek_file_attachment_security_policy_order: 1,
                    },
                    {
                        rek_file_attachment_security_policy: 1,
                        rek_file_attachment_security_policy_order: 2,
                    },
                    {
                        rek_file_attachment_security_policy: 5,
                        rek_file_attachment_security_policy_order: 3,
                    },
                    {
                        rek_file_attachment_security_policy: 1,
                        rek_file_attachment_security_policy_order: 4,
                    },
                ],
                fez_record_search_key_file_attachment_embargo_date: [
                    {
                        rek_file_attachment_embargo_date: '2018-01-31',
                        rek_file_attachment_embargo_date_order: 2,
                    },
                    {
                        rek_file_attachment_embargo_date: '2017-12-02',
                        rek_file_attachment_embargo_date_order: 3,
                    },
                ],
                fez_record_search_key_file_attachment_access_condition: [],
            };
            const result = transformers.getRecordFileAttachmentSearchKey(files, record);
            expect(result).toEqual(expected);
        });

        it('should return request object structure for files no access id', () => {
            const files = [
                {
                    name: 'file.txt',
                },
                {
                    name: 'file2.txt',
                },
            ];

            const record = null;
            const expected = {
                fez_record_search_key_file_attachment_name: [
                    {
                        rek_file_attachment_name: 'file.txt',
                        rek_file_attachment_name_order: 1,
                    },
                    {
                        rek_file_attachment_name: 'file2.txt',
                        rek_file_attachment_name_order: 2,
                    },
                ],
                fez_record_search_key_file_attachment_security_policy: [],
                fez_record_search_key_file_attachment_embargo_date: [],
                fez_record_search_key_file_attachment_access_condition: [],
            };
            const result = transformers.getRecordFileAttachmentSearchKey(files, record);
            expect(result).toEqual(expected);
        });

        it('should return request object structure for files with inherit most secure policy from collection', () => {
            const files = [
                {
                    name: 'file.txt',
                    access_condition_id: 99,
                },
                {
                    name: 'file2.txt',
                    access_condition_id: 5,
                },
            ];

            const record = { collections: [{ rek_datastream_policy: 4 }, { rek_datastream_policy: 5 }] };
            const expected = {
                fez_record_search_key_file_attachment_name: [
                    {
                        rek_file_attachment_name: 'file.txt',
                        rek_file_attachment_name_order: 1,
                    },
                    {
                        rek_file_attachment_name: 'file2.txt',
                        rek_file_attachment_name_order: 2,
                    },
                ],
                fez_record_search_key_file_attachment_security_policy: [],
                fez_record_search_key_file_attachment_embargo_date: [],
                fez_record_search_key_file_attachment_access_condition: [
                    {
                        rek_file_attachment_access_condition: 4,
                        rek_file_attachment_access_condition_order: 1,
                    },
                    {
                        rek_file_attachment_access_condition: 5,
                        rek_file_attachment_access_condition_order: 2,
                    },
                ],
            };
            const result = transformers.getRecordFileAttachmentSearchKey(files, record);
            expect(result).toEqual(expected);
        });

        it('should return request object structure for files and empty record', () => {
            const files = [
                {
                    access_condition_id: 1,
                    name: 'file.txt',
                    date: '2017-10-01',
                },
                {
                    access_condition_id: 2,
                    name: 'file2.txt',
                },
            ];

            const record = {
                fez_record_search_key_file_attachment_access_condition: [],
                fez_record_search_key_file_attachment_embargo_date: [],
                fez_record_search_key_file_attachment_name: [],
            };
            const expected = {
                fez_record_search_key_file_attachment_name: [
                    {
                        rek_file_attachment_name: 'file.txt',
                        rek_file_attachment_name_order: 1,
                    },
                    {
                        rek_file_attachment_name: 'file2.txt',
                        rek_file_attachment_name_order: 2,
                    },
                ],
                fez_record_search_key_file_attachment_security_policy: [],
                fez_record_search_key_file_attachment_embargo_date: [
                    {
                        rek_file_attachment_embargo_date: '2017-10-01',
                        rek_file_attachment_embargo_date_order: 1,
                    },
                ],
                fez_record_search_key_file_attachment_access_condition: [
                    {
                        rek_file_attachment_access_condition: 1,
                        rek_file_attachment_access_condition_order: 1,
                    },
                    {
                        rek_file_attachment_access_condition: 2,
                        rek_file_attachment_access_condition_order: 2,
                    },
                ],
            };
            const result = transformers.getRecordFileAttachmentSearchKey(files, record);
            expect(result).toEqual(expected);
        });

        it('should return request object structure for files and existing files in record', () => {
            const files = [
                {
                    access_condition_id: 1,
                    name: 'file.txt',
                    date: moment()
                        .clone()
                        .format('YYYY-MM-DD'), // today
                },
                {
                    access_condition_id: 2,
                    name: 'file2.txt',
                },
            ];

            const record = {
                fez_record_search_key_file_attachment_access_condition: [],
                fez_record_search_key_file_attachment_embargo_date: [],
                fez_record_search_key_file_attachment_name: [
                    {
                        rek_file_attachment_name_id: null,
                        rek_file_attachment_name_pid: 'UQ:676287',
                        rek_file_attachment_name: 'FezACML_UQ676287_OA.pdf.xml',
                        rek_file_attachment_name_order: 1,
                    },
                ],
            };
            const expected = {
                fez_record_search_key_file_attachment_name: [
                    {
                        rek_file_attachment_name_id: null,
                        rek_file_attachment_name_pid: 'UQ:676287',
                        rek_file_attachment_name: 'FezACML_UQ676287_OA.pdf.xml',
                        rek_file_attachment_name_order: 1,
                    },
                    {
                        rek_file_attachment_name: 'file.txt',
                        rek_file_attachment_name_order: 2,
                    },
                    {
                        rek_file_attachment_name: 'file2.txt',
                        rek_file_attachment_name_order: 3,
                    },
                ],
                fez_record_search_key_file_attachment_security_policy: [],
                fez_record_search_key_file_attachment_embargo_date: [],
                fez_record_search_key_file_attachment_access_condition: [
                    {
                        rek_file_attachment_access_condition: 1,
                        rek_file_attachment_access_condition_order: 2,
                    },
                    {
                        rek_file_attachment_access_condition: 2,
                        rek_file_attachment_access_condition_order: 3,
                    },
                ],
            };
            const result = transformers.getRecordFileAttachmentSearchKey(files, record);
            expect(result).toEqual(expected);
        });
    });

    describe('getIssueValues test', () => {
        const input = {
            comments: 'test1',
            rek_link: 'test2',
            files: {
                queue: [{ name: 'file1.txt' }, { name: 'file2.txt' }],
            },
            contentIndicators: contentIndicators().map(item => item.value),
        };
        const expected = {
            comments: 'test1',
            link: 'test2',
            files: 'file1.txt, file2.txt',
            contentIndicators: contentIndicators()
                .map(item => item.text)
                .join('; '),
        };
        expect(transformers.getIssueValues(input)).toEqual(expected);
    });

    describe('getIssueValues test for conference paper', () => {
        const input = {
            comments: 'test1',
            rek_link: 'test2',
            files: {
                queue: [{ name: 'file1.txt' }, { name: 'file2.txt' }],
            },
            publication: {
                rek_display_type: PUBLICATION_TYPE_CONFERENCE_PAPER,
            },
            contentIndicators: contentIndicators(PUBLICATION_TYPE_CONFERENCE_PAPER).map(item => item.value),
        };
        const expected = {
            comments: 'test1',
            link: 'test2',
            files: 'file1.txt, file2.txt',
            contentIndicators: contentIndicators(PUBLICATION_TYPE_CONFERENCE_PAPER)
                .map(item => item.text)
                .join('; '),
        };
        expect(transformers.getIssueValues(input)).toEqual(expected);
    });

    describe('getFixIssueRequest test', () => {
        const input = {
            publication: {},
            author: {},
        };

        input.publication.rek_pid = 'UQ:1111';
        input.author.aut_display_name = 'J. Smith';
        input.author.aut_org_username = 'uqjsmith';
        input.comments = 'Some comments...';
        input.rek_link = 'http://www.test.com';
        input.files = { queue: [{ name: '1.jpg' }, { name: '2.jpg' }] };
        input.contentIndicators = CONTENT_INDICATORS.map(item => item.value);

        it('should create issue request', () => {
            const expected = [
                'Added comments:',
                'Some comments...',
                'Added link:',
                'http://www.test.com',
                'Added files:',
                '1.jpg, 2.jpg',
                'Selected Content Indicator(s):',
                `${CONTENT_INDICATORS.map(item => item.text).join('; ')}`,
            ];

            const result = transformers.getFixIssueRequest(input);
            expected.map(item => {
                expect(result.issue).toContain(item);
            });

            const result2 = transformers.getFixIssueRequest({});
            expect(result2.issue).toEqual('');
        });

        it('should create expected issue request when content indicators exist already', () => {
            const input2 = {
                ...input,
                publication: {
                    fez_record_search_key_content_indicator: [{ rek_content_indicator: CONTENT_INDICATORS[0].value }],
                },
            };
            const newIndicators = [CONTENT_INDICATORS[1], CONTENT_INDICATORS[2]];
            const expected = [
                'Added comments:',
                'Some comments...',
                'Added link:',
                'http://www.test.com',
                'Added files:',
                '1.jpg, 2.jpg',
                'Selected Content Indicator(s):',
                `${newIndicators.map(item => item.text).join('; ')}`,
            ];

            const result = transformers.getFixIssueRequest(input2);
            expected.map(item => {
                expect(result.issue).toContain(item);
            });
        });
    });

    describe('getClaimIssueRequest test', () => {
        it('should create issue request', () => {
            const input = { publication: {}, author: {} };
            input.comments = 'Some comments...';
            input.contentIndicators = CONTENT_INDICATORS.map(item => item.value);
            input.files = { queue: [{ name: '1.jpg' }, { name: '2.jpg' }] };
            input.rek_link = 'http://www.test.com';

            const expected = [
                'Notes from creator of a claimed work:',
                'Some comments...',
                'Added files:',
                '1.jpg, 2.jpg',
                'Added link:',
                'http://www.test.com',
                'Selected Content Indicator(s):',
                `${CONTENT_INDICATORS.map(item => item.text).join('; ')}`,
            ];
            const result = transformers.getClaimIssueRequest(input);
            expected.map(item => {
                expect(result.issue).toContain(item);
            });

            const result2 = transformers.getClaimIssueRequest({});
            expect(result2.issue).toEqual('');
        });
    });

    describe('unclaimRecord[Author/Contributor]SearchKey test', () => {
        it('should return empty author id request object', () => {
            const input = [];
            const expected = {
                fez_record_search_key_author_id: [],
            };

            const result = transformers.unclaimRecordAuthorsIdSearchKey(input, 1001);
            expect(result).toEqual(expected);
        });

        it('should remove selected author from author id request object', () => {
            const input = [
                { rek_author_id: 0, rek_author_id_order: 1, rek_author_id_id: null, rek_author_id_pid: 'UQ:347818' },
                { rek_author_id: 1001, rek_author_id_order: 2, rek_author_id_id: null, rek_author_id_pid: 'UQ:347812' },
                { rek_author_id: 1002, rek_author_id_order: 3, rek_author_id_id: null, rek_author_id_pid: 'UQ:347813' },
                { rek_author_id: 0, rek_author_id_order: 4, rek_author_id_id: null, rek_author_id_pid: 'UQ:347814' },
            ];
            const expected = {
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 0,
                        rek_author_id_order: 1,
                        rek_author_id_id: null,
                        rek_author_id_pid: 'UQ:347818',
                    },
                    { rek_author_id: 0, rek_author_id_order: 2 },
                    {
                        rek_author_id: 1002,
                        rek_author_id_order: 3,
                        rek_author_id_id: null,
                        rek_author_id_pid: 'UQ:347813',
                    },
                    {
                        rek_author_id: 0,
                        rek_author_id_order: 4,
                        rek_author_id_id: null,
                        rek_author_id_pid: 'UQ:347814',
                    },
                ],
            };

            const result = transformers.unclaimRecordAuthorsIdSearchKey(input, 1001);
            expect(result).toEqual(expected);
        });

        it('should remove selected author from author id request object and update order if missing', () => {
            const input = [
                { rek_author_id: 0, rek_author_id_order: 1, rek_author_id_id: null, rek_author_id_pid: 'UQ:347818' },
                { rek_author_id: 1001, rek_author_id_id: null, rek_author_id_pid: 'UQ:347812' },
                { rek_author_id: 1002, rek_author_id_order: 3, rek_author_id_id: null, rek_author_id_pid: 'UQ:347813' },
                { rek_author_id: 0, rek_author_id_order: 4, rek_author_id_id: null, rek_author_id_pid: 'UQ:347814' },
            ];
            const expected = {
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 0,
                        rek_author_id_order: 1,
                        rek_author_id_id: null,
                        rek_author_id_pid: 'UQ:347818',
                    },
                    { rek_author_id: 0, rek_author_id_order: 2 },
                    {
                        rek_author_id: 1002,
                        rek_author_id_order: 3,
                        rek_author_id_id: null,
                        rek_author_id_pid: 'UQ:347813',
                    },
                    {
                        rek_author_id: 0,
                        rek_author_id_order: 4,
                        rek_author_id_id: null,
                        rek_author_id_pid: 'UQ:347814',
                    },
                ],
            };

            const result = transformers.unclaimRecordAuthorsIdSearchKey(input, 1001);
            expect(result).toEqual(expected);
        });

        it('should return empty contributor id request object', () => {
            const input = [];
            const expected = {
                fez_record_search_key_contributor_id: [],
            };

            const result = transformers.unclaimRecordContributorsIdSearchKey(input, 1001);
            expect(result).toEqual(expected);
        });

        it('should remove selected contributor from contributor id object', () => {
            const input = [
                {
                    rek_contributor_id: 0,
                    rek_contributor_id_order: 1,
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:347818',
                },
                {
                    rek_contributor_id: 1001,
                    rek_contributor_id_order: 2,
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:347812',
                },
                {
                    rek_contributor_id: 1002,
                    rek_contributor_id_order: 3,
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:347813',
                },
                {
                    rek_contributor_id: 0,
                    rek_contributor_id_order: 4,
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:347814',
                },
            ];
            const expected = {
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id: 0,
                        rek_contributor_id_order: 1,
                        rek_contributor_id_id: null,
                        rek_contributor_id_pid: 'UQ:347818',
                    },
                    { rek_contributor_id: 0, rek_contributor_id_order: 2 },
                    {
                        rek_contributor_id: 1002,
                        rek_contributor_id_order: 3,
                        rek_contributor_id_id: null,
                        rek_contributor_id_pid: 'UQ:347813',
                    },
                    {
                        rek_contributor_id: 0,
                        rek_contributor_id_order: 4,
                        rek_contributor_id_id: null,
                        rek_contributor_id_pid: 'UQ:347814',
                    },
                ],
            };
            const result = transformers.unclaimRecordContributorsIdSearchKey(input, 1001);
            expect(result).toEqual(expected);
        });

        it('should remove selected contributor from contributor id object and update order if missing', () => {
            const input = [
                {
                    rek_contributor_id: 0,
                    rek_contributor_id_order: 1,
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:347818',
                },
                { rek_contributor_id: 1001, rek_contributor_id_id: null, rek_contributor_id_pid: 'UQ:347812' },
                {
                    rek_contributor_id: 1002,
                    rek_contributor_id_order: 3,
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:347813',
                },
                {
                    rek_contributor_id: 0,
                    rek_contributor_id_order: 4,
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:347814',
                },
            ];
            const expected = {
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id: 0,
                        rek_contributor_id_order: 1,
                        rek_contributor_id_id: null,
                        rek_contributor_id_pid: 'UQ:347818',
                    },
                    { rek_contributor_id: 0, rek_contributor_id_order: 2 },
                    {
                        rek_contributor_id: 1002,
                        rek_contributor_id_order: 3,
                        rek_contributor_id_id: null,
                        rek_contributor_id_pid: 'UQ:347813',
                    },
                    {
                        rek_contributor_id: 0,
                        rek_contributor_id_order: 4,
                        rek_contributor_id_id: null,
                        rek_contributor_id_pid: 'UQ:347814',
                    },
                ],
            };
            const result = transformers.unclaimRecordContributorsIdSearchKey(input, 1001);
            expect(result).toEqual(expected);
        });
    });

    describe('getFeedbackRequest test', () => {
        const input = {
            acknowledgement: 'private',
            community: '',
            communityParticipant: 'false',
            contactNo: '',
            culturalInfo: { other: 'other', otherText: 'other info', ceremonies: 'ceremonies' },
            email: '',
            firstName: 'first name',
            isIcipHolder: 'true',
            indigenousIdentity: 'islander',
            hasKinshipConnection: 'false',
            lastName: 'last name',
            shareDetails: { anonymously: 'anonymously' },
            specialCare: { womenOnly: 'womenOnly', otherText: 'special care info' },
        };

        it('should create issue request', () => {
            const expected = {
                rfb_pid: 'UQ:1',
                rfb_acknowledgement: 'private',
                rfb_community_participant: 'false',
                rfb_cultural_info: ['other', 'ceremonies'],
                rfb_cultural_info_other: 'other info',
                rfb_first_name: 'first name',
                rfb_is_icip_holder: 'true',
                rfb_indigenous_identity: 'islander',
                rfb_has_kinship_connection: 'false',
                rfb_last_name: 'last name',
                rfb_share_details: ['anonymously'],
                rfb_special_care: ['womenOnly'],
            };

            const result = transformers.getFeedbackRecordData('UQ:1', input);
            expect(result).toEqual(expected);
        });
    });

    describe('getRecordSubjectSearchKey test', () => {
        it('should return empty subject object', () => {
            expect(transformers.getRecordSubjectSearchKey()).toEqual({});
        });

        it('should return subject list based on input', () => {
            const input = [
                { rek_order: 1, rek_value: { key: 451799, value: '01 Mathematical Sciences' } },
                { rek_order: 2, rek_value: { key: 451802, value: '0101 Mathematical Sciences' } },
                { rek_order: 3, rek_value: { key: 451801, value: '010101 Mathematical Sciences' } },
            ];
            const expected = {
                fez_record_search_key_subject: [
                    {
                        rek_subject: 451799,
                        rek_subject_order: 1,
                    },
                    {
                        rek_subject: 451802,
                        rek_subject_order: 2,
                    },
                    {
                        rek_subject: 451801,
                        rek_subject_order: 3,
                    },
                ],
            };
            const result = transformers.getRecordSubjectSearchKey(input);
            expect(result).toEqual(expected);
        });
    });

    describe('getSDGSearchKeys test', () => {
        it('should return empty subject object', () => {
            expect(transformers.getSDGSearchKeys()).toEqual({});
            expect(transformers.getSDGSearchKeys([])).toEqual({});
        });

        it('should return subject list based on input', () => {
            const input = [
                {
                    rek_order: 1,
                    rek_value: { key: 456998, value: 'Dimensions', sdgCVOId: 456995, group: '02 - Zero Hunger' },
                },
                {
                    rek_order: 2,
                    rek_value: { key: 456999, value: 'WOS', sdgCVOId: 456995, group: '02 - Zero Hunger' },
                },
                {
                    rek_order: 2,
                    rek_value: { key: 456996, value: 'Dimensions', sdgCVOId: 456994, group: '01 - No poverty' },
                },
            ];
            const expected = {
                fez_record_search_key_sdg: [
                    {
                        rek_sdg: 456994,
                        rek_sdg_order: 1,
                    },
                    {
                        rek_sdg: 456995,
                        rek_sdg_order: 2,
                    },
                ],
                fez_record_search_key_sdg_source: [
                    {
                        rek_sdg_source: 456996,
                        rek_sdg_source_order: 1,
                    },
                    {
                        rek_sdg_source: 456998,
                        rek_sdg_source_order: 2,
                    },
                    {
                        rek_sdg_source: 456999,
                        rek_sdg_source_order: 3,
                    },
                ],
            };
            const result = transformers.getSDGSearchKeys(input);
            expect(result).toEqual(expected);
        });
    });

    describe('getRecordSupervisorsSearchKey test', () => {
        it('should return empty supervisors object', () => {
            expect(transformers.getRecordSupervisorsSearchKey()).toEqual({});
        });

        it('should construct supervisor object from data', () => {
            const input = [
                { nameAsPublished: 'Smith A.', disabled: false, selected: false, authorId: null },
                { nameAsPublished: 'Smith B.', disabled: false, selected: true, authorId: null },
                { nameAsPublished: 'Smith C.', disabled: false, selected: false, authorId: null },
            ];
            const expected = {
                fez_record_search_key_supervisor: [
                    {
                        rek_supervisor: 'Smith A.',
                        rek_supervisor_order: 1,
                    },
                    {
                        rek_supervisor: 'Smith B.',
                        rek_supervisor_order: 2,
                    },
                    {
                        rek_supervisor: 'Smith C.',
                        rek_supervisor_order: 3,
                    },
                ],
            };
            const result = transformers.getRecordSupervisorsSearchKey(input);
            expect(result).toEqual(expected);
        });
    });

    describe('getRecordAuthorsSearchKey test', () => {
        it('should return empty request object', () => {
            expect(transformers.getRecordAuthorsSearchKey()).toEqual({
                fez_record_search_key_author: [],
            });
        });

        it('should return authors name object', () => {
            const input = [
                { nameAsPublished: 'Smith A.', disabled: false, selected: false, authorId: null },
                { nameAsPublished: 'Smith B.', disabled: false, selected: true, authorId: 100 },
                { nameAsPublished: 'Smith C.', disabled: false, selected: false, authorId: null },
            ];
            const expected = {
                fez_record_search_key_author: [
                    {
                        rek_author: 'Smith A.',
                        rek_author_order: 1,
                    },
                    {
                        rek_author: 'Smith B.',
                        rek_author_order: 2,
                    },
                    {
                        rek_author: 'Smith C.',
                        rek_author_order: 3,
                    },
                ],
            };
            const result = transformers.getRecordAuthorsSearchKey(input);
            expect(result).toEqual(expected);
        });
    });

    describe('getRecordAuthorsIdSearchKey test', () => {
        it('should return empty authors object', () => {
            expect(transformers.getRecordAuthorsIdSearchKey()).toEqual({
                fez_record_search_key_author_id: [],
            });
        });

        it('should return authors object from authors control data', () => {
            const input = [
                { nameAsPublished: 'Smith A.', disabled: false, selected: false, authorId: null },
                { nameAsPublished: 'Smith B.', disabled: false, selected: true, authorId: 100 },
                { nameAsPublished: 'Smith C.', disabled: false, selected: false, authorId: null },
                { nameAsPublished: 'Smith D.', disabled: false, selected: false, aut_id: 1001 },
            ];
            const expected = {
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 0,
                        rek_author_id_order: 1,
                    },
                    { rek_author_id: 100, rek_author_id_order: 2 },
                    {
                        rek_author_id: 0,
                        rek_author_id_order: 3,
                    },
                    { rek_author_id: 1001, rek_author_id_order: 4 },
                ],
            };
            const result = transformers.getRecordAuthorsIdSearchKey(input);
            expect(result).toEqual(expected);
        });

        it('should return authors object from original search key data format', () => {
            const input = [
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:678742', rek_author_id: 683, rek_author_id_order: 12 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:678741', rek_author_id: 0, rek_author_id_order: 13 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:678740', rek_author_id: 0, rek_author_id_order: 14 },
            ];
            const expected = {
                fez_record_search_key_author_id: [
                    {
                        rek_author_id_id: null,
                        rek_author_id_pid: 'UQ:678742',
                        rek_author_id: 683,
                        rek_author_id_order: 12,
                    },
                    {
                        rek_author_id_id: null,
                        rek_author_id_pid: 'UQ:678741',
                        rek_author_id: 0,
                        rek_author_id_order: 13,
                    },
                    {
                        rek_author_id_id: null,
                        rek_author_id_pid: 'UQ:678740',
                        rek_author_id: 0,
                        rek_author_id_order: 14,
                    },
                ],
            };
            const result = transformers.getRecordAuthorsIdSearchKey(input);
            expect(result).toEqual(expected);
        });

        it('should assign current user id as a solo author', () => {
            const authors = [];
            const defaultId = 1001;

            const expected = {
                fez_record_search_key_author_id: [{ rek_author_id: 1001, rek_author_id_order: 1 }],
            };
            const result = transformers.getRecordAuthorsIdSearchKey(authors, defaultId);
            expect(result).toEqual(expected);
        });
    });

    describe('getRecordContributorsSearchKey test', () => {
        it('should return empty contributors object', () => {
            expect(transformers.getRecordContributorsSearchKey()).toEqual({});
        });

        it('should return populated contributors object', () => {
            const input = [
                { nameAsPublished: 'Smith A.', disabled: false, selected: false, authorId: null },
                { nameAsPublished: 'Smith B.', disabled: false, selected: true, authorId: 100 },
                { nameAsPublished: 'Smith C.', disabled: false, selected: false, authorId: null },
            ];
            const expected = {
                fez_record_search_key_contributor: [
                    {
                        rek_contributor: 'Smith A.',
                        rek_contributor_order: 1,
                    },
                    {
                        rek_contributor: 'Smith B.',
                        rek_contributor_order: 2,
                    },
                    {
                        rek_contributor: 'Smith C.',
                        rek_contributor_order: 3,
                    },
                ],
            };
            const result = transformers.getRecordContributorsSearchKey(input);
            expect(result).toEqual(expected);
        });
    });

    describe('getRecordContributorsIdSearchKey test', () => {
        it('should return empty contributors request object', () => {
            expect(transformers.getRecordContributorsIdSearchKey()).toEqual({});
        });

        it('should construct contributors id object from component data', () => {
            const input = [
                { nameAsPublished: 'Smith A.', disabled: false, selected: false, authorId: null },
                { nameAsPublished: 'Smith B.', disabled: false, selected: true, authorId: 100 },
                { nameAsPublished: 'Smith C.', disabled: false, selected: false, authorId: null },
                { nameAsPublished: 'Smith D.', disabled: false, selected: false, aut_id: 1001 },
            ];
            const expected = {
                fez_record_search_key_contributor_id: [
                    { rek_contributor_id: 0, rek_contributor_id_order: 1 },
                    { rek_contributor_id: 100, rek_contributor_id_order: 2 },
                    { rek_contributor_id: 0, rek_contributor_id_order: 3 },
                    { rek_contributor_id: 1001, rek_contributor_id_order: 4 },
                ],
            };
            const result = transformers.getRecordContributorsIdSearchKey(input);
            expect(result).toEqual(expected);
        });

        it('should not modify contributors object for original data', () => {
            const input = [
                { rek_contributor_id: null, rek_contributor_id_order: 1 },
                { rek_contributor_id: 100, rek_contributor_id_order: 2 },
                { rek_contributor_id: null, rek_contributor_id_order: 3 },
                { rek_contributor_id: 1001, rek_contributor_id_order: 4 },
            ];
            const expected = {
                fez_record_search_key_contributor_id: [
                    { rek_contributor_id: null, rek_contributor_id_order: 1 },
                    { rek_contributor_id: 100, rek_contributor_id_order: 2 },
                    { rek_contributor_id: null, rek_contributor_id_order: 3 },
                    { rek_contributor_id: 1001, rek_contributor_id_order: 4 },
                ],
            };
            const result = transformers.getRecordContributorsIdSearchKey(input);
            expect(result).toEqual(expected);
        });

        it('should assign current user id as a solo contributor', () => {
            const authors = [];
            const defaultId = 1001;

            const expected = {
                fez_record_search_key_contributor_id: [{ rek_contributor_id: 1001, rek_contributor_id_order: 1 }],
            };
            const result = transformers.getRecordContributorsIdSearchKey(authors, defaultId);
            expect(result).toEqual(expected);
        });
    });

    describe('getAuthorIdentifierOrcidPatchRequest() ', () => {
        it('should return empty request', () => {
            const authorId = null;
            const orcidId = '1234-1234-1234';

            const expected = {};
            const result = transformers.getAuthorIdentifierOrcidPatchRequest(authorId, orcidId);
            expect(result).toEqual(expected);
        });

        it('should return orcid request', () => {
            const authorId = 4444;
            const orcidId = '1234-1234-1234';

            const expected = {
                aut_id: 4444,
                aut_orcid_id: '1234-1234-1234',
            };
            const result = transformers.getAuthorIdentifierOrcidPatchRequest(authorId, orcidId);
            expect(result).toEqual(expected);
        });

        it('should return orcid request with extra data', () => {
            const authorId = 4444;
            const orcidId = '1234-1234-1234';
            const data = {
                scope: 'one',
                expires_in: '1/1/2010',
                access_token: 'token',
            };

            const expected = {
                aut_id: 4444,
                aut_orcid_id: '1234-1234-1234',
                fez_author_identifier_user_grants: {
                    aig_details: 'token',
                    aig_expires: '1/1/2010',
                    aig_details_dump: '{"scope":"one","expires_in":"1/1/2010","access_token":"token"}',
                    aig_name: 'one',
                },
            };
            const result = transformers.getAuthorIdentifierOrcidPatchRequest(authorId, orcidId, data);
            expect(result).toEqual(expected);
        });
    });

    describe('getDatasetCreatorRolesSearchKey tests', () => {
        it('should return empty object', () => {
            expect(transformers.getDatasetCreatorRolesSearchKey()).toEqual({});
        });

        it('should return empty object in entry if creatorRole key is not set for it', () => {
            const input = [{ test: 'test1' }];
            const expected = {};
            expect(transformers.getDatasetCreatorRolesSearchKey(input)).toEqual(expected);
        });

        it('should return search key with data', () => {
            const input = [
                { creatorRole: 'Investigator' },
                { creatorRole: 'Software Developer' },
                { creatorRole: 'Co-investigator' },
            ];
            const expected = {
                fez_record_search_key_author_role: [
                    {
                        rek_author_role: 'Investigator',
                        rek_author_role_order: 1,
                    },
                    {
                        rek_author_role: 'Software Developer',
                        rek_author_role_order: 2,
                    },
                    {
                        rek_author_role: 'Co-investigator',
                        rek_author_role_order: 3,
                    },
                ],
            };
            const result = transformers.getDatasetCreatorRolesSearchKey(input);
            expect(result).toEqual(expected);

            expect(transformers.getDatasetCreatorRolesSearchKey([{}])).toEqual({});
        });
    });

    describe('getDatasetAuthorEmailsSearchKey tests', () => {
        it('should return empty object', () => {
            expect(transformers.getDatasetAuthorEmailsSearchKey()).toEqual({});
            expect(transformers.getDatasetAuthorEmailsSearchKey([{}])).toEqual({});
        });

        it('should return empty object in entry if email key is not set for it', () => {
            const input = [{ test: 'test1' }];
            const expected = {};
            expect(transformers.getDatasetAuthorEmailsSearchKey(input)).toEqual(expected);
        });

        it('should return search key with data', () => {
            const input = [{ email: 'author1@email.com' }, { email: '' }, { email: 'author3@email.com' }];
            const expected = {
                fez_record_search_key_author_email: [
                    {
                        rek_author_email: 'author1@email.com',
                        rek_author_email_order: 1,
                    },
                    {
                        rek_author_email: 'author3@email.com',
                        rek_author_email_order: 3,
                    },
                ],
            };
            const result = transformers.getDatasetAuthorEmailsSearchKey(input);
            expect(result).toEqual(expected);
        });
    });

    describe('getDatasetContactDetailSearchKeys tests', () => {
        it('should return empty object', () => {
            expect(transformers.getDatasetContactDetailSearchKeys()).toEqual({});
        });

        it('should return search key with data', () => {
            const input = {
                contactName: 'Test Contact',
                contactNameId: {
                    id: 121212,
                    value: 'Test, Contact',
                },
                contactEmail: 'test@test.com',
            };
            const expected = {
                fez_record_search_key_contributor: [
                    {
                        rek_contributor: 'Test Contact',
                        rek_contributor_order: 1,
                    },
                ],
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id: 121212,
                        rek_contributor_id_order: 1,
                    },
                ],
                fez_record_search_key_contact_details_email: [
                    {
                        rek_contact_details_email: 'test@test.com',
                        rek_contact_details_email_order: 1,
                    },
                ],
            };
            const result = transformers.getDatasetContactDetailSearchKeys(input);
            expect(result).toEqual(expected);
        });

        it('should return search key with data transformed correctly for api', () => {
            const input = {
                contactName: 'Test Contact',
                contactNameId: {
                    id: '121212',
                    value: 'Test, Contact',
                },
                contactEmail: 'test@test.com',
            };
            const expected = {
                fez_record_search_key_contributor: [
                    {
                        rek_contributor: 'Test Contact',
                        rek_contributor_order: 1,
                    },
                ],
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id: 121212,
                        rek_contributor_id_order: 1,
                    },
                ],
                fez_record_search_key_contact_details_email: [
                    {
                        rek_contact_details_email: 'test@test.com',
                        rek_contact_details_email_order: 1,
                    },
                ],
            };
            const result = transformers.getDatasetContactDetailSearchKeys(input);
            expect(result).toEqual(expected);
        });

        it('should return search key with data transformed correctly with id set to 0', () => {
            const input = {
                contactName: 'Test Contact',
                contactNameId: {
                    id: 'test',
                    value: 'Test, Contact',
                },
                contactEmail: 'test@test.com',
            };
            const expected = {
                fez_record_search_key_contributor: [
                    {
                        rek_contributor: 'Test Contact',
                        rek_contributor_order: 1,
                    },
                ],
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id: 0,
                        rek_contributor_id_order: 1,
                    },
                ],
                fez_record_search_key_contact_details_email: [
                    {
                        rek_contact_details_email: 'test@test.com',
                        rek_contact_details_email_order: 1,
                    },
                ],
            };
            const result = transformers.getDatasetContactDetailSearchKeys(input);
            expect(result).toEqual(expected);
        });

        it('should return search key with data transformed correctly with id set to 0 if contact ID is not entered', () => {
            const input = {
                contactName: 'Test Contact',
                contactEmail: 'test@test.com',
            };
            const expected = {
                fez_record_search_key_contributor: [
                    {
                        rek_contributor: 'Test Contact',
                        rek_contributor_order: 1,
                    },
                ],
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id: 0,
                        rek_contributor_id_order: 1,
                    },
                ],
                fez_record_search_key_contact_details_email: [
                    {
                        rek_contact_details_email: 'test@test.com',
                        rek_contact_details_email_order: 1,
                    },
                ],
            };
            const result = transformers.getDatasetContactDetailSearchKeys(input);
            expect(result).toEqual(expected);
        });
    });

    describe('getGeographicAreaSearchKey tests', () => {
        it('should return empty object', () => {
            expect(transformers.getGeographicAreaSearchKey()).toEqual({});
        });

        it('should return search key with data', () => {
            const input = '12.231112,-32.323323';
            const expected = {
                fez_record_search_key_geographic_area: [
                    {
                        rek_geographic_area: '12.231112,-32.323323',
                        rek_geographic_area_order: 1,
                    },
                ],
            };
            const result = transformers.getGeographicAreaSearchKey(input);
            expect(result).toEqual(expected);
        });
    });

    describe('getRecordAuthorAffiliationSearchKey tests', () => {
        it('should return an empty object', () => {
            expect(transformers.getRecordAuthorAffiliationSearchKey()).toEqual({
                fez_record_search_key_author_affiliation_country: [],
                fez_record_search_key_author_affiliation_full_address: [],
                fez_record_search_key_author_affiliation_name: [],
                fez_record_search_key_author_affiliation_id: [],
            });
        });

        it('should return search key with data', () => {
            const input = [
                {
                    value: 'Professor Del Mar, Christopher B. (mdcmar) ',
                    id: 553,
                    aut_id: 553,
                    aut_org_username: 'mdcmar',
                    aut_org_staff_id: '0002633',
                    aut_org_student_id: null,
                    aut_email: null,
                    aut_display_name: 'Del Mar, Christopher B.',
                    aut_fname: 'Christopher',
                    aut_mname: 'Bernard',
                    aut_lname: 'Del Mar',
                    aut_title: 'Professor',
                    aut_position: '',
                    aut_homepage_link: '',
                    aut_created_date: null,
                    aut_update_date: '2010-10-08',
                    aut_external_id: '0000041362',
                    aut_ref_num: '',
                    aut_researcher_id: null,
                    aut_scopus_id: '',
                    aut_mypub_url: '',
                    aut_rid_password: null,
                    aut_people_australia_id: null,
                    aut_description: null,
                    aut_orcid_id: null,
                    aut_google_scholar_id: null,
                    aut_rid_last_updated: null,
                    aut_publons_id: null,
                    aut_student_username: null,
                    nameAsPublished: 'Test user',
                    creatorRole: '',
                    affiliation: 'UQ',
                    orgaff: 'The University of Queensland',
                    orgtype: '',
                    disabled: true,
                    selected: false,
                    authorId: null,
                },
                {
                    nameAsPublished: 'Test user',
                    creatorRole: '',
                    affiliation: 'NotUQ',
                    orgaff: 'Test organisation',
                    orgtype: 453983,
                    disabled: false,
                    selected: true,
                    authorId: 410,
                },
                {
                    nameAsPublished: 'Another user',
                    creatorRole: '',
                    affiliation: 'NotUQ',
                    orgaff: 'Some Organisation',
                    orgtype: 453987,
                    disabled: false,
                    selected: false,
                    authorId: null,
                },
                {
                    value: 'Emeritus Professor Critchley, Christa (uqccritc) ',
                    id: 608,
                    aut_id: 608,
                    aut_org_username: 'uqccritc',
                    aut_org_staff_id: '0002876',
                    aut_org_student_id: null,
                    aut_email: null,
                    aut_display_name: 'Critchley, Christa',
                    aut_fname: 'Christa',
                    aut_mname: null,
                    aut_lname: 'Critchley',
                    aut_title: 'Emeritus Professor',
                    aut_position: null,
                    aut_homepage_link: null,
                    aut_created_date: null,
                    aut_update_date: '2010-01-18',
                    aut_external_id: '0000041476',
                    aut_ref_num: null,
                    aut_researcher_id: null,
                    aut_scopus_id: null,
                    aut_mypub_url: null,
                    aut_rid_password: null,
                    aut_people_australia_id: null,
                    aut_description: null,
                    aut_orcid_id: null,
                    aut_google_scholar_id: null,
                    aut_rid_last_updated: null,
                    aut_publons_id: null,
                    aut_student_username: null,
                    nameAsPublished: 'Some user',
                    creatorRole: '',
                    affiliation: 'UQ',
                    orgaff: 'The University of Queensland',
                    orgtype: '',
                    disabled: true,
                    selected: false,
                    authorId: null,
                },
            ];
            const expected = {
                fez_record_search_key_author_affiliation_name: [
                    {
                        rek_author_affiliation_name: 'The University of Queensland',
                        rek_author_affiliation_name_order: 1,
                    },
                    {
                        rek_author_affiliation_name: 'Test organisation',
                        rek_author_affiliation_name_order: 2,
                    },
                    {
                        rek_author_affiliation_name: 'Some Organisation',
                        rek_author_affiliation_name_order: 3,
                    },
                    {
                        rek_author_affiliation_name: 'The University of Queensland',
                        rek_author_affiliation_name_order: 4,
                    },
                ],
            };
            const result = transformers.getRecordAuthorAffiliationSearchKey(input);
            expect(result).toEqual(expected);
        });

        it('should return search key with data with affiliation empty for already linked authors', () => {
            const input = [
                {
                    value: 'Professor Del Mar, Christopher B. (mdcmar) ',
                    id: 553,
                    aut_id: 553,
                    aut_org_username: 'mdcmar',
                    aut_org_staff_id: '0002633',
                    aut_org_student_id: null,
                    aut_email: null,
                    aut_display_name: 'Del Mar, Christopher B.',
                    aut_fname: 'Christopher',
                    aut_mname: 'Bernard',
                    aut_lname: 'Del Mar',
                    aut_title: 'Professor',
                    aut_position: '',
                    aut_homepage_link: '',
                    aut_created_date: null,
                    aut_update_date: '2010-10-08',
                    aut_external_id: '0000041362',
                    aut_ref_num: '',
                    aut_researcher_id: null,
                    aut_scopus_id: '',
                    aut_mypub_url: '',
                    aut_rid_password: null,
                    aut_people_australia_id: null,
                    aut_description: null,
                    aut_orcid_id: null,
                    aut_google_scholar_id: null,
                    aut_rid_last_updated: null,
                    aut_publons_id: null,
                    aut_student_username: null,
                    nameAsPublished: 'Test user',
                    creatorRole: '',
                    affiliation: 'UQ',
                    orgaff: 'The University of Queensland',
                    orgtype: '',
                    disabled: true,
                    selected: false,
                    authorId: null,
                },
                {
                    nameAsPublished: 'Test user',
                    creatorRole: '',
                    affiliation: 'NotUQ',
                    orgaff: '',
                    orgtype: '',
                    disabled: false,
                    selected: true,
                    authorId: 410,
                },
                {
                    nameAsPublished: 'Another user',
                    creatorRole: '',
                    affiliation: 'NotUQ',
                    orgaff: '',
                    orgtype: '',
                    disabled: false,
                    selected: false,
                    authorId: null,
                },
                {
                    value: 'Emeritus Professor Critchley, Christa (uqccritc) ',
                    id: 608,
                    aut_id: 608,
                    aut_org_username: 'uqccritc',
                    aut_org_staff_id: '0002876',
                    aut_org_student_id: null,
                    aut_email: null,
                    aut_display_name: 'Critchley, Christa',
                    aut_fname: 'Christa',
                    aut_mname: null,
                    aut_lname: 'Critchley',
                    aut_title: 'Emeritus Professor',
                    aut_position: null,
                    aut_homepage_link: null,
                    aut_created_date: null,
                    aut_update_date: '2010-01-18',
                    aut_external_id: '0000041476',
                    aut_ref_num: null,
                    aut_researcher_id: null,
                    aut_scopus_id: null,
                    aut_mypub_url: null,
                    aut_rid_password: null,
                    aut_people_australia_id: null,
                    aut_description: null,
                    aut_orcid_id: null,
                    aut_google_scholar_id: null,
                    aut_rid_last_updated: null,
                    aut_publons_id: null,
                    aut_student_username: null,
                    nameAsPublished: 'Some user',
                    creatorRole: '',
                    affiliation: 'UQ',
                    orgaff: 'The University of Queensland',
                    orgtype: '',
                    disabled: true,
                    selected: false,
                    authorId: null,
                },
            ];
            const expected = {
                fez_record_search_key_author_affiliation_name: [
                    {
                        rek_author_affiliation_name: 'The University of Queensland',
                        rek_author_affiliation_name_order: 1,
                    },
                    {
                        rek_author_affiliation_name: 'Missing',
                        rek_author_affiliation_name_order: 2,
                    },
                    {
                        rek_author_affiliation_name: 'Missing',
                        rek_author_affiliation_name_order: 3,
                    },
                    {
                        rek_author_affiliation_name: 'The University of Queensland',
                        rek_author_affiliation_name_order: 4,
                    },
                ],
            };
            const result = transformers.getRecordAuthorAffiliationSearchKey(input);
            expect(result).toEqual(expected);
        });
    });

    describe('getRecordAuthorAffiliationTypeSearchKey tests', () => {
        it('should return an empty object', () => {
            expect(transformers.getRecordAuthorAffiliationTypeSearchKey()).toEqual({
                fez_record_search_key_author_affiliation_type: [],
            });
        });

        it('should return search key with data', () => {
            const input = [
                {
                    value: 'Professor Del Mar, Christopher B. (mdcmar) ',
                    id: 553,
                    aut_id: 553,
                    aut_org_username: 'mdcmar',
                    aut_org_staff_id: '0002633',
                    aut_org_student_id: null,
                    aut_email: null,
                    aut_display_name: 'Del Mar, Christopher B.',
                    aut_fname: 'Christopher',
                    aut_mname: 'Bernard',
                    aut_lname: 'Del Mar',
                    aut_title: 'Professor',
                    aut_position: '',
                    aut_homepage_link: '',
                    aut_created_date: null,
                    aut_update_date: '2010-10-08',
                    aut_external_id: '0000041362',
                    aut_ref_num: '',
                    aut_researcher_id: null,
                    aut_scopus_id: '',
                    aut_mypub_url: '',
                    aut_rid_password: null,
                    aut_people_australia_id: null,
                    aut_description: null,
                    aut_orcid_id: null,
                    aut_google_scholar_id: null,
                    aut_rid_last_updated: null,
                    aut_publons_id: null,
                    aut_student_username: null,
                    nameAsPublished: 'Test user',
                    creatorRole: '',
                    affiliation: 'UQ',
                    orgaff: '',
                    orgtype: '453989',
                    disabled: true,
                    selected: false,
                    authorId: null,
                },
                {
                    nameAsPublished: 'Test user',
                    creatorRole: '',
                    affiliation: 'NotUQ',
                    orgaff: 'Test organisation',
                    orgtype: '453983',
                    disabled: false,
                    selected: true,
                    authorId: 410,
                },
                {
                    nameAsPublished: 'Another user',
                    creatorRole: '',
                    affiliation: 'NotUQ',
                    orgaff: 'Some Organisation',
                    orgtype: '453987',
                    disabled: false,
                    selected: false,
                    authorId: null,
                },
                {
                    value: 'Emeritus Professor Critchley, Christa (uqccritc) ',
                    id: 608,
                    aut_id: 608,
                    aut_org_username: 'uqccritc',
                    aut_org_staff_id: '0002876',
                    aut_org_student_id: null,
                    aut_email: null,
                    aut_display_name: 'Critchley, Christa',
                    aut_fname: 'Christa',
                    aut_mname: null,
                    aut_lname: 'Critchley',
                    aut_title: 'Emeritus Professor',
                    aut_position: null,
                    aut_homepage_link: null,
                    aut_created_date: null,
                    aut_update_date: '2010-01-18',
                    aut_external_id: '0000041476',
                    aut_ref_num: null,
                    aut_researcher_id: null,
                    aut_scopus_id: null,
                    aut_mypub_url: null,
                    aut_rid_password: null,
                    aut_people_australia_id: null,
                    aut_description: null,
                    aut_orcid_id: null,
                    aut_google_scholar_id: null,
                    aut_rid_last_updated: null,
                    aut_publons_id: null,
                    aut_student_username: null,
                    nameAsPublished: 'Some user',
                    creatorRole: '',
                    affiliation: 'UQ',
                    orgaff: '',
                    orgtype: '453989',
                    disabled: true,
                    selected: false,
                    authorId: null,
                },
            ];
            const expected = {
                fez_record_search_key_author_affiliation_type: [
                    {
                        rek_author_affiliation_type: 453989,
                        rek_author_affiliation_type_order: 1,
                    },
                    {
                        rek_author_affiliation_type: 453983,
                        rek_author_affiliation_type_order: 2,
                    },
                    {
                        rek_author_affiliation_type: 453987,
                        rek_author_affiliation_type_order: 3,
                    },
                    {
                        rek_author_affiliation_type: 453989,
                        rek_author_affiliation_type_order: 4,
                    },
                ],
            };
            const result = transformers.getRecordAuthorAffiliationTypeSearchKey(input);
            expect(result).toEqual(expected);
        });

        it('should return search key with data for already linked authors', () => {
            const input = [
                {
                    value: 'Professor Del Mar, Christopher B. (mdcmar) ',
                    id: 553,
                    aut_id: 553,
                    aut_org_username: 'mdcmar',
                    aut_org_staff_id: '0002633',
                    aut_org_student_id: null,
                    aut_email: null,
                    aut_display_name: 'Del Mar, Christopher B.',
                    aut_fname: 'Christopher',
                    aut_mname: 'Bernard',
                    aut_lname: 'Del Mar',
                    aut_title: 'Professor',
                    aut_position: '',
                    aut_homepage_link: '',
                    aut_created_date: null,
                    aut_update_date: '2010-10-08',
                    aut_external_id: '0000041362',
                    aut_ref_num: '',
                    aut_researcher_id: null,
                    aut_scopus_id: '',
                    aut_mypub_url: '',
                    aut_rid_password: null,
                    aut_people_australia_id: null,
                    aut_description: null,
                    aut_orcid_id: null,
                    aut_google_scholar_id: null,
                    aut_rid_last_updated: null,
                    aut_publons_id: null,
                    aut_student_username: null,
                    nameAsPublished: 'Test user',
                    creatorRole: '',
                    affiliation: 'UQ',
                    orgaff: '',
                    orgtype: '453989',
                    disabled: true,
                    selected: false,
                    authorId: null,
                },
                {
                    nameAsPublished: 'Test user',
                    creatorRole: '',
                    affiliation: 'NotUQ',
                    orgaff: 'Test organisation',
                    orgtype: '453983',
                    disabled: false,
                    selected: true,
                    authorId: 410,
                },
                {
                    nameAsPublished: 'Another user',
                    creatorRole: '',
                    affiliation: 'NotUQ',
                    orgaff: '',
                    orgtype: '',
                    disabled: false,
                    selected: false,
                    authorId: null,
                },
                {
                    value: 'Emeritus Professor Critchley, Christa (uqccritc) ',
                    id: 608,
                    aut_id: 608,
                    aut_org_username: 'uqccritc',
                    aut_org_staff_id: '0002876',
                    aut_org_student_id: null,
                    aut_email: null,
                    aut_display_name: 'Critchley, Christa',
                    aut_fname: 'Christa',
                    aut_mname: null,
                    aut_lname: 'Critchley',
                    aut_title: 'Emeritus Professor',
                    aut_position: null,
                    aut_homepage_link: null,
                    aut_created_date: null,
                    aut_update_date: '2010-01-18',
                    aut_external_id: '0000041476',
                    aut_ref_num: null,
                    aut_researcher_id: null,
                    aut_scopus_id: null,
                    aut_mypub_url: null,
                    aut_rid_password: null,
                    aut_people_australia_id: null,
                    aut_description: null,
                    aut_orcid_id: null,
                    aut_google_scholar_id: null,
                    aut_rid_last_updated: null,
                    aut_publons_id: null,
                    aut_student_username: null,
                    nameAsPublished: 'Some user',
                    creatorRole: '',
                    affiliation: 'UQ',
                    orgaff: '',
                    orgtype: '453989',
                    disabled: true,
                    selected: false,
                    authorId: null,
                },
            ];
            const expected = {
                fez_record_search_key_author_affiliation_type: [
                    {
                        rek_author_affiliation_type: 453989,
                        rek_author_affiliation_type_order: 1,
                    },
                    {
                        rek_author_affiliation_type: 453983,
                        rek_author_affiliation_type_order: 2,
                    },
                    {
                        rek_author_affiliation_type: 0,
                        rek_author_affiliation_type_order: 3,
                    },
                    {
                        rek_author_affiliation_type: 453989,
                        rek_author_affiliation_type_order: 4,
                    },
                ],
            };
            const result = transformers.getRecordAuthorAffiliationTypeSearchKey(input);
            expect(result).toEqual(expected);
        });
    });

    describe('getRecordAuthorAffiliations tests', () => {
        it('should return null object 1', () => {
            expect(transformers.getRecordAuthorAffiliations()).toEqual({ fez_author_affiliation: null });
        });
        it('should return null object 2', () => {
            expect(transformers.getRecordAuthorAffiliations([], false)).toEqual({ fez_author_affiliation: null });
        });
        it('should return empty array object', () => {
            expect(transformers.getRecordAuthorAffiliations([], true)).toEqual({ fez_author_affiliation: [] });
        });
        it('should return array object', () => {
            const authors = [
                {
                    id: 2,
                    affiliations: [
                        {
                            af_author_id: 2,
                            af_percent_affiliation: 50000,
                            af_org_id: 1,
                            af_status: 1,
                            af_otherkey: 'something',
                            af_otherobj: { otherKey: 'yes' },
                        },
                        {
                            af_author_id: 2,
                            af_percent_affiliation: 50000,
                            af_org_id: 2,
                            af_status: 1,
                        },
                    ],
                },
            ];
            const expected = {
                fez_author_affiliation: [
                    { af_author_id: 2, af_org_id: 1, af_percent_affiliation: 50000, af_status: 1 },
                    { af_author_id: 2, af_org_id: 2, af_percent_affiliation: 50000, af_status: 1 },
                ],
            };

            expect(transformers.getRecordAuthorAffiliations(authors, true)).toEqual(expected);
        });
    });

    describe('getAuthorsSearchKeys', () => {
        it('should handle the canHaveAffiliations param (coverage)', () => {
            const authors = [
                { nameAsPublished: 'Smith D.', disabled: false, selected: true, authorId: 100 },
                { nameAsPublished: 'Smith D.', disabled: false, selected: false, aut_id: 1000 },
            ];

            expect(transformers.getAuthorsSearchKeys(authors)).toEqual(
                expect.objectContaining({ fez_author_affiliation: null }),
            );
            expect(transformers.getAuthorsSearchKeys(authors, true)).toEqual(
                expect.objectContaining({ fez_author_affiliation: [] }),
            );
        });
    });

    describe('getRecordAbstractDescriptionSearchKey tests', () => {
        it('should return empty object', () => {
            expect(transformers.getRecordAbstractDescriptionSearchKey()).toEqual({});
        });

        it('should return search key with data', () => {
            const input = {
                plainText: 'test',
                htmlText: '<p>test</p>',
            };
            const expected = {
                rek_description: 'test',
                rek_formatted_abstract: '<p>test</p>',
            };
            const result = transformers.getRecordAbstractDescriptionSearchKey(input);
            expect(result).toEqual(expected);
        });
    });

    describe('getGrantsListSearchKey tests', () => {
        it('should return empty object', () => {
            expect(transformers.getGrantsListSearchKey()).toEqual({});
        });

        it('should return search key with data', () => {
            const input = [
                {
                    grantAgencyName: 'test',
                    grantId: 'test123',
                    grantAgencyType: '12345',
                },
            ];

            const expected = {
                fez_record_search_key_grant_agency: [
                    {
                        rek_grant_agency: 'test',
                        rek_grant_agency_order: 1,
                    },
                ],
                fez_record_search_key_grant_id: [
                    {
                        rek_grant_id: 'test123',
                        rek_grant_id_order: 1,
                    },
                ],
                fez_record_search_key_grant_agency_type: [
                    {
                        rek_grant_agency_type: 12345,
                        rek_grant_agency_type_order: 1,
                    },
                ],
            };
            const result = transformers.getGrantsListSearchKey(input);
            expect(result).toEqual(expected);

            // Check defaults
            expected.fez_record_search_key_grant_agency[0].rek_grant_agency = 'Not set';
            expected.fez_record_search_key_grant_id[0].rek_grant_id = 'Not set';
            expected.fez_record_search_key_grant_agency_type[0].rek_grant_agency_type = 454045;
            expect(transformers.getGrantsListSearchKey([{}])).toEqual(expected);
        });

        it('should return search key with data filtered empty values', () => {
            const input = [
                {
                    grantAgencyName: 'test',
                    grantId: 'test123',
                },
                {
                    grantId: 'testing123',
                    grantAgencyType: '12345',
                },
                {
                    grantAgencyName: 'tested',
                    grantAgencyType: '56465',
                },
            ];

            const expected = {
                fez_record_search_key_grant_agency: [
                    {
                        rek_grant_agency: 'test',
                        rek_grant_agency_order: 1,
                    },
                    {
                        rek_grant_agency: 'Not set',
                        rek_grant_agency_order: 2,
                    },
                    {
                        rek_grant_agency: 'tested',
                        rek_grant_agency_order: 3,
                    },
                ],
                fez_record_search_key_grant_agency_type: [
                    {
                        rek_grant_agency_type: 454045,
                        rek_grant_agency_type_order: 1,
                    },
                    {
                        rek_grant_agency_type: 12345,
                        rek_grant_agency_type_order: 2,
                    },
                    {
                        rek_grant_agency_type: 56465,
                        rek_grant_agency_type_order: 3,
                    },
                ],
                fez_record_search_key_grant_id: [
                    {
                        rek_grant_id: 'test123',
                        rek_grant_id_order: 1,
                    },
                    {
                        rek_grant_id: 'testing123',
                        rek_grant_id_order: 2,
                    },
                    {
                        rek_grant_id: 'Not set',
                        rek_grant_id_order: 3,
                    },
                ],
            };
            const result = transformers.getGrantsListSearchKey(input);
            expect(result).toEqual(expected);
        });
    });

    describe('getLanguageSearchKey', () => {
        it('should return language search keys', () => {
            const input = ['test1', 'test2'];
            const expected = {
                fez_record_search_key_language: [
                    {
                        rek_language: 'test1',
                        rek_language_order: 1,
                    },
                    {
                        rek_language: 'test2',
                        rek_language_order: 2,
                    },
                ],
            };
            expect(transformers.getLanguageSearchKey(input)).toEqual(expected);

            const expectedDefault = {
                fez_record_search_key_language: [
                    {
                        rek_language: 'eng',
                        rek_language_order: 1,
                    },
                ],
            };
            expect(transformers.getLanguageSearchKey([])).toEqual(expectedDefault);
        });
    });

    describe('getNtroMetadataSearchKeys tests', () => {
        it('should get ntro meta data', () => {
            expect(transformers.getNtroMetadataSearchKeys()).toEqual({});
            expect(transformers.getNtroMetadataSearchKeys({})).toEqual({});
            const result = transformers.getNtroMetadataSearchKeys({
                authors: [
                    {
                        rek_author_id: 111,
                        selected: true,
                    },
                    {
                        rek_author_id: 222,
                        selected: false,
                    },
                    {
                        rek_author_id: 333,
                        selected: false,
                    },
                ],
                significance: 'Major',
                impactStatement: {
                    htmlText: 'test impact statement',
                },
            });

            expect(result).toMatchObject({
                fez_record_search_key_creator_contribution_statement: [
                    {
                        rek_creator_contribution_statement: 'test impact statement',
                        rek_creator_contribution_statement_order: 1,
                    },
                    {
                        rek_creator_contribution_statement: 'Missing',
                        rek_creator_contribution_statement_order: 2,
                    },
                    {
                        rek_creator_contribution_statement: 'Missing',
                        rek_creator_contribution_statement_order: 3,
                    },
                ],
                fez_record_search_key_significance: [
                    {
                        rek_significance: 'Major',
                        rek_significance_order: 1,
                    },
                    {
                        rek_significance: 0,
                        rek_significance_order: 2,
                    },
                    {
                        rek_significance: 0,
                        rek_significance_order: 3,
                    },
                ],
            });
        });
    });

    describe('getContentIndicatorSearchKey', () => {
        it('returns empty object if input is missing or empty', () => {
            expect(transformers.getContentIndicatorSearchKey()).toEqual({});
        });

        it('returns content indicator search key for valid input', () => {
            const input = [200, 300];
            const expected = {
                fez_record_search_key_content_indicator: [
                    {
                        rek_content_indicator: 200,
                        rek_content_indicator_order: 1,
                    },
                    {
                        rek_content_indicator: 300,
                        rek_content_indicator_order: 2,
                    },
                ],
            };
            expect(transformers.getContentIndicatorSearchKey(input)).toEqual(expected);
        });
    });

    describe('getQualityIndicatorSearchKey', () => {
        it('should return quality indicator search key', () => {
            expect(transformers.getQualityIndicatorSearchKey()).toEqual({});
            const input = ['test'];
            const expected = {
                fez_record_search_key_quality_indicator: [
                    {
                        rek_quality_indicator: 'test',
                        rek_quality_indicator_order: 1,
                    },
                ],
            };
            expect(transformers.getQualityIndicatorSearchKey(input)).toEqual(expected);
        });
    });

    describe('getAuthorOrder', () => {
        it("returns author's order when a match it found", () => {
            const data = {
                author: {
                    aut_id: 99,
                },
                publication: {
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id: 99,
                            rek_author_id_order: 1,
                        },
                    ],
                },
            };
            expect(transformers.getAuthorOrder(data)).toBe(1);
        });

        it('returns -1 when a match is not found', () => {
            const data = {
                author: {
                    aut_id: 2,
                },
                publication: {
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id: 99,
                            rek_author_id_order: 1,
                        },
                    ],
                },
            };
            expect(transformers.getAuthorOrder(data)).toBe(-1);
        });
    });

    describe('getSignificanceAndContributionStatementSearchKeys', () => {
        it('returns empty object if data is null', () => {
            expect(transformers.getSignificanceAndContributionStatementSearchKeys(null)).toEqual({});
        });

        it('returns empty object if data is undefined', () => {
            expect(transformers.getSignificanceAndContributionStatementSearchKeys(undefined)).toEqual({});
        });

        it('returns correct object if impact statement is html text for non-admin author', () => {
            expect(
                transformers.getSignificanceAndContributionStatementSearchKeys({
                    impactStatement: {
                        htmlText: '<p>test</p>',
                    },
                    author: {
                        aut_id: 3,
                    },
                    publication: {
                        fez_record_search_key_author_id: [
                            {
                                rek_author_id: 3,
                                rek_author_id_order: 2,
                            },
                        ],
                    },
                }),
            ).toEqual({
                fez_record_search_key_creator_contribution_statement: [
                    {
                        rek_creator_contribution_statement: '<p>test</p>',
                        rek_creator_contribution_statement_order: 2,
                    },
                ],
            });
        });

        it('returns correct object if impact statement is plain text for non-admin author', () => {
            expect(
                transformers.getSignificanceAndContributionStatementSearchKeys({
                    impactStatement: {
                        plainText: 'test',
                    },
                    author: {
                        aut_id: 3,
                    },
                    publication: {
                        fez_record_search_key_author_id: [
                            {
                                rek_author_id: 3,
                                rek_author_id_order: 2,
                            },
                        ],
                    },
                }),
            ).toEqual({
                fez_record_search_key_creator_contribution_statement: [
                    {
                        rek_creator_contribution_statement: 'test',
                        rek_creator_contribution_statement_order: 2,
                    },
                ],
            });
        });

        it('returns correct object for siginificance for non-admin author', () => {
            expect(
                transformers.getSignificanceAndContributionStatementSearchKeys({
                    significance: '1234',
                    author: {
                        aut_id: 3,
                    },
                    publication: {
                        fez_record_search_key_author_id: [
                            {
                                rek_author_id: 3,
                                rek_author_id_order: 2,
                            },
                        ],
                    },
                }),
            ).toEqual({
                fez_record_search_key_significance: [
                    {
                        rek_significance: '1234',
                        rek_significance_order: 2,
                    },
                ],
            });
        });

        it('returns contribution statement and significance search keys for non-admin author', () => {
            expect(
                transformers.getSignificanceAndContributionStatementSearchKeys({
                    significance: '1234',
                    impactStatement: {
                        htmlText: '<span>test</span>',
                    },
                    initialContributionStatements: [],
                    initialSignificance: [],
                    author: {
                        aut_id: 3,
                    },
                    publication: {
                        fez_record_search_key_author_id: [
                            {
                                rek_author_id: 3,
                                rek_author_id_order: 2,
                            },
                        ],
                    },
                }),
            ).toEqual({
                fez_record_search_key_significance: [
                    {
                        rek_significance: '1234',
                        rek_significance_order: 2,
                    },
                ],
                fez_record_search_key_creator_contribution_statement: [
                    {
                        rek_creator_contribution_statement: '<span>test</span>',
                        rek_creator_contribution_statement_order: 2,
                    },
                ],
            });
        });

        it(
            'returns correct contribution statement and significance search ' +
                'keys for admin author on author order matched',
            () => {
                expect(
                    transformers.getSignificanceAndContributionStatementSearchKeys({
                        significance: '1234',
                        impactStatement: {
                            htmlText: '<span>test</span>',
                        },
                        initialValues: {
                            initialContributionStatements: [
                                {
                                    rek_creator_contribution_statement: 'Some statement',
                                    rek_creator_contribution_statement_order: 1,
                                },
                                {
                                    rek_creator_contribution_statement: 'Missing',
                                    rek_creator_contribution_statement_order: 2,
                                },
                                {
                                    rek_creator_contribution_statement: 'Missing',
                                    rek_creator_contribution_statement_order: 3,
                                },
                            ],
                            initialSignificance: [
                                {
                                    rek_significance: '1234',
                                    rek_significance_order: 1,
                                },
                                {
                                    rek_significance: 0,
                                    rek_significance_order: 2,
                                },
                                {
                                    rek_significance: 0,
                                    rek_significance_order: 3,
                                },
                            ],
                        },
                        author: {
                            aut_id: 3,
                        },
                        publication: {
                            fez_record_search_key_author_id: [
                                {
                                    rek_author_id: 3,
                                    rek_author_id_order: 2,
                                },
                            ],
                        },
                    }),
                ).toEqual({
                    fez_record_search_key_significance: [
                        {
                            rek_significance: '1234',
                            rek_significance_order: 1,
                        },
                        {
                            rek_significance: '1234',
                            rek_significance_order: 2,
                        },
                        {
                            rek_significance: 0,
                            rek_significance_order: 3,
                        },
                    ],
                    fez_record_search_key_creator_contribution_statement: [
                        {
                            rek_creator_contribution_statement: 'Some statement',
                            rek_creator_contribution_statement_order: 1,
                        },
                        {
                            rek_creator_contribution_statement: '<span>test</span>',
                            rek_creator_contribution_statement_order: 2,
                        },
                        {
                            rek_creator_contribution_statement: 'Missing',
                            rek_creator_contribution_statement_order: 3,
                        },
                    ],
                });
            },
        );

        it(
            'returns correct contribution statement and significance search keys ' +
                'for admin author on author order not matched',
            () => {
                expect(
                    transformers.getSignificanceAndContributionStatementSearchKeys({
                        significance: '1234',
                        impactStatement: {
                            htmlText: '<span>test</span>',
                        },
                        initialValues: {
                            initialContributionStatements: [
                                {
                                    rek_creator_contribution_statement: 'Some statement',
                                    rek_creator_contribution_statement_order: 1,
                                },
                                {
                                    rek_creator_contribution_statement: 'Missing',
                                    rek_creator_contribution_statement_order: 2,
                                },
                                {
                                    rek_creator_contribution_statement: 'Missing',
                                    rek_creator_contribution_statement_order: 3,
                                },
                            ],
                            initialSignificance: [
                                {
                                    rek_significance: '1234',
                                    rek_significance_order: 1,
                                },
                                {
                                    rek_significance: 0,
                                    rek_significance_order: 2,
                                },
                                {
                                    rek_significance: 0,
                                    rek_significance_order: 3,
                                },
                            ],
                        },
                        author: {
                            aut_id: 3,
                        },
                        publication: {
                            fez_record_search_key_author_id: [
                                {
                                    rek_author_id: 3,
                                    rek_author_id_order: 4,
                                },
                            ],
                        },
                    }),
                ).toEqual({
                    fez_record_search_key_significance: [
                        {
                            rek_significance: '1234',
                            rek_significance_order: 1,
                        },
                        {
                            rek_significance: 0,
                            rek_significance_order: 2,
                        },
                        {
                            rek_significance: 0,
                            rek_significance_order: 3,
                        },
                        {
                            rek_significance: '1234',
                            rek_significance_order: 4,
                        },
                    ],
                    fez_record_search_key_creator_contribution_statement: [
                        {
                            rek_creator_contribution_statement: 'Some statement',
                            rek_creator_contribution_statement_order: 1,
                        },
                        {
                            rek_creator_contribution_statement: 'Missing',
                            rek_creator_contribution_statement_order: 2,
                        },
                        {
                            rek_creator_contribution_statement: 'Missing',
                            rek_creator_contribution_statement_order: 3,
                        },
                        {
                            rek_creator_contribution_statement: '<span>test</span>',
                            rek_creator_contribution_statement_order: 4,
                        },
                    ],
                });
            },
        );
    });

    describe('getExternalSourceIdSearchKeys', () => {
        it('should return formatted search keys for external sources', () => {
            const data = [
                { source: 'crossref', id: 'test1' },
                { source: 'scopus', id: 'test2' },
                { source: 'wos', id: 'test3' },
            ];
            const expected = {
                fez_record_search_key_doi: {
                    rek_doi: 'test1',
                },
                fez_record_search_key_scopus_id: {
                    rek_scopus_id: 'test2',
                },
                fez_record_search_key_isi_loc: {
                    rek_isi_loc: 'test3',
                },
            };
            expect(transformers.getExternalSourceIdSearchKeys(data)).toEqual(expected);
        });
    });

    describe('getSecuritySectionSearchKeys', () => {
        it('should return formatted search keys with datastreams for admin update', () => {
            const expected = {
                rek_security_policy: 1,
            };
            expect(
                transformers.getSecuritySectionSearchKeys({
                    dataStreams: [
                        {
                            dsi_dsid: 'test.png',
                            dsi_label: 'test.png old label',
                            dsi_security_policy: 2,
                            dsi_security_inherited: 1,
                        },
                        {
                            dsi_dsid: 'test1.txt',
                            dsi_label: 'test.txt old label',
                            dsi_security_policy: 3,
                            dsi_security_inherited: 0,
                        },
                    ],
                    rek_security_policy: 1,
                }),
            ).toEqual(expected);
        });

        it('should return formatted search keys without for admin update', () => {
            const expected = {
                rek_security_policy: 1,
                rek_security_inherited: 1,
            };
            expect(
                transformers.getSecuritySectionSearchKeys({
                    rek_security_policy: 1,
                    rek_security_inherited: 1,
                }),
            ).toEqual(expected);
        });

        it('should return formatted search keys with datastream policy for collection update', () => {
            const expected = {
                rek_security_policy: 1,
                rek_datastream_policy: 5,
            };
            expect(
                transformers.getSecuritySectionSearchKeys({
                    rek_security_policy: 1,
                    rek_datastream_policy: 5,
                }),
            ).toEqual(expected);
        });

        it('should return empty object', () => {
            expect(transformers.getSecuritySectionSearchKeys()).toEqual({});
        });
    });

    describe('getDatastreamInfo', () => {
        it('should return formatted search keys with datastreams for admin update', () => {
            const expected = {
                fez_datastream_info: [
                    {
                        dsi_dsid: 'test.png',
                        dsi_dsid_new: 'renamed.png',
                        dsi_label: 'test.png renamed file',
                        dsi_order: 3,
                        dsi_embargo_date: null,
                        dsi_state: 'A',
                        dsi_security_policy: 2,
                        dsi_security_inherited: 0,
                    },
                    {
                        dsi_dsid: 'test1.txt',
                        dsi_label: 'test1.txt new label',
                        dsi_order: 2,
                        dsi_embargo_date: '2020-11-01',
                        dsi_state: 'A',
                        dsi_security_policy: 2,
                        dsi_security_inherited: 0,
                    },
                    {
                        dsi_dsid: 'test_delete.txt',
                        dsi_label: 'test_delete.txt old label',
                        dsi_embargo_date: '2020-12-31',
                        dsi_state: 'D',
                        dsi_security_policy: 1,
                        dsi_security_inherited: 1,
                    },
                ],
            };
            expect(
                transformers.getDatastreamInfo(
                    /* originalDatastreams*/ [
                        {
                            dsi_dsid: 'test.png',
                            dsi_label: 'test.png old label',
                            dsi_embargo_date: null,
                            dsi_state: 'A',
                            dsi_security_policy: 1,
                            dsi_security_inherited: 1,
                        },
                        {
                            dsi_dsid: 'test1.txt',
                            dsi_label: 'test1.txt old label',
                            dsi_embargo_date: '2020-12-31',
                            dsi_state: 'A',
                            dsi_security_policy: 1,
                            dsi_security_inherited: 1,
                        },
                        {
                            dsi_dsid: 'test_delete.txt',
                            dsi_label: 'test_delete.txt old label',
                            dsi_embargo_date: '2020-12-31',
                            dsi_state: 'A',
                            dsi_security_policy: 1,
                            dsi_security_inherited: 1,
                        },
                    ],
                    /* dataStreamsFromFileSection */ [
                        {
                            dsi_dsid: 'test.png',
                            dsi_label: 'test.png new label',
                            dsi_order: 1,
                            dsi_embargo_date: null,
                            dsi_security_policy: 1,
                            dsi_security_inherited: 1,
                        },
                        {
                            dsi_dsid: 'test1.txt',
                            dsi_label: 'test1.txt new label',
                            dsi_order: 2,
                            dsi_embargo_date: '2020-11-01',
                            dsi_security_policy: 1,
                            dsi_security_inherited: 1,
                        },
                        {
                            dsi_dsid: 'renamed.png',
                            dsi_dsid_new: 'test.png',
                            dsi_label: 'test.png renamed file',
                            dsi_order: 3,
                            dsi_embargo_date: null,
                            dsi_security_policy: 1,
                            dsi_security_inherited: 1,
                        },
                    ],
                    /* dataStreamsFromSecuritySection */ [
                        {
                            dsi_dsid: 'test.png',
                            dsi_label: 'test.png old label',
                            dsi_security_policy: 2,
                            dsi_security_inherited: 0,
                        },
                        {
                            dsi_dsid: 'test1.txt',
                            dsi_label: 'test1.txt old label',
                            dsi_security_policy: 2,
                            dsi_security_inherited: 0,
                        },
                    ],
                ),
            ).toEqual(expected);
        });

        it('should return return empty object', () => {
            const expected = {
                fez_datastream_info: [],
            };
            expect(transformers.getDatastreamInfo()).toEqual(expected);
        });
    });

    describe('getAdminSectionSearchKeys', () => {
        it('should get correct object', () => {
            expect(transformers.getAdminSectionSearchKeys()).toEqual({ fez_record_search_key_license: {} });
        });

        it('should transform all search keys for admin section', () => {
            const data = {
                collections: [{ rek_pid: 'UQ:12344' }, { rek_pid: 'UQ:22343' }],
                contentIndicators: [123, 234],
                contactName: 'Test',
                contactEmail: 'test@email.com',
                contactNameId: { id: 1234 },
                ownerIdentifier: '1234',
                ownerIdentifierType: '1111',
                fez_record_search_key_herdc_code: {
                    rek_herdc_code: '450003',
                    rek_herdc_code_id: 5013387,
                    rek_herdc_code_pid: 'UQ:113765',
                },
                fez_record_search_key_herdc_status: {
                    rek_herdc_status_id: 3872732,
                    rek_herdc_status_pid: 'UQ:113765',
                    rek_herdc_status: '453220',
                },
                fez_record_search_key_institutional_status: {
                    rek_institutional_status: '453224',
                    rek_institutional_status_id: 3566611,
                    rek_institutional_status_pid: 'UQ:113765',
                },
                fez_record_search_key_oa_status: {
                    rek_oa_status_id: 3872732,
                    rek_oa_status_pid: 'UQ:113765',
                    rek_oa_status: '453694',
                },
                fez_record_search_key_license: {
                    rek_license: '453607',
                },
                fez_record_search_key_end_date: {
                    rek_end_date: '2019-03-14',
                },
            };

            expect(transformers.getAdminSectionSearchKeys(data)).toEqual({
                fez_record_search_key_ismemberof: [
                    {
                        rek_ismemberof: 'UQ:12344',
                        rek_ismemberof_order: 1,
                    },
                    {
                        rek_ismemberof: 'UQ:22343',
                        rek_ismemberof_order: 2,
                    },
                ],
                fez_record_search_key_content_indicator: [
                    {
                        rek_content_indicator: 123,
                        rek_content_indicator_order: 1,
                    },
                    {
                        rek_content_indicator: 234,
                        rek_content_indicator_order: 2,
                    },
                ],
                fez_record_search_key_contributor: [
                    {
                        rek_contributor: 'Test',
                        rek_contributor_order: 1,
                    },
                ],
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id: 1234,
                        rek_contributor_id_order: 1,
                    },
                ],
                fez_record_search_key_contact_details_email: [
                    {
                        rek_contact_details_email: 'test@email.com',
                        rek_contact_details_email_order: 1,
                    },
                ],
                fez_record_search_key_contributor_identifier: [
                    {
                        rek_contributor_identifier: '1234',
                        rek_contributor_identifier_order: 1,
                    },
                ],
                fez_record_search_key_contributor_identifier_type: [
                    {
                        rek_contributor_identifier_type: '1111',
                        rek_contributor_identifier_type_order: 1,
                    },
                ],
                fez_record_search_key_herdc_code: {
                    rek_herdc_code: '450003',
                },
                fez_record_search_key_herdc_status: {
                    rek_herdc_status: '453220',
                },
                fez_record_search_key_institutional_status: {
                    rek_institutional_status: '453224',
                },
                fez_record_search_key_oa_status: {
                    rek_oa_status: '453694',
                },
                fez_record_search_key_license: {
                    rek_license: '453607',
                },
                fez_record_search_key_end_date: {
                    rek_end_date: '2019-03-14',
                },
            });
        });

        it('should transform all search keys for admin section correctly', () => {
            const data = {
                collections: [{ id: 12344 }, { id: 22343 }],
                contentIndicators: [123, 234],
                contactName: 'Test',
                contactEmail: 'test@email.com',
                contactNameId: { id: 1234 },
                fez_record_search_key_herdc_code: {
                    rek_herdc_code: '450003',
                    rek_herdc_code_id: 5013387,
                    rek_herdc_code_pid: 'UQ:113765',
                },
                fez_record_search_key_herdc_status: {
                    rek_herdc_status_id: 3872732,
                    rek_herdc_status_pid: 'UQ:113765',
                    rek_herdc_status: '453220',
                },
                fez_record_search_key_institutional_status: {
                    rek_institutional_status: '453224',
                    rek_institutional_status_id: 3566611,
                    rek_institutional_status_pid: 'UQ:113765',
                },
                fez_record_search_key_oa_status: {
                    rek_oa_status_id: 3872732,
                    rek_oa_status_pid: 'UQ:113765',
                    rek_oa_status: '453694',
                },
                fez_record_search_key_oa_status_type: {
                    rek_oa_status_type_id: 3872732,
                    rek_oa_status_type_pid: 'UQ:113765',
                    rek_oa_status_type: 454123,
                },
                fez_record_search_key_license: {
                    rek_license: '453607',
                },
                fez_record_search_key_end_date: {
                    rek_end_date: '2019-03-14',
                },
            };

            expect(transformers.getAdminSectionSearchKeys(data)).toEqual({
                fez_record_search_key_ismemberof: [
                    {
                        rek_ismemberof: 12344,
                        rek_ismemberof_order: 1,
                    },
                    {
                        rek_ismemberof: 22343,
                        rek_ismemberof_order: 2,
                    },
                ],
                fez_record_search_key_content_indicator: [
                    {
                        rek_content_indicator: 123,
                        rek_content_indicator_order: 1,
                    },
                    {
                        rek_content_indicator: 234,
                        rek_content_indicator_order: 2,
                    },
                ],
                fez_record_search_key_contributor: [
                    {
                        rek_contributor: 'Test',
                        rek_contributor_order: 1,
                    },
                ],
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id: 1234,
                        rek_contributor_id_order: 1,
                    },
                ],
                fez_record_search_key_contact_details_email: [
                    {
                        rek_contact_details_email: 'test@email.com',
                        rek_contact_details_email_order: 1,
                    },
                ],
                fez_record_search_key_herdc_code: {
                    rek_herdc_code: '450003',
                },
                fez_record_search_key_herdc_status: {
                    rek_herdc_status: '453220',
                },
                fez_record_search_key_institutional_status: {
                    rek_institutional_status: '453224',
                },
                fez_record_search_key_oa_status: {
                    rek_oa_status: '453694',
                },
                fez_record_search_key_oa_status_type: {
                    rek_oa_status_type: 454123,
                },
                fez_record_search_key_license: {
                    rek_license: '453607',
                },
                fez_record_search_key_end_date: {
                    rek_end_date: '2019-03-14',
                },
            });
        });

        it('should transform unselected search keys for admin section', () => {
            const data = {
                fez_record_search_key_herdc_code: {
                    rek_herdc_code: {
                        text: 'Please choose an option',
                        value: null,
                    },
                    rek_herdc_code_id: 5013387,
                    rek_herdc_code_pid: 'UQ:113765',
                },
                fez_record_search_key_herdc_status: {
                    rek_herdc_status: {
                        text: 'Please choose an option',
                        value: null,
                    },
                    rek_herdc_status_id: 3872732,
                    rek_herdc_status_pid: 'UQ:113765',
                },
                fez_record_search_key_institutional_status: {
                    rek_institutional_status: {
                        text: 'Please choose an option',
                        value: null,
                    },
                    rek_institutional_status_id: 3566611,
                    rek_institutional_status_pid: 'UQ:113765',
                },
                fez_record_search_key_oa_status: {
                    rek_oa_status_id: 3872732,
                    rek_oa_status_pid: 'UQ:113765',
                    rek_oa_status: {
                        text: 'Please choose an option',
                        value: null,
                    },
                },
                fez_record_search_key_oa_status_type: {
                    rek_oa_status_type_id: 3872452,
                    rek_oa_status_type_pid: 'UQ:113765',
                    rek_oa_status_type: {
                        text: 'Please choose an option',
                        value: null,
                    },
                },
            };

            expect(transformers.getAdminSectionSearchKeys(data)).toEqual({
                fez_record_search_key_herdc_code: {
                    rek_herdc_code: null,
                },
                fez_record_search_key_herdc_status: {
                    rek_herdc_status: null,
                },
                fez_record_search_key_institutional_status: {},
                fez_record_search_key_oa_status: {},
                fez_record_search_key_oa_status_type: null,
                fez_record_search_key_license: {},
            });
        });

        it('should transform unselected search keys for admin section', () => {
            const data = {
                collections: [],
                contentIndicators: [],
                fez_record_search_key_herdc_code: {
                    rek_herdc_code: {
                        text: 'Please choose an option',
                        value: null,
                    },
                    rek_herdc_code_id: 5013387,
                    rek_herdc_code_pid: 'UQ:113765',
                },
                fez_record_search_key_herdc_status: {
                    rek_herdc_status: {
                        text: 'Please choose an option',
                        value: null,
                    },
                    rek_herdc_status_id: 3872732,
                    rek_herdc_status_pid: 'UQ:113765',
                },
                fez_record_search_key_institutional_status: {
                    rek_institutional_status: {
                        text: 'Please choose an option',
                        value: null,
                    },
                    rek_institutional_status_id: 3566611,
                    rek_institutional_status_pid: 'UQ:113765',
                },
                fez_record_search_key_oa_status: {
                    rek_oa_status_id: 3872732,
                    rek_oa_status_pid: 'UQ:113765',
                    rek_oa_status: {
                        text: 'Please choose an option',
                        value: null,
                    },
                },
                fez_record_search_key_oa_status_type: {
                    rek_oa_status_type_id: 3872454,
                    rek_oa_status_type_pid: 'UQ:113765',
                    rek_oa_status_type: {
                        text: 'Please choose an option',
                        value: null,
                    },
                },
            };

            expect(transformers.getAdminSectionSearchKeys(data)).toEqual({
                fez_record_search_key_herdc_code: {
                    rek_herdc_code: null,
                },
                fez_record_search_key_herdc_status: {
                    rek_herdc_status: null,
                },
                fez_record_search_key_institutional_status: {},
                fez_record_search_key_oa_status: {},
                fez_record_search_key_oa_status_type: null,
                fez_record_search_key_license: {},
            });
        });

        it('should not transform unused search keys for admin section', () => {
            const data = {
                collections: [],
                contentIndicators: [],
            };

            expect(transformers.getAdminSectionSearchKeys(data)).toEqual({ fez_record_search_key_license: {} });
        });
    });

    describe('getIdentifiersSectionSearchKeys', () => {
        it('should get search keys for all identifiers', () => {
            const data = {
                fez_record_search_key_doi: {
                    rek_doi: '10.1111.252/a23455',
                },
                fez_record_search_key_isi_loc: {
                    rek_isi_loc: '232424',
                },
                fez_record_search_key_scopus_id: {
                    rek_scopus_id: '1111111',
                },
                fez_record_search_key_pubmed_id: {
                    rek_pubmed_id: '11231134',
                },
                fez_record_search_key_pubmed_central_id: {
                    rek_pubmed_central_id: '123123123',
                },
                links: [
                    {
                        rek_value: {
                            key: 'http://www.test.com',
                            value: 'test link',
                        },
                        rek_order: 1,
                    },
                ],
                rek_pubmed_doc_type: 'None',
                rek_scopus_doc_type: '2',
                rek_wok_doc_type: '@',
            };

            const expected = {
                fez_record_search_key_doi: {
                    rek_doi: '10.1111.252/a23455',
                },
                fez_record_search_key_isi_loc: {
                    rek_isi_loc: '232424',
                },
                fez_record_search_key_scopus_id: {
                    rek_scopus_id: '1111111',
                },
                fez_record_search_key_pubmed_id: {
                    rek_pubmed_id: '11231134',
                },
                fez_record_search_key_pubmed_central_id: {
                    rek_pubmed_central_id: '123123123',
                },
                fez_record_search_key_link: [
                    {
                        rek_link: 'http://www.test.com',
                        rek_link_order: 1,
                    },
                ],
                fez_record_search_key_link_description: [
                    {
                        rek_link_description: 'test link',
                        rek_link_description_order: 1,
                    },
                ],
                rek_pubmed_doc_type: null,
                rek_scopus_doc_type: '2',
                rek_wok_doc_type: '@',
            };

            expect(transformers.getIdentifiersSectionSearchKeys(data)).toEqual(expected);
        });

        it('should not return search keys for identifiers if fields are empty', () => {
            expect(
                transformers.getIdentifiersSectionSearchKeys({
                    fez_record_search_key_doi: {},
                    fez_record_search_key_isi_loc: {},
                    fez_record_search_key_scopus_id: {},
                    fez_record_search_key_pubmed_id: {},
                    fez_record_search_key_pubmed_central_id: {},
                    links: [],
                    rek_pubmed_doc_type: 'None',
                    rek_scopus_doc_type: 'None',
                    rek_wok_doc_type: 'None',
                    fez_record_search_key_link: [],
                    fez_record_search_key_link_description: [],
                }),
            ).toEqual({
                rek_pubmed_doc_type: null,
                rek_scopus_doc_type: null,
                rek_wok_doc_type: null,
            });
        });

        it('should use default data parameter', () => {
            expect(transformers.getIdentifiersSectionSearchKeys()).toEqual({
                rek_pubmed_doc_type: null,
                rek_scopus_doc_type: null,
                rek_wok_doc_type: null,
            });
        });
    });

    describe('Journal document', () => {
        it('should handle id section specific search keys', () => {
            const data = {
                locations: [{ rek_location: 'Biloela', rek_location_order: 1 }],
                rek_pubmed_doc_type: '1',
                rek_scopus_doc_type: '2',
                rek_wok_doc_type: '3',
            };

            expect(transformers.getIdentifiersSectionSearchKeys(data)).toEqual({
                fez_record_search_key_location: [{ rek_location: 'Biloela', rek_location_order: 1 }],
                rek_pubmed_doc_type: '1',
                rek_scopus_doc_type: '2',
                rek_wok_doc_type: '3',
            });
        });

        it('should handle id section specific search keys and remove empty ones', () => {
            const data = {
                locations: [],
                rek_pubmed_doc_type: '1',
                rek_scopus_doc_type: '2',
                rek_wok_doc_type: '3',
            };

            expect(transformers.getIdentifiersSectionSearchKeys(data)).toEqual({
                rek_pubmed_doc_type: '1',
                rek_scopus_doc_type: '2',
                rek_wok_doc_type: '3',
            });
        });
    });

    describe('Sanitising empty data', () => {
        it('should handle empty record', () => {
            const data = {};

            expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                rek_date: PLACEHOLDER_ISO8601_DATE,
                rek_description: null,
                rek_formatted_abstract: null,
                fez_record_search_key_language: [
                    {
                        rek_language: 'eng',
                        rek_language_order: 1,
                    },
                ],
            });
        });

        it('should remove empty array', () => {
            const data = {
                fez_record_search_key_location: [],
                fez_record_search_key_volume_number: { rek_volume_number: '17' },
            };

            expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                rek_date: PLACEHOLDER_ISO8601_DATE,
                rek_description: null,
                rek_formatted_abstract: null,
                fez_record_search_key_language: [
                    {
                        rek_language: 'eng',
                        rek_language_order: 1,
                    },
                ],
                fez_record_search_key_volume_number: { rek_volume_number: '17' },
            });
        });

        it('should remove empty object', () => {
            const data = {
                fez_record_search_key_edition: {},
                fez_record_search_key_volume_number: { rek_volume_number: '17' },
            };

            expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                rek_date: PLACEHOLDER_ISO8601_DATE,
                rek_description: null,
                rek_formatted_abstract: null,
                fez_record_search_key_language: [
                    {
                        rek_language: 'eng',
                        rek_language_order: 1,
                    },
                ],
                fez_record_search_key_volume_number: { rek_volume_number: '17' },
            });
        });

        // test the `volume` key is removed when set to blank
        it('should remove blank value', () => {
            const data = {
                locations: [{ rek_location: 'Biloela', rek_location_order: 1 }],
                fez_record_search_key_volume_number: { rek_volume_number: '' },
            };

            expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                rek_date: PLACEHOLDER_ISO8601_DATE,
                rek_description: null,
                rek_formatted_abstract: null,
                fez_record_search_key_language: [
                    {
                        rek_language: 'eng',
                        rek_language_order: 1,
                    },
                ],
                locations: [{ rek_location: 'Biloela', rek_location_order: 1 }],
            });
        });

        // test the `series` key is removed when set to null
        it('should remove null value', () => {
            const data = {
                locations: [{ rek_location: 'Biloela', rek_location_order: 1 }],
                fez_record_search_key_series: { rek_series: null },
            };

            expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                rek_date: PLACEHOLDER_ISO8601_DATE,
                rek_description: null,
                rek_formatted_abstract: null,
                fez_record_search_key_language: [
                    {
                        rek_language: 'eng',
                        rek_language_order: 1,
                    },
                ],
                locations: [{ rek_location: 'Biloela', rek_location_order: 1 }],
            });
        });
    });

    /**
     * List of all bibliographic section search keys
     *  - bibliographicSection.rek_title'
     *  - bibliographicSection.rek_description'
     *  - bibliographicSection.rek_date'
     *  - bibliographicSection.languages'
     *  - bibliographicSection.fez_matched_journals'
     *  - bibliographicSection.fez_record_search_key_journal_name.rek_journal_name'
     *  - bibliographicSection.fez_record_search_key_book_title.rek_book_title'
     *  - bibliographicSection.fez_record_search_key_conference_name.rek_conference_name'
     *  - bibliographicSection.fez_record_search_key_proceedings_title.rek_proceedings_title'
     *  - bibliographicSection.fez_record_search_key_native_script_book_title.rek_native_script_book_title'
     *  - bibliographicSection.fez_record_search_key_roman_script_book_title.rek_roman_script_book_title'
     *  - bibliographicSection.fez_record_search_key_translated_book_title.rek_translated_book_title'
     *  - bibliographicSection.fez_record_search_key_native_script_conference_name.rek_native_script_conference_name'
     *  - bibliographicSection.fez_record_search_key_roman_script_conference_name.rek_roman_script_conference_name'
     *  - bibliographicSection.fez_record_search_key_translated_conference_name.rek_translated_conference_name'
     *  - bibliographicSection.fez_record_search_key_native_script_proceedings_title
     *      .rek_native_script_proceedings_title'
     *  - bibliographicSection.fez_record_search_key_roman_script_proceedings_title.rek_roman_script_proceedings_title'
     *  - bibliographicSection.fez_record_search_key_translated_proceedings_title.rek_translated_proceedings_title'
     *  - bibliographicSection.fez_record_search_key_place_of_publication.rek_place_of_publication'
     *  - bibliographicSection.fez_record_search_key_publisher.rek_publisher'
     *  - bibliographicSection.fez_record_search_key_volume_number.rek_volume_number'
     *  - bibliographicSection.fez_record_search_key_issue_number.rek_issue_number'
     *  - bibliographicSection.fez_record_search_key_article_number.rek_article_number'
     *  - bibliographicSection.fez_record_search_key_patent_number.rek_patent_number'
     *  - bibliographicSection.fez_record_search_key_start_page.rek_start_page'
     *  - bibliographicSection.fez_record_search_key_end_page.rek_end_page'
     *  - bibliographicSection.fez_record_search_key_oa_embargo_days.rek_oa_embargo_days'
     *  - bibliographicSection.fez_record_search_key_keywords'
     *  - bibliographicSection.fez_record_search_key_issn'
     *  - bibliographicSection.fez_record_search_key_isbn'
     *  - bibliographicSection.fez_record_search_key_edition.rek_edition'
     *  - bibliographicSection.fez_record_search_key_series.rek_series'
     *  - bibliographicSection.fez_record_search_key_chapter_number.rek_chapter_number'
     *  - bibliographicSection.fez_record_search_key_total_pages.rek_total_pages'
     *  - bibliographicSection.subjects'
     *  - bibliographicSection.fez_record_search_key_refereed_source.rek_refereed_source'
     *  - bibliographicSection.languageOfJournalName'
     *  - bibliographicSection.languageOfBookTitle'
     *  - bibliographicSection.languageOfConferenceName'
     *  - bibliographicSection.languageOfProceedingsTitle'
     *  - bibliographicSection.fez_record_search_key_conference_location.rek_conference_location'
     *  - bibliographicSection.fez_record_search_key_conference_dates.rek_conference_dates'
     *  - bibliographicSection.fez_record_search_key_native_script_journal_name.rek_native_script_journal_name'
     *  - bibliographicSection.fez_record_search_key_roman_script_journal_name.rek_roman_script_journal_name'
     *  - bibliographicSection.fez_record_search_key_translated_journal_name.rek_translated_journal_name'
     *  - bibliographicSection.languageOfTitle'
     *  - bibliographicSection.fez_record_search_key_native_script_title.rek_native_script_title'
     *  - bibliographicSection.fez_record_search_key_roman_script_title.rek_roman_script_title'
     *  - bibliographicSection.fez_record_search_key_translated_title.rek_translated_title'
     *  - bibliographicSection.fez_record_search_key_transcript'
     *  - bibliographicSection.fez_record_search_key_date_available.rek_date_available'
     *  - bibliographicSection.fez_record_search_key_date_recorded.rek_date_recorded'
     *  - bibliographicSection.fez_record_search_key_isderivationof'
     *  - bibliographicSection.fez_record_search_key_source.rek_source'
     *  - bibliographicSection.fez_record_search_key_rights.rek_rights'
     *  - bibliographicSection.fez_record_search_key_acknowledgements.rek_acknowledgements'
     *  - bibliographicSection.fez_record_search_key_length.rek_length'
     *  - bibliographicSection.fez_record_search_key_license.rek_license'
     *  - bibliographicSection.fez_record_search_key_original_format.rek_original_format'
     *  - bibliographicSection.fez_record_search_key_alternate_genre'
     *  - bibliographicSection.rek_genre'
     *  - bibliographicSection.rek_genre_type'
     *  - bibliographicSection.geoCoordinates'
     *  - bibliographicSection.fez_record_search_key_type_of_data'
     *  - bibliographicSection.fez_record_search_key_data_volume.rek_data_volume'
     *  - bibliographicSection.fez_record_search_key_software_required'
     *  - bibliographicSection.fez_record_search_key_related_datasets'
     *  - bibliographicSection.fez_record_search_key_related_publications'
     *  - bibliographicSection.fez_record_search_key_isdatasetof'
     *  - bibliographicSection.fez_record_search_key_project_start_date.rek_project_start_date'
     *  - bibliographicSection.fez_record_search_key_org_name.rek_org_name'
     *  - bibliographicSection.fez_record_search_key_org_unit_name.rek_org_unit_name'
     *  - bibliographicSection.fez_record_search_key_report_number.rek_report_number'
     *  - bibliographicSection.fez_record_search_key_parent_publication.rek_parent_publication'
     *  - bibliographicSection.fez_record_search_key_newspaper.rek_newspaper'
     *  - bibliographicSection.fez_record_search_key_section.rek_section'
     *  - bibliographicSection.fez_record_search_key_translated_newspaper.rek_translated_newspaper'
     *  - bibliographicSection.fez_record_search_key_scale.rek_scale'
     *  - bibliographicSection.fez_record_search_key_job_number.rek_job_number'
     *  - bibliographicSection.fez_record_search_key_period'
     *  - bibliographicSection.fez_record_search_key_structural_systems'
     *  - bibliographicSection.fez_record_search_key_style'
     *  - bibliographicSection.fez_record_search_key_subcategory'
     *  - bibliographicSection.fez_record_search_key_surrounding_features'
     *  - bibliographicSection.fez_record_search_key_interior_features'
     *  - bibliographicSection.fez_record_search_key_date_photo_taken.rek_date_photo_taken'
     *  - bibliographicSection.fez_record_search_key_date_scanned.rek_date_scanned'
     *  - bibliographicSection.fez_record_search_key_building_materials'
     *  - bibliographicSection.fez_record_search_key_category'
     *  - bibliographicSection.fez_record_search_key_condition'
     *  - bibliographicSection.fez_record_search_key_construction_date.rek_construction_date'
     *  - bibliographicSection.fez_record_search_key_alternative_title'
     *  - bibliographicSection.fez_record_search_key_architectural_features'
     *  - bibliographicSection.fez_record_search_key_project_name.rek_project_name'
     */
    describe('getBibliographicSectionSearchKeys', () => {
        describe('Common bibliographic section search keys', () => {
            it('should get common search keys', () => {
                const data = {
                    rek_title: {
                        htmlText: '<p>test</p>',
                        plainText: 'test',
                    },
                    rek_description: {
                        htmlText: '<p>test description</p>',
                        plainText: 'test description',
                    },
                    rek_date: '2019-01-01 00:00:00',
                    languages: ['eng'],
                    subjects: [
                        {
                            rek_value: {
                                key: 111111,
                                value: 'Test subject',
                            },
                            rek_order: 1,
                        },
                    ],
                    fez_record_search_key_keywords: [
                        {
                            rek_keywords: 'test',
                            rek_keywords_order: 1,
                        },
                        {
                            rek_keywords: 'testing',
                            rek_keywords_order: 2,
                        },
                    ],
                    fez_record_search_key_related_datasets: {
                        plainText: 'A related dataset',
                        htmlText: '<p>A related dataset</p>',
                    },
                    fez_record_search_key_related_publications: {
                        plainText: 'A related publication',
                        htmlText: '<p>A related publication</p>',
                    },
                    fez_record_search_key_end_date: {},
                };

                expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                    rek_title: 'test',
                    rek_formatted_title: '<p>test</p>',
                    rek_description: 'test description',
                    rek_formatted_abstract: '<p>test description</p>',
                    rek_date: '2019-01-01 00:00:00',
                    fez_record_search_key_language: [
                        {
                            rek_language: 'eng',
                            rek_language_order: 1,
                        },
                    ],
                    fez_record_search_key_subject: [
                        {
                            rek_subject: 111111,
                            rek_subject_order: 1,
                        },
                    ],
                    fez_record_search_key_keywords: [
                        {
                            rek_keywords: 'test',
                            rek_keywords_order: 1,
                        },
                        {
                            rek_keywords: 'testing',
                            rek_keywords_order: 2,
                        },
                    ],
                    fez_record_search_key_related_datasets: {
                        rek_related_datasets: '<p>A related dataset</p>',
                    },
                    fez_record_search_key_related_publications: {
                        rek_related_publications: '<p>A related publication</p>',
                    },
                });
            });
        });

        describe('Audio document', () => {
            it('should get all bibliographic section search keys', () => {
                const data = {
                    fez_record_search_key_translated_title: {
                        rek_translated_title: 'Translated test title',
                    },
                    geoCoordinates: '153.024504,-27.493017',
                    fez_record_search_key_date_available: {
                        rek_date_available: '2015',
                    },
                    fez_record_search_key_date_recorded: {
                        rek_date_recorded: '01-10-2016',
                    },
                    fez_record_search_key_license: {
                        rek_license: '453610',
                    },
                    fez_record_search_key_location: [{ rek_location: 'Perth', rek_location_order: 1 }],
                };

                expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                    rek_date: PLACEHOLDER_ISO8601_DATE,
                    rek_description: null,
                    rek_formatted_abstract: null,
                    fez_record_search_key_language: [
                        {
                            rek_language: 'eng',
                            rek_language_order: 1,
                        },
                    ],
                    fez_record_search_key_translated_title: {
                        rek_translated_title: 'Translated test title',
                    },
                    fez_record_search_key_geographic_area: [
                        {
                            rek_geographic_area: '153.024504,-27.493017',
                            rek_geographic_area_order: 1,
                        },
                    ],
                    fez_record_search_key_date_available: {
                        rek_date_available: '2015-01-01T00:00:00+10:00',
                    },
                    fez_record_search_key_date_recorded: {
                        rek_date_recorded: '01-10-2016',
                    },
                    fez_record_search_key_license: {
                        rek_license: '453610',
                    },
                    fez_record_search_key_location: [{ rek_location: 'Perth', rek_location_order: 1 }],
                });
            });

            it('should get all bibliographic section search keys except rek_date_available', () => {
                const data = {
                    fez_record_search_key_translated_title: {
                        rek_translated_title: 'Translated test title',
                    },
                    geoCoordinates: '153.024504,-27.493017',
                    fez_record_search_key_date_available: {
                        rek_date_available: '',
                    },
                    fez_record_search_key_date_recorded: {
                        rek_date_recorded: '01-10-2016',
                    },
                    fez_record_search_key_license: {
                        rek_license: '453610',
                    },
                    fez_record_search_key_location: [{ rek_location: 'Perth', rek_location_order: 1 }],
                };

                expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                    rek_date: PLACEHOLDER_ISO8601_DATE,
                    rek_description: null,
                    rek_formatted_abstract: null,
                    fez_record_search_key_language: [
                        {
                            rek_language: 'eng',
                            rek_language_order: 1,
                        },
                    ],
                    fez_record_search_key_translated_title: {
                        rek_translated_title: 'Translated test title',
                    },
                    fez_record_search_key_geographic_area: [
                        {
                            rek_geographic_area: '153.024504,-27.493017',
                            rek_geographic_area_order: 1,
                        },
                    ],
                    fez_record_search_key_date_recorded: {
                        rek_date_recorded: '01-10-2016',
                    },
                    fez_record_search_key_license: {
                        rek_license: '453610',
                    },
                    fez_record_search_key_location: [{ rek_location: 'Perth', rek_location_order: 1 }],
                });
            });

            it('should remove frsk_date_recorded from the request payload', () => {
                const data = {
                    fez_record_search_key_translated_title: {
                        rek_translated_title: 'Translated test title',
                    },
                    geoCoordinates: '153.024504,-27.493017',
                    fez_record_search_key_date_available: {
                        rek_date_available: '2015',
                    },
                    fez_record_search_key_date_recorded: {
                        rek_date_recorded: '01-01-0000',
                    },
                    fez_record_search_key_license: {
                        rek_license: '453610',
                    },
                    fez_record_search_key_location: [{ rek_location: 'Perth', rek_location_order: 1 }],
                };

                expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                    rek_date: PLACEHOLDER_ISO8601_DATE,
                    rek_description: null,
                    rek_formatted_abstract: null,
                    fez_record_search_key_language: [
                        {
                            rek_language: 'eng',
                            rek_language_order: 1,
                        },
                    ],
                    fez_record_search_key_translated_title: {
                        rek_translated_title: 'Translated test title',
                    },
                    fez_record_search_key_geographic_area: [
                        {
                            rek_geographic_area: '153.024504,-27.493017',
                            rek_geographic_area_order: 1,
                        },
                    ],
                    fez_record_search_key_date_available: {
                        rek_date_available: '2015-01-01T00:00:00+10:00',
                    },
                    fez_record_search_key_license: {
                        rek_license: '453610',
                    },
                    fez_record_search_key_location: [{ rek_location: 'Perth', rek_location_order: 1 }],
                });
            });

            it('should clear a removed place of recording (frsk_location)', () => {
                const data = {
                    fez_record_search_key_location: [{ rek_location: '', rek_location_order: 1 }],
                };

                expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                    rek_date: PLACEHOLDER_ISO8601_DATE,
                    rek_description: null,
                    rek_formatted_abstract: null,
                    fez_record_search_key_language: [
                        {
                            rek_language: 'eng',
                            rek_language_order: 1,
                        },
                    ],
                });
            });
        });

        describe('Search Key Structure', () => {
            // these 2 tests are more about demonstrating how the API should be called than actually testing anything
            // also useful for swapping search key names in to check they are properly handled

            it('should only save the supplied key for a one-to-one search key', () => {
                const data = {
                    fez_record_search_key_license: { rek_license: 123 },
                };
                expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                    rek_date: PLACEHOLDER_ISO8601_DATE,
                    rek_description: null,
                    rek_formatted_abstract: null,
                    fez_record_search_key_license: { rek_license: 123 },
                    fez_record_search_key_language: [
                        {
                            rek_language: 'eng',
                            rek_language_order: 1,
                        },
                    ],
                });
            });

            it('should only save the supplied key for a many-to-one search key', () => {
                const dataMany = {
                    issns: [
                        { rek_value: '1212-1212', rek_order: 1 },
                        { rek_value: '2323-2323', rek_order: 2 },
                    ],
                };
                const dataOne = {
                    issns: [{ rek_value: '2323-2323', rek_order: 1 }],
                };
                expect(transformers.getBibliographicSectionSearchKeys(dataMany)).toEqual({
                    rek_date: PLACEHOLDER_ISO8601_DATE,
                    rek_description: null,
                    rek_formatted_abstract: null,
                    fez_record_search_key_language: [
                        {
                            rek_language: 'eng',
                            rek_language_order: 1,
                        },
                    ],
                    fez_record_search_key_issn: [
                        { rek_issn: '1212-1212', rek_issn_order: 1 },
                        { rek_issn: '2323-2323', rek_issn_order: 2 },
                    ],
                });

                expect(transformers.getBibliographicSectionSearchKeys(dataOne)).toEqual({
                    rek_date: PLACEHOLDER_ISO8601_DATE,
                    rek_description: null,
                    rek_formatted_abstract: null,
                    fez_record_search_key_language: [
                        {
                            rek_language: 'eng',
                            rek_language_order: 1,
                        },
                    ],
                    fez_record_search_key_issn: [{ rek_issn: '2323-2323', rek_issn_order: 1 }],
                });
            });

            it('should be able to delete search key', () => {
                const data = {
                    fez_record_search_key_isderivationof: [],
                };

                expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                    rek_date: PLACEHOLDER_ISO8601_DATE,
                    rek_description: null,
                    rek_formatted_abstract: null,
                    fez_record_search_key_language: [
                        {
                            rek_language: 'eng',
                            rek_language_order: 1,
                        },
                    ],
                    fez_record_search_key_isderivationof: [],
                });
            });
        });

        describe('Book chapter/Book', () => {
            it('should get all bibliographic section search keys', () => {
                const data = {
                    languageOfTitle: ['eng', 'pol'],
                    languageOfBookTitle: ['eng', 'fre'],
                    issns: [
                        { rek_value: '1212-1212', rek_order: 1 },
                        { rek_value: '2323-2323', rek_order: 2 },
                    ],
                };

                expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                    rek_date: PLACEHOLDER_ISO8601_DATE,
                    rek_description: null,
                    rek_formatted_abstract: null,
                    fez_record_search_key_language: [
                        {
                            rek_language: 'eng',
                            rek_language_order: 1,
                        },
                    ],
                    fez_record_search_key_language_of_title: [
                        {
                            rek_language_of_title: 'eng',
                            rek_language_of_title_order: 1,
                        },
                        {
                            rek_language_of_title: 'pol',
                            rek_language_of_title_order: 2,
                        },
                    ],
                    fez_record_search_key_language_of_book_title: [
                        {
                            rek_language_of_book_title: 'eng',
                            rek_language_of_book_title_order: 1,
                        },
                        {
                            rek_language_of_book_title: 'fre',
                            rek_language_of_book_title_order: 2,
                        },
                    ],
                    fez_record_search_key_issn: [
                        { rek_issn: '1212-1212', rek_issn_order: 1 },
                        { rek_issn: '2323-2323', rek_issn_order: 2 },
                    ],
                });
            });
        });

        describe('Conference paper', () => {
            it('should get all bibliographic section search keys', () => {
                const data = {
                    languageOfProceedingsTitle: ['eng', 'pol'],
                    languageOfJournalName: ['fre'],
                    fez_matched_journals: {
                        jnl_jid: 7669,
                    },
                };

                expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                    rek_date: PLACEHOLDER_ISO8601_DATE,
                    rek_description: null,
                    rek_formatted_abstract: null,
                    fez_record_search_key_language: [
                        {
                            rek_language: 'eng',
                            rek_language_order: 1,
                        },
                    ],
                    fez_record_search_key_language_of_proceedings_title: [
                        {
                            rek_language_of_proceedings_title: 'eng',
                            rek_language_of_proceedings_title_order: 1,
                        },
                        {
                            rek_language_of_proceedings_title: 'pol',
                            rek_language_of_proceedings_title_order: 2,
                        },
                    ],
                    fez_record_search_key_language_of_journal_name: [
                        {
                            rek_language_of_journal_name: 'fre',
                            rek_language_of_journal_name_order: 1,
                        },
                    ],
                    fez_matched_journals: {
                        mtj_jnl_id: 7669,
                        mtj_status: 'M',
                    },
                });
            });

            it('should preserve auto-matched jounrals', () => {
                const data = {
                    fez_matched_journals: {
                        mtj_jnl_id: 132,
                        mtj_status: 'A',
                    },
                };
                expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                    rek_date: PLACEHOLDER_ISO8601_DATE,
                    rek_description: null,
                    rek_formatted_abstract: null,
                    fez_matched_journals: {
                        mtj_jnl_id: 132,
                        mtj_status: 'A',
                    },
                    fez_record_search_key_language: [
                        {
                            rek_language: 'eng',
                            rek_language_order: 1,
                        },
                    ],
                });
            });

            it('should set key to null for a removed journal match', () => {
                const data = {
                    fez_matched_journals: null,
                };
                expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                    rek_date: PLACEHOLDER_ISO8601_DATE,
                    rek_description: null,
                    rek_formatted_abstract: null,
                    fez_matched_journals: null,
                    fez_record_search_key_language: [
                        {
                            rek_language: 'eng',
                            rek_language_order: 1,
                        },
                    ],
                });
            });

            it('should send matched journals as null if match ID is null or 0', () => {
                const zeroData = {
                    fez_matched_journals: {
                        jnl_jid: 0,
                    },
                };
                expect(transformers.getFezMatchedJournalsKey(zeroData)).toEqual({
                    fez_matched_journals: null,
                });
                const nullData = {
                    fez_matched_journals: {
                        jnl_jid: null,
                    },
                };
                expect(transformers.getFezMatchedJournalsKey(nullData)).toEqual({
                    fez_matched_journals: null,
                });
            });
        });

        describe('Design', () => {
            it('should get all bibliographic section search keys', () => {
                const data = {
                    fez_record_search_key_end_page: {
                        rek_end_page: '11',
                    },
                    fez_record_search_key_rights: {
                        rek_rights:
                            'This work is made available by the UQ Library for your personal research or study. For further information and access please contact the Fryer Library, The University of Queensland Library.',
                    },
                    fez_record_search_key_series: {
                        rek_series: 'Karl Langer Collection, UQFL158',
                    },
                    fez_record_search_key_acknowledgements: {
                        rek_acknowledgements: 'Digitisation made possible from donations to the UQ Library.',
                    },
                    subjects: [
                        {
                            rek_value: {
                                key: 111111,
                                value: 'Test subject',
                            },
                            rek_order: 1,
                        },
                    ],
                    fez_record_search_key_source: {
                        rek_source: 'Karl Langer Collection, UQFL158, job no. 1127-2, item 7',
                    },
                    fez_record_search_key_place_of_publication: {
                        rek_place_of_publication: 'somewwhere',
                    },
                    geoCoordinates: '153.050925,-27.396682',
                    fez_record_search_key_publisher: {
                        rek_publisher: 'fasd',
                    },
                    rek_title: {
                        plainText:
                            'Flats for Mr. and Mrs. A Franchin, Wavell Heights, ground floor and basement plan blueprints, Nov 1960',
                        htmlText:
                            'Flats for Mr. and Mrs. A Franchin, Wavell Heights, ground floor and basement plan blueprints, Nov 1960',
                    },
                    rek_description: {
                        plainText: 'something something',
                        htmlText: 'The Karl Langer collection consists of _snip_',
                    },
                    rek_date: PLACEHOLDER_ISO8601_DATE,
                    fez_record_search_key_keywords: [
                        {
                            rek_keywords: 'Langer, Karl, 1903-1969',
                            rek_keywords_order: 1,
                        },
                        {
                            rek_keywords: 'Architectural drawings',
                            rek_keywords_order: 2,
                        },
                    ],
                    fez_record_search_key_end_date: {
                        rek_end_date: '2020-01-01',
                    },
                    fez_record_search_key_job_number: {
                        rek_job_number: 'UQFL158, job no. 1127-2',
                    },
                    fez_record_search_key_original_format: {
                        rek_original_format: 'Architectural drawing; blueprint; 49 x 73 cm.',
                    },
                    fez_record_search_key_start_page: {
                        rek_start_page: '4',
                    },
                    languages: ['eng', 'pol'],
                    fez_record_search_key_total_pages: {
                        rek_total_pages: '4',
                    },
                    fez_record_search_key_scale: {
                        rek_scale: '451662',
                    },
                    fez_record_search_key_project_name: {
                        rek_project_name: 'Flats for Mr. and Mrs. A Franchin',
                    },
                    fez_record_search_key_project_start_date: {
                        rek_project_start_date: '2017-01-01',
                    },
                };

                expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                    rek_date: PLACEHOLDER_ISO8601_DATE,
                    fez_record_search_key_end_page: {
                        rek_end_page: '11',
                    },
                    fez_record_search_key_rights: {
                        rek_rights:
                            'This work is made available by the UQ Library for your personal research or study. For further information and access please contact the Fryer Library, The University of Queensland Library.',
                    },
                    fez_record_search_key_series: {
                        rek_series: 'Karl Langer Collection, UQFL158',
                    },
                    fez_record_search_key_acknowledgements: {
                        rek_acknowledgements: 'Digitisation made possible from donations to the UQ Library.',
                    },
                    fez_record_search_key_source: {
                        rek_source: 'Karl Langer Collection, UQFL158, job no. 1127-2, item 7',
                    },
                    fez_record_search_key_place_of_publication: {
                        rek_place_of_publication: 'somewwhere',
                    },
                    fez_record_search_key_publisher: {
                        rek_publisher: 'fasd',
                    },
                    fez_record_search_key_keywords: [
                        {
                            rek_keywords: 'Langer, Karl, 1903-1969',
                            rek_keywords_order: 1,
                        },
                        {
                            rek_keywords: 'Architectural drawings',
                            rek_keywords_order: 2,
                        },
                    ],
                    fez_record_search_key_job_number: {
                        rek_job_number: 'UQFL158, job no. 1127-2',
                    },
                    fez_record_search_key_original_format: {
                        rek_original_format: 'Architectural drawing; blueprint; 49 x 73 cm.',
                    },
                    fez_record_search_key_start_page: {
                        rek_start_page: '4',
                    },
                    fez_record_search_key_total_pages: {
                        rek_total_pages: '4',
                    },
                    fez_record_search_key_scale: {
                        rek_scale: '451662',
                    },
                    fez_record_search_key_project_name: {
                        rek_project_name: 'Flats for Mr. and Mrs. A Franchin',
                    },
                    fez_record_search_key_project_start_date: {
                        rek_project_start_date: '2017-01-01',
                    },
                    rek_title:
                        'Flats for Mr. and Mrs. A Franchin, Wavell Heights, ground floor and basement plan blueprints, Nov 1960',
                    rek_formatted_title:
                        'Flats for Mr. and Mrs. A Franchin, Wavell Heights, ground floor and basement plan blueprints, Nov 1960',
                    rek_description: 'something something',
                    rek_formatted_abstract: 'The Karl Langer collection consists of _snip_',
                    fez_record_search_key_language: [
                        {
                            rek_language: 'eng',
                            rek_language_order: 1,
                        },
                        {
                            rek_language: 'pol',
                            rek_language_order: 2,
                        },
                    ],
                    fez_record_search_key_end_date: {
                        rek_end_date: '2020-01-01',
                    },
                    fez_record_search_key_geographic_area: [
                        {
                            rek_geographic_area: '153.050925,-27.396682',
                            rek_geographic_area_order: 1,
                        },
                    ],
                    fez_record_search_key_subject: [
                        {
                            rek_subject: 111111,
                            rek_subject_order: 1,
                        },
                    ],
                });
            });

            it('should save a null pub date as the placeholder date', () => {
                const data = {
                    rek_date: null,
                    fez_record_search_key_subject: [
                        {
                            rek_subject: 111111,
                            rek_subject_order: 1,
                        },
                    ],
                    fez_record_search_key_project_start_date: {
                        rek_project_start_date: '2017-01-01',
                    },
                };

                expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                    rek_date: PLACEHOLDER_ISO8601_DATE,
                    rek_description: null,
                    rek_formatted_abstract: null,
                    fez_record_search_key_language: [
                        {
                            rek_language: 'eng',
                            rek_language_order: 1,
                        },
                    ],
                    fez_record_search_key_subject: [
                        {
                            rek_subject: 111111,
                            rek_subject_order: 1,
                        },
                    ],
                    fez_record_search_key_project_start_date: {
                        rek_project_start_date: '2017-01-01',
                    },
                });
            });
        });

        describe('Department Technical Report', () => {
            it('should get all bibliographic section search keys', () => {
                const data = {
                    fez_record_search_key_isderivationof: [
                        {
                            rek_isderivationof: {
                                id: 'UQ:734361',
                                value: 'The Material Library of Cladding Materials',
                            },
                            rek_isderivationof_order: 1,
                        },
                    ],
                };

                expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                    rek_date: PLACEHOLDER_ISO8601_DATE,
                    rek_description: null,
                    rek_formatted_abstract: null,
                    fez_record_search_key_language: [
                        {
                            rek_language: 'eng',
                            rek_language_order: 1,
                        },
                    ],
                    fez_record_search_key_isderivationof: [
                        {
                            rek_isderivationof: 'UQ:734361',
                            rek_isderivationof_order: 1,
                        },
                    ],
                });

                const data2 = {
                    fez_record_search_key_isderivationof: [
                        {
                            rek_isderivationof: 'UQ:734361',
                            rek_isderivationof_order: 1,
                        },
                    ],
                };

                expect(transformers.getBibliographicSectionSearchKeys(data2)).toEqual({
                    rek_date: PLACEHOLDER_ISO8601_DATE,
                    rek_description: null,
                    rek_formatted_abstract: null,
                    fez_record_search_key_language: [
                        {
                            rek_language: 'eng',
                            rek_language_order: 1,
                        },
                    ],
                    fez_record_search_key_isderivationof: [
                        {
                            rek_isderivationof: 'UQ:734361',
                            rek_isderivationof_order: 1,
                        },
                    ],
                });
            });
        });
    });

    describe('getAuthorsSectionSearchKeys', () => {
        it('should get not get authors section search key', () => {
            const data = {
                authors: [],
                editors: [],
                supervisors: [],
                creators: [],
                architects: [],
            };

            expect(transformers.getAuthorsSectionSearchKeys(data)).toEqual({
                fez_author_affiliation: null,
                fez_record_search_key_author: [],
                fez_record_search_key_author_id: [],
                fez_record_search_key_author_affiliation_country: [],
                fez_record_search_key_author_affiliation_full_address: [],
                fez_record_search_key_author_affiliation_id: [],
                fez_record_search_key_author_affiliation_name: [],
                fez_record_search_key_author_affiliation_type: [],
                fez_record_search_key_author_identifier: [],
                fez_record_search_key_author_identifier_type: [],
            });
        });

        it('should get authors search key', () => {
            const data = {
                authors: [
                    { nameAsPublished: 'Smith A.', disabled: false, selected: false, authorId: null },
                    { nameAsPublished: 'Smith B.', disabled: false, selected: true, authorId: 100 },
                    { nameAsPublished: 'Smith C.', disabled: false, selected: false, authorId: null },
                    { nameAsPublished: 'Smith D.', disabled: false, selected: false, aut_id: 1001 },
                ],
            };

            expect(transformers.getAuthorsSectionSearchKeys(data)).toEqual({
                fez_author_affiliation: null,
                fez_record_search_key_author: [
                    { rek_author: 'Smith A.', rek_author_order: 1 },
                    { rek_author: 'Smith B.', rek_author_order: 2 },
                    { rek_author: 'Smith C.', rek_author_order: 3 },
                    { rek_author: 'Smith D.', rek_author_order: 4 },
                ],
                fez_record_search_key_author_id: [
                    { rek_author_id: 0, rek_author_id_order: 1 },
                    { rek_author_id: 100, rek_author_id_order: 2 },
                    { rek_author_id: 0, rek_author_id_order: 3 },
                    { rek_author_id: 1001, rek_author_id_order: 4 },
                ],
                fez_record_search_key_author_affiliation_name: [
                    {
                        rek_author_affiliation_name: 'Missing',
                        rek_author_affiliation_name_order: 1,
                    },
                    {
                        rek_author_affiliation_name: 'Missing',
                        rek_author_affiliation_name_order: 2,
                    },
                    {
                        rek_author_affiliation_name: 'Missing',
                        rek_author_affiliation_name_order: 3,
                    },
                    {
                        rek_author_affiliation_name: 'Missing',
                        rek_author_affiliation_name_order: 4,
                    },
                ],
                fez_record_search_key_author_affiliation_type: [
                    {
                        rek_author_affiliation_type: 0,
                        rek_author_affiliation_type_order: 1,
                    },
                    {
                        rek_author_affiliation_type: 0,
                        rek_author_affiliation_type_order: 2,
                    },
                    {
                        rek_author_affiliation_type: 0,
                        rek_author_affiliation_type_order: 3,
                    },
                    {
                        rek_author_affiliation_type: 0,
                        rek_author_affiliation_type_order: 4,
                    },
                ],
                fez_record_search_key_author_identifier: [],
                fez_record_search_key_author_identifier_type: [],
            });
        });

        it('should get authors search key for authors with affiliations', () => {
            const data = {
                authorsWithAffiliations: [
                    { nameAsPublished: 'Smith A.', disabled: false, selected: false, authorId: null },
                    { nameAsPublished: 'Smith B.', disabled: false, selected: true, authorId: 100 },
                    { nameAsPublished: 'Smith C.', disabled: false, selected: false, authorId: null },
                    { nameAsPublished: 'Smith D.', disabled: false, selected: false, aut_id: 1001 },
                ],
            };

            expect(transformers.getAuthorsSectionSearchKeys(data)).toEqual({
                // fez_author_affiliation should return array in this case as it indicates a valid work type
                fez_author_affiliation: [],
                fez_record_search_key_author: [
                    { rek_author: 'Smith A.', rek_author_order: 1 },
                    { rek_author: 'Smith B.', rek_author_order: 2 },
                    { rek_author: 'Smith C.', rek_author_order: 3 },
                    { rek_author: 'Smith D.', rek_author_order: 4 },
                ],
                fez_record_search_key_author_id: [
                    { rek_author_id: 0, rek_author_id_order: 1 },
                    { rek_author_id: 100, rek_author_id_order: 2 },
                    { rek_author_id: 0, rek_author_id_order: 3 },
                    { rek_author_id: 1001, rek_author_id_order: 4 },
                ],
                fez_record_search_key_author_affiliation_name: [
                    {
                        rek_author_affiliation_name: 'Missing',
                        rek_author_affiliation_name_order: 1,
                    },
                    {
                        rek_author_affiliation_name: 'Missing',
                        rek_author_affiliation_name_order: 2,
                    },
                    {
                        rek_author_affiliation_name: 'Missing',
                        rek_author_affiliation_name_order: 3,
                    },
                    {
                        rek_author_affiliation_name: 'Missing',
                        rek_author_affiliation_name_order: 4,
                    },
                ],
                fez_record_search_key_author_affiliation_type: [
                    {
                        rek_author_affiliation_type: 0,
                        rek_author_affiliation_type_order: 1,
                    },
                    {
                        rek_author_affiliation_type: 0,
                        rek_author_affiliation_type_order: 2,
                    },
                    {
                        rek_author_affiliation_type: 0,
                        rek_author_affiliation_type_order: 3,
                    },
                    {
                        rek_author_affiliation_type: 0,
                        rek_author_affiliation_type_order: 4,
                    },
                ],
                fez_record_search_key_author_identifier: [],
                fez_record_search_key_author_identifier_type: [],
            });
        });

        it('should get contributors search key', () => {
            const data = {
                editors: [
                    { nameAsPublished: 'Smith A.', disabled: false, selected: false, authorId: null },
                    { nameAsPublished: 'Smith B.', disabled: false, selected: true, authorId: 100 },
                    { nameAsPublished: 'Smith C.', disabled: false, selected: false, authorId: null },
                    { nameAsPublished: 'Smith D.', disabled: false, selected: false, aut_id: 1001 },
                ],
            };

            expect(transformers.getAuthorsSectionSearchKeys(data)).toEqual({
                fez_record_search_key_contributor: [
                    { rek_contributor: 'Smith A.', rek_contributor_order: 1 },
                    { rek_contributor: 'Smith B.', rek_contributor_order: 2 },
                    { rek_contributor: 'Smith C.', rek_contributor_order: 3 },
                    { rek_contributor: 'Smith D.', rek_contributor_order: 4 },
                ],
                fez_record_search_key_contributor_id: [
                    { rek_contributor_id: 0, rek_contributor_id_order: 1 },
                    { rek_contributor_id: 100, rek_contributor_id_order: 2 },
                    { rek_contributor_id: 0, rek_contributor_id_order: 3 },
                    { rek_contributor_id: 1001, rek_contributor_id_order: 4 },
                ],
            });
        });

        it('should get creators search key', () => {
            const data = {
                creators: [
                    { nameAsPublished: 'Smith A.', disabled: false, selected: false, authorId: null },
                    { nameAsPublished: 'Smith B.', disabled: false, selected: true, authorId: 100 },
                    { nameAsPublished: 'Smith C.', disabled: false, selected: false, authorId: null },
                    { nameAsPublished: 'Smith D.', disabled: false, selected: false, aut_id: 1001 },
                ],
            };

            expect(transformers.getAuthorsSectionSearchKeys(data)).toEqual({
                fez_record_search_key_creator: [
                    { rek_creator: 'Smith A.', rek_creator_order: 1 },
                    { rek_creator: 'Smith B.', rek_creator_order: 2 },
                    { rek_creator: 'Smith C.', rek_creator_order: 3 },
                    { rek_creator: 'Smith D.', rek_creator_order: 4 },
                ],
                fez_record_search_key_creator_id: [
                    { rek_creator_id: 0, rek_creator_id_order: 1 },
                    { rek_creator_id: 100, rek_creator_id_order: 2 },
                    { rek_creator_id: 0, rek_creator_id_order: 3 },
                    { rek_creator_id: 1001, rek_creator_id_order: 4 },
                ],
            });
        });

        it('should get architects search key', () => {
            const data = [
                { nameAsPublished: 'Smith A.' },
                { nameAsPublished: 'Smith B.' },
                { nameAsPublished: 'Smith C.' },
                { nameAsPublished: 'Smith D.' },
            ];

            expect(transformers.getRecordArchitectsSearchKey(data)).toEqual({
                fez_record_search_key_architect_name: [
                    { rek_architect_name: 'Smith A.', rek_architect_name_order: 1 },
                    { rek_architect_name: 'Smith B.', rek_architect_name_order: 2 },
                    { rek_architect_name: 'Smith C.', rek_architect_name_order: 3 },
                    { rek_architect_name: 'Smith D.', rek_architect_name_order: 4 },
                ],
            });
        });

        it('should get supervisors search key', () => {
            const data = {
                supervisors: [
                    { nameAsPublished: 'Smith A.' },
                    { nameAsPublished: 'Smith B.' },
                    { nameAsPublished: 'Smith C.' },
                    { nameAsPublished: 'Smith D.' },
                ],
            };

            expect(transformers.getAuthorsSectionSearchKeys(data)).toEqual({
                fez_record_search_key_supervisor: [
                    { rek_supervisor: 'Smith A.', rek_supervisor_order: 1 },
                    { rek_supervisor: 'Smith B.', rek_supervisor_order: 2 },
                    { rek_supervisor: 'Smith C.', rek_supervisor_order: 3 },
                    { rek_supervisor: 'Smith D.', rek_supervisor_order: 4 },
                ],
            });
        });

        it('should get creator role search key correctly', () => {
            const data = {
                authors: [
                    {
                        nameAsPublished: 'Smith A.',
                        creatorRole: 'Scientist',
                        disabled: false,
                        selected: false,
                        authorId: null,
                    },
                    {
                        nameAsPublished: 'Smith B.',
                        creatorRole: 'Scientist test',
                        disabled: false,
                        selected: true,
                        authorId: 100,
                    },
                    {
                        nameAsPublished: 'Smith C.',
                        creatorRole: 'Scientist testing',
                        disabled: false,
                        selected: false,
                        authorId: null,
                    },
                    {
                        nameAsPublished: 'Smith D.',
                        creatorRole: 'Scientist tester',
                        disabled: false,
                        selected: false,
                        aut_id: 1001,
                    },
                ],
            };

            expect(transformers.getAuthorsSectionSearchKeys(data)).toEqual({
                fez_author_affiliation: null,
                fez_record_search_key_author: [
                    { rek_author: 'Smith A.', rek_author_order: 1 },
                    { rek_author: 'Smith B.', rek_author_order: 2 },
                    { rek_author: 'Smith C.', rek_author_order: 3 },
                    { rek_author: 'Smith D.', rek_author_order: 4 },
                ],
                fez_record_search_key_author_id: [
                    { rek_author_id: 0, rek_author_id_order: 1 },
                    { rek_author_id: 100, rek_author_id_order: 2 },
                    { rek_author_id: 0, rek_author_id_order: 3 },
                    { rek_author_id: 1001, rek_author_id_order: 4 },
                ],
                fez_record_search_key_author_affiliation_name: [
                    {
                        rek_author_affiliation_name: 'Missing',
                        rek_author_affiliation_name_order: 1,
                    },
                    {
                        rek_author_affiliation_name: 'Missing',
                        rek_author_affiliation_name_order: 2,
                    },
                    {
                        rek_author_affiliation_name: 'Missing',
                        rek_author_affiliation_name_order: 3,
                    },
                    {
                        rek_author_affiliation_name: 'Missing',
                        rek_author_affiliation_name_order: 4,
                    },
                ],
                fez_record_search_key_author_affiliation_type: [
                    {
                        rek_author_affiliation_type: 0,
                        rek_author_affiliation_type_order: 1,
                    },
                    {
                        rek_author_affiliation_type: 0,
                        rek_author_affiliation_type_order: 2,
                    },
                    {
                        rek_author_affiliation_type: 0,
                        rek_author_affiliation_type_order: 3,
                    },
                    {
                        rek_author_affiliation_type: 0,
                        rek_author_affiliation_type_order: 4,
                    },
                ],
                fez_record_search_key_author_role: [
                    {
                        rek_author_role: 'Scientist',
                        rek_author_role_order: 1,
                    },
                    {
                        rek_author_role: 'Scientist test',
                        rek_author_role_order: 2,
                    },
                    {
                        rek_author_role: 'Scientist testing',
                        rek_author_role_order: 3,
                    },
                    {
                        rek_author_role: 'Scientist tester',
                        rek_author_role_order: 4,
                    },
                ],
                fez_record_search_key_author_identifier: [],
                fez_record_search_key_author_identifier_type: [],
            });
        });

        it('should get creator role search key correctly with correct order', () => {
            const data = {
                authors: [
                    {
                        nameAsPublished: 'Smith A.',
                        creatorRole: 'Scientist',
                        disabled: false,
                        selected: false,
                        authorId: null,
                    },
                    {
                        nameAsPublished: 'Smith B.',
                        creatorRole: 'Scientist test',
                        disabled: false,
                        selected: true,
                        authorId: 100,
                    },
                    {
                        nameAsPublished: 'Smith C.',
                        disabled: false,
                        selected: false,
                        authorId: null,
                    },
                    {
                        nameAsPublished: 'Smith D.',
                        creatorRole: 'Scientist tester',
                        disabled: false,
                        selected: false,
                        aut_id: 1001,
                    },
                ],
            };

            expect(transformers.getAuthorsSectionSearchKeys(data)).toEqual({
                fez_author_affiliation: null,
                fez_record_search_key_author: [
                    { rek_author: 'Smith A.', rek_author_order: 1 },
                    { rek_author: 'Smith B.', rek_author_order: 2 },
                    { rek_author: 'Smith C.', rek_author_order: 3 },
                    { rek_author: 'Smith D.', rek_author_order: 4 },
                ],
                fez_record_search_key_author_id: [
                    { rek_author_id: 0, rek_author_id_order: 1 },
                    { rek_author_id: 100, rek_author_id_order: 2 },
                    { rek_author_id: 0, rek_author_id_order: 3 },
                    { rek_author_id: 1001, rek_author_id_order: 4 },
                ],
                fez_record_search_key_author_affiliation_name: [
                    {
                        rek_author_affiliation_name: 'Missing',
                        rek_author_affiliation_name_order: 1,
                    },
                    {
                        rek_author_affiliation_name: 'Missing',
                        rek_author_affiliation_name_order: 2,
                    },
                    {
                        rek_author_affiliation_name: 'Missing',
                        rek_author_affiliation_name_order: 3,
                    },
                    {
                        rek_author_affiliation_name: 'Missing',
                        rek_author_affiliation_name_order: 4,
                    },
                ],
                fez_record_search_key_author_affiliation_type: [
                    {
                        rek_author_affiliation_type: 0,
                        rek_author_affiliation_type_order: 1,
                    },
                    {
                        rek_author_affiliation_type: 0,
                        rek_author_affiliation_type_order: 2,
                    },
                    {
                        rek_author_affiliation_type: 0,
                        rek_author_affiliation_type_order: 3,
                    },
                    {
                        rek_author_affiliation_type: 0,
                        rek_author_affiliation_type_order: 4,
                    },
                ],
                fez_record_search_key_author_role: [
                    {
                        rek_author_role: 'Scientist',
                        rek_author_role_order: 1,
                    },
                    {
                        rek_author_role: 'Scientist test',
                        rek_author_role_order: 2,
                    },
                    {
                        rek_author_role: 'Scientist tester',
                        rek_author_role_order: 4,
                    },
                ],
                fez_record_search_key_author_identifier: [],
                fez_record_search_key_author_identifier_type: [],
            });
        });
    });

    describe('getFilesSectionSearchKeys', () => {
        it('should get files section search keys', () => {
            const data = {
                advisoryStatement: {
                    htmlText: '<p>Test advisory statement</p>',
                    plainText: 'Test advisory statement',
                },
                sensitiveHandlingNote: {
                    id: SENSITIVE_HANDLING_NOTE_TYPE[0].value,
                    other: 'other',
                },
            };

            expect(transformers.getFilesSectionSearchKeys(data)).toEqual({
                fez_record_search_key_advisory_statement: {
                    rek_advisory_statement: '<p>Test advisory statement</p>',
                },
                fez_record_search_key_sensitive_handling_note_id: {
                    rek_sensitive_handling_note_id: data.sensitiveHandlingNote.id,
                },
                fez_record_search_key_sensitive_handling_note_other: null,
            });
        });

        it('should get files section search keys with sensitive handling note - other', () => {
            const data = {
                advisoryStatement: {
                    htmlText: '<p>Test advisory statement</p>',
                    plainText: 'Test advisory statement',
                },
                sensitiveHandlingNote: {
                    id: SENSITIVE_HANDLING_NOTE_OTHER_TYPE,
                    other: 'other',
                },
            };

            expect(transformers.getFilesSectionSearchKeys(data)).toEqual({
                fez_record_search_key_advisory_statement: {
                    rek_advisory_statement: '<p>Test advisory statement</p>',
                },
                fez_record_search_key_sensitive_handling_note_id: {
                    rek_sensitive_handling_note_id: data.sensitiveHandlingNote.id,
                },
                fez_record_search_key_sensitive_handling_note_other: {
                    rek_sensitive_handling_note_other: data.sensitiveHandlingNote.other,
                },
            });
        });

        it('should return empty object', () => {
            expect(transformers.getFilesSectionSearchKeys({})).toEqual({});
        });

        it('should return rest of the file section search keys', () => {
            const data = {
                fez_datastream_info: [{ dsi_dsid: 'file 1' }],
            };
            expect(transformers.getFilesSectionSearchKeys(data)).toEqual(data);
        });

        it('should be able to remove advisory search key', () => {
            const data = {
                advisoryStatement: {
                    htmlText: null,
                    plainText: null,
                },
            };

            expect(transformers.getFilesSectionSearchKeys(data)).toEqual({
                fez_record_search_key_advisory_statement: null,
                fez_record_search_key_sensitive_handling_note_id: null,
                fez_record_search_key_sensitive_handling_note_other: null,
            });
        });
    });

    describe('getRecordCreatorsIdSearchKey test', () => {
        it('should return empty creators request object', () => {
            expect(transformers.getRecordCreatorsIdSearchKey()).toEqual({});
        });

        it('should construct creators id object from component data', () => {
            const input = [
                { nameAsPublished: 'Smith A.', disabled: false, selected: false, authorId: null },
                { nameAsPublished: 'Smith B.', disabled: false, selected: true, authorId: 100 },
                { nameAsPublished: 'Smith C.', disabled: false, selected: false, authorId: null },
                { nameAsPublished: 'Smith D.', disabled: false, selected: false, aut_id: 1001 },
            ];
            const expected = {
                fez_record_search_key_creator_id: [
                    { rek_creator_id: 0, rek_creator_id_order: 1 },
                    { rek_creator_id: 100, rek_creator_id_order: 2 },
                    { rek_creator_id: 0, rek_creator_id_order: 3 },
                    { rek_creator_id: 1001, rek_creator_id_order: 4 },
                ],
            };
            const result = transformers.getRecordCreatorsIdSearchKey(input);
            expect(result).toEqual(expected);
        });

        it('should not modify creators object for original data', () => {
            const input = [
                { rek_creator_id: null, rek_creator_id_order: 1 },
                { rek_creator_id: 100, rek_creator_id_order: 2 },
                { rek_creator_id: null, rek_creator_id_order: 3 },
                { rek_creator_id: 1001, rek_creator_id_order: 4 },
            ];
            const expected = {
                fez_record_search_key_creator_id: [
                    { rek_creator_id: null, rek_creator_id_order: 1 },
                    { rek_creator_id: 100, rek_creator_id_order: 2 },
                    { rek_creator_id: null, rek_creator_id_order: 3 },
                    { rek_creator_id: 1001, rek_creator_id_order: 4 },
                ],
            };
            const result = transformers.getRecordCreatorsIdSearchKey(input);
            expect(result).toEqual(expected);
        });
    });

    describe('getRecordArchitectsIdSearchKey test', () => {
        it('should return empty architects request object', () => {
            expect(transformers.getRecordArchitectsIdSearchKey()).toEqual({});
        });

        it('should construct architects id object from component data', () => {
            const input = [
                { nameAsPublished: 'Smith A.', disabled: false, selected: false, authorId: null },
                { nameAsPublished: 'Smith B.', disabled: false, selected: true, authorId: 100 },
                { nameAsPublished: 'Smith C.', disabled: false, selected: false, authorId: null },
                { nameAsPublished: 'Smith D.', disabled: false, selected: false, aut_id: 1001 },
            ];
            const expected = {
                fez_record_search_key_architect_id: [
                    { rek_architect_id: 0, rek_architect_id_order: 1 },
                    { rek_architect_id: 100, rek_architect_id_order: 2 },
                    { rek_architect_id: 0, rek_architect_id_order: 3 },
                    { rek_architect_id: 1001, rek_architect_id_order: 4 },
                ],
            };
            const result = transformers.getRecordArchitectsIdSearchKey(input);
            expect(result).toEqual(expected);
        });

        it('should not modify architects object for original data', () => {
            const input = [
                { rek_architect_id: null, rek_architect_id_order: 1 },
                { rek_architect_id: 100, rek_architect_id_order: 2 },
                { rek_architect_id: null, rek_architect_id_order: 3 },
                { rek_architect_id: 1001, rek_architect_id_order: 4 },
            ];
            const expected = {
                fez_record_search_key_architect_id: [
                    { rek_architect_id: null, rek_architect_id_order: 1 },
                    { rek_architect_id: 100, rek_architect_id_order: 2 },
                    { rek_architect_id: null, rek_architect_id_order: 3 },
                    { rek_architect_id: 1001, rek_architect_id_order: 4 },
                ],
            };
            const result = transformers.getRecordArchitectsIdSearchKey(input);
            expect(result).toEqual(expected);
        });
    });

    describe('getNtroSectionSearchKeys', () => {
        it('should get all search keys for NTRO section', () => {
            const data = {
                qualityIndicators: [123, 234],
                significanceAndContributionStatement: [
                    {
                        rek_value: {
                            key: 12121,
                            value: {
                                htmlText: '<p>Test</p>',
                                plainText: 'Test',
                            },
                        },
                        rek_order: 1,
                    },
                ],
            };

            expect(transformers.getNtroSectionSearchKeys(data)).toEqual({
                fez_record_search_key_quality_indicator: [
                    {
                        rek_quality_indicator: 123,
                        rek_quality_indicator_order: 1,
                    },
                    {
                        rek_quality_indicator: 234,
                        rek_quality_indicator_order: 2,
                    },
                ],
                fez_record_search_key_significance: [
                    {
                        rek_significance: 12121,
                        rek_significance_order: 1,
                    },
                ],
                fez_record_search_key_creator_contribution_statement: [
                    {
                        rek_creator_contribution_statement: '<p>Test</p>',
                        rek_creator_contribution_statement_order: 1,
                    },
                ],
            });
        });

        it('should use plain text', () => {
            const data = {
                qualityIndicators: [123, 234],
                significanceAndContributionStatement: [
                    {
                        rek_value: {
                            key: 12121,
                            value: {
                                plainText: 'Test',
                            },
                        },
                        rek_order: 1,
                    },
                ],
            };

            expect(transformers.getNtroSectionSearchKeys(data)).toEqual({
                fez_record_search_key_quality_indicator: [
                    {
                        rek_quality_indicator: 123,
                        rek_quality_indicator_order: 1,
                    },
                    {
                        rek_quality_indicator: 234,
                        rek_quality_indicator_order: 2,
                    },
                ],
                fez_record_search_key_significance: [
                    {
                        rek_significance: 12121,
                        rek_significance_order: 1,
                    },
                ],
                fez_record_search_key_creator_contribution_statement: [
                    {
                        rek_creator_contribution_statement: 'Test',
                        rek_creator_contribution_statement_order: 1,
                    },
                ],
            });
        });
    });

    describe('getGrantInformationSectionSearchKeys', () => {
        it('should get grant information search keys', () => {
            expect(
                transformers.getGrantInformationSectionSearchKeys({
                    grants: [
                        {
                            grantAgencyName: 'Test',
                            grantAgencyType: 123,
                            grantId: '1234',
                        },
                    ],
                }),
            ).toEqual({
                fez_record_search_key_grant_agency: [
                    {
                        rek_grant_agency: 'Test',
                        rek_grant_agency_order: 1,
                    },
                ],
                fez_record_search_key_grant_id: [
                    {
                        rek_grant_id: '1234',
                        rek_grant_id_order: 1,
                    },
                ],
                fez_record_search_key_grant_agency_type: [
                    {
                        rek_grant_agency_type: 123,
                        rek_grant_agency_type_order: 1,
                    },
                ],
            });
        });
    });

    describe('getRecordIsDatasetOfSearchKey', () => {
        it('should return empty object', () => {
            expect(transformers.getRecordIsDatasetOfSearchKey()).toEqual({});
        });

        it('should get is dataset of search keys', () => {
            expect(
                transformers.getRecordIsDatasetOfSearchKey([
                    {
                        rek_isdatasetof: 'UQ:111111',
                        rek_isdatasetof_order: 1,
                    },
                ]),
            ).toEqual({
                fez_record_search_key_isdatasetof: [
                    {
                        rek_isdatasetof: 'UQ:111111',
                        rek_isdatasetof_order: 1,
                    },
                ],
            });
        });

        it('should get is dataset of search keys from default values', () => {
            expect(
                transformers.getRecordIsDatasetOfSearchKey([
                    {
                        rek_isdatasetof: { id: 'UQ:121212', value: 'Testing dataset' },
                        rek_isdatasetof_order: 1,
                    },
                ]),
            ).toEqual({
                fez_record_search_key_isdatasetof: [
                    {
                        rek_isdatasetof: 'UQ:121212',
                        rek_isdatasetof_order: 1,
                    },
                ],
            });
        });
    });

    describe('getNotesSectionSearchKeys', () => {
        it('should get search key for any internal notes entered, with CI true', () => {
            const expected = {
                fez_internal_notes: {
                    ain_detail: '<p>This is test internal note</p>',
                },

                rek_ci_notice_attribution_incomplete: 1,
            };

            expect(
                transformers.getNotesSectionSearchKeys({
                    internalNotes: {
                        htmlText: '<p>This is test internal note</p>',
                        plainText: 'This is test internal note',
                    },
                    rek_ci_notice_attribution_incomplete: true,
                }),
            ).toEqual(expected);
        });
        it('should get search key for any internal notes entered, with CI false', () => {
            const expected = {
                fez_internal_notes: {
                    ain_detail: '<p>This is test internal note</p>',
                },

                rek_ci_notice_attribution_incomplete: 0,
            };

            expect(
                transformers.getNotesSectionSearchKeys({
                    internalNotes: {
                        htmlText: '<p>This is test internal note</p>',
                        plainText: 'This is test internal note',
                    },
                    rek_ci_notice_attribution_incomplete: false,
                }),
            ).toEqual(expected);
        });

        it('should get search key for any internal notes empty', () => {
            expect(transformers.getNotesSectionSearchKeys()).toEqual({
                fez_internal_notes: null,
            });
        });

        it('should get search key for any additional notes entered', () => {
            const expected = {
                fez_record_search_key_notes: {
                    rek_notes: '<p>This is test additional note</p>',
                },
                fez_internal_notes: null,
            };

            expect(
                transformers.getNotesSectionSearchKeys({
                    additionalNotes: {
                        htmlText: '<p>This is test additional note</p>',
                        plainText: 'This is test additional note',
                    },
                }),
            ).toEqual(expected);
        });
    });

    describe('getChangeSearchKeyValues', () => {
        describe('should correcty transform search key values for search key', () => {
            it('fez_record_search_key_oa_status.rek_oa_status', () => {
                expect(
                    transformers.getChangeSearchKeyValues(
                        [
                            { rek_pid: 'UQ:111111', fez_record_search_key_oa_status: null },
                            {
                                rek_pid: 'UQ:222222',
                                fez_record_search_key_oa_status: { rek_oa_status: 123456, rek_oa_status_id: 99999 },
                            },
                        ],
                        {
                            search_key: 'fez_record_search_key_oa_status.rek_oa_status',
                            fez_record_search_key_oa_status: {
                                rek_oa_status: 222222,
                            },
                            edit_reason: 'test reason',
                        },
                    ),
                ).toEqual([
                    {
                        rek_pid: 'UQ:111111',
                        fez_record_search_key_oa_status: { rek_oa_status: 222222 },
                        edit_reason: 'test reason',
                    },
                    {
                        rek_pid: 'UQ:222222',
                        fez_record_search_key_oa_status: { rek_oa_status: 222222, rek_oa_status_id: 99999 },
                        edit_reason: 'test reason',
                    },
                ]);
            });

            it('rek_scopus_doc_type', () => {
                expect(
                    transformers.getChangeSearchKeyValues(
                        [
                            { rek_pid: 'UQ:111111', rek_scopus_doc_type: null },
                            {
                                rek_pid: 'UQ:222222',
                                rek_scopus_doc_type: 'ab',
                            },
                        ],
                        {
                            search_key: 'rek_scopus_doc_type',
                            rek_scopus_doc_type: 'ar',
                            edit_reason: 'test reason',
                        },
                    ),
                ).toEqual([
                    { rek_pid: 'UQ:111111', rek_scopus_doc_type: 'ar', edit_reason: 'test reason' },
                    { rek_pid: 'UQ:222222', rek_scopus_doc_type: 'ar', edit_reason: 'test reason' },
                ]);
            });

            it('rek_wok_doc_type', () => {
                expect(
                    transformers.getChangeSearchKeyValues(
                        [
                            { rek_pid: 'UQ:111111', rek_wok_doc_type: null },
                            {
                                rek_pid: 'UQ:222222',
                                rek_wok_doc_type: 'A',
                            },
                        ],
                        {
                            search_key: 'rek_wok_doc_type',
                            rek_wok_doc_type: '@',
                            edit_reason: 'test reason',
                        },
                    ),
                ).toEqual([
                    { rek_pid: 'UQ:111111', rek_wok_doc_type: '@', edit_reason: 'test reason' },
                    { rek_pid: 'UQ:222222', rek_wok_doc_type: '@', edit_reason: 'test reason' },
                ]);
            });

            it('fez_record_search_key_org_unit_name.rek_org_unit_name', () => {
                expect(
                    transformers.getChangeSearchKeyValues(
                        [
                            { rek_pid: 'UQ:111111', fez_record_search_key_org_unit_name: null },
                            {
                                rek_pid: 'UQ:222222',
                                fez_record_search_key_org_unit_name: {
                                    rek_org_unit_name: 'School of economics',
                                    rek_org_unit_name_id: 99999,
                                },
                            },
                        ],
                        {
                            search_key: 'fez_record_search_key_org_unit_name.rek_org_unit_name',
                            fez_record_search_key_org_unit_name: {
                                rek_org_unit_name: 'School of science',
                            },
                            edit_reason: 'test reason',
                        },
                    ),
                ).toEqual([
                    {
                        rek_pid: 'UQ:111111',
                        fez_record_search_key_org_unit_name: { rek_org_unit_name: 'School of science' },
                        edit_reason: 'test reason',
                    },
                    {
                        rek_pid: 'UQ:222222',
                        fez_record_search_key_org_unit_name: {
                            rek_org_unit_name: 'School of science',
                            rek_org_unit_name_id: 99999,
                        },
                        edit_reason: 'test reason',
                    },
                ]);
            });

            it('fez_record_search_key_notes.rek_notes', () => {
                expect(
                    transformers.getChangeSearchKeyValues(
                        [
                            { rek_pid: 'UQ:111111', fez_record_search_key_notes: null },
                            {
                                rek_pid: 'UQ:222222',
                                fez_record_search_key_notes: {
                                    rek_notes: '<p>initial notes</p>',
                                    rek_notes_id: 99999,
                                },
                            },
                        ],
                        {
                            search_key: 'fez_record_search_key_notes.rek_notes',
                            fez_record_search_key_notes: {
                                rek_notes: '<p>initial notes</p>',
                            },
                            edit_reason: 'test reason',
                        },
                    ),
                ).toEqual([
                    {
                        rek_pid: 'UQ:111111',
                        fez_record_search_key_notes: { rek_notes: '<p>initial notes</p>' },
                        edit_reason: 'test reason',
                    },
                    {
                        rek_pid: 'UQ:222222',
                        fez_record_search_key_notes: {
                            rek_notes: '<p>initial notes</p><p>initial notes</p>',
                            rek_notes_id: 99999,
                        },
                        edit_reason: 'test reason',
                    },
                ]);
            });

            it('fez_record_search_key_series.rek_series', () => {
                expect(
                    transformers.getChangeSearchKeyValues(
                        [
                            { rek_pid: 'UQ:111111', fez_record_search_key_series: null },
                            {
                                rek_pid: 'UQ:222222',
                                fez_record_search_key_series: { rek_series: 'Test series', rek_series_id: 99999 },
                            },
                        ],
                        {
                            search_key: 'fez_record_search_key_series.rek_series',
                            fez_record_search_key_series: {
                                rek_series: 'Testing series',
                            },
                            edit_reason: 'test reason',
                        },
                    ),
                ).toEqual([
                    {
                        rek_pid: 'UQ:111111',
                        fez_record_search_key_series: { rek_series: 'Testing series' },
                        edit_reason: 'test reason',
                    },
                    {
                        rek_pid: 'UQ:222222',
                        fez_record_search_key_series: { rek_series: 'Testing series', rek_series_id: 99999 },
                        edit_reason: 'test reason',
                    },
                ]);
            });

            it('fez_record_search_key_rights.rek_rights', () => {
                expect(
                    transformers.getChangeSearchKeyValues(
                        [
                            { rek_pid: 'UQ:111111', fez_record_search_key_rights: null },
                            {
                                rek_pid: 'UQ:222222',
                                fez_record_search_key_rights: { rek_rights: 'Test', rek_rights_id: 99999 },
                            },
                        ],
                        {
                            search_key: 'fez_record_search_key_rights.rek_rights',
                            fez_record_search_key_rights: {
                                rek_rights: 'Testing',
                            },
                            edit_reason: 'test reason',
                        },
                    ),
                ).toEqual([
                    {
                        rek_pid: 'UQ:111111',
                        fez_record_search_key_rights: { rek_rights: 'Testing' },
                        edit_reason: 'test reason',
                    },
                    {
                        rek_pid: 'UQ:222222',
                        fez_record_search_key_rights: { rek_rights: 'Testing', rek_rights_id: 99999 },
                        edit_reason: 'test reason',
                    },
                ]);
            });
        });
    });

    describe('getChangeAuthorIdValues', () => {
        it('should correctly transform author id values', () => {
            expect(
                transformers.getChangeAuthorIdValues(
                    [
                        {
                            rek_pid: 'UQ:11111',
                            fez_record_search_key_author: [
                                {
                                    rek_author: 'Test',
                                    rek_author_order: 1,
                                },
                                {
                                    rek_author: 'Testing',
                                    rek_author_order: 2,
                                },
                            ],
                            fez_record_search_key_author_id: [
                                {
                                    rek_author_id: null,
                                },
                                {
                                    rek_author_id: null,
                                },
                            ],
                        },
                        {
                            rek_pid: 'UQ:22222',
                            fez_record_search_key_author: [
                                {
                                    rek_author: 'Testing',
                                    rek_author_order: 1,
                                },
                            ],
                            fez_record_search_key_author_id: [
                                {
                                    rek_author_id: 123,
                                    rek_author_id_order: 1,
                                    rek_author_id_id: 999,
                                },
                            ],
                        },
                        {
                            rek_pid: 'UQ:33333',
                            fez_record_search_key_author: [
                                {
                                    rek_author: 'Test',
                                    rek_author_order: 1,
                                },
                            ],

                            fez_record_search_key_author_id: [
                                {
                                    rek_author_id: null,
                                },
                            ],
                        },
                    ],
                    {
                        search_author_by: 'author',
                        search_author: {
                            author: 'Testing',
                        },
                        rek_author_id: 1234,
                    },
                ),
            ).toEqual([
                {
                    rek_pid: 'UQ:11111',
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id: null,
                        },
                        {
                            rek_author_id: 1234,
                            rek_author_id_order: 2,
                        },
                    ],
                },
                {
                    rek_pid: 'UQ:22222',
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id: 1234,
                            rek_author_id_order: 1,
                            rek_author_id_id: 999,
                        },
                    ],
                },
                {
                    rek_pid: 'UQ:33333',
                },
            ]);
        });
    });

    describe('getChangeAuthorIdValues', () => {
        it('should correctly transform author id values', () => {
            expect(
                transformers.getChangeAuthorIdValues(
                    [
                        {
                            rek_pid: 'UQ:11111',
                            fez_record_search_key_author: [
                                {
                                    rek_author: 'Test',
                                    rek_author_order: 1,
                                },
                                {
                                    rek_author: 'Testing',
                                    rek_author_order: 2,
                                },
                            ],
                            fez_record_search_key_author_id: [
                                {
                                    rek_author_id: null,
                                },
                                {
                                    rek_author_id: null,
                                },
                            ],
                        },
                        {
                            rek_pid: 'UQ:22222',
                            fez_record_search_key_author: [
                                {
                                    rek_author: 'Testing',
                                    rek_author_order: 1,
                                },
                            ],
                            fez_record_search_key_author_id: [
                                {
                                    rek_author_id: 123,
                                    rek_author_id_order: 1,
                                    rek_author_id_id: 999,
                                },
                            ],
                        },
                        {
                            rek_pid: 'UQ:33333',
                            fez_record_search_key_author: [
                                {
                                    rek_author: 'Test',
                                    rek_author_order: 1,
                                },
                            ],

                            fez_record_search_key_author_id: [
                                {
                                    rek_author_id: null,
                                },
                            ],
                        },
                    ],
                    {
                        search_author_by: 'author',
                        search_author: {
                            author: 'Testing',
                        },
                        rek_author_id: 1234,
                    },
                ),
            ).toEqual([
                {
                    rek_pid: 'UQ:11111',
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id: null,
                        },
                        {
                            rek_author_id: 1234,
                            rek_author_id_order: 2,
                        },
                    ],
                },
                {
                    rek_pid: 'UQ:22222',
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id: 1234,
                            rek_author_id_order: 1,
                            rek_author_id_id: 999,
                        },
                    ],
                },
                {
                    rek_pid: 'UQ:33333',
                },
            ]);
        });
    });

    describe('getCopyToCollectionData', () => {
        it('should correctly transform data for copy to collection', () => {
            expect(
                transformers.getCopyToCollectionData(
                    [
                        {
                            rek_pid: 'UQ:11111',
                            fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:123', rek_ismemberof_order: 1 }],
                        },
                    ],
                    {
                        search_key: 'rek_ismemberof',
                        collections: [{ rek_pid: 'UQ:234' }],
                    },
                ),
            ).toEqual([
                {
                    rek_pid: 'UQ:11111',
                    fez_record_search_key_ismemberof: [
                        { rek_ismemberof: 'UQ:123', rek_ismemberof_order: 1 },
                        {
                            rek_ismemberof: 'UQ:234',
                            rek_ismemberof_order: 2,
                        },
                    ],
                },
            ]);
        });

        it('should reorder transform data', () => {
            expect(
                transformers.getCopyToCollectionData(
                    [
                        {
                            rek_pid: 'UQ:11111',
                            fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:123', rek_ismemberof_order: 2 }],
                        },
                    ],
                    {
                        search_key: 'rek_ismemberof',
                        collections: [{ rek_pid: 'UQ:234' }],
                    },
                ),
            ).toEqual([
                {
                    rek_pid: 'UQ:11111',
                    fez_record_search_key_ismemberof: [
                        { rek_ismemberof: 'UQ:123', rek_ismemberof_order: 1 },
                        {
                            rek_ismemberof: 'UQ:234',
                            rek_ismemberof_order: 2,
                        },
                    ],
                },
            ]);
        });

        it('should not add duplicated collections', () => {
            expect(
                transformers.getCopyToCollectionData(
                    [
                        {
                            rek_pid: 'UQ:11111',
                            fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:123', rek_ismemberof_order: 2 }],
                        },
                    ],
                    {
                        search_key: 'rek_ismemberof',
                        collections: [{ rek_pid: 'UQ:123' }],
                    },
                ),
            ).toEqual([
                {
                    rek_pid: 'UQ:11111',
                    fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:123', rek_ismemberof_order: 1 }],
                },
            ]);
        });
    });

    describe('getCopyToCommunityData', () => {
        it('should correctly transform data for copy to community', () => {
            expect(
                transformers.getCopyToCommunityData(
                    [
                        {
                            rek_pid: 'UQ:11111',
                            fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:123', rek_ismemberof_order: 1 }],
                        },
                    ],
                    {
                        search_key: 'rek_ismemberof',
                        communities: [{ rek_pid: 'UQ:234' }],
                    },
                ),
            ).toEqual([
                {
                    rek_pid: 'UQ:11111',
                    fez_record_search_key_ismemberof: [
                        { rek_ismemberof: 'UQ:123', rek_ismemberof_order: 1 },
                        {
                            rek_ismemberof: 'UQ:234',
                            rek_ismemberof_order: 2,
                        },
                    ],
                },
            ]);
        });
    });

    describe('getRemoveFromCollectionData', () => {
        it('should correctly transform data for remove from collection', () => {
            expect(
                transformers.getRemoveFromCollectionData(
                    [
                        {
                            rek_pid: 'UQ:11111',
                            fez_record_search_key_ismemberof: [
                                { rek_ismemberof: 'UQ:123', rek_ismemberof_order: 1 },
                                { rek_ismemberof: 'UQ:234', rek_ismemberof_order: 2 },
                            ],
                        },
                    ],
                    {
                        search_key: 'rek_ismemberof',
                        collections: [{ rek_pid: 'UQ:234' }],
                    },
                ),
            ).toEqual([
                {
                    rek_pid: 'UQ:11111',
                    fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:123', rek_ismemberof_order: 1 }],
                },
            ]);
        });

        it('should correctly reorder transform data', () => {
            expect(
                transformers.getRemoveFromCollectionData(
                    [
                        {
                            rek_pid: 'UQ:11111',
                            fez_record_search_key_ismemberof: [
                                { rek_ismemberof: 'UQ:123', rek_ismemberof_order: 1 },
                                { rek_ismemberof: 'UQ:234', rek_ismemberof_order: 2 },
                            ],
                        },
                    ],
                    {
                        search_key: 'rek_ismemberof',
                        collections: [{ rek_pid: 'UQ:123' }],
                    },
                ),
            ).toEqual([
                {
                    rek_pid: 'UQ:11111',
                    fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:234', rek_ismemberof_order: 1 }],
                },
            ]);
        });
    });

    describe('getRemoveFromCommunityData', () => {
        it('should correctly transform data for remove from collection', () => {
            expect(
                transformers.getRemoveFromCommunityData(
                    [
                        {
                            rek_pid: 'UQ:11111',
                            fez_record_search_key_ismemberof: [
                                { rek_ismemberof: 'UQ:123', rek_ismemberof_order: 1 },
                                { rek_ismemberof: 'UQ:234', rek_ismemberof_order: 2 },
                            ],
                        },
                    ],
                    {
                        search_key: 'rek_ismemberof',
                        communities: [{ rek_pid: 'UQ:234' }],
                    },
                ),
            ).toEqual([
                {
                    rek_pid: 'UQ:11111',
                    fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:123', rek_ismemberof_order: 1 }],
                },
            ]);
        });
    });

    describe('getBibliographicSection for thesis', () => {
        it('should correctly transform data for thesis rek_subtype and rek_genre_type', () => {
            const data = {
                rek_genre_type: 'B.A. Thesis',
            };

            expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
                rek_date: PLACEHOLDER_ISO8601_DATE,
                rek_description: null,
                rek_formatted_abstract: null,
                fez_record_search_key_language: [
                    {
                        rek_language: 'eng',
                        rek_language_order: 1,
                    },
                ],
                rek_subtype: 'B.A. Thesis',
                rek_genre_type: 'B.A. Thesis',
            });
        });
    });

    describe('getHerdcCodeSearchKey', () => {
        it('should correctly transform data for category code', () => {
            expect(transformers.getHerdcCodeSearchKey({ rek_herdc_code: '0' })).toEqual({
                fez_record_search_key_herdc_code: {
                    rek_herdc_code: null,
                },
            });
        });
    });

    describe('getOpenAccessStatusTypeSearchKey', () => {
        it('should correctly transform data for OA status type', () => {
            expect(transformers.getOpenAccessStatusTypeSearchKey({ rek_oa_status_type: '0' })).toEqual({
                fez_record_search_key_oa_status_type: null,
            });
        });
    });

    describe('createOrUpdateDoi', () => {
        it('should correctly transform data', () => {
            const record = [{ rek_pid: 'UQ:1' }];
            expect(transformers.createOrUpdateDoi(record)).toEqual([
                {
                    ...record[0],
                    fez_record_search_key_doi: { rek_doi: true },
                },
            ]);
        });
    });

    describe('reasonForEdit', () => {
        it('should correctly transform data', () => {
            const record = { reason: 'This is a test reason' };
            expect(transformers.getReasonSectionSearchKeys(record)).toEqual({
                ...record,
            });
            expect(transformers.getReasonSectionSearchKeys({})).toEqual({});
        });
    });

    // describe('Cultural Institution Notices', () => {
    //     it('should correctly transform CI data', () => {
    //         const record = { ciNotices: { rek_ci_notice_attribution_incomplete: true } };
    //         // console.log(transformers.getNotesSectionSearchKeys(record));
    //         expect(transformers.getNotesSectionSearchKeys(record)).toEqual({
    //             // fez_internal_notes: null,
    //             fez_record_search_key_ci_notice_attribution_incomplete:
    // { rek_ci_notice_attribution_incomplete: true },
    //         });

    //         expect(transformers.getNotesSectionSearchKeys({})).toEqual({});
    //     });
    // });

    describe('cleanDatastreamsObject', () => {
        it('should return nothing if no data provided', () => {
            expect(transformers.cleanDatastreamsObject()).toEqual({});
        });

        it('should return the same data object if dsi_dsid_new prop is not present', () => {
            expect(transformers.cleanDatastreamsObject([{ test: 'ok' }])).toEqual([{ test: 'ok' }]);
        });

        it('should return an object with swapped dsi_dsid and dsi_dsid_new props', () => {
            expect(
                transformers.cleanDatastreamsObject([{ dsi_dsid: 'renamed.jpg', dsi_dsid_new: 'original.jpg' }]),
            ).toEqual([{ dsi_dsid: 'original.jpg', dsi_dsid_new: 'renamed.jpg' }]);
        });

        it('should return an object with deleted dsi_dsid_new if it matches value of dsi_dsid', () => {
            expect(
                transformers.cleanDatastreamsObject([{ dsi_dsid: 'original.jpg', dsi_dsid_new: 'original.jpg' }]),
            ).toEqual([{ dsi_dsid: 'original.jpg' }]);
        });
    });

    describe('getCollectionViewType', () => {
        it('should return undefined if record is undefined', () => {
            expect(transformers.getCollectionViewType()).toMatchObject({});
        });

        it('should return undefined if record is null', () => {
            expect(transformers.getCollectionViewType(null)).toMatchObject({});
        });

        it('should return undefined if record is an empty object', () => {
            expect(transformers.getCollectionViewType({})).toMatchObject({});
        });

        it('should return empty object if record contains an undefined rek_collection_view_type property', () => {
            expect(transformers.getCollectionViewType({ rek_collection_view_type: undefined })).toMatchObject({});
        });

        it('should return empty object if record contains an empty object for the rek_collection_view_type property', () => {
            expect(transformers.getCollectionViewType({ rek_collection_view_type: {} })).toMatchObject({});
        });

        it('should return a formatted object if the record contains a valid rek_collection_view_type property', () => {
            expect(transformers.getCollectionViewType({ rek_collection_view_type: 123 })).toMatchObject({
                fez_record_search_key_collection_view_type: { rek_collection_view_type: 123 },
            });
        });
    });
});
