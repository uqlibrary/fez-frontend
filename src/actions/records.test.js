import * as actions from './actionTypes';
import * as repositories from '../repositories';
import * as recordActions from './records';
import {record} from '../mock/data';
import {locale} from '../locale';

describe('Record action creators', () => {
    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('createNewRecord()', () => {

        it('dispatches expected actions on successful save', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save with files', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files":  {
                    "queue": [
                        {
                            "name": "test.txt",
                            "fileData": {
                                "name": "test.txt"
                            }
                        }
                    ],
                    "isValid": true},
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}})
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: pidRequest.pid, fileName: "test.txt"}).apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"})
                .reply(200, {});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOAD_PROGRESS@test.txt',
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save with files api failure', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files":  {
                    "queue": [
                        {
                            "name": "test.txt",
                            "fileData": {
                                "name": "test.txt"
                            }
                        }
                    ],
                    "isValid": true},
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}})
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: pidRequest.pid, fileName: "test.txt"}).apiUrl)
                .reply(500)
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"})
                .reply(200, {});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOADED_FAILED@test.txt',
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for anon user', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onAny()
                .reply(403, {});

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.CREATE_RECORD_FAILED
            ];

            try {
                await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions if patch record fails', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)",
                "files": {
                    "queue": [
                        {
                            "name": "test.txt",
                            "fileData": {
                                "name": "test.txt"
                            }
                        }
                    ]
                }
            };
            const testPid = 'UQ:396321';
            const pidRequest = {pid: testPid};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: testPid, fileName: "test.txt"}).apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"})
                .reply(200, {})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(500);

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOAD_PROGRESS@test.txt',
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on issues api posts comments successfully', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)",
                "comments": 'This is a test'
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.RECORDS_ISSUES_API(pidRequest).apiUrl)
                .reply(200, {data: {}});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on issues api failure to post comments', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)",
                "comments": 'This is a test'
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.RECORDS_ISSUES_API(pidRequest).apiUrl)
                .reply(500);


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

    });

    describe('clearNewRecord()', () => {
        it('dispatches expected actions', async () => {
            const expectedActions = [
                actions.CREATE_RECORD_RESET
            ];

            await mockActionsStore.dispatch(recordActions.clearNewRecord());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('submitThesis()', () => {

        const thesisFormData = {
            "currentAuthor": [{"nameAsPublished": "HDR Student, N", "authorId": 44444}],
            "fez_record_search_key_ismemberof": [{"rek_ismemberof": "UQ:152694"}],
            "supervisors": [
                {"nameAsPublished": "A Test", "disabled": false},
                {"nameAsPublished": "B Test", "disabled": false},
                {"nameAsPublished": "C Text", "disabled": false}],
            "fieldOfResearch": [{
                "rek_value": {"key": 451799, "value": "01 Mathematical Sciences"},
                "rek_order": 1
            }, {
                "rek_value": {"key": 452248, "value": "080309 Software Engineering"},
                "rek_order": 2
            }, {
                "rek_value": {"key": 452270, "value": "080607 Information Engineering and Theory"},
                "rek_order": 3
            }],
            "thesisAbstract": {
                plainText: "abstract",
                formattedText: "<p>abstract</p>"
            },
            "thesisTitle": {
                plainText: "title",
                formattedText: "<p>title</p>"
            },
            "fez_record_search_key_org_name": {"rek_org_name": "The University of Queensland"},
            "rek_object_type": 3,
            "rek_date": "2018-01-01",
            "fez_record_search_key_keywords": [{
                "rek_keywords": "math",
                "rek_keywords_order": 1
            }, {
                "rek_keywords": "engineering",
                "rek_keywords_order": 2
            }],
            "files": {
                "queue": [
                    {
                        "name": "test.txt",
                        "fileData": {
                            "name": "test.txt"
                        }
                    }
                ], "isValid": true},
            "rek_status": 2,
            "rek_genre_type": "B.A. Thesis",
            "rek_display_type": 187,
            "fez_record_search_key_org_unit_name": {"rek_org_unit_name": "School of Psychology"}
        };
        const authorData = {
            "aut_id": 44444,
            "aut_org_username": null,
            "aut_org_staff_id": null,
            "aut_org_student_id": "2222222",
            "aut_email": null,
            "aut_display_name": "HDR Student, N",
            "aut_fname": "N",
            "aut_mname": null,
            "aut_lname": "HDR Student",
            "aut_title": "Miss",
            "aut_position": null,
            "aut_homepage_link": null,
            "aut_created_date": "2017-11-03T01:00:24Z",
            "aut_update_date": "2017-12-21T07:31:09Z",
            "aut_external_id": null,
            "aut_ref_num": null,
            "aut_researcher_id": null,
            "aut_scopus_id": null,
            "aut_mypub_url": null,
            "aut_rid_password": null,
            "aut_people_australia_id": null,
            "aut_description": null,
            "aut_orcid_id": null,
            "aut_google_scholar_id": null,
            "aut_rid_last_updated": null,
            "aut_publons_id": null,
            "aut_student_username": "s2222222"
        };

        it('returns error if files are not attached', async () => {
            let customInput = JSON.parse(JSON.stringify(thesisFormData));
            delete customInput.files;

            try {
                await mockActionsStore.dispatch(recordActions.submitThesis(customInput, authorData));
            } catch (e) {
                expect(e).toEqual('Please attach files to proceed with thesis submission');
            }
        });

        it('dispatches expected actions on successful save', async () => {
            const customInput = JSON.parse(JSON.stringify(thesisFormData));

            mockApi
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: 'UQ:'+ authorData.aut_student_username, fileName: "test.txt"}).apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onAny()
                .reply(200, {});

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOAD_PROGRESS@test.txt',
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.submitThesis(customInput, authorData));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on failed files upload', async () => {
            const customInput = JSON.parse(JSON.stringify(thesisFormData));

            mockApi
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: 'UQ:'+ authorData.aut_student_username, fileName: "test.txt"}).apiUrl)
                .reply(500, 'error')
                .onAny()
                .reply(200, {});

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOADED_FAILED@test.txt',
                actions.CREATE_RECORD_FAILED
            ];

            try {
                await mockActionsStore.dispatch(recordActions.submitThesis(customInput, authorData));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                expect(e).toEqual('Submit Thesis: File upload failed.  (' + locale.global.errorMessages[500].message + ')');
            }
        });

        it('dispatches expected actions on failed save but successful file upload', async () => {
            const customInput = JSON.parse(JSON.stringify(thesisFormData));

            mockApi
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: 'UQ:'+ authorData.aut_student_username, fileName: "test.txt"}).apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"})
                .reply(200, {})
                .onAny()
                .reply(500, {});

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOAD_PROGRESS@test.txt',
                actions.CREATE_RECORD_FAILED
            ];

            try {
                await mockActionsStore.dispatch(recordActions.submitThesis(customInput, authorData));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                expect(e).toEqual('Submit Thesis: Error occurred while saving record to eSpace.  (' + locale.global.errorMessages[500].message + ')');
            }
        });

        it('dispatches expected actions for anon user', async () => {
            mockApi
                .onAny()
                .reply(403, {});

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                'FILE_UPLOADED_FAILED@test.txt',
                actions.CREATE_RECORD_FAILED
            ];

            try {
                await mockActionsStore.dispatch(recordActions.submitThesis(thesisFormData, authorData));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

    });
});
