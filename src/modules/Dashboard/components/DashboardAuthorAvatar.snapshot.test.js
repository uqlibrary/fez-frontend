import React from 'react';
import DashboardAuthorAvatar from './DashboardAuthorAvatar';
import { authorDetails } from 'mock/data';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    // build full props list required by the component
    const props = {
        ...testProps,
        values: authorDetails.uqresearcher,
    };
    return rtlRender(<DashboardAuthorAvatar {...props} />);
}

describe('Dashboard Author Details test', () => {
    it('Render the authors details as expected for a UQ researcher)', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
});
