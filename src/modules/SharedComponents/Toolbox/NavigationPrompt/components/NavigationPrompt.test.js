import React from 'react';
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
});
