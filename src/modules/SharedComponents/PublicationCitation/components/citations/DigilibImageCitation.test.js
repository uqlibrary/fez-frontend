import React from 'react';
import DigilibImageCitation from './DigilibImageCitation';
import { digilibImage } from 'mock/data/testing/records';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return rtlRender(<DigilibImageCitation {...props} />);
}

describe('DigilibImageCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: digilibImage });
        expect(container).toMatchSnapshot();
    });
});
