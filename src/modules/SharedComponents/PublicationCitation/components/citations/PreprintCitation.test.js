import React from 'react';
import PreprintCitation from './PreprintCitation';
import { preprint } from 'mock/data/testing/records';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return rtlRender(<PreprintCitation {...props} />);
}

describe('PreprintCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: preprint });
        expect(container).toMatchSnapshot();
    });

    it('component with a doi view', () => {
        const { container } = setup({
            publication: {
                ...preprint,
                fez_record_search_key_doi: { rek_doi: '10.1111/1111' },
            },
        });
        expect(container).toMatchSnapshot();
    });
});
