import React from 'react';
import ConferenceProceedingsCitation from './ConferenceProceedingsCitation';
import { conferenceProceedings } from 'mock/data/testing/records';
import { render, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return render(
        <WithRouter>
            <ConferenceProceedingsCitation {...props} />
        </WithRouter>,
    );
}

describe('ConferenceProceedingsCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: conferenceProceedings });
        expect(container).toMatchSnapshot();
    });

    it('component with an empty doi view ', () => {
        const { container } = setup({
            publication: { ...conferenceProceedings, fez_record_search_key_doi: { rek_doi: null } },
        });
        expect(container).toMatchSnapshot();
    });
});
