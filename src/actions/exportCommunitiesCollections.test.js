import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as exportCCActions from './exportCommunitiesCollections';
import * as ExportPublicationsTransformers from './exportPublicationsDataTransformers';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';

describe('Export Community and Collection actions', () => {
    let promptForDownload;

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();

        promptForDownload = jest.spyOn(ExportPublicationsTransformers, 'promptForDownload');
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('exportCommunities()', () => {
        const exportPublicationsFormat = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];
        const requestParams = repositories.routes.COMMUNITY_LIST_API({
            exportPublicationsFormat,
            page: 1,
            pageSize: 20,
            sortBy: 'score',
            sortDirection: 'desc',
        });

        it('dispatches expected actions on successful export', async () => {
            promptForDownload.mockImplementation(() => exportPublicationsFormat);

            mockApi.onGet(requestParams.apiUrl).reply(200);

            const expectedActions = [actions.EXPORT_COMMUNITIES_LOADING, actions.EXPORT_COMMUNITIES_LOADED];

            await mockActionsStore.dispatch(exportCCActions.exportCommunities(requestParams));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions if API fails', async () => {
            mockApi.onAny().reply(500, {});

            const expectedActions = [
                actions.EXPORT_COMMUNITIES_LOADING,
                actions.APP_ALERT_SHOW,
                actions.EXPORT_COMMUNITIES_FAILED,
            ];

            await mockActionsStore.dispatch(exportCCActions.exportCommunities(requestParams));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('exportCollections()', () => {
        const exportPublicationsFormat = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];
        const requestParams = repositories.routes.COLLECTION_LIST_API(
            {
                exportPublicationsFormat,
                pid: 'UQ:123456',
                page: 1,
                pageSize: 20,
                sortBy: 'score',
                sortDirection: 'desc',
            },
            'export',
        );

        it('dispatches expected actions on successful export', async () => {
            promptForDownload.mockImplementation(() => exportPublicationsFormat);

            mockApi.onGet(requestParams.apiUrl).reply(200);

            const expectedActions = [actions.EXPORT_COLLECTIONS_LOADING, actions.EXPORT_COLLECTIONS_LOADED];

            await mockActionsStore.dispatch(exportCCActions.exportCollections(requestParams));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions if API fails', async () => {
            mockApi.onAny().reply(500, {});

            const expectedActions = [
                actions.EXPORT_COLLECTIONS_LOADING,
                actions.APP_ALERT_SHOW,
                actions.EXPORT_COLLECTIONS_FAILED,
            ];

            await mockActionsStore.dispatch(exportCCActions.exportCollections(requestParams));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
