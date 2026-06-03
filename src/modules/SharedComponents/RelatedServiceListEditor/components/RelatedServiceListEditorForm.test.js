import React from 'react';
import RelatedServiceListEditorForm from './RelatedServiceListEditorForm';
import { render, fireEvent, WithReduxStore } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        onAdd: jest.fn(),
        onDirty: jest.fn(),
        disabled: false,
        required: true,
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <RelatedServiceListEditorForm {...props} />
        </WithReduxStore>,
    );
}

describe('RelatedServiceListEditorForm', () => {
    beforeEach(() => jest.resetAllMocks());

    it('should render default state', () => {
        const { getByTestId, getByText } = setup();
        expect(
            getByText(
                "Add the Related Service's ID and description - then click the ADD RELATED SERVICE button to add to the list",
            ),
        ).toBeInTheDocument();
        expect(getByTestId('rek-related-service-id-input')).toBeInTheDocument();
        expect(getByTestId('rek-related-service-desc-input')).toBeInTheDocument();
    });

    it('should show required error on service id when required and empty, or when dirty with empty id', () => {
        const { queryByTestId, queryByText, unmount } = setup({ required: true });
        expect(queryByTestId('rek-related-service-id-helper-text')).toBeInTheDocument();
        expect(queryByText('This field is required')).toBeInTheDocument();
        unmount();

        setup({ required: false });
        expect(queryByTestId('rek-related-service-id-helper-text')).not.toBeInTheDocument();
        expect(queryByText('This field is required')).not.toBeInTheDocument();

        fireEvent.change(queryByTestId('rek-related-service-desc-input'), {
            target: { name: 'relatedServiceDesc', value: 'desc' },
        });
        expect(queryByTestId('rek-related-service-id-helper-text')).toBeInTheDocument();
    });

    it('should call onDirty(true) when form is changed and onDirty(false) when reset to default', () => {
        const onDirty = jest.fn();
        const { getByTestId } = setup({ onDirty, required: false });

        expect(onDirty).toHaveBeenCalledWith(false);

        fireEvent.change(getByTestId('rek-related-service-desc-input'), {
            target: { name: 'relatedServiceDesc', value: 'desc' },
        });
        expect(onDirty).toHaveBeenLastCalledWith(true);

        fireEvent.change(getByTestId('rek-related-service-desc-input'), {
            target: { name: 'relatedServiceDesc', value: '' },
        });
        expect(onDirty).toHaveBeenLastCalledWith(false);
    });

    it('should not throw when onDirty is not provided', () => {
        expect(() => {
            const { getByTestId } = setup({ onDirty: undefined });
            fireEvent.change(getByTestId('rek-related-service-desc-input'), {
                target: { name: 'relatedServiceDesc', value: 'desc' },
            });
        }).not.toThrow();
    });

    it('should call onAdd and reset the form when Add related service is clicked', () => {
        const onAdd = jest.fn();
        const onDirty = jest.fn();
        const { getByTestId, getByRole } = setup({ onAdd, onDirty });

        fireEvent.change(getByTestId('rek-related-service-id-input'), {
            target: { name: 'relatedServiceId', value: '123' },
        });
        fireEvent.change(getByTestId('rek-related-service-desc-input'), {
            target: { name: 'relatedServiceDesc', value: 'desc' },
        });
        fireEvent.click(getByRole('button', { name: 'Add related service' }));

        expect(onAdd).toHaveBeenCalledWith({ relatedServiceId: '123', relatedServiceDesc: 'desc' });
        expect(onDirty).toHaveBeenLastCalledWith(false);
        expect(getByTestId('rek-related-service-id-input')).toHaveAttribute('value', '');
        expect(getByTestId('rek-related-service-desc-input')).toHaveAttribute('value', '');
    });

    it('should load selected service for editing and show Edit related service button', () => {
        const { getByTestId, getByRole } = setup({
            relatedServiceSelectedToEdit: { relatedServiceId: '123', relatedServiceDesc: 'desc' },
        });
        expect(getByTestId('rek-related-service-id-input')).toHaveAttribute('value', '123');
        expect(getByTestId('rek-related-service-desc-input')).toHaveAttribute('value', 'desc');
        expect(getByRole('button', { name: 'Edit related service' })).toBeInTheDocument();
    });

    it('should disable Add button when id is empty and enable it when set', () => {
        const { getByTestId, getByRole } = setup({ required: false });

        expect(getByRole('button', { name: 'Add related service' })).toBeDisabled();

        fireEvent.change(getByTestId('rek-related-service-id-input'), {
            target: { name: 'relatedServiceId', value: '123' },
        });
        expect(getByRole('button', { name: 'Add related service' })).not.toBeDisabled();

        fireEvent.change(getByTestId('rek-related-service-id-input'), {
            target: { name: 'relatedServiceId', value: '' },
        });
        expect(getByRole('button', { name: 'Add related service' })).toBeDisabled();
    });

    it('should add on Enter key with id set, and not add without id or on other keys', () => {
        const onAdd = jest.fn();
        const { getByTestId } = setup({ onAdd });

        // Enter with no id -> no add
        fireEvent.keyDown(getByTestId('rek-related-service-desc-input'), { key: 'Enter', code: 13 });
        expect(onAdd).not.toHaveBeenCalled();

        fireEvent.change(getByTestId('rek-related-service-id-input'), {
            target: { name: 'relatedServiceId', value: '123' },
        });

        // non-Enter key -> no add
        fireEvent.keyDown(getByTestId('rek-related-service-desc-input'), { key: 'Esc', code: 27 });
        expect(onAdd).not.toHaveBeenCalled();

        // Enter with id -> add
        fireEvent.keyDown(getByTestId('rek-related-service-desc-input'), { key: 'Enter', code: 13 });
        expect(onAdd).toHaveBeenCalledWith({ relatedServiceId: '123', relatedServiceDesc: '' });
    });
});
