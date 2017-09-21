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
        const record = null;
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

    it('getRecordFileAttachmentSearchKey returns request object structure for files and empty record', () => {
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
            "fez_record_search_key_file_attachment_name": []
        };
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

    it('getRecordAuthorsSearchKey returns empty request object', () => {
        const input = [];
        const expected = {};
        const result = transformers.getRecordAuthorsSearchKey(input);
        expect(result).toEqual(expected);
    });

    it('getRecordAuthorsSearchKey returns request object', () => {
        const input = [
            {nameAsPublished: "Smith A.", disabled: false, selected: false, authorId: null},
            {nameAsPublished: "Smith B.", disabled: false, selected: true, authorId: 100},
            {nameAsPublished: "Smith C.", disabled: false, selected: false, authorId: null}
        ];
        const expected = {
            fez_record_search_key_author: [
                {
                    rek_author_id: null,
                    rek_author: 'Smith A.',
                    rek_author_order: 1
                },
                {
                    rek_author_id: null,
                    rek_author: 'Smith B.',
                    rek_author_order: 2
                },
                {
                    rek_author_id: null,
                    rek_author: 'Smith C.',
                    rek_author_order: 3
                }
            ]
        };
        const result = transformers.getRecordAuthorsSearchKey(input);
        expect(result).toEqual(expected);
    });

    it('getRecordAuthorsIdSearchKey returns empty request object', () => {
        const input = [];
        const expected = {};
        const result = transformers.getRecordAuthorsIdSearchKey(input);
        expect(result).toEqual(expected);
    });

    it('getRecordAuthorsIdSearchKey returns request object', () => {
        const input = [
            {nameAsPublished: "Smith A.", disabled: false, selected: false, authorId: null},
            {nameAsPublished: "Smith B.", disabled: false, selected: true, authorId: 100},
            {nameAsPublished: "Smith C.", disabled: false, selected: false, authorId: null},
            {nameAsPublished: "Smith D.", disabled: false, selected: false, aut_id: 1001}
        ];
        const expected = {
            fez_record_search_key_author_id: [
                { rek_author_id: null, rek_author_id_order: 1 },
                { rek_author_id: 100, rek_author_id_order: 2 },
                { rek_author_id: null, rek_author_id_order: 3 },
                { rek_author_id: 1001, rek_author_id_order: 4 }
            ]
        };
        const result = transformers.getRecordAuthorsIdSearchKey(input);
        expect(result).toEqual(expected);
    });

    it('getRecordAuthorsIdSearchKey returns request object for alternative format', () => {
        const input = [
            {rek_author_id_id: null, rek_author_id_pid: "UQ:678742", rek_author_id: 683, rek_author_id_order: 12},
            {rek_author_id_id: null, rek_author_id_pid: "UQ:678741", rek_author_id: 0, rek_author_id_order: 13},
            {rek_author_id_id: null, rek_author_id_pid: "UQ:678740", rek_author_id: 0, rek_author_id_order: 14},
        ];
        const expected = {
            fez_record_search_key_author_id: [
                {rek_author_id_id: null, rek_author_id_pid: "UQ:678742", rek_author_id: 683, rek_author_id_order: 12},
                {rek_author_id_id: null, rek_author_id_pid: "UQ:678741", rek_author_id: 0, rek_author_id_order: 13},
                {rek_author_id_id: null, rek_author_id_pid: "UQ:678740", rek_author_id: 0, rek_author_id_order: 14}
            ]
        };
        const result = transformers.getRecordAuthorsIdSearchKey(input);
        expect(result).toEqual(expected);
    });

    it('getRecordContributorsSearchKey returns empty request object', () => {
        const input = [];
        const expected = {};
        const result = transformers.getRecordContributorsSearchKey(input);
        expect(result).toEqual(expected);
    });

    it('getRecordContributorsSearchKey returns request object', () => {
        const input = [
            {nameAsPublished: "Smith A.", disabled: false, selected: false, authorId: null},
            {nameAsPublished: "Smith B.", disabled: false, selected: true, authorId: 100},
            {nameAsPublished: "Smith C.", disabled: false, selected: false, authorId: null}
        ];
        const expected = {
            fez_record_search_key_contributor: [
                {
                    rek_contributor_id: null,
                    rek_contributor: 'Smith A.',
                    rek_contributor_order: 1
                },
                {
                    rek_contributor_id: null,
                    rek_contributor: 'Smith B.',
                    rek_contributor_order: 2
                },
                {
                    rek_contributor_id: null,
                    rek_contributor: 'Smith C.',
                    rek_contributor_order: 3
                }
            ]
        };
        const result = transformers.getRecordContributorsSearchKey(input);
        expect(result).toEqual(expected);
    });

    it('getRecordContributorsIdSearchKey returns empty request object', () => {
        const input = [];
        const expected = {};
        const result = transformers.getRecordContributorsIdSearchKey(input);
        expect(result).toEqual(expected);
    });

    it('getRecordContributorsIdSearchKey returns request object', () => {
        const input = [
            {nameAsPublished: "Smith A.", disabled: false, selected: false, authorId: null},
            {nameAsPublished: "Smith B.", disabled: false, selected: true, authorId: 100},
            {nameAsPublished: "Smith C.", disabled: false, selected: false, authorId: null},
            {nameAsPublished: "Smith D.", disabled: false, selected: false, aut_id: 1001}
        ];
        const expected = {
            fez_record_search_key_contributor_id: [
                { rek_contributor_id: null, rek_contributor_id_order: 1 },
                { rek_contributor_id: 100, rek_contributor_id_order: 2 },
                { rek_contributor_id: null, rek_contributor_id_order: 3 },
                { rek_contributor_id: 1001, rek_contributor_id_order: 4 },
            ]
        };
        const result = transformers.getRecordContributorsIdSearchKey(input);
        expect(result).toEqual(expected);
    });

});
