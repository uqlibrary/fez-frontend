import React from 'react';
import AutoCompleteMultiSelectField from './AutoCompleteMultiSelectField';
import { rtlRender, fireEvent, waitFor, act } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        floatingLabelText: 'Autocomplete multi select field',
        getOptionLabel: option => option,
        id: 'test-autocomplete',
        autoCompleteMultiSelectFieldId: 'test-autocomplete',
        itemsList: [],
        onChange: jest.fn(),
        OptionTemplate: null,
        required: true,
        ...testProps,
    };

    return rtlRender(<AutoCompleteMultiSelectField {...props} />);
}

describe('AutoCompleteMultiSelectField component', () => {
    beforeEach(() => {
        document.createRange = () => ({
            setStart: () => {},
            setEnd: () => {},
            toLowerCase: () => {},
            commonAncestorContainer: {
                nodeName: 'BODY',
                ownerDocument: document,
            },
        });
    });

    it('should render component and display options as you type', async () => {
        const { getByTestId, getAllByRole } = setup({
            itemsList: ['apple', 'orange', 'pineapple', 'orange juice', 'apple juice'],
        });

        fireEvent.change(getByTestId('test-autocomplete-input'), { target: { value: 'apple' } });
        const suggestions = await waitFor(() => getByTestId('test-autocomplete-options'));

        expect(getAllByRole('option', suggestions).length).toBe(3);
        expect(getAllByRole('option')[0]).toHaveTextContent('apple');
        expect(getAllByRole('option')[1]).toHaveTextContent('pineapple');
        expect(getAllByRole('option')[2]).toHaveTextContent('apple juice');
    });

    it('should render component and select options', async () => {
        const { getByTestId } = setup({
            itemsList: ['apple', 'orange', 'pineapple', 'orange juice', 'apple juice'],
        });

        fireEvent.change(getByTestId('test-autocomplete-input'), { target: { value: 'apple' } });
        let suggestions = await waitFor(() => getByTestId('test-autocomplete-options'));
        act(() => {
            fireEvent.click(getByTestId('test-autocomplete-option-0', suggestions));
        });

        fireEvent.change(getByTestId('test-autocomplete-input'), { target: { value: 'apple' } });
        suggestions = await waitFor(() => getByTestId('test-autocomplete-options'));
        act(() => {
            fireEvent.click(getByTestId('test-autocomplete-option-1', suggestions));
        });

        expect(getByTestId('test-autocomplete-0')).toHaveTextContent('apple');
        expect(getByTestId('test-autocomplete-1')).toHaveTextContent('apple juice');
    });

    it('should render component and select options when the options are objects', async () => {
        const { getByTestId } = setup({
            itemsList: [
                { rek_title: 'apple' },
                { rek_title: 'orange' },
                { rek_title: 'pineapple' },
                { rek_title: 'orange juice' },
                { rek_title: 'apple juice' },
            ],
            getOptionLabel: option => option.rek_title,
        });

        fireEvent.change(getByTestId('test-autocomplete-input'), { target: { value: 'apple' } });
        let suggestions = await waitFor(() => getByTestId('test-autocomplete-options'));
        act(() => {
            fireEvent.click(getByTestId('test-autocomplete-option-0', suggestions));
        });

        fireEvent.change(getByTestId('test-autocomplete-input'), { target: { value: 'apple' } });
        suggestions = await waitFor(() => getByTestId('test-autocomplete-options'));
        act(() => {
            fireEvent.click(getByTestId('test-autocomplete-option-1', suggestions));
        });

        expect(getByTestId('test-autocomplete-0')).toHaveTextContent('apple');
        expect(getByTestId('test-autocomplete-1')).toHaveTextContent('apple juice');
    });

    it('should render give option template for options', async () => {
        // eslint-disable-next-line react/prop-types
        const OptionTemplate = ({ option }) => <div id="option-template">{option}</div>;
        const { getByTestId, getAllByTestId } = setup({
            itemsList: ['apple', 'orange', 'pineapple', 'orange juice', 'apple juice'],
            OptionTemplate,
        });

        fireEvent.change(getByTestId('test-autocomplete-input'), { target: { value: 'apple' } });
        const suggestions = await waitFor(() => getByTestId('test-autocomplete-options'));
        expect(getAllByTestId('option-template', suggestions).length).toBe(3);
    });

    it('should display error text', () => {
        const { getByText } = setup({
            itemsList: ['apple', 'orange', 'pineapple', 'orange juice', 'apple juice'],
            error: true,
            errorText: 'Please select some value',
        });

        expect(getByText('Please select some value')).toBeInTheDocument();
    });

    it('should display selected options as chips from default value given', () => {
        const { getByTestId } = setup({
            itemsList: ['apple', 'orange', 'pineapple', 'orange juice', 'apple juice'],
            defaultValue: ['orange', 'apple'],
        });

        expect(getByTestId('test-autocomplete-0')).toHaveTextContent('orange');
        expect(getByTestId('test-autocomplete-1')).toHaveTextContent('apple');
    });

    it('should load suggestions as soon as component loads', () => {
        const loadSuggestions = jest.fn();
        setup({
            loadSuggestions,
        });

        expect(loadSuggestions).toBeCalled();
    });
});
