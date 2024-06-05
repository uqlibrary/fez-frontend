import React from 'react';
import Immutable from 'immutable';

import { render, WithReduxStore, within, waitFor, waitForElementToBeRemoved, userEvent } from 'test-utils';

import * as DashboardActions from 'actions/adminDashboard';
import * as repositories from 'repositories';

import { adminDashboardSystemAlerts } from 'mock/data/testing/adminDashboard';
import SystemAlerts from './SystemAlerts';

const setup = (props = {}, state = {}, renderer = render) => {
    const testState = {
        adminDashboardConfigReducer: {
            adminDashboardConfigData: {
                admin_users: [
                    { id: 13, name: 'Staff' },
                    { id: 23, name: 'Another Staff' },
                ],
            },
        },
        ...state,
    };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(testState)}>
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

        // await waitForElementToBeRemoved(getByRole('progressbar'));
        expect(getByText('3 system alerts')).toBeInTheDocument();
        expect(getAllByRole('row').length).toBe(4); // header & 3 'body' rows

        // header
        expect(getByRole('columnheader', { name: 'Created' })).toBeInTheDocument();
        expect(getByRole('columnheader', { name: 'Topic' })).toBeInTheDocument();
        expect(getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();

        // rows cells
        expect(getByRole('gridcell', { name: '4th March 2024' })).toBeInTheDocument();
        expect(getByRole('gridcell', { name: '5th April 2024' })).toBeInTheDocument();
        expect(getByRole('gridcell', { name: '6th May 2024' })).toBeInTheDocument();

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
        const expectedUpdateRequest = { sat_id: 13 };
        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API().apiUrl)
            .reply(200, { data: [...adminDashboardSystemAlerts] });
        mockApi
            .onPut(repositories.routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API().apiUrl, expectedUpdateRequest)
            .reply(200, {});
        const loadAdminDashboardSystemAlertsFn = jest.spyOn(DashboardActions, 'loadAdminDashboardSystemAlerts');
        const adminDashboardSystemAlertsFn = jest.spyOn(DashboardActions, 'adminDashboardSystemAlerts');

        const { getByTestId, getByRole } = setup();
        expect(loadAdminDashboardSystemAlertsFn).toHaveBeenCalled();
        await waitForElementToBeRemoved(getByTestId('admin-dashboard-systemalerts-skeleton'));

        await userEvent.click(getByRole('gridcell', { name: '6th May 2024' }));

        await waitFor(() => getByTestId('system-alert-detail'));
        await userEvent.click(getByTestId('system-alert-detail-action-button'));

        expect(adminDashboardSystemAlertsFn).toHaveBeenCalledWith(expectedUpdateRequest);
        await waitFor(() => expect(loadAdminDashboardSystemAlertsFn).toHaveBeenCalledTimes(2));

        expect(
            within(getByTestId('standard-card-content')).getByRole('progressbar', { hidden: true }),
        ).toBeInTheDocument();
    });
});
