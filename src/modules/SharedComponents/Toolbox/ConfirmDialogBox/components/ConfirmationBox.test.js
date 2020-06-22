import React from 'react';
import ConfirmationBox from './ConfirmationBox';
import { rtlRender, fireEvent, act } from 'test-utils';

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
    it('should render confirmation box', () => {
        const { getByTestId, getByText } = setup({ isOpen: true });
        expect(getByText('Are you sure?')).toBeInTheDocument();
        expect(getByTestId('confirm-action')).toBeInTheDocument();
        expect(getByTestId('confirm-cancel-action')).toBeInTheDocument();
    });

    it('should render alternate action button', () => {
        const { getByTestId, getByText } = setup({ isOpen: true, showAlternateActionButton: true });
        expect(getByText('Are you sure?')).toBeInTheDocument();
        expect(getByTestId('confirm-action')).toBeInTheDocument();
        expect(getByTestId('confirm-cancel-action')).toBeInTheDocument();
        expect(getByTestId('confirm-alternate-action')).toBeInTheDocument();
    });

    it('should call confirm action', () => {
        const onActionFn = jest.fn();
        const onCloseFn = jest.fn();
        const { getByTestId } = setup({ isOpen: true, onAction: onActionFn, onClose: onCloseFn });
        fireEvent.click(getByTestId('confirm-action'));
        expect(onActionFn).toBeCalled();
        expect(onCloseFn).toBeCalled();
    });

    it('should call cancel action', () => {
        const onCancelActionFn = jest.fn();
        const onCloseFn = jest.fn();
        const { getByTestId } = setup({ isOpen: true, onCancelAction: onCancelActionFn, onClose: onCloseFn });
        fireEvent.click(getByTestId('confirm-cancel-action'));
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
        fireEvent.click(getByTestId('confirm-alternate-action'));
        expect(onAlternateActionFn).toBeCalled();
        expect(onCloseFn).toBeCalled();
    });
});
