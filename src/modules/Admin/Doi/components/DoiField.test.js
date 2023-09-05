import React from 'react';
import { DoiField } from './DoiField';
import { render, WithRouter } from 'test-utils';

import publicationTypeListResearchReport from 'mock/data/records/publicationTypeListResearchReport';
const record = publicationTypeListResearchReport.data[0];

jest.mock('modules/ViewRecord/components/AdditionalInformation');

import { formatPublicationDate } from 'modules/ViewRecord/components/AdditionalInformation';

const setup = (testProps = {}) => {
    const props = {
        classes: {},
        ...testProps,
    };

    return render(
        <WithRouter>
            <DoiField {...props} />
        </WithRouter>,
    );
};

describe('DoiField', () => {
    it('should render default view', () => {
        const { container } = setup({});
        // check for non existence of any elements beyond DoiField
        expect(container).toMatchSnapshot();
    });

    it('should render unknown field value in readable format', () => {
        const { getByTestId } = setup({ field: 'abc123', label: 'Unknown', data: 'testing' });
        expect(getByTestId('abc123')).toHaveTextContent('"testing"');
    });

    it('should render known fields', () => {
        const helpers = jest.requireActual('helpers/general');
        const spy = jest.spyOn(helpers, 'parseHtmlToJSX');
        const testFn = ({ data, displayTypeLookup, field, label, test }) => {
            const render = setup({
                data: data || record[field],
                displayTypeLookup,
                field,
                label: label || field,
            });
            test(render);
        };

        const knownFields = [
            // Author
            {
                field: 'fez_record_search_key_author',
                test: render => {
                    const { getByTestId } = render;
                    expect(getByTestId('rek-author-0')).toHaveTextContent(
                        record.fez_record_search_key_author[0].rek_author,
                    );
                },
            },
            // HTML
            {
                field: 'rek_description',
                test: () => {
                    expect(spy).toHaveBeenCalledWith(record.rek_description);
                    spy.mockRestore();
                },
            },
            // Date
            {
                field: 'rek_date',
                test: () => {
                    expect(formatPublicationDate).toHaveBeenCalledWith(record.rek_date, undefined);
                },
            },
            // Edition
            {
                field: 'fez_record_search_key_edition',
                data: {
                    rek_edition: '1',
                },
                test: render => {
                    const { getByTestId } = render;
                    expect(getByTestId('rek-edition')).toHaveTextContent('1');
                },
            },
            // Example of list keys
            {
                field: 'fez_record_search_key_isbn',
                test: render => {
                    const { getByTestId } = render;
                    expect(getByTestId('rek-isbn')).toHaveTextContent(record.fez_record_search_key_isbn[0].rek_isbn);
                },
            },
            // Example of single entry keys
            {
                field: 'fez_record_search_key_publisher',
                test: render => {
                    const { getByTestId } = render;
                    expect(getByTestId('rek-publisher')).toHaveTextContent(
                        record.fez_record_search_key_publisher.rek_publisher,
                    );
                },
            },
            // Example of generic entry with label
            {
                field: 'fez_record_search_key_conference_location',
                data: {
                    rek_conference_location: 'test location',
                },
                label: 'Conference location',
                test: render => {
                    const { getByTestId } = render;
                    expect(getByTestId('rek-conference-location')).toHaveTextContent('test location');
                    expect(getByTestId('rek-conference-location-label')).toHaveTextContent('Conference location');
                },
            },

            /* Special Cases */

            // Author with ORCID
            {
                field: 'fez_record_search_key_author',
                data: [
                    {
                        rek_author_id: 10101,
                        rek_author: 'First Last',
                        aut_orcid_id: '101010-1010101',
                    },
                ],
                test: render => {
                    const { getByTestId, getByText } = render;
                    expect(getByText('First Last')).toBeInTheDocument();
                    expect(getByTestId('rek-author-0-orcid-link-link')).toHaveAttribute(
                        'href',
                        'https://orcid.org/101010-1010101',
                    );
                },
            },
            // Empty contributors list
            {
                field: 'fez_record_search_key_contributor',
                data: [],
                test: render => {
                    const { container } = render;
                    // check for non existence of any elements beyond DoiField
                    expect(container).toMatchSnapshot();
                },
            },
            // Empty list item
            {
                field: 'fez_record_search_key_isbn',
                data: [],
                test: render => {
                    const { container } = render;
                    // check for non existence of any elements beyond DoiField
                    expect(container).toMatchSnapshot();
                },
            },
            // Date with custom format
            {
                field: 'rek_date',
                displayTypeLookup: 'YYYY',
                test: () => {
                    expect(formatPublicationDate).toHaveBeenCalledWith(record.rek_date, 'YYYY');
                },
            },
            // Depositor name
            {
                field: 'rek_author-name',
                data: 'Test Depositor',
                test: render => {
                    const { getByTestId } = render;
                    expect(getByTestId('rek-author-name')).toHaveTextContent('Test Depositor');
                },
            },
            // Depositor email
            {
                field: 'rek_author-email',
                data: 'example@uq.edu.au',
                test: render => {
                    const { getByRole } = render;
                    expect(getByRole('link', { name: 'example@uq.edu.au' })).toHaveAttribute(
                        'href',
                        'mailto:example@uq.edu.au',
                    );
                },
            },
            // Series with ": no"
            {
                field: 'fez_record_search_key_series',
                data: {
                    rek_series: 'Book series: no.1',
                },
                test: render => {
                    const { getByText } = render;
                    expect(getByText('Book series')).toBeInTheDocument();
                },
            },
            // Series with ";"
            {
                field: 'fez_record_search_key_series',
                data: {
                    rek_series: 'Book series 1; Book series 2',
                },
                test: render => {
                    const { getByText } = render;
                    expect(getByText('Book series 1')).toBeInTheDocument();
                },
            },
            // Non-numeric Edition
            {
                field: 'fez_record_search_key_edition',
                data: {
                    rek_edition: '15th',
                },
                test: render => {
                    const { getByTestId } = render;
                    expect(getByTestId('rek-edition')).toHaveTextContent('1');
                },
            },
        ];

        knownFields.map(testFn);
    });
});
