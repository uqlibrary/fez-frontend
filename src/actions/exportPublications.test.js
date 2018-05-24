jest.mock('./exportPublicationsDataTransformers');

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as exportPublicationsActions from './exportPublications';
import {exportSearchToExcel as exportSearchToExcelResponse} from "../mock/data/testing/searchRecords";
import {formatToExtensionMap, promptForDownload} from './exportPublicationsDataTransformers';

beforeEach(() => {
    promptForDownload.mockClear();
});

describe('Export publications actions', () => {
    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('exportPublications()', () => {
        const exportFormat = Object.keys(formatToExtensionMap)[0];
        const requestParams = repositories.routes.CURRENT_USER_RECORDS_API({
            apiUrl: 'records/search',
            userName: 'uqresearcher',
            page: 1,
            pageSize: 20,
            sortBy: 'published_date',
            sortDirection: 'desc',
            facets: {},
        });

        it('dispatches expected actions on successful search export', async () => {
            // mock promptForDownload
            promptForDownload.mockImplementation(() => exportFormat);

            mockApi
                .onGet(requestParams.apiUrl)
                .reply(200, exportSearchToExcelResponse);

            const expectedActions = [
                actions.EXPORT_PUBLICATIONS_LOADING,
                actions.EXPORT_PUBLICATIONS_LOADED
            ];

            await mockActionsStore.dispatch(exportPublicationsActions.exportPublications({exportFormat, requestParams}));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on failed search export', async () => {

            // mock promptForDownload
            promptForDownload.mockImplementation(() => {
                throw 'Error';
            });

            mockApi
                .onGet(requestParams.apiUrl)
                .reply(200, exportSearchToExcelResponse);

            const expectedActions = [
                actions.EXPORT_PUBLICATIONS_LOADING,
                actions.EXPORT_PUBLICATIONS_FAILED
            ];

            await mockActionsStore.dispatch(exportPublicationsActions.exportPublications({exportFormat, requestParams}));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for anon user', async () => {
            mockApi
                .onAny()
                .reply(403, {});

            const expectedActions = [
                actions.EXPORT_PUBLICATIONS_LOADING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.EXPORT_PUBLICATIONS_FAILED
            ];

            await mockActionsStore.dispatch(exportPublicationsActions.exportPublications({exportFormat, requestParams}));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions if API fails', async () => {
            mockApi
                .onAny()
                .reply(500, {});

            const expectedActions = [
                actions.EXPORT_PUBLICATIONS_LOADING,
                actions.EXPORT_PUBLICATIONS_FAILED
            ];

            await mockActionsStore.dispatch(exportPublicationsActions.exportPublications({exportFormat, requestParams}));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
