import React from 'react';
import VideoDocumentCitation from './VideoDocumentCitation';
import { videoDocument } from 'mock/data/testing/records';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        classes: {},
        ...testProps,
        publication: testProps.publication || {},
    };
    return rtlRender(<VideoDocumentCitation {...props} />);
}

describe('VideoDocumentCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: videoDocument });
        expect(container).toMatchSnapshot();
    });
});
