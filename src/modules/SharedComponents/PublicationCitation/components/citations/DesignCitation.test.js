import React from 'react';
import DesignCitation from './DesignCitation';
import { design } from 'mock/data/testing/records';
import { render, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return render(
        <WithRouter>
            <DesignCitation {...props} />
        </WithRouter>,
    );
}

describe('DesignCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: design });
        expect(container).toMatchSnapshot();
    });

    it('component with an empty source', () => {
        const { container } = setup({
            publication: {
                ...design,
                fez_record_search_key_source: { rek_source: null },
            },
        });
        expect(container).toMatchSnapshot();
    });
    it('component with a doi view', () => {
        const { container } = setup({
            publication: {
                ...design,
                fez_record_search_key_doi: { rek_doi: '10.1111/1111' },
            },
        });
        expect(container).toMatchSnapshot();
    });
});
