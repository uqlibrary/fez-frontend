import React from 'react';
import Immutable from 'immutable';

import { render, WithReduxStore, waitFor, waitForElementToBeRemoved } from 'test-utils';

import * as DashboardActions from 'actions/adminDashboard';
import * as repositories from 'repositories';
import * as mockData from 'mock/data';

import AdminDashboard, { CustomTabPanel } from './AdminDashboard';

const setup = (props = {}, state = {}, renderer = render) => {
    return renderer(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <AdminDashboard {...props} />
        </WithReduxStore>,
    );
};

describe('AdminDashboard', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_CONFIG_API().apiUrl)
            .reply(200, { data: { ...mockData.adminDashboardConfig } });
        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_TODAY_API().apiUrl)
            .reply(200, { data: { ...mockData.adminDashboardToday } });
    });

    afterEach(() => {
        mockApi.reset();
        jest.clearAllMocks();
    });

    it('should render no config error (empty config array)', async () => {
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_CONFIG_API().apiUrl).reply(200, { data: [] });
        const loadAdminDashboardConfigFn = jest.spyOn(DashboardActions, 'loadAdminDashboardConfig');
        const { getByTestId, getByText } = setup();
        expect(loadAdminDashboardConfigFn).toHaveBeenCalled();
        expect(getByTestId('page-title')).toHaveTextContent('Admin dashboard');
        await waitForElementToBeRemoved(getByText('Loading config data...'));
        expect(getByText('No config available')).toBeInTheDocument();
    });

    it('should render no config error (null return)', async () => {
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_CONFIG_API().apiUrl).reply(200, null);
        const loadAdminDashboardConfigFn = jest.spyOn(DashboardActions, 'loadAdminDashboardConfig');
        const { getByTestId, getByText } = setup();
        expect(loadAdminDashboardConfigFn).toHaveBeenCalled();
        expect(getByTestId('page-title')).toHaveTextContent('Admin dashboard');
        await waitForElementToBeRemoved(getByText('Loading config data...'));
        expect(getByText('No config available')).toBeInTheDocument();
    });
    it('should render no config error (loading error message)', async () => {
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_CONFIG_API().apiUrl).reply(422, { message: 'test' });
        const loadAdminDashboardConfigFn = jest.spyOn(DashboardActions, 'loadAdminDashboardConfig');
        const { getByTestId, getByText } = setup();
        expect(loadAdminDashboardConfigFn).toHaveBeenCalled();
        expect(getByTestId('page-title')).toHaveTextContent('Admin dashboard');
        await waitForElementToBeRemoved(getByText('Loading config data...'));
        expect(getByText('No config available')).toBeInTheDocument();
    });

    it('should render page tabbed component and loaders', async () => {
        const loadAdminDashboardTodayFn = jest.spyOn(DashboardActions, 'loadAdminDashboardToday');

        const { getAllByRole } = setup();
        await waitFor(() => expect(loadAdminDashboardTodayFn).toHaveBeenCalled());

        expect(getAllByRole('tab').length).toBe(3);
        expect(getAllByRole('tab')[0]).toHaveTextContent('TODAY');
        expect(getAllByRole('tab')[1]).toHaveTextContent('SYSTEM ALERTS');
        expect(getAllByRole('tab')[2]).toHaveTextContent('REPORTS');
    });
    it('should render today tab with zeroed today data (coverage)', async () => {
        // TODO : assert expected values once mui-x charts can be tested
        const mockReply = {
            systemalerts: {
                total: 0,
                today: 0,
                assigned: 0,
                unassigned: 0,
                mine: 0,
            },
            works: {
                processed: 0,
                unprocessed: 0,
            },
            oa: {
                current: 0,
                total: 0,
            },
        };
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_TODAY_API().apiUrl).reply(200, { data: { ...mockReply } });

        const loadAdminDashboardTodayFn = jest.spyOn(DashboardActions, 'loadAdminDashboardToday');

        const { getAllByRole } = setup();
        await waitFor(() => expect(loadAdminDashboardTodayFn).toHaveBeenCalled());

        expect(getAllByRole('tab').length).toBe(3);
        expect(getAllByRole('tab')[0]).toHaveTextContent('TODAY');
        expect(getAllByRole('tab')[1]).toHaveTextContent('SYSTEM ALERTS');
        expect(getAllByRole('tab')[2]).toHaveTextContent('REPORTS');
    });

    // Note: at the time of writing (May 2024), mui-x/chart components do not work with Jest tests.
    // Coverage for the when charts are shown etc. is covered in Cypress instead.

    describe('CustomTabPanel', () => {
        it('should render child', () => {
            const { getByTestId, getByText } = render(
                <CustomTabPanel value={1} index={1} className="testClass">
                    <div>Test child</div>
                </CustomTabPanel>,
            );
            expect(getByTestId('admin-dashboard-tabs-1')).toBeInTheDocument();
            expect(getByTestId('admin-dashboard-tabs-1')).toHaveClass('testClass');
            expect(getByText('Test child')).toBeInTheDocument();
        });
        it('should not render child', () => {
            const { getByTestId, queryByText } = render(
                <CustomTabPanel value={1} index={2} role="test">
                    <div>Test child</div>
                </CustomTabPanel>,
            );
            expect(getByTestId('admin-dashboard-tabs-2')).toBeInTheDocument();
            expect(queryByText('Test child')).not.toBeInTheDocument();
        });
        it('should render nothing', () => {
            const { getByTestId } = render(<CustomTabPanel />);
            expect(getByTestId('admin-dashboard-tabs-undefined')).toBeInTheDocument();
        });
    });
});
