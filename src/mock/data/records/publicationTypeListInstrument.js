import { hydrateMockSearchList } from '../../../helpers/general';

const publicationTypeListInstrument = {
    "total": 2,
    "took": 1,
    "per_page": 999,
    "current_page": 1,
    "from": 1,
    "to": 2,
    "data": [{
        "rek_pid": "UQ:23aac26",
        "rek_title_xsdmf_id": null,
        "rek_title": "Title",
        "rek_description_xsdmf_id": null,
        "rek_description": "desc",
        "rek_display_type_xsdmf_id": null,
        "rek_display_type": 378,
        "rek_status_xsdmf_id": null,
        "rek_status": 2,
        "rek_date_xsdmf_id": null,
        "rek_date": "1933-03-03T00:00:00Z",
        "rek_object_type_xsdmf_id": null,
        "rek_object_type": 3,
        "rek_depositor_xsdmf_id": null,
        "rek_depositor": 1000002309,
        "rek_created_date_xsdmf_id": null,
        "rek_created_date": "2025-02-17T07:15:53Z",
        "rek_updated_date_xsdmf_id": null,
        "rek_updated_date": "2025-02-17T07:15:53Z",
        "rek_file_downloads": 0,
        "rek_citation": "<a class=\"citation_author_name\" title=\"Browse by Author Name for manufacturer\" href=\"\/records\/search?searchQueryParams%5Brek_author%5D%5Bvalue%5D=manufacturer&searchQueryParams%5Brek_author%5D%5Blabel%5D=manufacturer&searchMode=advanced\">manufacturer<\/a> (<span class=\"citation_date\">1933<\/span>). <i><a class=\"citation_title\" title=\"Click to view Instrument: Title\" href=\"\/view\/UQ:23aac26\">Title<\/a><\/i>.",
        "rek_genre_xsdmf_id": null,
        "rek_genre": "Instrument",
        "rek_genre_type_xsdmf_id": null,
        "rek_genre_type": null,
        "rek_formatted_title_xsdmf_id": null,
        "rek_formatted_title": "<p>Title<\/p>",
        "rek_formatted_abstract_xsdmf_id": null,
        "rek_formatted_abstract": "<p>desc<\/p>",
        "rek_depositor_affiliation_xsdmf_id": null,
        "rek_depositor_affiliation": null,
        "rek_thomson_citation_count": null,
        "rek_thomson_citation_count_xsdmf_id": null,
        "rek_subtype_xsdmf_id": null,
        "rek_subtype": null,
        "rek_scopus_citation_count": null,
        "rek_dimensions_citation_count": null,
        "rek_scopus_doc_type_xsdmf_id": null,
        "rek_scopus_doc_type": null,
        "rek_wok_doc_type_xsdmf_id": null,
        "rek_wok_doc_type": null,
        "rek_pubmed_doc_type_xsdmf_id": null,
        "rek_pubmed_doc_type": null,
        "rek_dimensions_doc_type": null,
        "rek_security_inherited": 1,
        "rek_altmetric_score": null,
        "rek_altmetric_score_xsdmf_id": null,
        "rek_altmetric_id": null,
        "rek_altmetric_id_xsdmf_id": null,
        "rek_copyright_xsdmf_id": null,
        "rek_copyright": "on",
        "rek_security_policy": 1,
        "rek_datastream_policy": null,
        "rek_ci_notice_attribution_incomplete": null,
        "fez_datastream_info": [],
        "fez_record_search_key_author": [
            {
                "rek_author_id": 37741992,
                "rek_author_pid": "UQ:23aac26",
                "rek_author_xsdmf_id": null,
                "rek_author": "manufacturer",
                "rek_author_order": 1
            }
        ],
        "fez_record_search_key_author_id": [
            {
                "rek_author_id_id": 37943349,
                "rek_author_id_pid": "UQ:23aac26",
                "rek_author_id_xsdmf_id": null,
                "rek_author_id": 0,
                "rek_author_id_order": 1,
                "author": null
            }
        ],
        "fez_record_search_key_author_identifier": [
            {
                "rek_author_identifier_id": 1,
                "rek_author_identifier_pid": "UQ:23aac26",
                "rek_author_identifier_order": 1,
                "rek_author_identifier": "0000-0000-0000-00002"
            }
        ],
        "fez_record_search_key_author_identifier_type": [
            {
                "rek_author_identifier_type_id": 1,
                "rek_author_identifier_type_pid": "UQ:23aac26",
                "rek_author_identifier_type_order": 1,
                "rek_author_identifier_type": 459136
            }
        ],
        "fez_record_search_key_contact_details_email": [
            {
                "rek_contact_details_email_id": 11447,
                "rek_contact_details_email_pid": "UQ:23aac26",
                "rek_contact_details_email_xsdmf_id": null,
                "rek_contact_details_email": "Owner@email.com",
                "rek_contact_details_email_order": 1
            }
        ],
        "fez_record_search_key_contributor": [
            {
                "rek_contributor_id": 3321467,
                "rek_contributor_pid": "UQ:23aac26",
                "rek_contributor_xsdmf_id": null,
                "rek_contributor": "Owner name",
                "rek_contributor_order": 1
            }
        ],
        "fez_record_search_key_contributor_id": [
            {
                "rek_contributor_id_id": 2475658,
                "rek_contributor_id_pid": "UQ:23aac26",
                "rek_contributor_id_xsdmf_id": null,
                "rek_contributor_id": 0,
                "rek_contributor_id_order": 1
            }
        ],
        "fez_record_search_key_contributor_identifier": [],
        "fez_record_search_key_contributor_identifier_type": [],
        "fez_record_search_key_datastream_policy": null,
        "fez_record_search_key_instrument_type": [
            {
                "rek_instrument_type_id": 1,
                "rek_instrument_type_pid": "UQ:23aac26",
                "rek_instrument_type_order": 1,
                "rek_instrument_type": "instrument type"
            }
        ],
        "fez_record_search_key_doi": null,
        "fez_record_search_key_end_date": {
            "rek_end_date_id": 2579,
            "rek_end_date_pid": "UQ:23aac26",
            "rek_end_date_xsdmf_id": null,
            "rek_end_date": "1922-02-02T00:00:00Z"
        },
        "fez_record_search_key_model": [
            {
                "rek_model_id": 1,
                "rek_model_pid": "UQ:23aac26",
                "rek_model_order": 1,
                "rek_model": "model"
            }
        ],
        "fez_record_search_key_measured_variable": [
            {
                "rek_measured_variable_id": 1,
                "rek_measured_variable_pid": "UQ:23aac26",
                "rek_measured_variable_order": 1,
                "rek_measured_variable": "variable"
            }
        ],
        "fez_record_search_key_alternate_identifier": [
            {
                "rek_alternate_identifier_id": 1,
                "rek_alternate_identifier_pid": "UQ:23aac26",
                "rek_alternate_identifier_order": 1,
                "rek_alternate_identifier": "alternate identifier 1"
            },
            {
                "rek_alternate_identifier_id": 1,
                "rek_alternate_identifier_pid": "UQ:23aac26",
                "rek_alternate_identifier_order": 2,
                "rek_alternate_identifier": "alternate identifier 2"
            },
            {
                "rek_alternate_identifier_id": 1,
                "rek_alternate_identifier_pid": "UQ:23aac26",
                "rek_alternate_identifier_order": 3,
                "rek_alternate_identifier": "alternate identifier 3"
            }
        ],
        "fez_record_search_key_alternate_identifier_type": [
            {
                "rek_alternate_identifier_type_id": 1,
                "rek_alternate_identifier_type_pid": "UQ:23aac26",
                "rek_alternate_identifier_type_order": 1,
                "rek_alternate_identifier_type": 459133,
                "rek_alternate_identifier_type_lookup": 'Serial Number'
            },
            {
                "rek_alternate_identifier_type_id": 1,
                "rek_alternate_identifier_type_pid": "UQ:23aac26",
                "rek_alternate_identifier_type_order": 2,
                "rek_alternate_identifier_type": 459134,
                "rek_alternate_identifier_type_lookup": 'Inventory Number'
            }
        ],
        "fez_record_search_key_ismemberof": [
            {
                "rek_ismemberof_id": 13119576,
                "rek_ismemberof_pid": "UQ:23aac26",
                "rek_ismemberof_xsdmf_id": null,
                "rek_ismemberof": "UQ:400974",
                "rek_ismemberof_order": 1,
                "parent": {
                    "rek_pid": "UQ:400974",
                    "rek_title": "LTS Testing Copy",
                    "rek_security_policy": 1,
                    "rek_datastream_policy": 1
                },
                "rek_ismemberof_lookup": "LTS Testing Copy"
            }
        ],
        "fez_record_search_key_notes": {
            "rek_notes_id": 1224660,
            "rek_notes_pid": "UQ:23aac26",
            "rek_notes_xsdmf_id": null,
            "rek_notes": "<p>additional notes<\/p>"
        },
        "fez_record_search_key_publisher": {
            "rek_publisher_id": 1224660,
            "rek_publisher_pid": "UQ:23aac26",
            "rek_publisher": "The University of Queensland"
        },
        "fez_record_search_key_security_policy": [
            {
                "rek_security_policy_id": 1070784,
                "rek_security_policy_pid": "UQ:23aac26",
                "rek_security_policy": 1,
                "rek_security_policy_order": 1
            }
        ],
        "fez_record_search_key_start_date": {
            "rek_start_date_id": 2589,
            "rek_start_date_pid": "UQ:23aac26",
            "rek_start_date_xsdmf_id": null,
            "rek_start_date": "1911-01-02T00:00:00Z"
        },
        "fez_matched_journals": [],
        "fez_record_search_key_issn": [],
        "fez_record_search_key_isi_loc": null,
        "fez_record_search_key_scopus_id": null,
        "fez_record_search_key_isdatasetof": [],
        "fez_record_search_key_isderivationof": [],
        "fez_record_search_key_sdg_source": [],
        "fez_record_search_key_has_related_datasets": [],
        "fez_record_search_key_has_derivations": [],
        "rek_display_type_lookup": "Instrument",
        "rek_pubmed_doc_type_lookup": null,
        "rek_object_type_lookup": "Record",
        "rek_scopus_doc_type_lookup": null,
        "rek_status_lookup": "Published",
        "rek_wok_doc_type_lookup": null,
        "rek_editing_user": null,
        "rek_editing_user_lookup": null,
        "rek_editing_start_date": null,
        "fez_internal_notes": {
            "ain_id": 186991,
            "ain_pid": "UQ:23aac26",
            "ain_detail": "<p>internal notes<\/p>"
        },
        "fez_author_affiliation": [],
        "fez_record_search_key_audience_size": null,
        "fez_record_search_key_author_affiliation_id": [],
        "fez_record_search_key_author_affiliation_country": [],
        "fez_record_search_key_author_affiliation_full_address": [],
        "fez_record_search_key_author_affiliation_name": [],
        "fez_record_search_key_author_affiliation_type": [],
        "fez_record_search_key_content_indicator": [],
        "fez_record_search_key_creator_contribution_statement": [],
        "fez_record_search_key_grant_type": [],
        "fez_record_search_key_grant_agency_type": [],
        "fez_record_search_key_quality_indicator": [],
        "fez_record_search_key_significance": []
    }]
};
export default hydrateMockSearchList(publicationTypeListInstrument);
