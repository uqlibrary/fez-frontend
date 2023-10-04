import React from 'react';
import { ConfirmDialogBox } from '../../ConfirmDialogBox';

import { render, WithRouter } from 'test-utils';
import { NavigationPrompt } from './NavigationPrompt';

function setup(testProps = {}, renderer = render) {
    const { isOpen = false, ...props } = testProps;
    return renderer(
        <WithRouter>
            <NavigationPrompt {...props}>
                {(_setNavigationConfirmation, _onConfirm, _onCancel) => (
                    <ConfirmDialogBox
                        confirmDialogBoxId="tester"
                        onRef={_setNavigationConfirmation}
                        onAction={_onConfirm}
                        onCancelAction={_onCancel}
                        isOpen={isOpen}
                    />
                )}
            </NavigationPrompt>
        </WithRouter>,
    );
}

describe('NavigationPrompt component', () => {
    it('should render', () => {
        const { container, getByTestId } = setup({
            when: true,
            history: { block: jest.fn(() => jest.fn()) },
        });
        expect(getByTestId('confirmDialogBox')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should not render', () => {
        const testFunction = jest.fn(() => jest.fn());
        const { container } = setup({
            when: false,
            history: { block: testFunction },
        });
        expect(container).toMatchSnapshot();
    });

    it('should call componentWillUnmount and unblock method', () => {
        const unblockFn = jest.fn();
        const { container, unmount } = setup({
            when: true,
            history: { block: jest.fn(() => unblockFn) },
        });

        expect(container).toMatchSnapshot();

        unmount();

        expect(unblockFn).toHaveBeenCalled();
    });

    it('should block navigation', () => {
        const instance = new NavigationPrompt({
            when: true,
            history: {
                block: jest.fn(),
            },
            children: jest.fn(() => null),
        });

        const showConfirmationFn = jest.fn();
        instance.confirmationBox = {
            showConfirmation: showConfirmationFn,
        };
        instance.setState = jest.fn(state => {
            instance.state = state;
        });
        const result = instance.blockNavigation('/test');

        expect(instance.state.nextLocation).toEqual('/test');
        expect(showConfirmationFn).toHaveBeenCalled();
        expect(result).toBeFalsy();
    });

    it('should not block navigation', () => {
        const instance = new NavigationPrompt({
            when: false,
            history: { block: jest.fn(), push: jest.fn() },
            children: jest.fn(() => null),
        });

        const showConfirmationFn = jest.fn();
        instance.confirmationBox = {
            showConfirmation: showConfirmationFn,
        };
        instance.setState = jest.fn(state => {
            instance.state = state;
        });
        const result = instance.blockNavigation('/test');

        expect(instance.state.nextLocation).toBeNull();
        expect(showConfirmationFn).not.toHaveBeenCalled();
        expect(result).toBeFalsy();
    });

    it('should cancel navigation to next location', () => {
        const instance = new NavigationPrompt({
            when: true,
            history: { block: jest.fn() },
            children: (_setNavigationConfirmation, _, _onCancel) => {
                return {
                    cancel: _onCancel,
                };
            },
        });

        instance.setState = jest.fn(state => {
            instance.state = state;
        });
        instance.unblock = jest.fn();
        instance.setState({ nextLocation: '/test' });
        expect(instance.state.nextLocation).toEqual('/test');

        instance.props.children(instance.setNavigationConfirmation, instance._onConfirm, instance._onCancel).cancel();
        expect(instance.state.nextLocation).toBeNull();
    });

    it('should navigate to next location on confirm', async () => {
        const instance = new NavigationPrompt({
            when: true,
            history: { block: jest.fn(() => jest.fn()), push: jest.fn() },
            children: (_setNavigationConfirmation, _onConfirm) => {
                return {
                    confirm: _onConfirm,
                };
            },
        });

        instance.setState = jest.fn(state => {
            instance.state = state;
        });

        instance.unblock = jest.fn();

        instance.setState({ nextLocation: '/test' });
        expect(instance.state.nextLocation).toEqual('/test');

        instance.props.children(instance.setNavigationConfirmation, instance._onConfirm, instance._onCancel).confirm();
        expect(instance.state.nextLocation).toEqual('/test');
    });
});
