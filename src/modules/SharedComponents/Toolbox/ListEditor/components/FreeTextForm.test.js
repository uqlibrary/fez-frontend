import React from 'react';
import FreeTextForm from './FreeTextForm';
import { rtlRender, fireEvent } from 'test-utils';
import { isValidIsbn, isValidKeyword } from 'config/validation';

describe('FreeTextForm behaviour tests', () => {
    it('should display input field with add button disabled and it should be enabled as soon as user has entered valid value in text field', () => {
        const { getByTestId } = rtlRender(
            <FreeTextForm
                onAdd={jest.fn()}
                locale={{
                    id: 'free-text-input',
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                }}
                listEditorId="test"
                normalize={jest.fn(value => value)}
            />,
        );

        expect(getByTestId('add-test')).toHaveAttribute('disabled', '');

        fireEvent.change(getByTestId('free-text-input'), { target: { value: 'test' } });

        expect(getByTestId('add-test')).not.toHaveAttribute('disabled', '');
    });

    it('should display error message for ISBN if not valid, and it should enable add button only if valid ISBN is entered', () => {
        const { getByTestId, getByText, queryByText } = rtlRender(
            <FreeTextForm
                onAdd={jest.fn()}
                locale={{
                    id: 'free-text-isbn-input',
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add ISBN',
                }}
                listEditorId="test"
                isValid={isValidIsbn}
                normalize={jest.fn(value => value)}
            />,
        );

        expect(getByTestId('add-test')).toHaveAttribute('disabled', '');

        fireEvent.change(getByTestId('free-text-isbn-input'), { target: { value: 'test' } });

        expect(getByTestId('add-test')).toHaveAttribute('disabled', '');
        expect(getByText('ISBN value is not valid')).toBeVisible();

        fireEvent.change(getByTestId('free-text-isbn-input'), { target: { value: '1234567897' } });

        expect(getByTestId('add-test')).not.toHaveAttribute('disabled', '');
        expect(queryByText('ISBN value is not valid')).not.toBeInTheDocument();
    });

    it('should display maximum input length error message, and it should enable add button only if valid value is entered', () => {
        const { getByTestId, getByText, queryByText } = rtlRender(
            <FreeTextForm
                onAdd={jest.fn()}
                locale={{
                    id: 'free-text-input',
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                }}
                listEditorId="test"
                isValid={isValidKeyword(5)}
                normalize={jest.fn(value => value)}
            />,
        );

        expect(getByTestId('add-test')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('free-text-input'), { target: { value: 'testing' } });

        expect(getByTestId('add-test')).toHaveAttribute('disabled');
        expect(getByText('Limited to 5 characters')).toBeVisible();

        fireEvent.change(getByTestId('free-text-input'), { target: { value: 'test' } });

        expect(getByTestId('add-test')).not.toHaveAttribute('disabled');

        expect(queryByText('Limited to 5 characters')).not.toBeInTheDocument();
    });

    it('should display maximum input length error message for piped keywords individually, and it should enable add button only if valid value is entered', () => {
        const { getByTestId, getByText, queryByText } = rtlRender(
            <FreeTextForm
                onAdd={jest.fn()}
                locale={{
                    id: 'free-text-input',
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                }}
                listEditorId="test"
                isValid={isValidKeyword(5)}
                normalize={jest.fn(value => value)}
            />,
        );

        expect(getByTestId('add-test')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('free-text-input'), { target: { value: 'testing|test|tested' } });

        expect(getByTestId('add-test')).toHaveAttribute('disabled');
        expect(getByText('Limited to 5 characters')).toBeVisible();

        fireEvent.change(getByTestId('free-text-input'), { target: { value: 'test|tst|tested' } });
        expect(getByTestId('add-test')).toHaveAttribute('disabled');
        expect(getByText('Limited to 5 characters')).toBeVisible();

        fireEvent.change(getByTestId('free-text-input'), { target: { value: 'test|tst|teste' } });
        expect(getByTestId('add-test')).not.toHaveAttribute('disabled');
        expect(queryByText('Limited to 5 characters')).not.toBeInTheDocument();
    });

    it('should add item and clear input field', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = rtlRender(
            <FreeTextForm
                onAdd={onAddFn}
                locale={{
                    id: 'free-text-input',
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                }}
                listEditorId="test"
                normalize={value => value}
            />,
        );

        fireEvent.change(getByTestId('free-text-input'), { target: { value: 'test' } });
        expect(getByTestId('free-text-input')).toHaveAttribute('value', 'test');
        fireEvent.click(getByTestId('add-test'));

        expect(onAddFn).toHaveBeenCalledWith('test');
        expect(getByTestId('free-text-input')).toHaveAttribute('value', '');
    });

    it('should not submit form if pressed key is other than "Enter"', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = rtlRender(
            <FreeTextForm
                onAdd={onAddFn}
                locale={{
                    id: 'free-text-input',
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                }}
                listEditorId="test"
                normalize={value => value}
            />,
        );

        fireEvent.change(getByTestId('free-text-input'), { target: { value: 'test' } });
        fireEvent.keyDown(getByTestId('free-text-input'), { key: 'Esc', code: 27, charCode: 27, keyCode: 27 });

        expect(onAddFn).not.toHaveBeenCalled();
    });

    it('should render item selected to edit', () => {
        const { getByTestId, getByText, container } = rtlRender(
            <FreeTextForm
                onAdd={jest.fn()}
                locale={{
                    id: 'free-text-input',
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                    editButtonLabel: 'Edit',
                }}
                listEditorId="test"
                normalize={value => value}
            />,
        );

        expect(getByTestId('free-text-input')).toHaveAttribute('value', '');
        expect(getByTestId('add-test')).toHaveAttribute('disabled', '');
        expect(getByText('Add')).toBeVisible();

        rtlRender(
            <FreeTextForm
                onAdd={jest.fn()}
                locale={{
                    id: 'free-text-input',
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                    editButtonLabel: 'Edit',
                }}
                listEditorId="test"
                normalize={value => value}
                itemSelectedToEdit="Testing"
            />,
            { container },
        );

        expect(getByTestId('free-text-input')).toHaveAttribute('value', 'Testing');
        expect(getByTestId('add-test')).not.toHaveAttribute('disabled', '');
        expect(getByText('Edit')).toBeVisible();
    });

    it('should display remind to add text', () => {
        const { getByTestId, getByText } = rtlRender(
            <FreeTextForm
                onAdd={jest.fn()}
                locale={{
                    id: 'free-text-input',
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                    editButtonLabel: 'Edit',
                    remindToAddText: 'Please click "Add" button to add item to the list',
                }}
                listEditorId="test"
                normalize={value => value}
                remindToAdd
                isValid={jest.fn(() => undefined)}
            />,
        );

        fireEvent.change(getByTestId('free-text-input'), { target: { value: 'testing' } });
        expect(getByText('Please click "Add" button to add item to the list')).toBeVisible();
    });

    it('should display error state for the input form', () => {
        const { getByTestId } = rtlRender(
            <FreeTextForm
                onAdd={jest.fn()}
                error
                locale={{
                    id: 'free-text-input',
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                    editButtonLabel: 'Edit',
                    remindToAddText: 'Please click "Add" button to add item to the list',
                }}
                listEditorId="test"
                normalize={value => value}
                remindToAdd
                isValid={jest.fn(() => undefined)}
            />,
        );

        expect(getByTestId('free-text-input')).toHaveAttribute('aria-invalid', 'true');
        fireEvent.change(getByTestId('free-text-input'), { target: { value: 'test' } });
        expect(getByTestId('free-text-input')).toHaveAttribute('aria-invalid', 'false');
    });
});
