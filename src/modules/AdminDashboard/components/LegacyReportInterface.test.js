import React from 'react';

import { render, userEvent } from 'test-utils';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import * as repositories from 'repositories';
import { defaultLegacyReportOption } from '../config';
import { adminDashboardConfig } from 'mock/data/testing/adminDashboard';
import { emptyReportActionState as actionState } from '../reducers';

import locale from 'locale/components';
import LegacyReportInterface, { validator } from './LegacyReportInterface';

const setup = (props = {}, renderer = render) => {
    const items = adminDashboardConfig.export_reports.map(report => ({
        ...report,
        sel_bindings: report.sel_bindings && report.sel_bindings.split(','),
    }));

    const testProps = {
        id: 'testForm',
        items,
        ...props,
    };
    return renderer(
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-au">
            <LegacyReportInterface {...testProps} />
        </LocalizationProvider>,
    );
};

describe('LegacyReportInterface', () => {
    beforeEach(() => {
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
        jest.clearAllMocks();
    });

    it('should render', async () => {
        const { getByTestId, getByRole } = setup();

        expect(getByTestId('testForm')).toBeInTheDocument();
        expect(getByTestId('testForm-input')).not.toHaveAttribute('disabled');
        expect(getByRole('button', { name: 'Export report' })).toHaveAttribute('disabled');
    });

    it('should render with disabled fields when disabled flag set', async () => {
        const { getByTestId, getByRole } = setup({
            disabled: true,
            exportReport: { ...defaultLegacyReportOption, sel_id: 1, sel_title: 'Test' },
        });

        expect(getByTestId('testForm')).toBeInTheDocument();
        expect(getByTestId('testForm-input')).toHaveAttribute('disabled');
        expect(getByRole('button', { name: 'Export report' })).toHaveAttribute('disabled');
    });

    it('should render with disabled button when no option is selected', async () => {
        const { getByTestId, getByRole } = setup({
            disabled: false,
            exportReport: { ...defaultLegacyReportOption },
        });

        expect(getByTestId('testForm')).toBeInTheDocument();
        expect(getByTestId('testForm-input')).not.toHaveAttribute('disabled');
        expect(getByRole('button', { name: 'Export report' })).toHaveAttribute('disabled');
    });

    it('should render with disabled fields when loading', async () => {
        const { getByTestId, getByRole } = setup({
            loading: true,
        });

        expect(getByTestId('testForm')).toBeInTheDocument();
        expect(getByTestId('testForm-input')).toHaveAttribute('disabled');
        expect(getByRole('button', { name: 'Export report' })).toHaveAttribute('disabled');
    });

    it('should select a non-bindings report', async () => {
        const { getAllByRole, getByTestId } = setup();

        expect(getByTestId('testForm-date-from-input')).toHaveAttribute('disabled');
        expect(getByTestId('testForm-date-to-input')).toHaveAttribute('disabled');

        await userEvent.click(getByTestId('testForm-input'));
        expect(getAllByRole('option').length).toBe(6);

        await userEvent.click(getByTestId('testForm-option-0', { hidden: true }));

        expect(getByTestId('testForm-input')).toHaveValue('Wok ID dups'); // no bindings required
        expect(getByTestId('testForm-date-from-input')).toHaveAttribute('disabled');
        expect(getByTestId('testForm-date-to-input')).toHaveAttribute('disabled');
    });

    it('should select a single bindings report', async () => {
        const { getAllByRole, getByTestId } = setup();

        expect(getByTestId('testForm-date-from-input')).toHaveAttribute('disabled');
        expect(getByTestId('testForm-date-to-input')).toHaveAttribute('disabled');

        await userEvent.click(getByTestId('testForm-input'));
        expect(getAllByRole('option').length).toBe(6);
        await userEvent.click(getByTestId('testForm-option-4', { hidden: true }));

        expect(getByTestId('testForm-input')).toHaveValue('Queued report one binding'); //  bindings required
        expect(getByTestId('testForm-date-from-input')).not.toHaveAttribute('disabled');
        expect(getByTestId('testForm-date-to-input')).toHaveAttribute('disabled');
    });

    it('should select a double bindings report', async () => {
        const { getAllByRole, getByTestId } = setup();

        expect(getByTestId('testForm-date-from-input')).toHaveAttribute('disabled');
        expect(getByTestId('testForm-date-to-input')).toHaveAttribute('disabled');

        await userEvent.click(getByTestId('testForm-input'));
        expect(getAllByRole('option').length).toBe(6);
        await userEvent.click(getByTestId('testForm-option-5', { hidden: true }));

        expect(getByTestId('testForm-input')).toHaveValue('Queued report two bindings'); // two bindings required
        expect(getByTestId('testForm-date-from-input')).not.toHaveAttribute('disabled');
        expect(getByTestId('testForm-date-to-input')).not.toHaveAttribute('disabled');
    });

    it('should call report function for non-bindings report when export button pressed', async () => {
        const onExportClickFn = jest.fn();
        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_EXPORT_REPORT_API({ report_type: 1 }).apiUrl)
            .reply(200, { data: {} });

        const { getByRole, getAllByRole, getByTestId } = setup({
            onExportClick: onExportClickFn,
        });

        expect(getByTestId('testForm-date-from-input')).toHaveAttribute('disabled');
        expect(getByTestId('testForm-date-to-input')).toHaveAttribute('disabled');

        await userEvent.click(getByTestId('testForm-input'));
        expect(getAllByRole('option').length).toBe(6);

        await userEvent.click(getByTestId('testForm-option-0', { hidden: true }));

        expect(getByTestId('testForm-input')).toHaveValue('Wok ID dups');

        expect(getByRole('button', { name: 'Export report' })).not.toHaveAttribute('disabled'); // no bindings required

        await userEvent.click(getByRole('button', { name: 'Export report' }));

        expect(onExportClickFn).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'exportReport',
                report: expect.objectContaining({ sel_id: 1, sel_title: 'Wok ID dups' }),
            }),
        );
    });

    it('should call report function for bindings report when export button pressed', async () => {
        const onExportClickFn = jest.fn();
        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_EXPORT_REPORT_API({ report_type: 1 }).apiUrl)
            .reply(200, { data: {} });

        const { getByRole, getAllByRole, getByTestId } = setup({
            onExportClick: onExportClickFn,
        });

        expect(getByTestId('testForm-date-from-input')).toHaveAttribute('disabled');
        expect(getByTestId('testForm-date-to-input')).toHaveAttribute('disabled');

        await userEvent.click(getByTestId('testForm-input'));
        expect(getAllByRole('option').length).toBe(6);

        await userEvent.click(getByTestId('testForm-option-5', { hidden: true }));

        expect(getByTestId('testForm-input')).toHaveValue('Queued report two bindings');

        expect(getByRole('button', { name: 'Export report' })).toHaveAttribute('disabled'); // bindings required

        await userEvent.type(getByTestId('testForm-date-from-input'), '02/04/2023');
        await userEvent.type(getByTestId('testForm-date-to-input'), '12/04/2023');

        expect(getByRole('button', { name: 'Export report' })).not.toHaveAttribute('disabled'); // bindings required
        await userEvent.click(getByRole('button', { name: 'Export report' }));

        expect(onExportClickFn).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'exportReport',
                filters: expect.objectContaining({ date_from: '2023-04-02 00:00:00', date_to: '2023-04-12 00:00:00' }),
                report: expect.objectContaining({ sel_id: 6, sel_title: 'Queued report two bindings' }),
            }),
        );
    });

    describe('validator', () => {
        const txt = locale.components.adminDashboard.tabs.reports.error;
        it('should return data if default state provided', () => {
            expect(validator({ actionState })).toEqual({
                isValid: false,
                validationErrors: {},
            });
        });

        it('should return valid state if unknown bindings provided', () => {
            const data = { ...actionState, report: { sel_bindings: [':invalid_1', ':invalid_2'] } };
            expect(validator({ actionState: data })).toEqual({
                isValid: true,
                validationErrors: {},
            });
        });

        it('should validate date_from', () => {
            const data = { ...actionState, report: { sel_bindings: [':date_from'] } };
            expect(validator({ locale: txt, actionState: data })).toEqual({
                isValid: false,
                validationErrors: {
                    date_from: 'Required',
                },
            });
        });

        it('should validate date_to', () => {
            const data = { ...actionState, report: { sel_bindings: [':date_to'] } };
            expect(validator({ locale: txt, actionState: data })).toEqual({
                isValid: false,
                validationErrors: {
                    date_to: 'Required',
                },
            });
        });

        it('should validate date_from and date_to', () => {
            const data = { ...actionState, report: { sel_bindings: [':date_from', ':date_to'] } };
            expect(validator({ locale: txt, actionState: data })).toEqual({
                isValid: false,
                validationErrors: {
                    date_from: 'Required',
                    date_to: 'Required',
                },
            });
        });

        it('should return valid system alert request with empty input', () => {
            const data = { ...actionState, report: { value: 'systemalertlog' } };

            expect(validator({ locale: txt, actionState: data })).toEqual(
                expect.objectContaining({
                    isValid: true,
                }),
            );
        });

        it('should validate invalid date_from', () => {
            const data = {
                ...actionState,
                report: { sel_bindings: [':date_from'] },
                filters: { date_from: 'invalid' },
            };
            expect(validator({ locale: txt, actionState: data })).toEqual({
                isValid: false,
                validationErrors: {
                    date_from: 'Invalid date',
                },
            });
        });

        it('should validate invalid date_to', () => {
            const data = {
                ...actionState,
                report: { sel_bindings: [':date_to'] },
                filters: { date_to: 'invalid' },
            };
            expect(validator({ locale: txt, actionState: data })).toEqual({
                isValid: false,
                validationErrors: {
                    date_to: 'Invalid date',
                },
            });
        });

        it('should validate invalid date_from and date_to', () => {
            const data = {
                ...actionState,
                report: {
                    sel_bindings: [':date_from', ':date_to'],
                },
                filters: { date_from: 'invalid', date_to: 'invalid' },
            };
            expect(validator({ locale: txt, actionState: data })).toEqual({
                isValid: false,
                validationErrors: {
                    date_from: 'Invalid date',
                    date_to: 'Invalid date',
                },
            });
        });

        it('should validate invalid date_from and date_to dependencies', () => {
            const data = {
                ...actionState,
                report: {
                    sel_bindings: [':date_from', ':date_to'],
                },
                filters: { date_from: '2024-01-10 00:00:00', date_to: '2024-01-01 23:59:59' },
            };
            expect(validator({ locale: txt, actionState: data })).toEqual({
                isValid: false,
                validationErrors: {
                    date_from: 'Must not be after "to" date',
                    date_to: 'Must not be before "from" date',
                },
            });
        });
    });
});
