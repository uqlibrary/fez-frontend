import React from 'react';
import IndexComponent from './Index';
import { render, WithReduxStore, WithRouter } from 'test-utils';
import { redirectUserToPassiveLogin } from 'helpers/redirectUserToPassiveLogin';

jest.mock('helpers/redirectUserToPassiveLogin');

function setup(accountState = { account: null, accountLoading: false }) {
    return render(
        <WithReduxStore initialState={{ accountReducer: accountState }}>
            <WithRouter>
                <IndexComponent />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Index page', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render placeholders', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should attempt a passive login when the visitor is confirmed anonymous', () => {
        setup({ account: null, accountLoading: false });
        expect(redirectUserToPassiveLogin).toHaveBeenCalledTimes(1);
    });

    it('should NOT attempt a passive login when logged in', () => {
        setup({ account: { id: 'uqxxxxxx' }, accountLoading: false });
        expect(redirectUserToPassiveLogin).not.toHaveBeenCalled();
    });

    it('should NOT attempt a passive login while the account check is still loading', () => {
        setup({ account: null, accountLoading: true });
        expect(redirectUserToPassiveLogin).not.toHaveBeenCalled();
    });
});
