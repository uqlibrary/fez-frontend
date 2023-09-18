import React from 'react';
import PubmedCentralLink from './PubmedCentralLink';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        pubmedCentralId: testProps.pubmedCentralId,
    };

    return rtlRender(<PubmedCentralLink {...props} />);
}

describe('PubmedCentralLink test ', () => {
    it('should render component with empty span', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render component with pubmedCentralId', () => {
        const { container } = setup({ pubmedCentralId: 'PMC12345677' });
        expect(container).toMatchSnapshot();
    });
});
