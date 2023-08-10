import React from 'react';
import ConferencePaperCitation from './ConferencePaperCitation';
import { conferencePaper } from 'mock/data/testing/records';
import { render, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return render(
        <WithRouter>
            <ConferencePaperCitation {...props} />
        </WithRouter>,
    );
}

describe('ConferencePaperCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: conferencePaper });
        expect(container).toMatchSnapshot();
    });
});
