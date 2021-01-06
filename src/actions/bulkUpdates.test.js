import { loadBulkUpdatesList } from './bulkUpdates';
import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as mockData from 'mock/data/testing/bulkUpdates';

describe('bulkUpdates actions', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('loadBulkUpdatesList action', () => {
        it('should dispatch correct number of actions on loading bulk updates list', async () => {
            mockApi
                .onGet(repositories.routes.BULK_UPDATES_API().apiUrl)
                .reply(200, { data: { ...mockData.bulkUpdatesList } });

            const expectedActions = [actions.BULK_UPDATES_LIST_LOADING, actions.BULK_UPDATES_LIST_LOADED];

            await mockActionsStore.dispatch(loadBulkUpdatesList());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on failed to load bulk updates list', async () => {
            mockApi.onGet(repositories.routes.BULK_UPDATES_API().apiUrl).reply(500);

            const expectedActions = [
                actions.BULK_UPDATES_LIST_LOADING,
                actions.APP_ALERT_SHOW,
                actions.BULK_UPDATES_LIST_FAILED,
            ];

            await mockActionsStore.dispatch(loadBulkUpdatesList());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
