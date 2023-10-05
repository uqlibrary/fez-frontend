import React from 'react';
import { rtlRender, fireEvent, createMatchMedia } from 'test-utils';
import Alert from './Alert';

function setup(testProps = {}) {
    return rtlRender(
        <Alert
            title="Title"
            message="Message"
            type="warning"
            allowDismiss
            dismissAction={jest.fn()}
            action={jest.fn()}
            actionButtonLabel="button"
            {...testProps}
        />,
    );
}

describe('Alert', () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });

    it('should render default view', () => {
        const { container, getByText, getByTestId } = setup();
        expect(getByText(/Title*/)).toBeInTheDocument();
        expect(getByText('Message')).toBeInTheDocument();
        expect(getByTestId('WarningIcon')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should render error type of alert', () => {
        const { container, getByText, getByTestId } = setup({
            title: 'This is an error title',
            type: 'error',
            message: 'This is an error message',
        });

        expect(getByText(/This is an error title*/)).toBeInTheDocument();
        expect(getByText('This is an error message')).toBeInTheDocument();
        expect(getByTestId('ErrorIcon')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should render custom alert', () => {
        const { container, getByText } = setup({
            title: 'This is a custom title',
            type: 'custom',
            message: 'This is a custom message',
            customIcon: 'test',
            customType: 'error',
            wiggle: true,
        });

        expect(getByText(/This is a custom title*/)).toBeInTheDocument();
        expect(getByText('This is a custom message')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should render error outline type of alert', () => {
        const { container, getByText, getByTestId } = setup({
            title: 'This is an error outline title',
            type: 'error_outline',
            message: 'This is an error outline message',
        });

        expect(getByText(/This is an error outline title*/)).toBeInTheDocument();
        expect(getByText('This is an error outline message')).toBeInTheDocument();
        expect(getByTestId('ErrorOutlineIcon')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should render info type of alert', () => {
        const { container, getByText, getByTestId } = setup({
            title: 'This is an info title',
            type: 'info',
            message: 'This is an info message',
        });

        expect(getByText(/This is an info title*/)).toBeInTheDocument();
        expect(getByText('This is an info message')).toBeInTheDocument();
        expect(getByTestId('InfoIcon')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should render info outline type of alert', () => {
        const { container, getByText, getByTestId } = setup({
            title: 'This is an info outline title',
            type: 'info_outline',
            message: 'This is an info outline message',
        });

        expect(getByText(/This is an info outline title*/)).toBeInTheDocument();
        expect(getByText('This is an info outline message')).toBeInTheDocument();
        expect(getByTestId('InfoOutlinedIcon')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should render help type of alert', () => {
        const { container, getByText, getByTestId } = setup({
            title: 'This is an help title',
            type: 'help',
            message: 'This is an help message',
        });

        expect(getByText(/This is an help title*/)).toBeInTheDocument();
        expect(getByText('This is an help message')).toBeInTheDocument();
        expect(getByTestId('HelpIcon')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });
    it('should render help outline type of alert', () => {
        const { container, getByText, getByTestId } = setup({
            title: 'This is an help outline title',
            type: 'help_outline',
            message: 'This is an help outline message',
        });

        expect(getByText(/This is an help outline title*/)).toBeInTheDocument();
        expect(getByText('This is an help outline message')).toBeInTheDocument();
        expect(getByTestId('HelpOutlineIcon')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should render done type of alert', () => {
        const { container, getByText, getByTestId } = setup({
            title: 'This is an done title',
            type: 'done',
            message: 'This is an done message',
        });

        expect(getByText(/This is an done title*/)).toBeInTheDocument();
        expect(getByText('This is an done message')).toBeInTheDocument();
        expect(getByTestId('DoneIcon')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should render clickable action button', () => {
        const actionFn = jest.fn();
        const { container, getByText, getByTestId } = setup({
            title: 'This is an error title',
            type: 'error',
            message: 'This is an error message',
            action: actionFn,
            actionButtonLabel: 'Dismiss',
        });

        expect(getByText(/This is an error title*/)).toBeInTheDocument();
        expect(getByText('This is an error message')).toBeInTheDocument();
        expect(getByTestId('ErrorIcon')).toBeInTheDocument();
        expect(getByTestId('action-button')).toBeInTheDocument();

        fireEvent.click(getByTestId('action-button'));
        expect(actionFn).toHaveBeenCalledTimes(1);
        expect(container).toMatchSnapshot();
    });

    it('should dismiss alert', () => {
        const dismissfn = jest.fn();
        const { container, getByTestId } = setup({
            dismissAction: dismissfn,
            type: 'error',
        });

        fireEvent.click(getByTestId('dismiss'));
        expect(dismissfn).toHaveBeenCalledTimes(1);
        expect(container).toMatchSnapshot();
    });

    it('should display dismiss button for smaller screen size', () => {
        window.matchMedia = createMatchMedia(256);
        const { container, getByTestId } = setup();
        expect(getByTestId('dismiss-mobile')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should display loader', () => {
        const { container, getByTestId } = setup({
            showLoader: true,
        });

        expect(getByTestId('spinner')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should fire an action when user clicks on the message text', () => {
        const actionFn = jest.fn();
        const { container, getByText } = setup({
            message: 'Click me',
            action: actionFn,
        });

        fireEvent.click(getByText(/Click me/));
        expect(actionFn).toHaveBeenCalledTimes(1);
        expect(container).toMatchSnapshot();
    });

    it('should not fire an action when user clicks on the message text and no action is assigned', () => {
        const actionFn = jest.fn();
        const { container, getByText } = setup({
            message: 'Click me',
            action: null,
        });

        fireEvent.click(getByText(/Click me/));
        expect(actionFn).toHaveBeenCalledTimes(0);
        expect(container).toMatchSnapshot();
    });
});
