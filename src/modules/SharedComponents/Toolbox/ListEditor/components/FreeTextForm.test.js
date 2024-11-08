import React from 'react';
import FreeTextForm from './FreeTextForm';
import { rtlRender, fireEvent, userEvent, screen } from 'test-utils';
import { isValidIsbn, isValidKeyword } from 'config/validation';

describe('FreeTextForm behaviour tests', () => {
    const clearInput = async testId => {
        await userEvent.clear(screen.getByTestId(testId));
        expect(screen.getByTestId(testId)).toHaveValue('');
    };

    it('should display input field with add button disabled and it should be enabled as soon as user has entered valid value in text field', () => {
        const { getByTestId } = rtlRender(
            <FreeTextForm
                onAdd={jest.fn()}
                locale={{
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                }}
                listEditorId="test"
                normalize={jest.fn(value => value)}
                mode="add"
            />,
        );

        expect(getByTestId('test-add')).toHaveAttribute('disabled', '');

        fireEvent.change(getByTestId('test-input'), { target: { value: 'test' } });

        expect(getByTestId('test-add')).not.toHaveAttribute('disabled', '');
    });

    it('should display error message for ISBN if not valid, and it should enable add button only if valid ISBN is entered', () => {
        const { getByTestId, getByText, queryByText } = rtlRender(
            <FreeTextForm
                onAdd={jest.fn()}
                locale={{
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add ISBN',
                }}
                listEditorId="isbn"
                isValid={isValidIsbn}
                normalize={jest.fn(value => value)}
                mode="add"
            />,
        );

        expect(getByTestId('isbn-add')).toHaveAttribute('disabled', '');

        fireEvent.change(getByTestId('isbn-input'), { target: { value: 'test' } });

        expect(getByTestId('isbn-add')).toHaveAttribute('disabled', '');
        expect(getByText('ISBN value is not valid')).toBeVisible();

        fireEvent.change(getByTestId('isbn-input'), { target: { value: '1234567897' } });

        expect(getByTestId('isbn-add')).not.toHaveAttribute('disabled', '');
        expect(queryByText('ISBN value is not valid')).not.toBeInTheDocument();
    });

    it('should display maximum input length error message, and it should enable add button only if valid value is entered', () => {
        const { getByTestId, getByText, queryByText } = rtlRender(
            <FreeTextForm
                onAdd={jest.fn()}
                locale={{
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                }}
                listEditorId="test"
                isValid={isValidKeyword(5)}
                normalize={jest.fn(value => value)}
                mode="add"
            />,
        );

        expect(getByTestId('test-add')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('test-input'), { target: { value: 'testing' } });

        expect(getByTestId('test-add')).toHaveAttribute('disabled');
        expect(getByText('Limited to 5 characters')).toBeVisible();

        fireEvent.change(getByTestId('test-input'), { target: { value: 'test' } });

        expect(getByTestId('test-add')).not.toHaveAttribute('disabled');

        expect(queryByText('Limited to 5 characters')).not.toBeInTheDocument();
    });

    it('should display maximum input length error message for piped keywords individually, and it should enable add button only if valid value is entered', () => {
        const { getByTestId, getByText, queryByText } = rtlRender(
            <FreeTextForm
                onAdd={jest.fn()}
                locale={{
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                }}
                listEditorId="test"
                isValid={isValidKeyword(5)}
                normalize={jest.fn(value => value)}
                mode="add"
            />,
        );

        expect(getByTestId('test-add')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('test-input'), { target: { value: 'testing|test|tested' } });

        expect(getByTestId('test-add')).toHaveAttribute('disabled');
        expect(getByText('Limited to 5 characters')).toBeVisible();

        fireEvent.change(getByTestId('test-input'), { target: { value: 'test|tst|tested' } });
        expect(getByTestId('test-add')).toHaveAttribute('disabled');
        expect(getByText('Limited to 5 characters')).toBeVisible();

        fireEvent.change(getByTestId('test-input'), { target: { value: 'test|tst|teste' } });
        expect(getByTestId('test-add')).not.toHaveAttribute('disabled');
        expect(queryByText('Limited to 5 characters')).not.toBeInTheDocument();
    });

    it('should add item and clear input field', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = rtlRender(
            <FreeTextForm
                onAdd={onAddFn}
                locale={{
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                }}
                listEditorId="test"
                normalize={value => value}
                mode="add"
            />,
        );

        fireEvent.change(getByTestId('test-input'), { target: { value: 'test' } });
        expect(getByTestId('test-input')).toHaveAttribute('value', 'test');
        fireEvent.click(getByTestId('test-add'));

        expect(onAddFn).toHaveBeenCalledWith('test');
        expect(getByTestId('test-input')).toHaveAttribute('value', '');
    });

    it('should not submit form if pressed key is other than "Enter"', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = rtlRender(
            <FreeTextForm
                onAdd={onAddFn}
                locale={{
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                }}
                listEditorId="test"
                normalize={value => value}
            />,
        );

        fireEvent.change(getByTestId('test-input'), { target: { value: 'test' } });
        fireEvent.keyDown(getByTestId('test-input'), { key: 'Esc', code: 27, charCode: 27, keyCode: 27 });

        expect(onAddFn).not.toHaveBeenCalled();
    });

    it('should render item selected to edit', () => {
        const { getByTestId, getByText, container } = rtlRender(
            <FreeTextForm
                onAdd={jest.fn()}
                locale={{
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                    editButtonLabel: 'Edit',
                }}
                listEditorId="test"
                normalize={value => value}
                mode="add"
            />,
        );

        expect(getByTestId('test-input')).toHaveAttribute('value', '');
        expect(getByTestId('test-add')).toHaveAttribute('disabled', '');
        expect(getByText('Add')).toBeVisible();

        rtlRender(
            <FreeTextForm
                onAdd={jest.fn()}
                locale={{
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                    editButtonLabel: 'Edit',
                }}
                listEditorId="test"
                normalize={value => value}
                itemSelectedToEdit="Testing"
                mode="update"
            />,
            { container },
        );

        expect(getByTestId('test-input')).toHaveAttribute('value', 'Testing');
        expect(getByTestId('test-update')).not.toHaveAttribute('disabled', '');
        expect(getByText('Edit')).toBeVisible();
    });

    it('should display remind to add text', () => {
        const { getByTestId, getByText } = rtlRender(
            <FreeTextForm
                onAdd={jest.fn()}
                locale={{
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

        fireEvent.change(getByTestId('test-input'), { target: { value: 'testing' } });
        expect(getByText('Please click "Add" button to add item to the list')).toBeVisible();
    });

    it('should display error state for the input form', () => {
        const { getByTestId } = rtlRender(
            <FreeTextForm
                onAdd={jest.fn()}
                error
                locale={{
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

        expect(getByTestId('test-input')).toHaveAttribute('aria-invalid', 'true');
        fireEvent.change(getByTestId('test-input'), { target: { value: 'test' } });
        expect(getByTestId('test-input')).toHaveAttribute('aria-invalid', 'false');
    });

    it('should only allow adding new items on enter key or by pressing add button for valid values', async () => {
        const items = [];
        const { getByTestId, getByText, queryByText } = rtlRender(
            <FreeTextForm
                onAdd={value => items.push(value)}
                locale={{
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                }}
                listEditorId="test"
                isValid={isValidKeyword(5)}
                normalize={jest.fn(value => value)}
                mode="add"
            />,
        );

        await userEvent.type(getByTestId('test-input'), 'testing{enter}');
        expect(getByTestId('test-add')).toHaveAttribute('disabled');
        expect(getByText('Limited to 5 characters')).toBeVisible();
        expect(items).toHaveLength(0);

        await clearInput('test-input');

        await userEvent.type(getByTestId('test-input'), 'test{enter}');
        expect(items).toEqual(['test']);

        await clearInput('test-input');

        await userEvent.type(getByTestId('test-input'), 'cats');
        expect(getByTestId('test-add')).not.toHaveAttribute('disabled');
        expect(queryByText('Limited to 5 characters')).not.toBeInTheDocument();
        await userEvent.click(getByTestId('test-add'));
        expect(items).toEqual(['test', 'cats']);
    });
});
