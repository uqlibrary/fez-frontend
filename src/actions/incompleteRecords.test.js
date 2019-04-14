import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as incompleteRecords from './incompleteRecords';
import * as incompleteRecordList from 'mock/data/records/incompleteRecordList';

describe('incompleteRecords actions', () => {
    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should call loading/loaded actions on successful load', async () => {
        mockApi
            .onGet(repositories.routes.INCOMPLETE_RECORDS_API().apiUrl)
            .reply(200, incompleteRecordList);

        const expectedActions = [
            actions.INCOMPLETE_RECORDS_LOADING,
            actions.INCOMPLETE_RECORDS_LOADED
        ];

        await mockActionsStore.dispatch(incompleteRecords.loadIncompleteRecords());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call loading/load failed actions on failed load', async () => {
        mockApi
            .onAny()
            .reply(404);

        const expectedActions = [
            actions.INCOMPLETE_RECORDS_LOADING,
            actions.INCOMPLETE_RECORDS_FAILED
        ];

        await mockActionsStore.dispatch(incompleteRecords.loadIncompleteRecords());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

});
