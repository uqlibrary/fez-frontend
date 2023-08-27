import React from 'react';
import AudioDocumentCitation from './AudioDocumentCitation';
import { audioDocument } from 'mock/data/testing/records';
import { render, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return render(
        <WithRouter>
            <AudioDocumentCitation {...props} />
        </WithRouter>,
    );
}

describe('AudioDocumentCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: audioDocument });
        expect(container).toMatchSnapshot();
    });

    it('component with an empty doi view ', () => {
        const { container } = setup({ publication: { ...audioDocument, fez_record_search_key_doi: {} } });
        expect(container).toMatchSnapshot();
    });
});
