jest.dontMock('./transformers');

import React from 'react';
import * as transformers from './transformers';

describe('Transformers tests ', () => {

    it('getClaimAttachmentsSearchKey returns empty object if no files are attached', () => {
        const input = null;
        const expected = {};
        const result = transformers.getClaimAttachmentsSearchKey(input);
        expect(result).toEqual(expected);
    });

    it('getClaimAttachmentsSearchKey returns request object structure', () => {
        const files = [
            {
                access_condition_id: 1,
                name: 'file.txt',
                date: '2017-10-01'
            },
            {
                access_condition_id: 2,
                name: 'file2.txt'
            }
        ];
        const expected = {
            attachments: [
                {
                    access_condition_id: 1,
                    file: 'file.txt',
                    date: '2017-10-01'
                },
                {
                    access_condition_id: 2,
                    file: 'file2.txt'
                }
            ]
        };
        const result = transformers.getClaimAttachmentsSearchKey(files);
        expect(result).toEqual(expected);
    });

    it('getClaimRequest returns request object structure with comments and files', () => {
        const data = {
            publication: {rek_pid: 'PID:12345'},
            author: {aut_id: 111},
            comments: 'Test comment',
            files: {
                queue: [
                    {
                        access_condition_id: 1,
                        name: 'file.txt',
                        date: '2017-10-01'
                    },
                    {
                        access_condition_id: 2,
                        name: 'file2.txt'
                    }
                ]
            }
        };
        const expected = {
            pid: 'PID:12345',
            author_id: 111,
            attachments: [
                {
                    access_condition_id: 1,
                    file: 'file.txt',
                    date: '2017-10-01'
                },
                {
                    access_condition_id: 2,
                    file: 'file2.txt'
                }
            ],
            comments: 'Test comment'
        };
        const result = transformers.getClaimRequest(data);
        expect(result).toEqual(expected);
    });

    it('getClaimRequest returns request object structure without comments and files', () => {
        const data = {
            publication: {rek_pid: 'PID:12345'},
            author: {aut_id: 111}
        };
        const expected = {
            pid: 'PID:12345',
            author_id: 111
        };
        const result = transformers.getClaimRequest(data);
        expect(result).toEqual(expected);
    });

    it('getRecordLinkSearchKey returns request object structure with link', () => {
        const data = {
            rek_link: 'http://google.com'
        };
        const expected = {
            fez_record_search_key_link: [
                {
                    rek_link: 'http://google.com',
                    rek_link_order: 0
                }
            ],
            fez_record_search_key_link_description: [
                {
                    rek_link_description: 'http://google.com',
                    rek_link_description_order: 0
                }
            ]
        };
        const result = transformers.getRecordLinkSearchKey(data);
        expect(result).toEqual(expected);
    });

    it('getRecordLinkSearchKey returns empty request object structure if no link is provided', () => {
        const data = {};
        const expected = null;
        const result = transformers.getRecordLinkSearchKey(data);
        expect(result).toEqual(expected);
    });

    it('getRecordFileAttachmentSearchKey returns empty request object structure if no files are provided', () => {
        const files = [];
        const record = {};
        const expected = {};
        const result = transformers.getRecordFileAttachmentSearchKey(files, record);
        expect(result).toEqual(expected);
    });

    it('getRecordFileAttachmentSearchKey returns request object structure for files', () => {
        const files = [
            {
                access_condition_id: 1,
                name: 'file.txt',
                date: '2017-10-01'
            },
            {
                access_condition_id: 2,
                name: 'file2.txt'
            }
        ];
        const record = {};
        const expected = {
            fez_record_search_key_file_attachment_name: [
                {
                    rek_file_attachment_name: 'file.txt',
                    rek_file_attachment_name_order: 1
                },
                {
                    rek_file_attachment_name: 'file2.txt',
                    rek_file_attachment_name_order: 2
                }
            ],
            fez_record_search_key_file_attachment_embargo_date: [
                {
                    rek_file_attachment_embargo_date: '2017-10-01',
                    rek_file_attachment_embargo_date_order: 1
                }
            ],
            fez_record_search_key_file_attachment_access_condition: [
                {
                    rek_file_attachment_access_condition: 1,
                    rek_file_attachment_access_condition_order: 1
                },
                {
                    rek_file_attachment_access_condition: 2,
                    rek_file_attachment_access_condition_order: 2
                }
            ]
        };
        const result = transformers.getRecordFileAttachmentSearchKey(files, record);
        expect(result).toEqual(expected);
    });

    it('getRecordFileAttachmentSearchKey returns request object structure for files and existing files in record', () => {
        const files = [
            {
                access_condition_id: 1,
                name: 'file.txt',
                date: '2017-10-01'
            },
            {
                access_condition_id: 2,
                name: 'file2.txt'
            }
        ];
        const record = {
            "fez_record_search_key_file_attachment_access_condition": [],
            "fez_record_search_key_file_attachment_embargo_date": [],
            "fez_record_search_key_file_attachment_name": [{
                "rek_file_attachment_name_id": null,
                "rek_file_attachment_name_pid": "UQ:676287",
                "rek_file_attachment_name": "FezACML_UQ676287_OA.pdf.xml",
                "rek_file_attachment_name_order": 1
            }]
        };
        const expected = {
            fez_record_search_key_file_attachment_name: [
                {
                    "rek_file_attachment_name_id": null,
                    "rek_file_attachment_name_pid": "UQ:676287",
                    "rek_file_attachment_name": "FezACML_UQ676287_OA.pdf.xml",
                    "rek_file_attachment_name_order": 1
                },
                {
                    rek_file_attachment_name: 'file.txt',
                    rek_file_attachment_name_order: 2
                },
                {
                    rek_file_attachment_name: 'file2.txt',
                    rek_file_attachment_name_order: 3
                }
            ],
            fez_record_search_key_file_attachment_embargo_date: [
                {
                    rek_file_attachment_embargo_date: '2017-10-01',
                    rek_file_attachment_embargo_date_order: 2
                }
            ],
            fez_record_search_key_file_attachment_access_condition: [
                {
                    rek_file_attachment_access_condition: 1,
                    rek_file_attachment_access_condition_order: 2
                },
                {
                    rek_file_attachment_access_condition: 2,
                    rek_file_attachment_access_condition_order: 3
                }
            ]
        };
        const result = transformers.getRecordFileAttachmentSearchKey(files, record);
        expect(result).toEqual(expected);
    });

});
