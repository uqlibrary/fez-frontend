import React from 'react';
import { rtlRender, userEvent, waitFor } from 'test-utils';
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
        expect(getByRole('button')).toHaveTextContent('Please log in');
        expect(getByRole('button', { name: 'Please log in' })).toHaveClass('log-in-button');
    });

    it('renders logged in user status', () => {
        const { getByTestId, getByRole } = setup({ isAuthorizedUser: true });
        expect(getByTestId('PersonIcon')).toBeInTheDocument(); // logged in icon
        expect(getByRole('button')).toHaveTextContent('Log out');
        expect(getByRole('button', { name: 'Log out' })).toHaveClass('log-out-button');
    });

    it('does not render the menu until the button is clicked', () => {
        const { getByRole, queryByRole } = setup({ isAuthorizedUser: true });
        expect(queryByRole('menu')).not.toBeInTheDocument();
        expect(getByRole('button')).not.toHaveAttribute('aria-expanded');
        expect(getByRole('button')).not.toHaveAttribute('aria-controls');
    });

    it('opens the menu without firing the action when the button is clicked', async () => {
        const onClickFn = jest.fn();
        const { getByRole } = setup({ isAuthorizedUser: true, onClick: onClickFn });
        await userEvent.click(getByRole('button', { name: 'Log out' }));
        expect(getByRole('menu')).toBeInTheDocument();
        expect(getByRole('menuitem')).toBeInTheDocument();
        const button = getByRole('button', { name: 'Log out', hidden: true });
        expect(button).toHaveAttribute('aria-expanded', 'true');
        expect(button).toHaveAttribute('aria-controls', 'auth-menu');
        expect(onClickFn).not.toHaveBeenCalled();
    });

    it('calls the given action instead of opening a menu when a logged out user clicks the button', async () => {
        const onClickFn = jest.fn();
        const { getByRole, queryByRole } = setup({ isAuthorizedUser: false, onClick: onClickFn });
        const button = getByRole('button', { name: 'Please log in' });
        expect(button).not.toHaveAttribute('aria-haspopup');
        await userEvent.click(button);
        expect(onClickFn).toHaveBeenCalledTimes(1);
        expect(queryByRole('menu')).not.toBeInTheDocument();
        expect(button).not.toHaveAttribute('aria-expanded');
    });

    it('does not throw when a logged out user clicks the button and no action is given', async () => {
        const { getByRole, queryByRole } = setup({ isAuthorizedUser: false, onClick: undefined });
        await userEvent.click(getByRole('button', { name: 'Please log in' }));
        expect(queryByRole('menu')).not.toBeInTheDocument();
    });

    it('shows the sign out tooltip text on the menu item for a logged in user', async () => {
        const { getByRole, getByText, findByRole } = setup({ isAuthorizedUser: true });
        await userEvent.click(getByRole('button', { name: 'Log out' }));
        await userEvent.hover(getByText('Logout'));
        expect(await findByRole('tooltip')).toHaveTextContent('Log out');
    });

    it('should fire a given action on clicking the menu item', async () => {
        const onClickFn = jest.fn();
        const { getByRole } = setup({ isAuthorizedUser: true, onClick: onClickFn });
        await userEvent.click(getByRole('button', { name: 'Log out' }));
        await userEvent.click(getByRole('menuitem'));
        expect(onClickFn).toHaveBeenCalledTimes(1);
    });

    it('closes the menu without firing the action when dismissed', async () => {
        const onClickFn = jest.fn();
        const { getByRole, queryByRole } = setup({ isAuthorizedUser: true, onClick: onClickFn });
        await userEvent.click(getByRole('button', { name: 'Log out' }));
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(queryByRole('menu')).not.toBeInTheDocument());
        expect(onClickFn).not.toHaveBeenCalled();
    });

    describe('keyboard navigation', () => {
        it('can focus the button using the tab key', async () => {
            const { getByRole } = setup({ isAuthorizedUser: true });
            await userEvent.tab();
            expect(getByRole('button', { name: 'Log out' })).toHaveFocus();
        });

        it.each([
            ['Enter', '{Enter}'],
            ['Space', '[Space]'],
        ])('opens the menu and focuses the menu item with the %s key', async (_, key) => {
            const { getByRole } = setup({ isAuthorizedUser: true });
            await userEvent.tab();
            await userEvent.keyboard(key);
            expect(getByRole('menu')).toBeInTheDocument();
            await waitFor(() => expect(getByRole('menuitem')).toHaveFocus());
        });

        it.each([
            ['Enter', '{Enter}'],
            ['Space', '[Space]'],
        ])('fires the given action when the menu item is activated with the %s key', async (_, key) => {
            const onClickFn = jest.fn();
            const { getByRole } = setup({ isAuthorizedUser: true, onClick: onClickFn });
            await userEvent.tab();
            await userEvent.keyboard('{Enter}');
            await waitFor(() => expect(getByRole('menuitem')).toHaveFocus());
            await userEvent.keyboard(key);
            expect(onClickFn).toHaveBeenCalledTimes(1);
        });

        it.each([
            ['Enter', '{Enter}'],
            ['Space', '[Space]'],
        ])('calls the given action without opening a menu for a logged out user with the %s key', async (_, key) => {
            const onClickFn = jest.fn();
            const { queryByRole } = setup({ isAuthorizedUser: false, onClick: onClickFn });
            await userEvent.tab();
            await userEvent.keyboard(key);
            expect(onClickFn).toHaveBeenCalledTimes(1);
            expect(queryByRole('menu')).not.toBeInTheDocument();
        });

        it('closes the menu with the escape key and returns focus to the button', async () => {
            const onClickFn = jest.fn();
            const { getByRole, queryByRole } = setup({ isAuthorizedUser: true, onClick: onClickFn });
            await userEvent.tab();
            await userEvent.keyboard('{Enter}');
            await waitFor(() => expect(getByRole('menuitem')).toHaveFocus());
            await userEvent.keyboard('{Escape}');
            await waitFor(() => expect(queryByRole('menu')).not.toBeInTheDocument());
            expect(getByRole('button', { name: 'Log out' })).toHaveFocus();
            expect(onClickFn).not.toHaveBeenCalled();
        });

        it('closes the menu without firing the action when tabbing out of it', async () => {
            const onClickFn = jest.fn();
            const { getByRole, queryByRole } = setup({ isAuthorizedUser: true, onClick: onClickFn });
            await userEvent.tab();
            await userEvent.keyboard('{Enter}');
            await waitFor(() => expect(getByRole('menuitem')).toHaveFocus());
            await userEvent.tab();
            await waitFor(() => expect(queryByRole('menu')).not.toBeInTheDocument());
            expect(onClickFn).not.toHaveBeenCalled();
        });
    });
});
