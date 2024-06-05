import React from 'react';
import Immutable from 'immutable';

import { render, WithReduxStore, within, waitFor, waitForElementToBeRemoved, userEvent, preview } from 'test-utils';

import * as DashboardActions from 'actions/adminDashboard';
import * as repositories from 'repositories';

import { adminDashboardReportWorksData, adminDashboardReportSystemAlertsData } from 'mock/data/testing/adminDashboard';
import Reports from './Reports';

const setup = (props = {}, state = {}, renderer = render) => {
    const testState = {
        ...state,
    };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(testState)}>
            <Reports {...props} />
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
    it('should render', async () => {
        const { getByText, getByTestId, getByRole } = setup();

        expect(getByText('Export-only reports')).toBeInTheDocument();
        expect(getByTestId('report-export-only-input')).toBeInTheDocument();
        expect(getByRole('button', { name: 'Export report' })).toHaveAttribute('disabled');

        expect(getByText('Display reports')).toBeInTheDocument();
        expect(getByTestId('report-display-export-input')).toBeInTheDocument();
        expect(getByTestId('report-display-date-from-input')).toHaveAttribute('disabled');
        expect(getByTestId('report-display-date-to-input')).toHaveAttribute('disabled');
        expect(getByRole('button', { name: 'Run report' })).toHaveAttribute('disabled');
        expect(getByRole('button', { name: 'Export' })).toHaveAttribute('disabled');
    });

    it('should handle export-only reports', async () => {
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_EXPORT_REPORT_API({ id: 1 }).apiUrl).reply(200, { data: {} });
        const loadAdminDashboardExportReportFn = jest.spyOn(DashboardActions, 'loadAdminDashboardExportReport');
        const { getAllByRole, getByRole, getByTestId } = setup();

        await userEvent.click(getByTestId('report-export-only-input'));
        expect(getAllByRole('option').length).toBe(4);

        await userEvent.click(getByTestId('report-export-only-option-0', { hidden: true }));

        expect(getByTestId('report-export-only-input')).toHaveValue('Wok ID dups');
        expect(getByRole('button', { name: 'Export report' })).not.toHaveAttribute('disabled');

        await userEvent.click(getByRole('button', { name: 'Export report' }));
        expect(within(getByRole('button', { name: 'Export report' })).getByRole('progressbar')).toBeInTheDocument();
        expect(getByRole('button', { name: 'Export report' })).toHaveAttribute('disabled');

        expect(loadAdminDashboardExportReportFn).toHaveBeenCalledWith({ export_to: 'excel', id: 1 });
    });

    it('should display alert when export-only reports failure', async () => {
        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_EXPORT_REPORT_API({ id: 1 }).apiUrl)
            .reply(422, { message: 'Test error' });
        const { queryByTestId, getByTestId } = setup(
            {},
            { adminDashboardExportReportReducer: { adminDashboardExportReportFailed: { errorMessage: 'Test error' } } },
        );
        expect(getByTestId('alert')).toBeInTheDocument();

        expect(
            within(getByTestId('alert')).getByText('An error occurred while retrieving the report.'),
        ).toBeInTheDocument();
        await userEvent.click(getByTestId('dismiss'));
        expect(queryByTestId('alert')).not.toBeInTheDocument();
    });

    it('should handle basic display reports', async () => {
        const loadAdminDashboardExportReportFn = jest.spyOn(DashboardActions, 'loadAdminDashboardExportReport');
        const { getAllByRole, getByRole, getByTestId } = setup();

        await userEvent.click(getByTestId('report-display-export-input'));
        expect(getAllByRole('option').length).toBe(2);

        await userEvent.click(getByRole('option', { name: 'Works history' }));

        expect(getByTestId('report-display-export-input')).toHaveValue('Works history');
        expect(getByRole('button', { name: 'Run report' })).not.toHaveAttribute('disabled');

        preview.debug();
        // here, confirm dates are not disabled. then select other report and
        // confirm the extra field appears. then run report confirm that and then hit export.

        // then need some validation testing

        // await userEvent.click(getByRole('button', { name: 'Export report' }));
        // expect(within(getByRole('button', { name: 'Export report' })).getByRole('progressbar')).toBeInTheDocument();
        // expect(getByRole('button', { name: 'Export report' })).toHaveAttribute('disabled');

        // expect(loadAdminDashboardExportReportFn).toHaveBeenCalledWith({ export_to: 'excel', id: 1 });
    });
});
