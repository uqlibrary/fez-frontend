import React from 'react';
import BookCitation from './BookCitation';
import { book } from 'mock/data/testing/records';
import { editedBook } from 'mock/data/testing/records';
import { render, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return render(
        <WithRouter>
            <BookCitation {...props} />
        </WithRouter>,
    );
}

describe('BookCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: book });
        expect(container).toMatchSnapshot();
    });

    it('should render citation for edited book record', () => {
        const { container } = setup({ publication: editedBook });
        expect(container).toMatchSnapshot();
    });

    it('component with an empty doi view ', () => {
        const { container } = setup({ publication: { ...editedBook, fez_record_search_key_doi: { rek_doi: null } } });
        expect(container).toMatchSnapshot();
    });
});
