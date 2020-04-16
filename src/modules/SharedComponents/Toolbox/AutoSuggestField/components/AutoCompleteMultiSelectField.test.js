import React from 'react';
import AutoCompleteMultiSelectField from './AutoCompleteMultiSelectField';
import { rtlRender, fireEvent, waitFor, act } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        floatingLabelText: 'Autocomplete multi select field',
        getOptionLabel: option => option,
        id: 'autocomplete-multi-select-field',
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
            commonAncestorContainer: {
                nodeName: 'BODY',
                ownerDocument: document,
            },
        });
    });

    it('should render component and display options as you type', async() => {
        const { getByTestId, getByRole, getAllByRole } = setup({
            itemsList: ['apple', 'orange', 'pineapple', 'orange juice', 'apple juice'],
        });

        fireEvent.change(getByTestId('autocomplete-multi-select-field'), { target: { value: 'apple' } });
        const suggestions = await waitFor(() => getByRole('presentation'));

        expect(getAllByRole('option', suggestions).length).toBe(3);
        expect(getAllByRole('option')[0]).toHaveTextContent('apple');
        expect(getAllByRole('option')[1]).toHaveTextContent('pineapple');
        expect(getAllByRole('option')[2]).toHaveTextContent('apple juice');
    });

    it('should render component and select options as you type', async() => {
        const { getByTestId, getByRole, getAllByTestId } = setup({
            itemsList: ['apple', 'orange', 'pineapple', 'orange juice', 'apple juice'],
        });

        fireEvent.change(getByTestId('autocomplete-multi-select-field'), { target: { value: 'apple' } });
        let suggestions = await waitFor(() => getByRole('presentation'));
        act(() => {
            fireEvent.click(getByTestId('autocomplete-multi-select-field-option-0', suggestions));
        });

        fireEvent.change(getByTestId('autocomplete-multi-select-field'), { target: { value: 'apple' } });
        suggestions = await waitFor(() => getByRole('presentation'));
        act(() => {
            fireEvent.click(getByTestId('autocomplete-multi-select-field-option-1', suggestions));
        });

        const chips = getAllByTestId('autocomplete-multi-select-field-selected');

        expect(chips.length).toBe(2);
        expect(chips[0]).toHaveTextContent('apple');
        expect(chips[1]).toHaveTextContent('apple juice');
    });

    it('should render give option template for options', async() => {
        // eslint-disable-next-line react/prop-types
        const OptionTemplate = ({ option }) => <div id="option-template">{option}</div>;
        const { getByTestId, getByRole, getAllByTestId } = setup({
            itemsList: ['apple', 'orange', 'pineapple', 'orange juice', 'apple juice'],
            OptionTemplate,
        });

        fireEvent.change(getByTestId('autocomplete-multi-select-field'), { target: { value: 'apple' } });
        const suggestions = await waitFor(() => getByRole('presentation'));
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
        const { getAllByTestId } = setup({
            itemsList: ['apple', 'orange', 'pineapple', 'orange juice', 'apple juice'],
            defaultValue: ['orange', 'apple'],
        });

        const chips = getAllByTestId('autocomplete-multi-select-field-selected');
        expect(chips.length).toBe(2);
        expect(chips[0]).toHaveTextContent('orange');
        expect(chips[1]).toHaveTextContent('apple');
    });

    it('should load suggestions as soon as component loads', () => {
        const loadSuggestions = jest.fn();
        setup({
            loadSuggestions,
        });

        expect(loadSuggestions).toBeCalled();
    });
});
