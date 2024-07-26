import React from 'react';

import { within, render, userEvent, preview } from 'test-utils';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import * as repositories from 'repositories';
import { defaultLegacyReportOption } from '../config';
import { emptyReportActionState as defaultState } from '../reducers';

import DisplayReportInterface from './DisplayReportInterface';

const setup = (props = {}, renderer = render) => {
    const testProps = {
        id: 'testForm',
        state: { ...defaultState },
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
            const onChangeFn = jest.fn();
            const { getByTestId } = setup({
                state: {
                    ...defaultState,
                    type: 'displayReport',
                    displayReport: {
                        label: 'Works history',
                        value: 'workshistory',
                    },
                },
                onChange: onChangeFn,
            });

            expect(getByTestId('testForm-input')).toHaveValue('Works history');
            expect(getByTestId('testForm-date-from')).toHaveTextContent('Required');
            expect(getByTestId('testForm-date-from-input')).toHaveAttribute('required');
            expect(getByTestId('testForm-date-from-input').closest('div')).toHaveClass('Mui-error');
            expect(getByTestId('testForm-date-to')).toHaveTextContent('Required');
            expect(getByTestId('testForm-date-to-input')).toHaveAttribute('required');
            expect(getByTestId('testForm-date-to-input').closest('div')).toHaveClass('Mui-error');
        });

        it('should fire the change function when selecting the work history report', async () => {
            const onChangeFn = jest.fn();
            const { getAllByRole, getByRole, getByTestId } = setup({ onChange: onChangeFn });

            await userEvent.click(getByTestId('testForm-input'));
            expect(getAllByRole('option').length).toBe(2);

            await userEvent.click(getByRole('option', { name: 'Works history' }));
            expect(getByTestId('testForm-input')).toHaveValue('Works history');

            expect(onChangeFn).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'displayReport',
                    value: expect.objectContaining({ value: 'workshistory' }),
                }),
            );
        });
        it('should fire the change function when choosing dates', async () => {
            const onChangeFn = jest.fn();
            const { getByTestId } = setup({
                state: {
                    ...defaultState,
                    type: 'displayReport',
                    displayReport: {
                        label: 'Works history',
                        value: 'workshistory',
                    },
                },
                onChange: onChangeFn,
            });

            await userEvent.type(getByTestId('testForm-date-from-input'), '02/04/2023');

            expect(onChangeFn).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    type: 'fromDate',
                    value: expect.stringContaining('2023-04-02T00:00:00'),
                }),
            );

            await userEvent.type(getByTestId('testForm-date-to-input'), '01/05/2023');

            expect(onChangeFn).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    type: 'toDate',
                    value: expect.stringContaining('2023-05-01T00:00:00'),
                }),
            );
        });
        /*
        type: 'none',
    exportReport: null,
    displayReport: null,
    fromDate: null,
    toDate: null,
    systemAlertId: '',
        */
        describe('validation', () => {
            it('date to should be required', async () => {
                const onChangeFn = jest.fn();
                const { getByRole, getByTestId } = setup({
                    state: {
                        ...defaultState,
                        type: 'displayReport',
                        displayReport: {
                            label: 'Works history',
                            value: 'workshistory',
                        },
                        fromDate: '2023-04-02T00:00:00',
                    },
                    onChange: onChangeFn,
                });

                expect(getByTestId('testForm-input')).toHaveValue('Works history');

                preview.debug();
                expect(within(getByTestId('testForm-date-to')).getByText('Required')).toBeInTheDocument();

                expect(getByRole('button', { name: 'Run report' })).toHaveAttribute('disabled');
            });

            it('date from should be required', async () => {
                const onChangeFn = jest.fn();
                const { getByRole, getByTestId } = setup({
                    state: {
                        ...defaultState,
                        type: 'displayReport',
                        displayReport: {
                            label: 'Works history',
                            value: 'workshistory',
                        },
                        toDate: '2023-04-02T00:00:00',
                    },
                    onChange: onChangeFn,
                });

                expect(getByTestId('testForm-input')).toHaveValue('Works history');

                expect(within(getByTestId('testForm-date-from')).getByText('Required')).toBeInTheDocument();

                expect(getByRole('button', { name: 'Run report' })).toHaveAttribute('disabled');
            });

            it('date to is after date from', async () => {
                const onChangeFn = jest.fn();
                const { getByRole, getByTestId } = setup({
                    state: {
                        ...defaultState,
                        type: 'displayReport',
                        displayReport: {
                            label: 'Works history',
                            value: 'workshistory',
                        },
                        fromDate: '2023-04-02T00:00:00',
                        toDate: '2023-01-01T00:00:00',
                    },
                    onChange: onChangeFn,
                });

                expect(getByTestId('testForm-input')).toHaveValue('Works history');

                preview.debug();
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
                    displayReport: {
                        label: 'System alert log',
                        value: 'systemalertlog',
                    },
                },
                onChange: onChangeFn,
            });
            preview.debug();
            // in default state, all fields are optional
            expect(getByTestId('testForm-input')).toHaveValue('System alert log');
            expect(getByTestId('testForm-date-from')).not.toHaveTextContent('Required');
            expect(getByTestId('testForm-date-from-input')).not.toHaveAttribute('required');
            expect(getByTestId('testForm-date-from-input').closest('div')).not.toHaveClass('Mui-error');
            expect(getByTestId('testForm-date-to')).not.toHaveTextContent('Required');
            expect(getByTestId('testForm-date-to-input')).not.toHaveAttribute('required');
            expect(getByTestId('testForm-date-to-input').closest('div')).not.toHaveClass('Mui-error');
        });

        it('should fire the change function when selecting the system alert id', async () => {
            const onChangeFn = jest.fn();
            const { getAllByRole, getByRole, getByTestId } = setup({ onChange: onChangeFn });

            await userEvent.click(getByTestId('testForm-input'));
            expect(getAllByRole('option').length).toBe(2);

            await userEvent.click(getByRole('option', { name: 'System alert log' }));
            expect(getByTestId('testForm-input')).toHaveValue('System alert log');

            expect(onChangeFn).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    type: 'displayReport',
                    value: expect.objectContaining({ value: 'systemalertlog' }),
                }),
            );
        });

        it('should fire the change function when choosing dates', async () => {
            // hERE, update the rest of the tests for system alert log.
            // also need to add tests for firing the run report, export buttons
            const onChangeFn = jest.fn();
            const { getByTestId } = setup({
                state: {
                    ...defaultState,
                    type: 'displayReport',
                    displayReport: {
                        label: 'System alert log',
                        value: 'systemalertlog',
                    },
                },
                onChange: onChangeFn,
            });

            await userEvent.type(getByTestId('testForm-date-from-input'), '02/04/2023');

            expect(onChangeFn).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    type: 'fromDate',
                    value: expect.stringContaining('2023-04-02T00:00:00'),
                }),
            );

            await userEvent.type(getByTestId('testForm-date-to-input'), '01/05/2023');

            expect(onChangeFn).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    type: 'toDate',
                    value: expect.stringContaining('2023-05-01T00:00:00'),
                }),
            );
        });

        describe('validation', () => {
            it('should validate stuff', async () => {
                const onChangeFn = jest.fn();
                const { getAllByRole, getByRole, getByTestId } = setup({ onChange: onChangeFn });

                await userEvent.click(getByTestId('testForm-input'));
                expect(getAllByRole('option').length).toBe(2);

                await userEvent.click(getByRole('option', { name: 'Works history' }));
                expect(getByTestId('testForm-input')).toHaveValue('Works history');

                expect(onChangeFn).toHaveBeenCalledWith(
                    expect.objectContaining({
                        type: 'displayReport',
                        value: expect.objectContaining({ value: 'workshistory' }),
                    }),
                );
            });
        });
    });
});
