import React from 'react';
import LinkInfoForm from './LinkInfoForm';
import { rtlRender, fireEvent } from 'test-utils';

describe('LinkInfoForm', () => {
    it('should render link info form with two inputs and button disabled', () => {
        const { getByTestId } = rtlRender(
            <LinkInfoForm
                onAdd={jest.fn()}
                locale={{
                    linkInputFieldLabel: 'Link',
                    linkInputFieldHint: 'Enter link',
                    descriptionInputFieldLabel: 'Description',
                    descriptionInputFieldHint: 'Enter description',
                    addButtonLabel: 'Add link',
                    editButtonLabel: 'Update link',
                }}
            />,
        );
        expect(getByTestId('link-info-link')).toBeVisible();
        expect(getByTestId('link-info-description')).toBeVisible();
        expect(getByTestId('add-items')).toHaveAttribute('disabled', '');
    });

    it('should enable "Add link" button if valid link is entered', () => {
        const { getByTestId } = rtlRender(
            <LinkInfoForm
                onAdd={jest.fn()}
                locale={{
                    linkInputFieldLabel: 'Link',
                    linkInputFieldHint: 'Enter link',
                    descriptionInputFieldLabel: 'Description',
                    descriptionInputFieldHint: 'Enter description',
                    addButtonLabel: 'Add link',
                    editButtonLabel: 'Update link',
                }}
            />,
        );

        fireEvent.change(getByTestId('link-info-link'), { target: { value: 'http://test.com' } });
        expect(getByTestId('add-items')).not.toHaveAttribute('disabled', '');
    });

    it('should display error message if link is not valid', () => {
        const { getByTestId, getByText } = rtlRender(
            <LinkInfoForm
                onAdd={jest.fn()}
                locale={{
                    linkInputFieldLabel: 'Link',
                    linkInputFieldHint: 'Enter link',
                    descriptionInputFieldLabel: 'Description',
                    descriptionInputFieldHint: 'Enter description',
                    addButtonLabel: 'Add link',
                    editButtonLabel: 'Update link',
                }}
            />,
        );

        fireEvent.change(getByTestId('link-info-link'), { target: { value: 'test.com' } });
        expect(getByText('URL is not valid')).toBeVisible();
        expect(getByTestId('add-items')).toHaveAttribute('disabled', '');
    });

    it('should add link info and reset form if link is valid and "Enter" is pressed', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = rtlRender(
            <LinkInfoForm
                onAdd={onAddFn}
                locale={{
                    linkInputFieldLabel: 'Link',
                    linkInputFieldHint: 'Enter link',
                    descriptionInputFieldLabel: 'Description',
                    descriptionInputFieldHint: 'Enter description',
                    addButtonLabel: 'Add link',
                    editButtonLabel: 'Update link',
                }}
            />,
        );

        fireEvent.change(getByTestId('link-info-link'), { target: { value: 'http://test.com' } });
        fireEvent.change(getByTestId('link-info-description'), { target: { value: 'test description' } });
        fireEvent.keyDown(getByTestId('link-info-description'), { key: 'Enter', code: 13 });

        expect(onAddFn).toHaveBeenCalledWith({ key: 'http://test.com', value: 'test description' });
        expect(getByTestId('link-info-link')).toHaveAttribute('value', '');
        expect(getByTestId('link-info-description')).toHaveAttribute('value', '');
    });

    it('should not submit link info form if link is not valid and "Enter" is pressed', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = rtlRender(
            <LinkInfoForm
                onAdd={onAddFn}
                locale={{
                    linkInputFieldLabel: 'Link',
                    linkInputFieldHint: 'Enter link',
                    descriptionInputFieldLabel: 'Description',
                    descriptionInputFieldHint: 'Enter description',
                    addButtonLabel: 'Add link',
                    editButtonLabel: 'Update link',
                }}
            />,
        );

        fireEvent.change(getByTestId('link-info-link'), { target: { value: 'test.com' } });
        fireEvent.change(getByTestId('link-info-description'), { target: { value: 'test description' } });
        fireEvent.keyDown(getByTestId('link-info-description'), { key: 'Enter', code: 13 });

        expect(onAddFn).not.toHaveBeenCalled();
    });

    it('should not submit link info form if link is valid and "Esc" is pressed', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = rtlRender(
            <LinkInfoForm
                onAdd={onAddFn}
                locale={{
                    linkInputFieldLabel: 'Link',
                    linkInputFieldHint: 'Enter link',
                    descriptionInputFieldLabel: 'Description',
                    descriptionInputFieldHint: 'Enter description',
                    addButtonLabel: 'Add link',
                    editButtonLabel: 'Update link',
                }}
            />,
        );

        fireEvent.change(getByTestId('link-info-link'), { target: { value: 'http://test.com' } });
        fireEvent.change(getByTestId('link-info-description'), { target: { value: 'test description' } });
        fireEvent.keyDown(getByTestId('link-info-description'), { key: 'Esc', code: 27 });

        expect(onAddFn).not.toHaveBeenCalled();
    });

    it('should load link info form with give link info values', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = rtlRender(
            <LinkInfoForm
                onAdd={onAddFn}
                locale={{
                    linkInputFieldLabel: 'Link',
                    linkInputFieldHint: 'Enter link',
                    descriptionInputFieldLabel: 'Description',
                    descriptionInputFieldHint: 'Enter description',
                    addButtonLabel: 'Add link',
                    editButtonLabel: 'Update link',
                }}
                itemSelectedToEdit={{ key: 'http://test.com', value: 'test description' }}
            />,
        );

        expect(getByTestId('link-info-link')).toHaveAttribute('value', 'http://test.com');
        expect(getByTestId('link-info-description')).toHaveAttribute('value', 'test description');
    });
});
