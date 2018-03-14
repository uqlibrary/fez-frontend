import * as transformers from './transformers';
import {APP_URL} from 'config';
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
                    rek_link_description: 'Link to publication',
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

    beforeEach(() => {
        const now = new Date(2018, 0, 1, 0, 0, 0, 0);
        Date.now = jest.genMockFunction().mockReturnValue(now);
    });

    it('should return empty request object structure if no files are provided', () => {
        const files = [];
        const record = {};
        const expected = {};
        const result = transformers.getRecordFileAttachmentSearchKey(files, record);
        expect(result).toEqual(expected);
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
                    rek_file_attachment_embargo_date: '2018-01-01',
                    rek_file_attachment_embargo_date_order: 1
                },
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
            fez_record_search_key_file_attachment_embargo_date: [
                {
                    rek_file_attachment_embargo_date: '2018-01-01',
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

describe('getFixIssueRequest test ', () => {

    it('should create issue request', () => {
        const input = {publication: {}, author: {}};

        input.publication.rek_pid = 'UQ:1111';
        input.author.aut_display_name = 'J. Smith';
        input.author.aut_org_username = 'uqjsmith';
        input.comments = 'Some comments...';


        const expected = {issue: 'Record: ' + APP_URL + 'view/UQ:1111 \n User \'J. Smith (uqjsmith)\' has indicated that they require a fix to this publication: Some comments...'}

        const result = transformers.getFixIssueRequest(input);
        expect(result).toEqual(expected);
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

describe('getRecordFieldsOfResearchSearchKey test ', () => {

    it('should return empty fields of research object', () => {
        const input = [];
        const expected = {};
        const result = transformers.getRecordFieldsOfResearchSearchKey(input);
        expect(result).toEqual(expected);
    });

    it('should return fields of research list based on input', () => {
        const input = [
            {rek_order: 1, rek_value: {key: 451799, value: "01 Mathematical Sciences"}},
            {rek_order: 2, rek_value: {key: 451802, value: "0101 Mathematical Sciences"}},
            {rek_order: 3, rek_value: {key: 451801, value: "010101 Mathematical Sciences"}}
        ];
        const expected = {
            fez_record_search_key_fields_of_research: [
                {
                    rek_fields_of_research: 451799,
                    rek_fields_of_research_order: 1
                },
                {
                    rek_fields_of_research: 451802,
                    rek_fields_of_research_order: 2
                },
                {
                    rek_fields_of_research: 451801,
                    rek_fields_of_research_order: 3
                }
            ]
        };
        const result = transformers.getRecordFieldsOfResearchSearchKey(input);
        expect(result).toEqual(expected);
    });
});

describe('getRecordSupervisorsSearchKey test ', () => {

    it('should return empty supervisors object', () => {
        const input = [];
        const expected = {};
        const result = transformers.getRecordSupervisorsSearchKey(input);
        expect(result).toEqual(expected);
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
        const input = [];
        const expected = {};
        const result = transformers.getRecordAuthorsSearchKey(input);
        expect(result).toEqual(expected);
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
        const input = [];
        const expected = {};
        const result = transformers.getRecordAuthorsIdSearchKey(input);
        expect(result).toEqual(expected);
    });

    it('should return authors object from authors control data', () => {
        const input = [
            {nameAsPublished: "Smith A.", disabled: false, selected: false, authorId: null},
            {nameAsPublished: "Smith B.", disabled: false, selected: true, authorId: 100},
            {nameAsPublished: "Smith C.", disabled: false, selected: false, authorId: null},
            {nameAsPublished: "Smith D.", disabled: false, selected: false, aut_id: 1001}
        ];
        const expected = {
            fez_record_search_key_author_id: [
                {rek_author_id: null, rek_author_id_order: 1},
                {rek_author_id: 100, rek_author_id_order: 2},
                {rek_author_id: null, rek_author_id_order: 3},
                {rek_author_id: 1001, rek_author_id_order: 4}
            ]
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
        const input = [];
        const expected = {};
        const result = transformers.getRecordContributorsSearchKey(input);
        expect(result).toEqual(expected);
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
        const input = [];
        const expected = {};
        const result = transformers.getRecordContributorsIdSearchKey(input);
        expect(result).toEqual(expected);
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
        const data = {};

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
