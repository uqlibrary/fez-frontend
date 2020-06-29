import React from 'react';
import LinkInfoForm from './LinkInfoForm';
import { rtlRender, fireEvent } from 'test-utils';

const setup = (testProps = {}) => {
    const props = {
        onAdd: jest.fn(),
        locale: {
            linkInputFieldLabel: 'Link',
            linkInputFieldHint: 'Enter link',
            descriptionInputFieldLabel: 'Description',
            descriptionInputFieldHint: 'Enter description',
            addButtonLabel: 'Add link',
            editButtonLabel: 'Update link',
        },
        listEditorId: 'rek-link',
        ...testProps,
    };

    return rtlRender(<LinkInfoForm {...props} />);
};

describe('LinkInfoForm', () => {
    it('should render link info form with two inputs and button disabled', () => {
        const { getByTestId } = setup();
        expect(getByTestId('rek-link-input')).toBeVisible();
        expect(getByTestId('rek-link-description-input')).toBeVisible();
        expect(getByTestId('add-items')).toHaveAttribute('disabled', '');
    });

    it('should enable "Add link" button if valid link is entered', () => {
        const { getByTestId } = setup();

        fireEvent.change(getByTestId('rek-link-input'), { target: { value: 'http://test.com' } });
        expect(getByTestId('add-items')).not.toHaveAttribute('disabled', '');
    });

    it('should display error message if link is not valid', () => {
        const { getByTestId, getByText } = setup();

        fireEvent.change(getByTestId('rek-link-input'), { target: { value: 'test.com' } });
        expect(getByText('URL is not valid')).toBeVisible();
        expect(getByTestId('add-items')).toHaveAttribute('disabled', '');
    });

    it('should add link info and reset form if link is valid and "Enter" is pressed', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = setup({ onAdd: onAddFn });

        fireEvent.change(getByTestId('rek-link-input'), { target: { value: 'http://test.com' } });
        fireEvent.change(getByTestId('rek-link-description-input'), { target: { value: 'test description' } });
        fireEvent.keyDown(getByTestId('rek-link-description-input'), { key: 'Enter', code: 13 });

        expect(onAddFn).toHaveBeenCalledWith({ key: 'http://test.com', value: 'test description' });
        expect(getByTestId('rek-link-input')).toHaveAttribute('value', '');
        expect(getByTestId('rek-link-description-input')).toHaveAttribute('value', '');
    });

    it('should not submit link info form if link is not valid and "Enter" is pressed', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = setup({ onAdd: onAddFn });

        fireEvent.change(getByTestId('rek-link-input'), { target: { value: 'test.com' } });
        fireEvent.change(getByTestId('rek-link-description-input'), { target: { value: 'test description' } });
        fireEvent.keyDown(getByTestId('rek-link-description-input'), { key: 'Enter', code: 13 });

        expect(onAddFn).not.toHaveBeenCalled();
    });

    it('should not submit link info form if link is valid and "Esc" is pressed', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = setup({ onAdd: onAddFn });

        fireEvent.change(getByTestId('rek-link-input'), { target: { value: 'http://test.com' } });
        fireEvent.change(getByTestId('rek-link-description-input'), { target: { value: 'test description' } });
        fireEvent.keyDown(getByTestId('rek-link-description-input'), { key: 'Esc', code: 27 });

        expect(onAddFn).not.toHaveBeenCalled();
    });

    it('should load link info form with give link info values', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = setup({
            onAdd: onAddFn,
            itemSelectedToEdit: { key: 'http://test.com', value: 'test description' },
        });

        expect(getByTestId('rek-link-input')).toHaveAttribute('value', 'http://test.com');
        expect(getByTestId('rek-link-description-input')).toHaveAttribute('value', 'test description');
    });
});
