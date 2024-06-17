import React from 'react';
import GenericDocumentCitation from './GenericDocumentCitation';
import { generic } from 'mock/data/testing/records';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return rtlRender(<GenericDocumentCitation {...props} />);
}

describe('GenericDocumentCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: generic });
        expect(container).toMatchSnapshot();
    });

    it('component with an empty publisher and title', () => {
        const { container } = setup({
            publication: {
                ...generic,
                fez_record_search_key_publisher: { rek_publisher: null },
                rek_title: null,
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('component when no title', () => {
        delete generic.rek_title;
        const { container } = setup({
            publication: generic,
        });
        expect(container).toMatchSnapshot();
    });

    it('component with a doi view', () => {
        const { container } = setup({
            publication: {
                ...generic,
                fez_record_search_key_doi: { rek_doi: '10.1111/1111' },
            },
        });
        expect(container).toMatchSnapshot();
    });
});
