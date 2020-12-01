import React from 'react';
import AccessSelectorField from './AccessSelectorField';
import { render, fireEvent, WithReduxStore } from 'test-utils';
import { DATASET_ACCESS_CONDITIONS_OPTIONS } from 'config/general';
import { FILE_ACCESS_OPTIONS } from 'modules/SharedComponents/Toolbox/FileUploader';

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
    it('should render access condtions for Data collection', () => {
        const onChangeFn = jest.fn();

        const { getByTestId, getByText, queryByText } = setup({
            input: {
                onChange: onChangeFn,
            },
            meta: {
                error: 'This field is required',
            },
            selectPrompt: 'Please select a access condition',
            itemsList: DATASET_ACCESS_CONDITIONS_OPTIONS,
            formHelperTextProps: {},
        });

        expect(getByTestId('rek-file-access-condition-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-file-access-condition-helper-text')).toHaveTextContent('This field is required');
        expect(queryByText('Please select a access condition')).not.toBeInTheDocument();

        fireEvent.mouseDown(getByTestId('rek-file-access-condition-select'));
        fireEvent.click(getByText('Open Access'));

        expect(onChangeFn).toHaveBeenCalledWith(453619);
    });

    it('should render access conditions for file uploader', () => {
        const onChangeFn = jest.fn();

        const { getByTestId, getByText } = setup({
            onChange: onChangeFn,
            error: 'This field is required',
            selectPrompt: 'Please select a access condition',
            displayEmpty: true,
            hideLabel: true,
            itemsList: FILE_ACCESS_OPTIONS,
        });

        expect(getByTestId('rek-file-access-condition-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-file-access-condition-helper-text')).toHaveTextContent('This field is required');
        expect(getByText('Please select a access condition')).toBeInTheDocument();

        fireEvent.mouseDown(getByTestId('rek-file-access-condition-select'));
        fireEvent.click(getByText('Open Access'));

        expect(onChangeFn).toHaveBeenCalledWith(5);
    });

    it('should render given items list as access conditions', () => {
        const onChangeFn = jest.fn();

        const { getByTestId, getByText, queryByText } = setup({
            input: {
                onChange: onChangeFn,
            },
            meta: {
                error: 'This field is required',
            },
            selectPrompt: 'Please select a access condition',
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
