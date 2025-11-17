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
} from 'test-utils';
import ViewJournal, { getAdvisoryStatement } from './ViewJournal';
import { default as viewJournalLocale } from 'locale/viewJournal';
import { screen } from '@testing-library/react';
import { pathConfig } from '../../../config';

let mockUseLocation = {};
const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(() => ({ id: 1 })),
    useLocation: () => mockUseLocation,
    useNavigate: () => mockUseNavigate,
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
        expect(getByTestId('ulr-abbrev-title-header')).toHaveTextContent('ISO abbreviated title');
        expect(getByTestId('ulr-abbrev-title-value')).toHaveTextContent('Am. J. Public Health');

        expect(getByTestId('jnl-issn-header')).toHaveTextContent('ISSN(s)');
        expect(getByTestId('jnl-issn-0-value')).toHaveTextContent('0090-0036');
        expect(getByTestId('jnl-issn-1-value')).toHaveTextContent('1541-0048');

        expect(queryByTestId('jnl-issn-454151-header')).not.toBeInTheDocument();

        expect(getByTestId('jnl-publisher-header')).toHaveTextContent('Publisher');
        expect(getByTestId('jnl-publisher-value')).toHaveTextContent(
            'American Public Health Association, United States',
        );

        expect(getByTestId('ulr-refereed-header')).toHaveTextContent('Refereed');
        expect(getByTestId('ulr-refereed-value')).toHaveTextContent('Yes');

        expect(getByTestId('ulr-start-year-header')).toHaveTextContent('First year of publication');
        expect(getByTestId('ulr-start-year-value')).toHaveTextContent('1911');

        expect(getByTestId('ulr-frequency-header')).toHaveTextContent('Frequency of publication');
        expect(getByTestId('ulr-frequency-value')).toHaveTextContent('Monthly');

        expect(getByTestId('ulr-formats-header')).toHaveTextContent('Journal formats available');
        expect(getByTestId('ulr-formats-value')).toHaveTextContent('Print');

        expect(getByTestId('jnl-homepage-url-header')).toHaveTextContent('Journal home page');
        expect(getByTestId('jnl-homepage-url-value')).toHaveTextContent('https://www.hindawi.com/journals/aaa');
        expect(getByTestId('jnl-homepage-url-lookup-link')).toHaveAttribute(
            'href',
            'https://www.hindawi.com/journals/aaa',
        );

        expect(getByTestId('ulr-description-header')).toHaveTextContent('Description');
        expect(getByTestId('ulr-description-value')).toHaveTextContent(
            'Contains reports of original research, demonstrations, evaluations, and other articles covering current aspects of public health.',
        );

        expect(getByTestId('ulr-title-header')).toHaveTextContent('View journal in Ulrichs');
        expect(getByTestId('ulr-title-0-value')).toHaveTextContent('American Journal of Public Health');
        expect(getByTestId('ulr-title-0-lookup-link')).toHaveAttribute(
            'href',
            'https://resolver.library.uq.edu.au/openathens/redir?qurl=https%3A%2F%2Fulrichsweb.serialssolutions.com%2Ftitle%2F41698',
        );
        expect(getByTestId('ulr-title-1-lookup-link')).toHaveAttribute(
            'href',
            'https://resolver.library.uq.edu.au/openathens/redir?qurl=https%3A%2F%2Fulrichsweb.serialssolutions.com%2Ftitle%2F41699',
        );

        // **************************************************************
        // Publisher Agreements Section
        // **************************************************************
        expect(getByTestId('journal-details-readAndPublish-header')).toHaveTextContent('Publisher agreements');

        expect(getByTestId('jnl-read-and-publish-header')).toHaveTextContent('Read and publish agreement');
        expect(getByTestId('jnl-read-and-publish-link-prefix')).toHaveTextContent('Yes, via Publisher');
        expect(getByTestId('jnl-read-and-publish-lookup-link')).toHaveAttribute(
            'href',
            'https://web.library.uq.edu.au/research-and-publish/open-research/read-and-publish-agreements',
        );

        expect(getByTestId('jnl-read-and-publish-source-date-header')).toHaveTextContent('Last updated');
        expect(getByTestId('jnl-read-and-publish-source-date-value')).toHaveTextContent('28th January 2021');

        // **************************************************************
        // Open Access (Directory of Open Access Journals - DOAJ) Section
        // **************************************************************
        expect(getByTestId('journal-details-doaj-header')).toHaveTextContent(
            'Open Access (Directory of Open Access Journals - DOAJ',
        );

        expect(getByTestId('ulr-open-access-header')).toHaveTextContent('Open access');
        expect(getByTestId('ulr-open-access-value')).toHaveTextContent('Yes');

        expect(getByTestId('jnl-doaj-apc-average-price-header')).toHaveTextContent('Article processing charges');
        expect(getByTestId('jnl-doaj-apc-average-price-value')).toHaveTextContent('975 USD');

        expect(getByTestId('jnl-doaj-by-sa-nd-nc-header')).toHaveTextContent('Journal licence');
        expect(getByTestId('jnl-doaj-by-sa-nd-nc-value')).toHaveTextContent(
            'Creative Commons Attribution 4.0 International (CC BY 4.0)',
        );
        expect(getByTestId('jnl-doaj-by-sa-nd-nc-lookup-link')).toHaveAttribute(
            'href',
            'https://creativecommons.org/licenses/by/4.0/deed.en',
        );

        expect(getByTestId('jnl-doaj-last-updated-header')).toHaveTextContent('Last updated');
        expect(getByTestId('jnl-doaj-last-updated-value')).toHaveTextContent('3rd February 2020 at 2:17pm');

        expect(getByTestId('ulr-open-access-jnl-issn-header')).toHaveTextContent('View in DOAJ');
        expect(getByTestId('ulr-open-access-jnl-issn-value')).toHaveTextContent('0090-0036');
        expect(getByTestId('ulr-open-access-jnl-issn-lookup-link')).toHaveAttribute(
            'href',
            'https://doaj.org/toc/0090-0036',
        );

        expect(getByTestId('srm-journal-link-header')).toHaveTextContent('Open Policy Finder');
        expect(getByTestId('srm-journal-link-value')).toHaveTextContent("View journal's open access policy");
        expect(getByTestId('srm-journal-link-lookup-link')).toHaveAttribute(
            'href',
            'https://v2.sherpa.ac.uk/id/publication/10303',
        );

        // ***********************************************************
        // Clarivate Journal Citation Reports - Science Citation Index
        // ***********************************************************
        expect(getByTestId('jnl-jcr-scie-abbrev-title-header')).toHaveTextContent('Abbreviated title');
        expect(getByTestId('jnl-jcr-scie-abbrev-title-value')).toHaveTextContent('Am. J. Public Health');

        expect(getByTestId('jnl-jcr-scie-impact-factor-header')).toHaveTextContent('Impact factor');
        expect(getByTestId('jnl-jcr-scie-impact-factor-value')).toHaveTextContent('5.381');

        expect(getByTestId('jnl-jcr-scie-5yr-impact-factor-header')).toHaveTextContent('5 year impact factor');
        expect(getByTestId('jnl-jcr-scie-5yr-impact-factor-value')).toHaveTextContent('5.600');

        expect(getByTestId('jnl-jcr-scie-source-date-header')).toHaveTextContent('JCR version');
        expect(getByTestId('jnl-jcr-scie-source-date-value')).toHaveTextContent('2018');

        expect(getByTestId('jcr-home-page-scie-header')).toHaveTextContent('JCR home page');
        expect(getByTestId('jcr-home-page-scie-value')).toHaveTextContent('Go to JCR website');
        expect(getByTestId('jcr-home-page-scie-lookup-link')).toHaveAttribute(
            'href',
            'https://resolver.library.uq.edu.au/openathens/redir?qurl=https%3A%2F%2Fjcr.clarivate.com',
        );

        expect(getByTestId('jcr-more-info-scie-header')).toHaveTextContent('JCR more info');
        expect(getByTestId('jcr-more-info-scie-value')).toHaveTextContent('More info about JCR SCIE');
        expect(getByTestId('jcr-more-info-scie-lookup-link')).toHaveAttribute(
            'href',
            'https://clarivate.com/academia-government/scientific-and-academic-research/research-funding-analytics/journal-citation-reports/',
        );

        expect(getByTestId('journal-details-tab-fez-journal-jcr-scie-category-0-heading')).toHaveTextContent(
            'Public, Environmental & Occupational Health',
        );
        expect(getByTestId('journal-details-tab-fez-journal-jcr-scie-category-1-heading')).toHaveTextContent(
            'Computer Science, Software Engineering',
        );

        expect(getByTestId('jnl-jcr-scie-category-ranking-header')).toHaveTextContent('Ranking');
        expect(getByTestId('jnl-jcr-scie-category-ranking-value')).toHaveTextContent('12/185');

        expect(getByTestId('jnl-jcr-scie-category-quartile-header')).toHaveTextContent('Quartile');
        expect(getByTestId('jnl-jcr-scie-category-quartile-value')).toHaveTextContent('Q1');

        expect(getByTestId('jnl-jcr-scie-category-jif-percentile-header')).toHaveTextContent('JIF Percentile');
        expect(getByTestId('jnl-jcr-scie-category-jif-percentile-value')).toHaveTextContent('89.99');

        fireEvent.click(getByTestId('journal-details-tab-fez-journal-jcr-scie-category-1-heading'));

        expect(getByTestId('jnl-jcr-scie-category-ranking-header')).toHaveTextContent('Ranking');
        expect(getByTestId('jnl-jcr-scie-category-ranking-value')).toHaveTextContent('35/107');

        expect(getByTestId('jnl-jcr-scie-category-quartile-header')).toHaveTextContent('Quartile');
        expect(getByTestId('jnl-jcr-scie-category-quartile-value')).toHaveTextContent('Q2');

        expect(queryByTestId('jnl-jcr-scie-category-jif-percentile-header')).not.toBeInTheDocument();
        expect(queryByTestId('jnl-jcr-scie-category-jif-percentile-value')).not.toBeInTheDocument();

        // ******************************************************************
        // Clarivate Journal Citation Reports - Social Science Citation index
        // ******************************************************************
        expect(getByTestId('jnl-jcr-ssci-abbrev-title-header')).toHaveTextContent('Abbreviated title');
        expect(getByTestId('jnl-jcr-ssci-abbrev-title-value')).toHaveTextContent('Am. J. Public Health');

        expect(getByTestId('jnl-jcr-ssci-impact-factor-header')).toHaveTextContent('Impact factor');
        expect(getByTestId('jnl-jcr-ssci-impact-factor-value')).toHaveTextContent('5.381');

        expect(getByTestId('jnl-jcr-ssci-5yr-impact-factor-header')).toHaveTextContent('5 year impact factor');
        expect(getByTestId('jnl-jcr-ssci-5yr-impact-factor-value')).toHaveTextContent('5.600');

        expect(getByTestId('jnl-jcr-ssci-source-date-header')).toHaveTextContent('JCR version');
        expect(getByTestId('jnl-jcr-ssci-source-date-value')).toHaveTextContent('2018');

        expect(getByTestId('jcr-home-page-ssci-header')).toHaveTextContent('JCR home page');
        expect(getByTestId('jcr-home-page-ssci-value')).toHaveTextContent('Go to JCR website');
        expect(getByTestId('jcr-home-page-ssci-lookup-link')).toHaveAttribute(
            'href',
            'https://resolver.library.uq.edu.au/openathens/redir?qurl=https%3A%2F%2Fjcr.clarivate.com',
        );

        expect(getByTestId('jcr-more-info-ssci-header')).toHaveTextContent('JCR more info');
        expect(getByTestId('jcr-more-info-ssci-value')).toHaveTextContent('More info about JCR SSCI');
        expect(getByTestId('jcr-more-info-ssci-lookup-link')).toHaveAttribute(
            'href',
            'https://clarivate.com/academia-government/scientific-and-academic-research/research-funding-analytics/journal-citation-reports/',
        );

        expect(getByTestId('journal-details-tab-fez-journal-jcr-ssci-category-0-heading')).toHaveTextContent(
            'Public, Environmental & Occupational Health',
        );

        expect(getByTestId('jnl-jcr-ssci-category-ranking-header')).toHaveTextContent('Ranking');
        expect(getByTestId('jnl-jcr-ssci-category-ranking-value')).toHaveTextContent('6/162');

        expect(getByTestId('jnl-jcr-ssci-category-quartile-header')).toHaveTextContent('Quartile');
        expect(getByTestId('jnl-jcr-ssci-category-quartile-value')).toHaveTextContent('Q1');

        expect(getByTestId('jnl-jcr-ssci-category-jif-percentile-header')).toHaveTextContent('JIF Percentile');
        expect(getByTestId('jnl-jcr-ssci-category-jif-percentile-value')).toHaveTextContent('99.00');

        // ***********************************************************
        // Clarivate Journal Citation Reports - Arts & Humanities Citation Index
        // ***********************************************************
        expect(getByTestId('jnl-jcr-ahci-abbrev-title-header')).toHaveTextContent('Abbreviated title');
        expect(getByTestId('jnl-jcr-ahci-abbrev-title-value')).toHaveTextContent('J ARCHAEOL RES');

        expect(getByTestId('jnl-jcr-ahci-impact-factor-header')).toHaveTextContent('Impact factor');
        expect(getByTestId('jnl-jcr-ahci-impact-factor-value')).toHaveTextContent('4.20');

        expect(getByTestId('jnl-jcr-ahci-5yr-impact-factor-header')).toHaveTextContent('5 year impact factor');
        expect(getByTestId('jnl-jcr-ahci-5yr-impact-factor-value')).toHaveTextContent('4.40');

        expect(getByTestId('jnl-jcr-ahci-source-date-header')).toHaveTextContent('JCR version');
        expect(getByTestId('jnl-jcr-ahci-source-date-value')).toHaveTextContent('2018');

        expect(getByTestId('jcr-home-page-ahci-header')).toHaveTextContent('JCR home page');
        expect(getByTestId('jcr-home-page-ahci-value')).toHaveTextContent('Go to JCR website');
        expect(getByTestId('jcr-home-page-ahci-lookup-link')).toHaveAttribute(
            'href',
            'https://resolver.library.uq.edu.au/openathens/redir?qurl=https%3A%2F%2Fjcr.clarivate.com',
        );

        expect(getByTestId('jcr-more-info-ahci-header')).toHaveTextContent('JCR more info');
        expect(getByTestId('jcr-more-info-ahci-value')).toHaveTextContent('More info about JCR AHCI');
        expect(getByTestId('jcr-more-info-ahci-lookup-link')).toHaveAttribute(
            'href',
            'https://clarivate.com/products/scientific-and-academic-research/research-discovery-and-workflow-solutions/webofscience-platform/web-of-science-core-collection/arts-humanities-citation-index/',
        );

        expect(getByTestId('journal-details-tab-fez-journal-jcr-ahci-category-0-heading')).toHaveTextContent(
            'ARCHAEOLOGY',
        );

        expect(getByTestId('jnl-jcr-ahci-category-ranking-header')).toHaveTextContent('Ranking');
        expect(getByTestId('jnl-jcr-ahci-category-ranking-value')).toHaveTextContent('N/A');

        expect(getByTestId('jnl-jcr-ahci-category-quartile-header')).toHaveTextContent('Quartile');
        expect(getByTestId('jnl-jcr-ahci-category-quartile-value')).toHaveTextContent('N/A');

        expect(queryByTestId('jnl-jcr-ahci-category-jif-percentile-header')).not.toBeInTheDocument();
        expect(queryByTestId('jnl-jcr-ahci-category-jif-percentile-value')).not.toBeInTheDocument();

        // ***********************************************************
        // Clarivate Journal Citation Reports - Emerging Sources Citation Index
        // ***********************************************************
        expect(getByTestId('jnl-jcr-esci-abbrev-title-header')).toHaveTextContent('Abbreviated title');
        expect(getByTestId('jnl-jcr-esci-abbrev-title-value')).toHaveTextContent('J ACOUST SOC KOREA');

        expect(getByTestId('jnl-jcr-esci-impact-factor-header')).toHaveTextContent('Impact factor');
        expect(getByTestId('jnl-jcr-esci-impact-factor-value')).toHaveTextContent('0.20');

        expect(getByTestId('jnl-jcr-esci-5yr-impact-factor-header')).toHaveTextContent('5 year impact factor');
        expect(getByTestId('jnl-jcr-esci-5yr-impact-factor-value')).toHaveTextContent('0.20');

        expect(getByTestId('jnl-jcr-esci-source-date-header')).toHaveTextContent('JCR version');
        expect(getByTestId('jnl-jcr-esci-source-date-value')).toHaveTextContent('2018');

        expect(getByTestId('jcr-home-page-esci-header')).toHaveTextContent('JCR home page');
        expect(getByTestId('jcr-home-page-esci-value')).toHaveTextContent('Go to JCR website');
        expect(getByTestId('jcr-home-page-esci-lookup-link')).toHaveAttribute(
            'href',
            'https://resolver.library.uq.edu.au/openathens/redir?qurl=https%3A%2F%2Fjcr.clarivate.com',
        );

        expect(getByTestId('jcr-more-info-esci-header')).toHaveTextContent('JCR more info');
        expect(getByTestId('jcr-more-info-esci-value')).toHaveTextContent('More info about JCR ESCI');
        expect(getByTestId('jcr-more-info-esci-lookup-link')).toHaveAttribute(
            'href',
            'https://clarivate.com/products/scientific-and-academic-research/research-discovery-and-workflow-solutions/webofscience-platform/web-of-science-core-collection/emerging-sources-citation-index/',
        );

        expect(getByTestId('journal-details-tab-fez-journal-jcr-esci-category-0-heading')).toHaveTextContent(
            'ACOUSTICS',
        );

        expect(getByTestId('jnl-jcr-esci-category-ranking-header')).toHaveTextContent('Ranking');
        expect(getByTestId('jnl-jcr-esci-category-ranking-value')).toHaveTextContent('39/40');

        expect(getByTestId('jnl-jcr-esci-category-quartile-header')).toHaveTextContent('Quartile');
        expect(getByTestId('jnl-jcr-esci-category-quartile-value')).toHaveTextContent('Q4');

        expect(queryByTestId('jnl-jcr-esci-category-jif-percentile-header')).not.toBeInTheDocument();
        expect(queryByTestId('jnl-jcr-esci-category-jif-percentile-value')).not.toBeInTheDocument();

        // ******************************************************************
        // Elsevier CiteScore
        // ******************************************************************
        expect(getByTestId('jnl-cite-score-source-year-header')).toHaveTextContent('CiteScore version');
        expect(getByTestId('jnl-cite-score-source-year-value')).toHaveTextContent('2019');

        expect(getByTestId('jnl-cite-score-header')).toHaveTextContent('CiteScore');
        expect(getByTestId('jnl-cite-score-value')).toHaveTextContent('3.7');

        expect(getByTestId('jnl-cite-score-source-id-header')).toHaveTextContent('CiteScore score');
        expect(getByTestId('jnl-cite-score-source-id-value')).toHaveTextContent('Go to record in CiteScore');
        expect(getByTestId('jnl-cite-score-source-id-lookup-link')).toHaveAttribute(
            'href',
            'https://resolver.library.uq.edu.au/openathens/redir?qurl=https%3A%2F%2Fwww.scopus.com%2Fsourceid%2F19561',
        );

        expect(getByTestId('jnl-cite-score-snip-header')).toHaveTextContent('SNIP');
        expect(getByTestId('jnl-cite-score-snip-value')).toHaveTextContent('1.64');

        expect(getByTestId('jnl-cite-score-more-info-header')).toHaveTextContent('CiteScore more info');
        expect(getByTestId('jnl-cite-score-more-info-value')).toHaveTextContent('More info about CiteScore');
        expect(getByTestId('jnl-cite-score-more-info-lookup-link')).toHaveAttribute(
            'href',
            'https://service.elsevier.com/app/answers/detail/a_id/14880/supporthub/scopus/',
        );

        expect(getByTestId('jnl-cite-score-sjr-header')).toHaveTextContent('SJR');
        expect(getByTestId('jnl-cite-score-sjr-value')).toHaveTextContent('0.767');

        expect(getByTestId('jnl-cite-score-percent-cited-header')).toHaveTextContent('Percent Cited');
        expect(getByTestId('jnl-cite-score-percent-cited-value')).toHaveTextContent('58');

        expect(getByTestId('journal-details-tab-fez-journal-cite-score-asjc-code-0-heading')).toHaveTextContent(
            '2739 Public Health, Environmental and Occupational Health',
        );

        expect(getByTestId('jnl-cite-score-asjc-code-lookup-header')).toHaveTextContent(
            'Scopus ASJC Code and sub-subject area',
        );
        expect(getByTestId('jnl-cite-score-asjc-code-lookup-value')).toHaveTextContent(
            '2739 Public Health, Environmental and Occupational Health',
        );

        expect(getByTestId('jnl-cite-score-asjc-code-top-10-percent-header')).toHaveTextContent(
            'Top 10% (CiteScore Percentile)',
        );
        expect(getByTestId('jnl-cite-score-asjc-code-top-10-percent-value')).toHaveTextContent('No');

        expect(getByTestId('jnl-cite-score-asjc-code-rank-header')).toHaveTextContent('Ranked');
        expect(getByTestId('jnl-cite-score-asjc-code-rank-value')).toHaveTextContent('29 out of 516');

        expect(getByTestId('jnl-cite-score-asjc-code-quartile-header')).toHaveTextContent('Quartile');
        expect(getByTestId('jnl-cite-score-asjc-code-quartile-value')).toHaveTextContent('1');

        expect(getByTestId('jnl-cite-score-asjc-code-percentile-header')).toHaveTextContent('Percentile');
        expect(getByTestId('jnl-cite-score-asjc-code-percentile-value')).toHaveTextContent('94');

        // ******************************************************************
        // Indexed in
        // ******************************************************************
        expect(getByTestId('jnl-esi-subject-lookup-header')).toHaveTextContent(
            'Essential Science Indicators Research Fields',
        );
        expect(getByTestId('jnl-esi-subject-lookup-0-value')).toHaveTextContent('Social Sciences, General (0090-0036)');
        expect(getByTestId('jnl-esi-subject-lookup-1-value')).toHaveTextContent('Social Sciences, General (1541-0048)');

        expect(queryByTestId('jnl-wos-category-ahci-header')).not.toBeInTheDocument();

        expect(getByTestId('jnl-wos-category-scie-header')).toHaveTextContent(
            'Science Citation Index Expanded - WOS Subject Categories',
        );
        expect(getByTestId('jnl-wos-category-scie-0-0-value')).toHaveTextContent(
            'Public, Environmental & Occupational Health (0090-0036)',
        );
        expect(getByTestId('jnl-wos-category-scie-1-0-value')).toHaveTextContent(
            'Public, Environmental & Occupational Health (1541-0048)',
        );

        expect(getByTestId('jnl-wos-category-ssci-header')).toHaveTextContent(
            'Social Science Citation Index - WOS Subject Categories',
        );
        expect(getByTestId('jnl-wos-category-ssci-0-0-value')).toHaveTextContent(
            'Public, Environmental & Occupational Health (0090-0036)',
        );
        expect(getByTestId('jnl-wos-category-ssci-1-0-value')).toHaveTextContent(
            'Public, Environmental & Occupational Health (1541-0048)',
        );

        expect(queryByTestId('jnl-wos-category-esci-header')).not.toBeInTheDocument();

        expect(getByTestId('has-scopus-header')).toHaveTextContent('Scopus');
        expect(getByTestId('has-scopus-value')).toHaveTextContent('Yes');

        expect(getByTestId('has-pubmed-header')).toHaveTextContent('Pubmed');
        expect(getByTestId('has-pubmed-value')).toHaveTextContent('Yes');

        // ******************************************************************
        // Listed in
        // ******************************************************************
        expect(queryByTestId('jnl-abdc-rating-header')).toHaveTextContent(
            'Australian Business Deans Council (ABDC) Quality Rating',
        );
        expect(queryByTestId('jnl-abdc-rating-value')).toHaveTextContent('A*');
        expect(queryByTestId('jnl-abdc-for-code-lookup-header')).toHaveTextContent('ABDC Field of Research');
        expect(queryByTestId('jnl-abdc-for-code-lookup-value')).toHaveTextContent('1503 Business and Management');
        expect(queryByTestId('jnl-abdc-source-date-header')).toHaveTextContent('ABDC Listed Year');
        expect(queryByTestId('jnl-abdc-source-date-value')).toHaveTextContent('2019');

        expect(getByTestId('jnl-cwts-source-year-header')).toHaveTextContent('CWTS Leiden Ranking');
        expect(getByTestId('jnl-cwts-source-year-value')).toHaveTextContent('Yes, 2020');

        expect(getByTestId('fez-journal-era-header')).toHaveTextContent('Excellence in Research for Australia (ERA)');
        expect(getByTestId('fez-journal-era-value')).toHaveTextContent('Yes');
        expect(getByTestId('jnl-era-for-code-lookup-header')).toHaveTextContent(
            'ERA Years with Field of Research codes',
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

        expect(getByTestId('jnl-nature-index-source-date-header')).toHaveTextContent('Nature Index');
        expect(getByTestId('jnl-nature-index-source-date-value')).toHaveTextContent('Yes, 2019');

        // ******************************************************************
        // UQ Connections
        // ******************************************************************
        expect(getByTestId('jnl-uq-author-count-header')).toHaveTextContent('Number of UQ Authors');
        expect(getByTestId('jnl-uq-author-count-value')).toHaveTextContent('200');

        expect(getByTestId('jnl-uq-author-publications-header')).toHaveTextContent('UQ Authored Publications');
        expect(getByTestId('jnl-uq-author-publications-value')).toHaveTextContent('View these articles in UQ eSpace');
        expect(getByTestId('jnl-uq-author-publications-lookup-link')).toHaveAttribute(
            'href',
            'https://fez-staging.library.uq.edu.au/records/search?activeFacets[ranges][Year+published][from]=2020&activeFacets[ranges][Year+published][to]=2025&searchQueryParams[mtj_jnl_id][value]=8508&searchMode=advanced&activeFacets[ranges][Author%20Id]=[1%20TO%20*]',
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

        const { getByTestId, getByText, queryByTestId } = setup();

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

        const { getByTestId, getByText, queryByTestId } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByTestId('jnl-homepage-url-header')).toHaveTextContent('Journal home page');
        expect(getByTestId('jnl-homepage-url-value')).toHaveTextContent(homepageUrl);
        expect(getByTestId('jnl-homepage-url-lookup-link')).toHaveAttribute('href', homepageUrl);
    });

    it('Should show sherpa romeo links from second issn', async () => {
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
                            srm_issn: '2222-2222',
                            srm_journal_link: '12345',
                        },
                    },
                ],
            },
        });

        const { queryByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(queryByTestId('srm-journal-link-value')).toBeInTheDocument();
    });

    it('Should not show sherpa romeo section when non of journal links are not available', async () => {
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
                            srm_issn: '2222-2222',
                            srm_journal_link: null,
                        },
                    },
                ],
            },
        });

        const { queryByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(queryByTestId('srm-journal-link-header')).not.toBeInTheDocument();
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

    it('should display WoS categories correctly with and without ISSN', async () => {
        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                ...journalDetails.data,
                fez_journal_wos_category: [
                    {
                        jnl_wos_category_title: 'AMERICAN JOURNAL OF PUBLIC HEALTH',
                        jnl_wos_category: '456676',
                        jnl_wos_category_index: 'SCIE',
                        jnl_wos_category_issn: '0090-0036 | 0090-1234',
                        jnl_wos_category_source_date: '2020-09-29',
                        fez_journal_cwts: {
                            jnl_cwts_source_year: 2020,
                            jnl_cwts_title: 'AMERICAN JOURNAL OF PUBLIC HEALTH',
                        },
                        jnl_wos_category_lookup: 'Public, Environmental & Occupational Health | Mental Health',
                    },
                    {
                        jnl_wos_category_title: 'AMERICAN JOURNAL OF PUBLIC HEALTH',
                        jnl_wos_category: '456676',
                        jnl_wos_category_index: 'SSCI',
                        jnl_wos_category_issn: '0090-0036',
                        jnl_wos_category_source_date: '2020-09-29',
                        fez_journal_cwts: {
                            jnl_cwts_source_year: 2020,
                            jnl_cwts_title: 'AMERICAN JOURNAL OF PUBLIC HEALTH',
                        },
                        jnl_wos_category_lookup: 'Public, Environmental & Occupational Health | Mental & Dental Health',
                    },
                    {
                        jnl_wos_category_title: 'AMERICAN JOURNAL OF PUBLIC HEALTH',
                        jnl_wos_category: '',
                        jnl_wos_category_index: 'AHCI',
                        jnl_wos_category_issn: '0090-0036',
                        jnl_wos_category_source_date: '2020-09-29',
                        fez_journal_cwts: {
                            jnl_cwts_source_year: 2020,
                            jnl_cwts_title: 'AMERICAN JOURNAL OF PUBLIC HEALTH',
                        },
                    },
                ],
            },
        });

        const { getByTestId, getByText, queryByTestId } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading journal data'));

        expect(getByTestId('jnl-wos-category-scie-header')).toHaveTextContent(
            'Science Citation Index Expanded - WOS Subject Categories',
        );
        expect(getByTestId('jnl-wos-category-scie-0-0-value')).toHaveTextContent(
            'Public, Environmental & Occupational Health (0090-0036)',
        );
        expect(getByTestId('jnl-wos-category-scie-0-1-value')).toHaveTextContent('Mental Health (0090-1234)');

        expect(getByTestId('jnl-wos-category-ssci-header')).toHaveTextContent(
            'Social Science Citation Index - WOS Subject Categories',
        );
        expect(getByTestId('jnl-wos-category-ssci-0-0-value')).toHaveTextContent(
            'Public, Environmental & Occupational Health (0090-0036)',
        );
        expect(getByTestId('jnl-wos-category-ssci-0-1-value')).toHaveTextContent('Mental & Dental Health');

        expect(queryByTestId('jnl-wos-category-ahci-header')).not.toBeInTheDocument();
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

        expect(getByTestId('journal-details-tab-fez-journal-jcr-scie-category-0-heading')).toHaveAttribute(
            'style',
            'max-width: calc((100vw - 68px) * 0.67); width: 100%;',
        );
    });

    it('should display journal details Tab width in phone size when 1 tab shown', async () => {
        window.matchMedia = createMatchMedia(590);

        mockApi.onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl)).reply(200, {
            data: {
                ...journalDetails.data,
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

        expect(getByTestId('journal-details-tab-fez-journal-jcr-scie-category-0-heading')).toHaveAttribute(
            'style',
            'max-width: 100%; width: 100%;',
        );
    });

    describe('Favouriting', () => {
        // beforeEach(() => {
        //     mockApi = setupMockAdapter();
        // });

        // afterEach(() => {
        //     mockApi.reset();
        // });

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

        expect(getByTestId('journal-details-readAndPublish-header')).toBeInTheDocument();
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

        expect(getByTestId('journal-details-readAndPublish-header')).toBeInTheDocument();
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

        afterEach(() => {
            expect(screen.queryByText(viewJournalLocale.viewJournal.notFound.title)).not.toBeInTheDocument();
            api.reset();
        });

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
                api.mock.journals.get({ id: '.*', data: { ...journalDetails.data } });
                setup();

                await waitForTextToBeRemoved('Loading journal data');
                assertMissingElement('publish-as-oa-button');
            });

            it("should display button for search workflows when OA status = `fee` and it's not embargoed", async () => {
                api.mock.journals.get({ id: '.*', data: { ...data } });
                const { getByTestId } = setup();

                await waitElementToBeInDocument('publish-as-oa-button');
                await userEvent.click(getByTestId('publish-as-oa-button'));
                expect(mockUseNavigate).toHaveBeenCalledWith(pathConfig.journals.search);
            });

            describe.only('embargoed', () => {
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
