import React from 'react';
import { rtlRender, fireEvent } from 'test-utils';
import AuthButton from '../components/AuthButton';

function setup(testProps = {}) {
    return rtlRender(
        <AuthButton
            signInTooltipText="Please log in"
            signOutTooltipText="Log out"
            onClick={jest.fn()}
            {...testProps}
        />,
    );
}

describe('AuthButton snapshots test', () => {
    it('renders logged out status', () => {
        const { getByTestId, getByRole } = setup({ isAuthorizedUser: false });
        expect(getByTestId('PersonOutlineIcon')).toBeInTheDocument(); // logged out icon
        expect(getByRole('button')).toHaveAttribute('aria-label', 'Please log in');
    });

    it('renders logged in user status', () => {
        const { getByTestId, getByRole } = setup({ isAuthorizedUser: true });
        expect(getByTestId('PersonIcon')).toBeInTheDocument(); // logged in icon
        expect(getByRole('button')).toHaveAttribute('aria-label', 'Log out');
    });

    it('should fire a given action on clicking the button', () => {
        const onClickFn = jest.fn();
        const { getByTestId } = setup({ isAuthorizedUser: true, onClick: onClickFn });
        fireEvent.click(getByTestId('PersonIcon'));
        expect(onClickFn).toHaveBeenCalled();
    });
});
