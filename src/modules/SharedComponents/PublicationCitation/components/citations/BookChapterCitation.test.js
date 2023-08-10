import React from 'react';
import BookChapterCitation from './BookChapterCitation';
import { bookChapter } from 'mock/data/testing/records';
import { render, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return render(
        <WithRouter>
            <BookChapterCitation {...props} />
        </WithRouter>,
    );
}

describe('BookChapterCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: bookChapter });
        expect(container).toMatchSnapshot();
    });
});
