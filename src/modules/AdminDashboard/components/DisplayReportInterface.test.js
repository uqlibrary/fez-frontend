import React from 'react';

import { within, render, userEvent } from 'test-utils';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { emptyReportActionState as defaultState } from '../reducers';

import DisplayReportInterface from './DisplayReportInterface';

const setup = (props = {}, renderer = render) => {
    const testProps = {
        id: 'testForm',
        exportDisabled: true,
        ...props,
    };
    return renderer(
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-au">
            <DisplayReportInterface {...testProps} />
        </LocalizationProvider>,
    );
};

describe('DisplayReportInterface', () => {
    beforeEach(() => {
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
        jest.clearAllMocks();
    });

    const selectReport = async (reportName, accessors) => {
        await userEvent.click(accessors.getByTestId('testForm-input'));

        expect(accessors.getAllByRole('option').length).toBe(2);

        await userEvent.click(accessors.getByRole('option', { name: reportName }));
        expect(accessors.getByTestId('testForm-input')).toHaveValue(reportName);
    };

    it('should render', async () => {
        const { getByTestId, getByRole } = setup();

        expect(getByTestId('testForm-input')).toBeInTheDocument();
        expect(getByTestId('testForm-date-from-input')).toHaveAttribute('disabled');
        expect(getByTestId('testForm-date-to-input')).toHaveAttribute('disabled');
        expect(getByRole('button', { name: 'Run report' })).toHaveAttribute('disabled');
        expect(getByRole('button', { name: 'Export' })).toHaveAttribute('disabled');
    });

    describe('Works history report', () => {
        it('should render fields in default state', async () => {
            const accessors = setup();
            await selectReport('Works history', accessors);
            const { getByTestId } = accessors;
            expect(getByTestId('testForm-date-from')).toHaveTextContent('Required');
            expect(getByTestId('testForm-date-from-input')).toHaveAttribute('required');
            expect(getByTestId('testForm-date-from-input').closest('div')).toHaveClass('Mui-error');
            expect(getByTestId('testForm-date-to')).toHaveTextContent('Required');
            expect(getByTestId('testForm-date-to-input')).toHaveAttribute('required');
            expect(getByTestId('testForm-date-to-input').closest('div')).toHaveClass('Mui-error');
        });

        it('should not disable date fields if system id provided', async () => {
            const accessors = setup();
            await selectReport('System alert log', accessors);
            await userEvent.type(accessors.getByTestId('testForm-system-alert-id-input'), '123');
            await selectReport('Works history', accessors);
            const { getByTestId } = accessors;
            expect(getByTestId('testForm-input')).toHaveValue('Works history');
            expect(getByTestId('testForm-date-from-input')).not.toHaveAttribute('disabled');
            expect(getByTestId('testForm-date-to-input')).not.toHaveAttribute('disabled');
        });

        it('should select dates', async () => {
            const accessors = setup();

            await selectReport('Works history', accessors);

            const { getByTestId } = accessors;

            await userEvent.type(getByTestId('testForm-date-from-input'), '02/04/2023');

            expect(getByTestId('testForm-date-from-input')).toHaveValue('02/04/2023');

            await userEvent.type(getByTestId('testForm-date-to-input'), '01/05/2023');
            expect(getByTestId('testForm-date-to-input')).toHaveValue('01/05/2023');
        });

        it('should call the report function', async () => {
            const onReportClickFn = jest.fn();
            const accessors = setup({
                onReportClick: onReportClickFn,
            });
            await selectReport('Works history', accessors);

            const { getByTestId, getByRole } = accessors;
            await userEvent.type(getByTestId('testForm-date-from-input'), '01/01/2023');
            await userEvent.type(getByTestId('testForm-date-to-input'), '02/04/2023');

            await userEvent.click(getByRole('button', { name: 'Run report' }));
            expect(onReportClickFn).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'displayReport',
                    report: expect.objectContaining({
                        label: 'Works history',
                        value: 'workshistory',
                    }),
                    filters: expect.objectContaining({
                        date_from: '2023-01-01',
                        date_to: '2023-04-02',
                    }),
                }),
            );
        });

        describe('validation', () => {
            it('date to should be required', async () => {
                const accessors = setup();
                await selectReport('Works history', accessors);
                const { getByRole, getByTestId } = accessors;

                await userEvent.type(getByTestId('testForm-date-from-input'), '02/04/2023');
                expect(within(getByTestId('testForm-date-to')).getByText('Required')).toBeInTheDocument();

                expect(getByRole('button', { name: 'Run report' })).toHaveAttribute('disabled');
            });

            it('date from should be required', async () => {
                const accessors = setup();
                await selectReport('Works history', accessors);
                const { getByRole, getByTestId } = accessors;

                await userEvent.type(getByTestId('testForm-date-to-input'), '02/04/2023');
                expect(within(getByTestId('testForm-date-from')).getByText('Required')).toBeInTheDocument();

                expect(getByRole('button', { name: 'Run report' })).toHaveAttribute('disabled');
            });

            it('date to is after date from', async () => {
                const accessors = setup();
                await selectReport('Works history', accessors);
                const { getByRole, getByTestId } = accessors;

                await userEvent.type(getByTestId('testForm-date-from-input'), '02/04/2023');
                await userEvent.type(getByTestId('testForm-date-to-input'), '01/01/2023');

                expect(
                    within(getByTestId('testForm-date-from')).getByText('Must not be after "to" date'),
                ).toBeInTheDocument();

                expect(getByRole('button', { name: 'Run report' })).toHaveAttribute('disabled');
            });
        });
    });
    describe('System alerts log', () => {
        it('should render fields in default state', async () => {
            const onChangeFn = jest.fn();
            const { getByTestId } = setup({
                state: {
                    ...defaultState,
                    type: 'displayReport',
                    report: {
                        label: 'System alert log',
                        value: 'systemalertlog',
                    },
                },
                onChange: onChangeFn,
            });

            // in default state, all fields are optional
            expect(getByTestId('testForm-date-from')).not.toHaveTextContent('Required');
            expect(getByTestId('testForm-date-from-input')).not.toHaveAttribute('required');
            expect(getByTestId('testForm-date-from-input').closest('div')).not.toHaveClass('Mui-error');
            expect(getByTestId('testForm-date-to')).not.toHaveTextContent('Required');
            expect(getByTestId('testForm-date-to-input')).not.toHaveAttribute('required');
            expect(getByTestId('testForm-date-to-input').closest('div')).not.toHaveClass('Mui-error');
        });

        it('should disable dates if system id defined', async () => {
            const accessors = setup();
            await selectReport('System alert log', accessors);
            await userEvent.type(accessors.getByTestId('testForm-system-alert-id-input'), '123');
            const { getByTestId } = accessors;
            expect(getByTestId('testForm-system-alert-id-input')).not.toHaveAttribute('disabled');
            expect(getByTestId('testForm-date-to-input')).toHaveAttribute('disabled');
            expect(getByTestId('testForm-date-from-input')).toHaveAttribute('disabled');
        });

        it('should select dates', async () => {
            const accessors = setup();

            await selectReport('System alert log', accessors);

            const { getByTestId } = accessors;

            await userEvent.type(getByTestId('testForm-date-from-input'), '02/04/2023');

            expect(getByTestId('testForm-date-from-input')).toHaveValue('02/04/2023');

            await userEvent.type(getByTestId('testForm-date-to-input'), '01/05/2023');
            expect(getByTestId('testForm-date-to-input')).toHaveValue('01/05/2023');
        });

        it('should call the report function', async () => {
            const onReportClickFn = jest.fn();
            const accessors = setup({
                onReportClick: onReportClickFn,
            });
            await selectReport('System alert log', accessors);

            const { getByTestId, getByRole } = accessors;
            await userEvent.type(getByTestId('testForm-date-from-input'), '01/01/2023');
            await userEvent.type(getByTestId('testForm-date-to-input'), '02/04/2023');

            await userEvent.click(getByRole('button', { name: 'Run report' }));
            expect(onReportClickFn).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'displayReport',
                    report: expect.objectContaining({
                        label: 'System alert log',
                        value: 'systemalertlog',
                    }),
                    filters: expect.objectContaining({
                        date_from: '2023-01-01',
                        date_to: '2023-04-02',
                        record_id: '',
                    }),
                }),
            );
        });

        describe('validation', () => {
            it('date to should be required', async () => {
                const accessors = setup();
                await selectReport('System alert log', accessors);
                const { getByRole, getByTestId } = accessors;

                await userEvent.type(getByTestId('testForm-date-from-input'), '02/04/2023');
                expect(within(getByTestId('testForm-date-to')).getByText('Required')).toBeInTheDocument();

                expect(getByRole('button', { name: 'Run report' })).toHaveAttribute('disabled');
            });

            it('date from should be required', async () => {
                const accessors = setup();
                await selectReport('System alert log', accessors);
                const { getByRole, getByTestId } = accessors;

                await userEvent.type(getByTestId('testForm-date-to-input'), '02/04/2023');
                expect(within(getByTestId('testForm-date-from')).getByText('Required')).toBeInTheDocument();

                expect(getByRole('button', { name: 'Run report' })).toHaveAttribute('disabled');
            });

            it('date to is after date from', async () => {
                const accessors = setup();
                await selectReport('System alert log', accessors);
                const { getByRole, getByTestId } = accessors;

                await userEvent.type(getByTestId('testForm-date-from-input'), '02/04/2023');
                await userEvent.type(getByTestId('testForm-date-to-input'), '01/01/2023');

                expect(
                    within(getByTestId('testForm-date-from')).getByText('Must not be after "to" date'),
                ).toBeInTheDocument();

                expect(getByRole('button', { name: 'Run report' })).toHaveAttribute('disabled');
            });
        });
    });
});
