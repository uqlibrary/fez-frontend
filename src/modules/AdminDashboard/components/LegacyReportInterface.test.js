import React from 'react';

import { render, userEvent } from 'test-utils';

import * as repositories from 'repositories';
import { defaultLegacyReportOption } from '../config';
import { adminDashboardConfig } from 'mock/data/testing/adminDashboard';
import LegacyReportInterface from './LegacyReportInterface';

const setup = (props = {}, renderer = render) => {
    const testProps = {
        id: 'testForm',
        items: adminDashboardConfig.legacy_reports,
        ...props,
    };
    return renderer(<LegacyReportInterface {...testProps} />);
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

    it('should call change function when option selected', async () => {
        const onReportChangeFn = jest.fn();
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_EXPORT_REPORT_API({ id: 1 }).apiUrl).reply(200, { data: {} });

        const { getAllByRole, getByTestId } = setup({ onReportChange: onReportChangeFn });

        await userEvent.click(getByTestId('testForm-input'));
        expect(getAllByRole('option').length).toBe(4);

        await userEvent.click(getByTestId('testForm-option-0', { hidden: true }));

        expect(getByTestId('testForm-input')).toHaveValue('Wok ID dups');

        expect(onReportChangeFn).toHaveBeenCalled();
    });

    it('should call report function when export button pressed', async () => {
        const onExportClickFn = jest.fn();
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_EXPORT_REPORT_API({ id: 1 }).apiUrl).reply(200, { data: {} });

        const { getByRole, getByTestId } = setup({
            exportReport: { sel_id: 1, sel_title: 'Wok ID dups' },
            onExportClick: onExportClickFn,
        });

        expect(getByTestId('testForm-input')).toHaveValue('Wok ID dups');

        expect(getByRole('button', { name: 'Export report' })).not.toHaveAttribute('disabled');

        await userEvent.click(getByRole('button', { name: 'Export report' }));

        expect(onExportClickFn).toHaveBeenCalledWith(1);
    });
});
