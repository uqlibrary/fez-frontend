import React from 'react';
import ImageDocumentCitation from './ImageDocumentCitation';
import { imageDocument } from 'mock/data/testing/records';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return rtlRender(<ImageDocumentCitation {...props} />);
}

describe('ImageDocumentCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: imageDocument });
        expect(container).toMatchSnapshot();
    });
});
