import React from 'react';
import * as records from 'mock/data/testing/records';
import AdditionalInformation, { formatDate } from './AdditionalInformation';
import { PLACEHOLDER_ISO8601_ZULU_DATE } from 'config/general';
import { rtlRender, WithRouter } from 'test-utils';
import { initialize } from '@googlemaps/jest-mocks';

/* eslint-disable react/prop-types */
jest.mock('modules/SharedComponents/PublicationMap/PublicationMap', () => ({
    __esModule: true,
    default: ({ coordinates, readOnly }) => (
        <div data-testid="mock-publication-map" data-coordinates={coordinates} data-readonly={readOnly} />
    ),
}));

function setup(testProps = {}) {
    const props = {
        publication: {
            ...(testProps.publication || records.journalArticle || {}),
            rek_formatted_abstract: 'This is a&nbsp;test',
        },
        account: {},
        ...testProps,
    };
    return rtlRender(
        <WithRouter>
            <AdditionalInformation {...props} />
        </WithRouter>,
    );
}

describe('Additional Information Component ', () => {
    it('should not render component with empty publication', () => {
        const { container } = setup({ publication: {} });
        expect(container).toMatchSnapshot();
    });

    it('should render component with journal article', () => {
        const { container } = setup({ publication: records.journalArticle });
        expect(container).toMatchSnapshot();
    });

    it('should render component with journal', () => {
        const { container } = setup({ publication: records.journal });
        expect(container).toMatchSnapshot();
    });

    it('should render component with data collection', () => {
        initialize();
        const { container } = setup({ publication: records.dataCollection });
        expect(container).toMatchSnapshot();
    });

    it('should render component with data collection with raid', () => {
        initialize();
        const { container } = setup({
            publication: {
                ...records.dataCollection,
                fez_record_search_key_raid: [
                    {
                        rek_raid: '10.1234/xxx',
                        rek_raid_order: 1,
                    },
                ],
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should not render raid link with empty raid data', () => {
        initialize();
        const { queryByTestId } = setup({
            publication: {
                ...records.dataCollection,
                fez_record_search_key_raid: [
                    {
                        rek_raid: '',
                        rek_raid_order: 1,
                    },
                ],
            },
        });
        expect(queryByTestId('rek-raid-0')).not.toBeInTheDocument();
    });

    it('should not render raid link with empty raid array', () => {
        initialize();
        const { queryByTestId } = setup({
            publication: {
                ...records.dataCollection,
                fez_record_search_key_raid: [],
            },
        });
        expect(queryByTestId('rek-raid-0')).not.toBeInTheDocument();
    });

    it('should render component with data collection with license link', () => {
        initialize();
        const { container } = setup({
            publication: {
                ...records.dataCollection,
                fez_record_search_key_license: {
                    ...records.dataCollectionWithFoRCodes.fez_record_search_key_license,
                    rek_license: 456807,
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render component with audio document', () => {
        const { container } = setup({ publication: records.audioDocument });
        expect(container).toMatchSnapshot();
    });

    it('should render component with Attribution incomplete', () => {
        const { container } = setup({
            publication: {
                ...records.journalArticle,
                rek_ci_notice_attribution_incomplete: 1,
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render component without Attribution incomplete, set to 0', () => {
        const { container } = setup({
            publication: {
                ...records.journalArticle,
                rek_ci_notice_attribution_incomplete: 0,
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render component without Attribution incomplete, with no value', () => {
        const { container } = setup({
            publication: {
                ...records.journalArticle,
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render component with book', () => {
        const { container } = setup({ publication: records.book });
        expect(container).toMatchSnapshot();
    });

    it('should render component with book chapter', () => {
        const { container } = setup({ publication: records.bookChapter });
        expect(container).toMatchSnapshot();
    });

    it('should render component with conference paper', () => {
        const { container } = setup({ publication: records.conferencePaper });
        expect(container).toMatchSnapshot();
    });

    it('should render component with conference proceedings', () => {
        const { container } = setup({ publication: records.conferenceProceedings });
        expect(container).toMatchSnapshot();
    });

    it('should render component with creative work', () => {
        const { container } = setup({ publication: records.creativeWork });
        expect(container).toMatchSnapshot();
    });

    it('should render component with a community', () => {
        const { container } = setup({ publication: records.communityRecord });
        expect(container).toMatchSnapshot();
    });

    it('should render component with a collection', () => {
        const { container } = setup({ publication: records.collectionRecord });
        expect(container).toMatchSnapshot();
    });

    it('should render component with creative work (Creative Work - Textual)', () => {
        const { container } = setup({
            isNtro: true,
            publication: {
                ...records.creativeWork,
                rek_subtype: 'Creative Work - Textual',
                fez_record_search_key_contributor: { rek_contributor: 'Test' },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render component with creative work (Creative Work - Visual Art)', () => {
        const { container } = setup({
            isNtro: true,
            publication: {
                ...records.creativeWork,
                rek_subtype: 'Creative Work - Visual Art',
                fez_record_search_key_contributor: { rek_contributor: 'Test' },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render component with design document', () => {
        const { container } = setup({ publication: records.design });
        expect(container).toMatchSnapshot();
    });

    it('should render component with digilib image', () => {
        const { container } = setup({ publication: records.digilibImage });
        expect(container).toMatchSnapshot();
    });

    it('should render component with image', () => {
        const { container } = setup({ publication: records.imageDocument });
        expect(container).toMatchSnapshot();
    });

    it('should render component with instrument', () => {
        const { container } = setup({ publication: records.instrument });
        expect(container).toMatchSnapshot();
    });

    it('should render component with orcid owner identifier', () => {
        const id = '0000-0000-0000-0001';
        const { getByTestId } = setup({
            publication: {
                ...records.instrument,
                fez_record_search_key_contributor_identifier: [{ rek_contributor_identifier: id }],
            },
        });

        expect(getByTestId('identifier-icon-link-0000_0000_0000_0001')).toHaveTextContent(id);
    });

    it('should render component with ror owner identifier', () => {
        const id = '02mhbdp94';
        const { getByTestId } = setup({
            publication: {
                ...records.instrument,
                fez_record_search_key_contributor_identifier: [{ rek_contributor_identifier: id }],
            },
        });
        expect(getByTestId('identifier-icon-link-02_mhbdp_94')).toHaveTextContent(id);
    });

    it('should render component with unrecognised owner identifier', () => {
        const id = '12345';
        const { getByText } = setup({
            publication: {
                ...records.instrument,
                fez_record_search_key_contributor_identifier: [{ rek_contributor_identifier: id }],
            },
        });

        expect(getByText(id)).toBeInTheDocument();
    });

    it('should render component with related service ror', () => {
        const id = '02mhbdp94';
        const { getByTestId } = setup({
            publication: {
                ...records.instrument,
                fez_record_search_key_related_service: [{ rek_related_service: id }],
            },
        });
        expect(getByTestId('identifier-icon-link-02_mhbdp_94')).toHaveTextContent(id);
    });

    it('should render component with related service doi', () => {
        const id = '10.1234/test';
        const { getByTestId } = setup({
            publication: {
                ...records.instrument,
                fez_record_search_key_related_service: [{ rek_related_service: id }],
                fez_record_search_key_related_service_description: [
                    { rek_related_service_description: 'related service desc' },
                ],
            },
        });
        expect(getByTestId('identifier-icon-link-10_1234_test')).toHaveTextContent(id);
    });

    it('should render component with generic document', () => {
        const { container } = setup({ publication: records.generic });
        expect(container).toMatchSnapshot();
    });

    it('should render component with manuscript', () => {
        const { container } = setup({ publication: records.manuscript });
        expect(container).toMatchSnapshot();
    });

    it('should render component with newspaperArticle', () => {
        const { container } = setup({ publication: records.newspaperArticle });
        expect(container).toMatchSnapshot();
    });

    it('should render component with patent', () => {
        const { container } = setup({ publication: records.patent });
        expect(container).toMatchSnapshot();
    });

    it('should render component with preprint', () => {
        const { container } = setup({ publication: records.preprint });
        expect(container).toMatchSnapshot();
    });

    it('should render component with reference entry', () => {
        const { container } = setup({ publication: records.referenceEntry });
        expect(container).toMatchSnapshot();
    });

    it('should render component with research report', () => {
        const { container } = setup({ publication: records.researchReport });
        expect(container).toMatchSnapshot();
    });

    it('should render component with thesis', () => {
        const { container } = setup({ publication: records.thesis });
        expect(container).toMatchSnapshot();
    });

    it('should render component with working paper', () => {
        const { container } = setup({ publication: records.workingPaper });
        expect(container).toMatchSnapshot();
    });

    it('should render component with video document', () => {
        const { container } = setup({ publication: records.videoDocument });
        expect(container).toMatchSnapshot();
    });

    it('should render oa status value link in the component with thesis', () => {
        records.thesis.fez_record_search_key_oa_status.rek_oa_status_lookup = 'File (Author Accepted Manuscript)';
        const { container } = setup({ publication: records.thesis });
        expect(container).toMatchSnapshot();
    });

    it('should render component with data collection with FoR codes', () => {
        initialize();
        const { container } = setup({ publication: records.dataCollectionWithFoRCodes });
        expect(container).toMatchSnapshot();
    });

    it('should render component with proceedings title link', () => {
        const { container } = setup({ publication: records.conferencePaperWithProceedingsTitle });
        expect(container).toMatchSnapshot();
    });

    it('should render component with rek_herdc_code', () => {
        const { container } = setup({ publication: records.journalArticle, account: { canMasquerade: true } });
        expect(container).toMatchSnapshot();
    });

    it('should render component with rek_start and end dates', () => {
        const { container } = setup({
            publication: {
                ...records.creativeWork,
                fez_record_search_key_start_date: {
                    rek_start_date: '2005-01-05 00:00:00',
                },
                fez_record_search_key_end_date: {
                    rek_end_date: '2005-01-05 00:00:00',
                },
            },
            account: { canMasquerade: true },
        });
        expect(container).toMatchSnapshot();
    });

    it('should skip render of date if it has a placeholder value', () => {
        const publication = {
            rek_date: PLACEHOLDER_ISO8601_ZULU_DATE,
            rek_display_type_lookup: 'Journal Article',
        };
        const { container } = setup({ publication });
        expect(container).toMatchSnapshot();
    });

    it('should skip render of end date if it has a placeholder value', () => {
        const publication = {
            fez_record_search_key_end_date: { rek_end_date: PLACEHOLDER_ISO8601_ZULU_DATE },
            rek_display_type_lookup: 'Instrument',
        };
        const { container } = setup({ publication });
        expect(container).toMatchSnapshot();
    });

    it('should not render empty doi', () => {
        const { container } = setup({
            publication: {
                ...records.journalArticle,
                fez_record_search_key_doi: { rek_doi: '' },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should not render empty rights', () => {
        initialize();
        const { queryByTestId } = setup({
            publication: {
                ...records.dataCollection,
                fez_record_search_key_rights: { rek_rights: '' },
            },
        });
        expect(queryByTestId('rek-rights-label')).not.toBeInTheDocument();
        expect(queryByTestId('rek-rights')).not.toBeInTheDocument();
    });

    it('should not render null rights', () => {
        initialize();
        const { queryByTestId } = setup({
            publication: {
                ...records.dataCollection,
                fez_record_search_key_rights: { rek_rights: null },
            },
        });
        expect(queryByTestId('rek-rights-label')).not.toBeInTheDocument();
        expect(queryByTestId('rek-rights')).not.toBeInTheDocument();
    });

    it('should not render empty keyword', () => {
        initialize();
        const { queryByTestId } = setup({
            publication: {
                ...records.dataCollection,
                fez_record_search_key_keywords: [{ rek_keywords: '', rek_keywords_order: 1 }],
            },
        });
        expect(queryByTestId('rek-keywords-label')).not.toBeInTheDocument();
        expect(queryByTestId('rek-keywords')).not.toBeInTheDocument();
    });

    it('renderLicense()', () => {
        const publication = {
            rek_date: PLACEHOLDER_ISO8601_ZULU_DATE,
            rek_display_type_lookup: 'Journal Article',
            fez_record_search_key_license: {
                rek_license: 1,
                rek_license_lookup: null,
            },
        };
        const { container } = setup({ publication });
        expect(container).toMatchSnapshot();
    });

    it('should render with no formatted abstract', () => {
        const { container } = setup({
            publication: { ...records.journalArticle, rek_formatted_abstract: null },
            isNtro: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('should render with no formatted abstract nor description', () => {
        const { container } = setup({
            publication: { ...records.journalArticle, rek_formatted_abstract: null },
            isNtro: false,
        });
        expect(container).toMatchSnapshot();
    });

    it('should render with description only', () => {
        const { container } = setup({
            publication: { ...records.journalArticle, rek_formatted_abstract: null, rek_description: 'Test' },
            isNtro: false,
        });
        expect(container).toMatchSnapshot();
    });

    it('should not render map with empty geo coordinates', () => {
        const { container } = setup({
            publication: {
                ...records.audioDocument,
                fez_record_search_key_geographic_area: [{ rek_geographic_area: null }],
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render map with geo coordinates', () => {
        initialize();
        const { container } = setup({
            publication: {
                ...records.audioDocument,
                fez_record_search_key_geographic_area: [{ rek_geographic_area: 'test' }],
            },
        });
        expect(container).toMatchSnapshot();
    });

    describe('exported functions', () => {
        it('formatDate', () => {
            // valid date with default format
            rtlRender(<>{formatDate('2016-09-13T01:19:06Z')}</>);
            expect(document.querySelector('.citationDate')).toHaveTextContent('2016-09-13');

            // valid date with specific format
            rtlRender(<>{formatDate('2016-09-13T01:19:06Z', 'DD-MM-YYYY')}</>);
            expect(document.querySelectorAll('.citationDate')[1]).toHaveTextContent('13-09-2016');

            // invalid date with default format
            rtlRender(<>{formatDate('2016-09-33T01:19:06Z')}</>);
            expect(document.querySelectorAll('.citationDate')[2]).toHaveClass('empty');
            expect(document.querySelectorAll('.citationDate')[2]).toHaveTextContent('');
        });
    });
});
