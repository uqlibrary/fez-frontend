import React from 'react';
import { fireEvent } from '@testing-library/react';
import { ConfirmDialogBox } from '../../ConfirmDialogBox';

import { render, WithRouter } from 'test-utils';
import NavigationPrompt from './NavigationPrompt';
import { useBlocker, useNavigate } from 'react-router';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn(() => jest.fn()),
    useBlocker: jest.fn(() => jest.fn()),
}));

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
    afterEach(() => {
        useBlocker.mockClear();
        useNavigate.mockClear();
    });

    it('should render', () => {
        useBlocker.mockImplementation(f => {
            f({ currentLocation: { pathname: 'current' }, nextLocation: { pathname: 'current' } });
            return { reset: jest.fn };
        });
        const { container, getByTestId } = setup({
            when: true,
        });
        expect(getByTestId('confirmDialogBox')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should not render', () => {
        useBlocker.mockImplementation(f => {
            f({ currentLocation: { pathname: 'current' }, nextLocation: { pathname: 'next' } });
            return { reset: jest.fn };
        });
        const { container } = setup({
            when: false,
        });
        expect(container).toMatchSnapshot();
    });

    it('should close the confirmation dialog before proceeding', () => {
        const proceed = jest.fn();
        const reset = jest.fn();
        const confirmationBox = {
            showConfirmation: jest.fn(),
            hideConfirmation: jest.fn(),
        };
        let didBlock = false;

        useBlocker.mockImplementation(f => {
            if (!didBlock) {
                didBlock = true;
                f({ currentLocation: { pathname: 'current' }, nextLocation: { pathname: 'next' } });
            }
            return { state: 'blocked', proceed, reset };
        });

        const TestHarness = ({ setNavigationConfirmation, onConfirm }) => {
            React.useEffect(() => {
                setNavigationConfirmation(confirmationBox);
            }, [setNavigationConfirmation]);

            return (
                <button data-testid="confirm-navigation" onClick={onConfirm}>
                    Confirm
                </button>
            );
        };

        const { getByTestId } = render(
            <WithRouter>
                <NavigationPrompt when>
                    {(setNavigationConfirmation, onConfirm) => <TestHarness setNavigationConfirmation={setNavigationConfirmation} onConfirm={onConfirm} />}
                </NavigationPrompt>
            </WithRouter>,
        );

        fireEvent.click(getByTestId('confirm-navigation'));

        expect(confirmationBox.hideConfirmation).toHaveBeenCalled();
        expect(proceed).toHaveBeenCalled();
    });
});
