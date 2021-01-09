import React from 'react';
import { Router } from 'react-router-dom';
import { rtlRender } from 'test-utils';
import { createMemoryHistory } from 'history';

import JournalView, {
    getLicenceAttrs,
    renderBoolean,
    renderDateTime,
    renderExtLink,
    renderJournalDetail,
    renderLicence,
    renderMultiColumn,
    renderSectionContents,
} from './JournalView';

import { CREATIVE_COMMONS_LICENCES, getCreativeCommonsUrl } from 'config/general';

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
            basicDetails: [{ title: 'Test title 1', data: 'test data 1', id: 'testtitle1' }],
            oaDetails: [{ title: 'Test title 2', data: 'test data 2', id: 'testtitle2' }],
            jscieDetails: {
                tabs: [{ content: [{ title: 'Test title 3', data: 'test data 3', id: 'testtitle3' }] }],
            },
            jssciDetails: {
                tabs: [{ content: [{ title: 'Test title 4', data: 'test data 4', id: 'testtitle4' }] }],
            },
            citeScoreDetails: {
                tabs: [{ content: [{ title: 'Test title 5', data: 'test data 5', id: 'testtitle5' }] }],
            },
            indexDetails: [{ title: 'Test title 6', data: 'test data 6', id: 'testtitle6' }],
            listedDetails: [{ title: 'Test title 7', data: 'test data 7', id: 'testtitle7' }],
        });
        expect(getByTestId('journal-view')).toBeInTheDocument();
        expect(getByTestId('journal-basic-details-testtitle1-label')).toHaveTextContent('Test title 1');
        expect(getByTestId('journal-basic-details-testtitle1')).toHaveTextContent('test data 1');
        expect(getByTestId('journal-open-access-testtitle2-label')).toHaveTextContent('Test title 2');
        expect(getByTestId('journal-open-access-testtitle2')).toHaveTextContent('test data 2');
        expect(getByTestId('journal-scie-tab0-testtitle3-label')).toHaveTextContent('Test title 3');
        expect(getByTestId('journal-scie-tab0-testtitle3')).toHaveTextContent('test data 3');
        expect(getByTestId('journal-ssci-tab0-testtitle4-label')).toHaveTextContent('Test title 4');
        expect(getByTestId('journal-ssci-tab0-testtitle4')).toHaveTextContent('test data 4');
        expect(getByTestId('journal-cite-score-tab0-testtitle5-label')).toHaveTextContent('Test title 5');
        expect(getByTestId('journal-cite-score-tab0-testtitle5')).toHaveTextContent('test data 5');
        expect(getByTestId('journal-indexed-in-testtitle6-label')).toHaveTextContent('Test title 6');
        expect(getByTestId('journal-indexed-in-testtitle6')).toHaveTextContent('test data 6');
        expect(getByTestId('journal-listed-in-testtitle7-label')).toHaveTextContent('Test title 7');
        expect(getByTestId('journal-listed-in-testtitle7')).toHaveTextContent('test data 7');
    });

    describe('helper for rendering sections', () => {
        it('handles a single column row', () => {
            const { getByTestId } = rtlRender(
                renderSectionContents(
                    [{ title: 'Test title', data: 'test data', id: 'testtitle' }],
                    'journal-basic-details',
                ),
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
                            { title: 'Test title 1', data: 'test data 1', id: 'testtitle1' },
                            { title: 'Test title 2', data: 'test data 2', id: 'testtitle2' },
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
                    [[{ data: 'test data 1' }, { title: 'Test title 2', data: '', id: 'testtitle2' }]],
                    'journal-basic-details',
                ),
            );
            expect(getByTestId('journal-basic-details-field0')).toBeInTheDocument();
            expect(getByTestId('journal-basic-details-field0')).toHaveTextContent('test data 1');
            expect(queryByTestId('journal-basic-details-testtitle2')).not.toBeInTheDocument();
        });
    });

    describe('helper for rendering a multi-column row', () => {
        it('handles a column that has empty data', () => {
            expect(renderMultiColumn([{ title: 'Test title', data: '', id: 'testtitle' }])).toEqual('');
        });

        it('handles a column that has an array of data', () => {
            const { getByTestId } = rtlRender(
                renderMultiColumn(
                    [{ title: 'Test title', data: ['test', 'data'], id: 'testtitle' }],
                    0,
                    'journal-basic-details',
                ),
            );
            expect(getByTestId('journal-basic-details-testtitle')).toHaveTextContent('testdata');
        });

        it('renders test IDs for columns without titles', () => {
            const { getByTestId } = rtlRender(
                renderMultiColumn(
                    [{ title: 'Test title 1', data: 'test data 1', id: 'testtitle1' }, { data: 'test data 2' }],
                    0,
                    'journal-basic-details',
                ),
            );
            expect(getByTestId('journal-basic-details-row0-column1')).toHaveTextContent('test data 2');
        });
    });

    describe('helper for rendering a field', () => {
        it('handles multi-node data', () => {
            const { getByTestId } = rtlRender(
                renderJournalDetail(
                    {
                        title: 'Test title',
                        data: [<div key="part1">Hello</div>, ', ', <div key="part2">World!</div>],
                        id: 'testtitle',
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

    it('has a helper to render booleans', () => {
        expect(renderBoolean(true)).toBe('Yes');
        expect(renderBoolean(false)).toBe('No');
    });

    it('has a helper to render dateTime', () => {
        expect(renderDateTime('2020-02-20', 'YYYY')).toBe('2020');
    });

    it('has a helper to render an external link', () => {
        const { getByText } = rtlRender(renderExtLink('test-key-1', 'https://example.com/', 'Link title', 'Example'));
        expect(getByText('Example')).toHaveAttribute('href', 'https://example.com/');
        expect(getByText('Example')).toHaveAttribute('title', 'Link title');
        expect(getByText('Example')).toHaveAttribute('target', '_blank');
    });

    it('has a helper to get licence combination', () => {
        expect(getLicenceAttrs({ by: true, nd: true, nc: true, sa: true })).toStrictEqual([
            'cc-by-nd-nc-sa',
            getCreativeCommonsUrl('by-nd-nc-sa'),
            CREATIVE_COMMONS_LICENCES['by-nd-nc-sa'],
        ]);
    });

    it('has helper to render a licence', () => {
        const { getByText, getByTestId } = rtlRender(renderLicence('cc-by-nc', 'https://example.com/', 'Example'));
        expect(getByTestId('journal-oa-licence')).toHaveAttribute('href', 'https://example.com/');
        expect(getByText('Example')).toHaveAttribute('data-testid', 'journal-oa-licence-lookup');
    });
});
