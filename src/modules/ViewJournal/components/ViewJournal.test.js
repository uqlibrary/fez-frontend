import React from 'react';
import * as repositories from 'repositories';
import { journalDetails } from 'mock/data/journal';

import {
    render,
    waitForElementToBeRemoved,
    WithReduxStore,
    WithRouter,
    act,
    fireEvent,
    createMatchMedia,
    waitForTextToBeRemoved,
    assertMissingElement,
    api,
    waitElementToBeInDocument,
    userEvent,
    within,
} from 'test-utils';
import ViewJournal, { getAdvisoryStatement, publishAsOASearchFacetDefaults } from './ViewJournal';
import { default as viewJournalLocale } from 'locale/viewJournal';
import { screen } from '@testing-library/react';
import { pathConfig } from 'config';
import param from 'can-param';

let mockUseLocation = {};
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(() => ({ id: 1 })),
    useLocation: () => mockUseLocation,
}));

const setup = () => {
    return render(
        <WithReduxStore>
            <WithRouter>
                <ViewJournal />
            </WithRouter>
        </WithReduxStore>,
    );
};

describe('ViewJournal', () => {
    beforeEach(() => jest.clearAllMocks());
    afterEach(() => api.reset());

    it('should display journal not found page error on 404', async () => {
        mockApi
            .onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl))
            .reply(404, { data: 'not found' });

        const { getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByText('Journal not found')).toBeInTheDocument();
    });

    it('should display error alert if journal is not loaded correctly due to other errors', async () => {
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(500);

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByTestId('alert-error-journal-load')).toBeInTheDocument();
    });

    it('should handle empty response', async () => {
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {});

        const { container, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(container).toMatchSnapshot();
    });

    it('should display journal details', async () => {
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                ...journalDetails.data,
                fez_journal_cite_score: {
                    ...journalDetails.data.fez_journal_cite_score,
                    fez_journal_cite_score_asjc_code: [
                        {
                            ...journalDetails.data.fez_journal_cite_score.fez_journal_cite_score_asjc_code[0],
                            jnl_cite_score_asjc_code_top_10_percent: false,
                        },
                    ],
                },
                fez_editorial_appointment: [
                    {
                        fez_author: {
                            aut_id: 1,
                            aut_org_username: 'uqauthor1',
                            aut_display_name: 'Author, Test',
                        },
                    },
                    {
                        fez_author: {
                            aut_id: 2,
                            aut_org_username: 'uqauthor2',
                            aut_display_name: 'Author2, Test',
                        },
                    },
                ],
            },
        });

        const { getByTestId, getByText, queryByTestId } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByTestId('page-title')).toHaveTextContent('American Journal of Public Health');

        // ***********************************************
        // Basic section
        // ***********************************************
        expect(getByTestId('journal-details-basic')).toHaveTextContent('Journal Information');
        expect(within(getByTestId('journal-details-basic')).getByTestId('help-icon')).toBeInTheDocument();
        expect(getByTestId('jnl-homepage-url-header')).toHaveTextContent('Journal home page');
        expect(getByTestId('jnl-homepage-url-value')).toHaveTextContent('https://www.hindawi.com/journals/aaa');
        expect(getByTestId('jnl-homepage-url-lookup-link')).toHaveAttribute(
            'href',
            'https://www.hindawi.com/journals/aaa',
        );

        expect(getByTestId('jnl-abbrev-title-header')).toHaveTextContent('ISO abbreviated title');
        expect(getByTestId('jnl-abbrev-title-value')).toHaveTextContent('Am. J. Public Health');

        expect(getByTestId('jnl-issn-header')).toHaveTextContent('ISSN(s)');
        expect(getByTestId('jnl-issn-0-value')).toHaveTextContent('0090-0036');
        expect(getByTestId('jnl-issn-1-value')).toHaveTextContent('1541-0048');
        expect(getByTestId('jnl-issn-0-lookup-link')).toHaveAttribute(
            'href',
            'https://resolver.library.uq.edu.au/openathens/redir?qurl=https%3A%2F%2Fulrichsweb.serialssolutions.com%2Ftitle%2F41698',
        );
        expect(getByTestId('jnl-issn-1-lookup-link')).toHaveAttribute(
            'href',
            'https://resolver.library.uq.edu.au/openathens/redir?qurl=https%3A%2F%2Fulrichsweb.serialssolutions.com%2Ftitle%2F41699',
        );

        expect(queryByTestId('jnl-issn-454151-header')).not.toBeInTheDocument();

        expect(getByTestId('jnl-publisher-header')).toHaveTextContent('Publisher');
        expect(getByTestId('jnl-publisher-value')).toHaveTextContent(
            'American Public Health Association, United States',
        );

        expect(getByTestId('jnl-is-refereed-header')).toHaveTextContent('Refereed');
        expect(getByTestId('jnl-is-refereed-value')).toHaveTextContent('Yes');

        expect(getByTestId('jnl-start-year-header')).toHaveTextContent('First year of publication');
        expect(getByTestId('jnl-start-year-value')).toHaveTextContent('1911');

        expect(getByTestId('jnl-frequency-header')).toHaveTextContent('Frequency of publication');
        expect(getByTestId('jnl-frequency-value')).toHaveTextContent('Monthly');

        expect(getByTestId('jnl-formats-header')).toHaveTextContent('Journal formats available');
        expect(getByTestId('jnl-formats-value')).toHaveTextContent('Print, Online');

        expect(getByTestId('jnl-description-header')).toHaveTextContent('Description');
        expect(getByTestId('jnl-description-value')).toHaveTextContent(
            'Contains reports of original research, demonstrations, evaluations, and other articles covering current aspects of public health.',
        );

        expect(getByTestId('jnl-type-header')).toHaveTextContent('Type of journal');
        expect(getByTestId('jnl-type-value')).toHaveTextContent('Fully Open Access');
        expect(getByTestId('jnl-type-lookup-link')).toHaveAttribute(
            'href',
            'https://resolver.library.uq.edu.au/openathens/redir?qurl=https%3A%2F%2Fdoaj.org%2Ftoc%2F1085-3375',
        );

        // **************************************************************
        // Open Access Options Section
        // **************************************************************
        expect(getByTestId('journal-details-openAccess-header')).toHaveTextContent('Open Access Options');
        expect(within(getByTestId('journal-details-openAccess')).getByTestId('help-icon')).toBeInTheDocument();

        expect(getByTestId('jnl-read-and-publish-header')).toHaveTextContent('UQ publisher agreement');
        expect(getByTestId('jnl-read-and-publish-value')).toHaveTextContent('No (exhausted)');

        expect(getByTestId('jnl-doaj-apc-average-price-header')).toHaveTextContent('Article processing charges');
        expect(getByTestId('jnl-doaj-apc-average-price-value')).toHaveTextContent('975 USD');
        expect(getByTestId('jnl-doaj-apc-average-price-lookup-link')).toHaveAttribute(
            'href',
            'https://resolver.library.uq.edu.au/openathens/redir?qurl=https%3A%2F%2Fdoaj.org%2Ftoc%2F1085-3375',
        );

        expect(getByTestId('jnl-doaj-by-sa-nd-nc-header')).toHaveTextContent('Journal licence');
        expect(getByTestId('jnl-doaj-by-sa-nd-nc-value')).toHaveTextContent(
            'Creative Commons Attribution 4.0 International (CC BY 4.0)',
        );
        expect(getByTestId('jnl-doaj-by-sa-nd-nc-lookup-link')).toHaveAttribute(
            'href',
            'https://creativecommons.org/licenses/by/4.0/deed.en',
        );

        // **************************************************************
        // Journal Discoverability Section
        // **************************************************************

        expect(getByTestId('journal-details-discoverability-header')).toHaveTextContent('Journal Discoverability');
        expect(within(getByTestId('journal-details-discoverability')).getByTestId('help-icon')).toBeInTheDocument();

        expect(getByTestId('wos-indexes-header')).toHaveTextContent('Web of Science');
        expect(getByTestId('wos-indexes-0-value')).toHaveTextContent('Arts & Humanities Citation Index (AHCI)');
        expect(getByTestId('wos-indexes-1-value')).toHaveTextContent('Emerging Sources Citation Index (ESCI)');
        expect(getByTestId('wos-indexes-2-value')).toHaveTextContent('Science Citation Index Expanded (SCIE)');
        expect(getByTestId('wos-indexes-3-value')).toHaveTextContent('Social Sciences Citation Index (SSCI)');

        expect(getByTestId('has-scopus-header')).toHaveTextContent('Scopus');
        expect(getByTestId('has-scopus-value')).toHaveTextContent('Yes');

        expect(getByTestId('has-pubmed-header')).toHaveTextContent('Pubmed');
        expect(getByTestId('has-pubmed-value')).toHaveTextContent('Yes');

        // ***********************************************************
        // Journal Quality By Ranking
        // ***********************************************************

        // ******************************************************************
        // Journal Citations Report (Clarivate)
        // ******************************************************************

        expect(getByTestId('journal-details-qualityByRanking-header')).toHaveTextContent('Journal Quality By Ranking');
        expect(within(getByTestId('journal-details-qualityByRanking')).getByTestId('help-icon')).toBeInTheDocument();

        expect(getByTestId('journal-details-tab-categories-header')).toHaveTextContent(
            'Journal Citations Report (Clarivate)',
        );

        expect(getByTestId('impact-factor-header')).toHaveTextContent('Impact factor');
        expect(getByTestId('impact-factor-value')).toHaveTextContent('4.20');

        expect(getByTestId('journal-details-tab-categories-2-heading')).toHaveTextContent(
            'Public, Environmental & Occupational Health',
        );
        expect(getByTestId('journal-details-tab-categories-3-heading')).toHaveTextContent(
            'Computer Science, Software Engineering',
        );
        expect(getByTestId('journal-details-tab-categories-0-heading')).toHaveTextContent('ARCHAEOLOGY');
        expect(getByTestId('journal-details-tab-categories-1-heading')).toHaveTextContent('ACOUSTICS');

        expect(getByTestId('ranking-header')).toHaveTextContent('Ranking');
        expect(getByTestId('ranking-value')).toHaveTextContent('N/A');

        expect(getByTestId('quartile-header')).toHaveTextContent('Quartile');
        expect(getByTestId('quartile-value')).toHaveTextContent('N/A');

        fireEvent.click(getByTestId('journal-details-tab-categories-2-heading'));

        expect(getByTestId('ranking-header')).toHaveTextContent('Ranking');
        expect(getByTestId('ranking-value')).toHaveTextContent('12/185');

        expect(getByTestId('quartile-header')).toHaveTextContent('Quartile');
        expect(getByTestId('quartile-value')).toHaveTextContent('Q1');

        fireEvent.click(getByTestId('journal-details-tab-categories-3-heading'));

        expect(getByTestId('ranking-header')).toHaveTextContent('Ranking');
        expect(getByTestId('ranking-value')).toHaveTextContent('35/107');

        expect(getByTestId('quartile-header')).toHaveTextContent('Quartile');
        expect(getByTestId('quartile-value')).toHaveTextContent('Q2');

        // ******************************************************************
        // Elsevier CiteScore
        // ******************************************************************
        expect(getByTestId('journal-details-tab-fez-journal-cite-score-asjc-code-header')).toHaveTextContent(
            'CiteScore (Elsevier)',
        );

        expect(getByTestId('jnl-cite-score-header')).toHaveTextContent('CiteScore');
        expect(getByTestId('jnl-cite-score-value')).toHaveTextContent('3.7');
        expect(getByTestId('jnl-cite-score-lookup-link')).toHaveAttribute(
            'href',
            'https://resolver.library.uq.edu.au/openathens/redir?qurl=https%3A%2F%2Fwww.scopus.com%2Fsourceid%2F19561',
        );

        expect(getByTestId('jnl-cite-score-snip-header')).toHaveTextContent('SNIP');
        expect(getByTestId('jnl-cite-score-snip-value')).toHaveTextContent('1.64');

        expect(getByTestId('jnl-cite-score-sjr-header')).toHaveTextContent('SJR');
        expect(getByTestId('jnl-cite-score-sjr-value')).toHaveTextContent('0.767');

        expect(getByTestId('journal-details-tab-fez-journal-cite-score-asjc-code-0-heading')).toHaveTextContent(
            '2739 Public Health, Environmental and Occupational Health',
        );

        expect(getByTestId('jnl-cite-score-asjc-code-rank-header')).toHaveTextContent('Ranked');
        expect(getByTestId('jnl-cite-score-asjc-code-rank-value')).toHaveTextContent('29 out of 516');

        expect(getByTestId('jnl-cite-score-asjc-code-quartile-header')).toHaveTextContent('Quartile');
        expect(getByTestId('jnl-cite-score-asjc-code-quartile-value')).toHaveTextContent('1');

        // ******************************************************************
        // Listed in
        // ******************************************************************
        expect(getByTestId('journal-details-listed-header')).toHaveTextContent(
            'Journal Quality By Recognised Listings',
        );
        expect(within(getByTestId('journal-details-listed')).getByTestId('help-icon')).toBeInTheDocument();

        expect(queryByTestId('jnl-abdc-rating-header')).toHaveTextContent(
            'Australian Business Deans Council (ABDC) Quality Rating',
        );
        expect(queryByTestId('jnl-abdc-rating-value')).toHaveTextContent('A*');
        expect(queryByTestId('jnl-abdc-for-code-lookup-header')).toHaveTextContent('ABDC Field of Research');
        expect(queryByTestId('jnl-abdc-for-code-lookup-value')).toHaveTextContent('1503 Business and Management');

        expect(getByTestId('has-nature-index-header')).toHaveTextContent('Nature Index');
        expect(getByTestId('has-nature-index-value')).toHaveTextContent('Yes');

        expect(getByTestId('jnl-era-for-code-lookup-header')).toHaveTextContent(
            'Excellence in Research for Australia (ERA)',
        );
        expect(getByTestId('jnl-era-for-code-lookup-0-value')).toHaveTextContent(
            '2010 - 1117 Public Health and Health Services',
        );
        expect(getByTestId('jnl-era-for-code-lookup-1-value')).toHaveTextContent(
            '2012 - 11 Medical and Health Sciences',
        );
        expect(getByTestId('jnl-era-for-code-lookup-2-value')).toHaveTextContent(
            '2015 - 11 Medical and Health Sciences',
        );
        expect(getByTestId('jnl-era-for-code-lookup-3-value')).toHaveTextContent(
            '2018 - 11 Medical and Health Sciences',
        );

        expect(getByTestId('has-cwts-header')).toHaveTextContent('CWTS Leiden Ranking');
        expect(getByTestId('has-cwts-value')).toHaveTextContent('Yes');

        // ******************************************************************
        // UQ Connections
        // ******************************************************************
        expect(getByTestId('journal-details-uqConnections-header')).toHaveTextContent('UQ Connections');
        expect(within(getByTestId('journal-details-uqConnections')).queryByTestId('help-icon')).not.toBeInTheDocument();

        expect(getByTestId('jnl-uq-author-count-header')).toHaveTextContent('Number of UQ Authors');
        expect(getByTestId('jnl-uq-author-count-value')).toHaveTextContent('200');

        expect(getByTestId('jnl-uq-author-publications-header')).toHaveTextContent('UQ Authored Publications');
        expect(getByTestId('jnl-uq-author-publications-value')).toHaveTextContent('View these articles in UQ eSpace');
        expect(getByTestId('jnl-uq-author-publications-lookup-link')).toHaveAttribute(
            'href',
            'http://localhost/records/search?activeFacets[ranges][Year+published][from]=2021&activeFacets[ranges][Year+published][to]=2026&searchQueryParams[mtj_jnl_id][value]=8508&searchMode=advanced&activeFacets[ranges][Author%20Id]=[1%20TO%20*]',
        );

        expect(getByTestId('jnl-editorial-staff-header')).toHaveTextContent('UQ Editorial Staff');
        expect(getByTestId('jnl-editorial-staff-0-value')).toHaveTextContent('Author, Test');
        expect(getByTestId('jnl-editorial-staff-0-lookup-link')).toHaveAttribute(
            'href',
            'https://app.library.uq.edu.au/#/authors/uqauthor1',
        );
        expect(getByTestId('jnl-editorial-staff-1-value')).toHaveTextContent('Author2, Test');
        expect(getByTestId('jnl-editorial-staff-1-lookup-link')).toHaveAttribute(
            'href',
            'https://app.library.uq.edu.au/#/authors/uqauthor2',
        );
    });

    it('should display ulr abbrev title', async () => {
        const title = 'abbrev title 1';
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                ...journalDetails.data,
                fez_journal_jcr_scie: null,
                fez_journal_jcr_ssci: null,
                fez_journal_issn: [
                    {
                        jnl_issn: '0090-0036',
                        jnl_issn_order: 1,
                        fez_ulrichs: {
                            ulr_abbrev_title: title,
                        },
                    },
                ],
            },
        });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByTestId('jnl-abbrev-title-value')).toHaveTextContent(title);
    });

    it('should display ulr abbrev title from second issn', async () => {
        const title = 'abbrev title 2';
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                ...journalDetails.data,
                fez_journal_jcr_scie: null,
                fez_journal_jcr_ssci: null,
                fez_journal_issn: [
                    {
                        jnl_issn: '0090-0036',
                        jnl_issn_order: 1,
                        fez_ulrichs: {
                            ulr_abbrev_title: null,
                        },
                    },
                    {
                        jnl_issn: '0090-0037',
                        jnl_issn_order: 2,
                        fez_ulrichs: {
                            ulr_abbrev_title: title,
                        },
                    },
                ],
            },
        });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByTestId('jnl-abbrev-title-value')).toHaveTextContent(title);
    });

    it('should display scie abbrev title', async () => {
        const title = 'abbrev title';
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                ...journalDetails.data,
                fez_journal_issn: [
                    {
                        jnl_issn: '0090-0036',
                        jnl_issn_order: 1,
                        fez_ulrichs: {
                            ulr_abbrev_title: null,
                        },
                    },
                ],
                fez_journal_jcr_scie: {
                    jnl_jcr_scie_abbrev_title: title,
                },
            },
        });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByTestId('jnl-abbrev-title-value')).toHaveTextContent(title);
    });

    it('should display ssci abbrev title', async () => {
        const title = 'abbrev title';
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                ...journalDetails.data,
                fez_journal_jcr_scie: null,
                fez_journal_issn: [
                    {
                        jnl_issn: '0090-0036',
                        jnl_issn_order: 1,
                        fez_ulrichs: {
                            ulr_abbrev_title: null,
                        },
                    },
                ],
                fez_journal_jcr_ssci: {
                    jnl_jcr_ssci_abbrev_title: title,
                },
            },
        });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByTestId('jnl-abbrev-title-value')).toHaveTextContent(title);
    });

    it('should display ulr open access url from second issn', async () => {
        const homepageUrl = 'https://homepage.url/from/issn2';
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                ...journalDetails.data,
                fez_journal_issn: [
                    {
                        jnl_issn: '0090-0036',
                        jnl_issn_order: 1,
                        fez_ulrichs: {
                            ulr_open_access: '1',
                            ulr_open_access_url: null,
                        },
                    },
                    {
                        jnl_issn: '1541-0048',
                        jnl_issn_order: 2,
                        fez_ulrichs: {
                            ulr_open_access: '1',
                            ulr_open_access_url: homepageUrl,
                        },
                    },
                ],
            },
        });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByTestId('jnl-homepage-url-header')).toHaveTextContent('Journal home page');
        expect(getByTestId('jnl-homepage-url-value')).toHaveTextContent(homepageUrl);
        expect(getByTestId('jnl-homepage-url-lookup-link')).toHaveAttribute('href', homepageUrl);
    });

    it('should display ulr open access url from doaj', async () => {
        const homepageUrl = 'https://homepage.url/from/doaj';
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                ...journalDetails.data,
                fez_journal_issn: [
                    {
                        jnl_issn: '0090-0036',
                        jnl_issn_order: 1,
                        fez_ulrichs: {
                            ulr_open_access: '0',
                            ulr_open_access_url: null,
                        },
                    },
                    {
                        jnl_issn: '1541-0048',
                        jnl_issn_order: 2,
                        fez_ulrichs: {
                            ulr_open_access: '0',
                            ulr_open_access_url: null,
                        },
                    },
                ],
                fez_journal_doaj: {
                    jnl_doaj_homepage_url: homepageUrl,
                },
            },
        });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByTestId('jnl-homepage-url-header')).toHaveTextContent('Journal home page');
        expect(getByTestId('jnl-homepage-url-value')).toHaveTextContent(homepageUrl);
        expect(getByTestId('jnl-homepage-url-lookup-link')).toHaveAttribute('href', homepageUrl);
    });

    it('should display correct type of journal', async () => {
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                ...journalDetails.data,
                fez_journal_doaj: null,
            },
        });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByTestId('jnl-type-header')).toBeInTheDocument();
        expect(getByTestId('jnl-type-value')).toHaveTextContent('Hybrid or Subscription');
    });

    it('Should show embargo details with sherpa romeo links', async () => {
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                jnl_title: 'test',
                fez_journal_issn: [
                    {
                        jnl_issn: '1111-1111',
                        jnl_issn_order: 1,
                        fez_sherpa_romeo: {
                            srm_issn: '1111-1111',
                            srm_max_embargo_amount: 6,
                            srm_journal_link: 'http://test',
                        },
                    },
                ],
            },
        });

        const { queryByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(queryByTestId('srm-journal-link-header')).toHaveTextContent('Open access with Accepted manuscript');
        expect(queryByTestId('srm-journal-link-value')).toHaveTextContent('6 months');
        expect(queryByTestId('srm-journal-link-lookup-link')).toHaveAttribute('href', 'http://test');
    });

    it('Should show embargo details from second issn even when journal link is not available', async () => {
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                jnl_title: 'test',
                fez_journal_issn: [
                    {
                        jnl_issn: '1111-1111',
                        jnl_issn_order: 1,
                        fez_sherpa_romeo: {
                            srm_issn: '1111-1111',
                            srm_journal_link: null,
                        },
                    },
                    {
                        jnl_issn: '2222-2222',
                        jnl_issn_order: 2,
                        fez_sherpa_romeo: {
                            srm_max_embargo_amount: 6,
                            srm_issn: '2222-2222',
                            srm_journal_link: null,
                        },
                    },
                ],
            },
        });

        const { queryByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(queryByTestId('srm-journal-link-header')).toHaveTextContent('Open access with Accepted manuscript');
        expect(queryByTestId('srm-journal-link-value')).toHaveTextContent('6 months');
        expect(queryByTestId('srm-journal-link-lookup-link')).not.toBeInTheDocument();
    });

    it('Should not show uq connection section when empty editorial appointment and 0 author count', async () => {
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                jnl_title: 'test',
                uq_author_id_count: 0,
                fez_journal_issn: [
                    {
                        jnl_issn: '1111-1111',
                        jnl_issn_order: 1,
                    },
                ],
                fez_editorial_appointment: [],
            },
        });

        const { queryByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(queryByTestId('journal-details-uqConnections-header')).not.toBeInTheDocument();
    });

    it('should render correct creative licenses (BY-ND)', async () => {
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                ...journalDetails.data,
                fez_journal_doaj: {
                    ...journalDetails.data.fez_journal_doaj,
                    jnl_doaj_nd: true,
                },
            },
        });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByTestId('jnl-doaj-by-sa-nd-nc-header')).toHaveTextContent('Journal licence');
        expect(getByTestId('jnl-doaj-by-sa-nd-nc-value')).toHaveTextContent(
            'Creative Commons Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0)',
        );
        expect(getByTestId('jnl-doaj-by-sa-nd-nc-lookup-link')).toHaveAttribute(
            'href',
            'https://creativecommons.org/licenses/by-nd/4.0/deed.en',
        );
    });

    it('should render correct creative licenses (BY-NC)', async () => {
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                ...journalDetails.data,
                fez_journal_doaj: {
                    ...journalDetails.data.fez_journal_doaj,
                    jnl_doaj_nc: true,
                },
            },
        });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByTestId('jnl-doaj-by-sa-nd-nc-header')).toHaveTextContent('Journal licence');
        expect(getByTestId('jnl-doaj-by-sa-nd-nc-value')).toHaveTextContent(
            'Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)',
        );
        expect(getByTestId('jnl-doaj-by-sa-nd-nc-lookup-link')).toHaveAttribute(
            'href',
            'https://creativecommons.org/licenses/by-nc/4.0/deed.en',
        );
    });

    it('should render correct creative licenses (BY-SA)', async () => {
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                ...journalDetails.data,
                fez_journal_doaj: {
                    ...journalDetails.data.fez_journal_doaj,
                    jnl_doaj_sa: true,
                },
            },
        });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByTestId('jnl-doaj-by-sa-nd-nc-header')).toHaveTextContent('Journal licence');
        expect(getByTestId('jnl-doaj-by-sa-nd-nc-value')).toHaveTextContent(
            'Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)',
        );
        expect(getByTestId('jnl-doaj-by-sa-nd-nc-lookup-link')).toHaveAttribute(
            'href',
            'https://creativecommons.org/licenses/by-sa/4.0/deed.en',
        );
    });

    // Test for title change
    it('Should correctly show required title change', async () => {
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                ...journalDetails.data,
            },
        });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        // Regex: Exact pattern Match (between start and end) - Must match exactly.
        expect(getByTestId('journal-details-uqConnections-header')).toHaveTextContent(/^UQ Connections$/);
    });

    it('should display journal details Tab width in tablet size when >1 tab shown', async () => {
        window.matchMedia = createMatchMedia(890);

        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                ...journalDetails.data,
            },
        });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByTestId('journal-details-tab-categories-0-heading')).toHaveAttribute(
            'style',
            'max-width: calc((100vw - 68px) * 0.67); width: 100%;',
        );
    });

    it('should display journal details Tab width in phone size when 1 tab shown', async () => {
        window.matchMedia = createMatchMedia(590);

        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                ...journalDetails.data,
                fez_journal_jcr_ahci: null,
                fez_journal_jcr_esci: null,
                fez_journal_jcr_ssci: null,
                fez_journal_jcr_scie: {
                    fez_journal_jcr_scie_category: [
                        {
                            ...journalDetails.data.fez_journal_jcr_scie.fez_journal_jcr_scie_category[0],
                        },
                    ],
                },
            },
        });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByTestId('journal-details-tab-categories-0-heading')).toHaveAttribute(
            'style',
            'max-width: 100%; width: 100%;',
        );
    });

    describe('Favouriting', () => {
        it('should display an error message if the journal "favourite" action fails', async () => {
            window.matchMedia = createMatchMedia(1600);
            mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
                data: {
                    ...journalDetails.data,
                },
            });
            mockApi.onPost(new RegExp(repositories.routes.JOURNAL_FAVOURITES_API().apiUrl)).reply(500, { data: '' });
            const { getByTestId, getByText, queryByTestId } = setup();

            await waitForElementToBeRemoved(() => getByText('Loading journal data'));

            expect(getByTestId('favourite-journal-notsaved')).toBeInTheDocument();
            expect(queryByTestId('alert-error')).not.toBeInTheDocument();

            await act(async () => {
                fireEvent.click(getByTestId('favourite-journal-notsaved'));

                // need some time to pass for the api call to return
                await new Promise(r => setTimeout(r, 500));
            });
            expect(getByTestId('alert-error')).toBeInTheDocument();
            expect(getByTestId('dismiss')).toBeInTheDocument();

            await act(async () => {
                fireEvent.click(getByTestId('dismiss'));
            });

            expect(queryByTestId('alert-error')).not.toBeInTheDocument();
        });
    });

    it('should display journal with advisory statement', async () => {
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                ...journalDetails.data,
                jnl_advisory_statement: 'Test advisory statement',
            },
        });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByTestId('page-title')).toHaveTextContent('American Journal of Public Health');

        expect(getByText('Test advisory statement')).toBeInTheDocument();
    });

    it('should display read and publish warning banner', async () => {
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                ...journalDetails.data,
                fez_journal_read_and_publish: {
                    jnl_read_and_publish_is_capped: 'Approaching',
                    jnl_read_and_publish_is_discounted: false,
                },
            },
        });

        const { getAllByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        const alerts = getAllByTestId('alert');
        expect(alerts[1]).toHaveTextContent(/Read and Publish Agreement/);
    });

    it('should display read and publish ceased info banner', async () => {
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                ...journalDetails.data,
                fez_journal_read_and_publish: {
                    jnl_read_and_publish_is_capped: 'NoDeal',
                    jnl_read_and_publish_is_discounted: false,
                },
            },
        });

        const { getAllByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        const alerts = getAllByTestId('alert');
        expect(alerts[1]).toHaveTextContent(/Read and Publish Agreement/);
    });

    it('Should show read and publish section when theres no read and publish agreement', async () => {
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                jnl_title: 'test',
                fez_journal_read_and_publish: null,
            },
        });

        const { queryByTestId, getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByTestId('journal-details-openAccess-header')).toBeInTheDocument();
        expect(getByTestId('jnl-read-and-publish-value')).toHaveTextContent('No');
        expect(queryByTestId('jnl-read-and-publish-caul-link-header')).not.toBeInTheDocument();
        expect(queryByTestId('jnl-read-and-publish-source-date-header')).not.toBeInTheDocument();
    });

    it('Should show read and publish section when read and publish agreement is ceased', async () => {
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                jnl_title: 'test',
                fez_journal_read_and_publish: {
                    jnl_read_and_publish_is_capped: 'NoDeal',
                    jnl_read_and_publish_publisher: 'publisher',
                    jnl_read_and_publish_source_date: '2025-01-01',
                },
            },
        });

        const { queryByTestId, getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByTestId('journal-details-openAccess-header')).toBeInTheDocument();
        expect(getByTestId('jnl-read-and-publish-value')).toHaveTextContent('No');
        expect(queryByTestId('jnl-read-and-publish-caul-link-header')).not.toBeInTheDocument();
        expect(queryByTestId('jnl-read-and-publish-source-date-header')).not.toBeInTheDocument();
    });

    describe('getAdvisoryStatement', () => {
        it('should render html', () => {
            const { getByTestId } = render(getAdvisoryStatement('<p data-testid="test">Tester</p>'));
            expect(getByTestId('test')).toHaveTextContent('Tester');
        });
        it('should render nothing (coverage)', () => {
            expect(getAdvisoryStatement()).toEqual('');
        });
    });

    describe('`Publish as OA` button', () => {
        const data = {
            ...journalDetails.data,
            fez_journal_read_and_publish: null,
        };

        afterEach(() =>
            expect(screen.queryByText(viewJournalLocale.viewJournal.notFound.title)).not.toBeInTheDocument(),
        );

        it('should not display button for non-search workflows', async () => {
            api.mock.journals.get({ id: '.*', data: { ...data } });
            setup();

            await waitForTextToBeRemoved('Loading journal data');
            assertMissingElement('publish-as-oa-button');
        });

        describe('search workflows', () => {
            beforeEach(() => {
                mockUseLocation = { search: '?fromSearch=true' };
            });

            it('should not display button when conditions are unmet', async () => {
                api.mock.journals.get({
                    id: '.*',
                    data: {
                        ...journalDetails.data,
                        fez_journal_read_and_publish: {
                            jnl_read_and_publish_is_capped: 'Y',
                        },
                    },
                });
                setup();

                await waitForTextToBeRemoved('Loading journal data');
                assertMissingElement('publish-as-oa-button');
            });

            it("should display button for search workflows when OA status = `fee` and it's not embargoed", async () => {
                window.open = jest.fn();
                api.mock.journals.get({ id: '.*', data: { ...data } });
                const { getByTestId } = setup();

                await waitElementToBeInDocument('publish-as-oa-button');
                await userEvent.click(getByTestId('publish-as-oa-button'));

                const expectedSearchParams = {
                    keywords: {
                        'Subject-453458': {
                            cvoId: '453458',
                            text: '2739 Public Health, Environmental and Occupational Health',
                            type: 'Subject',
                            id: 'Subject-453458',
                        },
                        'Subject-456676': {
                            cvoId: '456676',
                            text: 'Public, Environmental & Occupational Health',
                            type: 'Subject',
                            id: 'Subject-456676',
                        },
                        'Subject-456497': {
                            cvoId: '456497',
                            text: 'Computer Science, Software Engineering',
                            type: 'Subject',
                            id: 'Subject-456497',
                        },
                    },
                    activeFacets: {
                        filters: {
                            ...publishAsOASearchFacetDefaults,
                            'Highest quartile': ['1'],
                        },
                    },
                };
                expect(window.open).toHaveBeenCalledWith(
                    `${pathConfig.journals.search}?${param(expectedSearchParams)}`,
                    '_blank',
                    'noopener,noreferrer',
                );
            });

            describe('embargoed', () => {
                const data = {
                    ...journalDetails.data,
                    fez_journal_read_and_publish: null,
                    fez_journal_issn: [
                        {
                            ...journalDetails.data.fez_journal_issn[0],
                            fez_sherpa_romeo: {
                                ...journalDetails.data.fez_journal_issn[0].fez_sherpa_romeo,
                                srm_max_embargo_amount: 12,
                                srm_max_embargo_units: 'months',
                            },
                        },
                    ],
                };

                it('should display button for search workflows when OA status equal to `fee` and embargoed for equal or greater than 12 months', async () => {
                    api.mock.journals.get({ id: '.*', data: { ...data } });
                    setup();

                    await waitElementToBeInDocument('publish-as-oa-button');
                });

                it('should not display button for search workflows when OA status equal to `fee` and embargoed for less than 12 months', () => {
                    api.mock.journals.get({
                        id: '.*',
                        data: {
                            ...data,
                            fez_sherpa_romeo: {
                                ...data.fez_sherpa_romeo,
                                srm_max_embargo_amount: 11,
                            },
                        },
                    });
                    setup();

                    assertMissingElement('publish-as-oa-button');
                });
            });
        });
    });
});
