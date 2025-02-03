import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as recordActions from './records';
import { collectionRecord, communityRecord, record } from 'mock/data';
import { NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK } from '../config/general';

/**
 * @param expectedRekDate
 * @param response
 * @param statusCode
 * @return [int, {}]
 */
const assertPayloadsRekDateAndReturnMockedData = (expectedRekDate, response = record, statusCode = 200) => request => {
    expect(JSON.parse(request.data).rek_date).toBe(expectedRekDate);
    return [statusCode, { data: { ...response } }];
};

describe('Record action creators', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('createNewRecord()', () => {
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

        it('dispatches expected actions on successful save', async () => {
            const testInput1 = {
                ...testInput,
                files: [],
            };
            const expectedRekDate = `${testInput.rek_date} 00:00:00`;

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(assertPayloadsRekDateAndReturnMockedData(expectedRekDate))
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(assertPayloadsRekDateAndReturnMockedData(expectedRekDate));

            const expectedActions = [actions.CREATE_RECORD_SAVING, actions.CREATE_RECORD_SUCCESS];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput1));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save on alternate data format', async () => {
            const testInput1 = {
                ...testInput,
                files: [],
            };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { data: { ...record } } })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, { data: { data: { ...record } } });

            const expectedActions = [actions.CREATE_RECORD_SAVING, actions.CREATE_RECORD_SUCCESS];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput1));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save with files', async () => {
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
                actions.FILE_UPLOAD_STARTED,
                `${actions.FILE_UPLOAD_PROGRESS}@test.txt`,
                `${actions.FILE_UPLOAD_COMPLETE}@test.txt`,
                actions.CREATE_RECORD_SUCCESS,
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on failure save with files', async () => {
            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(422, { data: {} })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', { name: 'test.txt' })
                .reply(200, {});

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.FILE_UPLOAD_STARTED,
                `${actions.FILE_UPLOAD_PROGRESS}@test.txt`,
                `${actions.FILE_UPLOAD_COMPLETE}@test.txt`,
                actions.CREATE_RECORD_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions on successful save with files api failure', async () => {
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
                actions.FILE_UPLOAD_STARTED,
                actions.APP_ALERT_SHOW,
                `${actions.FILE_UPLOAD_FAILED}@test.txt`,
                actions.FILE_UPLOAD_STARTED,
                actions.APP_ALERT_SHOW,
                `${actions.FILE_UPLOAD_FAILED}@test.txt`,
                actions.CREATE_RECORD_SUCCESS,
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for anon user', async () => {
            const testInput1 = {
                ...testInput,
                files: [],
            };

            mockApi.onAny().reply(401, {});

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.CREATE_RECORD_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.createNewRecord(testInput1));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions on issues api posts comments successfully', async () => {
            const testInput1 = {
                ...testInput,
                files: [],
                comments: 'This is a test',
            };

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

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput1));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on issues api failure to post comments', async () => {
            const testInput1 = {
                ...testInput,
                files: [],
                comments: 'This is a test',
            };

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

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput1));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('correctly creates a record that needs no data deletions', async () => {
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

        it('dispatches expected actions when authors list is not provided (just author)', async () => {
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

        it('dispatches expected actions on successful save of an NTRO record', async () => {
            const startDate = '2020-01-01';
            expect(startDate).not.toBe(testInput.rek_date);
            const testInput1 = {
                ...testInput,
                files: [],
                isNtro: true,
                rek_subtype: NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
                ntroAbstract: {
                    rek_description: 'blah blah blah',
                    rek_formatted_abstract: '<p>blah blah blah</p>',
                },
                fez_record_search_key_project_start_date: {
                    rek_project_start_date: startDate,
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
            const expectedRekDate = `${startDate} 00:00:00`;

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(assertPayloadsRekDateAndReturnMockedData(expectedRekDate))
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, ['s3-ap-southeast-2.amazonaws.com'])
                .onPut(/(s3-ap-southeast-2.amazonaws.com)/)
                .reply(200, { data: {} })
                .onPost(repositories.routes.RECORDS_ISSUES_API({ pid: '.*' }).apiUrl)
                .reply(200, { data: '' })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(assertPayloadsRekDateAndReturnMockedData(expectedRekDate));

            const expectedActions = [actions.CREATE_RECORD_SAVING, actions.CREATE_RECORD_SUCCESS];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput1));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save of record with various obscure fields', async () => {
            const testInput1 = {
                ...testInput,
                files: [],
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

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput1));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('submitThesis()', () => {
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
            isHdrThesis: true,
        };
        const pidRequest = { pid: 'UQ:396321' };

        it('dispatches expected actions on missing pid', async () => {
            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record, rek_pid: '' } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {})
                .reply(200, { data: { ...record } });
            const expectedActions = [actions.CREATE_RECORD_SAVING, actions.CREATE_RECORD_FAILED];

            try {
                await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions on failed RHD Thesis save', async () => {
            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(500, { rek_pid: pidRequest.pid })
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

        it('dispatches expected actions on failed file upload presigned URL for RHD Thesis', async () => {
            const testInput1 = {
                ...testInput,
                comments: 'Test',
            };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(0);

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.FILE_UPLOAD_STARTED,
                `${actions.FILE_UPLOAD_FAILED}@Test.png`,
                actions.CREATE_RECORD_SUCCESS,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.submitThesis(testInput1));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions on failed RHD Thesis file upload', async () => {
            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(500)
                .onPut('s3-ap-southeast-2.amazonaws.com', {})
                .reply(200, {});

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.FILE_UPLOAD_STARTED,
                actions.APP_ALERT_SHOW,
                `${actions.FILE_UPLOAD_FAILED}@Test.png`,
                actions.CREATE_RECORD_SUCCESS,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions on failed to get a presigned URL file upload', async () => {
            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.RECORDS_ISSUES_API({ pid: pidRequest.pid }).apiUrl, '.*')
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, '')
                .onAny()
                .reply(0);

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.FILE_UPLOAD_STARTED,
                `${actions.FILE_UPLOAD_FAILED}@Test.png`,
                actions.CREATE_RECORD_SUCCESS,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions on failed retry of file uploads', async () => {
            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.RECORDS_ISSUES_API({ pid: pidRequest.pid }).apiUrl, '.*')
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(500, '')
                .onAny()
                .reply(0);

            const expectedActions = [
                actions.FILE_UPLOAD_STARTED,
                actions.APP_ALERT_SHOW,
                `${actions.FILE_UPLOAD_FAILED}@Test.png`,
                actions.FILE_UPLOAD_STARTED,
                actions.APP_ALERT_SHOW,
                `${actions.FILE_UPLOAD_FAILED}@Test.png`,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.submitThesis(testInput, { ...record }));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions when there are no files to upload', async () => {
            const testInput1 = {
                ...testInput,
                files: {
                    ...testInput.files,
                    queue: [],
                },
                isHdrThesis: false,
            };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {})
                .reply(0);

            const expectedActions = [actions.CREATE_RECORD_SAVING, actions.CREATE_RECORD_SUCCESS];

            await mockActionsStore.dispatch(recordActions.submitThesis(testInput1));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions with files and comments', async () => {
            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {})
                .reply(200, { data: { ...record } });

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.FILE_UPLOAD_STARTED,
                `${actions.FILE_UPLOAD_PROGRESS}@Test.png`,
                `${actions.FILE_UPLOAD_COMPLETE}@Test.png`,
                actions.FILE_UPLOAD_COMPLETE,
                actions.CREATE_RECORD_SUCCESS,
            ];

            await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on upload retry', async () => {
            mockApi
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {})
                .reply(200, { data: { ...record } });

            const expectedActions = [
                actions.FILE_UPLOAD_STARTED,
                `${actions.FILE_UPLOAD_PROGRESS}@Test.png`,
                `${actions.FILE_UPLOAD_COMPLETE}@Test.png`,
                actions.FILE_UPLOAD_COMPLETE,
            ];

            await mockActionsStore.dispatch(recordActions.submitThesis(testInput, { ...record }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('clearNewRecord()', () => {
        it('dispatches expected actions', async () => {
            const expectedActions = [actions.CREATE_RECORD_RESET];

            await mockActionsStore.dispatch(recordActions.clearNewRecord());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('adminReset()', () => {
        it('dispatches expected actions', async () => {
            const expectedActions = [actions.ADMIN_CREATE_RECORD_RESET];

            await mockActionsStore.dispatch(recordActions.adminReset());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('adminUpdate()', () => {
        const testInput = {
            pid: 'UQ:396321',
        };
        it('dispatches expected actions on successful update', async () => {
            const url = repositories.routes.EXISTING_RECORD_API(testInput).apiUrl;

            mockApi.onPut(url).reply(200, { data: record });

            const expectedActions = [actions.ADMIN_UPDATE_WORK_PROCESSING, actions.ADMIN_UPDATE_WORK_SUCCESS];

            await mockActionsStore.dispatch(
                recordActions.adminUpdate({
                    rek_display_type: 174,
                    adminSection: {
                        rek_subtype: 'Textbook',
                    },
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

        it('dispatches expected actions on successful job created', async () => {
            const url = repositories.routes.EXISTING_RECORD_API(testInput).apiUrl;

            mockApi.onPut(url).reply(201, { data: record });

            const expectedActions = [actions.ADMIN_UPDATE_WORK_PROCESSING, actions.ADMIN_UPDATE_WORK_JOB_CREATED];

            await mockActionsStore.dispatch(
                recordActions.adminUpdate({
                    rek_display_type: 174,
                    adminSection: {
                        rek_subtype: 'Textbook',
                    },
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

        it('dispatches expected actions on missing data in response', async () => {
            const url = repositories.routes.EXISTING_RECORD_API(testInput).apiUrl;
            mockApi.onPut(url).reply(200, {});

            const expectedActions = [actions.ADMIN_UPDATE_WORK_PROCESSING, actions.ADMIN_UPDATE_WORK_SUCCESS];

            await mockActionsStore.dispatch(
                recordActions.adminUpdate({
                    rek_display_type: 174,
                    adminSection: {
                        rek_subtype: 'Textbook',
                    },
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

        it('dispatches expected actions on network failure', async () => {
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
                        rek_display_type: 174,
                        adminSection: {
                            rek_subtype: 'Textbook',
                        },
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

        it('dispatches expected actions on edit record failure with file upload', async () => {
            mockApi
                .onPut(repositories.routes.EXISTING_RECORD_API(testInput).apiUrl)
                .replyOnce(422, { data: record })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', { name: 'test.txt' })
                .reply(200, {});

            const expectedActions = [
                actions.ADMIN_UPDATE_WORK_PROCESSING,
                actions.FILE_UPLOAD_STARTED,
                `${actions.FILE_UPLOAD_PROGRESS}@test.txt`,
                `${actions.FILE_UPLOAD_COMPLETE}@test.txt`,
                actions.ADMIN_UPDATE_WORK_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(
                    recordActions.adminUpdate({
                        rek_display_type: 174,
                        adminSection: {
                            rek_subtype: 'Textbook',
                        },
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
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions on edit record successfully with file upload', async () => {
            const url = repositories.routes.EXISTING_RECORD_API(testInput).apiUrl;

            mockApi
                .onPut(url)
                .reply(200, { data: record })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', { name: 'test.txt' })
                .reply(200, {});

            const expectedActions = [
                actions.ADMIN_UPDATE_WORK_PROCESSING,
                actions.FILE_UPLOAD_STARTED,
                `${actions.FILE_UPLOAD_PROGRESS}@test.txt`,
                `${actions.FILE_UPLOAD_COMPLETE}@test.txt`,
                actions.ADMIN_UPDATE_WORK_SUCCESS,
            ];

            await mockActionsStore.dispatch(
                recordActions.adminUpdate({
                    rek_display_type: 174,
                    adminSection: {
                        rek_subtype: 'Textbook',
                    },
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
        const testInput = {
            rek_display_type: 174,
            adminSection: {
                rek_subtype: 'Textbook',
            },
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

        it('dispatches expected actions on create record successfully', async () => {
            const testInput1 = {
                ...testInput,
                filesSection: {},
            };
            const expectedRekDate = `${testInput.bibliographicSection.rek_date} 00:00:00`;

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(assertPayloadsRekDateAndReturnMockedData(expectedRekDate))
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(assertPayloadsRekDateAndReturnMockedData(expectedRekDate));

            const expectedActions = [actions.ADMIN_CREATE_RECORD_SAVING, actions.ADMIN_CREATE_RECORD_SUCCESS];

            await mockActionsStore.dispatch(recordActions.adminCreate(testInput1));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on create record successfully for NTRO design/Arch type', async () => {
            const startDate = '2020-01-01';
            expect(startDate).not.toBe(testInput.bibliographicSection.rek_date);
            const testInput1 = {
                ...testInput,
                filesSection: {},
                adminSection: {
                    rek_subtype: NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
                },
                bibliographicSection: {
                    ...testInput.bibliographicSection,
                    fez_record_search_key_project_start_date: {
                        rek_project_start_date: startDate,
                    },
                },
            };
            const expectedRekDate = `${startDate} 00:00:00`;

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(assertPayloadsRekDateAndReturnMockedData(expectedRekDate))
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(assertPayloadsRekDateAndReturnMockedData(expectedRekDate));

            const expectedActions = [actions.ADMIN_CREATE_RECORD_SAVING, actions.ADMIN_CREATE_RECORD_SUCCESS];
            await mockActionsStore.dispatch(recordActions.adminCreate(testInput1));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on create record successfully with file upload', async () => {
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
                actions.FILE_UPLOAD_STARTED,
                `${actions.FILE_UPLOAD_PROGRESS}@test.txt`,
                `${actions.FILE_UPLOAD_COMPLETE}@test.txt`,
                actions.ADMIN_CREATE_RECORD_SUCCESS,
            ];

            await mockActionsStore.dispatch(recordActions.adminCreate(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on create record failure with file upload', async () => {
            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...record } })
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(422, { data: {} })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', { name: 'test.txt' })
                .reply(200, {});

            const expectedActions = [
                actions.ADMIN_CREATE_RECORD_SAVING,
                actions.FILE_UPLOAD_STARTED,
                `${actions.FILE_UPLOAD_PROGRESS}@test.txt`,
                `${actions.FILE_UPLOAD_COMPLETE}@test.txt`,
                actions.ADMIN_CREATE_RECORD_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.adminCreate(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions on create record successfully with failed file upload', async () => {
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
                actions.FILE_UPLOAD_STARTED,
                actions.APP_ALERT_SHOW,
                `${actions.FILE_UPLOAD_FAILED}@test.txt`,
                actions.FILE_UPLOAD_STARTED,
                actions.APP_ALERT_SHOW,
                `${actions.FILE_UPLOAD_FAILED}@test.txt`,
                actions.ADMIN_CREATE_RECORD_SUCCESS,
            ];

            await mockActionsStore.dispatch(recordActions.adminCreate(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for anon user', async () => {
            mockApi.onAny().reply(401, {});

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
        const testInput = {
            rek_title: 'Test',
            fez_record_search_key_ismemberof: ['UQ:12345'],
            rek_description: 'Test',
            fez_record_search_key_keywords: [
                { rek_keywords: 'test 1', rek_keywords_order: 1 },
                { rek_keywords: 'test 3', rek_keywords_order: 2 },
            ],
        };
        it('dispatches expected actions on successful save', async () => {
            mockApi.onPost(repositories.routes.NEW_COLLECTION_API().apiUrl).reply(200, { data: { ...record } });

            const expectedActions = [actions.CREATE_COLLECTION_SAVING, actions.CREATE_COLLECTION_SUCCESS];

            await mockActionsStore.dispatch(recordActions.createCollection(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on failed save', async () => {
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

        it('dispatches expected actions on successful save with no keywords', async () => {
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

    describe('updateCollection()', () => {
        const pid = 'UQ:123456';
        const testInput = {
            publication: { rek_pid: pid },
            date: '2020-04-07',
            updated: {
                securitySection: {
                    rek_datastream_policy: 2,
                },
            },
        };

        it('dispatches expected actions on successful save', async () => {
            mockApi
                .onPut(repositories.routes.EXISTING_COLLECTION_API({ pid }).apiUrl)
                .reply(200, { data: { ...collectionRecord } });

            const expectedActions = [actions.COLLECTION_UPDATING, actions.COLLECTION_UPDATE_SUCCESS];

            await mockActionsStore.dispatch(recordActions.updateCollection(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on failed save', async () => {
            mockApi
                .onPut(repositories.routes.EXISTING_COLLECTION_API({ pid }).apiUrl)
                .reply(500, { error: { message: 'FAILED' } });

            const expectedActions = [
                actions.COLLECTION_UPDATING,
                actions.APP_ALERT_SHOW,
                actions.COLLECTION_UPDATE_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.updateCollection(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('createCommunity()', () => {
        const testInput = {
            rek_title: 'Test',
            rek_description: 'Test',
            fez_record_search_key_keywords: [
                { rek_keywords: 'test 1', rek_keywords_order: 1 },
                { rek_keywords: 'test 3', rek_keywords_order: 2 },
            ],
        };
        it('dispatches expected actions on successful save', async () => {
            mockApi.onPost(repositories.routes.NEW_COMMUNITY_API().apiUrl).reply(200, { data: { ...record } });

            const expectedActions = [actions.CREATE_COMMUNITY_SAVING, actions.CREATE_COMMUNITY_SUCCESS];

            await mockActionsStore.dispatch(recordActions.createCommunity(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on failed save', async () => {
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

        it('dispatches expected actions on successful save with no keywords', async () => {
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

    describe('updateCommunity()', () => {
        const pid = 'UQ:123456';
        const testInput = {
            publication: { rek_pid: pid },
            date: '2020-04-07',
            updated: {
                securitySection: {
                    rek_security_policy: 4,
                },
            },
        };

        it('dispatches expected actions on successful save', async () => {
            mockApi
                .onPut(repositories.routes.EXISTING_COMMUNITY_API({ pid }).apiUrl)
                .reply(200, { data: { ...communityRecord } });

            const expectedActions = [actions.COMMUNITY_UPDATING, actions.COMMUNITY_UPDATE_SUCCESS];

            await mockActionsStore.dispatch(recordActions.updateCommunity(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on failed save', async () => {
            mockApi
                .onPut(repositories.routes.EXISTING_COMMUNITY_API({ pid }).apiUrl)
                .reply(500, { error: { message: 'FAILED' } });

            const expectedActions = [
                actions.COMMUNITY_UPDATING,
                actions.APP_ALERT_SHOW,
                actions.COMMUNITY_UPDATE_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.updateCommunity(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('unlockRecord()', () => {
        it('dispatches expected actions on success', async () => {
            const pid = 'UQ:123456';

            mockApi.onPatch(repositories.routes.UNLOCK_RECORD_API({ pid }).apiUrl).reply(200, {});
            const expectedActions = [actions.UNLOCK_RECORD_INPROGRESS, actions.UNLOCK_RECORD_SUCCESS];
            const testCallback = jest.fn();

            await mockActionsStore.dispatch(recordActions.unlockRecord('UQ:123456', testCallback));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            expect(testCallback).toBeCalled();
        });

        it('dispatches expected actions on failure', async () => {
            const pid = 'UQ:123456';
            mockApi.onPatch(repositories.routes.UNLOCK_RECORD_API({ pid }).apiUrl).reply(500);
            const expectedActions = [
                actions.UNLOCK_RECORD_INPROGRESS,
                actions.APP_ALERT_SHOW,
                actions.UNLOCK_RECORD_FAILED,
            ];
            const testCallback = jest.fn();

            try {
                await mockActionsStore.dispatch(recordActions.unlockRecord('UQ:123456', testCallback));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                expect(testCallback).not.toBeCalled();
            }
        });
    });

    describe('changeDisplayType()', () => {
        it('dispatches expected actions on success', async () => {
            const pid = 'UQ:123456';

            mockApi.onPatch(repositories.routes.EXISTING_RECORD_API({ pid }).apiUrl).reply(200, {});
            const expectedActions = [actions.CHANGE_DISPLAY_TYPE_INPROGRESS, actions.CHANGE_DISPLAY_TYPE_SUCCESS];

            await mockActionsStore.dispatch(recordActions.changeDisplayType([{ rek_pid: 'UQ:123456' }], {}));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on failure', async () => {
            const pid = 'UQ:123456';
            mockApi.onPatch(repositories.routes.EXISTING_RECORD_API({ pid }).apiUrl).reply(500);
            const expectedActions = [
                actions.CHANGE_DISPLAY_TYPE_INPROGRESS,
                actions.APP_ALERT_SHOW,
                actions.CHANGE_DISPLAY_TYPE_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.changeDisplayType([{ rek_pid: 'UQ:123456' }], {}));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions on success for bulk updates', async () => {
            mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).reply(200, {});
            const expectedActions = [actions.CHANGE_DISPLAY_TYPE_INPROGRESS, actions.CHANGE_DISPLAY_TYPE_SUCCESS];

            await mockActionsStore.dispatch(recordActions.changeDisplayType([{ rek_pid: 'UQ:123456' }], {}, true));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on failure for bulk updates', async () => {
            mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).reply(500);
            const expectedActions = [
                actions.CHANGE_DISPLAY_TYPE_INPROGRESS,
                actions.APP_ALERT_SHOW,
                actions.CHANGE_DISPLAY_TYPE_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(recordActions.changeDisplayType([{ rek_pid: 'UQ:123456' }], {}, true));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('changeSearchKeyValue()', () => {
        it('dispatches expected actions on success for bulk updates', async () => {
            mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).reply(200, {});
            const expectedActions = [
                actions.CHANGE_SEARCH_KEY_VALUE_INPROGRESS,
                actions.CHANGE_SEARCH_KEY_VALUE_SUCCESS,
            ];

            await mockActionsStore.dispatch(
                recordActions.changeSearchKeyValue(
                    [
                        {
                            rek_pid: 'UQ:123456',
                            fez_record_search_key_oa_status: {
                                rek_oa_status: 'test',
                            },
                        },
                    ],
                    {
                        search_key: 'fez_record_search_key_oa_status.rek_oa_status',
                        fez_record_search_key_oa_status: {
                            rek_oa_status: '453692',
                        },
                    },
                ),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on success for bulk updates', async () => {
            mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).reply(200, {});
            const expectedActions = [
                actions.CHANGE_SEARCH_KEY_VALUE_INPROGRESS,
                actions.CHANGE_SEARCH_KEY_VALUE_SUCCESS,
            ];

            await mockActionsStore.dispatch(
                recordActions.changeSearchKeyValue(
                    [
                        {
                            rek_pid: 'UQ:123456',
                            rek_scopus_doc_type: 'ab',
                        },
                    ],
                    {
                        search_key: 'rek_scopus_doc_type',
                        rek_scopus_doc_type: 'ab',
                    },
                ),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on failure for bulk updates', async () => {
            mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).reply(500);
            const expectedActions = [
                actions.CHANGE_SEARCH_KEY_VALUE_INPROGRESS,
                actions.APP_ALERT_SHOW,
                actions.CHANGE_SEARCH_KEY_VALUE_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(
                    recordActions.changeSearchKeyValue(
                        [
                            {
                                rek_pid: 'UQ:123456',
                                fez_record_search_key_oa_status: {
                                    rek_oa_status: 'test',
                                },
                            },
                        ],
                        {
                            search_key: 'fez_record_search_key_oa_status.rek_oa_status',
                            fez_record_search_key_oa_status: {
                                rek_oa_status: '453692',
                            },
                        },
                    ),
                );
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('changeAuthorId()', () => {
        it('dispatches expected actions on success for bulk updates', async () => {
            mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).reply(200, {});
            const expectedActions = [actions.CHANGE_AUTHOR_ID_INPROGRESS, actions.CHANGE_AUTHOR_ID_SUCCESS];

            await mockActionsStore.dispatch(
                recordActions.changeAuthorId(
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
                    { search_author_by: 'author', search_author: { author: 'Test' }, rek_author_id: 1234 },
                ),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on failure for bulk updates', async () => {
            mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).reply(500);
            const expectedActions = [
                actions.CHANGE_AUTHOR_ID_INPROGRESS,
                actions.APP_ALERT_SHOW,
                actions.CHANGE_AUTHOR_ID_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(
                    recordActions.changeAuthorId(
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
                        { search_author_by: 'author', search_author: { author: 'Test' }, rek_author_id: 1234 },
                    ),
                );
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('copyToOrRemoveFromCollection', () => {
        it('dispatches expected actions on success for bulk updates', async () => {
            mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).reply(200, {});
            const expectedActions = [actions.CHANGE_COLLECTIONS_INPROGRESS, actions.CHANGE_COLLECTIONS_SUCCESS];

            await mockActionsStore.dispatch(
                recordActions.copyToOrRemoveFromCollection(
                    [
                        {
                            rek_pid: 'UQ:11111',
                            fez_record_search_key_ismemberof: [
                                {
                                    rek_ismemberof: 'UQ:1111',
                                    rek_author_order: 1,
                                },
                            ],
                        },
                    ],
                    {
                        search_key: 'rek_ismemberof',
                        collections: ['UQ:1234'],
                    },
                ),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on failure for bulk updates', async () => {
            mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).reply(500);
            const expectedActions = [
                actions.CHANGE_COLLECTIONS_INPROGRESS,
                actions.APP_ALERT_SHOW,
                actions.CHANGE_COLLECTIONS_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(
                    recordActions.copyToOrRemoveFromCollection(
                        [
                            {
                                rek_pid: 'UQ:11111',
                                fez_record_search_key_ismemberof: [
                                    {
                                        rek_ismemberof: 'UQ:1234',
                                    },
                                ],
                            },
                        ],
                        {
                            search_key: 'rek_ismemberof',
                            collections: ['UQ:1234'],
                        },
                        true,
                    ),
                );
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('createOrUpdateDoi', () => {
        it('dispatches expected actions on success for bulk updates', async () => {
            mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).reply(200, {});
            const expectedActions = [actions.CREATE_OR_UPDATE_DOI_INPROGRESS, actions.CREATE_OR_UPDATE_DOI_SUCCESS];

            await mockActionsStore.dispatch(
                recordActions.createOrUpdateDoi([
                    {
                        rek_pid: 'UQ:11111',
                    },
                ]),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on failure for bulk updates', async () => {
            mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).reply(500);
            const expectedActions = [
                actions.CREATE_OR_UPDATE_DOI_INPROGRESS,
                actions.APP_ALERT_SHOW,
                actions.CREATE_OR_UPDATE_DOI_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(
                    recordActions.createOrUpdateDoi([
                        {
                            rek_pid: 'UQ:11111',
                        },
                    ]),
                );
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('copyToRemoveFromCommunity', () => {
        it('dispatches expected actions on success for bulk collection updates', async () => {
            mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).reply(200, {});
            const expectedActions = [actions.CHANGE_COMMUNITIES_INPROGRESS, actions.CHANGE_COMMUNITIES_SUCCESS];

            await mockActionsStore.dispatch(
                recordActions.copyToOrRemoveFromCommunity(
                    [
                        {
                            rek_pid: 'UQ:11111',
                            fez_record_search_key_ismemberof: [
                                {
                                    rek_ismemberof: 'UQ:1111',
                                    rek_author_order: 1,
                                },
                            ],
                        },
                    ],
                    {
                        search_key: 'rek_ismemberof',
                        communities: ['UQ:1234'],
                    },
                ),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on failure for bulk updates', async () => {
            mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).reply(500);
            const expectedActions = [
                actions.CHANGE_COMMUNITIES_INPROGRESS,
                actions.APP_ALERT_SHOW,
                actions.CHANGE_COMMUNITIES_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(
                    recordActions.copyToOrRemoveFromCommunity(
                        [
                            {
                                rek_pid: 'UQ:11111',
                                fez_record_search_key_ismemberof: [
                                    {
                                        rek_ismemberof: 'UQ:1234',
                                    },
                                ],
                            },
                        ],
                        {
                            search_key: 'rek_ismemberof',
                            communities: ['UQ:1234'],
                        },
                        true,
                    ),
                );
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });
});
