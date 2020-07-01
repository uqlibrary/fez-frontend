import { shallow } from 'enzyme';
import { DoiField } from './DoiField';

import publicationTypeListResearchReport from 'mock/data/records/publicationTypeListResearchReport';
const record = publicationTypeListResearchReport.data[0];

jest.mock('modules/ViewRecord/components/AdditionalInformation');
jest.mock('react-html-parser');

import { formatPublicationDate } from 'modules/ViewRecord/components/AdditionalInformation';
import ReactHtmlParser from 'react-html-parser';

const setup = (testProps = {}, args = { isShallow: true }) => {
    const props = {
        classes: {},
        ...testProps,
    };

    return getElement(DoiField, props, args);
};

describe('DoiField', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toBe('');
    });

    it('should render unknown field value in readable format', () => {
        const wrapper = setup({ field: 'abc123', heading: 'Unknown', data: 'testing' });
        expect(wrapper.find('[data-testid="abc123"]').text()).toBe('"testing"');
    });

    it('should render known fields', () => {
        const knownFieldsForResearchReport = [
            // Special cases
            {
                key: 'fez_record_search_key_author',
                test: wrapper => {
                    expect(wrapper.find('[data-testid="rek-author-0"]').text()).toBe(
                        record.fez_record_search_key_author[0].rek_author,
                    );
                },
            },
            {
                key: 'rek_title',
                test: () => {
                    expect(ReactHtmlParser).toHaveBeenCalledWith(record.rek_title);
                },
            },
            {
                key: 'rek_date',
                test: () => {
                    expect(formatPublicationDate).toHaveBeenCalledWith(record.rek_date);
                },
            },
            // Example of list keys
            {
                key: 'fez_record_search_key_isbn',
                test: wrapper => {
                    expect(wrapper.find('[data-testid="rek-isbn"]').text()).toBe(
                        record.fez_record_search_key_isbn[0].rek_isbn,
                    );
                },
            },
            // Example of single entry keys
            {
                key: 'fez_record_search_key_publisher',
                test: wrapper => {
                    expect(wrapper.find('[data-testid="rek-publisher"]').text()).toBe(
                        record.fez_record_search_key_publisher.rek_publisher,
                    );
                },
            },
        ];
        knownFieldsForResearchReport.map(known => {
            const field = known.key;
            const wrapper = setup({ field, data: record[field], heading: field });
            known.test(wrapper);
        });

        const confWrapper = setup({
            field: 'fez_record_search_key_conference_location',
            data: {
                rek_conference_location: 'test location',
            },
            heading: 'Conference location',
        });
        expect(confWrapper.find('[data-testid="rek-conference-location"]').text()).toBe('test location');
        expect(confWrapper.find('[data-testid="rek-conference-location-heading"]').text()).toBe('Conference location');

        const authorWithOrcidWrapper = setup({
            field: 'fez_record_search_key_author',
            data: [
                {
                    rek_author_id: 10101,
                    rek_author: 'First Last',
                    aut_orcid_id: '101010-1010101',
                },
            ],
            heading: 'Author(s)',
        });
        expect(authorWithOrcidWrapper.find('[data-testid="rek-author-0"]').text()).toBe(
            'First Last (ORCID: 101010-1010101)',
        );
        expect(authorWithOrcidWrapper.find('[data-testid="rek-author-0-orcid-link"]').props().href).toBe(
            'https://orcid.org/101010-1010101',
        );

        const zeroContribsWrapper = setup({
            field: 'fez_record_search_key_contributor',
            data: [],
            heading: 'Editor(s)',
        });
        expect(toJson(zeroContribsWrapper)).toBe('');

        // Custom entries

        const doiWrapper = setup({ field: 'rek-doi', data: 'test', heading: 'DOI (Existing)' });
        expect(doiWrapper.find('[data-testid="rek-doi"]').text()).toBe('test');

        const nameWrapper = setup({ field: 'rek-author-name', data: 'Test Depositor', heading: 'Depositor name' });
        expect(nameWrapper.find('[data-testid="rek-author-name"]').text()).toBe('Test Depositor');

        const emailWrapper = setup({
            field: 'rek-author-email',
            data: 'example@uq.edu.au',
            heading: 'Depositor email',
        });
        const entry = emailWrapper.find('[data-testid="rek-author-email"]');
        expect(entry.text()).toBe('example@uq.edu.au');
        const renderedEmail = shallow(entry.props().children);
        expect(renderedEmail.props().href).toBe('mailto:example@uq.edu.au');
    });
});
