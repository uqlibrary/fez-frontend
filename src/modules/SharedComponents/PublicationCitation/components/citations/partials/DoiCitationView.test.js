import React from 'react';
import DoiCitationView from './DoiCitationView';
import { render, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    // build full props list required by the component
    const props = {
        classes: {},
        ...testProps,
    };
    return render(
        <WithRouter>
            <DoiCitationView {...props} />
        </WithRouter>,
    );
}

describe('DoiCitationView test ', () => {
    it('should render component with empty span', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render component with doi', () => {
        const { container } = setup({ doi: '10.121212/lskdjflsdjf' });
        expect(container).toMatchSnapshot();
    });

    it('should render doi without external link', () => {
        const { container } = setup({ doi: '10.121212/lskdjflsdjf', hideDoiLink: true });
        expect(container).toMatchSnapshot();
    });
});
