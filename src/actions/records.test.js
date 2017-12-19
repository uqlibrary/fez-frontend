import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as recordActions from './records';
import * as mockData from "../mock/data";

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
                .onPost(repositories.routes.NEW_RECORD_API())
                .reply(200, {data: {...mockData.record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest))
                .reply(200, {data: {...mockData.record}});


            const expectedActions = [
                {type: actions.CREATE_RECORD_SAVING},
                {type: actions.CREATE_RECORD_SUCCESS}
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
                .onPost(repositories.routes.NEW_RECORD_API())
                .reply(403, {});

            const expectedActions = [
                {type: actions.CREATE_RECORD_SAVING},
                {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
                {type: actions.CREATE_RECORD_FAILED}
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
                            "name": "test.txt"
                        }
                    ]
                }
            };
            const testPid = 'UQ:396321';
            const pidRequest = {pid: testPid};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API())
                .reply(200, {data: {...mockData.record}})
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: testPid, fileName: "test.txt"}))
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"})
                .reply(200, {})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest))
                .reply(500);

            const expectedActions = [
                {type: actions.CREATE_RECORD_SAVING},
                {type: actions.CREATE_RECORD_SUCCESS}
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        
    });

    describe('clearNewRecord()', () => {
        it('dispatches expected actions', async () => {
            const expectedActions = [
                {type: actions.CREATE_RECORD_RESET}
            ];

            await mockActionsStore.dispatch(recordActions.clearNewRecord());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});