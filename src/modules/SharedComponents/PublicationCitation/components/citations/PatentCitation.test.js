import React from 'react';
import PatentCitation from './PatentCitation';
import { patent } from 'mock/data/testing/records';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return rtlRender(<PatentCitation {...props} />);
}

describe('PatentCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: patent });
        expect(container).toMatchSnapshot();
    });
});
