import React from 'react';
import UnpublishedStatusField from './UnpublishedStatusField';
import { render, fireEvent, WithReduxStore } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        genericSelectFieldId: 'rek-status',
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <UnpublishedStatusField {...props} />
        </WithReduxStore>,
    );
}

describe('UnpublishedStatusField', () => {
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

        expect(getByTestId('rek-status-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-status-helper-text')).toHaveTextContent('This field is required');
        expect(queryByText('Please select a status')).not.toBeInTheDocument();

        fireEvent.mouseDown(getByTestId('rek-status-select'));
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

        expect(getByTestId('rek-status-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-status-helper-text')).toHaveTextContent('This field is required');
        expect(getByText('Please select a status')).toBeInTheDocument();

        fireEvent.mouseDown(getByTestId('rek-status-select'));
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

        expect(getByTestId('rek-status-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-status-helper-text')).toHaveTextContent('This field is required');
        expect(queryByText('Please select a status')).not.toBeInTheDocument();

        fireEvent.mouseDown(getByTestId('rek-status-select'));
        fireEvent.click(getByText('Test 1'));

        expect(onChangeFn).toHaveBeenCalledWith('Test 1');
    });
});
