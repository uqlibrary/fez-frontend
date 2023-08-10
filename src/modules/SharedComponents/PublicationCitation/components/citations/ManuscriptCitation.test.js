import React from 'react';
import ManuscriptCitation from './ManuscriptCitation';
import { manuscript } from 'mock/data/testing/records';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return rtlRender(<ManuscriptCitation {...props} />);
}

describe('ManuscriptCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: manuscript });
        expect(container).toMatchSnapshot();
    });
});
