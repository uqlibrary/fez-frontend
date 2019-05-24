import * as transformers from './transformers';

const moment = require('moment');

describe('getRecordLinkSearchKey test ', () => {

    it('should return request object structure with link', () => {
        const data = {
            rek_link: 'http://google.com'
        };
        const expected = {
            fez_record_search_key_link: [
                {
                    rek_link: 'http://google.com',
                    rek_link_order: 1
                }
            ],
            fez_record_search_key_link_description: [
                {
                    rek_link_description: 'Link to work',
                    rek_link_description_order: 1
                }
            ]
        };
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

describe('getRecordFileAttachmentSearchKey test ', () => {

    const MockDate = require('mockdate');
    beforeEach(() => {
        MockDate.set('2018-01-01T00:00:00.000Z', 10);
    });

    afterEach(() => {
        MockDate.reset();
    });

    it('should return empty request object structure if no files are provided', () => {
        expect(
            transformers.getRecordFileAttachmentSearchKey([], {})
        ).toEqual({});
    });

    it('should return request object structure for files with various open access status', () => {

        const files = [
            {
                access_condition_id: 9, // open access, should stay open
                name: 'file1.txt',
                date: moment().clone().format('YYYY-MM-DD') // today
            },
            {
                access_condition_id: 9, // open access, should be closed 'cause in the future
                name: 'file2.txt',
                date: moment().clone().add(30, 'days').format('YYYY-MM-DD') // future
            },
            {
                access_condition_id: 9, // open access, should stay open 'cause in the past
                name: 'file3.txt',
                date: moment().clone().add(-30, 'days').format('YYYY-MM-DD') // past
            },
            {
                access_condition_id: 8, // closed access, should stay closed
                name: 'file4.txt'
            }
        ];
        const record = null;
        const expected = {
            fez_record_search_key_file_attachment_name: [
                {
                    rek_file_attachment_name: 'file1.txt',
                    rek_file_attachment_name_order: 1
                },
                {
                    rek_file_attachment_name: 'file2.txt',
                    rek_file_attachment_name_order: 2
                },
                {
                    rek_file_attachment_name: 'file3.txt',
                    rek_file_attachment_name_order: 3
                },
                {
                    rek_file_attachment_name: 'file4.txt',
                    rek_file_attachment_name_order: 4
                }
            ],
            fez_record_search_key_file_attachment_embargo_date: [
                {
                    rek_file_attachment_embargo_date: '2018-01-31',
                    rek_file_attachment_embargo_date_order: 2
                },
                {
                    rek_file_attachment_embargo_date: '2017-12-02',
                    rek_file_attachment_embargo_date_order: 3
                }
            ],
            fez_record_search_key_file_attachment_access_condition: [
                {
                    rek_file_attachment_access_condition: 9,
                    rek_file_attachment_access_condition_order: 1
                },
                {
                    rek_file_attachment_access_condition: 8,
                    rek_file_attachment_access_condition_order: 2
                },
                {
                    rek_file_attachment_access_condition: 9,
                    rek_file_attachment_access_condition_order: 3
                },
                {
                    rek_file_attachment_access_condition: 8,
                    rek_file_attachment_access_condition_order: 4
                }
            ]
        };
        const result = transformers.getRecordFileAttachmentSearchKey(files, record);
        expect(result).toEqual(expected);
    });

    it('should return request object structure for files no access id', () => {
        const files = [
            {
                name: 'file.txt'
            },
            {
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
            fez_record_search_key_file_attachment_embargo_date: [],
            fez_record_search_key_file_attachment_access_condition: []
        };
        const result = transformers.getRecordFileAttachmentSearchKey(files, record);
        expect(result).toEqual(expected);
    });

    it('should return request object structure for files and empty record', () => {
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

    it('should return request object structure for files and existing files in record', () => {
        const files = [
            {
                access_condition_id: 1,
                name: 'file.txt',
                date: moment().clone().format('YYYY-MM-DD') // today
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
            fez_record_search_key_file_attachment_embargo_date: [],
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

describe('getFixIssueRequest test ', () => {

    it('should create issue request', () => {
        const input = {publication: {}, author: {}};

        input.publication.rek_pid = 'UQ:1111';
        input.author.aut_display_name = 'J. Smith';
        input.author.aut_org_username = 'uqjsmith';
        input.comments = 'Some comments...';
        input.rek_link = 'http://www.test.com';
        input.files = {queue: [{name: '1.jpg'}, {name: '2.jpg'}]};

        const expected = ["Added comments: Some comments...", "Added link: http://www.test.com", "Added files: 1.jpg, 2.jpg"];
        const result = transformers.getFixIssueRequest(input);
        expected.map(item => {
            expect(result.issue).toContain(item);
        });

        const result2 = transformers.getFixIssueRequest({});
        expect(result2.issue).toEqual('');
    });

});

describe('unclaimRecord[Author/Contributor]SearchKey test ', () => {

    it('should return empty author id request object', () => {
        const input = [];
        const expected = {
            fez_record_search_key_author_id: []
        };

        const result = transformers.unclaimRecordAuthorsIdSearchKey(input, 1001);
        expect(result).toEqual(expected);
    });

    it('should remove selected author from author id request object', () => {
        const input = [
            {rek_author_id: 0, rek_author_id_order: 1, rek_author_id_id: null, rek_author_id_pid: "UQ:347818"},
            {rek_author_id: 1001, rek_author_id_order: 2, rek_author_id_id: null, rek_author_id_pid: "UQ:347812"},
            {rek_author_id: 1002, rek_author_id_order: 3, rek_author_id_id: null, rek_author_id_pid: "UQ:347813"},
            {rek_author_id: 0, rek_author_id_order: 4, rek_author_id_id: null, rek_author_id_pid: "UQ:347814"}
        ];
        const expected = {
            fez_record_search_key_author_id: [
                {rek_author_id: 0, rek_author_id_order: 1, rek_author_id_id: null, rek_author_id_pid: "UQ:347818"},
                {rek_author_id: 0, rek_author_id_order: 2},
                {rek_author_id: 1002, rek_author_id_order: 3, rek_author_id_id: null, rek_author_id_pid: "UQ:347813"},
                {rek_author_id: 0, rek_author_id_order: 4, rek_author_id_id: null, rek_author_id_pid: "UQ:347814"}
            ]
        };

        const result = transformers.unclaimRecordAuthorsIdSearchKey(input, 1001);
        expect(result).toEqual(expected);
    });

    it('should remove selected author from author id request object and update order if missing', () => {
        const input = [
            {rek_author_id: 0, rek_author_id_order: 1, rek_author_id_id: null, rek_author_id_pid: "UQ:347818"},
            {rek_author_id: 1001, rek_author_id_id: null, rek_author_id_pid: "UQ:347812"},
            {rek_author_id: 1002, rek_author_id_order: 3, rek_author_id_id: null, rek_author_id_pid: "UQ:347813"},
            {rek_author_id: 0, rek_author_id_order: 4, rek_author_id_id: null, rek_author_id_pid: "UQ:347814"}
        ];
        const expected = {
            fez_record_search_key_author_id: [
                {rek_author_id: 0, rek_author_id_order: 1, rek_author_id_id: null, rek_author_id_pid: "UQ:347818"},
                {rek_author_id: 0, rek_author_id_order: 2},
                {rek_author_id: 1002, rek_author_id_order: 3, rek_author_id_id: null, rek_author_id_pid: "UQ:347813"},
                {rek_author_id: 0, rek_author_id_order: 4, rek_author_id_id: null, rek_author_id_pid: "UQ:347814"}
            ]
        };

        const result = transformers.unclaimRecordAuthorsIdSearchKey(input, 1001);
        expect(result).toEqual(expected);
    });

    it('should return empty contributor id request object', () => {
        const input = [];
        const expected = {
            fez_record_search_key_contributor_id: []
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
                rek_contributor_id_pid: "UQ:347818"
            },
            {
                rek_contributor_id: 1001,
                rek_contributor_id_order: 2,
                rek_contributor_id_id: null,
                rek_contributor_id_pid: "UQ:347812"
            },
            {
                rek_contributor_id: 1002,
                rek_contributor_id_order: 3,
                rek_contributor_id_id: null,
                rek_contributor_id_pid: "UQ:347813"
            },
            {
                rek_contributor_id: 0,
                rek_contributor_id_order: 4,
                rek_contributor_id_id: null,
                rek_contributor_id_pid: "UQ:347814"
            }
        ];
        const expected = {
            fez_record_search_key_contributor_id: [
                {
                    rek_contributor_id: 0,
                    rek_contributor_id_order: 1,
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: "UQ:347818"
                },
                {rek_contributor_id: 0, rek_contributor_id_order: 2},
                {
                    rek_contributor_id: 1002,
                    rek_contributor_id_order: 3,
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: "UQ:347813"
                },
                {
                    rek_contributor_id: 0,
                    rek_contributor_id_order: 4,
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: "UQ:347814"
                }
            ]
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
                rek_contributor_id_pid: "UQ:347818"
            },
            {rek_contributor_id: 1001, rek_contributor_id_id: null, rek_contributor_id_pid: "UQ:347812"},
            {
                rek_contributor_id: 1002,
                rek_contributor_id_order: 3,
                rek_contributor_id_id: null,
                rek_contributor_id_pid: "UQ:347813"
            },
            {
                rek_contributor_id: 0,
                rek_contributor_id_order: 4,
                rek_contributor_id_id: null,
                rek_contributor_id_pid: "UQ:347814"
            }
        ];
        const expected = {
            fez_record_search_key_contributor_id: [
                {
                    rek_contributor_id: 0,
                    rek_contributor_id_order: 1,
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: "UQ:347818"
                },
                {rek_contributor_id: 0, rek_contributor_id_order: 2},
                {
                    rek_contributor_id: 1002,
                    rek_contributor_id_order: 3,
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: "UQ:347813"
                },
                {
                    rek_contributor_id: 0,
                    rek_contributor_id_order: 4,
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: "UQ:347814"
                }
            ]
        };
        const result = transformers.unclaimRecordContributorsIdSearchKey(input, 1001);
        expect(result).toEqual(expected);
    });
});

describe('getRecordSubjectSearchKey test ', () => {

    it('should return empty subject object', () => {
        expect(transformers.getRecordSubjectSearchKey()).toEqual({});
    });

    it('should return subject list based on input', () => {
        const input = [
            {rek_order: 1, rek_value: {key: 451799, value: "01 Mathematical Sciences"}},
            {rek_order: 2, rek_value: {key: 451802, value: "0101 Mathematical Sciences"}},
            {rek_order: 3, rek_value: {key: 451801, value: "010101 Mathematical Sciences"}}
        ];
        const expected = {
            fez_record_search_key_subject: [
                {
                    rek_subject: 451799,
                    rek_subject_order: 1
                },
                {
                    rek_subject: 451802,
                    rek_subject_order: 2
                },
                {
                    rek_subject: 451801,
                    rek_subject_order: 3
                }
            ]
        };
        const result = transformers.getRecordSubjectSearchKey(input);
        expect(result).toEqual(expected);
    });
});

describe('getRecordSupervisorsSearchKey test ', () => {

    it('should return empty supervisors object', () => {
        expect(transformers.getRecordSupervisorsSearchKey()).toEqual({});
    });

    it('should construct supervisor object from data', () => {
        const input = [
            {nameAsPublished: "Smith A.", disabled: false, selected: false, authorId: null},
            {nameAsPublished: "Smith B.", disabled: false, selected: true, authorId: null},
            {nameAsPublished: "Smith C.", disabled: false, selected: false, authorId: null}
        ];
        const expected = {
            fez_record_search_key_supervisor: [
                {
                    rek_supervisor: 'Smith A.',
                    rek_supervisor_order: 1
                },
                {
                    rek_supervisor: 'Smith B.',
                    rek_supervisor_order: 2
                },
                {
                    rek_supervisor: 'Smith C.',
                    rek_supervisor_order: 3
                }
            ]
        };
        const result = transformers.getRecordSupervisorsSearchKey(input);
        expect(result).toEqual(expected);
    });

});

describe('getRecordAuthorsSearchKey test ', () => {

    it('should return empty request object', () => {
        expect(transformers.getRecordAuthorsSearchKey()).toEqual({});
    });

    it('should return authors name object', () => {
        const input = [
            {nameAsPublished: "Smith A.", disabled: false, selected: false, authorId: null},
            {nameAsPublished: "Smith B.", disabled: false, selected: true, authorId: 100},
            {nameAsPublished: "Smith C.", disabled: false, selected: false, authorId: null}
        ];
        const expected = {
            fez_record_search_key_author: [
                {
                    rek_author: 'Smith A.',
                    rek_author_order: 1
                },
                {
                    rek_author: 'Smith B.',
                    rek_author_order: 2
                },
                {
                    rek_author: 'Smith C.',
                    rek_author_order: 3
                }
            ]
        };
        const result = transformers.getRecordAuthorsSearchKey(input);
        expect(result).toEqual(expected);
    });
});

describe('getRecordAuthorsIdSearchKey test ', () => {

    it('should return empty authors object', () => {
        expect(transformers.getRecordAuthorsIdSearchKey()).toEqual({});
    });

    it('should return authors object from authors control data', () => {
        const input = [
            {nameAsPublished: "Smith A.", disabled: false, selected: false, authorId: null},
            {nameAsPublished: "Smith B.", disabled: false, selected: true, authorId: 100},
            {nameAsPublished: "Smith C.", disabled: false, selected: false, authorId: null},
            {nameAsPublished: "Smith D.", disabled: false, selected: false, aut_id: 1001}
        ];
        const expected = {
            "fez_record_search_key_author_id": [{
                "rek_author_id": 0,
                "rek_author_id_order": 1
            }, {"rek_author_id": 100, "rek_author_id_order": 2}, {
                "rek_author_id": 0,
                "rek_author_id_order": 3
            }, {"rek_author_id": 1001, "rek_author_id_order": 4}]
        };
        const result = transformers.getRecordAuthorsIdSearchKey(input);
        expect(result).toEqual(expected);
    });

    it('should return authors object from original search key data format', () => {
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

    it('should assign current user id as a solo author', () => {
        const authors = [];
        const defaultId = 1001;

        const expected = {
            fez_record_search_key_author_id: [
                {rek_author_id: 1001, rek_author_id_order: 1}
            ]
        };
        const result = transformers.getRecordAuthorsIdSearchKey(authors, defaultId);
        expect(result).toEqual(expected);
    });
});

describe('getRecordContributorsSearchKey test ', () => {

    it('should return empty contributors object', () => {
        expect(transformers.getRecordContributorsSearchKey()).toEqual({});
    });

    it('should return populated contributors object', () => {
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
});

describe('getRecordContributorsIdSearchKey test ', () => {

    it('should return empty contributors request object', () => {
        expect(transformers.getRecordContributorsIdSearchKey()).toEqual({});
    });

    it('should construct contributors id object from component data', () => {
        const input = [
            {nameAsPublished: "Smith A.", disabled: false, selected: false, authorId: null},
            {nameAsPublished: "Smith B.", disabled: false, selected: true, authorId: 100},
            {nameAsPublished: "Smith C.", disabled: false, selected: false, authorId: null},
            {nameAsPublished: "Smith D.", disabled: false, selected: false, aut_id: 1001}
        ];
        const expected = {
            fez_record_search_key_contributor_id: [
                {rek_contributor_id: null, rek_contributor_id_order: 1},
                {rek_contributor_id: 100, rek_contributor_id_order: 2},
                {rek_contributor_id: null, rek_contributor_id_order: 3},
                {rek_contributor_id: 1001, rek_contributor_id_order: 4},
            ]
        };
        const result = transformers.getRecordContributorsIdSearchKey(input);
        expect(result).toEqual(expected);
    });

    it('should not modify contributors object for original data', () => {
        const input = [
            {rek_contributor_id: null, rek_contributor_id_order: 1},
            {rek_contributor_id: 100, rek_contributor_id_order: 2},
            {rek_contributor_id: null, rek_contributor_id_order: 3},
            {rek_contributor_id: 1001, rek_contributor_id_order: 4}
        ];
        const expected = {
            fez_record_search_key_contributor_id: [
                {rek_contributor_id: null, rek_contributor_id_order: 1},
                {rek_contributor_id: 100, rek_contributor_id_order: 2},
                {rek_contributor_id: null, rek_contributor_id_order: 3},
                {rek_contributor_id: 1001, rek_contributor_id_order: 4},
            ]
        };
        const result = transformers.getRecordContributorsIdSearchKey(input);
        expect(result).toEqual(expected);
    });

    it('should assign current user id as a solo contributor', () => {
        const authors = [];
        const defaultId = 1001;

        const expected = {
            fez_record_search_key_contributor_id: [
                {rek_contributor_id: 1001, rek_contributor_id_order: 1}
            ]
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
        const data = {};

        const expected = {
            "aut_id": 4444,
            "aut_orcid_id": "1234-1234-1234"
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
            access_token: 'token'
        };

        const expected = {
            "aut_id": 4444,
            "aut_orcid_id": "1234-1234-1234",
            "fez_author_identifier_user_grants": {
                "aig_details": 'token',
                "aig_expires": '1/1/2010',
                "aig_details_dump": "{\"scope\":\"one\",\"expires_in\":\"1/1/2010\",\"access_token\":\"token\"}",
                "aig_name": "one"
            }
        };
        const result = transformers.getAuthorIdentifierOrcidPatchRequest(authorId, orcidId, data);
        expect(result).toEqual(expected);
    });
});

describe('getDatasetCreatorRolesSearchKey tests', () => {
    it('should return empty object', () => {
        expect(transformers.getDatasetCreatorRolesSearchKey()).toEqual({});
    });

    it('should return search key with data', () => {
        const input = [
            {creatorRole: "Investigator"},
            {creatorRole: "Software Developer"},
            {creatorRole: "Co-investigator"}
        ];
        const expected = {
            fez_record_search_key_author_role: [
                {
                    rek_author_role: 'Investigator',
                    rek_author_role_order: 1
                },
                {
                    rek_author_role: 'Software Developer',
                    rek_author_role_order: 2
                },
                {
                    rek_author_role: 'Co-investigator',
                    rek_author_role_order: 3
                }
            ]
        };
        const result = transformers.getDatasetCreatorRolesSearchKey(input);
        expect(result).toEqual(expected);
    })
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
                value: 'Test, Contact'
            },
            contactEmail: 'test@test.com'
        };
        const expected = {
            fez_record_search_key_contributor: [{
                rek_contributor: 'Test Contact',
                rek_contributor_id: null,
                rek_contributor_order: 1
            }],
            fez_record_search_key_contributor_id: [{
                rek_contributor_id: 121212,
                rek_contributor_id_order: 1
            }],
            fez_record_search_key_contact_details_email: [{
                rek_contact_details_email: 'test@test.com',
                rek_contact_details_email_order: 1
            }]
        };
        const result = transformers.getDatasetContactDetailSearchKeys(input);
        expect(result).toEqual(expected);
    });

    it('should return search key with data transformed correctly for api', () => {
        const input = {
            contactName: 'Test Contact',
            contactNameId: {
                id: '121212',
                value: 'Test, Contact'
            },
            contactEmail: 'test@test.com'
        };
        const expected = {
            fez_record_search_key_contributor: [{
                rek_contributor: 'Test Contact',
                rek_contributor_id: null,
                rek_contributor_order: 1
            }],
            fez_record_search_key_contributor_id: [{
                rek_contributor_id: 121212,
                rek_contributor_id_order: 1
            }],
            fez_record_search_key_contact_details_email: [{
                rek_contact_details_email: 'test@test.com',
                rek_contact_details_email_order: 1
            }]
        };
        const result = transformers.getDatasetContactDetailSearchKeys(input);
        expect(result).toEqual(expected);
    });

    it('should return search key with data transformed correctly with id set to 0', () => {
        const input = {
            contactName: 'Test Contact',
            contactNameId: {
                id: 'test',
                value: 'Test, Contact'
            },
            contactEmail: 'test@test.com'
        };
        const expected = {
            fez_record_search_key_contributor: [{
                rek_contributor: 'Test Contact',
                rek_contributor_id: null,
                rek_contributor_order: 1
            }],
            fez_record_search_key_contributor_id: [{
                rek_contributor_id: 0,
                rek_contributor_id_order: 1
            }],
            fez_record_search_key_contact_details_email: [{
                rek_contact_details_email: 'test@test.com',
                rek_contact_details_email_order: 1
            }]
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
            fez_record_search_key_geographic_area: [{
                rek_geographic_area: '12.231112,-32.323323',
                rek_geographic_area_order: 1
            }]
        };
        const result = transformers.getGeographicAreaSearchKey(input);
        expect(result).toEqual(expected);
    });
});

describe('getRecordAuthorAffiliationSearchKey tests', () => {
    it('should return an empty object', () => {
        expect(transformers.getRecordAuthorAffiliationSearchKey()).toEqual({});
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
                authorId: null
            },
            {
                nameAsPublished: 'Test user',
                creatorRole: '',
                affiliation: 'NotUQ',
                orgaff: 'Test organisation',
                orgtype: 453983,
                disabled: false,
                selected: true,
                authorId: 410
            },
            {
                nameAsPublished: 'Another user',
                creatorRole: '',
                affiliation: 'NotUQ',
                orgaff: 'Some Organisation',
                orgtype: 453987,
                disabled: false,
                selected: false,
                authorId: null
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
                authorId: null
            }
        ];
        const expected = {
            "fez_record_search_key_author_affiliation_name": [{
                "rek_author_affiliation_name": "The University of Queensland",
                "rek_author_affiliation_name_order": 1
            }, {
                "rek_author_affiliation_name": "Test organisation",
                "rek_author_affiliation_name_order": 2
            }, {
                "rek_author_affiliation_name": "Some Organisation",
                "rek_author_affiliation_name_order": 3
            }, {
                "rek_author_affiliation_name": "The University of Queensland",
                "rek_author_affiliation_name_order": 4
            }
            ]
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
                authorId: null
            },
            {
                nameAsPublished: 'Test user',
                creatorRole: '',
                affiliation: 'NotUQ',
                orgaff: '',
                orgtype: '',
                disabled: false,
                selected: true,
                authorId: 410
            },
            {
                nameAsPublished: 'Another user',
                creatorRole: '',
                affiliation: 'NotUQ',
                orgaff: '',
                orgtype: '',
                disabled: false,
                selected: false,
                authorId: null
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
                authorId: null
            }
        ];
        const expected = {
            "fez_record_search_key_author_affiliation_name": [{
                "rek_author_affiliation_name": "The University of Queensland",
                "rek_author_affiliation_name_order": 1
            }, {
                "rek_author_affiliation_name": "Missing",
                "rek_author_affiliation_name_order": 2
            }, {
                "rek_author_affiliation_name": "Missing",
                "rek_author_affiliation_name_order": 3
            }, {
                "rek_author_affiliation_name": "The University of Queensland",
                "rek_author_affiliation_name_order": 4
            }
            ]
        };
        const result = transformers.getRecordAuthorAffiliationSearchKey(input);
        expect(result).toEqual(expected);
    });
});

describe('getRecordAuthorAffiliationTypeSearchKey tests', () => {
    it('should return an empty object', () => {
        expect(transformers.getRecordAuthorAffiliationTypeSearchKey()).toEqual({});
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
                authorId: null
            },
            {
                nameAsPublished: 'Test user',
                creatorRole: '',
                affiliation: 'NotUQ',
                orgaff: 'Test organisation',
                orgtype: '453983',
                disabled: false,
                selected: true,
                authorId: 410
            },
            {
                nameAsPublished: 'Another user',
                creatorRole: '',
                affiliation: 'NotUQ',
                orgaff: 'Some Organisation',
                orgtype: '453987',
                disabled: false,
                selected: false,
                authorId: null
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
                authorId: null
            }
        ];
        const expected = {
            "fez_record_search_key_author_affiliation_type": [{
                "rek_author_affiliation_type": 453989,
                "rek_author_affiliation_type_order": 1
            }, {
                "rek_author_affiliation_type": 453983,
                "rek_author_affiliation_type_order": 2
            }, {
                "rek_author_affiliation_type": 453987,
                "rek_author_affiliation_type_order": 3
            }, {
                "rek_author_affiliation_type": 453989,
                "rek_author_affiliation_type_order": 4
            }]
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
                authorId: null
            },
            {
                nameAsPublished: 'Test user',
                creatorRole: '',
                affiliation: 'NotUQ',
                orgaff: 'Test organisation',
                orgtype: '453983',
                disabled: false,
                selected: true,
                authorId: 410
            },
            {
                nameAsPublished: 'Another user',
                creatorRole: '',
                affiliation: 'NotUQ',
                orgaff: '',
                orgtype: '',
                disabled: false,
                selected: false,
                authorId: null
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
                authorId: null
            }
        ];
        const expected = {
            "fez_record_search_key_author_affiliation_type": [{
                "rek_author_affiliation_type": 453989,
                "rek_author_affiliation_type_order": 1
            }, {
                "rek_author_affiliation_type": 453983,
                "rek_author_affiliation_type_order": 2
            }, {
                "rek_author_affiliation_type": 0,
                "rek_author_affiliation_type_order": 3
            }, {
                "rek_author_affiliation_type": 453989,
                "rek_author_affiliation_type_order": 4
            }]
        };
        const result = transformers.getRecordAuthorAffiliationTypeSearchKey(input);
        expect(result).toEqual(expected);
    });
});

describe('getRecordAbstractDescriptionSearchKey tests', () => {
    it('should return empty object', () => {
        expect(transformers.getRecordAbstractDescriptionSearchKey()).toEqual({});
    });

    it('should return search key with data', () => {
        const input = {
            plainText: 'test',
            htmlText: '<p>test</p>'
        };
        const expected = {
            rek_description: 'test',
            rek_formatted_abstract: '<p>test</p>'
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
        const input = [{
            grantAgencyName: 'test',
            grantId: 'test123',
            grantAgencyType: '12345'
        }];

        const expected = {
            fez_record_search_key_grant_agency: [
                {
                    rek_grant_agency: 'test',
                    rek_grant_agency_order: 1
                }
            ],
            fez_record_search_key_grant_id: [
                {
                    rek_grant_id: 'test123',
                    rek_grant_id_order: 1
                }
            ],
            fez_record_search_key_grant_agency_type: [
                {
                    rek_grant_agency_type: 12345,
                    rek_grant_agency_type_order: 1
                }
            ],
        };
        const result = transformers.getGrantsListSearchKey(input);
        expect(result).toEqual(expected);
    });

    it('should return search key with data filtered empty values', () => {
        const input = [
            {
                grantAgencyName: 'test',
                grantId: 'test123',
            },
            {
                grantAgencyName: 'testing',
                grantId: 'testing123',
                grantAgencyType: '12345'
            },
            {
                grantAgencyName: 'tested',
                grantAgencyType: '56465'
            }
        ];

        const expected = {
            "fez_record_search_key_grant_agency": [{
                "rek_grant_agency": "test",
                "rek_grant_agency_order": 1
            }, {"rek_grant_agency": "testing", "rek_grant_agency_order": 2}, {
                "rek_grant_agency": "tested",
                "rek_grant_agency_order": 3
            }],
            "fez_record_search_key_grant_agency_type": [{
                "rek_grant_agency_type": 454045,
                "rek_grant_agency_type_order": 1
            }, {"rek_grant_agency_type": 12345, "rek_grant_agency_type_order": 2}, {
                "rek_grant_agency_type": 56465,
                "rek_grant_agency_type_order": 3
            }],
            "fez_record_search_key_grant_id": [{
                "rek_grant_id": "test123",
                "rek_grant_id_order": 1
            }, {"rek_grant_id": "testing123", "rek_grant_id_order": 2}, {
                "rek_grant_id": "Not set",
                "rek_grant_id_order": 3
            }]
        };
        const result = transformers.getGrantsListSearchKey(input);
        expect(result).toEqual(expected);
    });
});

describe('getNtroMetadataSearchKeys tests', () => {
    it('should get ntro meta data', () => {
        const result = transformers.getNtroMetadataSearchKeys({
            authors: [{
                rek_author_id: 111,
                selected: false,
            }, {
                rek_author_id: 222,
                selected: false
            }, {
                rek_author_id: 333,
                selected: false
            }],
            significance: 'Major',
            impactStatement: 'test impact statement'
        });

        expect(result).toMatchObject({
            "fez_record_search_key_creator_contribution_statement": [{
                "rek_creator_contribution_statement": 'Missing',
                "rek_creator_contribution_statement_order": 1
            }, {
                "rek_creator_contribution_statement": 'Missing',
                "rek_creator_contribution_statement_order": 2
            }, {
                "rek_creator_contribution_statement": 'Missing',
                "rek_creator_contribution_statement_order": 3
            }],
            "fez_record_search_key_significance": [{
                "rek_significance": 0,
                "rek_significance_order": 1
            }, {"rek_significance": 0, "rek_significance_order": 2}, {
                "rek_significance": 0,
                "rek_significance_order": 3
            }]
        });
    });
});

describe('getAuthorOrder', () => {
    it('returns author\'s order when a match it found', () => {
        const data = {
            author: {
                aut_id: 99
            },
            publication: {
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 99,
                        rek_author_id_order: 1
                    }
                ]
            }
        }
        expect(transformers.getAuthorOrder(data)).toBe(1);
    });

    it('returns -1 when a match is not found', () => {
        const data = {
            author: {
                aut_id: 2
            },
            publication: {
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 99,
                        rek_author_id_order: 1
                    }
                ]
            }
        }
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
        expect(transformers.getSignificanceAndContributionStatementSearchKeys({
            impactStatement: {
                htmlText: '<p>test</p>'
            },
            author: {
                aut_id: 3
            },
            publication: {
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 3,
                        rek_author_id_order: 2
                    }
                ]
            }
        })).toEqual({
            fez_record_search_key_creator_contribution_statement: [{
                rek_creator_contribution_statement: '<p>test</p>',
                rek_creator_contribution_statement_order: 2
            }]
        });
    });

    it('returns correct object if impact statement is plain text for non-admin author', () => {
        expect(transformers.getSignificanceAndContributionStatementSearchKeys({
            impactStatement: {
                plainText: 'test'
            },
            author: {
                aut_id: 3
            },
            publication: {
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 3,
                        rek_author_id_order: 2
                    }
                ]
            }
        })).toEqual({
            fez_record_search_key_creator_contribution_statement: [{
                rek_creator_contribution_statement: 'test',
                rek_creator_contribution_statement_order: 2
            }]
        });
    });

    it('returns correct object for siginificance for non-admin author', () => {
        expect(transformers.getSignificanceAndContributionStatementSearchKeys({
            significance: '1234',
            author: {
                aut_id: 3
            },
            publication: {
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 3,
                        rek_author_id_order: 2
                    }
                ]
            }
        })).toEqual({
            fez_record_search_key_significance: [{
                rek_significance: '1234',
                rek_significance_order: 2
            }]
        });
    });

    it('returns contribution statement and significance search keys for non-admin author', () => {
        expect(transformers.getSignificanceAndContributionStatementSearchKeys({
            significance: '1234',
            impactStatement: {
                htmlText: '<span>test</span>'
            },
            initialContributionStatements: [],
            initialSignificance: [],
            author: {
                aut_id: 3
            },
            publication: {
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 3,
                        rek_author_id_order: 2
                    }
                ]
            }
        })).toEqual({
            fez_record_search_key_significance: [{
                rek_significance: '1234',
                rek_significance_order: 2
            }],
            fez_record_search_key_creator_contribution_statement: [{
                rek_creator_contribution_statement: '<span>test</span>',
                rek_creator_contribution_statement_order: 2
            }]
        });
    });

    it('returns correct contribution statement and significance search keys for admin author on author order matched', () => {
        expect(transformers.getSignificanceAndContributionStatementSearchKeys({
            significance: '1234',
            impactStatement: {
                htmlText: '<span>test</span>'
            },
            initialContributionStatements: [{
                rek_creator_contribution_statement: 'Some statement',
                rek_creator_contribution_statement_order: 1
            }, {
                rek_creator_contribution_statement: 'Missing',
                rek_creator_contribution_statement_order: 2
            }, {
                rek_creator_contribution_statement: 'Missing',
                rek_creator_contribution_statement_order: 3
            }],
            initialSignificance: [{
                rek_significance: '1234',
                rek_significance_order: 1
            }, {
                rek_significance: 0,
                rek_significance_order: 2
            }, {
                rek_significance: 0,
                rek_significance_order: 3
            }],
            author: {
                aut_id: 3
            },
            publication: {
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 3,
                        rek_author_id_order: 2
                    }
                ]
            }
        })).toEqual({
            fez_record_search_key_significance: [{
                rek_significance: '1234',
                rek_significance_order: 1
            }, {
                rek_significance: '1234',
                rek_significance_order: 2
            }, {
                rek_significance: 0,
                rek_significance_order: 3
            }],
            fez_record_search_key_creator_contribution_statement: [{
                rek_creator_contribution_statement: 'Some statement',
                rek_creator_contribution_statement_order: 1
            }, {
                rek_creator_contribution_statement: '<span>test</span>',
                rek_creator_contribution_statement_order: 2
            }, {
                rek_creator_contribution_statement: 'Missing',
                rek_creator_contribution_statement_order: 3
            }]
        });
    });


    it('returns correct contribution statement and significance search keys for admin author on author order not matched', () => {
        expect(transformers.getSignificanceAndContributionStatementSearchKeys({
            significance: '1234',
            impactStatement: {
                htmlText: '<span>test</span>'
            },
            initialContributionStatements: [{
                rek_creator_contribution_statement: 'Some statement',
                rek_creator_contribution_statement_order: 1
            }, {
                rek_creator_contribution_statement: 'Missing',
                rek_creator_contribution_statement_order: 2
            }, {
                rek_creator_contribution_statement: 'Missing',
                rek_creator_contribution_statement_order: 3
            }],
            initialSignificance: [{
                rek_significance: '1234',
                rek_significance_order: 1
            }, {
                rek_significance: 0,
                rek_significance_order: 2
            }, {
                rek_significance: 0,
                rek_significance_order: 3
            }],
            author: {
                aut_id: 3
            },
            publication: {
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 3,
                        rek_author_id_order: 4
                    }
                ]
            }
        })).toEqual({
            fez_record_search_key_significance: [{
                rek_significance: '1234',
                rek_significance_order: 1
            }, {
                rek_significance: 0,
                rek_significance_order: 2
            }, {
                rek_significance: 0,
                rek_significance_order: 3
            }, {
                rek_significance: '1234',
                rek_significance_order: 4
            }],
            fez_record_search_key_creator_contribution_statement: [{
                rek_creator_contribution_statement: 'Some statement',
                rek_creator_contribution_statement_order: 1
            }, {
                rek_creator_contribution_statement: 'Missing',
                rek_creator_contribution_statement_order: 2
            }, {
                rek_creator_contribution_statement: 'Missing',
                rek_creator_contribution_statement_order: 3
            }, {
                rek_creator_contribution_statement: '<span>test</span>',
                rek_creator_contribution_statement_order: 4
            }]
        });
    });
})