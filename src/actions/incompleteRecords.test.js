import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as publications from './publications';
import incompleteNTROrecord from 'mock/data/records/incompleteNTROrecord';
import { updateIncompleteRecord } from './incompleteRecords';
import * as incompleteRecordList from 'mock/data/records/incompleteNTROlist';
import { mockRecordToFix } from 'mock/data/testing/records';

beforeEach(() => {
    mockActionsStore = setupStoreForActions();
    mockApi = setupMockAdapter();
});

afterEach(() => {
    mockApi.reset();
});

describe('incompleteRecords actions', () => {
    it('should call fixing/fixed actions on successful save', async () => {
        mockApi
            .onPatch(repositories.routes.EXISTING_RECORD_API({ pid: 'UQ:692945' }).apiUrl)
            .reply(200, { data: incompleteNTROrecord })
            .onPost(repositories.routes.RECORDS_ISSUES_API({ pid: 'UQ:692945' }).apiUrl)
            .reply(200, {});

        const expectedActions = [
            actions.FIX_RECORD_PROCESSING,
            actions.FIX_RECORD_SUCCESS
        ];

        const data = {
            author: {
                aut_id: 1,
            },
            publication: {
                rek_pid: 'UQ:692945',
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 1,
                    },
                ],
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id: 100,
                    },
                ],
            },
            files: {
                queue: [],
            },
        };

        await mockActionsStore.dispatch(updateIncompleteRecord(data));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call fixing/fix_failed actions on failed load', async () => {
        mockApi
            .onAny()
            .reply(404);

        const expectedActions = [
            actions.FIX_RECORD_PROCESSING,
            actions.FIX_RECORD_FAILED
        ];

        try {
            await mockActionsStore.dispatch(updateIncompleteRecord({}));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(e.message).toBe('Incomplete data for requests');
        }

        const data = {
            author: {
                aut_id: 1,
            },
            publication: {
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 100,
                    },
                ],
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id: 200,
                    },
                ],
            }
        };

        try {
            await mockActionsStore.dispatch(updateIncompleteRecord(data));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(e.message).toBe('Current author is not linked to this record');
        }

        data.publication.fez_record_search_key_author_id[0].rek_author_id = 1;

        try {
            await mockActionsStore.dispatch(updateIncompleteRecord(data));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(e.message).toBe('The requested page could not be found.');
        }

    });

});

describe('updateIncompleteRecord actions', () => {
    const testPid = "UQ:41878";

    it('should dispatch processing/success actions on successful load', async () => {
        const testInput = {
            publication: {
                ...mockRecordToFix
            },
            impactStatement: {
                htmlText: '<p>dummy</p>'
            },
            author: {
                aut_id: 410
            },
            authorsAffiliation: [],
            ntroAbstract: {},
            grants: [],
            languages: [],
            qualityIndicators: [],
        };
        mockApi
            .onPatch(repositories.routes.EXISTING_RECORD_API({pid: testPid}).apiUrl)
            .reply(200, {})
            .onPost(repositories.routes.RECORDS_ISSUES_API({ pid: testPid }).apiUrl)
            .reply(200, {});

        const expectedActions = [
            actions.FIX_RECORD_PROCESSING,
            actions.FIX_RECORD_SUCCESS
        ];

        await mockActionsStore.dispatch(updateIncompleteRecord(testInput));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch failed action on incomplete data', async () => {
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
                ...mockRecordToFix
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
            .reply(200, {})
            .onPost(repositories.routes.RECORDS_ISSUES_API({ pid: testPid }).apiUrl)
            .reply(200, {});

        const expectedActions = [
            actions.FIX_RECORD_PROCESSING,
            actions.FIX_RECORD_SUCCESS
        ];

        await mockActionsStore.dispatch(updateIncompleteRecord(testInput));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should handle significance', async () => {
        const testInput = {
            publication: {
                ...mockRecordToFix,
            },
            significance: 454026,
            author: {
                aut_id: 410
            }
        };
        mockApi
            .onPatch(repositories.routes.EXISTING_RECORD_API({pid: testPid}).apiUrl)
            .reply(200, {})
            .onPost(repositories.routes.RECORDS_ISSUES_API({ pid: testPid }).apiUrl)
            .reply(200, {});

        const expectedActions = [
            actions.FIX_RECORD_PROCESSING,
            actions.FIX_RECORD_SUCCESS
        ];

        await mockActionsStore.dispatch(updateIncompleteRecord(testInput));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch failed action on bad author', async () => {
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

    it('dispatches updated contributor id', async () => {
        const testInput = {
            publication: {
                ...mockRecordToFix,
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
            .reply(200, {})
            .onPost(repositories.routes.RECORDS_ISSUES_API({ pid: testPid }).apiUrl)
            .reply(200, {});

        const expectedActions = [
            actions.FIX_RECORD_PROCESSING,
            actions.FIX_RECORD_SUCCESS
        ];

        await mockActionsStore.dispatch(updateIncompleteRecord(testInput));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches failure where Current author is not linked to this record', async () => {
        const testInput = {
            publication: {
                ...mockRecordToFix,
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
            await mockActionsStore.dispatch(updateIncompleteRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('dispatches expected actions for successful file upload', async () => {
        const testInput = {
            publication: {
                ...mockRecordToFix,
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
            .reply(200, {data: {...mockRecordToFix}})
            .onPost(repositories.routes.RECORDS_ISSUES_API({pid: testPid}).apiUrl)
            .reply(200, {});

        try {
            await mockActionsStore.dispatch(updateIncompleteRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('dispatches failure on api error', async () => {
        const testInput = {
            publication: {
                ...mockRecordToFix,
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
            await mockActionsStore.dispatch(updateIncompleteRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('see what happens when the author isnt on the list', async () => {
        const testInput = {
            publication: {
                ...mockRecordToFix,
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
            await mockActionsStore.dispatch(updateIncompleteRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });
});
