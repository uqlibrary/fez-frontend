import React from 'react';
import { rtlRender, fireEvent } from 'test-utils';
import PublicationYearRangeField from './PublicationYearRangeField';

function setup(testProps = {}) {
    const props = {
        updateYearRangeFilter: jest.fn(),
        classes: {},
        ...testProps,
    };

    return rtlRender(<PublicationYearRangeField {...props} />);
}

describe('Component PublicationYearRangeField', () => {
    it('should render as expected', () => {
        const { getByTestId } = setup({
            className: 'advancedSearchYearFilter',
            yearFilter: {
                from: 1999,
                invalid: false,
                to: 2001,
            },
            disabled: false,
        });
        expect(getByTestId('from')).toBeInTheDocument();
        expect(getByTestId('to')).toBeInTheDocument();
        expect(getByTestId('from').value).toEqual('1999');
        expect(getByTestId('to').value).toEqual('2001');
    });

    it('should render help text when needed', () => {
        const { getByText } = setup({
            invalid: true,
        });
        expect(getByText('Invalid year range')).toBeInTheDocument();
    });

    it('should return values as expect for a valid setValue', () => {
        const updateMock = jest.fn();
        const { getByTestId } = setup({
            updateYearRangeFilter: updateMock,
            className: 'advancedSearchYearFilter',
            yearFilter: { from: 1999, invalid: false, to: 2001 },
            disabled: false,
        });
        fireEvent.change(getByTestId('from'), { target: { value: 1000 } });
        expect(updateMock).toBeCalledWith({ from: 1000, invalid: false, to: 2001 });
    });

    it('should return values as expected for an invalid setValue', () => {
        const updateMock = jest.fn();
        const { getByTestId } = setup({
            updateYearRangeFilter: updateMock,
            className: 'advancedSearchYearFilter',
            yearFilter: { from: 1999, invalid: false, to: 2001 },
            disabled: false,
        });

        fireEvent.change(getByTestId('from'), { target: { value: 'hello100' } });
        expect(updateMock).toBeCalledWith({ from: 100, invalid: false, to: 2001 });

        fireEvent.change(getByTestId('from'), { target: { value: '100hello' } });
        expect(updateMock).toBeCalledWith({ from: 100, invalid: false, to: 2001 });

        fireEvent.change(getByTestId('from'), { target: { value: '1100' } });
        expect(updateMock).toBeCalledWith({ from: 1100, invalid: false, to: 2001 });

        fireEvent.change(getByTestId('from'), { target: { value: '' } });
        expect(updateMock).toBeCalledWith({ from: 100, invalid: false, to: 2001 });

        fireEvent.change(getByTestId('from'), { target: { value: '10001' } });
        expect(updateMock).toBeCalledWith({ from: 10001, invalid: true, to: 2001 });

        fireEvent.change(getByTestId('to'), { target: { value: '1990' } });
        expect(updateMock).toBeCalledWith({ from: 1999, invalid: true, to: 1990 });

        fireEvent.change(getByTestId('to'), { target: { value: '10001' } });
        expect(updateMock).toBeCalledWith({ from: 1999, invalid: true, to: 10001 });
    });
});
