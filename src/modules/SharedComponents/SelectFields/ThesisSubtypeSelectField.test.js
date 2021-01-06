import React from 'react';
import ThesisSubtypeSelectField from './ThesisSubtypeSelectField';
import { render, fireEvent, WithReduxStore } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        genericSelectFieldId: 'rek-genre-type',
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <ThesisSubtypeSelectField {...props} />
        </WithReduxStore>,
    );
}

describe('ThesisSubtypeSelectField', () => {
    it('should render thesis subtypes select field for redux form', () => {
        const onChangeFn = jest.fn();

        const { getByTestId, getByText, queryByText } = setup({
            input: {
                onChange: onChangeFn,
            },
            meta: {
                error: 'This field is required',
            },
            selectPrompt: 'Please select a thesis subtype',
        });

        expect(getByTestId('rek-genre-type-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-genre-type-helper-text')).toHaveTextContent('This field is required');
        expect(queryByText('Please select a thesis subtype')).not.toBeInTheDocument();

        fireEvent.mouseDown(getByTestId('rek-genre-type-select'));
        fireEvent.click(getByText('B.A. Thesis'));

        expect(onChangeFn).toHaveBeenCalledWith('B.A. Thesis');
    });

    it('should render thesis subtypes select field for advanced search', () => {
        const onChangeFn = jest.fn();

        const { getByTestId, getByText } = setup({
            onChange: onChangeFn,
            error: 'This field is required',
            selectPrompt: 'Please select a thesis subtype',
            displayEmpty: true,
            multiple: true,
            value: [],
            hideLabel: true,
            selectProps: {
                renderValue: () => 'Please select a thesis subtype',
            },
        });

        expect(getByTestId('rek-genre-type-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-genre-type-helper-text')).toHaveTextContent('This field is required');
        expect(getByText('Please select a thesis subtype')).toBeInTheDocument();

        fireEvent.mouseDown(getByTestId('rek-genre-type-select'));
        fireEvent.click(getByText('B.A. Thesis'));

        expect(onChangeFn).toHaveBeenCalledWith(['B.A. Thesis']);
    });

    it('should render given items list as thesis subtypes', () => {
        const onChangeFn = jest.fn();

        const { getByTestId, getByText, queryByText } = setup({
            input: {
                onChange: onChangeFn,
            },
            meta: {
                error: 'This field is required',
            },
            selectPrompt: 'Please select a thesis subtype',
            itemsList: [{ value: 'Test 1', text: 'Test 1' }],
        });

        expect(getByTestId('rek-genre-type-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-genre-type-helper-text')).toHaveTextContent('This field is required');
        expect(queryByText('Please select a thesis subtype')).not.toBeInTheDocument();

        fireEvent.mouseDown(getByTestId('rek-genre-type-select'));
        fireEvent.click(getByText('Test 1'));

        expect(onChangeFn).toHaveBeenCalledWith('Test 1');
    });
});
