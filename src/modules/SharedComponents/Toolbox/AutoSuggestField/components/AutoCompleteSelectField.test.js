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
    it('should render component and display options when user types in the input', async () => {
        const { getByTestId, getByRole, getAllByRole } = setup({
            itemsList: ['apple', 'orange', 'banana', 'pineapple', 'pear'],
        });

        act(() => {
            fireEvent.click(getByTestId('autocomplete-select-field-input'));
            fireEvent.change(getByTestId('autocomplete-select-field-input'), { target: { value: 'apple' } });
        });

        const suggestions = await waitFor(() => getByRole('presentation'));
        const options = getAllByRole('option', suggestions);
        expect(options.length).toBe(2);
        expect(options[0]).toHaveTextContent('apple');
        expect(options[1]).toHaveTextContent('pineapple');
    });

    it('should render component and select options', async () => {
        const onChangeFn = jest.fn();

        const { getByTestId, getByRole, getAllByRole } = setup({
            onChange: onChangeFn,
            itemsList: ['apple', 'orange', 'banana', 'pineapple', 'pear'],
        });

        fireEvent.click(getByTestId('autocomplete-select-field-input'));
        fireEvent.change(getByTestId('autocomplete-select-field-input'), { target: { value: 'an' } });

        const suggestions = await waitFor(() => getByRole('presentation'));
        const options = getAllByRole('option', suggestions);
        expect(options.length).toBe(2);
        expect(options[0]).toHaveTextContent('orange');
        fireEvent.click(options[0]);

        expect(onChangeFn).toHaveBeenCalledWith('orange');
    });

    it('should allow free text', async () => {
        const onChangeFn = jest.fn();

        const { getByTestId } = setup({
            allowFreeText: true,
            onChange: onChangeFn,
        });

        act(() => {
            fireEvent.click(getByTestId('autocomplete-select-field-input'));
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

    it('should clear the input value on clicking "Clear" button ', () => {
        const onClearFn = jest.fn();
        const { getByTestId, getByTitle } = setup({
            allowFreeText: true,
            clearable: true,
            onClear: onClearFn,
        });

        act(() => {
            fireEvent.click(getByTestId('autocomplete-select-field-input'));
            fireEvent.change(getByTestId('autocomplete-select-field-input'), { target: { value: 'cherry' } });
        });

        act(() => {
            fireEvent.click(getByTitle('Clear'));
        });

        expect(onClearFn).toBeCalled();
    });

    it('should clear the input value on deleting input value by keyboard', () => {
        const onClearFn = jest.fn();
        const { getByTestId } = setup({
            clearOnInputClear: true,
            onClear: onClearFn,
        });

        act(() => {
            fireEvent.click(getByTestId('autocomplete-select-field-input'));
            fireEvent.change(getByTestId('autocomplete-select-field-input'), { target: { value: 'cherry' } });
        });

        act(() => {
            fireEvent.click(getByTestId('autocomplete-select-field-input'));
            fireEvent.change(getByTestId('autocomplete-select-field-input'), { target: { value: '' } });
        });

        expect(onClearFn).toBeCalled();
    });

    it('correctly matches options with the same value but different object references', async () => {
        // Setup with options that have the same values but are different object references
        const itemsList = [
            { id: 1, value: 'apple', label: 'Apple' },
            { id: 2, value: 'banana', label: 'Banana' },
            { id: 3, value: 'orange', label: 'Orange' },
        ];

        // Create a different object reference with the same value
        const defaultValue = { id: 99, value: 'apple', label: 'Selected Apple' };

        // Mock the change handler to verify value equality
        const onChangeMock = jest.fn();

        // Render the component
        const { getByTestId, getByText } = setup({
            autoCompleteSelectFieldId: 'test-select',
            getOptionLabel: option => option.label || '',
            itemsList,
            defaultValue,
            onChange: onChangeMock,
        });

        // Open the dropdown
        const inputElement = getByTestId('test-select-input');
        fireEvent.mouseDown(inputElement);

        // Wait for dropdown to appear
        await waitFor(() => {
            expect(getByTestId('test-select-options')).toBeInTheDocument();
        });

        // Verify the apple option is highlighted/selected in the dropdown
        // despite being a different object reference
        const appleOption = getByText('Apple');
        expect(appleOption.closest('li')).toHaveAttribute('aria-selected', 'true');

        // Select the orange option
        const orangeOption = getByText('Orange');
        fireEvent.click(orangeOption);

        // Verify onChange was called with the orange option
        expect(onChangeMock).toHaveBeenCalledWith(expect.objectContaining({ value: 'orange' }));

        // Reset and try with the original apple option
        onChangeMock.mockClear();

        // Reopen dropdown
        fireEvent.mouseDown(inputElement);

        // Select the apple option again
        await waitFor(() => {
            expect(getByText('Apple')).toBeInTheDocument();
        });
        fireEvent.click(getByText('Apple'));

        // Verify onChange was called with apple option
        expect(onChangeMock).toHaveBeenCalledWith(expect.objectContaining({ value: 'apple' }));
    });
});
