import RecordsSearchResults from './RecordsSearchResults';
import { accounts } from 'mock/data/account';

function setup(testProps = {}, args = {}) {
    const props = {
        history: {},
        account: accounts.uqresearcher || testProps.account || {},
        ...testProps,
    };
    return getElement(RecordsSearchResults, props, args);
}

describe('Search record results', () => {
    it('should render stepper and no results', () => {
        const wrapper = setup({
            history: {},
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render spinner', () => {
        const wrapper = setup({
            history: {},
            searchLoading: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it(
        'should call componentDidUpdate lifecycle method and focus on ' +
            'create new record button if no publications found',
        () => {
            const focusFn = jest.fn();
            const wrapper = setup({
                history: {},
            });
            wrapper.instance()._setRef({
                focus: focusFn,
            });
            const componentDidUpdate = jest.spyOn(wrapper.instance(), 'componentDidUpdate');

            wrapper.setProps({
                publicationsList: [],
            });
            wrapper.update();

            expect(componentDidUpdate).toHaveBeenCalled();
            expect(focusFn).toHaveBeenCalled();
        },
    );

    it('should call componentDidUpdate lifecycle method and should not focus on create new record button', () => {
        const focusFn = jest.fn();
        const wrapper = setup({
            history: {},
        });
        wrapper.instance()._setRef({
            focus: focusFn,
        });
        const componentDidUpdate = jest.spyOn(wrapper.instance(), 'componentDidUpdate');

        wrapper.setProps({
            publicationsList: ['test', 'test'],
        });

        expect(componentDidUpdate).toHaveBeenCalled();
        expect(focusFn).not.toHaveBeenCalled();
    });

    it('should navigate to find on cancel workflow', () => {
        const cancelWorkflow = jest.fn();
        const history = {
            push: cancelWorkflow,
        };

        const wrapper = setup({
            history: history,
        });
        wrapper.instance()._cancelWorkflow();
        expect(cancelWorkflow).toBeCalled();
    });

    it('should navigate to new publication form', () => {
        const navigateToNewPublicationForm = jest.fn();
        const history = {
            push: navigateToNewPublicationForm,
        };

        const wrapper = setup({
            history: history,
        });
        wrapper.instance()._showNewRecordForm();

        expect(navigateToNewPublicationForm).toBeCalled();
    });

    it('should go to claim publication form with given record', () => {
        const navigateToClaimPublication = jest.fn();
        const setClaimPublication = jest.fn();
        const setRedirectPath = jest.fn();
        const item = { rek_pid: 'UQ:1111111' };

        const actions = {
            setClaimPublication: setClaimPublication,
            setRedirectPath: setRedirectPath,
        };

        const history = {
            push: navigateToClaimPublication,
        };

        const wrapper = setup({
            history: history,
            actions: actions,
        });
        wrapper.instance()._claimPublication(item);

        expect(setClaimPublication).toHaveBeenCalledWith(item);
        expect(setRedirectPath).toHaveBeenCalledWith('/records/add/find');
        expect(navigateToClaimPublication).toHaveBeenCalledWith('/records/claim');
    });

    it(
        'should render a single claimable item with no authors on the record ' +
            '(record should appear in publicationsList prop)',
        () => {
            const navigateToClaimPublication = jest.fn();
            const setClaimPublication = jest.fn();
            const actions = {
                setClaimPublication: setClaimPublication,
            };
            const history = {
                push: navigateToClaimPublication,
            };
            const publicationsList = [
                {
                    rek_pid: 'UQ:795469',
                    rek_title_xsdmf_id: null,
                    rek_title: 'Early Onset Scoliosis - this is an edited book with editors only',
                    rek_description_xsdmf_id: null,
                    rek_description: null,
                    rek_display_type_xsdmf_id: null,
                    rek_display_type: 174,
                    rek_status_xsdmf_id: null,
                    rek_status: 2,
                    rek_date_xsdmf_id: null,
                    rek_date: '2018-01-01T00:00:00Z',
                    rek_object_type_xsdmf_id: null,
                    rek_object_type: 3,
                    rek_depositor_xsdmf_id: null,
                    rek_depositor: 6230,
                    rek_created_date_xsdmf_id: null,
                    rek_created_date: '2018-03-07T23:30:00Z',
                    rek_updated_date_xsdmf_id: null,
                    rek_updated_date: '2018-03-07T23:30:00Z',
                    rek_file_downloads: 0,
                    rek_citation:
                        /* eslint-disable-next-line max-len */
                        ' <i><a class="citation_title" title="Click to view Book: Early Onset Scoliosis" href="/view/UQ:795469">Early Onset Scoliosis</a></i>. Edited by <span class="citation_contributor"><span class="citation_contributor">El-Hawary, Ron</span> and <span class="citation_contributor">Eberson, Craig P.</span></span>  <span class="citation_place_of_publication">Cham</span>: <span class="citation_publisher">Springer International Publishing</span>, <span class="citation_date">2018</span>. doi:<span class="citation_doi">10.1007/978-3-319-71580-3</span>',
                    rek_genre_xsdmf_id: null,
                    rek_genre: null,
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
                    rek_herdc_notes_xsdmf_id: null,
                    rek_herdc_notes: null,
                    rek_scopus_doc_type_xsdmf_id: null,
                    rek_scopus_doc_type: null,
                    rek_wok_doc_type_xsdmf_id: null,
                    rek_wok_doc_type: null,
                    rek_pubmed_doc_type_xsdmf_id: null,
                    rek_pubmed_doc_type: null,
                    rek_security_inherited: 1,
                    rek_altmetric_score: null,
                    rek_altmetric_score_xsdmf_id: null,
                    rek_altmetric_id: null,
                    rek_altmetric_id_xsdmf_id: null,
                    rek_copyright_xsdmf_id: null,
                    rek_copyright: null,
                    fez_record_search_key_access_conditions: null,
                    fez_record_search_key_acknowledgements: null,
                    fez_record_search_key_additional_notes: null,
                    fez_record_search_key_advisory_statement: null,
                    fez_record_search_key_alternate_genre: [],
                    fez_record_search_key_alternative_title: [],
                    fez_record_search_key_ands_collection_type: null,
                    fez_record_search_key_architectural_features: [],
                    fez_record_search_key_article_number: null,
                    fez_record_search_key_assigned_group_id: [],
                    fez_record_search_key_assigned_user_id: [],
                    fez_record_search_key_author: [],
                    fez_record_search_key_author_affiliation_id: [],
                    fez_record_search_key_author_affiliation_country: [],
                    fez_record_search_key_author_affiliation_full_address: [],
                    fez_record_search_key_author_affiliation_name: [],
                    fez_record_search_key_author_id: [],
                    fez_record_search_key_author_role: [],
                    fez_record_search_key_biosis_id: null,
                    fez_record_search_key_book_title: null,
                    fez_record_search_key_building_materials: [],
                    fez_record_search_key_category: [],
                    fez_record_search_key_chapter_number: null,
                    fez_record_search_key_condition: [],
                    fez_record_search_key_conference_dates: null,
                    fez_record_search_key_conference_id: null,
                    fez_record_search_key_conference_location: null,
                    fez_record_search_key_conference_name: null,
                    fez_record_search_key_construction_date: null,
                    fez_record_search_key_contact_details_email: [],
                    fez_record_search_key_contributor: [
                        {
                            rek_contributor_id: 3210380,
                            rek_contributor_pid: 'UQ:795469',
                            rek_contributor_xsdmf_id: null,
                            rek_contributor: 'El-Hawary, Ron',
                            rek_contributor_order: 1,
                        },
                        {
                            rek_contributor_id: 3210381,
                            rek_contributor_pid: 'UQ:795469',
                            rek_contributor_xsdmf_id: null,
                            rek_contributor: 'Eberson, Craig P.',
                            rek_contributor_order: 2,
                        },
                    ],
                    fez_record_search_key_contributor_id: [],
                    fez_record_search_key_convener: null,
                    fez_record_search_key_corresponding_email: [],
                    fez_record_search_key_corresponding_name: [],
                    fez_record_search_key_corresponding_country: [],
                    fez_record_search_key_corresponding_organisation: [],
                    fez_record_search_key_country_of_issue: null,
                    fez_record_search_key_coverage_period: [],
                    fez_record_search_key_creator_id: [],
                    fez_record_search_key_creator_name: [],
                    fez_record_search_key_datastream_policy: null,
                    fez_record_search_key_data_volume: null,
                    fez_record_search_key_date_available: null,
                    fez_record_search_key_date_photo_taken: null,
                    fez_record_search_key_date_recorded: null,
                    fez_record_search_key_date_scanned: null,
                    fez_record_search_key_doi: {
                        rek_doi_id: 1706187,
                        rek_doi_pid: 'UQ:795469',
                        rek_doi_xsdmf_id: null,
                        rek_doi: '10.1007/978-3-319-71580-3',
                    },
                    fez_record_search_key_edition: null,
                    fez_record_search_key_end_date: null,
                    fez_record_search_key_end_page: null,
                    fez_record_search_key_file_attachment_access_condition: [],
                    fez_record_search_key_file_attachment_embargo_date: [],
                    fez_record_search_key_file_attachment_name: [],
                    fez_record_search_key_geographic_area: [],
                    fez_record_search_key_grant_acronym: [],
                    fez_record_search_key_grant_agency: [],
                    fez_record_search_key_grant_agency_id: [],
                    fez_record_search_key_grant_id: [],
                    fez_record_search_key_grant_text: [],
                    fez_record_search_key_herdc_code: null,
                    fez_record_search_key_herdc_status: null,
                    fez_record_search_key_identifier: [],
                    fez_record_search_key_institutional_status: null,
                    fez_record_search_key_interior_features: [],
                    fez_record_search_key_isbn: [
                        {
                            rek_isbn_id: 1115631,
                            rek_isbn_pid: 'UQ:795469',
                            rek_isbn_xsdmf_id: null,
                            rek_isbn: '9783319715797',
                            rek_isbn_order: 1,
                        },
                        {
                            rek_isbn_id: 1115632,
                            rek_isbn_pid: 'UQ:795469',
                            rek_isbn_xsdmf_id: null,
                            rek_isbn: '9783319715803',
                            rek_isbn_order: 2,
                        },
                    ],
                    fez_record_search_key_isdatasetof: [],
                    fez_record_search_key_isderivationof: [],
                    fez_record_search_key_isi_loc: null,
                    fez_record_search_key_ismemberof: [
                        {
                            rek_ismemberof_id: 12232758,
                            rek_ismemberof_pid: 'UQ:795469',
                            rek_ismemberof_xsdmf_id: null,
                            rek_ismemberof: 'UQ:218198',
                            rek_ismemberof_order: 1,
                            rek_ismemberof_lookup: 'Unprocessed Records',
                        },
                    ],
                    fez_record_search_key_issn: [],
                    fez_record_search_key_issue_number: null,
                    fez_record_search_key_job_number: null,
                    fez_record_search_key_journal_name: null,
                    fez_record_search_key_keywords: [],
                    fez_record_search_key_language: [],
                    fez_record_search_key_language_of_book_title: [],
                    fez_record_search_key_language_of_journal_name: [],
                    fez_record_search_key_language_of_proceedings_title: [],
                    fez_record_search_key_language_of_title: [],
                    fez_record_search_key_length: null,
                    fez_record_search_key_license: null,
                    fez_record_search_key_link: [],
                    fez_record_search_key_link_description: [],
                    fez_record_search_key_location: [],
                    fez_record_search_key_native_script_book_title: null,
                    fez_record_search_key_native_script_conference_name: null,
                    fez_record_search_key_native_script_journal_name: null,
                    fez_record_search_key_native_script_proceedings_title: null,
                    fez_record_search_key_native_script_title: null,
                    fez_record_search_key_newspaper: null,
                    fez_record_search_key_notes: null,
                    fez_record_search_key_oa_embargo_days: null,
                    fez_record_search_key_oa_notes: null,
                    fez_record_search_key_oa_status: {
                        rek_oa_status_id: 531834,
                        rek_oa_status_pid: 'UQ:795469',
                        rek_oa_status_xsdmf_id: null,
                        rek_oa_status: 453692,
                        rek_oa_status_lookup: 'Not yet assessed',
                    },
                    fez_record_search_key_org_name: null,
                    fez_record_search_key_org_unit_name: null,
                    fez_record_search_key_original_format: null,
                    fez_record_search_key_parent_publication: null,
                    fez_record_search_key_patent_number: null,
                    fez_record_search_key_period: [],
                    fez_record_search_key_place_of_publication: {
                        rek_place_of_publication_id: 4368221,
                        rek_place_of_publication_pid: 'UQ:795469',
                        rek_place_of_publication_xsdmf_id: null,
                        rek_place_of_publication: 'Cham',
                    },
                    fez_record_search_key_proceedings_title: null,
                    fez_record_search_key_project_description: null,
                    fez_record_search_key_project_id: null,
                    fez_record_search_key_project_name: null,
                    fez_record_search_key_project_start_date: null,
                    fez_record_search_key_publisher: {
                        rek_publisher_id: 4678387,
                        rek_publisher_pid: 'UQ:795469',
                        rek_publisher_xsdmf_id: null,
                        rek_publisher: 'Springer International Publishing',
                    },
                    fez_record_search_key_pubmed_id: null,
                    fez_record_search_key_pubmed_central_id: null,
                    fez_record_search_key_refereed: null,
                    fez_record_search_key_refereed_source: null,
                    fez_record_search_key_related_datasets: null,
                    fez_record_search_key_related_publications: null,
                    fez_record_search_key_report_number: null,
                    fez_record_search_key_retracted: null,
                    fez_record_search_key_rights: null,
                    fez_record_search_key_roman_script_book_title: null,
                    fez_record_search_key_roman_script_conference_name: null,
                    fez_record_search_key_roman_script_journal_name: null,
                    fez_record_search_key_roman_script_proceedings_title: null,
                    fez_record_search_key_roman_script_title: null,
                    fez_record_search_key_scale: null,
                    fez_record_search_key_scopus_id: null,
                    fez_record_search_key_section: null,
                    fez_record_search_key_seo_code: [],
                    fez_record_search_key_series: null,
                    fez_record_search_key_software_required: [],
                    fez_record_search_key_source: null,
                    fez_record_search_key_start_date: null,
                    fez_record_search_key_start_page: null,
                    fez_record_search_key_structural_systems: [],
                    fez_record_search_key_style: [],
                    fez_record_search_key_subcategory: [],
                    fez_record_search_key_subject: [],
                    fez_record_search_key_supervisor: [],
                    fez_record_search_key_supervisor_id: [],
                    fez_record_search_key_surrounding_features: [],
                    fez_record_search_key_time_period_end_date: null,
                    fez_record_search_key_time_period_start_date: null,
                    fez_record_search_key_total_chapters: null,
                    fez_record_search_key_total_pages: null,
                    fez_record_search_key_transcript: null,
                    fez_record_search_key_translated_book_title: null,
                    fez_record_search_key_translated_conference_name: null,
                    fez_record_search_key_translated_journal_name: null,
                    fez_record_search_key_translated_newspaper: null,
                    fez_record_search_key_translated_proceedings_title: null,
                    fez_record_search_key_translated_title: null,
                    fez_record_search_key_type_of_data: [],
                    fez_record_search_key_volume_number: null,
                    fez_record_search_key_wok_doc_types: [],
                    fez_record_search_key_zoorec_id: null,
                    fez_datastream_info: [],
                    fez_matched_journals: [],
                    rek_status_lookup: 'Published',
                    rek_object_type_lookup: 'Record',
                    rek_wok_doc_type_lookup: null,
                    rek_display_type_lookup: 'Book',
                    rek_scopus_doc_type_lookup: null,
                    rek_pubmed_doc_type_lookup: null,
                    sources: [
                        {
                            source: 'espace',
                            id: 'UQ:795469',
                        },
                        {
                            source: 'crossref',
                            id: '10.1007/978-3-319-71580-3',
                        },
                    ],
                    currentSource: 'espace',
                },
            ];

            const wrapper = setup({
                history: history,
                actions: actions,
                publicationsList: publicationsList,
            });
            expect(toJson(wrapper)).toMatchSnapshot();
        },
    );

    it(
        'should render a single unclaimable item with no authors on the record ' +
            '(record should appear in publicationsListSubset prop)',
        () => {
            // const navigateToClaimPublication = jest.fn();
            // const setClaimPublication = jest.fn();
            // const actions = {
            //     setClaimPublication: setClaimPublication,
            // };
            // const history = {
            //     push: navigateToClaimPublication,
            // };
            const publicationsList = [
                {
                    rek_pid: 'UQ:795469',
                    fez_record_search_key_author: [],
                    fez_record_search_key_author_id: [],
                    fez_record_search_key_contributor: [
                        {
                            rek_contributor_id: 3210380,
                            rek_contributor_pid: 'UQ:795469',
                            rek_contributor_xsdmf_id: null,
                            rek_contributor: 'El-Hawary, Ron',
                            rek_contributor_order: 1,
                        },
                        {
                            rek_contributor_id: 3210381,
                            rek_contributor_pid: 'UQ:795469',
                            rek_contributor_xsdmf_id: null,
                            rek_contributor: 'Eberson, Craig P.',
                            rek_contributor_order: 2,
                        },
                    ],
                    fez_record_search_key_contributor_id: [
                        {
                            rek_contributor_id_id: 28581254,
                            rek_contributor_id_pid: 'UQ:70915',
                            rek_contributor_id_xsdmf_id: null,
                            rek_contributor_id: 111,
                            rek_contributor_id_order: 1,
                        },
                        {
                            rek_contributor_id_id: 28581254,
                            rek_contributor_id_pid: 'UQ:70915',
                            rek_contributor_id_xsdmf_id: null,
                            rek_contributor_id: 222,
                            rek_contributor_id_order: 2,
                        },
                    ],
                    fez_record_search_key_doi: {
                        rek_doi_id: 1706187,
                        rek_doi_pid: 'UQ:795469',
                        rek_doi_xsdmf_id: null,
                        rek_doi: '10.1007/978-3-319-71580-3',
                    },
                    sources: [
                        {
                            source: 'espace',
                            id: 'UQ:795469',
                        },
                        {
                            source: 'crossref',
                            id: '10.1007/978-3-319-71580-3',
                        },
                    ],
                    currentSource: 'espace',
                },
            ];

            const wrapper = setup({
                publicationsList: publicationsList,
            });
            expect(toJson(wrapper)).toMatchSnapshot();
        },
    );

    it(
        'should render a single unclaimable item with no authors on the record ' +
            '(record should appear in publicationsListSubset prop) with full mount',
        () => {
            // const navigateToClaimPublication = jest.fn();
            // const setClaimPublication = jest.fn();
            // const actions = {
            //     setClaimPublication: setClaimPublication,
            // };
            // const history = {
            //     push: navigateToClaimPublication,
            // };
            const publicationsList = [
                {
                    rek_pid: 'UQ:795469',
                    fez_record_search_key_author: [],
                    fez_record_search_key_author_id: [],
                    fez_record_search_key_contributor: [
                        {
                            rek_contributor_id: 3210380,
                            rek_contributor_pid: 'UQ:795469',
                            rek_contributor_xsdmf_id: null,
                            rek_contributor: 'El-Hawary, Ron',
                            rek_contributor_order: 1,
                        },
                        {
                            rek_contributor_id: 3210381,
                            rek_contributor_pid: 'UQ:795469',
                            rek_contributor_xsdmf_id: null,
                            rek_contributor: 'Eberson, Craig P.',
                            rek_contributor_order: 2,
                        },
                    ],
                    fez_record_search_key_contributor_id: [
                        {
                            rek_contributor_id_id: 28581254,
                            rek_contributor_id_pid: 'UQ:70915',
                            rek_contributor_id_xsdmf_id: null,
                            rek_contributor_id: 111,
                            rek_contributor_id_order: 1,
                        },
                        {
                            rek_contributor_id_id: 28581254,
                            rek_contributor_id_pid: 'UQ:70915',
                            rek_contributor_id_xsdmf_id: null,
                            rek_contributor_id: 222,
                            rek_contributor_id_order: 2,
                        },
                    ],
                    fez_record_search_key_doi: {
                        rek_doi_id: 1706187,
                        rek_doi_pid: 'UQ:795469',
                        rek_doi_xsdmf_id: null,
                        rek_doi: '10.1007/978-3-319-71580-3',
                    },
                    sources: [
                        {
                            source: 'espace',
                            id: 'UQ:795469',
                        },
                        {
                            source: 'crossref',
                            id: '10.1007/978-3-319-71580-3',
                        },
                    ],
                    currentSource: 'espace',
                },
            ];

            const wrapper = setup(
                {
                    publicationsList: publicationsList,
                },
                { isShallow: false },
            );
            expect(toJson(wrapper)).toMatchSnapshot();
        },
    );

    it(
        'should render publications list with one publication to be able to claim ' +
            '(record should not appear in publicationsListSubset prop)',
        () => {
            // const navigateToClaimPublication = jest.fn();
            // const setClaimPublication = jest.fn();
            // const actions = {
            //     setClaimPublication: setClaimPublication,
            // };
            // const history = {
            //     push: navigateToClaimPublication,
            // };
            const publicationsList = [
                {
                    rek_pid: 'UQ:255472',
                    fez_record_search_key_author: [
                        {
                            rek_author_id: 29052679,
                            rek_author_pid: 'UQ:255472',
                            rek_author_xsdmf_id: 7049,
                            rek_author: 'Jory, Patrick',
                            rek_author_order: 1,
                        },
                        {
                            rek_author_id: 29052680,
                            rek_author_pid: 'UQ:255472',
                            rek_author_xsdmf_id: 7049,
                            rek_author: 'Montesano, Michael J.',
                            rek_author_order: 2,
                        },
                    ],
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id_id: 28420647,
                            rek_author_id_pid: 'UQ:255472',
                            rek_author_id_xsdmf_id: 7044,
                            rek_author_id: 86825,
                            rek_author_id_order: 1,
                            rek_author_id_lookup: 'Patrick Jory',
                        },
                        {
                            rek_author_id_id: 28420648,
                            rek_author_id_pid: 'UQ:255472',
                            rek_author_id_xsdmf_id: 7044,
                            rek_author_id: 0,
                            rek_author_id_order: 2,
                        },
                    ],
                    fez_record_search_key_contributor: [],
                    fez_record_search_key_contributor_id: [],
                },
            ];

            const wrapper = setup({
                publicationsList: publicationsList,
            });
            expect(toJson(wrapper)).toMatchSnapshot();
        },
    );

    it('should not return unclaimablePublicationsList (no pid)', () => {
        // const navigateToClaimPublication = jest.fn();
        // const setClaimPublication = jest.fn();
        // const actions = {
        //     setClaimPublication: setClaimPublication,
        // };
        // const history = {
        //     push: navigateToClaimPublication,
        // };
        const publicationsList = [
            {
                fez_record_search_key_author: [
                    {
                        rek_author_id: 29052679,
                        rek_author_pid: 'UQ:255472',
                        rek_author_xsdmf_id: 7049,
                        rek_author: 'Jory, Patrick',
                        rek_author_order: 1,
                    },
                    {
                        rek_author_id: 29052680,
                        rek_author_pid: 'UQ:255472',
                        rek_author_xsdmf_id: 7049,
                        rek_author: 'Montesano, Michael J.',
                        rek_author_order: 2,
                    },
                ],
                fez_record_search_key_author_id: [
                    {
                        rek_author_id_id: 28420647,
                        rek_author_id_pid: 'UQ:255472',
                        rek_author_id_xsdmf_id: 7044,
                        rek_author_id: 86825,
                        rek_author_id_order: 1,
                        rek_author_id_lookup: 'Patrick Jory',
                    },
                    {
                        rek_author_id_id: 28420648,
                        rek_author_id_pid: 'UQ:255472',
                        rek_author_id_xsdmf_id: 7044,
                        rek_author_id: 0,
                        rek_author_id_order: 2,
                    },
                ],
                fez_record_search_key_contributor: [],
                fez_record_search_key_contributor_id: [],
            },
        ];

        const wrapper = setup({
            publicationsList: publicationsList,
        });
        expect(wrapper.instance().getUnclaimablePublicationsList(publicationsList)).toEqual([]);
    });

    it('should not return unclaimablePublicationsList (number of authors !== number of author_ids)', () => {
        // const navigateToClaimPublication = jest.fn();
        // const setClaimPublication = jest.fn();
        // const actions = {
        //     setClaimPublication: setClaimPublication,
        // };
        // const history = {
        //     push: navigateToClaimPublication,
        // };
        const publicationsList = [
            {
                rek_pid: 'UQ:111111',
                fez_record_search_key_author: [
                    {
                        rek_author_id: 29052679,
                        rek_author_pid: 'UQ:255472',
                        rek_author_xsdmf_id: 7049,
                        rek_author: 'Jory, Patrick',
                        rek_author_order: 1,
                    },
                    {
                        rek_author_id: 29052680,
                        rek_author_pid: 'UQ:255472',
                        rek_author_xsdmf_id: 7049,
                        rek_author: 'Montesano, Michael J.',
                        rek_author_order: 2,
                    },
                ],
                fez_record_search_key_author_id: [
                    {
                        rek_author_id_id: 28420647,
                        rek_author_id_pid: 'UQ:255472',
                        rek_author_id_xsdmf_id: 7044,
                        rek_author_id: 86825,
                        rek_author_id_order: 1,
                        rek_author_id_lookup: 'Patrick Jory',
                    },
                ],
                fez_record_search_key_contributor: [],
                fez_record_search_key_contributor_id: [],
            },
        ];

        const wrapper = setup({
            publicationsList: publicationsList,
        });
        expect(wrapper.instance().getUnclaimablePublicationsList(publicationsList)).toEqual([]);
    });

    it(
        'should not return unclaimablePublicationsList (number of authors === 0 ' +
            'AND number of contributors !== number of contributor_id)',
        () => {
            // const navigateToClaimPublication = jest.fn();
            // const setClaimPublication = jest.fn();
            // const actions = {
            //     setClaimPublication: setClaimPublication,
            // };
            // const history = {
            //     push: navigateToClaimPublication,
            // };
            const publicationsList = [
                {
                    rek_pid: 'UQ:255472',
                    fez_record_search_key_author: [],
                    fez_record_search_key_author_id: [],
                    fez_record_search_key_contributor: [
                        {
                            rek_contributor_id: 3210380,
                            rek_contributor_pid: 'UQ:795469',
                            rek_contributor_xsdmf_id: null,
                            rek_contributor: 'El-Hawary, Ron',
                            rek_contributor_order: 1,
                        },
                        {
                            rek_contributor_id: 3210381,
                            rek_contributor_pid: 'UQ:795469',
                            rek_contributor_xsdmf_id: null,
                            rek_contributor: 'Eberson, Craig P.',
                            rek_contributor_order: 2,
                        },
                    ],
                    fez_record_search_key_contributor_id: [],
                },
            ];

            const wrapper = setup({
                publicationsList: publicationsList,
            });
            expect(wrapper.instance().getUnclaimablePublicationsList(publicationsList)).toEqual([]);
        },
    );

    it('should not return unclaimablePublicationsList (found author ids, but one of them is 0)', () => {
        // const navigateToClaimPublication = jest.fn();
        // const setClaimPublication = jest.fn();
        // const actions = {
        //     setClaimPublication: setClaimPublication,
        // };
        // const history = {
        //     push: navigateToClaimPublication,
        // };
        const publicationsList = [
            {
                rek_pid: 'UQ:111111',
                fez_record_search_key_author: [
                    {
                        rek_author_id: 29052679,
                        rek_author_pid: 'UQ:255472',
                        rek_author_xsdmf_id: 7049,
                        rek_author: 'Jory, Patrick',
                        rek_author_order: 1,
                    },
                    {
                        rek_author_id: 29052680,
                        rek_author_pid: 'UQ:255472',
                        rek_author_xsdmf_id: 7049,
                        rek_author: 'Montesano, Michael J.',
                        rek_author_order: 2,
                    },
                ],
                fez_record_search_key_author_id: [
                    {
                        rek_author_id_id: 28420647,
                        rek_author_id_pid: 'UQ:255472',
                        rek_author_id_xsdmf_id: 7044,
                        rek_author_id: 86825,
                        rek_author_id_order: 1,
                        rek_author_id_lookup: 'Patrick Jory',
                    },
                    {
                        rek_author_id_id: 28420648,
                        rek_author_id_pid: 'UQ:255472',
                        rek_author_id_xsdmf_id: 7044,
                        rek_author_id: 0,
                        rek_author_id_order: 2,
                    },
                ],
                fez_record_search_key_contributor: [],
                fez_record_search_key_contributor_id: [],
            },
        ];

        const wrapper = setup({
            publicationsList: publicationsList,
        });
        expect(wrapper.instance().getUnclaimablePublicationsList(publicationsList)).toEqual([]);
    });

    it('should not return unclaimablePublicationsList (found author ids, but one of them is null)', () => {
        // const navigateToClaimPublication = jest.fn();
        // const setClaimPublication = jest.fn();
        // const actions = {
        //     setClaimPublication: setClaimPublication,
        // };
        // const history = {
        //     push: navigateToClaimPublication,
        // };
        const publicationsList = [
            {
                rek_pid: 'UQ:111111',
                fez_record_search_key_author: [
                    {
                        rek_author_id: 29052679,
                        rek_author_pid: 'UQ:255472',
                        rek_author_xsdmf_id: 7049,
                        rek_author: 'Jory, Patrick',
                        rek_author_order: 1,
                    },
                    {
                        rek_author_id: 29052680,
                        rek_author_pid: 'UQ:255472',
                        rek_author_xsdmf_id: 7049,
                        rek_author: 'Montesano, Michael J.',
                        rek_author_order: 2,
                    },
                ],
                fez_record_search_key_author_id: [
                    {
                        rek_author_id_id: 28420647,
                        rek_author_id_pid: 'UQ:255472',
                        rek_author_id_xsdmf_id: 7044,
                        rek_author_id: 86825,
                        rek_author_id_order: 1,
                        rek_author_id_lookup: 'Patrick Jory',
                    },
                    {
                        rek_author_id_id: 28420648,
                        rek_author_id_pid: 'UQ:255472',
                        rek_author_id_xsdmf_id: 7044,
                        rek_author_id: null,
                        rek_author_id_order: 2,
                    },
                ],
                fez_record_search_key_contributor: [],
                fez_record_search_key_contributor_id: [],
            },
        ];

        const wrapper = setup({
            publicationsList: publicationsList,
        });
        expect(wrapper.instance().getUnclaimablePublicationsList(publicationsList)).toEqual([]);
    });

    it('should not return unclaimablePublicationsList (found contributor ids, but one of them is 0)', () => {
        // const navigateToClaimPublication = jest.fn();
        // const setClaimPublication = jest.fn();
        // const actions = {
        //     setClaimPublication: setClaimPublication,
        // };
        // const history = {
        //     push: navigateToClaimPublication,
        // };
        const publicationsList = [
            {
                rek_pid: 'UQ:111111',
                fez_record_search_key_author: [],
                fez_record_search_key_author_id: [],
                fez_record_search_key_contributor: [
                    {
                        rek_contributor_id: 29052679,
                        rek_contributor_pid: 'UQ:255472',
                        rek_contributor_xsdmf_id: 7049,
                        rek_contributor: 'Jory, Patrick',
                        rek_contributor_order: 1,
                    },
                    {
                        rek_contributor_id: 29052680,
                        rek_contributor_pid: 'UQ:255472',
                        rek_contributor_xsdmf_id: 7049,
                        rek_contributor: 'Montesano, Michael J.',
                        rek_contributor_order: 2,
                    },
                ],
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id_id: 28420647,
                        rek_contributor_id_pid: 'UQ:255472',
                        rek_contributor_id_xsdmf_id: 7044,
                        rek_contributor_id: 86825,
                        rek_contributor_id_order: 1,
                        rek_contributor_id_lookup: 'Patrick Jory',
                    },
                    {
                        rek_contributor_id_id: 28420648,
                        rek_contributor_id_pid: 'UQ:255472',
                        rek_contributor_id_xsdmf_id: 7044,
                        rek_contributor_id: 0,
                        rek_contributor_id_order: 2,
                    },
                ],
            },
        ];

        const wrapper = setup({
            publicationsList: publicationsList,
        });
        expect(wrapper.instance().getUnclaimablePublicationsList(publicationsList)).toEqual([]);
    });

    it('should not return unclaimablePublicationsList (found contributor ids, but one of them is null)', () => {
        // const navigateToClaimPublication = jest.fn();
        // const setClaimPublication = jest.fn();
        // const actions = {
        //     setClaimPublication: setClaimPublication,
        // };
        // const history = {
        //     push: navigateToClaimPublication,
        // };
        const publicationsList = [
            {
                rek_pid: 'UQ:111111',
                fez_record_search_key_author: [],
                fez_record_search_key_author_id: [],
                fez_record_search_key_contributor: [
                    {
                        rek_contributor_id: 29052679,
                        rek_contributor_pid: 'UQ:255472',
                        rek_contributor_xsdmf_id: 7049,
                        rek_contributor: 'Jory, Patrick',
                        rek_contributor_order: 1,
                    },
                    {
                        rek_contributor_id: 29052680,
                        rek_contributor_pid: 'UQ:255472',
                        rek_contributor_xsdmf_id: 7049,
                        rek_contributor: 'Montesano, Michael J.',
                        rek_contributor_order: 2,
                    },
                ],
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id_id: 28420647,
                        rek_contributor_id_pid: 'UQ:255472',
                        rek_contributor_id_xsdmf_id: 7044,
                        rek_contributor_id: 86825,
                        rek_contributor_id_order: 1,
                        rek_contributor_id_lookup: 'Patrick Jory',
                    },
                    {
                        rek_contributor_id_id: 28420648,
                        rek_contributor_id_pid: 'UQ:255472',
                        rek_contributor_id_xsdmf_id: 7044,
                        rek_contributor_id: null,
                        rek_contributor_id_order: 2,
                    },
                ],
            },
        ];

        const wrapper = setup({
            publicationsList: publicationsList,
        });
        expect(wrapper.instance().getUnclaimablePublicationsList(publicationsList)).toEqual([]);
    });

    it(
        'should return one publication in unclaimablePublicationsList (has rek_pid, number of ' +
            'authors === number of author ids, number of contributors === number of contributos ids, ' +
            'all author ids > 0, all contributor ids > 0)',
        () => {
            // const navigateToClaimPublication = jest.fn();
            // const setClaimPublication = jest.fn();
            // const actions = {
            //     setClaimPublication: setClaimPublication,
            // };
            // const history = {
            //     push: navigateToClaimPublication,
            // };
            const publicationsList = [
                {
                    rek_pid: 'UQ:255472',
                    fez_record_search_key_author: [],
                    fez_record_search_key_author_id: [],
                    fez_record_search_key_contributor: [
                        {
                            rek_contributor_id: 29052679,
                            rek_contributor_pid: 'UQ:255472',
                            rek_contributor_xsdmf_id: 7049,
                            rek_contributor: 'Jory, Patrick',
                            rek_contributor_order: 1,
                        },
                        {
                            rek_contributor_id: 29052680,
                            rek_contributor_pid: 'UQ:255472',
                            rek_contributor_xsdmf_id: 7049,
                            rek_contributor: 'Montesano, Michael J.',
                            rek_contributor_order: 2,
                        },
                    ],
                    fez_record_search_key_contributor_id: [
                        {
                            rek_contributor_id_id: 28420647,
                            rek_contributor_id_pid: 'UQ:255472',
                            rek_contributor_id_xsdmf_id: 7044,
                            rek_contributor_id: 86825,
                            rek_contributor_id_order: 1,
                            rek_contributor_id_lookup: 'Patrick Jory',
                        },
                        {
                            rek_contributor_id_id: 28420648,
                            rek_contributor_id_pid: 'UQ:255472',
                            rek_contributor_id_xsdmf_id: 7044,
                            rek_contributor_id: 5481,
                            rek_contributor_id_order: 2,
                        },
                    ],
                },
            ];

            const wrapper = setup();
            expect(wrapper.instance().getUnclaimablePublicationsList(publicationsList)).toEqual(['UQ:255472']);
        },
    );

    it('should not show WSoD if no authors/contributors present on the record', () => {
        const publicationsList = [
            {
                rek_pid: 'UQ:255472',
            },
        ];

        const wrapper = setup();
        expect(wrapper.instance().getUnclaimablePublicationsList(publicationsList)).toEqual(['UQ:255472']);
    });
});
