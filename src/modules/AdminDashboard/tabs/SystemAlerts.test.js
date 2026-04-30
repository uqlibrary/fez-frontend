import React from 'react';
import { render, WithReduxStore, within, waitFor, waitForElementToBeRemoved, userEvent } from 'test-utils';
import * as DashboardActions from 'actions/adminDashboard';
import * as repositories from 'repositories';
import { adminDashboardSystemAlerts } from 'mock/data/testing/adminDashboard';
import SystemAlerts from './SystemAlerts';

const assertSortedColumn = column => {
    expect(within(column.closest('[role=presentation]')).getByTestId('ArrowUpwardIcon')).not.toHaveStyle('opacity: 0');
};

const mockUserid = 2333;
const setup = (props = {}, state = {}, renderer = render) => {
    const testState = {
        adminDashboardConfigReducer: {
            adminDashboardConfigData: {
                logged_in_user: {
                    id: mockUserid,
                    name: 'Sibbald,',
                },
                admin_users: [
                    { id: 13, preferred_name: 'Staff' },
                    { id: 23, preferred_name: 'Another Staff' },
                    { id: mockUserid, preferred_name: 'Lee Sibbald' },
                ],
            },
        },
        ...state,
    };
    return renderer(
        <WithReduxStore initialState={testState}>
            <SystemAlerts {...props} />
        </WithReduxStore>,
    );
};

