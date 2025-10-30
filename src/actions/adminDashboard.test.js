/* c8 ignore file */

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as adminActions from './adminDashboard';
import * as Transformers from './exportPublicationsDataTransformers';

jest.mock('@sentry/react');

describe('Action creators for admin dashboard', () => {
    jest.spyOn(Transformers, 'promptForDownload').mockImplementation(() => {
        return true;
    });
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('dispatches expected actions while loading config', async () => {
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_CONFIG_API().apiUrl).reply(200, {});

        const expectedActions = [actions.ADMIN_DASHBOARD_CONFIG_LOADING, actions.ADMIN_DASHBOARD_CONFIG_SUCCESS];

        await mockActionsStore.dispatch(adminActions.loadAdminDashboardConfig());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
    it('dispatches expected actions when loading config fails', async () => {
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_CONFIG_API().apiUrl).reply(500);

        const expectedActions = [
            actions.ADMIN_DASHBOARD_CONFIG_LOADING,
            actions.APP_ALERT_SHOW,
            actions.ADMIN_DASHBOARD_CONFIG_FAILED,
        ];

        try {
            await mockActionsStore.dispatch(adminActions.loadAdminDashboardConfig());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('dispatches expected actions while loading Today', async () => {
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_TODAY_API().apiUrl).reply(200, {});

        const expectedActions = [actions.ADMIN_DASHBOARD_TODAY_LOADING, actions.ADMIN_DASHBOARD_TODAY_SUCCESS];

        await mockActionsStore.dispatch(adminActions.loadAdminDashboardToday());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
    it('dispatches expected actions when loading Today fails', async () => {
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_TODAY_API().apiUrl).reply(500);

        const expectedActions = [
            actions.ADMIN_DASHBOARD_TODAY_LOADING,
            actions.APP_ALERT_SHOW,
            actions.ADMIN_DASHBOARD_TODAY_FAILED,
        ];

        try {
            await mockActionsStore.dispatch(adminActions.loadAdminDashboardToday());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('dispatches expected actions while loading quick links', async () => {
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_QUICKLINKS_API().apiUrl).reply(200, {});

        const expectedActions = [
            actions.ADMIN_DASHBOARD_QUICKLINKS_LOADING,
            actions.ADMIN_DASHBOARD_QUICKLINKS_SUCCESS,
        ];

        await mockActionsStore.dispatch(adminActions.loadAdminDashboardQuickLinks());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
    it('dispatches expected actions when loading quick links fails', async () => {
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_QUICKLINKS_API().apiUrl).reply(500);

        const expectedActions = [
            actions.ADMIN_DASHBOARD_QUICKLINKS_LOADING,
            actions.APP_ALERT_SHOW,
            actions.ADMIN_DASHBOARD_QUICKLINKS_FAILED,
        ];

        try {
            await mockActionsStore.dispatch(adminActions.loadAdminDashboardQuickLinks());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('dispatches expected actions while adding quick links', async () => {
        const action = 'ADD';
        const request = {};
        mockApi.onPost(repositories.routes.ADMIN_DASHBOARD_QUICKLINKS_API().apiUrl).reply(200, {});

        const expectedActions = [
            actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATING,
            actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_SUCCESS,
        ];

        await mockActionsStore.dispatch(adminActions.adminDashboardQuickLink(request, action));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
    it('dispatches expected actions when adding quick links fails', async () => {
        const action = 'ADD';
        const request = {};
        mockApi.onPost(repositories.routes.ADMIN_DASHBOARD_QUICKLINKS_API().apiUrl).reply(500);

        const expectedActions = [
            actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATING,
            actions.APP_ALERT_SHOW,
            actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_FAILED,
        ];

        try {
            await mockActionsStore.dispatch(adminActions.adminDashboardQuickLink(request, action));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('dispatches expected actions while editing links', async () => {
        const action = 'EDIT';
        const request = {};
        mockApi.onPut(repositories.routes.ADMIN_DASHBOARD_QUICKLINKS_API().apiUrl).reply(200, {});

        const expectedActions = [
            actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATING,
            actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_SUCCESS,
        ];

        await mockActionsStore.dispatch(adminActions.adminDashboardQuickLink(request, action));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
    it('dispatches expected actions while editing links fails', async () => {
        const action = 'EDIT';
        const request = {};
        mockApi.onPut(repositories.routes.ADMIN_DASHBOARD_QUICKLINKS_API().apiUrl).reply(500);

        const expectedActions = [
            actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATING,
            actions.APP_ALERT_SHOW,
            actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_FAILED,
        ];

        try {
            await mockActionsStore.dispatch(adminActions.adminDashboardQuickLink(request, action));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('dispatches expected actions while reordering links', async () => {
        const action = 'REORDER';
        const request = {};
        mockApi.onPut(repositories.routes.ADMIN_DASHBOARD_QUICKLINKS_API().apiUrl).reply(200, {});

        const expectedActions = [
            actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATING,
            actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_SUCCESS,
        ];

        await mockActionsStore.dispatch(adminActions.adminDashboardQuickLink(request, action));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
    it('dispatches expected actions while reordering links fails', async () => {
        const action = 'REORDER';
        const request = {};
        mockApi.onPut(repositories.routes.ADMIN_DASHBOARD_QUICKLINKS_API().apiUrl).reply(500);

        const expectedActions = [
            actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATING,
            actions.APP_ALERT_SHOW,
            actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_FAILED,
        ];

        try {
            await mockActionsStore.dispatch(adminActions.adminDashboardQuickLink(request, action));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('dispatches expected actions while deleting links', async () => {
        const action = 'DELETE';
        const request = {};
        mockApi.onDelete(repositories.routes.ADMIN_DASHBOARD_QUICKLINKS_API().apiUrl).reply(200, {});

        const expectedActions = [
            actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATING,
            actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_SUCCESS,
        ];

        await mockActionsStore.dispatch(adminActions.adminDashboardQuickLink(request, action));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
    it('dispatches expected actions while deleting links fails', async () => {
        const action = 'DELETE';
        const request = {};
        mockApi.onDelete(repositories.routes.ADMIN_DASHBOARD_QUICKLINKS_API().apiUrl).reply(500);

        const expectedActions = [
            actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATING,
            actions.APP_ALERT_SHOW,
            actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_FAILED,
        ];

        try {
            await mockActionsStore.dispatch(adminActions.adminDashboardQuickLink(request, action));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('dispatches expected actions while clearing links', async () => {
        const expectedActions = [actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_CLEAR];

        await mockActionsStore.dispatch(adminActions.adminDashboardQuickLinkUpdateClear());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions while loading system alerts', async () => {
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API().apiUrl).reply(200, {});

        const expectedActions = [
            actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_LOADING,
            actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_SUCCESS,
        ];

        await mockActionsStore.dispatch(adminActions.loadAdminDashboardSystemAlerts());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
    it('dispatches expected actions when loading system alerts fails', async () => {
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API().apiUrl).reply(500);

        const expectedActions = [
            actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_LOADING,
            actions.APP_ALERT_SHOW,
            actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_FAILED,
        ];

        try {
            await mockActionsStore.dispatch(adminActions.loadAdminDashboardSystemAlerts());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('dispatches expected actions while updating system alerts', async () => {
        const request = {};
        mockApi.onPut(repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API().apiUrl).reply(200, {});

        const expectedActions = [
            actions.ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATING,
            actions.ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATE_SUCCESS,
        ];

        await mockActionsStore.dispatch(adminActions.adminDashboardSystemAlerts(request));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
    it('dispatches expected actions while updating system alerts fails', async () => {
        const request = {};
        mockApi.onPut(repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API().apiUrl).reply(500);

        const expectedActions = [
            actions.ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATING,
            actions.APP_ALERT_SHOW,
            actions.ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATE_FAILED,
        ];

        try {
            await mockActionsStore.dispatch(adminActions.adminDashboardSystemAlerts(request));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });
    it('dispatches expected actions while clearing system alert updates', async () => {
        const expectedActions = [actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_UPDATE_CLEAR];

        await mockActionsStore.dispatch(adminActions.adminDashboardSystemAlertsUpdateClear());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions while exporting reports', async () => {
        const request = { id: 1 };
        const options = { export_to: 'excel' };
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_EXPORT_REPORT_API({ id: request.id }).apiUrl).reply(200, {});

        const expectedActions = [
            actions.ADMIN_DASHBOARD_EXPORT_REPORT_LOADING,
            actions.ADMIN_DASHBOARD_EXPORT_REPORT_SUCCESS,
        ];

        await mockActionsStore.dispatch(adminActions.loadAdminDashboardExportReport(request, options));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
    it('dispatches expected actions when exporting reports fails', async () => {
        const request = { id: 1 };
        const options = { export_to: 'excel' };
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_EXPORT_REPORT_API({ id: request.id }).apiUrl).reply(500);

        const expectedActions = [
            actions.ADMIN_DASHBOARD_EXPORT_REPORT_LOADING,
            actions.APP_ALERT_SHOW,
            actions.ADMIN_DASHBOARD_EXPORT_REPORT_FAILED,
        ];

        try {
            await mockActionsStore.dispatch(adminActions.loadAdminDashboardExportReport(request, options));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });
    it('dispatches expected actions while clearing exported reports', async () => {
        const expectedActions = [actions.ADMIN_DASHBOARD_EXPORT_REPORT_CLEAR];

        await mockActionsStore.dispatch(adminActions.clearAdminDashboardExportReport());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions while loading display reports', async () => {
        const request = { id: 1 };
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_DISPLAY_REPORT_API({ id: request.id }).apiUrl).reply(200, {});

        const expectedActions = [
            actions.ADMIN_DASHBOARD_DISPLAY_REPORT_LOADING,
            actions.ADMIN_DASHBOARD_DISPLAY_REPORT_SUCCESS,
        ];

        await mockActionsStore.dispatch(adminActions.loadAdminDashboardDisplayReport(request));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
    it('dispatches expected actions when loading display reports fails', async () => {
        const request = { id: 1 };
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_DISPLAY_REPORT_API({ id: request.id }).apiUrl).reply(500);

        const expectedActions = [
            actions.ADMIN_DASHBOARD_DISPLAY_REPORT_LOADING,
            actions.APP_ALERT_SHOW,
            actions.ADMIN_DASHBOARD_DISPLAY_REPORT_FAILED,
        ];

        try {
            await mockActionsStore.dispatch(adminActions.loadAdminDashboardDisplayReport(request));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });
    it('dispatches expected actions while clearing display reports', async () => {
        const expectedActions = [actions.ADMIN_DASHBOARD_DISPLAY_REPORT_CLEAR];

        await mockActionsStore.dispatch(adminActions.clearAdminDashboardDisplayReport());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
