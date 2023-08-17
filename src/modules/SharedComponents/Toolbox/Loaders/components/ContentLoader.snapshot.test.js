import React from 'react';
import ContentLoader from './ContentLoader';
import { rtlRender } from 'test-utils';

function setup(testProps) {
    const props = { ...testProps };
    return rtlRender(<ContentLoader {...props} />);
}

describe('ContentLoader snapshots tests', () => {
    it('renders loader', () => {
        const { container } = setup({ message: 'Waiting to load...' });
        expect(container).toMatchSnapshot();
    });
});
