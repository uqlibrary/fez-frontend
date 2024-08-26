import React from 'react';
import ConfirmationBox from './ConfirmationBox';
import { rtlRender, fireEvent } from 'test-utils';

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        hideCancelButton: false,
        isOpen: false,
        locale: {
            confirmationTitle: 'Confirmation',
            confirmationMessage: 'Are you sure?',
            cancelButtonLabel: 'No',
            confirmButtonLabel: 'Yes',
            alternateActionButtonLabel: 'Cancel',
        },
        onAction: jest.fn(),
        onAlternateAction: jest.fn(),
        onCancelAction: jest.fn(),
        onClose: jest.fn(),
        showAlternateActionButton: false,
        confirmationBoxId: 'confirmation-box',
        ...testProps,
    };

    return renderer(<ConfirmationBox {...props} />);
}

describe('ConfirmationBox component', () => {
    it('should render confirmation box with default props', () => {
        const { container } = rtlRender(<ConfirmationBox confirmationBoxId="test" />);
        expect(container).toMatchSnapshot();
    });

    it('should render confirmation box', () => {
        const { getByTestId, getByText } = setup({ isOpen: true });
        expect(getByText('Are you sure?')).toBeInTheDocument();
        expect(getByTestId('confirm-confirmation-box')).toBeInTheDocument();
        expect(getByTestId('cancel-confirmation-box')).toBeInTheDocument();
    });

    it('should render alternate action button', () => {
        const { getByTestId, getByText } = setup({ isOpen: true, showAlternateActionButton: true });
        expect(getByText('Are you sure?')).toBeInTheDocument();
        expect(getByTestId('confirm-confirmation-box')).toBeInTheDocument();
        expect(getByTestId('cancel-confirmation-box')).toBeInTheDocument();
        expect(getByTestId('confirm-alternate-confirmation-box')).toBeInTheDocument();
    });

    it('should call confirm action', () => {
        const onActionFn = jest.fn();
        const onCloseFn = jest.fn();
        const { getByTestId } = setup({ isOpen: true, onAction: onActionFn, onClose: onCloseFn });
        fireEvent.click(getByTestId('confirm-confirmation-box'));
        expect(onActionFn).toBeCalled();
        expect(onCloseFn).toBeCalled();
    });

    it('should call cancel action', () => {
        const onCancelActionFn = jest.fn();
        const onCloseFn = jest.fn();
        const { getByTestId } = setup({ isOpen: true, onCancelAction: onCancelActionFn, onClose: onCloseFn });
        fireEvent.click(getByTestId('cancel-confirmation-box'));
        expect(onCancelActionFn).toBeCalled();
        expect(onCloseFn).toBeCalled();
    });

    it('should call alternate action', () => {
        const onAlternateActionFn = jest.fn();
        const onCloseFn = jest.fn();
        const { getByTestId } = setup({
            isOpen: true,
            onAlternateAction: onAlternateActionFn,
            onClose: onCloseFn,
            showAlternateActionButton: true,
        });
        fireEvent.click(getByTestId('confirm-alternate-confirmation-box'));
        expect(onAlternateActionFn).toBeCalled();
        expect(onCloseFn).toBeCalled();
    });
});
