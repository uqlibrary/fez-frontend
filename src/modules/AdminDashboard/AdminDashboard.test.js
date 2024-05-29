/* eslint-disable no-unused-vars */
import React from 'react';
import Immutable from 'immutable';

import { render, WithReduxStore, waitFor, waitForElementToBeRemoved, fireEvent, preview } from 'test-utils';

import * as DashboardActions from 'actions/adminDashboard';
import * as actions from '../../actions/actionTypes';
import * as repositories from 'repositories';
import * as mockData from 'mock/data';

import * as Hooks from './hooks';

import ActionDashboard, { tabProps, tabsConfig, CustomTabPanel } from './AdminDashboard';
import AdminDashboard from './AdminDashboard';

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
            .reply(200, mockData.adminDashboardConfig);
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_TODAY_API().apiUrl).reply(200, mockData.adminDashboardToday);
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should render no config error', async () => {
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_CONFIG_API().apiUrl).reply(200, []);
        const loadAdminDashboardConfigFn = jest.spyOn(DashboardActions, 'loadAdminDashboardConfig');
        const { getByText } = setup();
        expect(loadAdminDashboardConfigFn).toHaveBeenCalled();
        await waitForElementToBeRemoved(getByText('Loading config data...'));
        expect(getByText('No config available')).toBeInTheDocument();
    });

    it('should render', async () => {
        const loadAdminDashboardTodayFn = jest.spyOn(DashboardActions, 'loadAdminDashboardToday');

        const { getByText } = setup();
        expect(loadAdminDashboardTodayFn).toHaveBeenCalled();
        preview.debug();
    });

    describe('tabProps', () => {
        it('should return a numbered badge', () => {
            const tab = tabProps.find(tab => tab.id === 1).render(100);
            const { getByTestId } = render(<>{tab.icon}</>);
            expect(getByTestId('tab-counter-100')).toBeInTheDocument();
        });
        it('should return a numbered badge', () => {
            const tab = tabProps.find(tab => tab.id === 1).render();
            const { container } = render(<>{tab.icon}</>);
            expect(container.querySelector('[test-id^=tab-counter-]')).not.toBeInTheDocument();
        });
    });

    describe('CustomTabPanel', () => {
        it('should render child', () => {
            const { getByTestId, getByText, getByRole } = render(
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
    });
});
