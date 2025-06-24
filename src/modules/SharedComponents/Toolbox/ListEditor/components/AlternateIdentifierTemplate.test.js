import React from 'react';
import { AlternateIdentifierTemplate } from './AlternateIdentifierTemplate';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        item: {},
        ...testProps,
    };
    return rtlRender(<AlternateIdentifierTemplate {...props} />);
}

describe('AlternateIdentifierTemplate component', () => {
    it('should render default view', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });
});
