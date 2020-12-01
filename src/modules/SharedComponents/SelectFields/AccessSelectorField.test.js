import React from 'react';
import AccessSelectorField from './AccessSelectorField';
import { render, fireEvent, WithReduxStore } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        genericSelectFieldId: 'rek-file-access-condition',
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <AccessSelectorField {...props} />
        </WithReduxStore>,
    );
}

describe('AccessSelectorField', () => {
    it('should render status select field for redux form', () => {
        const onChangeFn = jest.fn();

        const { getByTestId, getByText, queryByText } = setup({
            input: {
                onChange: onChangeFn,
            },
            meta: {
                error: 'This field is required',
            },
            selectPrompt: 'Please select a status',
        });

        expect(getByTestId('rek-file-access-condition-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-file-access-condition-helper-text')).toHaveTextContent('This field is required');
        expect(queryByText('Please select a status')).not.toBeInTheDocument();

        fireEvent.mouseDown(getByTestId('rek-file-access-condition-select'));
        fireEvent.click(getByText('In Review'));

        expect(onChangeFn).toHaveBeenCalledWith('In Review');
    });

    it('should render status select field for advanced search', () => {
        const onChangeFn = jest.fn();

        const { getByTestId, getByText } = setup({
            onChange: onChangeFn,
            error: 'This field is required',
            selectPrompt: 'Please select a status',
            displayEmpty: true,
            hideLabel: true,
            selectProps: {
                renderValue: () => 'Please select a status',
            },
        });

        expect(getByTestId('rek-file-access-condition-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-file-access-condition-helper-text')).toHaveTextContent('This field is required');
        expect(getByText('Please select a status')).toBeInTheDocument();

        fireEvent.mouseDown(getByTestId('rek-file-access-condition-select'));
        fireEvent.click(getByText('In Review'));

        expect(onChangeFn).toHaveBeenCalledWith('In Review');
    });

    it('should render given items list as statuss', () => {
        const onChangeFn = jest.fn();

        const { getByTestId, getByText, queryByText } = setup({
            input: {
                onChange: onChangeFn,
            },
            meta: {
                error: 'This field is required',
            },
            selectPrompt: 'Please select a status',
            itemsList: [{ value: 'Test 1', text: 'Test 1' }],
        });

        expect(getByTestId('rek-file-access-condition-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-file-access-condition-helper-text')).toHaveTextContent('This field is required');
        expect(queryByText('Please select a status')).not.toBeInTheDocument();

        fireEvent.mouseDown(getByTestId('rek-file-access-condition-select'));
        fireEvent.click(getByText('Test 1'));

        expect(onChangeFn).toHaveBeenCalledWith('Test 1');
    });
});
