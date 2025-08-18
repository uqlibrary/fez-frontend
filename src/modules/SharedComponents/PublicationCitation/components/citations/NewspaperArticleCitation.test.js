import React from 'react';
import NewspaperArticleCitation from './NewspaperArticleCitation';
import { newspaperArticle } from 'mock/data/testing/records';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return rtlRender(<NewspaperArticleCitation {...props} />);
}

describe('NewspaperArticleCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: newspaperArticle });
        expect(container).toMatchSnapshot();
    });

    it('component with an empty end page view', () => {
        const { container } = setup({
            publication: {
                ...newspaperArticle,
                fez_record_search_key_end_page: { rek_end_page: null },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('component with a doi view', () => {
        const { container } = setup({
            publication: {
                ...newspaperArticle,
                fez_record_search_key_doi: { rek_doi: '10.1111/1111' },
            },
        });
        expect(container).toMatchSnapshot();
    });
});
