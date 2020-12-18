import React from 'react';
import { Router } from 'react-router-dom';
import { rtlRender } from 'test-utils';
import { createMemoryHistory } from 'history';

import JournalView, { renderSectionContents, renderJournalDetail } from './JournalView';

const history = createMemoryHistory();
const testFn = jest.fn();
history.push = testFn;

function setup(testProps) {
    const props = {
        actions: {
            loadJournal: jest.fn(),
        },
        match: {
            params: {
                id: '1',
            },
        },
        ...testProps,
    };
    return rtlRender(
        <Router initialEntries={[{ pathname: '/journal/view/1' }]} history={history}>
            <JournalView {...props} />
        </Router>,
    );
}

describe('JournalView Component', () => {
    it('renders default state', () => {
        const { getByTestId } = setup();
        expect(getByTestId('journal-loading')).toBeInTheDocument();
    });

    it('renders loader', () => {
        const { getByTestId } = setup({
            journalLoading: true,
        });
        expect(getByTestId('journal-loading')).toBeInTheDocument();
    });

    it('renders load failure alert', () => {
        const { getByTestId } = setup({
            journalLoadingError: true,
        });
        expect(getByTestId('journal-load-failure-alert')).toBeInTheDocument();
    });

    it('renders loaded state', () => {
        const { getByTestId } = setup({
            journalDetailsLoaded: true,
        });
        expect(getByTestId('journal-view')).toBeInTheDocument();
    });

    describe('helper for rendering sections', () => {
        it('handles a single column row', () => {
            const { getByTestId } = rtlRender(
                renderSectionContents([{ title: 'Test title', data: 'test data' }], 'journal-basic-details'),
            );
            expect(getByTestId('journal-basic-details-testtitle')).toBeInTheDocument();
            expect(getByTestId('journal-basic-details-testtitle')).toHaveTextContent('test data');
        });

        it('handles a column with no title', () => {
            const { getByTestId } = rtlRender(renderSectionContents([{ data: 'test data' }], 'journal-basic-details'));
            expect(getByTestId('journal-basic-details-field0')).toBeInTheDocument();
        });

        it('handles rows with multiple columns', () => {
            const { getByTestId } = rtlRender(
                renderSectionContents(
                    [
                        [
                            { title: 'Test title 1', data: 'test data 1' },
                            { title: 'Test title 2', data: 'test data 2' },
                        ],
                    ],
                    'journal-basic-details',
                ),
            );
            expect(getByTestId('journal-basic-details-testtitle1')).toBeInTheDocument();
            expect(getByTestId('journal-basic-details-testtitle1')).toHaveTextContent('test data 1');
            expect(getByTestId('journal-basic-details-testtitle2')).toBeInTheDocument();
            expect(getByTestId('journal-basic-details-testtitle2')).toHaveTextContent('test data 2');
        });

        it('handles rows with missing title or data in a column', () => {
            const { getByTestId, queryByTestId } = rtlRender(
                renderSectionContents(
                    [[{ data: 'test data 1' }, { title: 'Test title 2', data: '' }]],
                    'journal-basic-details',
                ),
            );
            expect(getByTestId('journal-basic-details-row0-column0')).toBeInTheDocument();
            expect(getByTestId('journal-basic-details-row0-column0')).toHaveTextContent('test data 1');
            expect(queryByTestId('journal-basic-details-testtitle2')).not.toBeInTheDocument();
        });
    });

    describe('helper for rendering a field', () => {
        it('handles multi-node data', () => {
            const { getByTestId } = rtlRender(
                renderJournalDetail(
                    {
                        title: 'Test title',
                        data: [<div key="part1">Hello</div>, ', ', <div key="part2">World!</div>],
                    },
                    'journal-basic-details-testtitle',
                    {
                        title: { xs: 12, sm: 6, md: 3 },
                        data: { xs: 'auto' },
                    },
                ),
            );
            expect(getByTestId('journal-basic-details-testtitle')).toBeInTheDocument();
            expect(getByTestId('journal-basic-details-testtitle')).toHaveTextContent('Hello, World!');
        });
    });
});
