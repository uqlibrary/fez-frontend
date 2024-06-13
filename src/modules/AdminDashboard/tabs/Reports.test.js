import React from 'react';
import Immutable from 'immutable';

import { render, WithReduxStore, within, waitFor, userEvent } from 'test-utils';

import * as DashboardActions from 'actions/adminDashboard';
import * as repositories from 'repositories';
import * as Utils from '../utils';

import { adminDashboardReportSystemAlertsData, adminDashboardReportWorksData } from 'mock/data/testing/adminDashboard';
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
        const clearAdminDashboardExportReportFn = jest.spyOn(DashboardActions, 'clearAdminDashboardExportReport');

        const { queryByTestId, getByTestId } = setup(
            {},
            { adminDashboardExportReportReducer: { adminDashboardExportReportFailed: { errorMessage: 'Test error' } } },
        );
        expect(getByTestId('alert-report-export-only')).toBeInTheDocument();

        expect(
            within(getByTestId('alert-report-export-only')).getByText('An error occurred while retrieving the report.'),
        ).toBeInTheDocument();
        await userEvent.click(getByTestId('dismiss'));
        expect(queryByTestId('alert-report-export-only')).not.toBeInTheDocument();
        expect(clearAdminDashboardExportReportFn).toHaveBeenCalled();
    });

    it('should handle basic display reports', async () => {
        const loadAdminDashboardDisplayReportFn = jest.spyOn(DashboardActions, 'loadAdminDashboardDisplayReport');
        const { getAllByRole, getByRole, getByTestId, queryByTestId } = setup();

        await userEvent.click(getByTestId('report-display-export-input'));
        expect(getAllByRole('option').length).toBe(2);

        await userEvent.click(getByRole('option', { name: 'Works history' }));

        expect(getByTestId('report-display-export-input')).toHaveValue('Works history');
        expect(getByTestId('report-display-date-from-input')).not.toHaveAttribute('disabled');
        expect(getByTestId('report-display-date-to-input')).not.toHaveAttribute('disabled');
        expect(getByRole('button', { name: 'Run report' })).not.toHaveAttribute('disabled');
        expect(getByRole('button', { name: 'Export' })).toHaveAttribute('disabled');

        expect(queryByTestId('report-display-system-alert-id-input')).not.toBeInTheDocument();

        await userEvent.click(getByTestId('report-display-export-input'));
        expect(getAllByRole('option').length).toBe(2);

        await userEvent.click(getByRole('option', { name: 'System alert log' }));

        expect(getByTestId('report-display-export-input')).toHaveValue('System alert log');

        // additional field should be visible
        expect(getByTestId('report-display-system-alert-id-input')).toBeInTheDocument();

        await userEvent.click(getByRole('button', { name: 'Run report' }));
        expect(within(getByRole('button', { name: 'Run report' })).getByRole('progressbar')).toBeInTheDocument();
        expect(getByRole('button', { name: 'Run report' })).toHaveAttribute('disabled');

        expect(loadAdminDashboardDisplayReportFn).toHaveBeenCalledWith({ id: 'systemalertlog' });
    });

    it('should build full works history report request', async () => {
        const expectedRequest = {
            dateFrom: '2024-04-02T00:00:00+10:00',
            dateTo: '2024-05-03T00:00:00+10:00', // TBC what the BE needs for searching
            id: 'workshistory',
        };

        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_DISPLAY_REPORT_API({ ...expectedRequest }).apiUrl)
            .reply(200, { data: [...adminDashboardReportWorksData] });

        const loadAdminDashboardDisplayReportFn = jest.spyOn(DashboardActions, 'loadAdminDashboardDisplayReport');
        const exportReportToExcelFn = jest.spyOn(Utils, 'exportReportToExcel').mockImplementation(() => {
            return true;
        });

        const { getAllByRole, getByRole, getByTestId } = setup();

        await userEvent.click(getByTestId('report-display-export-input'));
        expect(getAllByRole('option').length).toBe(2);

        await userEvent.click(getByRole('option', { name: 'Works history' }));
        expect(getByTestId('report-display-export-input')).toHaveValue('Works history');

        expect(getByTestId('report-display-date-from-input')).not.toHaveAttribute('disabled');
        expect(getByTestId('report-display-date-to-input')).not.toHaveAttribute('disabled');
        expect(getByRole('button', { name: 'Run report' })).not.toHaveAttribute('disabled');
        expect(getByRole('button', { name: 'Export' })).toHaveAttribute('disabled');

        await userEvent.type(getByTestId('report-display-date-from-input'), '02/04/2024');
        await userEvent.type(getByTestId('report-display-date-to-input'), '03/05/2024');

        await userEvent.click(getByRole('button', { name: 'Run report' }));
        expect(within(getByRole('button', { name: 'Run report' })).getByRole('progressbar')).toBeInTheDocument();
        expect(getByRole('button', { name: 'Run report' })).toHaveAttribute('disabled');

        expect(loadAdminDashboardDisplayReportFn).toHaveBeenCalledWith(expectedRequest);

        await waitFor(() => getByTestId('report-display-data-grid'));

        expect(within(getByTestId('report-display-data-grid')).getAllByRole('row').length).toBe(
            adminDashboardReportWorksData.length + 1,
        ); // +1 to include the header

        expect(within(getByRole('button', { name: 'Run report' })).queryByRole('progressbar')).not.toBeInTheDocument();
        expect(getByRole('button', { name: 'Export' })).not.toHaveAttribute('disabled');

        await userEvent.click(getByRole('button', { name: 'Export' }));
        expect(exportReportToExcelFn).toHaveBeenCalledWith(
            expect.objectContaining({ filename: 'espace_export_20170630000000.xlsx', sheetLabel: 'Works history' }),
        );
    });
    it('should build full system alerts report request', async () => {
        const expectedRequest = {
            dateFrom: '2024-04-02T00:00:00+10:00',
            dateTo: '2024-05-03T00:00:00+10:00', // TBC what the BE needs for searching
            alertId: '123',
            id: 'systemalertlog',
        };

        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_DISPLAY_REPORT_API({ ...expectedRequest }).apiUrl)
            .reply(200, { data: [...adminDashboardReportSystemAlertsData] });

        const loadAdminDashboardDisplayReportFn = jest.spyOn(DashboardActions, 'loadAdminDashboardDisplayReport');
        const exportReportToExcelFn = jest.spyOn(Utils, 'exportReportToExcel').mockImplementation(() => {
            return true;
        });
        const { getAllByRole, getByRole, getByTestId } = setup();

        await userEvent.click(getByTestId('report-display-export-input'));
        expect(getAllByRole('option').length).toBe(2);

        await userEvent.click(getByRole('option', { name: 'System alert log' }));
        expect(getByTestId('report-display-export-input')).toHaveValue('System alert log');

        expect(getByTestId('report-display-date-from-input')).not.toHaveAttribute('disabled');
        expect(getByTestId('report-display-date-to-input')).not.toHaveAttribute('disabled');
        expect(getByTestId('report-display-system-alert-id-input')).toBeInTheDocument();
        expect(getByRole('button', { name: 'Run report' })).not.toHaveAttribute('disabled');
        expect(getByRole('button', { name: 'Export' })).toHaveAttribute('disabled');

        await userEvent.type(getByTestId('report-display-date-from-input'), '02/04/2024');
        await userEvent.type(getByTestId('report-display-date-to-input'), '03/05/2024');
        await userEvent.type(getByTestId('report-display-system-alert-id-input'), '123');

        await userEvent.click(getByRole('button', { name: 'Run report' }));
        expect(within(getByRole('button', { name: 'Run report' })).getByRole('progressbar')).toBeInTheDocument();
        expect(getByRole('button', { name: 'Run report' })).toHaveAttribute('disabled');

        expect(loadAdminDashboardDisplayReportFn).toHaveBeenCalledWith(expectedRequest);

        await waitFor(() => getByTestId('report-display-data-grid'));

        expect(within(getByTestId('report-display-data-grid')).getAllByRole('row').length).toBe(
            adminDashboardReportSystemAlertsData.length + 1,
        ); // +1 to include the header

        expect(within(getByRole('button', { name: 'Run report' })).queryByRole('progressbar')).not.toBeInTheDocument();
        expect(getByRole('button', { name: 'Export' })).not.toHaveAttribute('disabled');

        await userEvent.click(getByRole('button', { name: 'Export' }));
        expect(exportReportToExcelFn).toHaveBeenCalledWith(
            expect.objectContaining({ filename: 'espace_export_20170630000000.xlsx', sheetLabel: 'System alert log' }),
        );
    });

    it('handled input validation', async () => {
        const { getAllByRole, getByRole, getByTestId } = setup();

        await userEvent.click(getByTestId('report-display-export-input'));
        expect(getAllByRole('option').length).toBe(2);

        await userEvent.click(getByRole('option', { name: 'Works history' }));
        expect(getByTestId('report-display-export-input')).toHaveValue('Works history');

        expect(getByRole('button', { name: 'Run report' })).not.toHaveAttribute('disabled');

        expect(getByTestId('report-display-date-to-input')).not.toHaveAttribute('required');
        await userEvent.type(getByTestId('report-display-date-from-input'), '02/04/2023');

        expect(getByRole('button', { name: 'Run report' })).toHaveAttribute('disabled');
        expect(getByTestId('report-display-date-to-input')).toHaveAttribute('required');
        expect(within(getByTestId('report-display-date-to')).getByText('Required')).toBeInTheDocument();

        await userEvent.type(getByTestId('report-display-date-to-input'), '01/01/2023');
        expect(getByRole('button', { name: 'Run report' })).toHaveAttribute('disabled');
        expect(getByTestId('report-display-date-from-input')).toHaveAttribute('required');
        expect(
            within(getByTestId('report-display-date-from')).getByText('Must not be after "to" date'),
        ).toBeInTheDocument();

        await userEvent.type(getByTestId('report-display-date-to-input'), '{backspace}4');
        expect(getByRole('button', { name: 'Run report' })).not.toHaveAttribute('disabled');
        expect(getByTestId('report-display-date-from-input')).not.toHaveAttribute('required');
        expect(
            within(getByTestId('report-display-date-from')).queryByText('Must not be after "to" date'),
        ).not.toBeInTheDocument();

        // clear "from" date field
        await userEvent.type(
            getByTestId('report-display-date-from-input'),
            '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}',
        );
        expect(getByRole('button', { name: 'Run report' })).toHaveAttribute('disabled');
        expect(getByTestId('report-display-date-from-input')).toHaveAttribute('required');
        expect(within(getByTestId('report-display-date-from')).getByText('Required')).toBeInTheDocument();

        await userEvent.type(getByTestId('report-display-date-from-input'), '02/04/2023');
        expect(getByRole('button', { name: 'Run report' })).not.toHaveAttribute('disabled');

        // change report type as the next test is for system alerts only
        await userEvent.click(getByTestId('report-display-export-input'));
        expect(getAllByRole('option').length).toBe(2);

        await userEvent.click(getByRole('option', { name: 'System alert log' }));
        expect(getByTestId('report-display-export-input')).toHaveValue('System alert log');

        await userEvent.type(getByTestId('report-display-system-alert-id-input'), '12a');
        expect(
            within(getByTestId('report-display-system-alert-id')).getByText('Must be a positive whole number'),
        ).toBeInTheDocument();
        expect(getByRole('button', { name: 'Run report' })).toHaveAttribute('disabled');

        await userEvent.type(getByTestId('report-display-system-alert-id-input'), '{backspace}3');

        expect(
            within(getByTestId('report-display-system-alert-id')).queryByText('Must be a positive whole number'),
        ).not.toBeInTheDocument();

        expect(getByRole('button', { name: 'Run report' })).not.toHaveAttribute('disabled');
    });

    it('should display alert when display reports failure', async () => {
        const clearAdminDashboardDisplayReportFn = jest.spyOn(DashboardActions, 'clearAdminDashboardDisplayReport');

        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_DISPLAY_REPORT_API({ id: 'systemalertlog' }).apiUrl)
            .reply(422, { message: 'Test error' });
        const { queryByTestId, getByTestId, getByRole } = setup();
        // {},
        // { adminDashboardExportReportReducer: { adminDashboardExportReportFailed: { errorMessage: 'Test error' } } },

        await userEvent.click(getByTestId('report-display-export-input'));
        await userEvent.click(getByRole('option', { name: 'System alert log' }));
        await userEvent.click(getByRole('button', { name: 'Run report' }));

        await waitFor(() => expect(getByTestId('alert-report-display-export')).toBeInTheDocument());

        expect(
            within(getByTestId('alert-report-display-export')).getByText(
                'An error occurred while retrieving the report.',
            ),
        ).toBeInTheDocument();
        await userEvent.click(getByTestId('dismiss'));
        expect(queryByTestId('alert-report-display-export')).not.toBeInTheDocument();
        expect(clearAdminDashboardDisplayReportFn).toHaveBeenCalled();
    });
});
