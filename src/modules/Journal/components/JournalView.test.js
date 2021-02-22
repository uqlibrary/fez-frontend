import React from 'react';
import { Router } from 'react-router-dom';
import { rtlRender } from 'test-utils';
import { createMemoryHistory } from 'history';

import JournalView, {
    renderBoolean,
    renderData,
    renderDateTime,
    renderExtLink,
    renderJournalDetail,
    renderMultiColumn,
    renderSectionContents,
} from './JournalView';

import pagesLocale from 'locale/pages';
const txt = pagesLocale.pages.journal.view;

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
            indexDetails: [{ title: 'Test title 6', data: ['test data 6'], id: 'testtitle6' }],
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

    describe('data renderer', () => {
        it('renders licence', () => {
            const { getByTestId } = rtlRender(
                renderData({ id: 'licence', data: { by: true, nd: true, nc: true, sa: true } }),
            );
            expect(getByTestId('journal-oa-licence')).toBeInTheDocument();
            expect(getByTestId('journal-oa-licence')).toHaveAttribute(
                'href',
                'https://creativecommons.org/licenses/by-nc-nd-sa/3.0/deed.en_US',
            );
        });

        it('renders boolean', () => {
            expect(renderData({ id: 'url-refereed', data: true })).toBe('Yes');
        });

        it('renders dateTime entries', () => {
            const testValues = [
                {
                    input: { id: 'doaj-last-updated', data: '2020-02-20T12:00:00' },
                    output: '20th February 2020 at 12:00pm',
                },
                {
                    input: { id: 'jcr-source-date', data: '2020-02-20' },
                    output: '2020',
                },
                {
                    input: { id: 'adbc-source-date', data: '2020-02-20' },
                    output: '20th February 2020',
                },
                {
                    input: { id: 'cwts-source-year', data: { status: true, year: '2020' } },
                    output: 'Yes, 2020',
                },
                {
                    input: { id: 'cwts-source-year', data: { status: true, year: '' } },
                    output: 'Yes',
                },
                {
                    input: { id: 'cwts-source-year', data: { status: false } },
                    output: 'No',
                },
                {
                    input: { id: 'nature-index-source-date', data: { status: true, date: '2020-02-20' } },
                    output: 'Yes, 20th February 2020',
                },
                {
                    input: { id: 'nature-index-source-date', data: { status: false, date: '' } },
                    output: 'No',
                },
            ];
            testValues.map(item => {
                expect(renderData(item.input)).toBe(item.output);
            });
        });

        describe('external links', () => {
            it('renders url-only variant', () => {
                const testIds = ['ulr-open-access-url', 'doaj-homepage-url'];
                testIds.map((id, index) => {
                    const { getByText } = rtlRender(renderData({ id, data: `test${index}` }));
                    expect(getByText(`test${index}`)).toHaveAttribute('href', `test${index}`);
                });
            });

            it('renders passed-in attributes variant', () => {
                const testIds = ['jcr-home-page', 'cite-score-more-info'];
                testIds.map((id, index) => {
                    const { getByText } = rtlRender(
                        renderData({
                            id,
                            data: { href: `test-url${index}`, title: `test-title${index}`, text: `test${index}` },
                        }),
                    );
                    expect(getByText(`test${index}`)).toHaveAttribute('href', `test-url${index}`);
                });
            });

            it('renders hardcoded variant', () => {
                const testValues = [
                    {
                        input: { id: 'doaj-journal-url', data: 'test1' },
                        output: {
                            url: `${txt.links.doajJournalUrl.linkPrefix}test1`,
                            text: 'test1',
                        },
                    },
                    {
                        input: { id: 'jcr-more-info', data: 'test1' },
                        output: {
                            url: `${txt.links.jcrMoreInfo.linkPrefix}test1/`,
                            text: `${txt.links.jcrMoreInfo.textPrefix} TEST1`,
                        },
                    },
                    {
                        input: { id: 'cite-score-source', data: 'test1' },
                        output: {
                            url: `${txt.links.citeScoreSource.linkPrefix}test1`,
                            text: txt.links.citeScoreSource.text,
                        },
                    },
                ];
                testValues.map(testValue => {
                    const { getByText } = rtlRender(renderData(testValue.input));
                    expect(getByText(testValue.output.text)).toHaveAttribute('href', testValue.output.url);
                });
            });

            it('renders sets of links', () => {
                const ulrichsColumn = {
                    id: 'ulr-title-link',
                    data: [
                        { ulr_title_id: '1234', ulr_title: 'test1' },
                        { ulr_title_id: '5678', ulr_title: 'test2' },
                    ],
                };
                const { getByText } = rtlRender(renderData(ulrichsColumn));
                expect(getByText('test1')).toHaveAttribute(
                    'href',
                    'http://ezproxy.library.uq.edu.au/login?url=http://ulrichsweb.serialssolutions.com/title/1234',
                );
                expect(getByText('test2')).toHaveAttribute(
                    'href',
                    'http://ezproxy.library.uq.edu.au/login?url=http://ulrichsweb.serialssolutions.com/title/5678',
                );

                const sherpaColumn = {
                    id: 'srm-journal-link',
                    data: [
                        { srm_journal_link: 'https://example.com/1', srm_issn: '1234-5678' },
                        { srm_journal_link: 'https://example.com/2', srm_issn: '1234-5679' },
                    ],
                };
                rtlRender(renderData(sherpaColumn));
                expect(getByText('1234-5678')).toHaveAttribute('href', 'https://example.com/1');
                expect(getByText('1234-5679')).toHaveAttribute('href', 'https://example.com/2');
            });
        });

        it('renders list of wos categories', () => {
            const detail = {
                id: 'wos-category-ahci',
                data: [
                    { jnl_wos_category_index: 'ahci', jnl_wos_category: 'category1|category2' },
                    { jnl_wos_category_index: 'ahci', jnl_wos_category: 'category3' },
                    { jnl_wos_category_index: 'ahci', jnl_wos_category: '' },
                ],
            };
            const { getByText } = rtlRender(renderData(detail));
            expect(getByText('category1')).toHaveAttribute('data-testid', 'wos-ahci0-category0');
            expect(getByText('category2')).toHaveAttribute('data-testid', 'wos-ahci0-category1');
            expect(getByText('category3')).toHaveAttribute('data-testid', 'wos-ahci1-category0');
        });

        it('renders ERA FoR codes', () => {
            const detail = {
                id: 'era-for-code',
                data: [
                    {
                        jnl_era_source_year: '2020',
                        fez_journal_era_for_code: [
                            {
                                jnl_era_for_code_lookup: 'Code 1',
                            },
                            {
                                jnl_era_for_code_lookup: 'Code 2',
                            },
                        ],
                    },
                    {
                        jnl_era_source_year: '2021',
                    },
                ],
            };
            const { getByText } = rtlRender(renderData(detail));
            expect(getByText('2020: Code 1, Code 2')).toHaveAttribute('data-testid', 'journal-era-category0');
            expect(renderData({ id: 'era-for-code', data: '' })).toBe('');
        });
    });
});
