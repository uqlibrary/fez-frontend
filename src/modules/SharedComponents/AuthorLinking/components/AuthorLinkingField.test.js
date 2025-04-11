import React from 'react';
import AuthorLinkingField from './AuthorLinkingField';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        onChange: () => {},
        ...testProps,
    };
    return rtlRender(<AuthorLinkingField {...props} />);
}

describe('Component AuthorLinkingField', () => {
    it('should render as expected', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
});
