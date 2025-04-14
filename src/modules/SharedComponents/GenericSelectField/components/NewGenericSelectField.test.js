import React from 'react';
import { rtlRender, fireEvent } from 'test-utils';
import NewGenericSelectField from './NewGenericSelectField';
import Immutable from 'immutable';

function setup(testProps = {}, render = rtlRender) {
    const props = {
        value: !testProps.input && testProps.multiple ? [] : '',
        selectPrompt: 'Please select an option',
        itemsLoading: false,
        loadingHint: 'Loading items...',
        genericSelectFieldId: 'rek-test',
        ...testProps,
    };

    return render(<NewGenericSelectField {...props} />);
}

describe('NewGenericSelectField', () => {
    it('should render with default props', () => {
        const { container } = rtlRender(<NewGenericSelectField genericSelectFieldId={'test'} />);
        expect(container).toMatchSnapshot();
    });

    it('should render select field', () => {
        const { getByTestId } = setup({
            itemsList: [
                {
                    text: 'Option 1',
                    value: 1,
                },
                {
                    text: 'Option 2',
                    value: 2,
                },
            ],
            displayEmpty: true,
        });

        expect(getByTestId('rek-test-select')).toHaveTextContent('Please select an option');
    });

    it('should render select field with selected value', () => {
        const { getByTestId } = setup({
            itemsList: [
                {
                    text: 'Option 1',
                    value: 1,
                },
                {
                    text: 'Option 2',
                    value: 2,
                },
            ],
            value: 1,
            displayEmpty: true,
        });

        expect(getByTestId('rek-test-select')).toHaveTextContent('Option 1');
    });

    it('should render select field with multiple selected value', () => {
        const { getByTestId } = setup({
            itemsList: [
                {
                    text: 'Option 1',
                    value: 1,
                },
                {
                    text: 'Option 2',
                    value: 2,
                },
                {
                    text: 'Option 3',
                    value: 3,
                },
            ],
            value: [1, 3],
            multiple: true,
            displayEmpty: true,
        });

        expect(getByTestId('rek-test-select')).toHaveTextContent('Option 1, Option 3');
    });

    it('should render select field for redux-form field', () => {
        const { getByTestId } = setup({
            itemsList: [
                {
                    text: 'Option 1',
                    value: 1,
                },
                {
                    text: 'Option 2',
                    value: 2,
                },
            ],
            input: {
                value: 2,
            },
            displayEmpty: true,
        });

        expect(getByTestId('rek-test-select')).toHaveTextContent('Option 2');
    });

    it('should render select field for redux-form field for multiple flag', () => {
        const { getByTestId } = setup({
            itemsList: [
                {
                    text: 'Option 1',
                    value: 1,
                },
                {
                    text: 'Option 2',
                    value: 2,
                },
            ],
            input: {
                value: Immutable.List([2]),
            },
            multiple: true,
            displayEmpty: true,
        });

        expect(getByTestId('rek-test-select')).toHaveTextContent('Option 2');
    });

    it('should display error for redux-form field', () => {
        const { getByTestId } = setup({
            itemsList: [
                {
                    text: 'Option 1',
                    value: 1,
                },
                {
                    text: 'Option 2',
                    value: 2,
                },
            ],
            meta: {
                error: 'This field is required',
            },
            displayEmpty: true,
        });

        expect(getByTestId('rek-test-helper-text')).toHaveTextContent('This field is required');
    });

    it('should select an option', () => {
        const onChange = jest.fn();
        const { getByTestId, getByText } = setup({
            itemsList: [
                {
                    text: 'Option 1',
                    value: 1,
                },
                {
                    text: 'Option 2',
                    value: 2,
                },
            ],
            onChange,
        });

        fireEvent.mouseDown(getByTestId('rek-test-select'));
        expect(getByTestId('rek-test-options')).toBeInTheDocument();

        fireEvent.click(getByText('Option 1'));
        expect(onChange).toHaveBeenCalledWith(1);
    });

    it('should select an option for redux-form field', () => {
        const onChange = jest.fn();
        const { getByTestId, getByText } = setup({
            itemsList: [
                {
                    text: 'Option 1',
                    value: 1,
                },
                {
                    text: 'Option 2',
                    value: 2,
                },
            ],
            input: {
                onChange,
            },
        });

        fireEvent.mouseDown(getByTestId('rek-test-select'));
        expect(getByTestId('rek-test-options')).toBeInTheDocument();

        fireEvent.click(getByText('Option 1'));
        expect(onChange).toHaveBeenCalledWith(1);
    });

    it('should not be able to select options in disabled mode', () => {
        const onChange = jest.fn();
        const { getByTestId, queryByTestId } = setup({
            disabled: true,
            itemsList: [
                {
                    text: 'Option 1',
                    value: 1,
                },
                {
                    text: 'Option 2',
                    value: 2,
                },
            ],
            onChange,
        });

        expect(getByTestId('rek-test-select')).toHaveClass('Mui-disabled');
        fireEvent.mouseDown(getByTestId('rek-test-select'));
        expect(queryByTestId('rek-test-options')).not.toBeInTheDocument();
    });

    it('should display error', () => {
        const onChange = jest.fn();
        const { getByTestId } = setup({
            error: 'This field is required',
            itemsList: [
                {
                    text: 'Option 1',
                    value: 1,
                },
                {
                    text: 'Option 2',
                    value: 2,
                },
            ],
            onChange,
            formHelperTextProps: {},
        });

        expect(getByTestId('rek-test-helper-text')).toHaveTextContent('This field is required');
    });

    it('should allow multiple options to select', () => {
        const onChange = jest.fn();
        const { getByTestId, getByText } = setup({
            multiple: true,
            itemsList: [
                {
                    text: 'Option 1',
                    value: 1,
                },
                {
                    text: 'Option 2',
                    value: 2,
                },
            ],
            onChange,
            hideLabel: true,
            value: [],
            selectProps: {},
        });

        fireEvent.mouseDown(getByTestId('rek-test-select'));
        fireEvent.click(getByText('Option 1'));
        expect(onChange).toHaveBeenCalledWith([1]);
        expect(getByTestId('rek-test-options')).toBeInTheDocument();

        fireEvent.click(getByText('Option 2'));
        expect(onChange).toHaveBeenCalledWith([2]);
        expect(getByTestId('rek-test-options')).toBeInTheDocument();
    });

    it('should show loading hint while loading items', () => {
        const loadItemsList = jest.fn();
        const { getByTestId } = setup({
            loadItemsList: loadItemsList,
            itemsLoading: true,
            itemsList: [],
            displayEmpty: true,
        });

        expect(getByTestId('rek-test-select')).toHaveTextContent('Loading items...');
        expect(loadItemsList).toHaveBeenCalled();
    });
});
