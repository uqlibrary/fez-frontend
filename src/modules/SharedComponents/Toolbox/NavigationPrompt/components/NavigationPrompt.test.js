import React from 'react';
import { fireEvent } from '@testing-library/react';
import { ConfirmDialogBox } from '../../ConfirmDialogBox';

import { act, render, WithRouter } from 'test-utils';
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

    it('should avoid reopening the dialog while navigation is resolving', () => {
        const proceed = jest.fn();
        const reset = jest.fn();
        const confirmationBox = {
            showConfirmation: jest.fn(),
            hideConfirmation: jest.fn(),
        };
        let blockerCallback;
        let didBlock = false;

        useBlocker.mockImplementation(f => {
            blockerCallback = f;
            if (!didBlock) {
                didBlock = true;
                f({ currentLocation: { pathname: 'current' }, nextLocation: { pathname: 'next' } });
            }
            return {
                state: 'blocked',
                proceed: jest.fn(() => {
                    blockerCallback({ currentLocation: { pathname: 'current' }, nextLocation: { pathname: 'next' } });
                    proceed();
                }),
                reset,
            };
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
        expect(confirmationBox.showConfirmation).toHaveBeenCalledTimes(1);
    });

    it('should hide the confirmation dialog when navigation is no longer blocked', () => {
        const confirmationBox = {
            showConfirmation: jest.fn(),
            hideConfirmation: jest.fn(),
        };
        let blockerCallback;

        useBlocker.mockImplementation(f => {
            blockerCallback = f;
            return { state: 'blocked', proceed: jest.fn(), reset: jest.fn() };
        });

        const TestHarness = ({ setNavigationConfirmation }) => {
            React.useEffect(() => {
                setNavigationConfirmation(confirmationBox);
            }, [setNavigationConfirmation]);

            return null;
        };

        const { rerender } = render(
            <WithRouter>
                <NavigationPrompt when>
                    {setNavigationConfirmation => <TestHarness setNavigationConfirmation={setNavigationConfirmation} />}
                </NavigationPrompt>
            </WithRouter>,
        );

        act(() => {
            blockerCallback({ currentLocation: { pathname: 'current' }, nextLocation: { pathname: 'next' } });
        });

        rerender(
            <WithRouter>
                <NavigationPrompt when={false}>
                    {setNavigationConfirmation => <TestHarness setNavigationConfirmation={setNavigationConfirmation} />}
                </NavigationPrompt>
            </WithRouter>,
        );

        expect(confirmationBox.hideConfirmation).toHaveBeenCalled();
    });

    it('should treat repeated navigation requests to the same pending location as blocked', () => {
        let blockerCallback;

        useBlocker.mockImplementation(f => {
            blockerCallback = f;
            return { state: 'idle', proceed: jest.fn(), reset: jest.fn() };
        });

        render(
            <WithRouter>
                <NavigationPrompt when>{() => null}</NavigationPrompt>
            </WithRouter>,
        );

        let firstResult;
        let secondResult;

        act(() => {
            firstResult = blockerCallback({ currentLocation: { pathname: 'current' }, nextLocation: { pathname: 'next' } });
        });

        act(() => {
            secondResult = blockerCallback({ currentLocation: { pathname: 'current' }, nextLocation: { pathname: 'next' } });
        });

        expect(firstResult).toBe(true);
        expect(secondResult).toBe(true);
    });

    it('should navigate to the pending location when no blocker proceed handler is available', () => {
        const navigate = jest.fn();
        const confirmationBox = {
            hideConfirmation: jest.fn(),
        };
        let blockerCallback;

        useNavigate.mockReturnValue(navigate);
        useBlocker.mockImplementation(f => {
            blockerCallback = f;
            return { state: 'idle', proceed: undefined, reset: jest.fn() };
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

        act(() => {
            blockerCallback({ currentLocation: { pathname: 'current' }, nextLocation: { pathname: '/next' } });
        });

        fireEvent.click(getByTestId('confirm-navigation'));

        expect(navigate).toHaveBeenCalledWith('/next');
        expect(confirmationBox.hideConfirmation).toHaveBeenCalled();
    });

    it('should do nothing when confirmation is triggered without a pending location', () => {
        const navigate = jest.fn();
        const confirmationBox = {
            hideConfirmation: jest.fn(),
        };

        useNavigate.mockReturnValue(navigate);
        useBlocker.mockImplementation(() => ({ state: 'idle', proceed: undefined, reset: jest.fn() }));

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

        expect(navigate).not.toHaveBeenCalled();
    });
});
