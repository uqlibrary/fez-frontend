import React from 'react';
import ContributorLinkingField from './ContributorLinkingField';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        input: {
            onChange: () => {},
        },
        ...testProps,
    };
    return rtlRender(<ContributorLinkingField {...props} />);
}

describe('Component ContributorLinkingField', () => {
    it('should render as expected', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
});
