import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as ExportCommCollActions from './exportCommunitiesCollections';
import * as viewRecordActions from './viewCommunitiesCollections';
import * as mockData from 'mock/data';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';
import { loadOrganisationalUnits, loadSuggestedOrganisationalUnitByAuthorId } from './organisationalUnits';

// import { locale } from 'locale';

describe('View communities and collections actions', () => {
    const testPid = 'UQ:12345';
    const pageSize = 10;
    const page = 1;
    const direction = 'Asc';
    const sortBy = 'Title';

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('loadCommunities action', () => {
        it('dispatches expected actions when loading the communities to view from API successfully', async () => {
            mockApi
                .onGet(
                    repositories.routes.COMMUNITY_LIST_API({
                        pageSize: pageSize,
                        page: page,
                        sortBy: sortBy,
                        direction: direction,
                    }).apiUrl,
                )
                .reply(200, { data: { ...mockData.communityList } });

            const expectedActions = [actions.VIEW_COMMUNITIES_LOADING, actions.VIEW_COMMUNITIES_LOADED];
            try {
                await mockActionsStore.dispatch(
                    viewRecordActions.loadCommunitiesList({
                        pageSize: pageSize,
                        page: page,
                        direction: direction,
                        sortBy: sortBy,
                    }),
                );
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
        it('dispatches expected actions when loading communities to view from API failed', async () => {
            mockApi.onAny().reply(500);

            const expectedActions = [
                actions.VIEW_COMMUNITIES_LOADING,
                actions.APP_ALERT_SHOW,
                actions.VIEW_COMMUNITIES_LOAD_FAILED,
            ];

            await mockActionsStore.dispatch(viewRecordActions.loadCommunitiesList());
            const result = mockActionsStore.getActions();
            expect(result).toHaveDispatchedActions(expectedActions);
        });
    });
    describe('loadCCCollectionsList action', () => {
        it('dispatches expected actions when loading the collections to view from API successfully', async () => {
            mockApi
                .onGet(
                    repositories.routes.COLLECTION_LIST_API({
                        pid: testPid,
                        pageSize: pageSize,
                        page: page,
                        sortBy: sortBy,
                        direction: direction,
                    }).apiUrl,
                )
                .reply(200, { data: { ...mockData.collectionList } });

            const expectedActions = [actions.VIEW_COLLECTIONS_LOADING, actions.VIEW_COLLECTIONS_LOADED];
            try {
                await mockActionsStore.dispatch(
                    viewRecordActions.loadCCCollectionsList({
                        pid: testPid,
                        pageSize: pageSize,
                        page: page,
                        direction: direction,
                        sortBy: sortBy,
                    }),
                );
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
        it('dispatches expected actions when loading collections to view from API failed', async () => {
            mockApi.onAny().reply(500);

            const expectedActions = [
                actions.VIEW_COLLECTIONS_LOADING,
                actions.APP_ALERT_SHOW,
                actions.VIEW_COLLECTIONS_LOAD_FAILED,
            ];

            await mockActionsStore.dispatch(viewRecordActions.loadCCCollectionsList());
            const result = mockActionsStore.getActions();
            expect(result).toHaveDispatchedActions(expectedActions);
        });
    });
    describe('Clear/Set CollectionList actions', () => {
        it('dispatches expected actions when clearing Collections list', async () => {
            const expectedActions = [actions.VIEW_COLLECTIONS_CLEARED];
            mockActionsStore.dispatch(viewRecordActions.clearCCCollectionsList());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('dispatches expected actions when setting collections list open array', async () => {
            const expectedActions = [actions.SET_COLLECTIONS_ARRAY];

            await mockActionsStore.dispatch(viewRecordActions.setCollectionsArray({ pid: testPid, open: false }));
            const result = mockActionsStore.getActions();
            expect(result).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('export functions', () => {
        it('exportCommunities should fire with expected parameters', async () => {
            const exportCommColl = jest.spyOn(ExportCommCollActions, 'exportCommunities');
            const exportPublicationsFormat = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];
            const testRequest = {
                exportPublicationsFormat,
                page,
                pageSize,
                sortBy,
                direction,
            };

            viewRecordActions.exportCommunityRecords(testRequest);
            expect(exportCommColl).toHaveBeenCalledWith(repositories.routes.COMMUNITY_LIST_API(testRequest));
        });
        it('exportCollections should fire with expected parameters', async () => {
            const exportCommColl = jest.spyOn(ExportCommCollActions, 'exportCollections');
            const exportPublicationsFormat = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];
            const testRequest = {
                exportPublicationsFormat,
                page,
                pageSize,
                sortBy,
                direction,
            };

            viewRecordActions.exportCollectionRecords(testRequest);
            expect(exportCommColl).toHaveBeenCalledWith(repositories.routes.COLLECTION_LIST_API(testRequest, 'export'));
        });
    });

    describe('coverage', () => {
        beforeEach(() => {
            mockActionsStore = setupStoreForActions();
            mockApi = setupMockAdapter();
            mockApi.onAny().reply(500);
        });

        afterEach(() => {
            mockApi.reset();
        });
        it('loadOrganisationalUnits receives failed dispatch event on API error', async () => {
            await mockActionsStore.dispatch(loadOrganisationalUnits());

            const expectedActions = [
                actions.ORGANISATIONAL_UNITS_LOADING,
                actions.APP_ALERT_SHOW,
                actions.ORGANISATIONAL_UNITS_FAILED,
            ];

            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('loadSuggestedOrganisationalUnitByAuthorId receives failed dispatch event on API error', async () => {
            await mockActionsStore.dispatch(loadSuggestedOrganisationalUnitByAuthorId(1));

            const expectedActions = [
                actions.SUGGESTED_ORGANISATIONAL_UNITS_LOADING,
                actions.APP_ALERT_SHOW,
                actions.SUGGESTED_ORGANISATIONAL_UNITS_FAILED,
            ];

            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
