import React from 'react';
import AddDataCollection, { licenseText } from './AddDataCollection';
import { render, WithReduxStore, WithRouter, fireEvent, waitFor, screen, preview } from 'test-utils';
import userEvent from '@testing-library/user-event';
import * as actions from 'actions';
// import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import * as repository from 'repositories';
import { vocabsFieldResearch } from 'mock/data/vocabsFieldResearch.js';

// const mockUseNavigate = jest.fn();
let mockDoiExist = false;
jest.mock('actions', () => ({
    ...jest.requireActual('actions'),
    doesDOIExist: jest.fn(doi => {
        if (mockDoiExist) {
            console.log('mock doi exist');
            return Promise.reject({ status: 422, message: 'validation.doi' });
        } else {
            return jest.requireActual('actions').doesDOIExist(doi);
        }
    }),
}));
// jest.mock('react-router-dom', () => ({
//     ...jest.requireActual('react-router-dom'),
//     useNavigate: () => mockUseNavigate,
// }));

function setup(testProps = {}, renderMethod = render) {
    const props = {
        resetForm: testProps.resetForm || jest.fn(),
        ...testProps,
    };

    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <AddDataCollection {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('AddDataCollection test', () => {
    beforeAll(() => {});
    afterAll(() => {
        // mockUseNavigate.mockClear();
    });
    it('should check doi error', async () => {
        const existingDoiValue = '10.1037/a0028240';
        mockApi
            .onGet(repository.routes.SEARCH_KEY_LOOKUP_API({}).apiUrl, {
                params: { rule: 'lookup', search_key: 'doi', lookup_value: existingDoiValue },
            })
            .reply(() => {
                return [200, { total: 1 }];
            });
        const { getByTestId } = setup();

        const doi = getByTestId('rek-doi-input');
        await userEvent.type(doi, 'Test');
        await userEvent.tab();
        expect(doi).toHaveValue('Test');
        await waitFor(() => expect(screen.getByText('DOI is not valid')).toBeInTheDocument());
        await userEvent.clear(doi);
        await userEvent.type(doi, existingDoiValue);
        await userEvent.tab();
        doi.blur();
        await waitFor(() => expect(screen.getByText('DOI is assigned to another work already')).toBeInTheDocument());

        mockDoiExist = true;
        await userEvent.type(doi, existingDoiValue);
        await userEvent.tab();
        doi.blur();
        await waitFor(() => expect(screen.getByText('DOI is not valid')).toBeInTheDocument());
    });

    it('should submit', async () => {
        mockDoiExist = false;
        // Field of Research lookup
        mockApi.onGet('vocabularies?cvo_ids=451780').reply(() => {
            return [200, vocabsFieldResearch];
        });
        // Contact Name ID lookup
        mockApi.onGet('fez-authors/search').reply(() => {
            return [
                200,
                {
                    total: 1,
                    data: [
                        {
                            id: 46980,
                            value: 'David Johnsen',
                            aut_id: 46980,
                            aut_fname: 'David',
                            aut_lname: 'Johnsen',
                            aut_display_name: 'David Johnsen',
                        },
                    ],
                },
            ];
        });
        mockApi.onPost('records').reply(() => {
            return [
                200,
                {
                    data: {
                        rek_pid: 'UQ:5a31f80',
                        rek_title_xsdmf_id: null,
                        rek_title: 'test',
                        rek_description_xsdmf_id: null,
                        rek_description: 'test',
                        rek_display_type_xsdmf_id: null,
                        rek_display_type: 371,
                        rek_status_xsdmf_id: null,
                        rek_status: 3,
                        rek_date_xsdmf_id: null,
                        rek_date: '2000-11-01T00:00:00Z',
                        rek_object_type_xsdmf_id: null,
                        rek_object_type: 3,
                        rek_depositor_xsdmf_id: null,
                        rek_depositor: 1005444397,
                        rek_created_date_xsdmf_id: null,
                        rek_created_date: '2025-02-14T00:00:19Z',
                        rek_updated_date_xsdmf_id: null,
                        rek_updated_date: '2025-02-14T00:00:24Z',
                        rek_file_downloads: 0,
                        rek_citation:
                            '<a class="citation_author_name" title="Browse by Author Name for test" href="/records/search?searchQueryParams%5Brek_author%5D%5Bvalue%5D=test&searchQueryParams%5Brek_author%5D%5Blabel%5D=test&searchMode=advanced">test</a> (<span class="citation_date">2000</span>). <i><a class="citation_title" title="Click to view Data Collection: test" href="/view/UQ:5a31f80">test</a></i>.',
                        rek_genre_xsdmf_id: null,
                        rek_genre: 'Data Collection',
                        rek_genre_type_xsdmf_id: null,
                        rek_genre_type: null,
                        rek_formatted_title_xsdmf_id: null,
                        rek_formatted_title: null,
                        rek_formatted_abstract_xsdmf_id: null,
                        rek_formatted_abstract: null,
                        rek_depositor_affiliation_xsdmf_id: null,
                        rek_depositor_affiliation: null,
                        rek_thomson_citation_count: null,
                        rek_thomson_citation_count_xsdmf_id: null,
                        rek_subtype_xsdmf_id: null,
                        rek_subtype: null,
                        rek_scopus_citation_count: null,
                        rek_dimensions_citation_count: null,
                        rek_scopus_doc_type_xsdmf_id: null,
                        rek_scopus_doc_type: null,
                        rek_wok_doc_type_xsdmf_id: null,
                        rek_wok_doc_type: null,
                        rek_pubmed_doc_type_xsdmf_id: null,
                        rek_pubmed_doc_type: null,
                        rek_dimensions_doc_type: null,
                        rek_security_inherited: 1,
                        rek_altmetric_score: null,
                        rek_altmetric_score_xsdmf_id: null,
                        rek_altmetric_id: null,
                        rek_altmetric_id_xsdmf_id: null,
                        rek_copyright_xsdmf_id: null,
                        rek_copyright: 'on',
                        rek_security_policy: 1,
                        rek_datastream_policy: null,
                        rek_ci_notice_attribution_incomplete: null,
                        fez_datastream_info: [],
                        fez_record_search_key_access_conditions: {
                            rek_access_conditions_id: 6127,
                            rek_access_conditions_pid: 'UQ:5a31f80',
                            rek_access_conditions_xsdmf_id: null,
                            rek_access_conditions: '453619',
                            rek_access_conditions_lookup: 'Open Access',
                        },
                        fez_record_search_key_advisory_statement: null,
                        fez_record_search_key_ands_collection_type: null,
                        fez_record_search_key_assigned_group_id: [],
                        fez_record_search_key_assigned_user_id: [],
                        fez_record_search_key_author: [
                            {
                                rek_author_id: 37741900,
                                rek_author_pid: 'UQ:5a31f80',
                                rek_author_xsdmf_id: null,
                                rek_author: 'test',
                                rek_author_order: 1,
                            },
                        ],
                        fez_record_search_key_author_crossref_authenticated: [],
                        fez_record_search_key_author_crossref_orcid: [],
                        fez_record_search_key_author_email: [],
                        fez_record_search_key_author_id: [
                            {
                                rek_author_id_id: 37943257,
                                rek_author_id_pid: 'UQ:5a31f80',
                                rek_author_id_xsdmf_id: null,
                                rek_author_id: 0,
                                rek_author_id_order: 1,
                                author: null,
                            },
                        ],
                        fez_record_search_key_author_role: [
                            {
                                rek_author_role_id: 27443,
                                rek_author_role_pid: 'UQ:5a31f80',
                                rek_author_role_xsdmf_id: null,
                                rek_author_role: 'Project lead/Principal investigator',
                                rek_author_role_order: 1,
                            },
                        ],
                        fez_record_search_key_contact_details_email: [
                            {
                                rek_contact_details_email_id: 11442,
                                rek_contact_details_email_pid: 'UQ:5a31f80',
                                rek_contact_details_email_xsdmf_id: null,
                                rek_contact_details_email: 'test@a.au',
                                rek_contact_details_email_order: 1,
                            },
                        ],
                        fez_record_search_key_contributor: [
                            {
                                rek_contributor_id: 3321460,
                                rek_contributor_pid: 'UQ:5a31f80',
                                rek_contributor_xsdmf_id: null,
                                rek_contributor: 'test',
                                rek_contributor_order: 1,
                            },
                        ],
                        fez_record_search_key_contributor_id: [
                            {
                                rek_contributor_id_id: 2475651,
                                rek_contributor_id_pid: 'UQ:5a31f80',
                                rek_contributor_id_xsdmf_id: null,
                                rek_contributor_id: 2000003221,
                                rek_contributor_id_order: 1,
                                rek_contributor_id_lookup: 'test test',
                            },
                        ],
                        fez_record_search_key_coverage_period: [],
                        fez_record_search_key_data_volume: null,
                        fez_record_search_key_datastream_policy: null,
                        fez_record_search_key_deletion_notes: null,
                        fez_record_search_key_doi: null,
                        fez_record_search_key_doi_resolution_url: null,
                        fez_record_search_key_embargo_to: null,
                        fez_record_search_key_end_date: null,
                        fez_record_search_key_external_label_id: [],
                        fez_record_search_key_file_attachment_access_condition: [],
                        fez_record_search_key_file_attachment_embargo_date: [],
                        fez_record_search_key_file_attachment_name: [],
                        fez_record_search_key_geographic_area: [],
                        fez_record_search_key_grant_acronym: [],
                        fez_record_search_key_grant_agency: [],
                        fez_record_search_key_grant_agency_id: [],
                        fez_record_search_key_grant_data_id: [],
                        fez_record_search_key_grant_id: [],
                        fez_record_search_key_grant_text: [],
                        fez_record_search_key_isdatasetof: [],
                        fez_record_search_key_ismemberof: [
                            {
                                rek_ismemberof_id: 13119486,
                                rek_ismemberof_pid: 'UQ:5a31f80',
                                rek_ismemberof_xsdmf_id: null,
                                rek_ismemberof: 'UQ:289097',
                                rek_ismemberof_order: 1,
                                parent: {
                                    rek_pid: 'UQ:289097',
                                    rek_title: 'Research Data Collections',
                                    rek_security_policy: 5,
                                    rek_datastream_policy: 5,
                                },
                                rek_ismemberof_lookup: 'Research Data Collections',
                            },
                        ],
                        fez_record_search_key_keywords: [],
                        fez_record_search_key_language: [
                            {
                                rek_language_id: 6048542,
                                rek_language_pid: 'UQ:5a31f80',
                                rek_language_xsdmf_id: null,
                                rek_language: 'eng',
                                rek_language_order: 1,
                            },
                        ],
                        fez_record_search_key_license: {
                            rek_license_id: 145898,
                            rek_license_pid: 'UQ:5a31f80',
                            rek_license_xsdmf_id: null,
                            rek_license: 453701,
                            rek_license_lookup: 'Permitted Re-use with Acknowledgement',
                        },
                        fez_record_search_key_link: [],
                        fez_record_search_key_link_description: [],
                        fez_record_search_key_new_doi: null,
                        fez_record_search_key_notes: null,
                        fez_record_search_key_oa_status: {
                            rek_oa_status_id: 1601753,
                            rek_oa_status_pid: 'UQ:5a31f80',
                            rek_oa_status_xsdmf_id: null,
                            rek_oa_status: 453692,
                            rek_oa_status_lookup: 'Not yet assessed',
                        },
                        fez_record_search_key_oa_status_type: null,
                        fez_record_search_key_org_unit_name: null,
                        fez_record_search_key_possible_author_id: [],
                        fez_record_search_key_project_description: {
                            rek_project_description_id: 5807,
                            rek_project_description_pid: 'UQ:5a31f80',
                            rek_project_description_xsdmf_id: null,
                            rek_project_description: 'test',
                        },
                        fez_record_search_key_project_id: null,
                        fez_record_search_key_project_name: {
                            rek_project_name_id: 5704,
                            rek_project_name_pid: 'UQ:5a31f80',
                            rek_project_name_xsdmf_id: null,
                            rek_project_name: 'test',
                        },
                        fez_record_search_key_publisher: null,
                        fez_record_search_key_rdm_id: null,
                        fez_record_search_key_related_datasets: null,
                        fez_record_search_key_related_publications: null,
                        fez_record_search_key_rights: {
                            rek_rights_id: 144962,
                            rek_rights_pid: 'UQ:5a31f80',
                            rek_rights_xsdmf_id: null,
                            rek_rights: '',
                        },
                        fez_record_search_key_security_policy: [
                            {
                                rek_security_policy_id: 1070723,
                                rek_security_policy_pid: 'UQ:5a31f80',
                                rek_security_policy: 5,
                                rek_security_policy_order: 1,
                            },
                        ],
                        fez_record_search_key_sensitive_handling_note_id: null,
                        fez_record_search_key_sensitive_handling_note_other: null,
                        fez_record_search_key_seo_code: [],
                        fez_record_search_key_software_required: [],
                        fez_record_search_key_start_date: null,
                        fez_record_search_key_series: null,
                        fez_record_search_key_subject: [
                            {
                                rek_subject_id: 10502219,
                                rek_subject_pid: 'UQ:5a31f80',
                                rek_subject_xsdmf_id: null,
                                rek_subject: 451801,
                                rek_subject_order: 1,
                                rek_subject_lookup: '010101 Algebra and Number Theory',
                            },
                        ],
                        fez_record_search_key_sdg: [],
                        fez_record_search_key_sdg_source: [],
                        fez_record_search_key_time_period_end_date: null,
                        fez_record_search_key_time_period_start_date: null,
                        fez_record_search_key_type_of_data: [],
                        fez_matched_journals: [],
                        fez_record_search_key_issn: [],
                        fez_record_search_key_isi_loc: null,
                        fez_record_search_key_scopus_id: null,
                        fez_record_search_key_isderivationof: [],
                        fez_record_search_key_has_related_datasets: [],
                        fez_record_search_key_has_derivations: [],
                        rek_display_type_lookup: 'Data Collection',
                        rek_pubmed_doc_type_lookup: null,
                        rek_object_type_lookup: 'Record',
                        rek_scopus_doc_type_lookup: null,
                        rek_status_lookup: 'Submitted for Approval',
                        rek_wok_doc_type_lookup: null,
                        rek_editing_user: null,
                        rek_editing_user_lookup: null,
                        rek_editing_start_date: null,
                        fez_internal_notes: null,
                        fez_author_affiliation: [],
                        fez_record_search_key_audience_size: null,
                        fez_record_search_key_author_affiliation_id: [],
                        fez_record_search_key_author_affiliation_country: [],
                        fez_record_search_key_author_affiliation_full_address: [],
                        fez_record_search_key_author_affiliation_name: [],
                        fez_record_search_key_author_affiliation_type: [],
                        fez_record_search_key_content_indicator: [],
                        fez_record_search_key_creator_contribution_statement: [],
                        fez_record_search_key_grant_type: [],
                        fez_record_search_key_grant_agency_type: [],
                        fez_record_search_key_quality_indicator: [],
                        fez_record_search_key_significance: [],
                    },
                },
            ];
        });
        mockApi.onAny().reply(config => {
            console.log(
                `Request made with method: ${config.method}, url: ${config.url}, params: ${JSON.stringify(
                    config.params,
                )}`,
            );
            return [200, {}];
        });

        const { getByTestId, queryByTestId, container } = setup();

        await userEvent.click(getByTestId('rek-copyright-input'));

        // Inputs
        const inputs = [
            ['rek-title-input', 'test'],
            ['rek-description-input', 'test'],
            ['rek-contributor-input', 'test'],
            ['rek-contact-details-email-input', 'test@t.au'],
            ['rek-date-day-input', '1'],
            ['rek-date-year-input', '2000'],
            ['rek-author-input', 'test'],
            ['rek-project-name-input', 'test'],
            ['rek-project-description-input', 'test'],
        ];
        for (const [testId, value] of inputs) {
            const input = getByTestId(testId);
            await userEvent.click(input);
            await userEvent.type(input, value);
            await userEvent.tab();
            expect(input).toHaveValue(value);
        }
        expect(getByTestId('rek-date-year-input')).toHaveValue('2000');

        // Selects
        const selects = [
            ['rek-date-month-select', 'November'],
            ['rek-access-conditions-select', 'Open Access'],
            ['rek-license-select', 'Permitted Re-use with Acknowledgement'],
        ];
        for (const [testId, value] of selects) {
            await userEvent.click(screen.getByTestId(testId));
            const selectedOption = await screen.findByText(value);
            await userEvent.click(selectedOption);
            await userEvent.tab();
        }

        // Type to get a list from the api, then choose one
        // Type element, type value, select value
        const selects2 = [
            // Field of Research
            ['rek-subject-input', '010101', /010101/i],
            // Contact Name ID
            ['rek-contributor-id-input', 'David Johnsen', 'David Johnsen'],
            // Creator Role
            ['rek-author-role-input', 'a', /Project Lead/i],
        ];
        for (const [testId, typeValue, selectValue] of selects2) {
            const input = screen.getByTestId(testId);
            await userEvent.click(input);
            await userEvent.type(input, typeValue);
            const option = await screen.findByText(selectValue);
            await userEvent.click(option);
            await userEvent.tab();
        }

        expect(getByTestId('submit-data-collection')).toBeEnabled();

        await userEvent.click(getByTestId('submit-data-collection'));

        await waitFor(() => expect(screen.getByText('ADD ANOTHER MISSING DATASET')).toBeInTheDocument());

        preview.debug();
    });
});
