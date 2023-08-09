import React from 'react';
import IndexComponent from './Index';
import { render, WithReduxStore, WithRouter } from 'test-utils';

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
    it('should render placeholders', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
});
