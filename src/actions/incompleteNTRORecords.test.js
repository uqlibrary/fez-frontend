import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as incompleteNTRORecords from './incompleteNTRORecords';
import * as incompleteNTROList from 'mock/data/records/incompleteNTROList';

describe('incompleteNTRORecords actions', () => {
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
            .onGet(repositories.routes.INCOMPLETE_NTRO_API().apiUrl)
            .reply(200, incompleteNTROList);

        const expectedActions = [
            actions.INCOMPLETE_NTRO_LOADING,
            actions.INCOMPLETE_NTRO_LOADED
        ];

        await mockActionsStore.dispatch(incompleteNTRORecords.loadIncompleteNTROList());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call loading/load failed actions on failed load', async () => {
        mockApi
            .onAny()
            .reply(404);

        const expectedActions = [
            actions.INCOMPLETE_NTRO_LOADING,
            actions.INCOMPLETE_NTRO_FAILED
        ];

        await mockActionsStore.dispatch(incompleteNTRORecords.loadIncompleteNTROList());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

});
