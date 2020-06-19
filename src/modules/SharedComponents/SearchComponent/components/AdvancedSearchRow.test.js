import React from 'react';
import AdvancedSearchRow from './AdvancedSearchRow';
import { isSame } from './AdvancedSearchRow';
import { rtlRender, fireEvent, waitFor } from 'test-utils';

const getProps = (testProps = {}) => ({
    searchField: '0',
    value: '',
    disabledFields: [],
    rowIndex: 0,
    onSearchRowChange: jest.fn(),
    onSearchRowDelete: jest.fn(),
    ...testProps,
});

function setup(testProps = {}, renderer = rtlRender) {
    return renderer(<AdvancedSearchRow {...getProps(testProps)} />);
}

describe('AdvancedSearchRow', () => {
    it('should render default view', () => {
        const { getByText } = setup();
        expect(getByText('Select a field')).toBeInTheDocument();
        expect(getByText('Please select a field to search')).toBeInTheDocument();
    });

    it('should render search field row with given disabled options', async () => {
        const { getByTestId, getByText } = setup({
            searchField: 'all',
            value: 'i feel lucky',
            disabledFields: ['0'],
        });
        expect(getByTestId('any-field-input').value).toEqual('i feel lucky');
        fireEvent.keyDown(getByTestId('field-type-selector'), { key: 'Enter', code: 13 });
        const list = await waitFor(() => getByTestId('menu-field-type-selector'));
        expect(getByText(/select a field/i, list)).toHaveClass('Mui-disabled');
    });

    it('should handle search field dropdown change', async () => {
        const testFn = jest.fn();
        const { getByTestId, getByText } = setup({ rowIndex: 1, onSearchRowChange: testFn });
        fireEvent.keyDown(getByTestId('field-type-selector'), { key: 'Enter', code: 13 });
        const list = await waitFor(() => getByTestId('menu-field-type-selector'));
        fireEvent.click(getByText(/book title for chapters/i), list);
        expect(testFn).toHaveBeenCalledWith(1, { label: '', searchField: 'rek_book_title', value: '' });
    });

    it('should handle search field text change', () => {
        const testFn = jest.fn();
        const { getByTestId } = setup({ rowIndex: 1, onSearchRowChange: testFn });
        fireEvent.change(getByTestId('initial-input'), { target: { value: 'i feel lucky' } });
        expect(testFn).toHaveBeenCalledWith(1, { searchField: '0', value: 'i feel lucky', label: '' });
    });

    it('should handle delete row', () => {
        const testFn = jest.fn();
        const { getByTestId } = setup({ rowIndex: 3, onSearchRowDelete: testFn });
        fireEvent.click(getByTestId('delete-advanced-search-row-3'));
        expect(testFn).toHaveBeenCalledWith(3);
    });

    it('should render the memoized version if props are same', () => {
        const { rerender } = setup({
            searchField: 'all',
            value: 'i feel lucky',
            disabledFields: ['0'],
        });
        setup({ searchField: 'all', value: 'i feel lucky', disabledFields: ['0'] }, rerender);
    });
});
