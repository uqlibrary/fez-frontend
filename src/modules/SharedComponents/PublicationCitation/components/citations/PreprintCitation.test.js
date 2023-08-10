import React from 'react';
import PreprintCitation from './PreprintCitation';
import { preprint } from 'mock/data/testing/records';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return rtlRender(<PreprintCitation {...props} />);
}

describe('PreprintCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: preprint });
        expect(container).toMatchSnapshot();
    });
});
