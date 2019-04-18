import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as incompleteRecords from './incompleteRecords';
import * as incompleteRecordList from 'mock/data/records/incompleteRecordList';
import * as mockData from "../mock/data/testing/records";

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
            .onGet(repositories.routes.CURRENT_USER_INCOMPLETE_RECORDS_API().apiUrl)
            .reply(200, incompleteRecordList);

        const expectedActions = [
            actions.AUTHOR_INCOMPLETEPUBLICATIONS_LOADING,
            actions.AUTHOR_INCOMPLETEPUBLICATIONS_LOADED
        ];

        await mockActionsStore.dispatch(incompleteRecords.loadIncompleteRecords());
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

        await mockActionsStore.dispatch(incompleteRecords.loadIncompleteRecords());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

});

describe('patchIncompleteRecord actions', () => {
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
                ...mockData.mockRecordToFix,
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
            .onPost(repositories.routes.AUTHOR_INCOMPLETEPUBLICATIONS_SAVE_API({pid: testPid}).apiUrl)
            .reply(200, {});

        const expectedActions = [
            actions.AUTHOR_INCOMPLETEPUBLICATIONS_SAVE_PROCESSING,
            actions.AUTHOR_INCOMPLETEPUBLICATIONS_SAVE_SUCCESS
        ];

        await mockActionsStore.dispatch(incompleteRecords.patchIncompleteRecord(testInput));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call loading/load failed actions on incomplete data', async () => {
        mockApi
            .onAny()
            .reply(404);

        const expectedActions = [
            actions.AUTHOR_INCOMPLETEPUBLICATIONS_SAVE_FAILED
        ];

        await mockActionsStore.dispatch(incompleteRecords.patchIncompleteRecord({}));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call loading/load failed actions on bad author', async () => {
        const testInput = {
            ...testInput,
            author: {
                aut_id: 1
            }
        };
        mockApi
            .onAny()
            .reply(404);

        const expectedActions = [
            actions.AUTHOR_INCOMPLETEPUBLICATIONS_SAVE_FAILED
        ];

        await mockActionsStore.dispatch(incompleteRecords.patchIncompleteRecord(testInput));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call loading/load failed actions on failed load', async () => {
        mockApi
            .onAny()
            .reply(404);

        const expectedActions = [
            actions.AUTHOR_INCOMPLETEPUBLICATIONS_SAVE_FAILED
        ];

        await mockActionsStore.dispatch(incompleteRecords.patchIncompleteRecord(testInput));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

});
