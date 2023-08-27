import React from 'react';
import WorkingPaperCitation from './WorkingPaperCitation';
import { workingPaper } from 'mock/data/testing/records';
import { render, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return render(
        <WithRouter>
            <WorkingPaperCitation {...props} />
        </WithRouter>,
    );
}

describe('WorkingPaperCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: workingPaper });
        expect(container).toMatchSnapshot();
    });

    it('component with an empty doi view', () => {
        const { container } = setup({
            publication: {
                ...workingPaper,
                fez_record_search_key_doi: { rek_doi: null },
            },
        });
        expect(container).toMatchSnapshot();
    });
});
