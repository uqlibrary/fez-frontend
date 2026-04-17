import React from 'react';
import RelatedServiceListEditorForm from './RelatedServiceListEditorForm';
import { render, fireEvent, WithReduxStore } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        onAdd: testProps.onAdd || jest.fn(),
        errorText: null,
        disabled: false,
        required: true,
        hideType: false,
        isPopulated: testProps.isPopulated || jest.fn(),
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <RelatedServiceListEditorForm {...props} />
        </WithReduxStore>,
    );
}

describe('RelatedServiceListEditorForm', () => {
    it('should render with default props', () => {
        const { container, getByTestId, getByText } = setup();
        expect(
            getByText(
                "Add the Related Service's ID and description - then click the ADD RELATED SERVICE button to add to the list",
            ),
        ).toBeInTheDocument();

        expect(getByTestId('rek-related-service-id-input')).toBeInTheDocument();
        expect(getByTestId('rek-related-service-desc-input')).toBeInTheDocument();
        expect(getByTestId('rek-related-service-id-helper-text')).toBeInTheDocument();
        expect(getByText('This field is required')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should set related service id as a non required input', () => {
        const { queryByTestId, queryByText } = setup({ required: false });
        expect(queryByTestId('rek-related-service-id-helper-text')).not.toBeInTheDocument();
        expect(queryByText('This field is required')).not.toBeInTheDocument();
    });

    it('should disable add related service button when id is empty', () => {
        const { getByTestId, getByRole } = setup({ required: false });

        fireEvent.change(getByTestId('rek-related-service-id-input'), { target: { value: '123' } });
        expect(getByRole('button', { name: 'Add related service' })).not.toHaveAttribute('disabled', '');

        fireEvent.change(getByTestId('rek-related-service-id-input'), { target: { value: '' } });
        expect(getByRole('button', { name: 'Add related service' })).toHaveAttribute('disabled', '');
    });

    it('should add related service and pass isPopulated info', () => {
        const onAddFn = jest.fn();
        const isPopulated = jest.fn();
        const { getByTestId } = setup({
            onAdd: onAddFn,
            isPopulated: isPopulated,
        });

        fireEvent.change(getByTestId('rek-related-service-id-input'), { target: { value: '123' } });
        fireEvent.change(getByTestId('rek-related-service-desc-input'), { target: { value: 'desc' } });

        expect(isPopulated).toHaveBeenCalledTimes(2);
        expect(isPopulated).toHaveBeenCalledWith(true);

        fireEvent.click(getByTestId('rek-related-service-add'));

        expect(onAddFn).toHaveBeenCalledWith({
            relatedServiceId: '123',
            relatedServiceDesc: 'desc',
        });

        expect(isPopulated).toHaveBeenCalledWith(false);
    });

    it('should add related service when Enter key is pressed on desc field', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = setup({ onAdd: onAddFn });
        // no id
        fireEvent.keyDown(getByTestId('rek-related-service-id-input'), { key: 'Enter', code: 13 });
        expect(onAddFn).not.toHaveBeenCalled();

        fireEvent.change(getByTestId('rek-related-service-id-input'), { target: { value: 'id' } });
        fireEvent.keyDown(getByTestId('rek-related-service-desc-input'), { key: 'Esc', code: 27 });
        expect(onAddFn).not.toHaveBeenCalled();

        fireEvent.keyDown(getByTestId('rek-related-service-desc-input'), { key: 'Enter', code: 13 });
        expect(onAddFn).toHaveBeenCalledWith({ relatedServiceId: 'id', relatedServiceDesc: '' });
    });

    it('should load form with selected related service information', () => {
        const { getByTestId } = setup({
            relatedServiceSelectedToEdit: {
                relatedServiceId: '123',
                relatedServiceDesc: 'desc',
            },
        });

        expect(getByTestId('rek-related-service-id-input')).toHaveAttribute('value', '123');
        expect(getByTestId('rek-related-service-desc-input')).toHaveAttribute('value', 'desc');
    });
});
