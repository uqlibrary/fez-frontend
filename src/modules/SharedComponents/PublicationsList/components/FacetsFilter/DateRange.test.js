import React from 'react';
import DateRange from './DateRange';
import { rtlRender, fireEvent } from 'test-utils'

function setup(testProps, isShallow = true) {
    const props = {
        onChange: testProps.onChange || jest.fn(),
        open: testProps.open || null,
        onToggle: testProps.onToggle || jest.fn(),
        ...testProps
    };
    return rtlRender(<DateRange {...props}/>);
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
        const { asFragment } = setup({});
        expect(asFragment()).toMatchSnapshot();
    });


    it('should render date range form with default value', () => {
        const { asFragment } = setup({ open: true });
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render component with values set', () => {
        const { asFragment } = setup({
            open: true,
            value: {
                from: 2010,
                to: 2016
            }
        });
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render disabled component', () => {
        const { asFragment } = setup({open: true, disabled: true});
        expect(asFragment()).toMatchSnapshot();
    });

    it('should set state values via props', () => {
        const onChange = jest.fn();
        const { asFragment, getByLabelText, getByText } = setup({
            open: true,
            value: {
                from: 2010,
                to: 2015
            },
            onChange
        });

        expect(asFragment()).toMatchSnapshot();
        fireEvent.change(getByLabelText(/from/i), {target: { value: '2010', name: 'from'}});
        fireEvent.change(getByLabelText(/to/i), {target: { value: '2020', name: 'to'}});
        fireEvent.click(getByText(/go/i));
        expect(onChange).toHaveBeenCalledWith({
            from: 2010,
            to: 2020
        });
        expect(asFragment()).toMatchSnapshot();
    });

    it('should call onChange when year range is reset', () => {
        const testFn = jest.fn();
        const { asFragment, getByText } = setup({
            onChange: testFn,
            open: true,
            isActive: true,
            value: {
                from: 2010,
                to: 2018
            }
        });

        fireEvent.click(getByText(/2010 - 2018/i));
        expect(testFn).toHaveBeenCalledWith({
            from: null,
            to: null
        });
        expect(asFragment()).toMatchSnapshot();
    });
    it('should call onChange when from value is deleted and submitted range', () => {
        const testFn = jest.fn();
        const { getByText, getByLabelText } = setup({
            onChange: testFn,
            open: true,
            isActive: false,
            value: {
                from: 2010,
                to: 2018
            }
        });

        fireEvent.change(getByLabelText(/from/i), {target: { value: '', name: 'from'}});
        fireEvent.click(getByText(/go/i));

        expect(testFn).toHaveBeenCalledWith({
            from: null,
            to: 2018
        });
        expect(getByText("* - 2018")).toBeInTheDocument();
    });

    it('should call onChange when to value is deleted and submitted range', () => {
        const testFn = jest.fn();
        const { getByText, getByLabelText } = setup({
            onChange: testFn,
            open: true,
            isActive: false,
            value: {
                from: 2010,
                to: 2018
            }
        });

        fireEvent.change(getByLabelText(/to/i), {target: { value: '', name: 'to'}});
        fireEvent.click(getByText(/go/i));

        expect(testFn).toHaveBeenCalledWith({
            from: 2010,
            to: null
        });
        expect(getByText("2010 - *")).toBeInTheDocument();
    });

    it('should call onChange when from and to values deleted and submitted range', () => {
        const testFn = jest.fn();
        const { getByText, getByLabelText } = setup({
            onChange: testFn,
            open: true,
            isActive: false,
            value: {
                from: 2010,
                to: 2018
            }
        });

        fireEvent.change(getByLabelText(/from/i), {target: { value: '', name: 'from'}});
        fireEvent.change(getByLabelText(/to/i), {target: { value: '', name: 'to'}});
        fireEvent.click(getByText(/go/i));

        expect(testFn).toHaveBeenCalledWith({
            from: null,
            to: null
        });
        expect(getByText("* - *")).toBeInTheDocument();
    });
});
