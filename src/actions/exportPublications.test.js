import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as exportPublicationsActions from './exportPublications';
import { exportSearchToExcel as exportSearchToExcelResponse } from 'mock/data/testing/searchRecords';
import * as ExportPublicationsTransformers from './exportPublicationsDataTransformers';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';

describe('Export publications actions', () => {
    let promptForDownload;

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();

        promptForDownload = jest.spyOn(ExportPublicationsTransformers, 'promptForDownload');
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('exportPublications()', () => {
        const exportPublicationsFormat = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];
        const requestParams = repositories.routes.CURRENT_USER_RECORDS_API({
            exportPublicationsFormat: exportPublicationsFormat,
            apiUrl: 'records/search',
            userName: 'uqresearcher',
            page: 1,
            pageSize: 20,
            sortBy: 'score',
            sortDirection: 'desc',
            facets: {},
        });

        it('dispatches expected actions on successful search export', async () => {
            promptForDownload.mockImplementation(() => exportPublicationsFormat);

            mockApi.onGet(requestParams.apiUrl).reply(200, exportSearchToExcelResponse);

            const expectedActions = [actions.EXPORT_PUBLICATIONS_LOADING, actions.EXPORT_PUBLICATIONS_LOADED];

            await mockActionsStore.dispatch(exportPublicationsActions.exportPublications(requestParams));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful bulk search export', async () => {
            const testFn = jest.fn();
            promptForDownload.mockImplementation(testFn);

            mockApi.onGet(requestParams.apiUrl).reply(200, exportSearchToExcelResponse);

            const expectedActions = [actions.EXPORT_PUBLICATIONS_LOADING, actions.EXPORT_PUBLICATIONS_LOADED];

            await mockActionsStore.dispatch(
                exportPublicationsActions.exportPublications({
                    ...requestParams,
                    options: {
                        ...requestParams.options,
                        params: {
                            ...requestParams.options.params,
                            per_page: 500,
                        },
                    },
                }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            expect(testFn).toHaveBeenCalledTimes(0);
        });

        it('dispatches expected actions on unexpected export format', async () => {
            promptForDownload.mockImplementation(() => {
                throw 'Error';
            });

            mockApi.onGet(requestParams.apiUrl).reply(200, exportSearchToExcelResponse);

            const expectedActions = [actions.EXPORT_PUBLICATIONS_LOADING, actions.EXPORT_PUBLICATIONS_FAILED];

            await mockActionsStore.dispatch(exportPublicationsActions.exportPublications(requestParams));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for anon user', async () => {
            mockApi.onAny().reply(401, {});

            const expectedActions = [
                actions.EXPORT_PUBLICATIONS_LOADING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.EXPORT_PUBLICATIONS_FAILED,
            ];

            await mockActionsStore.dispatch(exportPublicationsActions.exportPublications(requestParams));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions if API fails', async () => {
            mockApi.onAny().reply(500, {});

            const expectedActions = [
                actions.EXPORT_PUBLICATIONS_LOADING,
                actions.APP_ALERT_SHOW,
                actions.EXPORT_PUBLICATIONS_FAILED,
            ];

            await mockActionsStore.dispatch(exportPublicationsActions.exportPublications(requestParams));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('resetExportPublicationsStatus()', () => {
        it('dispatches expected actions', () => {
            const expectedActions = [actions.EXPORT_PUBLICATIONS_RESET];
            mockActionsStore.dispatch(exportPublicationsActions.resetExportPublicationsStatus());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
