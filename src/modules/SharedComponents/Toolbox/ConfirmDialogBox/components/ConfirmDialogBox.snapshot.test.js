import React from 'react';
import ConfirmDialogBox, { ConfirmDialogBox as ConfirmDialogBoxClass } from './ConfirmDialogBox';
import { rtlRender, fireEvent } from 'test-utils';

const defaultProps = {
    classes: {},
    hideCancelButton: false,
    locale: {
        alternateActionButtonLabel: 'Maybe',
        confirmationTitle: 'Confirmation',
        confirmationMessage: 'Are you sure?',
        cancelButtonLabel: 'No',
        confirmButtonLabel: 'Yes',
    },
    onAction: jest.fn(),
    onCancelAction: jest.fn(),
    onAlternateAction: jest.fn(),
    showAlternateActionButton: false,
    isOpen: true,
};

function setup(testProps = {}, renderer = rtlRender) {
    const props = { ...defaultProps, ...testProps };
    return renderer(<ConfirmDialogBox {...props} />);
}

describe('ConfirmDialogBox snapshots tests', () => {
    it('renders component with yes/no buttons', () => {
        const { container, getByTestId, getByRole } = setup();
        expect(getByTestId('message-title')).toBeInTheDocument();
        expect(getByTestId('message-content')).toBeInTheDocument();
        expect(getByRole('button', { name: /Yes/ })).toBeInTheDocument();
        expect(getByRole('button', { name: /No/ })).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('renders component with yes', () => {
        const { container, getByRole, queryByRole } = setup({ hideCancelButton: true });
        expect(getByRole('button', { name: /Yes/ })).toBeInTheDocument();
        expect(queryByRole('button', { name: /No/ })).not.toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('renders component with yes/no/maybe buttons', () => {
        const { container, getByRole } = setup({ showAlternateActionButton: true });
        expect(getByRole('button', { name: /Yes/ })).toBeInTheDocument();
        expect(getByRole('button', { name: /Maybe/ })).toBeInTheDocument();
        expect(getByRole('button', { name: /No/ })).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('renders component with customised locale', () => {
        const { container, getByRole, getByText } = setup({
            locale: {
                alternateActionButtonLabel: 'ENG: Maybe',
                cancelButtonLabel: 'ENG: No',
                confirmationTitle: 'ENG: Confirmation',
                confirmationMessage: 'ENG: Are you sure?',
                confirmButtonLabel: 'ENG: Yes',
            },
            showAlternateActionButton: true,
        });
        expect(getByText('ENG: Confirmation')).toBeInTheDocument();
        expect(getByText('ENG: Are you sure?')).toBeInTheDocument();
        expect(getByRole('button', { name: /ENG: Yes/ })).toBeInTheDocument();
        expect(getByRole('button', { name: /ENG: Maybe/ })).toBeInTheDocument();
        expect(getByRole('button', { name: /ENG: No/ })).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });
    it('the ok-equivalent button should work', () => {
        const testFn = jest.fn();
        const { getByRole } = setup({
            onAction: testFn,
        });
        fireEvent.click(getByRole('button', { name: /Yes/ }));
        expect(testFn).toHaveBeenCalled();
    });

    it('the cancel-equivalent button should work', () => {
        const testFn = jest.fn();
        const { getByRole } = setup({
            onCancelAction: testFn,
        });
        fireEvent.click(getByRole('button', { name: /No/ }));
        expect(testFn).toHaveBeenCalled();
    });

    it('the alternate action button should work', () => {
        const testFn = jest.fn();
        const { getByRole } = setup({
            showAlternateActionButton: true,
            onAlternateAction: testFn,
        });
        fireEvent.click(getByRole('button', { name: /Maybe/ }));
        expect(testFn).toHaveBeenCalled();
    });

    describe('onRef behavior', () => {
        it('calls onRef with instance on mount and undefined on unmount', () => {
            const onRef = jest.fn();
            const { unmount } = setup({ onRef });

            // on mount
            expect(onRef).toHaveBeenCalledWith(expect.any(ConfirmDialogBoxClass));
            // sanity check
            expect(onRef.mock.calls[0][0]).toHaveProperty('showConfirmation');
            // on unmount
            unmount();
            expect(onRef).toHaveBeenLastCalledWith(undefined);
        });
    });

    describe('Class instance', () => {
        const getInstance = props => {
            const instance = new ConfirmDialogBoxClass(props ?? defaultProps);
            instance.setState = jest.fn(newState => {
                instance.state = { ...instance.state, ...newState };
            });
            return instance;
        };

        it('should show and hide confirmation dialog', () => {
            const instance = getInstance({ ...defaultProps, isOpen: false });
            instance.showConfirmation();
            expect(instance.state.isDialogOpen).toBeTruthy();

            instance._hideConfirmation();
            expect(instance.state.isDialogOpen).toBeFalsy();
        });
    });
});
