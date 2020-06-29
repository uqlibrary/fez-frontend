import React from 'react';
import AutoCompleteSelectField from './AutoCompleteSelectField';
import { rtlRender, fireEvent, waitFor, act } from 'test-utils';

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        floatingLabelText: 'Autocomplete select field',
        getOptionLabel: option => option,
        loadSuggestions: jest.fn(),
        autoCompleteSelectFieldId: 'autocomplete-select-field',
        itemsList: [],
        itemsLoading: false,
        onChange: jest.fn(),
        onClear: jest.fn(),
        OptionTemplate: null,
        required: true,
        allowFreeText: false,
        filterOptions: jest.fn(options => options),
        ...testProps,
    };

    return renderer(<AutoCompleteSelectField {...props} />);
}

describe('AutoCompleteSelectField component', () => {
    beforeEach(() => {
        document.createRange = () => ({
            setStart: () => {},
            setEnd: () => {},
            commonAncestorContainer: {
                nodeName: 'BODY',
                ownerDocument: document,
            },
        });
    });

    it('should render component and display options when user types in the input', async () => {
        const { getByTestId, getByRole, getAllByRole } = setup({
            itemsList: ['apple', 'orange', 'banana', 'pineapple', 'pear'],
        });

        act(() => {
            fireEvent.change(getByTestId('autocomplete-select-field-input'), { target: { value: 'apple' } });
        });

        const suggestions = await waitFor(() => getByRole('presentation'));
        expect(getAllByRole('option', suggestions).length).toBe(2);
        expect(getByTestId('autocomplete-select-field-option-0')).toHaveTextContent('apple');
        expect(getByTestId('autocomplete-select-field-option-1')).toHaveTextContent('pineapple');
    });

    it('should render component and select options', async () => {
        const onChangeFn = jest.fn();

        const { getByTestId, getByRole } = setup({
            onChange: onChangeFn,
            itemsList: ['apple', 'orange', 'banana', 'pineapple', 'pear'],
        });

        act(() => {
            fireEvent.change(getByTestId('autocomplete-select-field-input'), { target: { value: 'an' } });
        });

        const suggestions = await waitFor(() => getByRole('presentation'));

        act(() => {
            fireEvent.click(getByTestId('autocomplete-select-field-option-0', suggestions));
        });

        expect(onChangeFn).toHaveBeenCalledWith('orange');
    });

    it('should allow free text', async () => {
        const onChangeFn = jest.fn();

        const { getByTestId } = setup({
            allowFreeText: true,
            onChange: onChangeFn,
        });

        act(() => {
            fireEvent.change(getByTestId('autocomplete-select-field-input'), { target: { value: 'cherry' } });
        });

        act(() => {
            fireEvent.keyDown(getByTestId('autocomplete-select-field-input'), { key: 'Enter', code: 13 });
        });

        expect(onChangeFn).toHaveBeenCalledWith({ value: 'cherry' });
    });

    it('should display error text', () => {
        const { getByText } = setup({
            error: true,
            errorText: 'Please select some value',
        });

        expect(getByText('Please select some value')).toBeInTheDocument();
    });
});
