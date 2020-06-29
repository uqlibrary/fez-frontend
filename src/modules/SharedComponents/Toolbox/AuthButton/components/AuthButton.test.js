import React from 'react';
import { rtlRender, fireEvent } from 'test-utils';
import AuthButton from '../components/AuthButton';

function setup(testProps = {}) {
    return rtlRender(
        <AuthButton
            ariaLabel="Log in/Log out button"
            signInTooltipText="Please log in"
            signOutTooltipText="Log out"
            onClick={jest.fn()}
            {...testProps}
        />,
    );
}

describe('AuthButton snapshots test', () => {
    it('renders logged out status', () => {
        const { getByTestId, getByTitle } = setup({ isAuthorizedUser: false });
        expect(getByTestId('logged-out-icon')).toBeInTheDocument();
        expect(getByTitle('Please log in')).toBeInTheDocument();
    });

    it('renders logged in user status', () => {
        const { getByTestId, getByTitle } = setup({ isAuthorizedUser: true });
        expect(getByTestId('logged-in-icon')).toBeInTheDocument();
        expect(getByTitle('Log out')).toBeInTheDocument();
    });

    it('should fire a given action on clicking the button', () => {
        const onClickFn = jest.fn();
        const { getByTestId } = setup({ isAuthorizedUser: true, onClick: onClickFn });
        fireEvent.click(getByTestId('logged-in-icon'));
        expect(onClickFn).toHaveBeenCalled();
    });
});
