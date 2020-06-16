import React from 'react';
import AutoCompleteAsynchronousField from './AutoCompleteAsynchronousField';
import { rtlRender, fireEvent, waitFor, act } from 'test-utils';

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        floatingLabelText: 'Autocomplete asynchronous field',
        getOptionLabel: option => option,
        loadSuggestions: jest.fn(),
        id: 'autocomplete-asynchronous-field',
        autoCompleteAsynchronousFieldId: 'autocomplete-asynchronous-field',
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

    return renderer(<AutoCompleteAsynchronousField {...props} />);
}

describe('AutoCompleteAsynchronousField component', () => {
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

    it('should render component and trigger callback when user types some value in the input', async () => {
        const loadSuggestionsFn = jest.fn();
        const { getByTestId } = setup({
            loadSuggestions: loadSuggestionsFn,
        });

        act(() => {
            fireEvent.change(getByTestId('autocomplete-asynchronous-field-input'), { target: { value: 'apple' } });
        });

        expect(loadSuggestionsFn).toHaveBeenCalledWith('apple');
    });

    it('should render component and select options', async () => {
        const loadSuggestionsFn = jest.fn();

        const onChangeFn = jest.fn();

        const { getByTestId, getByRole, rerender } = setup({
            loadSuggestions: loadSuggestionsFn,
            onChange: onChangeFn,
        });

        act(() => {
            fireEvent.change(getByTestId('autocomplete-asynchronous-field-input'), { target: { value: 'ap' } });
        });

        setup({ itemsLoading: true, onChange: onChangeFn }, rerender);

        expect(getByTestId('loading-suggestions')).toBeInTheDocument();

        setup({ itemsList: ['apple', 'orange', 'banana', 'pineapple', 'pear'], onChange: onChangeFn }, rerender);

        const suggestions = await waitFor(() => getByRole('presentation'));
        act(() => {
            fireEvent.click(getByTestId('autocomplete-asynchronous-field-option-0', suggestions));
        });

        expect(onChangeFn).toHaveBeenCalledWith('apple');
    });

    it('should allow free text', async () => {
        const onChangeFn = jest.fn();

        const { getByTestId, rerender } = setup({
            allowFreeText: true,
            onChange: onChangeFn,
        });

        act(() => {
            fireEvent.change(getByTestId('autocomplete-asynchronous-field-input'), { target: { value: 'cherry' } });
        });

        setup({ itemsList: [], onChange: onChangeFn }, rerender);

        act(() => {
            fireEvent.keyDown(getByTestId('autocomplete-asynchronous-field-input'), { key: 'Enter', code: 13 });
        });

        expect(onChangeFn).toHaveBeenCalledWith({ value: 'cherry' });
    });

    it('should clear the input value on clicking "Clear" button ', () => {
        const onClearFn = jest.fn();
        const { getByTestId, getByTitle } = setup({
            onClear: onClearFn,
        });

        act(() => {
            fireEvent.change(getByTestId('autocomplete-asynchronous-field-input'), { target: { value: 'cherry' } });
        });

        act(() => {
            fireEvent.click(getByTitle('Clear'));
        });

        expect(onClearFn).toBeCalled();
    });

    it('should clear the input value on deleting input value by keyboard', () => {
        const onClearFn = jest.fn();
        const { getByTestId } = setup({
            onClear: onClearFn,
        });

        act(() => {
            fireEvent.change(getByTestId('autocomplete-asynchronous-field-input'), { target: { value: 'cherry' } });
        });

        act(() => {
            fireEvent.change(getByTestId('autocomplete-asynchronous-field-input'), { target: { value: '' } });
        });

        expect(onClearFn).toBeCalled();
    });

    it('should render give option template for options', async () => {
        // eslint-disable-next-line react/prop-types
        const OptionTemplate = ({ option }) => <div id="option-template">{option}</div>;

        const { getByTestId, getByRole, getAllByTestId, rerender } = setup({});

        act(() => {
            fireEvent.change(getByTestId('autocomplete-asynchronous-field-input'), { target: { value: 'ap' } });
        });

        setup({ itemsLoading: true }, rerender);

        expect(getByTestId('loading-suggestions')).toBeInTheDocument();

        setup({ itemsList: ['apple', 'orange', 'banana', 'pineapple', 'pear'], OptionTemplate }, rerender);

        const suggestions = await waitFor(() => getByRole('presentation'));
        expect(getAllByTestId('option-template', suggestions).length).toBe(5);
    });

    it('should display error text', () => {
        const { getByText } = setup({
            error: true,
            errorText: 'Please select some value',
        });

        expect(getByText('Please select some value')).toBeInTheDocument();
    });
});
