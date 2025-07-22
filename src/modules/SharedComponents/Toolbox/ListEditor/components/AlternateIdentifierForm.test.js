import React from 'react';
import AlternateIdentifierForm from './AlternateIdentifierForm';
import { rtlRender, fireEvent } from 'test-utils';

const setup = (testProps = {}) => {
    const props = {
        onAdd: jest.fn(),
        locale: {
            alternateIdentifierInputFieldLabel: 'Alternate Identifier',
            alternateIdentifierInputFieldHint: 'Enter alternate identifier',
            alternateIdentifierTypeInputFieldLabel: 'Identifier Type',
            alternateIdentifierTypeInputFieldHint: 'Enter Identifier Type',
            addButtonLabel: 'Add identifier',
            editButtonLabel: 'Update identifier',
        },
        listEditorId: 'rek-alternate-identifier',
        ...testProps,
    };

    return rtlRender(<AlternateIdentifierForm {...props} />);
};

describe('AlternateIdentifierForm', () => {
    it('should render alternate identifier form with two inputs and button disabled', () => {
        const { getByTestId } = setup();
        expect(getByTestId('rek-alternate-identifier-input')).toBeVisible();
        expect(getByTestId('rek-alternate-identifier-type-select')).toBeVisible();
        expect(getByTestId('rek-alternate-identifier-add')).toHaveAttribute('disabled', '');
    });

    it('should enable "Add identifier" button if a valid id is entered', () => {
        const onAddFn = jest.fn();
        const { getByTestId, getByText } = setup({ onAdd: onAddFn });

        fireEvent.change(getByTestId('rek-alternate-identifier-input'), { target: { value: '12345' } });
        expect(getByTestId('rek-alternate-identifier-add')).not.toHaveAttribute('disabled', '');
        fireEvent.mouseDown(getByTestId('rek-alternate-identifier-type-select'));
        fireEvent.click(getByText('Serial Number'));

        fireEvent.click(getByTestId('rek-alternate-identifier-add'));
        expect(onAddFn).toHaveBeenCalledWith({ key: '12345', value: 457082 });
        // reset form
        expect(getByTestId('rek-alternate-identifier-input')).toHaveAttribute('value', '');
        expect(getByTestId('rek-alternate-identifier-type-input')).toHaveAttribute('value', '');
    });

    it('should load alternate identifier form with given values', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = setup({
            onAdd: onAddFn,
            itemSelectedToEdit: { key: '12345', value: '111' },
        });

        expect(getByTestId('rek-alternate-identifier-input')).toHaveAttribute('value', '12345');
        expect(getByTestId('rek-alternate-identifier-type-input')).toHaveAttribute('value', '111');
    });
});
