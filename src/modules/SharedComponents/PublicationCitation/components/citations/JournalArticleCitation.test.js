import React from 'react';
import JournalArticleCitation from './JournalArticleCitation';
import { journalArticle } from 'mock/data/testing/records';
import { render, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return render(
        <WithRouter>
            <JournalArticleCitation {...props} />
        </WithRouter>,
    );
}

describe('JournalArticleCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: journalArticle });
        expect(container).toMatchSnapshot();
    });
});
