import React from 'react';
import ResearchReportCitation from './ResearchReportCitation';
import { researchReport } from 'mock/data/testing/records';
import { render, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return render(
        <WithRouter>
            <ResearchReportCitation {...props} />
        </WithRouter>,
    );
}

describe('ResearchReportCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: researchReport });
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record 1', () => {
        const { container } = setup({ publication: researchReport });
        expect(container).toMatchSnapshot();
    });

    it('component with an empty series view', () => {
        const { container } = setup({
            publication: {
                ...researchReport,
                fez_record_search_key_series: { rek_series: null },
            },
        });
        expect(container).toMatchSnapshot();
    });
});
