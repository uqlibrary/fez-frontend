import React from 'react';
import { render } from 'test-utils';

import {
    animationTemplate,
    isUrl,
    optionDoubleRowRender,
    getReportTypeFromValue,
    getDefaultSorting,
    getFormattedServerDate,
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
});
