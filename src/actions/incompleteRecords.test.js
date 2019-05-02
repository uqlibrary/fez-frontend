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
                ...mockRecordToFix,
                impactStatement:
                    {
                        htmlText: '<p>dummy</p>'
                    }
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
});
