import React from 'react';
import { render } from 'test-utils';

import { animationTemplate, isUrl, optionDoubleRowRender, getReportTypeFromValue, getDefaultSorting } from './config';

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
        expect(getReportTypeFromValue(3)).toEqual('workiddupe');
        expect(getReportTypeFromValue(4)).toEqual('scopusiddupe');
        expect(getReportTypeFromValue(5)).toEqual('doidupe');
        expect(getReportTypeFromValue(6)).toBeUndefined();
    });

    it('getDefaultSorting', () => {
        expect(getDefaultSorting('alerts')).toEqual([{ field: 'sat_created_date', sort: 'asc' }]);
        expect(getDefaultSorting('systemalertlog')).toEqual([{ field: 'sat_created_date', sort: 'asc' }]);
        expect(getDefaultSorting('workshistory')).toEqual([{ field: 'pre_date', sort: 'asc' }]);
        expect(getDefaultSorting('invalid')).toEqual([]);
    });
});
