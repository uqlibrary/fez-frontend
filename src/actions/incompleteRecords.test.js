import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as publications from './publications';
import * as incompleteRecordList from 'mock/data/records/incompleteNTROlist';
import { updateIncompleteRecord } from './incompleteRecords';
import { mockRecordToFix } from 'mock/data/testing/records';

// extend expect to check actions
expect.extend({toHaveDispatchedActions});

beforeEach(() => {
    mockActionsStore = setupStoreForActions();
    mockApi = setupMockAdapter();
});

afterEach(() => {
    mockApi.reset();
});

describe('incompleteRecords actions', () => {
    it('should call loading/loaded actions on successful load', async () => {
        mockApi
            .onGet(repositories.routes.INCOMPLETE_RECORDS_API({}).apiUrl)
            .reply(200, incompleteRecordList);

        const expectedActions = [
            actions.AUTHOR_INCOMPLETEPUBLICATIONS_LOADING,
            actions.AUTHOR_INCOMPLETEPUBLICATIONS_LOADED
        ];

        await mockActionsStore.dispatch(publications.searchAuthorIncompletePublications({}));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call loading/load failed actions on failed load', async () => {
        mockApi
            .onAny()
            .reply(404);

        const expectedActions = [
            actions.AUTHOR_INCOMPLETEPUBLICATIONS_LOADING,
            actions.AUTHOR_INCOMPLETEPUBLICATIONS_FAILED
        ];

        await mockActionsStore.dispatch(publications.searchAuthorIncompletePublications({}));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

});

describe('updateIncompleteRecord actions', () => {
    const testPid = "UQ:41878";
    const testInput = {
        publication: {
            fez_record_search_key_author_id: [
                {
                    rek_author_id: 123
                }
            ]
        },
        author: {
            aut_id: 124
        }
    };

    it('should call loading/loaded actions on successful load', async () => {
        const testInput = {
            publication: {
                ...mockRecordToFix
            },
            impactStatement: {
                htmlText: '<p>dummy</p>'
            },
            author: {
                aut_id: 410
            }
        };
        mockApi
            .onPatch(repositories.routes.EXISTING_RECORD_API({pid: testPid}).apiUrl)
            .reply(200, {});

        const expectedActions = [
            actions.FIX_RECORD_PROCESSING,
            actions.FIX_RECORD_SUCCESS
        ];

        await mockActionsStore.dispatch(updateIncompleteRecord(testInput));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call loading/load failed actions on incomplete data', async () => {
        const expectedActions = [
            actions.FIX_RECORD_FAILED
        ];

        try {
            await mockActionsStore.dispatch(updateIncompleteRecord({}));
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('should handle plain text impactStatement', async () => {
        const testInput = {
            publication: {
                ...mockData.mockRecordToFix,
            },
            impactStatement: {
                plainText: 'dummy'
            },
            author: {
                aut_id: 410
            }
        };
        mockApi
            .onPatch(repositories.routes.EXISTING_RECORD_API({pid: testPid}).apiUrl)
            .reply(200, {});

        const expectedActions = [
            actions.FIX_RECORD_PROCESSING,
            actions.FIX_RECORD_SUCCESS
        ];

        await mockActionsStore.dispatch(incompleteRecords.updateIncompleteRecord(testInput));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should handle significance', async () => {
        const testInput = {
            publication: {
                ...mockData.mockRecordToFix,
            },
            significance: 454026,
            author: {
                aut_id: 410
            }
        };
        mockApi
            .onPatch(repositories.routes.EXISTING_RECORD_API({pid: testPid}).apiUrl)
            .reply(200, {});

        const expectedActions = [
            actions.FIX_RECORD_PROCESSING,
            actions.FIX_RECORD_SUCCESS
        ];

        await mockActionsStore.dispatch(incompleteRecords.updateIncompleteRecord(testInput));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call loading/load failed actions on bad author', async () => {
        const testInput = {
            ...testInput,
            author: {
                aut_id: 1
            }
        };

        const expectedActions = [
            actions.FIX_RECORD_FAILED
        ];

        try {
            await mockActionsStore.dispatch(updateIncompleteRecord(testInput));
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    // it('should call loading/load failed actions on failed load', async () => {
    //     mockApi
    //         .onAny()
    //         .reply(404);

    //     const expectedActions = [
    //         actions.FIX_RECORD_FAILED
    //     ];

    //     try {
    //         await mockActionsStore.dispatch(incompleteRecords.updateIncompleteRecord({}));
    //     } catch (e) {
    //         expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    //     }
    // });

    it('dispatches updated contributor id', async () => {
        const testInput = {
            publication: {
                ...mockData.mockRecordToFix,
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 123
                    }
                ],
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id: 123
                    }
                ]
            },
            author: {
                aut_id: 123
            }
        };
        mockApi
            .onPatch(repositories.routes.EXISTING_RECORD_API({pid: testPid}).apiUrl)
            .reply(200, {});

        const expectedActions = [
            actions.FIX_RECORD_PROCESSING,
            actions.FIX_RECORD_SUCCESS
        ];

        await mockActionsStore.dispatch(incompleteRecords.updateIncompleteRecord(testInput));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches failure where Current author is not linked to this record', async () => {
        const testInput = {
            publication: {
                ...mockData.mockRecordToFix,
            },
            author: {
                aut_id: 124
            }
        };
        mockApi
            .onPatch(repositories.routes.EXISTING_RECORD_API({pid: testPid}).apiUrl)
            .reply(500, {});

        const expectedActions = [
            // actions.FIX_RECORD_PROCESSING,
            // actions.APP_ALERT_SHOW,
            actions.FIX_RECORD_FAILED
        ];

        try {
            await mockActionsStore.dispatch(incompleteRecords.updateIncompleteRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('dispatches expected actions for successful file upload', async () => {
        const testInput = {
            publication: {
                ...mockData.mockRecordToFix,
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 123
                    }
                ],
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id: 123
                    }
                ]
            },
            author: {
                aut_id: 123
            },
            files: {
                queue: [
                    {
                        name: 'test.txt',
                        fileData: {
                            name: 'test.txt'
                        }
                    }
                ]
            }
        };

        const expectedActions = [
            actions.FIX_RECORD_PROCESSING,
            'FILE_UPLOAD_STARTED',
            'FILE_UPLOAD_PROGRESS@test.txt',
            actions.FIX_RECORD_SUCCESS
        ];

        mockApi
            .onGet(repositories.routes.FILE_UPLOAD_API({pid: testPid, fileName: "test.txt"}).apiUrl)
            .reply(200, 's3-ap-southeast-2.amazonaws.com')
            .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"})
            .reply(200, {})
            .onPatch(repositories.routes.EXISTING_RECORD_API({pid: testPid}).apiUrl)
            .reply(200, {data: {...mockData.mockRecordToFix}})
            .onPost(repositories.routes.RECORDS_ISSUES_API({pid: testPid}).apiUrl)
            .reply(200, {});

        try {
            await mockActionsStore.dispatch(incompleteRecords.updateIncompleteRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('dispatches failure on api error', async () => {
        const testInput = {
            publication: {
                ...mockData.mockRecordToFix,
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 123
                    }
                ],
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id: 123
                    }
                ]
            },
            author: {
                aut_id: 123
            }
        };

        const expectedActions = [
            actions.FIX_RECORD_PROCESSING,
            actions.APP_ALERT_SHOW,
            actions.FIX_RECORD_FAILED
        ];

        mockApi
            .onAny()
            .reply(500, {});
       try {
            await mockActionsStore.dispatch(incompleteRecords.updateIncompleteRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('see what happens when the author isnt on the list', async () => {
        const testInput = {
            publication: {
                ...mockData.mockRecordToFix,
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 123
                    }
                ],
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id: 124
                    }
                ]
            },
            author: {
                aut_id: 125
            }
        };
        mockApi
            .onPatch(repositories.routes.EXISTING_RECORD_API({pid: testPid}).apiUrl)
            .reply(200, {});

        const expectedActions = [
            actions.FIX_RECORD_FAILED
        ];

        try {
            await mockActionsStore.dispatch(incompleteRecords.updateIncompleteRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });
});
