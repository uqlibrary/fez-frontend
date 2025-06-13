import React from 'react';
import { render } from 'test-utils';

import locale from 'locale/components';

import {
    exportReportFilters,
    animationTemplate,
    isUrl,
    optionDoubleRowRender,
    getReportTypeFromValue,
    getDefaultSorting,
    getFormattedServerDate,
    dateToUtc,
    DEFAULT_DATE_FORMAT_WITH_TIME_24H_SECONDS,
} from './config';

describe('config', () => {
    it('animationTemplate', () => {
        expect(animationTemplate(1, 100, 10)).toEqual('animateFadeIn 100ms ease-out 20ms forwards');
    });

    it('isUrl', () => {
        expect(isUrl('http://library.uq.edu.au')).toBeTruthy();
        expect(isUrl('https://library.uq.edu.au')).toBeTruthy();
        expect(isUrl('library.uq.edu.au')).not.toBeTruthy();
        expect(isUrl('abc')).not.toBeTruthy();
    });

    it('optionDoubleRowRender', () => {
        const props = { id: 'test123', className: 'testClass' };
        const option = { sel_title: 'Test title', sel_description: 'Test description' };
        const { getByTestId, getByText } = render(<>{optionDoubleRowRender(props, option)}</>);
        expect(getByTestId('test123')).toBeInTheDocument();
        expect(getByText('Test title')).toBeInTheDocument();
        expect(getByText('Test description')).toBeInTheDocument();
    });

    it('getReportTypeFromValue', () => {
        expect(getReportTypeFromValue(1)).toEqual('systemalertlog');
        expect(getReportTypeFromValue(2)).toEqual('workshistory');
        expect(getReportTypeFromValue(3)).toBeUndefined();
    });

    it('getDefaultSorting', () => {
        expect(getDefaultSorting('alerts')).toEqual([{ field: 'sat_created_date', sort: 'asc' }]);
        expect(getDefaultSorting('systemalertlog')).toEqual([{ field: 'sat_created_date', sort: 'asc' }]);
        expect(getDefaultSorting('workshistory')).toEqual([{ field: 'pre_date', sort: 'asc' }]);
        expect(getDefaultSorting('invalid')).toEqual([]);
    });

    it('getFormattedServerDate', () => {
        expect(getFormattedServerDate('2023-03-04 12:00:00')).toEqual('4th March 2023');
        expect(getFormattedServerDate('2023-03-04 12:00:00', DEFAULT_DATE_FORMAT_WITH_TIME_24H_SECONDS)).toEqual(
            '4th March 2023 12:00:00',
        );
        expect(getFormattedServerDate()).toEqual('');
        expect(getFormattedServerDate('')).toEqual('');
    });

    describe('exportReportFilters', () => {
        const txt = locale.components.adminDashboard.tabs.reports;
        // const setup = (Component, testProps = {}, renderer = render) => {
        //     const props = {
        //         ...testProps,
        //     };
        //     return renderer(<Component {...props} />);
        // };
        describe('dateFrom', () => {
            const validator = ({ ...props }) =>
                exportReportFilters.date_from.validator({ locale: txt.error, ...props });

            it('validator performs as expected', () => {
                const state = {
                    report: {
                        sel_bindings: null,
                    },
                    filters: {
                        date_from: '',
                    },
                };
                // should return empty object if binding not set for this key
                expect(validator({ state })).toEqual({});
                // should require date if binding defined
                state.report.sel_bindings = [':date_from'];
                expect(validator({ state })).toEqual({ date_from: 'Required' });
                // should return error if date invalid
                state.filters.date_from = 'abc';
                expect(validator({ state })).toEqual({ date_from: 'Invalid date' });
                // should return empty object as values are valid
                state.filters.date_from = '2024-01-01T12:00:00';
                expect(validator({ state })).toEqual({});
                // date_to has to be valid and after date_to
                state.report.sel_bindings = [':date_from', ':date_to'];
                state.filters.date_to = '2023-01-01T12:00:00';
                expect(validator({ state })).toEqual({ date_from: 'Must not be after "to" date' });
                // test the default max date range of 52 weeks
                state.filters.date_to = '2025-01-01T12:00:00';
                expect(validator({ state })).toEqual({ date_to: 'Must be within 52 weeks of "from" date' });
                // test custom max date range in default range units of 'weeks'
                state.report.sel_maxDateRange = 1;
                expect(validator({ state })).toEqual({ date_to: 'Must be within 1 week of "from" date' });
                // error should adjust for different date range unit (must match moment.js values)
                expect(validator({ state, maxDateRangeUnit: 'months' })).toEqual({
                    date_to: 'Must be within 1 month of "from" date',
                });
                // error should adjust for different date range unit
                expect(validator({ state, maxDateRangeUnit: 'years' })).toEqual({
                    date_to: 'Must be within 1 year of "from" date',
                });
                // finally test a valid date range results in no errors returned
                state.filters.date_to = '2024-01-01T12:00:00';
                expect(validator({ state })).toEqual({});
            });
        });
        describe('dateTo', () => {
            const validator = ({ ...props }) => exportReportFilters.date_to.validator({ locale: txt.error, ...props });

            it('validator performs as expected', () => {
                const state = {
                    report: {
                        sel_bindings: null,
                    },
                    filters: {
                        date_to: '',
                    },
                };
                // should return empty object if binding not set for this key
                expect(validator({ state })).toEqual({});
                // should require date if binding defined
                state.report.sel_bindings = [':date_to'];
                expect(validator({ state })).toEqual({ date_to: 'Required' });
                // should return error if date invalid
                state.filters.date_to = 'abc';
                expect(validator({ state })).toEqual({ date_to: 'Invalid date' });
                // should return empty object as values are valid
                state.filters.date_to = '2024-01-01T12:00:00';
                expect(validator({ state })).toEqual({});
                // date_from has to be valid and before date_to
                state.report.sel_bindings = [':date_from', ':date_to'];
                state.filters.date_from = '2025-01-01T12:00:00';
                expect(validator({ state })).toEqual({ date_to: 'Must not be before "from" date' });
                // finally test a valid date range results in no errors returned
                state.filters.date_from = '2023-10-01T12:00:00';
                expect(validator({ state })).toEqual({});
            });
        });

        describe('dateToUtc', () => {
            it('should convert date to UTC with start of day', () => {
                const date = '2023-10-01T12:00:00';
                const result = dateToUtc({ date, dayTimeReset: 'start' });
                expect(result).toBe('2023-09-30 14:00:00'); // Adjusted for UTC conversion
            });

            it('should convert date to UTC with end of day', () => {
                const date = '2023-10-01T12:00:00';
                const result = dateToUtc({ date, dayTimeReset: 'end' });
                expect(result).toBe('2023-10-01 13:59:59'); // Adjusted for UTC conversion
            });

            it('should convert date to UTC without dayTimeReset', () => {
                const date = '2023-10-01T12:00:00';
                const result = dateToUtc({ date });
                expect(result).toBe('2023-10-01 02:00:00'); // Adjusted for UTC conversion
            });

            it('should convert date to UTC from London timezone', () => {
                const date = '2023-10-01T12:00:00';
                const result = dateToUtc({ date, timezone: 'Europe/London' });
                expect(result).toBe('2023-10-01 11:00:00'); // Adjusted for UTC conversion
            });

            it('should convert date to UTC with format', () => {
                const date = '2023-10-01T12:00:00';
                const result = dateToUtc({ date, format: DEFAULT_DATE_FORMAT_WITH_TIME_24H_SECONDS });
                expect(result).toBe('1st October 2023 02:00:00'); // Adjusted for UTC conversion with format
            });
        });
    });
});
