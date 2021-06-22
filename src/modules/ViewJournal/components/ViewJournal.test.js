import React from 'react';
import * as repositories from 'repositories';
import { journalDetails } from 'mock/data/journal';

import { render, waitForElementToBeRemoved, WithReduxStore } from 'test-utils';
import ViewJournal from './ViewJournal';

jest.mock('react-router', () => ({
    useParams: jest.fn(() => ({ id: 1 })),
}));

const setup = () => {
    return render(
        <WithReduxStore>
            <ViewJournal />
        </WithReduxStore>,
    );
};

describe('ViewJournal', () => {
    it('should display journal details basic section', async () => {
        mockApi
            .onGet(new RegExp(repositories.routes.JOURNAL_API({ id: '.*' }).apiUrl))
            .reply(200, { ...journalDetails });

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

        expect(queryByTestId('ulr-open-access-url-header')).not.toBeInTheDocument();

        expect(getByTestId('ulr-description-header')).toHaveTextContent('Description');
        expect(getByTestId('ulr-description-value')).toHaveTextContent(
            'Contains reports of original research, demonstrations, evaluations, and other articles covering current aspects of public health.',
        );

        expect(getByTestId('ulr-title-header')).toHaveTextContent('View journal in Ulrichs');
        expect(getByTestId('ulr-title-0-value')).toHaveTextContent('American Journal of Public Health');
        expect(getByTestId('ulr-title-0-value')).toHaveAttribute(
            'href',
            'http://ezproxy.library.uq.edu.au/login?url=http://ulrichsweb.serialssolutions.com/title/41698',
        );
        expect(getByTestId('ulr-title-1-value')).toHaveAttribute(
            'href',
            'http://ezproxy.library.uq.edu.au/login?url=http://ulrichsweb.serialssolutions.com/title/41699',
        );

        // **************************************************************
        // Open Access (Directory of Open Access Journals - DOAJ) Section
        // **************************************************************
        expect(getByTestId('journal-details-doaj-header')).toHaveTextContent(
            'Open Access (Directory of Open Access Journals - DOAJ',
        );

        expect(getByTestId('ulr-open-access-header')).toHaveTextContent('Open access');
        expect(getByTestId('ulr-open-access-value')).toHaveTextContent('Yes');

        expect(getByTestId('jnl-doaj-homepage-url-header')).toHaveTextContent('Journal home page');
        expect(getByTestId('jnl-doaj-homepage-url-value')).toHaveTextContent('https://www.hindawi.com/journals/aaa');
        expect(getByTestId('jnl-doaj-homepage-url-value')).toHaveAttribute(
            'href',
            'https://www.hindawi.com/journals/aaa',
        );

        expect(getByTestId('jnl-doaj-apc-average-price-header')).toHaveTextContent('Article processing charges');
        expect(getByTestId('jnl-doaj-apc-average-price-value')).toHaveTextContent('975 USD');

        expect(getByTestId('jnl-doaj-by-sa-nd-nc-header')).toHaveTextContent('Journal licence');
        expect(getByTestId('jnl-doaj-by-sa-nd-nc-value')).toHaveTextContent(
            'Creative Commons Attribution 4.0 International (CC BY 4.0)',
        );
        expect(getByTestId('jnl-doaj-by-sa-nd-nc-lookup')).toHaveAttribute(
            'href',
            'https://creativecommons.org/licenses/by/4.0/deed.en',
        );

        expect(getByTestId('jnl-doaj-seal-header')).toHaveTextContent('DOAJ seal');
        expect(getByTestId('jnl-doaj-seal-value')).toHaveTextContent('Yes');

        expect(getByTestId('jnl-doaj-last-updated-header')).toHaveTextContent('Last updated');
        expect(getByTestId('jnl-doaj-last-updated-value')).toHaveTextContent('3rd February 2020 at 2:17pm');

        expect(getByTestId('ulr-open-access-jnl-issn-header')).toHaveTextContent('View in DOAJ');
        expect(getByTestId('ulr-open-access-jnl-issn-value')).toHaveTextContent('0090-0036');
        expect(getByTestId('ulr-open-access-jnl-issn-value')).toHaveAttribute('href', 'https://doaj.org/toc/0090-0036');

        expect(getByTestId('srm-journal-link-header')).toHaveTextContent(
            'Sherpa Romeo open access and archiving policies',
        );
        expect(getByTestId('srm-journal-link-0-value')).toHaveTextContent('0090-0036');
        expect(getByTestId('srm-journal-link-0-value')).toHaveAttribute(
            'href',
            'https://v2.sherpa.ac.uk/id/publication/10303',
        );
        expect(getByTestId('srm-journal-link-1-value')).toHaveTextContent('1541-0048');
        expect(getByTestId('srm-journal-link-1-value')).toHaveAttribute(
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
        expect(getByTestId('jcr-home-page-scie-value')).toHaveAttribute(
            'href',
            'https://jcr-clarivate-com.ezproxy.library.uq.edu.au',
        );

        expect(getByTestId('jcr-more-info-scie-header')).toHaveTextContent('JCR more info');
        expect(getByTestId('jcr-more-info-scie-value')).toHaveAttribute(
            'href',
            'https://clarivate.com/webofsciencegroup/solutions/webofscience-scie',
        );
    });
});
