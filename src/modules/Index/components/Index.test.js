import React from 'react';
import IndexComponent from './Index';
import { render, WithReduxStore, WithRouter } from 'test-utils';
import { redirectUserToPassiveLogin } from 'helpers/redirectUserToPassiveLogin';

jest.mock('helpers/redirectUserToPassiveLogin');

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <WithRouter>
                <IndexComponent {...props} />
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

    it('should attempt a passive login on mount', () => {
        setup();
        expect(redirectUserToPassiveLogin).toHaveBeenCalledTimes(1);
    });
});
