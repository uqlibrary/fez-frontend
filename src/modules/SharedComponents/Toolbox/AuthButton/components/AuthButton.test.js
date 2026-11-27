import React from 'react';
import { rtlRender, fireEvent, createMatchMedia } from 'test-utils';
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
    const originalMatchMedia = window.matchMedia;

    afterEach(() => {
        window.matchMedia = originalMatchMedia;
    });

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

    it.each([
        ['logged-out icon on mobile', false, 320, 'PersonOutlineIcon', false],
        ['logged-out icon on desktop', false, 768, 'PersonOutlineIcon', true],
        ['logged-in icon on mobile', true, 320, 'PersonIcon', false],
        ['logged-in icon on desktop', true, 768, 'PersonIcon', true],
    ])('sets responsive display for %s', (_, isAuthorizedUser, width, iconId, expectedDisplay) => {
        window.matchMedia = createMatchMedia(width);

        const { getByTestId } = setup({ isAuthorizedUser });
        const icon = getByTestId(iconId);
        expect(icon).toBeInTheDocument();
        expectedDisplay ? expect(icon).toBeVisible() : expect(icon).not.toBeVisible();
    });

    it('should fire a given action on clicking the button', () => {
        const onClickFn = jest.fn();
        const { getByTestId } = setup({ isAuthorizedUser: true, onClick: onClickFn });
        fireEvent.click(getByTestId('PersonIcon'));
        expect(onClickFn).toHaveBeenCalled();
    });
});
