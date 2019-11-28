import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as recordActions from './records';
import { record } from 'mock/data';

describe('Record action creators', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('createNewRecord()', () => {
        it('dispatches expected actions on successful save', async() => {
            const testInput = {
                currentAuthor: [
                    {
                        nameAsPublished: 'Researcher, J',
                        authorId: 410,
                    },
                ],
                rek_title: 'test',
                rek_display_type: 179,
                authors: [
                    {
                        nameAsPublished: 'test',
                        disabled: false,
                        selected: true,
                        authorId: 410,
                    },
                ],
                editors: [],
                files: [],
                supervisors: [],
                fieldOfResearch: '',
                fez_record_search_key_journal_name: {
                    rek_journal_name: 'test',
                },
                rek_date: '2017-01-01',
                rek_subtype: 'Article (original research)',
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, { data: { ...record } });

            const expectedActions = [actions.CREATE_RECORD_SAVING, actions.CREATE_RECORD_SUCCESS];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save on alternate data format', async() => {
            const testInput = {
                currentAuthor: [
                    {
                        nameAsPublished: 'Researcher, J',
                        authorId: 410,
                    },
                ],
                rek_title: 'test',
                rek_display_type: 179,
                authors: [
                    {
                        nameAsPublished: 'test',
                        disabled: false,
                        selected: true,
                        authorId: 410,
                    },
                ],
                editors: [],
                files: [],
                supervisors: [],
                fieldOfResearch: '',
                fez_record_search_key_journal_name: {
                    rek_journal_name: 'test',
                },
                rek_date: '2017-01-01',
                rek_subtype: 'Article (original research)',
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { data: { ...record } } })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, { data: { data: { ...record } } });

            const expectedActions = [actions.CREATE_RECORD_SAVING, actions.CREATE_RECORD_SUCCESS];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save with files', async() => {
            const testInput = {
                currentAuthor: [
                    {
                        nameAsPublished: 'Researcher, J',
                        authorId: 410,
                    },
                ],
                rek_title: 'test',
                rek_display_type: 179,
                authors: [
                    {
                        nameAsPublished: 'test',
                        disabled: false,
                        selected: true,
                        authorId: 410,
                    },
                ],
                editors: [],
                files: {
                    queue: [
                        {
                            name: 'test.txt',
                            fileData: {
                                name: 'test.txt',
                            },
                        },
                    ],
                    isValid: true,
                },
                supervisors: [],
                fieldOfResearch: '',
                fez_record_search_key_journal_name: {
                    rek_journal_name: 'test',
                },
                rek_date: '2017-01-01',
                rek_subtype: 'Article (original research)',
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', { name: 'test.txt' })
                .reply(200, {});

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOAD_PROGRESS@test.txt',
                actions.CREATE_RECORD_SUCCESS,
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save with files api failure', async() => {
            const testInput = {
                currentAuthor: [
                    {
                        nameAsPublished: 'Researcher, J',
                        authorId: 410,
                    },
                ],
                rek_title: 'test',
                rek_display_type: 179,
                authors: [
                    {
                        nameAsPublished: 'test',
                        disabled: false,
                        selected: true,
                        authorId: 410,
                    },
                ],
                editors: [],
                files: {
                    queue: [
                        {
                            name: 'test.txt',
                            fileData: {
                                name: 'test.txt',
                            },
                        },
                    ],
                    isValid: true,
                },
                supervisors: [],
                fieldOfResearch: '',
                fez_record_search_key_journal_name: {
                    rek_journal_name: 'test',
                },
                rek_date: '2017-01-01',
                rek_subtype: 'Article (original research)',
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(500)
                .onPut('s3-ap-southeast-2.amazonaws.com', { name: 'test.txt' })
                .reply(200, {});

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                actions.APP_ALERT_SHOW,
                'FILE_UPLOADED_FAILED@test.txt',
                actions.CREATE_RECORD_SUCCESS,
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for anon user', async() => {
            const testInput = {
                currentAuthor: [
                    {
                        nameAsPublished: 'Researcher, J',
                        authorId: 410,
                    },
                ],
                rek_title: 'test',
                rek_display_type: 179,
                authors: [
                    {
                        nameAsPublished: 'test',
                        disabled: false,
                        selected: true,
                        authorId: 410,
                    },
                ],
                editors: [],
                files: [],
                supervisors: [],
                fieldOfResearch: '',
                fez_record_search_key_journal_name: {
                    rek_journal_name: 'test',
                },
                rek_date: '2017-01-01',
                rek_subtype: 'Article (original research)',
            };

            mockApi.onAny().reply(403, {});

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.CREATE_RECORD_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions if patch record fails', async() => {
            const testInput = {
                currentAuthor: [
                    {
                        nameAsPublished: 'Researcher, J',
                        authorId: 410,
                    },
                ],
                rek_title: 'test',
                rek_display_type: 179,
                authors: [
                    {
                        nameAsPublished: 'test',
                        disabled: false,
                        selected: true,
                        authorId: 410,
                    },
                ],
                fez_record_search_key_journal_name: {
                    rek_journal_name: 'test',
                },
                rek_date: '2017-01-01',
                rek_subtype: 'Article (original research)',
                files: {
                    queue: [
                        {
                            name: 'test.txt',
                            fileData: {
                                name: 'test.txt',
                            },
                        },
                    ],
                },
            };
            const testPid = 'UQ:396321';
            const pidRequest = { pid: testPid };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, ['s3-ap-southeast-2.amazonaws.com'])
                .onPut(/(s3-ap-southeast-2.amazonaws.com)/)
                .reply(200, { data: {} })
                .onPost(repositories.routes.RECORDS_ISSUES_API({ pid: '.*' }).apiUrl)
                .reply(200, { data: '' })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(500);

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOAD_PROGRESS@test.txt',
                actions.APP_ALERT_SHOW,
                actions.CREATE_RECORD_SUCCESS,
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on issues api posts comments successfully', async() => {
            const testInput = {
                currentAuthor: [
                    {
                        nameAsPublished: 'Researcher, J',
                        authorId: 410,
                    },
                ],
                rek_title: 'test',
                rek_display_type: 179,
                authors: [
                    {
                        nameAsPublished: 'test',
                        disabled: false,
                        selected: true,
                        authorId: 410,
                    },
                ],
                editors: [],
                files: [],
                supervisors: [],
                fieldOfResearch: '',
                fez_record_search_key_journal_name: {
                    rek_journal_name: 'test',
                },
                rek_date: '2017-01-01',
                rek_subtype: 'Article (original research)',
                comments: 'This is a test',
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, ['s3-ap-southeast-2.amazonaws.com'])
                .onPut(/(s3-ap-southeast-2.amazonaws.com)/)
                .reply(200, { data: {} })
                .onPost(repositories.routes.RECORDS_ISSUES_API({ pid: '.*' }).apiUrl)
                .reply(200, { data: '' })
                .onPatch(repositories.routes.RECORDS_ISSUES_API(pidRequest).apiUrl)
                .reply(200, { data: {} });

            const expectedActions = [actions.CREATE_RECORD_SAVING, actions.CREATE_RECORD_SUCCESS];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on issues api failure to post comments', async() => {
            const testInput = {
                currentAuthor: [
                    {
                        nameAsPublished: 'Researcher, J',
                        authorId: 410,
                    },
                ],
                rek_title: 'test',
                rek_display_type: 179,
                authors: [
                    {
                        nameAsPublished: 'test',
                        disabled: false,
                        selected: true,
                        authorId: 410,
                    },
                ],
                editors: [],
                files: [],
                supervisors: [],
                fieldOfResearch: '',
                fez_record_search_key_journal_name: {
                    rek_journal_name: 'test',
                },
                rek_date: '2017-01-01',
                rek_subtype: 'Article (original research)',
                comments: 'This is a test',
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, ['s3-ap-southeast-2.amazonaws.com'])
                .onPut(/(s3-ap-southeast-2.amazonaws.com)/)
                .reply(200, { data: {} })
                .onPost(repositories.routes.RECORDS_ISSUES_API({ pid: '.*' }).apiUrl)
                .reply(200, { data: '' })
                .onPatch(repositories.routes.RECORDS_ISSUES_API(pidRequest).apiUrl)
                .reply(500);

            const expectedActions = [actions.CREATE_RECORD_SAVING, actions.CREATE_RECORD_SUCCESS];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('correctly creates a record that needs no data deletions', async() => {
            const testInput = {
                rek_title: 'test',
                rek_display_type: 179,
                supervisors: [],
                fieldOfResearch: '',
                fez_record_search_key_journal_name: {
                    rek_journal_name: 'test',
                },
                rek_date: '2017-01-01',
                rek_subtype: 'Article (original research)',
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, ['s3-ap-southeast-2.amazonaws.com'])
                .onPut(/(s3-ap-southeast-2.amazonaws.com)/)
                .reply(200, { data: {} })
                .onPost(repositories.routes.RECORDS_ISSUES_API({ pid: '.*' }).apiUrl)
                .reply(200, { data: '' })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, { data: { ...record } });

            const expectedActions = [actions.CREATE_RECORD_SAVING, actions.CREATE_RECORD_SUCCESS];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions when authors list is not provided (just author)', async() => {
            const testInput = {
                currentAuthor: [
                    {
                        nameAsPublished: 'Researcher, J',
                        authorId: 410,
                    },
                ],
                rek_title: 'test',
                rek_display_type: 179,
                editors: [],
                files: [],
                supervisors: [],
                fieldOfResearch: '',
                fez_record_search_key_journal_name: {
                    rek_journal_name: 'test',
                },
                rek_date: '2017-01-01',
                rek_subtype: 'Article (original research)',
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, ['s3-ap-southeast-2.amazonaws.com'])
                .onPut(/(s3-ap-southeast-2.amazonaws.com)/)
                .reply(200, { data: {} })
                .onPost(repositories.routes.RECORDS_ISSUES_API({ pid: '.*' }).apiUrl)
                .reply(200, { data: '' })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, { data: { ...record } });

            const expectedActions = [actions.CREATE_RECORD_SAVING, actions.CREATE_RECORD_SUCCESS];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save of an NTRO record', async() => {
            const testInput = {
                currentAuthor: [
                    {
                        nameAsPublished: 'Researcher, J',
                        authorId: 410,
                    },
                ],
                rek_title: 'test',
                rek_display_type: 179,
                authors: [
                    {
                        nameAsPublished: 'test',
                        disabled: false,
                        selected: true,
                        authorId: 410,
                    },
                ],
                editors: [],
                files: [],
                supervisors: [],
                fieldOfResearch: '',
                fez_record_search_key_journal_name: {
                    rek_journal_name: 'test',
                },
                rek_date: '2017-01-01',
                rek_subtype: 'Article (original research)',
                isNtro: true,
                ntroAbstract: {
                    rek_description: 'blah blah blah',
                    rek_formatted_abstract: '<p>blah blah blah</p>',
                },
                grants: [
                    {
                        rek_grant_agency_type: 7,
                        rek_grant_agency_type_order: 1,
                    },
                ],
                languages: [
                    {
                        rek_language: 'english',
                        rek_language_order: 1,
                    },
                ],
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, ['s3-ap-southeast-2.amazonaws.com'])
                .onPut(/(s3-ap-southeast-2.amazonaws.com)/)
                .reply(200, { data: {} })
                .onPost(repositories.routes.RECORDS_ISSUES_API({ pid: '.*' }).apiUrl)
                .reply(200, { data: '' })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, { data: { ...record } });

            const expectedActions = [actions.CREATE_RECORD_SAVING, actions.CREATE_RECORD_SUCCESS];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save of record with various obscure fields', async() => {
            const testInput = {
                currentAuthor: [
                    {
                        nameAsPublished: 'Researcher, J',
                        authorId: 410,
                    },
                ],
                rek_title: 'test',
                rek_display_type: 179,
                authors: [
                    {
                        nameAsPublished: 'test',
                        disabled: false,
                        selected: true,
                        authorId: 410,
                    },
                ],
                editors: [],
                files: [],
                supervisors: [],
                fez_record_search_key_journal_name: {
                    rek_journal_name: 'test',
                },
                rek_date: '2017-01-01',
                rek_subtype: 'Article (original research)',
                isNtro: true,
                contact: {
                    contactName: 'Test Contact',
                    contactNameId: {
                        id: 121212,
                        value: 'Test, Contact',
                    },
                    contactEmail: 'test@example.com',
                },
                geographicArea: 'lat long string for some place somewhere',
                significance: '454026',
                impactStatement: {
                    htmlText: '<p>more blah</p>',
                },
                fieldOfResearch: [
                    {
                        rek_value: {
                            key: 7,
                        },
                        rek_order: 1,
                    },
                ],
                qualityIndicators: [
                    {
                        rek_quality_indicator: 454035,
                        rek_quality_indicator_order: 1,
                    },
                ],
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, ['s3-ap-southeast-2.amazonaws.com'])
                .onPut(/(s3-ap-southeast-2.amazonaws.com)/)
                .reply(200, { data: {} })
                .onPost(repositories.routes.RECORDS_ISSUES_API({ pid: '.*' }).apiUrl)
                .reply(200, { data: '' })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, { data: { ...record } });

            const expectedActions = [actions.CREATE_RECORD_SAVING, actions.CREATE_RECORD_SUCCESS];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('submitThesis()', () => {
        it('dispatches expected actions on failed RHD Thesis save', async() => {
            const testInput = {
                authors: {},
                editors: {},
                currentAuthor: [{ nameAsPublished: 'HDR Student, N', authorId: 44444 }],
                fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:152694' }],
                supervisors: [
                    {
                        nameAsPublished: 'Test',
                        creatorRole: '',
                        affiliation: '',
                        orgaff: '',
                        orgtype: '',
                        disabled: false,
                    },
                ],
                fieldOfResearch: [
                    {
                        rek_value: {
                            key: 451800,
                            value: '0101 Pure Mathematics',
                        },
                        rek_order: 1,
                    },
                ],
                thesisTitle: { htmlText: '<p>Test</p>', plainText: 'Test' },
                thesisAbstract: { htmlText: '<p>Test</p>', plainText: 'Test' },
                fez_record_search_key_org_name: { rek_org_name: 'The University of Queensland' },
                rek_object_type: 3,
                rek_date: '2019-3-27',
                fez_record_search_key_keywords: [{ rek_keywords: 'Test', rek_keywords_order: 1 }],
                files: {
                    queue: [{ fileData: {}, name: 'Test.png', size: 961311, access_condition_id: 3 }],
                    isValid: true,
                },
                rek_status: 3,
                fileAccessId: 3,
                rek_genre_type: 'MPhil Thesis',
                rek_display_type: 187,
                fez_record_search_key_org_unit_name: { rek_org_unit_name: 'Test' },
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(500, { rek_pid: pidRequest.pid })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {})
                .reply(200, {});

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.APP_ALERT_SHOW,
                actions.CREATE_RECORD_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                expect(e.status).toEqual(500);
            }
        });

        it('dispatches expected actions on failed file upload presigned URL for RHD Thesis', async() => {
            const testInput = {
                authors: {},
                editors: {},
                comments: 'Test',
                currentAuthor: [{ nameAsPublished: 'HDR Student, N', authorId: 44444 }],
                fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:152694' }],
                supervisors: [
                    {
                        nameAsPublished: 'Test',
                        creatorRole: '',
                        affiliation: '',
                        orgaff: '',
                        orgtype: '',
                        disabled: false,
                    },
                ],
                fieldOfResearch: [{ rek_value: { key: 451800, value: '0101 Pure Mathematics' }, rek_order: 1 }],
                thesisTitle: { htmlText: '<p>Test</p>', plainText: 'Test' },
                thesisAbstract: { htmlText: '<p>Test</p>', plainText: 'Test' },
                fez_record_search_key_org_name: { rek_org_name: 'The University of Queensland' },
                rek_object_type: 3,
                rek_date: '2019-3-27',
                fez_record_search_key_keywords: [{ rek_keywords: 'Test', rek_keywords_order: 1 }],
                files: {
                    queue: [{ fileData: {}, name: 'Test.png', size: 961311, access_condition_id: 3 }],
                    isValid: true,
                },
                rek_status: 3,
                fileAccessId: 3,
                rek_genre_type: 'MPhil Thesis',
                rek_display_type: 187,
                fez_record_search_key_org_unit_name: { rek_org_unit_name: 'Test' },
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(0);

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOADED_FAILED@Test.png',
                actions.CREATE_RECORD_SUCCESS,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions on failed RHD Thesis save', async() => {
            const testInput = {
                currentAuthor: [{ nameAsPublished: 'HDR Student, N', authorId: 44444 }],
                fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:152694' }],
                supervisors: [
                    {
                        nameAsPublished: 'Test',
                        creatorRole: '',
                        affiliation: '',
                        orgaff: '',
                        orgtype: '',
                        disabled: false,
                    },
                ],
                fieldOfResearch: [{ rek_value: { key: 451800, value: '0101 Pure Mathematics' }, rek_order: 1 }],
                thesisTitle: { htmlText: '<p>Test</p>', plainText: 'Test' },
                thesisAbstract: { htmlText: '<p>Test</p>', plainText: 'Test' },
                fez_record_search_key_org_name: { rek_org_name: 'The University of Queensland' },
                rek_object_type: 3,
                rek_date: '2019-3-27',
                fez_record_search_key_keywords: [{ rek_keywords: 'Test', rek_keywords_order: 1 }],
                files: {
                    queue: [{ fileData: {}, name: 'Test.png', size: 961311, access_condition_id: 3 }],
                    isValid: true,
                },
                rek_status: 3,
                fileAccessId: 3,
                rek_genre_type: 'MPhil Thesis',
                rek_display_type: 187,
                fez_record_search_key_org_unit_name: { rek_org_unit_name: 'Test' },
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(500, { rek_pid: pidRequest.pid })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {})
                .reply(200, {});

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.APP_ALERT_SHOW,
                actions.CREATE_RECORD_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                expect(e.status).toEqual(500);
            }
        });

        it('dispatches expected actions on failed RHD Thesis file upload', async() => {
            const testInput = {
                currentAuthor: [{ nameAsPublished: 'HDR Student, N', authorId: 44444 }],
                fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:152694' }],
                supervisors: [
                    {
                        nameAsPublished: 'Test',
                        creatorRole: '',
                        affiliation: '',
                        orgaff: '',
                        orgtype: '',
                        disabled: false,
                    },
                ],
                fieldOfResearch: [{ rek_value: { key: 451800, value: '0101 Pure Mathematics' }, rek_order: 1 }],
                thesisTitle: { htmlText: '<p>Test</p>', plainText: 'Test' },
                thesisAbstract: { htmlText: '<p>Test</p>', plainText: 'Test' },
                fez_record_search_key_org_name: { rek_org_name: 'The University of Queensland' },
                rek_object_type: 3,
                rek_date: '2019-3-27',
                fez_record_search_key_keywords: [{ rek_keywords: 'Test', rek_keywords_order: 1 }],
                files: {
                    queue: [{ fileData: {}, name: 'Test.png', size: 961311, access_condition_id: 3 }],
                    isValid: true,
                },
                rek_status: 3,
                fileAccessId: 3,
                rek_genre_type: 'MPhil Thesis',
                rek_display_type: 187,
                fez_record_search_key_org_unit_name: { rek_org_unit_name: 'Test' },
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(500)
                .onPut('s3-ap-southeast-2.amazonaws.com', {})
                .reply(200, {});

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                actions.APP_ALERT_SHOW,
                'FILE_UPLOADED_FAILED@Test.png',
                actions.CREATE_RECORD_SUCCESS,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions on failed to get a presigned URL file upload', async() => {
            const testInput = {
                currentAuthor: [{ nameAsPublished: 'HDR Student, N', authorId: 44444 }],
                fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:152694' }],
                supervisors: [
                    {
                        nameAsPublished: 'Test',
                        creatorRole: '',
                        affiliation: '',
                        orgaff: '',
                        orgtype: '',
                        disabled: false,
                    },
                ],
                fieldOfResearch: [{ rek_value: { key: 451800, value: '0101 Pure Mathematics' }, rek_order: 1 }],
                thesisTitle: { htmlText: '<p>Test</p>', plainText: 'Test' },
                thesisAbstract: { htmlText: '<p>Test</p>', plainText: 'Test' },
                fez_record_search_key_org_name: { rek_org_name: 'The University of Queensland' },
                rek_object_type: 3,
                rek_date: '2019-3-27',
                fez_record_search_key_keywords: [{ rek_keywords: 'Test', rek_keywords_order: 1 }],
                files: {
                    queue: [{ fileData: {}, name: 'Test.png', size: 961311, access_condition_id: 3 }],
                    isValid: true,
                },
                rek_status: 3,
                fileAccessId: 3,
                rek_genre_type: 'MPhil Thesis',
                rek_display_type: 187,
                fez_record_search_key_org_unit_name: { rek_org_unit_name: 'Test' },
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.RECORDS_ISSUES_API({ pid: pidRequest.pid }).apiUrl, '.*')
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, '')
                .onAny()
                .reply(0);

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOADED_FAILED@Test.png',
                actions.CREATE_RECORD_SUCCESS,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions where are no files to upload', async() => {
            const testInput = {
                currentAuthor: [{ nameAsPublished: 'HDR Student, N', authorId: 44444 }],
                fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:152694' }],
                supervisors: [
                    {
                        nameAsPublished: 'Test',
                        creatorRole: '',
                        affiliation: '',
                        orgaff: '',
                        orgtype: '',
                        disabled: false,
                    },
                ],
                fieldOfResearch: [{ rek_value: { key: 451800, value: '0101 Pure Mathematics' }, rek_order: 1 }],
                thesisTitle: { htmlText: '<p>Test</p>', plainText: 'Test' },
                thesisAbstract: { htmlText: '<p>Test</p>', plainText: 'Test' },
                fez_record_search_key_org_name: { rek_org_name: 'The University of Queensland' },
                rek_object_type: 3,
                rek_date: '2019-3-27',
                fez_record_search_key_keywords: [{ rek_keywords: 'Test', rek_keywords_order: 1 }],
                files: {
                    queue: [],
                    isValid: true,
                },
                rek_status: 3,
                fileAccessId: 3,
                rek_genre_type: 'MPhil Thesis',
                rek_display_type: 187,
                fez_record_search_key_org_unit_name: { rek_org_unit_name: 'Test' },
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {})
                .reply(0);

            const expectedActions = [actions.CREATE_RECORD_SAVING, actions.CREATE_RECORD_SUCCESS];

            await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions with files and comments', async() => {
            const testInput = {
                currentAuthor: [{ nameAsPublished: 'HDR Student, N', authorId: 44444 }],
                fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:152694' }],
                supervisors: [
                    {
                        nameAsPublished: 'Test',
                        creatorRole: '',
                        affiliation: '',
                        orgaff: '',
                        orgtype: '',
                        disabled: false,
                    },
                ],
                fieldOfResearch: [{ rek_value: { key: 451800, value: '0101 Pure Mathematics' }, rek_order: 1 }],
                thesisTitle: { htmlText: '<p>Test</p>', plainText: 'Test' },
                thesisAbstract: { htmlText: '<p>Test</p>', plainText: 'Test' },
                fez_record_search_key_org_name: { rek_org_name: 'The University of Queensland' },
                rek_object_type: 3,
                rek_date: '2019-3-27',
                fez_record_search_key_keywords: [{ rek_keywords: 'Test', rek_keywords_order: 1 }],
                files: {
                    queue: [{ fileData: {}, name: 'Test.png', size: 961311, access_condition_id: 3 }],
                    isValid: true,
                },
                rek_status: 3,
                fileAccessId: 3,
                rek_genre_type: 'MPhil Thesis',
                rek_display_type: 187,
                fez_record_search_key_org_unit_name: { rek_org_unit_name: 'Test' },
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {})
                .reply(200, { data: { ...record } });

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOAD_PROGRESS@Test.png',
                actions.CREATE_RECORD_SUCCESS,
            ];

            await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('clearNewRecord()', () => {
        it('dispatches expected actions', async() => {
            const expectedActions = [actions.CREATE_RECORD_RESET];

            await mockActionsStore.dispatch(recordActions.clearNewRecord());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('adminReset()', () => {
        it('dispatches expected actions', async() => {
            const expectedActions = [actions.ADMIN_CREATE_RECORD_RESET];

            await mockActionsStore.dispatch(recordActions.adminReset());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('adminUpdate()', () => {
        const testInput = {
            pid: 'UQ:396321',
        };
        it('dispatches expected actions on successful update', async() => {
            const url = repositories.routes.EXISTING_RECORD_API(testInput).apiUrl;

            mockApi.onPatch(url).reply(200, { data: record });

            const expectedActions = [actions.ADMIN_UPDATE_WORK_PROCESSING, actions.ADMIN_UPDATE_WORK_SUCCESS];

            await mockActionsStore.dispatch(
                recordActions.adminUpdate({
                    publication: {
                        rek_pid: 'UQ:396321',
                    },
                    securitySection: {
                        rek_security_policy: 2,
                    },
                }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on missing data in response', async() => {
            const url = repositories.routes.EXISTING_RECORD_API(testInput).apiUrl;
            mockApi.onPatch(url).reply(200, {});

            const expectedActions = [actions.ADMIN_UPDATE_WORK_PROCESSING, actions.ADMIN_UPDATE_WORK_SUCCESS];

            await mockActionsStore.dispatch(
                recordActions.adminUpdate({
                    publication: {
                        rek_pid: 'UQ:396321',
                    },
                    securitySection: {
                        rek_security_policy: 2,
                    },
                }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on network failure', async() => {
            mockApi.onAny().reply(500);

            const expectedActions = [
                actions.ADMIN_UPDATE_WORK_PROCESSING,
                actions.APP_ALERT_SHOW,
                actions.ADMIN_UPDATE_WORK_FAILED,
            ];

            let requestFailed = false;
            try {
                await mockActionsStore.dispatch(
                    recordActions.adminUpdate({
                        publication: {
                            rek_pid: 'UQ:396321',
                        },
                        securitySection: {
                            rek_security_policy: 2,
                        },
                    }),
                );
            } catch (exception) {
                expect(exception.status).toBe(500);
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                requestFailed = true;
            }
            expect(requestFailed).toBe(true);
        });

        it('dispatches expected actions on edit record successfully with file upload', async() => {
            const url = repositories.routes.EXISTING_RECORD_API(testInput).apiUrl;

            mockApi
                .onPatch(url)
                .reply(200, { data: record })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', { name: 'test.txt' })
                .reply(200, {});

            const expectedActions = [
                actions.ADMIN_UPDATE_WORK_PROCESSING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOAD_PROGRESS@test.txt',
                actions.ADMIN_UPDATE_WORK_SUCCESS,
            ];

            await mockActionsStore.dispatch(
                recordActions.adminUpdate({
                    publication: {
                        rek_pid: 'UQ:396321',
                    },
                    securitySection: {
                        rek_security_policy: 2,
                    },

                    filesSection: {
                        files: {
                            queue: [
                                {
                                    name: 'test.txt',
                                    fileData: {
                                        name: 'test.txt',
                                    },
                                },
                            ],
                        },
                    },
                }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('adminCreate()', () => {
        it('dispatches expected actions on create record successfully', async() => {
            const testInput = {
                authorsSection: {
                    authors: [
                        {
                            nameAsPublished: 'test',
                            disabled: false,
                            selected: true,
                            authorId: 410,
                        },
                    ],
                },
                bibliographicSection: {
                    rek_title: 'test',
                    rek_display_type: 179,
                    fez_record_search_key_journal_name: {
                        rek_journal_name: 'test',
                    },
                    rek_date: '2017-01-01',
                    rek_subtype: 'Article (original research)',
                },
                filesSection: {},
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, { data: { ...record } });

            const expectedActions = [actions.ADMIN_CREATE_RECORD_SAVING, actions.ADMIN_CREATE_RECORD_SUCCESS];

            await mockActionsStore.dispatch(recordActions.adminCreate(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on create record successfully with file upload', async() => {
            const testInput = {
                authorsSection: {
                    authors: [
                        {
                            nameAsPublished: 'test',
                            disabled: false,
                            selected: true,
                            authorId: 410,
                        },
                    ],
                },
                bibliographicSection: {
                    rek_title: 'test',
                    rek_display_type: 179,
                    fez_record_search_key_journal_name: {
                        rek_journal_name: 'test',
                    },
                    rek_date: '2017-01-01',
                    rek_subtype: 'Article (original research)',
                },
                filesSection: {
                    files: {
                        queue: [
                            {
                                name: 'test.txt',
                                fileData: {
                                    name: 'test.txt',
                                },
                            },
                        ],
                    },
                },
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', { name: 'test.txt' })
                .reply(200, {});

            const expectedActions = [
                actions.ADMIN_CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOAD_PROGRESS@test.txt',
                actions.ADMIN_CREATE_RECORD_SUCCESS,
            ];

            await mockActionsStore.dispatch(recordActions.adminCreate(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on create record successfully with file upload', async() => {
            const testInput = {
                authorsSection: {
                    authors: [
                        {
                            nameAsPublished: 'test',
                            disabled: false,
                            selected: true,
                            authorId: 410,
                        },
                    ],
                },
                bibliographicSection: {
                    rek_title: 'test',
                    rek_display_type: 179,
                    fez_record_search_key_journal_name: {
                        rek_journal_name: 'test',
                    },
                    rek_date: '2017-01-01',
                    rek_subtype: 'Article (original research)',
                },
                filesSection: {
                    files: {
                        queue: [
                            {
                                name: 'test.txt',
                                fileData: {
                                    name: 'test.txt',
                                },
                            },
                        ],
                    },
                },
            };
            const pidRequest = { pid: 'UQ:396321' };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(500)
                .onPut('s3-ap-southeast-2.amazonaws.com', { name: 'test.txt' })
                .reply(200, {});

            const expectedActions = [
                actions.ADMIN_CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                actions.APP_ALERT_SHOW,
                'FILE_UPLOADED_FAILED@test.txt',
                actions.ADMIN_CREATE_RECORD_SUCCESS,
            ];

            await mockActionsStore.dispatch(recordActions.adminCreate(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for anon user', async() => {
            const testInput = {
                authorsSection: {
                    authors: [
                        {
                            nameAsPublished: 'test',
                            disabled: false,
                            selected: true,
                            authorId: 410,
                        },
                    ],
                },
                bibliographicSection: {
                    rek_title: 'test',
                    rek_display_type: 179,
                    fez_record_search_key_journal_name: {
                        rek_journal_name: 'test',
                    },
                    rek_date: '2017-01-01',
                    rek_subtype: 'Article (original research)',
                },
                filesSection: {
                    files: {
                        queue: [
                            {
                                name: 'test.txt',
                                fileData: {
                                    name: 'test.txt',
                                },
                            },
                        ],
                    },
                },
            };

            mockApi.onAny().reply(403, {});

            const expectedActions = [
                actions.ADMIN_CREATE_RECORD_SAVING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.ADMIN_CREATE_RECORD_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.adminCreate(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('createCollection()', () => {
        it('dispatches expected actions on successful save', async() => {
            const testInput = {
                rek_title: 'Test',
                fez_record_search_key_ismemberof: ['UQ:12345'],
                rek_description: 'Test',
                fez_record_search_key_keywords: [
                    { rek_keywords: 'test 1', rek_keywords_order: 1 },
                    { rek_keywords: 'test 3', rek_keywords_order: 2 },
                ],
            };

            mockApi.onPost(repositories.routes.NEW_COLLECTION_API().apiUrl).reply(200, { data: { ...record } });

            const expectedActions = [actions.CREATE_COLLECTION_SAVING, actions.CREATE_COLLECTION_SUCCESS];

            await mockActionsStore.dispatch(recordActions.createCollection(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on failed save', async() => {
            const testInput = {
                rek_title: 'Test',
                fez_record_search_key_ismemberof: ['UQ:12345'],
                rek_description: 'Test',
                fez_record_search_key_keywords: [
                    { rek_keywords: 'test 1', rek_keywords_order: 1 },
                    { rek_keywords: 'test 3', rek_keywords_order: 2 },
                ],
            };

            mockApi
                .onPost(repositories.routes.NEW_COLLECTION_API().apiUrl)
                .reply(500, { error: { message: 'FAILED' } });

            const expectedActions = [
                actions.CREATE_COLLECTION_SAVING,
                actions.APP_ALERT_SHOW,
                actions.CREATE_COLLECTION_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.createCollection(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions on successful save with no keywords', async() => {
            const testInput = {
                rek_title: 'Test',
                fez_record_search_key_ismemberof: ['UQ:12345'],
                rek_description: 'Test',
                fez_record_search_key_keywords: [],
            };

            mockApi.onPost(repositories.routes.NEW_COLLECTION_API().apiUrl).reply(200, { data: { ...record } });

            const expectedActions = [actions.CREATE_COLLECTION_SAVING, actions.CREATE_COLLECTION_SUCCESS];

            await mockActionsStore.dispatch(recordActions.createCollection(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('createCommunity()', () => {
        it('dispatches expected actions on successful save', async() => {
            const testInput = {
                rek_title: 'Test',
                rek_description: 'Test',
                fez_record_search_key_keywords: [
                    { rek_keywords: 'test 1', rek_keywords_order: 1 },
                    { rek_keywords: 'test 3', rek_keywords_order: 2 },
                ],
            };

            mockApi.onPost(repositories.routes.NEW_COMMUNITY_API().apiUrl).reply(200, { data: { ...record } });

            const expectedActions = [actions.CREATE_COMMUNITY_SAVING, actions.CREATE_COMMUNITY_SUCCESS];

            await mockActionsStore.dispatch(recordActions.createCommunity(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on failed save', async() => {
            const testInput = {
                rek_title: 'Test',
                rek_description: 'Test',
                fez_record_search_key_keywords: [
                    { rek_keywords: 'test 1', rek_keywords_order: 1 },
                    { rek_keywords: 'test 3', rek_keywords_order: 2 },
                ],
            };

            mockApi.onPost(repositories.routes.NEW_COMMUNITY_API().apiUrl).reply(500, { error: { message: 'FAILED' } });

            const expectedActions = [
                actions.CREATE_COMMUNITY_SAVING,
                actions.APP_ALERT_SHOW,
                actions.CREATE_COMMUNITY_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.createCommunity(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions on successful save with no keywords', async() => {
            const testInput = {
                rek_title: 'Test',
                rek_description: 'Test',
                fez_record_search_key_keywords: [],
            };

            mockApi.onPost(repositories.routes.NEW_COMMUNITY_API().apiUrl).reply(200, { data: { ...record } });

            const expectedActions = [actions.CREATE_COMMUNITY_SAVING, actions.CREATE_COMMUNITY_SUCCESS];

            await mockActionsStore.dispatch(recordActions.createCommunity(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
