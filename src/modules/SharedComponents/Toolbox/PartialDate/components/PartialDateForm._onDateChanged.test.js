import React from 'react';
import { PartialDateForm } from './PartialDateForm';
import { rtlRender, fireEvent } from 'test-utils';

function setup(testProps) {
    const props = {
        partialDateFormId: 'test',
        classes: {
            fakeTitle: {},
        },
        ...testProps,
    };
    return rtlRender(<PartialDateForm {...props} />);
}

describe('PartialDateForm unit tests', () => {
    it('should handle year values', () => {
        const props = {
            allowPartial: true,
        };

        const { getByTestId } = setup(props);
        fireEvent.change(getByTestId('test-year-input'), { target: { value: '2015' } });
        expect(getByTestId('test-year-input').value).toEqual('2015');
        fireEvent.change(getByTestId('test-year-input'), { target: { value: undefined } });
        expect(getByTestId('test-year-input').value).toEqual('2015');
        fireEvent.change(getByTestId('test-year-input'), { target: { value: '' } });
        expect(getByTestId('test-year-input').value).toEqual('');
    });

    it('should handle month values', () => {
        const props = {
            allowPartial: true,
        };

        const { getByTestId, getByRole } = setup(props);
        fireEvent.mouseDown(getByTestId('test-month-select'));
        fireEvent.click(getByRole('option', { name: 'May' }));

        expect(getByTestId('test-month-input').value).toEqual('4');

        fireEvent.mouseDown(getByTestId('test-month-select'));
        fireEvent.click(getByRole('option', { name: 'Month' }));

        expect(getByTestId('test-month-input').value).toEqual('-1');
    });

    it('should handle day values', () => {
        const props = {
            allowPartial: true,
        };

        const { getByTestId } = setup(props);
        fireEvent.change(getByTestId('test-day-input'), { target: { value: '29' } });
        expect(getByTestId('test-day-input').value).toEqual('29');
        fireEvent.change(getByTestId('test-day-input'), { target: { value: undefined } });
        expect(getByTestId('test-day-input').value).toEqual('29');
        fireEvent.change(getByTestId('test-day-input'), { target: { value: '' } });
        expect(getByTestId('test-day-input').value).toEqual('');
    });
});
