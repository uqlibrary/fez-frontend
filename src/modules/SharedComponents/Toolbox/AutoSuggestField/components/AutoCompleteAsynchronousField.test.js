import React from 'react';
import AutoCompleteAsynchronousField from './AutoCompleteAsynchronousField';
import { rtlRender, fireEvent, waitFor, userEvent, waitForText, waitForTextToBeRemoved } from 'test-utils';

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

        fireEvent.change(getByTestId('autocomplete-asynchronous-field-input'), { target: { value: 'apple' } });

        expect(loadSuggestionsFn).toHaveBeenCalledWith('apple');
    });

    it('should render component and select options', async () => {
        const loadSuggestionsFn = jest.fn();

        const onChangeFn = jest.fn();

        const { getByTestId, getByRole, getAllByRole, rerender } = setup({
            loadSuggestions: loadSuggestionsFn,
            onChange: onChangeFn,
        });

        fireEvent.change(getByTestId('autocomplete-asynchronous-field-input'), { target: { value: 'ap' } });

        setup({ itemsLoading: true, onChange: onChangeFn }, rerender);

        expect(getByTestId('loading-suggestions')).toBeInTheDocument();

        setup({ itemsList: ['apple', 'orange', 'banana', 'pineapple', 'pear'], onChange: onChangeFn }, rerender);

        const suggestions = await waitFor(() => getByRole('presentation'));
        const options = getAllByRole('option', suggestions);
        expect(options[0]).toHaveTextContent('apple');
        fireEvent.click(options[0]);

        expect(onChangeFn).toHaveBeenCalledWith('apple');
    });

    it('should allow free text', async () => {
        const onChangeFn = jest.fn();

        const { getByTestId, rerender } = setup({
            allowFreeText: true,
            onChange: onChangeFn,
        });

        fireEvent.change(getByTestId('autocomplete-asynchronous-field-input'), { target: { value: 'cherry' } });

        setup({ itemsList: [], onChange: onChangeFn }, rerender);

        fireEvent.keyDown(getByTestId('autocomplete-asynchronous-field-input'), { key: 'Enter', code: 13 });

        expect(onChangeFn).toHaveBeenCalledWith({ value: 'cherry' });
    });

    it('should clear the input value on clicking "Clear" button ', () => {
        const onClearFn = jest.fn();
        const { getByTestId, getByTitle } = setup({
            allowFreeText: true, // mui5 update note: this wasnt required in mui4 and i'm not sure why it's needed now
            onClear: onClearFn,
        });

        fireEvent.click(getByTestId('autocomplete-asynchronous-field-input'));
        fireEvent.change(getByTestId('autocomplete-asynchronous-field-input'), { target: { value: 'cherry' } });

        fireEvent.click(getByTitle('Clear'));
        expect(onClearFn).toBeCalled();
    });

    it('should not clear the input value on deleting input value by keyboard', () => {
        const onClearFn = jest.fn();
        const { getByTestId } = setup({
            onClear: onClearFn,
        });

        fireEvent.click(getByTestId('autocomplete-asynchronous-field-input'));
        fireEvent.change(getByTestId('autocomplete-asynchronous-field-input'), { target: { value: 'cherry' } });

        fireEvent.click(getByTestId('autocomplete-asynchronous-field-input'));
        fireEvent.change(getByTestId('autocomplete-asynchronous-field-input'), { target: { value: '' } });

        expect(onClearFn).not.toBeCalled();
    });

    it('should render given option template for options', async () => {
        // eslint-disable-next-line react/prop-types
        const OptionTemplate = ({ option }) => <div data-testid="option-template">{option}</div>;

        const { getByTestId, getByRole, getAllByTestId, rerender } = setup({});

        fireEvent.change(getByTestId('autocomplete-asynchronous-field-input'), { target: { value: 'ap' } });

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

    it('should clear the input value on deleting input value by keyboard', () => {
        const onClearFn = jest.fn();
        const { getByTestId } = setup({
            clearOnInputClear: true,
            onClear: onClearFn,
        });

        fireEvent.click(getByTestId('autocomplete-asynchronous-field-input'));
        fireEvent.change(getByTestId('autocomplete-asynchronous-field-input'), { target: { value: 'cherry' } });

        fireEvent.click(getByTestId('autocomplete-asynchronous-field-input'));
        fireEvent.change(getByTestId('autocomplete-asynchronous-field-input'), { target: { value: '' } });

        expect(onClearFn).toBeCalled();
    });

    it('should display supplemental node when provided', () => {
        const { getByText } = setup({
            supplemental: <div>hello</div>,
        });

        expect(getByText('hello')).toBeInTheDocument();
    });

    it('should not clear internal `options` state on close when clearOptionOnClose is set to false', async () => {
        const OptionTemplate = ({ option }) => <div data-testid="option-template">{option}</div>;

        const { getByTestId } = setup({
            itemsList: ['cherry', 'chevy'],
            itemsLoading: false,
            clearOptionOnClose: false,
            groupBy: () => null,
            OptionTemplate,
            getOptionLabel: () => '',
        });

        const triggerOpen = async () => {
            await userEvent.click(getByTestId('autocomplete-asynchronous-field-input'));
            await waitForText('cherry');
            await waitForText('chevy');
        };

        await triggerOpen();
        // trigger close
        await userEvent.type(getByTestId('autocomplete-asynchronous-field-input'), '[esc]');
        await waitForTextToBeRemoved('cherry');
        await waitForTextToBeRemoved('chevy');
        await triggerOpen();
    });
});
