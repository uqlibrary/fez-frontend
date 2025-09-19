import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as fixRecordActions from './fixRecord';
import { default as mockData } from 'mock/data/testing/myOpenAccess';

describe('Open Access fix record actions', () => {
    const testPid = mockData[0].rek_pid;

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('fixRecord action', () => {
        it('dispatches expected actions with invalid data (missing publication data)', async () => {
            const testInput = { author: '' };

            const expectedActions = [actions.FIX_RECORD_FAILED];

            try {
                await mockActionsStore.dispatch(fixRecordActions.fixRecord(testInput, true));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions with invalid data (missing author data)', async () => {
            const testInput = { publication: '' };

            const expectedActions = [actions.FIX_RECORD_FAILED];

            try {
                await mockActionsStore.dispatch(fixRecordActions.fixRecord(testInput, true));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions with invalid data (missing author is not linked to publication)', async () => {
            const testInput = {
                publication: {
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id: 123,
                        },
                    ],
                },
                author: {
                    aut_id: 124,
                },
            };

            const expectedActions = [actions.FIX_RECORD_FAILED];

            try {
                await mockActionsStore.dispatch(fixRecordActions.fixRecord(testInput, true));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions with invalid data (missing editor is not linked to publication)', async () => {
            const testInput = {
                publication: {
                    fez_record_search_key_contributor_id: [
                        {
                            rek_contributor_id: 124,
                        },
                    ],
                },
                author: {
                    aut_id: 242,
                },
            };

            const expectedActions = [actions.FIX_RECORD_FAILED];

            try {
                await mockActionsStore.dispatch(fixRecordActions.fixRecord(testInput, true));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions for successful record fix with comment', async () => {
            const testInput = {
                publication: {
                    ...mockData[0],
                    fez_record_search_key_contributor_id: [
                        {
                            rek_contributor_id: 242,
                        },
                    ],
                },
                author: {
                    aut_id: 242,
                },
                contentIndicators: [],
                comments: 'Test comments',
            };
            const expectedActions = [actions.FIX_RECORD_PROCESSING, actions.FIX_RECORD_SUCCESS];

            mockApi
                .onPatch(repositories.routes.EXISTING_RECORD_API({ pid: testPid }).apiUrl)
                .reply(200, { data: { ...testInput.publication } })
                .onPost(repositories.routes.MAKE_OPEN_ACCESS_API({ pid: testPid }).apiUrl)
                .reply(200, {});

            try {
                await mockActionsStore.dispatch(fixRecordActions.fixRecord(testInput, true));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                console.log(e);
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions for successful record fix with files', async () => {
            const testInput = {
                publication: {
                    ...mockData[0],
                },
                author: {
                    aut_id: 242,
                },
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

            const expectedActions = [
                actions.FIX_RECORD_PROCESSING,
                actions.FILE_UPLOAD_STARTED,
                `${actions.FILE_UPLOAD_PROGRESS}@test.txt`,
                `${actions.FILE_UPLOAD_COMPLETE}@test.txt`,
                actions.FIX_RECORD_SUCCESS,
            ];

            mockApi
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', { name: 'test.txt' })
                .reply(200, {})
                .onPatch(repositories.routes.EXISTING_RECORD_API({ pid: testPid }).apiUrl)
                .reply(200, { data: { ...mockData[0] } })
                .onPost(repositories.routes.MAKE_OPEN_ACCESS_API({ pid: testPid }).apiUrl)
                .reply(200, {});

            try {
                await mockActionsStore.dispatch(fixRecordActions.fixRecord(testInput, true));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions for successful record fix with url link', async () => {
            const testInput = {
                publication: {
                    ...mockData[0],
                },
                author: {
                    aut_id: 242,
                },
                rek_link: 'http://www.google.com',
            };

            const expectedActions = [actions.FIX_RECORD_PROCESSING, actions.FIX_RECORD_SUCCESS];

            mockApi
                .onPatch(repositories.routes.EXISTING_RECORD_API({ pid: testPid }).apiUrl)
                .reply(200, { data: { ...mockData[0] } })
                .onPost(repositories.routes.MAKE_OPEN_ACCESS_API({ pid: testPid }).apiUrl)
                .reply(200, {});

            try {
                await mockActionsStore.dispatch(fixRecordActions.fixRecord(testInput, true));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions for successful record fix', async () => {
            const testInput = {
                publication: {
                    ...mockData[0],
                },
                author: {
                    aut_id: 242,
                },
            };

            const expectedActions = [actions.FIX_RECORD_PROCESSING, actions.FIX_RECORD_SUCCESS];

            mockApi.onAny().reply(200, {});

            try {
                await mockActionsStore.dispatch(fixRecordActions.fixRecord(testInput, true));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions for record fix for anon user', async () => {
            const testInput = {
                publication: {
                    ...mockData[0],
                    fez_record_search_key_content_indicator: null,
                },
                author: {
                    aut_id: 242,
                },
            };

            const expectedActions = [
                actions.FIX_RECORD_PROCESSING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.FIX_RECORD_FAILED,
            ];

            mockApi.onAny().reply(401, {});

            try {
                await mockActionsStore.dispatch(fixRecordActions.fixRecord(testInput, true));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions for record fix with API returning error', async () => {
            const testInput = {
                publication: {
                    ...mockData[0],
                },
                author: {
                    aut_id: 242,
                },
            };

            const expectedActions = [actions.FIX_RECORD_PROCESSING, actions.APP_ALERT_SHOW, actions.FIX_RECORD_FAILED];

            mockApi.onAny().reply(500, {});

            try {
                await mockActionsStore.dispatch(fixRecordActions.fixRecord(testInput, true));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });
});
