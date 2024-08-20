import React from 'react';
import DateRange from './DateRange';
import { rtlRender, fireEvent } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        onChange: testProps.onChange || jest.fn(),
        category: 'Display type',
        ...testProps,
    };
    return rtlRender(<DateRange {...props} />);
}

describe('Date range ', () => {
    const MockDate = require('mockdate');
    beforeEach(() => {
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
    });

    afterEach(() => {
        MockDate.reset();
    });

    it('should render empty component', () => {
        const { getByTestId } = setup();
        expect(getByTestId('expand-more-facet-category-date-range')).toBeInTheDocument();
    });

    it('should render date range form with default value', () => {
        const { getByTestId } = setup();

        expect(getByTestId('expand-more-facet-category-date-range')).toBeInTheDocument();

        fireEvent.click(getByTestId('expand-more-facet-category-date-range'));
        expect(getByTestId('from')).toHaveAttribute('value', '2010'); // 2020-10
        expect(getByTestId('to')).toHaveAttribute('value', '2025'); // 2020+5

        expect(getByTestId('expand-less-facet-category-date-range')).toBeInTheDocument();
    });

    it('should render component with values set', () => {
        const { getByTestId } = setup({
            value: {
                from: 2010,
                to: 2016,
            },
        });
        expect(getByTestId('expand-more-facet-category-date-range')).toBeInTheDocument();

        fireEvent.click(getByTestId('expand-more-facet-category-date-range'));
        expect(getByTestId('from')).toHaveAttribute('value', '2010');
        expect(getByTestId('to')).toHaveAttribute('value', '2016');
    });

    it('should render disabled component', () => {
        const { getByTestId } = setup({ disabled: true });
        expect(getByTestId('clickable-facet-category-date-range')).toHaveAttribute('aria-disabled', 'true');
    });

    it('should set state values via props', () => {
        const onChange = jest.fn();
        const { getByText, getByTestId } = setup({
            value: {
                from: 2010,
                to: 2015,
            },
            onChange,
        });

        fireEvent.click(getByTestId('expand-more-facet-category-date-range'));

        expect(getByTestId('from')).toHaveAttribute('value', '2010');
        expect(getByTestId('to')).toHaveAttribute('value', '2015');

        fireEvent.change(getByTestId('from'), { target: { value: '2010', name: 'from' } });
        fireEvent.change(getByTestId('to'), { target: { value: '2020', name: 'to' } });
        fireEvent.click(getByText(/go/i));

        expect(onChange).toHaveBeenCalledWith(
            'Display type',
            {
                from: 2010,
                to: 2020,
            },
            true,
        );
    });

    it('should call onChange when year range is reset', () => {
        const testFn = jest.fn();
        const { getByText, getByTestId } = setup({
            onChange: testFn,
            isActive: true,
            value: {
                from: 2010,
                to: 2018,
            },
        });

        fireEvent.click(getByTestId('expand-more-facet-category-date-range'));

        fireEvent.click(getByText(/2010 - 2018/i));
        expect(testFn).toHaveBeenCalledWith(
            'Display type',
            {
                from: null,
                to: null,
            },
            false,
        );
    });

    it('should call onChange when from value is deleted and submitted range', () => {
        const testFn = jest.fn();
        const { getByText, getByTestId } = setup({
            onChange: testFn,
            isActive: false,
            value: {
                from: 2010,
                to: 2018,
            },
        });

        fireEvent.click(getByTestId('expand-more-facet-category-date-range'));
        fireEvent.change(getByTestId('from'), { target: { value: '', name: 'from' } });
        fireEvent.click(getByText(/go/i));

        expect(testFn).toHaveBeenCalledWith(
            'Display type',
            {
                from: null,
                to: 2018,
            },
            true,
        );
    });

    it('should call onChange when to value is deleted and submitted range', () => {
        const testFn = jest.fn();
        const { getByText, getByTestId } = setup({
            onChange: testFn,
            value: {
                from: 2010,
                to: 2018,
            },
        });

        fireEvent.click(getByTestId('expand-more-facet-category-date-range'));
        fireEvent.change(getByTestId('to'), { target: { value: '', name: 'to' } });
        fireEvent.click(getByText(/go/i));

        expect(testFn).toHaveBeenCalledWith(
            'Display type',
            {
                from: 2010,
                to: null,
            },
            true,
        );
    });

    it('should call onChange when from and to values deleted and submitted range', () => {
        const testFn = jest.fn();
        const { getByText, getByTestId } = setup({
            onChange: testFn,
            value: {
                from: 2010,
                to: 2018,
            },
        });

        fireEvent.click(getByTestId('expand-more-facet-category-date-range'));
        fireEvent.change(getByTestId('from'), { target: { value: '', name: 'from' } });
        fireEvent.change(getByTestId('to'), { target: { value: '', name: 'to' } });
        fireEvent.click(getByText(/go/i));

        expect(testFn).toHaveBeenCalledWith(
            'Display type',
            {
                from: null,
                to: null,
            },
            true,
        );
    });
});
