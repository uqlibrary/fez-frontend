import React from 'react';
import JournalCitation from './JournalCitation';
import { journal } from 'mock/data/testing/records';
import { render, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return render(
        <WithRouter>
            <JournalCitation {...props} />
        </WithRouter>,
    );
}

describe('JournalCitation', () => {
    it('renders with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('renders with a mock espace record', () => {
        const { container } = setup({
            publication: {
                ...journal,
                fez_record_search_key_doi: {
                    rek_doi: '10.14264/186337',
                },
            },
        });
        expect(container).toMatchSnapshot();
    });
});