describe('SystemAlerts tab', () => {
    beforeEach(() => {
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
        jest.clearAllMocks();
    });

    const openStatusFilter = async utils => {
        const { getByLabelText, getByRole } = utils;

        // open column menu
        await userEvent.click(getByLabelText('Status column menu'));

        // open filter panel
        await userEvent.click(getByRole('menuitem', { name: /filter/i }));
    };

    const selectFilterValue = async (utils, valueLabel) => {
        const { getByRole } = utils;

        // filter panel is a tooltip
        const dialog = getByRole('tooltip');

        // value combobox inside dialog
        const valueCombo = within(dialog).getByLabelText('Value');

        await userEvent.click(valueCombo);
        await userEvent.click(getByRole('option', { name: valueLabel }));
    };

    it('should render loading state', async () => {
        const { getByText, getByTestId } = setup();
        expect(getByTestId('admin-dashboard-systemalerts-skeleton')).toBeInTheDocument();
        expect(getByText('system alerts')).toBeInTheDocument();
    });

    it('should render', async () => {
        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API().apiUrl)
            .reply(200, { data: [...adminDashboardSystemAlerts] });
        const loadAdminDashboardSystemAlertsFn = jest.spyOn(DashboardActions, 'loadAdminDashboardSystemAlerts');
        const { getByTestId, getByText, getByRole, getAllByRole, getByTitle } = setup();
        expect(loadAdminDashboardSystemAlertsFn).toHaveBeenCalled();
        await waitForElementToBeRemoved(getByTestId('admin-dashboard-systemalerts-skeleton'));

        expect(getByText('3 system alerts')).toBeInTheDocument();
        expect(getAllByRole('row').length).toBe(4); // header & 3 'body' rows

        // header
        expect(getByRole('columnheader', { name: 'Created' })).toBeInTheDocument();
        expect(getByRole('columnheader', { name: 'Topic' })).toBeInTheDocument();
        expect(getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();

        assertSortedColumn(getByText('Created'));

        // rows cells
        expect(getByRole('gridcell', { name: '4th March 2024 15:55' })).toBeInTheDocument();
        expect(getByRole('gridcell', { name: '5th April 2024 15:55' })).toBeInTheDocument();
        expect(getByRole('gridcell', { name: '6th May 2024 15:55' })).toBeInTheDocument();

        expect(getByRole('gridcell', { name: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas' })).toBeInTheDocument();
        expect(getByRole('gridcell', { name: 'Issues on record - UQ:34555c6' })).toBeInTheDocument();
        expect(getByRole('gridcell', { name: 'My Works - Claimed Work - UQ:1494946 - uqmdeben' })).toBeInTheDocument();

        expect(getByTestId('alert-status-1')).toHaveTextContent('Unassigned');
        expect(getByTestId('alert-status-12')).toHaveTextContent('Unknown');
        expect(getByTestId('alert-status-13')).toHaveTextContent('Another Staff');

        // pagination buttons
        expect(getByTitle('Go to previous page')).toHaveAttribute('disabled');
        expect(getByTitle('Go to next page')).toHaveAttribute('disabled');
    });

    it('should render alert if system alert loading fails', async () => {
        const { queryByTestId, getByTestId } = setup(
            {},
            { adminDashboardSystemAlertsReducer: { adminDashboardSystemAlertsFailed: 'test error' } },
        );
        await waitForElementToBeRemoved(getByTestId('admin-dashboard-systemalerts-skeleton'));

        expect(getByTestId('alert')).toBeInTheDocument();
        expect(
            within(getByTestId('alert')).getByText('An error occurred while retrieving system alert data.'),
        ).toBeInTheDocument();
        expect(queryByTestId('dismiss')).not.toBeInTheDocument();
    });

    it('should render alert if system alert update fails', async () => {
        const { queryByTestId, getByTestId } = setup(
            {},
            {
                adminDashboardSystemAlertsReducer: {
                    adminDashboardSystemAlertsFailed: null,
                    adminDashboardSystemAlertsUpdateFailed: 'test error',
                },
            },
        );
        await waitForElementToBeRemoved(getByTestId('admin-dashboard-systemalerts-skeleton'));

        expect(getByTestId('alert')).toBeInTheDocument();

        expect(
            within(getByTestId('alert')).getByText('An error occurred updating the system alert data.'),
        ).toBeInTheDocument();
        await userEvent.click(getByTestId('dismiss'));
        waitForElementToBeRemoved(queryByTestId('alert'));
    });

    it('should open the admin drawer for a selected row', async () => {
        const expectedUpdateRequest = {
            sat_id: 13,
            sat_resolved_by: mockUserid,
            sat_resolved_date: '2017-06-29 14:00:00',
        };

        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API().apiUrl)
            .reply(200, { data: [...adminDashboardSystemAlerts] });
        mockApi
            .onPut(
                repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API({ id: expectedUpdateRequest.sat_id }).apiUrl,
                expectedUpdateRequest,
            )
            .reply(200, {});
        const loadAdminDashboardSystemAlertsFn = jest.spyOn(DashboardActions, 'loadAdminDashboardSystemAlerts');
        const adminDashboardSystemAlertsFn = jest.spyOn(DashboardActions, 'adminDashboardSystemAlerts');
        const loadAdminDashboardTodayFn = jest.spyOn(DashboardActions, 'loadAdminDashboardToday');

        const { getByTestId, getByRole } = setup();
        expect(loadAdminDashboardSystemAlertsFn).toHaveBeenCalled();
        await waitForElementToBeRemoved(getByTestId('admin-dashboard-systemalerts-skeleton'));

        await userEvent.click(getByRole('gridcell', { name: '6th May 2024 15:55' }));

        await waitFor(() => getByTestId('system-alert-detail'));

        await userEvent.click(getByTestId('system-alert-detail-action-button'));

        expect(adminDashboardSystemAlertsFn).toHaveBeenCalledWith(expectedUpdateRequest.sat_id, expectedUpdateRequest);

        await waitFor(() => {
            expect(loadAdminDashboardTodayFn).toHaveBeenCalled();
            expect(loadAdminDashboardSystemAlertsFn).toHaveBeenCalledTimes(2);
        });

        await waitForElementToBeRemoved(getByTestId('system-alert-detail'));
    });

    it('filters Mine correctly', async () => {
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API().apiUrl).reply(200, {
            data: [
                ...adminDashboardSystemAlerts,
                {
                    sat_id: 14,
                    sat_title: 'Mine',
                    sat_content: 'Test Mine.',
                    sat_created_date: '2024-5-6 15:55:00',
                    sat_assigned_date: null,
                    sat_resolved_date: undefined,
                    sat_assigned_to: mockUserid,
                    sat_resolved_by: undefined,
                },
            ],
        });

        const utils = setup();
        const { getByTestId, getAllByRole } = utils;

        await waitForElementToBeRemoved(getByTestId('admin-dashboard-systemalerts-skeleton'));

        await openStatusFilter(utils);
        await selectFilterValue(utils, 'Mine');

        await waitFor(() => {
            expect(getAllByRole('row').length).toBe(2);
        });
    });

    it('filters Unassigned correctly', async () => {
        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API().apiUrl)
            .reply(200, { data: [...adminDashboardSystemAlerts] });

        const utils = setup();
        const { getByTestId, getAllByRole, queryByText } = utils;

        await waitForElementToBeRemoved(getByTestId('admin-dashboard-systemalerts-skeleton'));

        await openStatusFilter(utils);
        await selectFilterValue(utils, 'Unassigned');

        await waitFor(() => {
            expect(getAllByRole('row').length).toBe(2);
        });

        expect(queryByText('Another Staff')).not.toBeInTheDocument();
    });

    it('filters by specific user correctly', async () => {
        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API().apiUrl)
            .reply(200, { data: [...adminDashboardSystemAlerts] });

        const utils = setup();
        const { getByTestId, getAllByRole, queryByText } = utils;

        await waitForElementToBeRemoved(getByTestId('admin-dashboard-systemalerts-skeleton'));

        await openStatusFilter(utils);
        await selectFilterValue(utils, 'Another Staff');

        await waitFor(() => {
            expect(getAllByRole('row').length).toBe(2);
        });

        expect(queryByText('Unassigned')).not.toBeInTheDocument();
    });

    it('clears status filter correctly', async () => {
        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API().apiUrl)
            .reply(200, { data: [...adminDashboardSystemAlerts] });

        const utils = setup();
        const { getByTestId, getByRole, getAllByRole } = utils;

        await waitForElementToBeRemoved(getByTestId('admin-dashboard-systemalerts-skeleton'));

        // apply filter
        await openStatusFilter(utils);
        await selectFilterValue(utils, 'Mine');

        // assert filtered results - only title row
        expect(getAllByRole('row').length).toBe(1);

        // reopen filter
        await openStatusFilter(utils);

        // clear filter = select empty value (first option in dropdown)
        const valueCombo = within(getByRole('tooltip')).getByLabelText('Value');
        await userEvent.click(valueCombo);

        const options = getAllByRole('option');
        await userEvent.click(options[0]); // first option = clear/reset

        // assert reset state
        expect(getAllByRole('row').length).toBe(4);
    });

    it('should render safely when adminDashboardConfigReducer is null', async () => {
        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API().apiUrl)
            .reply(200, { data: [...adminDashboardSystemAlerts] });

        const state = { adminDashboardConfigReducer: null };
        const { getByTestId, getByText, getAllByRole } = setup({}, state);

        await waitForElementToBeRemoved(getByTestId('admin-dashboard-systemalerts-skeleton'));

        // table still renders
        expect(getByText(/system alerts/i)).toBeInTheDocument();

        // rows still render (system should fallback safely)
        expect(getAllByRole('row').length).toBeGreaterThan(0);
    });

    it('should show batch assign controls when rows are selected', async () => {
        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API().apiUrl)
            .reply(200, { data: [...adminDashboardSystemAlerts] });

        const { getByTestId, getAllByRole, getByText, getByLabelText } = setup();

        await waitForElementToBeRemoved(getByTestId('admin-dashboard-systemalerts-skeleton'));

        // select first row (skip header checkbox)
        const checkboxes = getAllByRole('checkbox');
        await userEvent.click(checkboxes[1]);

        expect(getByText(/1 selected/i)).toBeInTheDocument();
        expect(getByLabelText(/assign/i)).toBeInTheDocument();
    });

    it('should call batch assign API with correct payload', async () => {
        const expectedPayload = {
            ids: [1],
            sat_assigned_to: 13,
        };

        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API().apiUrl)
            .reply(200, { data: [...adminDashboardSystemAlerts] });

        mockApi
            .onPatch(repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_BATCH_ASSIGN_API().apiUrl, expectedPayload)
            .reply(200, {});

        const batchAssignSpy = jest.spyOn(DashboardActions, 'adminDashboardSystemAlertsBatchAssign');

        const { getByTestId, getAllByRole, getByLabelText, getByRole, queryByText } = setup();

        await waitForElementToBeRemoved(getByTestId('admin-dashboard-systemalerts-skeleton'));

        const checkboxes = getAllByRole('checkbox');
        await userEvent.click(checkboxes[1]); // select first row

        // open assign dropdown
        await userEvent.click(getByLabelText(/assign/i));

        // select user
        await userEvent.click(getByRole('option', { name: 'Staff' }));

        await waitFor(() => {
            expect(batchAssignSpy).toHaveBeenCalledWith(expectedPayload);
        });

        await waitFor(() => {
            expect(queryByText(/selected/i)).not.toBeInTheDocument();
        });
    });

    it('should disable batch assign when selection includes resolved alerts', async () => {
        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API().apiUrl)
            .reply(200, { data: [...adminDashboardSystemAlerts, { sat_id: 12, sat_resolved_by: 123 }] });

        const { getByTestId, getAllByRole, getByLabelText } = setup();

        await waitForElementToBeRemoved(getByTestId('admin-dashboard-systemalerts-skeleton'));

        const checkboxes = getAllByRole('checkbox');

        // select multiple rows (including resolved one)
        await userEvent.click(checkboxes[1]);
        await userEvent.click(checkboxes[4]);

        expect(getByLabelText(/assign/i)).toBeDisabled();
    });

    it('should keep selection if batch assign fails', async () => {
        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API().apiUrl)
            .reply(200, { data: [...adminDashboardSystemAlerts] });

        mockApi.onPatch(repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_BATCH_ASSIGN_API().apiUrl).reply(500);

        const { getByTestId, getAllByRole, getByLabelText, getByRole, getByText } = setup();

        await waitForElementToBeRemoved(getByTestId('admin-dashboard-systemalerts-skeleton'));

        const checkboxes = getAllByRole('checkbox');
        await userEvent.click(checkboxes[1]);

        await userEvent.click(getByLabelText(/assign/i));
        await userEvent.click(getByRole('option', { name: 'Staff' }));

        await waitFor(() => {
            expect(getByText(/1 selected/i)).toBeInTheDocument();
        });
    });
});
