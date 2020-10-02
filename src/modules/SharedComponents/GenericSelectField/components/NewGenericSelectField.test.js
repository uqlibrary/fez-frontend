import React from 'react';
import { render, fireEvent, AllTheProviders } from 'test-utils';
import NewGenericSelectField from './NewGenericSelectField';

function setup(testProps = {}) {
    const props = {
        value: testProps.multiple ? [-1] : -1,
        selectPrompt: 'Please select an option',
        itemsLoading: false,
        loadingHint: 'Loading items...',
        genericSelectFieldId: 'rek-test',
        ...testProps,
    };

    return render(
        <AllTheProviders>
            <NewGenericSelectField {...props} />
        </AllTheProviders>,
    );
}

describe('NewGenericSelectField', () => {
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
        });

        expect(getByTestId('rek-test-select')).toHaveTextContent('Please select an option');
    });

    it('should render select field and options as plain options', () => {
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
        });

        expect(getByTestId('rek-test-select')).toHaveTextContent('Please select an option');
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
            error: true,
            errorText: 'This field is required',
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
            value: [],
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
        });

        expect(getByTestId('rek-test-select')).toHaveTextContent('Loading items...');
        expect(loadItemsList).toHaveBeenCalled();
    });
});
