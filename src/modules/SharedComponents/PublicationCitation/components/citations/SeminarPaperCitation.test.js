import React from 'react';
import SeminarPaperCitation from './SeminarPaperCitation';
import { seminarPaper } from 'mock/data/testing/records';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return rtlRender(<SeminarPaperCitation {...props} />);
}

describe('SeminarPaperCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: seminarPaper });
        expect(container).toMatchSnapshot();
    });
});
