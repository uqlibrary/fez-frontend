import React from 'react';
import DateRangeField from './DateRangeField';
import { GENERIC_DATE_FORMAT } from 'config/general';
import { rtlRender, fireEvent, act } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        disabled: false,
        locale: {},
        format: GENERIC_DATE_FORMAT,
        from: '',
        to: '',
        onChange: jest.fn(),
        disableFuture: false,
        ...testProps,
    };

    return rtlRender(<DateRangeField {...props} />);
}

describe('DateRangeField component', () => {
    it('should render with default props', () => {
        const { container } = rtlRender(<DateRangeField onChange={jest.fn()} />);
        expect(container).toMatchSnapshot();
    });

    it('should render default view', () => {
        const { getByTestId } = setup({ id: 'test-date-range' });
        expect(getByTestId('test-date-range-from-date')).toBeInTheDocument();
        expect(getByTestId('test-date-range-to-date')).toBeInTheDocument();
    });

    it('should render disabled view', () => {
        const { getByTestId } = setup({ disabled: true, id: 'test-date-range' });
        expect(getByTestId('test-date-range-from-date').disabled).toBeTruthy();
        expect(getByTestId('test-date-range-to-date')).toBeTruthy();
    });

    it('should display error for "from" date for invalid date input', () => {
        const { getByTestId, getByText } = setup({ id: 'test-date-range' });
        fireEvent.change(getByTestId('test-date-range-from-date'), { target: { value: '10/13/2010' } });
        expect(getByText('Please provide valid date')).toBeInTheDocument();
    });

    it('should display error for "to" date for invalid date input', () => {
        const { getByTestId, getByText } = setup({ id: 'test-date-range' });
        fireEvent.change(getByTestId('test-date-range-to-date'), { target: { value: '10/13/2010' } });
        expect(getByText('Please provide valid date')).toBeInTheDocument();
    });

    it('should display error for date range if both dates are valid but invalid range', () => {
        const { getByTestId, getByText } = setup({ id: 'test-date-range' });

        act(() => {
            fireEvent.change(getByTestId('test-date-range-from-date'), { target: { value: '10/10/2010' } });
        });

        act(() => {
            fireEvent.change(getByTestId('test-date-range-to-date'), { target: { value: '10/09/2010' } });
        });

        expect(getByText('Please provide valid date range')).toBeInTheDocument();
    });

    it('should not call onChange callback if one of the values (from/to) is missing', () => {
        const onChangeFn = jest.fn();
        const { getByTestId } = setup({ id: 'test-date-range', onChange: onChangeFn });
        fireEvent.change(getByTestId('test-date-range-from-date'), { target: { value: '10/10/2010' } });
        expect(onChangeFn).not.toBeCalled();
    });

    it('should call onChange once both date are entered in the range', () => {
        const onChangeFn = jest.fn();
        const { getByTestId } = setup({ id: 'test-date-range', onChange: onChangeFn });
        act(() => {
            fireEvent.change(getByTestId('test-date-range-from-date'), { target: { value: '10/10/2010' } });
        });

        act(() => {
            fireEvent.change(getByTestId('test-date-range-to-date'), { target: { value: '10/11/2010' } });
        });

        expect(onChangeFn).toHaveBeenCalled();
    });
});
