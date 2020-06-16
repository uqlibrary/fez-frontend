import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as orcidSyncActions from './orcidSync';
import { orcidSyncStatus, orcidSyncResponse } from 'mock/data/orcid';

describe('OrcidSync actions', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should call loading/loaded actions on successful load of sync status', async () => {
        mockApi.onGet(repositories.routes.ORCID_SYNC_API().apiUrl).reply(200, orcidSyncStatus);

        const expectedActions = [actions.ORCID_SYNC_STATUS_LOADING, actions.ORCID_SYNC_STATUS_LOADED];

        await mockActionsStore.dispatch(orcidSyncActions.loadOrcidSyncStatus());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call loading/loaded actions when user has never had any sync jobs', async () => {
        mockApi.onAny().reply(404);

        const expectedActions = [actions.ORCID_SYNC_STATUS_LOADING, actions.ORCID_SYNC_STATUS_LOADED];

        await mockActionsStore.dispatch(orcidSyncActions.loadOrcidSyncStatus());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call loading/load failed actions on failed load of sync status', async () => {
        mockApi.onAny().reply(500);

        const expectedActions = [
            actions.ORCID_SYNC_STATUS_LOADING,
            actions.APP_ALERT_SHOW,
            actions.ORCID_SYNC_STATUS_LOAD_FAILED,
        ];

        await mockActionsStore.dispatch(orcidSyncActions.loadOrcidSyncStatus());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call loading/loaded actions on successful sync request', async () => {
        mockApi.onPost(repositories.routes.ORCID_SYNC_API().apiUrl).reply(201, orcidSyncResponse);

        const expectedActions = [
            actions.ORCID_SYNC_REQUESTING,
            actions.ORCID_SYNC_SUCCESS,
            actions.ORCID_SYNC_STATUS_LOADING,
        ];

        await mockActionsStore.dispatch(orcidSyncActions.requestOrcidSync());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call loading/load failed actions on failed sync request', async () => {
        mockApi.onAny().reply(400);

        const expectedActions = [
            actions.ORCID_SYNC_REQUESTING,
            actions.ORCID_SYNC_FAILED,
            actions.ORCID_SYNC_STATUS_LOADING,
        ];

        await mockActionsStore.dispatch(orcidSyncActions.requestOrcidSync());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
