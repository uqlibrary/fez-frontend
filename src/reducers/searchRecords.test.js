import * as actions from '../actions/actionTypes';
import * as reducer from './searchRecords';

describe('Search reducer', () => {
    it('should return deduplicated list of publications', () => {

        const espaceList = [
            {
                "currentSource": "espace",
                "sources": [{source: "espace", id: "UQ:224457"}],
                "rek_pid": "UQ:224457",
                "rek_title_xsdmf_id": 10623,
                "rek_title": "Dicistroviruses",
                "rek_description_xsdmf_id": null,
                "rek_description": null,
                "rek_display_type_xsdmf_id": 3673,
                "rek_display_type": 177,
                "rek_status_xsdmf_id": 3680,
                "rek_status": 2,
                "rek_date_xsdmf_id": 6260,
                "rek_date": "2010-01-01T00:00:00Z",
                "rek_object_type_xsdmf_id": 3674,
                "rek_object_type": 3,
                "rek_depositor_xsdmf_id": 7578,
                "rek_depositor": 1894,
                "rek_created_date_xsdmf_id": 3677,
                "rek_created_date": "2010-12-13T16:46:56Z",
                "rek_updated_date_xsdmf_id": 3678,
                "rek_updated_date": "2014-10-03T19:30:24Z",
                "rek_file_downloads": 5,
                "rek_citation": "<a class=\"citation_author_name\" title=\"Browse by Author Name for Bonning, Bryony C.\" href=\"\/list\/author\/Bonning%2C+Bryony+C.\/\">Bonning, Bryony C.<\/a> and <a class=\"author_id_link\" title=\"Browse by Author ID for Johnson, Karyn N.\" href=\"\/list\/author_id\/2999\/\">Johnson, Karyn N.<\/a> (<span class=\"citation_date\">2010<\/span>). <a class=\"citation_title\" title=\"Click to view Book Chapter: Dicistroviruses\" href=\"\/view\/UQ:224457\">Dicistroviruses<\/a>. In <span class=\"citation_contributor\"><span class=\"citation_contributor\">Sussan Asgari<\/span> and <span class=\"citation_contributor\">Karyn N. Johnson<\/span><\/span> (Ed.), <i><span class=\"citation_book_title\">Insect Virology<\/span><\/i>  (pp. <span class=\"citation_start_page\">197<\/span>-<span class=\"citation_end_page\">229<\/span>)  <span class=\"citation_place_of_publication\">Norfolk, United Kingdom<\/span>: <span class=\"citation_publisher\">Caister Academic Press<\/span>.",
                "rek_genre_xsdmf_id": 7201,
                "rek_genre": "Book Chapter",
                "rek_genre_type_xsdmf_id": null,
                "rek_genre_type": null,
                "rek_formatted_title_xsdmf_id": null,
                "rek_formatted_title": null,
                "rek_formatted_abstract_xsdmf_id": null,
                "rek_formatted_abstract": null,
                "rek_depositor_affiliation_xsdmf_id": 11881,
                "rek_depositor_affiliation": 880,
                "rek_thomson_citation_count": 2,
                "rek_thomson_citation_count_xsdmf_id": null,
                "rek_subtype_xsdmf_id": 12378,
                "rek_subtype": "Research book chapter (original research)",
                "rek_scopus_citation_count": null,
                "rek_herdc_notes_xsdmf_id": 12417,
                "rek_herdc_notes": "Published by-line: Sassan Asgari and Karyn N. Johnson School of Biological Sciences, The University of Queensland, St Lucia QLD 4072, Australia; Publisher review evidence: http:\/\/www.caister.com\/<br \/><br \/>BX converted to B1 <br \/>Critical review of current research<br \/>Caister Academic Press is one of the leading publishers of advanced texts in virology, microbiology and molecular biology.&nbsp;&nbsp;&nbsp; http:\/\/www.caister.com\/&nbsp;&nbsp;&nbsp; (dc IMU) 14\/6<br \/><br \/>Work Doc Type - @ Article<br \/>",
                "rek_scopus_doc_type_xsdmf_id": null,
                "rek_scopus_doc_type": null,
                "rek_wok_doc_type_xsdmf_id": 12551,
                "rek_wok_doc_type": "@",
                "rek_pubmed_doc_type_xsdmf_id": null,
                "rek_pubmed_doc_type": null,
                "rek_security_inherited": 1,
                "rek_altmetric_score": null,
                "rek_altmetric_score_xsdmf_id": null,
                "rek_altmetric_id": null,
                "rek_altmetric_id_xsdmf_id": null,
                "rek_copyright_xsdmf_id": 3679,
                "rek_copyright": "on",
                "fez_record_search_key_access_conditions": null,
                "fez_record_search_key_acknowledgements": null,
                "fez_record_search_key_additional_notes": null,
                "fez_record_search_key_advisory_statement": null,
                "fez_record_search_key_alternate_genre": [],
                "fez_record_search_key_alternative_title": [],
                "fez_record_search_key_ands_collection_type": null,
                "fez_record_search_key_architectural_features": [],
                "fez_record_search_key_article_number": null,
                "fez_record_search_key_assigned_group_id": [],
                "fez_record_search_key_assigned_user_id": [],
                "fez_record_search_key_author": [{
                    "rek_author_id": 28971955,
                    "rek_author_pid": "UQ:224457",
                    "rek_author_xsdmf_id": 6230,
                    "rek_author": "Bonning, Bryony C.",
                    "rek_author_order": 1
                }, {
                    "rek_author_id": 28971956,
                    "rek_author_pid": "UQ:224457",
                    "rek_author_xsdmf_id": 6230,
                    "rek_author": "Johnson, Karyn N.",
                    "rek_author_order": 2
                }],
                "fez_record_search_key_author_affiliation_id": [],
                "fez_record_search_key_author_affiliation_country": [],
                "fez_record_search_key_author_affiliation_full_address": [],
                "fez_record_search_key_author_affiliation_name": [],
                "fez_record_search_key_author_id": [{
                    "rek_author_id_id": 28340800,
                    "rek_author_id_pid": "UQ:224457",
                    "rek_author_id_xsdmf_id": 6225,
                    "rek_author_id": 0,
                    "rek_author_id_order": 1
                }, {
                    "rek_author_id_id": 28340801,
                    "rek_author_id_pid": "UQ:224457",
                    "rek_author_id_xsdmf_id": 6225,
                    "rek_author_id": 2999,
                    "rek_author_id_order": 2
                }],
                "fez_record_search_key_author_role": [],
                "fez_record_search_key_book_title": {
                    "rek_book_title_id": 291225,
                    "rek_book_title_pid": "UQ:224457",
                    "rek_book_title_xsdmf_id": 10630,
                    "rek_book_title": "Insect Virology"
                },
                "fez_record_search_key_building_materials": [],
                "fez_record_search_key_category": [],
                "fez_record_search_key_chapter_number": {
                    "rek_chapter_number_id": 136341,
                    "rek_chapter_number_pid": "UQ:224457",
                    "rek_chapter_number_xsdmf_id": 9642,
                    "rek_chapter_number": "9"
                },
                "fez_record_search_key_condition": [],
                "fez_record_search_key_conference_dates": null,
                "fez_record_search_key_conference_id": null,
                "fez_record_search_key_conference_location": null,
                "fez_record_search_key_conference_name": null,
                "fez_record_search_key_construction_date": null,
                "fez_record_search_key_contact_details_email": [],
                "fez_record_search_key_contributor": [{
                    "rek_contributor_id": 3100711,
                    "rek_contributor_pid": "UQ:224457",
                    "rek_contributor_xsdmf_id": 6238,
                    "rek_contributor": "Sussan Asgari",
                    "rek_contributor_order": 1
                }, {
                    "rek_contributor_id": 3100712,
                    "rek_contributor_pid": "UQ:224457",
                    "rek_contributor_xsdmf_id": 6238,
                    "rek_contributor": "Karyn N. Johnson",
                    "rek_contributor_order": 2
                }],
                "fez_record_search_key_contributor_id": [{
                    "rek_contributor_id_id": 2312201,
                    "rek_contributor_id_pid": "UQ:224457",
                    "rek_contributor_id_xsdmf_id": 6233,
                    "rek_contributor_id": 2863,
                    "rek_contributor_id_order": 1
                }, {
                    "rek_contributor_id_id": 2312202,
                    "rek_contributor_id_pid": "UQ:224457",
                    "rek_contributor_id_xsdmf_id": 6233,
                    "rek_contributor_id": 0,
                    "rek_contributor_id_order": 2
                }],
                "fez_record_search_key_convener": null,
                "fez_record_search_key_corresponding_email": [],
                "fez_record_search_key_corresponding_name": [],
                "fez_record_search_key_corresponding_country": [],
                "fez_record_search_key_corresponding_organisation": [],
                "fez_record_search_key_country_of_issue": null,
                "fez_record_search_key_coverage_period": [],
                "fez_record_search_key_creator_id": [],
                "fez_record_search_key_creator_name": [],
                "fez_record_search_key_datastream_policy": null,
                "fez_record_search_key_data_volume": null,
                "fez_record_search_key_date_available": {
                    "rek_date_available_id": 920951,
                    "rek_date_available_pid": "UQ:224457",
                    "rek_date_available_xsdmf_id": 10621,
                    "rek_date_available": "2010-01-01T00:00:00Z"
                },
                "fez_record_search_key_date_photo_taken": null,
                "fez_record_search_key_date_recorded": null,
                "fez_record_search_key_date_scanned": null,
                "fez_record_search_key_doi": null,
                "fez_record_search_key_edition": null,
                "fez_record_search_key_end_date": null,
                "fez_record_search_key_end_page": {
                    "rek_end_page_id": 5520210,
                    "rek_end_page_pid": "UQ:224457",
                    "rek_end_page_xsdmf_id": 6266,
                    "rek_end_page": "229"
                },
                "fez_record_search_key_fields_of_research": [],
                "fez_record_search_key_file_attachment_access_condition": [],
                "fez_record_search_key_file_attachment_embargo_date": [],
                "fez_record_search_key_file_attachment_name": [{
                    "rek_file_attachment_name_id": 3950480,
                    "rek_file_attachment_name_pid": "UQ:224457",
                    "rek_file_attachment_name_xsdmf_id": 6320,
                    "rek_file_attachment_name": "UQ224457.pdf",
                    "rek_file_attachment_name_order": 1
                }, {
                    "rek_file_attachment_name_id": 3950481,
                    "rek_file_attachment_name_pid": "UQ:224457",
                    "rek_file_attachment_name_xsdmf_id": 6320,
                    "rek_file_attachment_name": "presmd_UQ224457.xml",
                    "rek_file_attachment_name_order": 2
                }],
                "fez_record_search_key_geographic_area": [],
                "fez_record_search_key_grant_acronym": [],
                "fez_record_search_key_grant_agency": [],
                "fez_record_search_key_grant_agency_id": [],
                "fez_record_search_key_grant_id": [],
                "fez_record_search_key_grant_text": [],
                "fez_record_search_key_herdc_code": {
                    "rek_herdc_code_id": 4677721,
                    "rek_herdc_code_pid": "UQ:224457",
                    "rek_herdc_code_xsdmf_id": 12389,
                    "rek_herdc_code": 450006
                },
                "fez_record_search_key_herdc_status": {
                    "rek_herdc_status_id": 3588837,
                    "rek_herdc_status_pid": "UQ:224457",
                    "rek_herdc_status_xsdmf_id": 12405,
                    "rek_herdc_status": 453221
                },
                "fez_record_search_key_identifier": [],
                "fez_record_search_key_institutional_status": {
                    "rek_institutional_status_id": 3250037,
                    "rek_institutional_status_pid": "UQ:224457",
                    "rek_institutional_status_xsdmf_id": 12406,
                    "rek_institutional_status": 453223
                },
                "fez_record_search_key_interior_features": [],
                "fez_record_search_key_isbn": [{
                    "rek_isbn_id": 1060903,
                    "rek_isbn_pid": "UQ:224457",
                    "rek_isbn_xsdmf_id": 10820,
                    "rek_isbn": "9781904455714",
                    "rek_isbn_order": 1
                }],
                "fez_record_search_key_isdatasetof": [],
                "fez_record_search_key_isderivationof": [],
                "fez_record_search_key_isi_loc": {
                    "rek_isi_loc_id": 3901795,
                    "rek_isi_loc_pid": "UQ:224457",
                    "rek_isi_loc_xsdmf_id": 10821,
                    "rek_isi_loc": "000283520500009"
                },
                "fez_record_search_key_ismemberof": [{
                    "rek_ismemberof_id": 11565514,
                    "rek_ismemberof_pid": "UQ:224457",
                    "rek_ismemberof_xsdmf_id": 149,
                    "rek_ismemberof": "UQ:3805",
                    "rek_ismemberof_order": 1
                }, {
                    "rek_ismemberof_id": 11565515,
                    "rek_ismemberof_pid": "UQ:224457",
                    "rek_ismemberof_xsdmf_id": 149,
                    "rek_ismemberof": "UQ:228284",
                    "rek_ismemberof_order": 2
                }],
                "fez_record_search_key_issn": [],
                "fez_record_search_key_issue_number": null,
                "fez_record_search_key_job_number": null,
                "fez_record_search_key_journal_name": null,
                "fez_record_search_key_keywords": [],
                "fez_record_search_key_language": [{
                    "rek_language_id": 5247803,
                    "rek_language_pid": "UQ:224457",
                    "rek_language_xsdmf_id": 10620,
                    "rek_language": "eng",
                    "rek_language_order": 1
                }],
                "fez_record_search_key_language_of_book_title": [],
                "fez_record_search_key_language_of_journal_name": [],
                "fez_record_search_key_language_of_proceedings_title": [],
                "fez_record_search_key_language_of_title": [],
                "fez_record_search_key_length": null,
                "fez_record_search_key_license": null,
                "fez_record_search_key_link": [],
                "fez_record_search_key_link_description": [],
                "fez_record_search_key_location": [],
                "fez_record_search_key_native_script_book_title": null,
                "fez_record_search_key_native_script_conference_name": null,
                "fez_record_search_key_native_script_journal_name": null,
                "fez_record_search_key_native_script_proceedings_title": null,
                "fez_record_search_key_native_script_title": null,
                "fez_record_search_key_newspaper": null,
                "fez_record_search_key_notes": null,
                "fez_record_search_key_oa_embargo_days": null,
                "fez_record_search_key_oa_notes": null,
                "fez_record_search_key_oa_status": null,
                "fez_record_search_key_org_name": null,
                "fez_record_search_key_org_unit_name": null,
                "fez_record_search_key_original_format": null,
                "fez_record_search_key_parent_publication": null,
                "fez_record_search_key_patent_number": null,
                "fez_record_search_key_period": [],
                "fez_record_search_key_place_of_publication": {
                    "rek_place_of_publication_id": 4188105,
                    "rek_place_of_publication_pid": "UQ:224457",
                    "rek_place_of_publication_xsdmf_id": 6258,
                    "rek_place_of_publication": "Norfolk, United Kingdom"
                },
                "fez_record_search_key_proceedings_title": null,
                "fez_record_search_key_project_description": null,
                "fez_record_search_key_project_id": null,
                "fez_record_search_key_project_name": null,
                "fez_record_search_key_project_start_date": null,
                "fez_record_search_key_publisher": {
                    "rek_publisher_id": 4453120,
                    "rek_publisher_pid": "UQ:224457",
                    "rek_publisher_xsdmf_id": 6259,
                    "rek_publisher": "Caister Academic Press"
                },
                "fez_record_search_key_pubmed_id": null,
                "fez_record_search_key_refereed": null,
                "fez_record_search_key_refereed_source": {
                    "rek_refereed_source_id": 1205701,
                    "rek_refereed_source_pid": "UQ:224457",
                    "rek_refereed_source_xsdmf_id": 16623,
                    "rek_refereed_source": "453634"
                },
                "fez_record_search_key_related_datasets": null,
                "fez_record_search_key_related_publications": null,
                "fez_record_search_key_report_number": null,
                "fez_record_search_key_retracted": null,
                "fez_record_search_key_rights": null,
                "fez_record_search_key_roman_script_book_title": null,
                "fez_record_search_key_roman_script_conference_name": null,
                "fez_record_search_key_roman_script_journal_name": null,
                "fez_record_search_key_roman_script_proceedings_title": null,
                "fez_record_search_key_roman_script_title": null,
                "fez_record_search_key_scale": null,
                "fez_record_search_key_scopus_id": null,
                "fez_record_search_key_section": null,
                "fez_record_search_key_seo_code": [],
                "fez_record_search_key_series": null,
                "fez_record_search_key_software_required": [],
                "fez_record_search_key_source": null,
                "fez_record_search_key_start_date": null,
                "fez_record_search_key_start_page": {
                    "rek_start_page_id": 5590547,
                    "rek_start_page_pid": "UQ:224457",
                    "rek_start_page_xsdmf_id": 6265,
                    "rek_start_page": "197"
                },
                "fez_record_search_key_structural_systems": [],
                "fez_record_search_key_style": [],
                "fez_record_search_key_subcategory": [],
                "fez_record_search_key_subject": [],
                "fez_record_search_key_supervisor": [],
                "fez_record_search_key_supervisor_id": [],
                "fez_record_search_key_surrounding_features": [],
                "fez_record_search_key_time_period_end_date": null,
                "fez_record_search_key_time_period_start_date": null,
                "fez_record_search_key_total_chapters": {
                    "rek_total_chapters_id": 190316,
                    "rek_total_chapters_pid": "UQ:224457",
                    "rek_total_chapters_xsdmf_id": 9644,
                    "rek_total_chapters": "18"
                },
                "fez_record_search_key_total_pages": {
                    "rek_total_pages_id": 5502748,
                    "rek_total_pages_pid": "UQ:224457",
                    "rek_total_pages_xsdmf_id": 9632,
                    "rek_total_pages": "33"
                },
                "fez_record_search_key_transcript": null,
                "fez_record_search_key_translated_book_title": null,
                "fez_record_search_key_translated_conference_name": null,
                "fez_record_search_key_translated_journal_name": null,
                "fez_record_search_key_translated_newspaper": null,
                "fez_record_search_key_translated_proceedings_title": null,
                "fez_record_search_key_translated_title": null,
                "fez_record_search_key_type_of_data": [],
                "fez_record_search_key_volume_number": null
            },
            {
                "currentSource": "espace",
                "sources": [{source: "espace", id: "UQ:683770"}],
                "rek_pid": "UQ:683770",
                "rek_title_xsdmf_id": null,
                "rek_title": "Dicistroviruses",
                "rek_description_xsdmf_id": null,
                "rek_description": null,
                "rek_display_type_xsdmf_id": null,
                "rek_display_type": 179,
                "rek_status_xsdmf_id": null,
                "rek_status": 2,
                "rek_date_xsdmf_id": null,
                "rek_date": "2010-01-01T00:00:00Z",
                "rek_object_type_xsdmf_id": null,
                "rek_object_type": 3,
                "rek_depositor_xsdmf_id": null,
                "rek_depositor": null,
                "rek_created_date_xsdmf_id": null,
                "rek_created_date": "2017-10-23T05:07:09Z",
                "rek_updated_date_xsdmf_id": null,
                "rek_updated_date": "2017-10-23T05:07:09Z",
                "rek_file_downloads": 0,
                "rek_citation": "<a class=\"citation_author_name\" title=\"Browse by Author Name for Bonning, Bryony C.\" href=\"\/list\/author\/Bonning%2C+Bryony+C.\/\">Bonning, Bryony C.<\/a> and <a class=\"author_id_link\" title=\"Browse by Author ID for Johnson, Karyn N.\" href=\"\/list\/author_id\/2999\/\">Johnson, Karyn N.<\/a> (<span class=\"citation_date\">2010<\/span>) <a class=\"citation_title\" title=\"Click to view Journal Article: Dicistroviruses\" href=\"\/view\/UQ:683770\">Dicistroviruses<\/a>. <i><span class=\"citation_journal_name\">Insect Virology<\/span><\/i>, <i><\/i>  <span class=\"citation_start_page\">201<\/span>-<span class=\"citation_end_page\">229<\/span>.",
                "rek_genre_xsdmf_id": null,
                "rek_genre": "Journal Article",
                "rek_genre_type_xsdmf_id": null,
                "rek_genre_type": "Article (original research)",
                "rek_formatted_title_xsdmf_id": null,
                "rek_formatted_title": null,
                "rek_formatted_abstract_xsdmf_id": null,
                "rek_formatted_abstract": null,
                "rek_depositor_affiliation_xsdmf_id": null,
                "rek_depositor_affiliation": null,
                "rek_thomson_citation_count": 2,
                "rek_thomson_citation_count_xsdmf_id": null,
                "rek_subtype_xsdmf_id": null,
                "rek_subtype": "Article (original research)",
                "rek_scopus_citation_count": null,
                "rek_herdc_notes_xsdmf_id": null,
                "rek_herdc_notes": null,
                "rek_scopus_doc_type_xsdmf_id": null,
                "rek_scopus_doc_type": null,
                "rek_wok_doc_type_xsdmf_id": null,
                "rek_wok_doc_type": "@",
                "rek_pubmed_doc_type_xsdmf_id": null,
                "rek_pubmed_doc_type": null,
                "rek_security_inherited": 1,
                "rek_altmetric_score": null,
                "rek_altmetric_score_xsdmf_id": null,
                "rek_altmetric_id": null,
                "rek_altmetric_id_xsdmf_id": null,
                "rek_copyright_xsdmf_id": null,
                "rek_copyright": null,
                "fez_record_search_key_access_conditions": null,
                "fez_record_search_key_acknowledgements": null,
                "fez_record_search_key_additional_notes": null,
                "fez_record_search_key_advisory_statement": null,
                "fez_record_search_key_alternate_genre": [],
                "fez_record_search_key_alternative_title": [],
                "fez_record_search_key_ands_collection_type": null,
                "fez_record_search_key_architectural_features": [],
                "fez_record_search_key_article_number": null,
                "fez_record_search_key_assigned_group_id": [],
                "fez_record_search_key_assigned_user_id": [],
                "fez_record_search_key_author": [{
                    "rek_author_id": 30354269,
                    "rek_author_pid": "UQ:683770",
                    "rek_author_xsdmf_id": null,
                    "rek_author": "Bonning, Bryony C.",
                    "rek_author_order": 1
                }, {
                    "rek_author_id": 30354270,
                    "rek_author_pid": "UQ:683770",
                    "rek_author_xsdmf_id": null,
                    "rek_author": "Johnson, Karyn N.",
                    "rek_author_order": 2
                }],
                "fez_record_search_key_author_affiliation_id": [],
                "fez_record_search_key_author_affiliation_country": [{
                    "rek_author_affiliation_country_id": 253241,
                    "rek_author_affiliation_country_pid": "UQ:683770",
                    "rek_author_affiliation_country_xsdmf_id": 0,
                    "rek_author_affiliation_country_order": 1,
                    "rek_author_affiliation_country": "USA"
                }, {
                    "rek_author_affiliation_country_id": 253242,
                    "rek_author_affiliation_country_pid": "UQ:683770",
                    "rek_author_affiliation_country_xsdmf_id": 0,
                    "rek_author_affiliation_country_order": 2,
                    "rek_author_affiliation_country": "Australia"
                }],
                "fez_record_search_key_author_affiliation_full_address": [{
                    "rek_author_affiliation_full_address_id": 285363,
                    "rek_author_affiliation_full_address_pid": "UQ:683770",
                    "rek_author_affiliation_full_address_xsdmf_id": 0,
                    "rek_author_affiliation_full_address_order": 1,
                    "rek_author_affiliation_full_address": "Iowa State Univ, Dept Entomol, Ames, IA 50011 USA"
                }, {
                    "rek_author_affiliation_full_address_id": 285364,
                    "rek_author_affiliation_full_address_pid": "UQ:683770",
                    "rek_author_affiliation_full_address_xsdmf_id": 0,
                    "rek_author_affiliation_full_address_order": 2,
                    "rek_author_affiliation_full_address": "Univ Queensland, Sch Biol Sci, St Lucia, Qld, Australia"
                }],
                "fez_record_search_key_author_affiliation_name": [{
                    "rek_author_affiliation_name_id": 256926,
                    "rek_author_affiliation_name_pid": "UQ:683770",
                    "rek_author_affiliation_name_xsdmf_id": 0,
                    "rek_author_affiliation_name_order": 1,
                    "rek_author_affiliation_name": "Iowa State University"
                }, {
                    "rek_author_affiliation_name_id": 256927,
                    "rek_author_affiliation_name_pid": "UQ:683770",
                    "rek_author_affiliation_name_xsdmf_id": 0,
                    "rek_author_affiliation_name_order": 2,
                    "rek_author_affiliation_name": "University of Queensland"
                }],
                "fez_record_search_key_author_id": [{
                    "rek_author_id_id": 29640131,
                    "rek_author_id_pid": "UQ:683770",
                    "rek_author_id_xsdmf_id": null,
                    "rek_author_id": 0,
                    "rek_author_id_order": 1
                }, {
                    "rek_author_id_id": 29640132,
                    "rek_author_id_pid": "UQ:683770",
                    "rek_author_id_xsdmf_id": null,
                    "rek_author_id": 2999,
                    "rek_author_id_order": 2
                }],
                "fez_record_search_key_author_role": [],
                "fez_record_search_key_book_title": null,
                "fez_record_search_key_building_materials": [],
                "fez_record_search_key_category": [],
                "fez_record_search_key_chapter_number": null,
                "fez_record_search_key_condition": [],
                "fez_record_search_key_conference_dates": null,
                "fez_record_search_key_conference_id": null,
                "fez_record_search_key_conference_location": null,
                "fez_record_search_key_conference_name": null,
                "fez_record_search_key_construction_date": null,
                "fez_record_search_key_contact_details_email": [],
                "fez_record_search_key_contributor": [],
                "fez_record_search_key_contributor_id": [],
                "fez_record_search_key_convener": null,
                "fez_record_search_key_corresponding_email": [{
                    "rek_corresponding_email_id": 36629,
                    "rek_corresponding_email_pid": "UQ:683770",
                    "rek_corresponding_email_xsdmf_id": 0,
                    "rek_corresponding_email_order": 1,
                    "rek_corresponding_email": "bbonning@iastate.edu"
                }, {
                    "rek_corresponding_email_id": 36630,
                    "rek_corresponding_email_pid": "UQ:683770",
                    "rek_corresponding_email_xsdmf_id": 0,
                    "rek_corresponding_email_order": 2,
                    "rek_corresponding_email": "karynj@uq.edu.au"
                }],
                "fez_record_search_key_corresponding_name": [{
                    "rek_corresponding_name_id": 35367,
                    "rek_corresponding_name_pid": "UQ:683770",
                    "rek_corresponding_name_xsdmf_id": 0,
                    "rek_corresponding_name_order": 1,
                    "rek_corresponding_name": "Bonning, Bryony C."
                }],
                "fez_record_search_key_corresponding_country": [{
                    "rek_corresponding_country_id": 124759,
                    "rek_corresponding_country_pid": "UQ:683770",
                    "rek_corresponding_country_xsdmf_id": 0,
                    "rek_corresponding_country_order": 1,
                    "rek_corresponding_country": "USA"
                }, {
                    "rek_corresponding_country_id": 124760,
                    "rek_corresponding_country_pid": "UQ:683770",
                    "rek_corresponding_country_xsdmf_id": 0,
                    "rek_corresponding_country_order": 2,
                    "rek_corresponding_country": "Australia"
                }],
                "fez_record_search_key_corresponding_organisation": [{
                    "rek_corresponding_organisation_id": 131468,
                    "rek_corresponding_organisation_pid": "UQ:683770",
                    "rek_corresponding_organisation_xsdmf_id": 0,
                    "rek_corresponding_organisation_order": 1,
                    "rek_corresponding_organisation": "Iowa State University"
                }, {
                    "rek_corresponding_organisation_id": 131469,
                    "rek_corresponding_organisation_pid": "UQ:683770",
                    "rek_corresponding_organisation_xsdmf_id": 0,
                    "rek_corresponding_organisation_order": 2,
                    "rek_corresponding_organisation": "University of Queensland"
                }],
                "fez_record_search_key_country_of_issue": null,
                "fez_record_search_key_coverage_period": [],
                "fez_record_search_key_creator_id": [],
                "fez_record_search_key_creator_name": [],
                "fez_record_search_key_datastream_policy": null,
                "fez_record_search_key_data_volume": null,
                "fez_record_search_key_date_available": {
                    "rek_date_available_id": 994160,
                    "rek_date_available_pid": "UQ:683770",
                    "rek_date_available_xsdmf_id": null,
                    "rek_date_available": "2010-01-01T00:00:00Z"
                },
                "fez_record_search_key_date_photo_taken": null,
                "fez_record_search_key_date_recorded": null,
                "fez_record_search_key_date_scanned": null,
                "fez_record_search_key_doi": null,
                "fez_record_search_key_edition": null,
                "fez_record_search_key_end_date": null,
                "fez_record_search_key_end_page": {
                    "rek_end_page_id": 5734641,
                    "rek_end_page_pid": "UQ:683770",
                    "rek_end_page_xsdmf_id": null,
                    "rek_end_page": "229"
                },
                "fez_record_search_key_fields_of_research": [],
                "fez_record_search_key_file_attachment_access_condition": [],
                "fez_record_search_key_file_attachment_embargo_date": [],
                "fez_record_search_key_file_attachment_name": [],
                "fez_record_search_key_geographic_area": [],
                "fez_record_search_key_grant_acronym": [],
                "fez_record_search_key_grant_agency": [],
                "fez_record_search_key_grant_agency_id": [],
                "fez_record_search_key_grant_id": [],
                "fez_record_search_key_grant_text": [],
                "fez_record_search_key_herdc_code": {
                    "rek_herdc_code_id": 4918715,
                    "rek_herdc_code_pid": "UQ:683770",
                    "rek_herdc_code_xsdmf_id": null,
                    "rek_herdc_code": 450009
                },
                "fez_record_search_key_herdc_status": {
                    "rek_herdc_status_id": 3783976,
                    "rek_herdc_status_pid": "UQ:683770",
                    "rek_herdc_status_xsdmf_id": null,
                    "rek_herdc_status": 453220
                },
                "fez_record_search_key_identifier": [],
                "fez_record_search_key_institutional_status": {
                    "rek_institutional_status_id": 3437384,
                    "rek_institutional_status_pid": "UQ:683770",
                    "rek_institutional_status_xsdmf_id": null,
                    "rek_institutional_status": 453223
                },
                "fez_record_search_key_interior_features": [],
                "fez_record_search_key_isbn": [{
                    "rek_isbn_id": 1113177,
                    "rek_isbn_pid": "UQ:683770",
                    "rek_isbn_xsdmf_id": null,
                    "rek_isbn": "978-1-904455-71-4",
                    "rek_isbn_order": 1
                }],
                "fez_record_search_key_isdatasetof": [],
                "fez_record_search_key_isderivationof": [],
                "fez_record_search_key_isi_loc": {
                    "rek_isi_loc_id": 4031803,
                    "rek_isi_loc_pid": "UQ:683770",
                    "rek_isi_loc_xsdmf_id": null,
                    "rek_isi_loc": "000283520500009"
                },
                "fez_record_search_key_ismemberof": [{
                    "rek_ismemberof_id": 12105580,
                    "rek_ismemberof_pid": "UQ:683770",
                    "rek_ismemberof_xsdmf_id": null,
                    "rek_ismemberof": "UQ:180159",
                    "rek_ismemberof_order": 1
                }],
                "fez_record_search_key_issn": [],
                "fez_record_search_key_issue_number": null,
                "fez_record_search_key_job_number": null,
                "fez_record_search_key_journal_name": {
                    "rek_journal_name_id": 5264915,
                    "rek_journal_name_pid": "UQ:683770",
                    "rek_journal_name_xsdmf_id": null,
                    "rek_journal_name": "Insect Virology"
                },
                "fez_record_search_key_keywords": [{
                    "rek_keywords_id": 30377095,
                    "rek_keywords_pid": "UQ:683770",
                    "rek_keywords_xsdmf_id": null,
                    "rek_keywords": "Entomology",
                    "rek_keywords_order": 1
                }, {
                    "rek_keywords_id": 30377096,
                    "rek_keywords_pid": "UQ:683770",
                    "rek_keywords_xsdmf_id": null,
                    "rek_keywords": "Entomology",
                    "rek_keywords_order": 2
                }],
                "fez_record_search_key_language": [{
                    "rek_language_id": 5523409,
                    "rek_language_pid": "UQ:683770",
                    "rek_language_xsdmf_id": null,
                    "rek_language": "eng",
                    "rek_language_order": 1
                }],
                "fez_record_search_key_language_of_book_title": [],
                "fez_record_search_key_language_of_journal_name": [],
                "fez_record_search_key_language_of_proceedings_title": [],
                "fez_record_search_key_language_of_title": [],
                "fez_record_search_key_length": null,
                "fez_record_search_key_license": null,
                "fez_record_search_key_link": [],
                "fez_record_search_key_link_description": [],
                "fez_record_search_key_location": [],
                "fez_record_search_key_native_script_book_title": null,
                "fez_record_search_key_native_script_conference_name": null,
                "fez_record_search_key_native_script_journal_name": null,
                "fez_record_search_key_native_script_proceedings_title": null,
                "fez_record_search_key_native_script_title": null,
                "fez_record_search_key_newspaper": null,
                "fez_record_search_key_notes": null,
                "fez_record_search_key_oa_embargo_days": null,
                "fez_record_search_key_oa_notes": null,
                "fez_record_search_key_oa_status": null,
                "fez_record_search_key_org_name": null,
                "fez_record_search_key_org_unit_name": null,
                "fez_record_search_key_original_format": null,
                "fez_record_search_key_parent_publication": null,
                "fez_record_search_key_patent_number": null,
                "fez_record_search_key_period": [],
                "fez_record_search_key_place_of_publication": null,
                "fez_record_search_key_proceedings_title": null,
                "fez_record_search_key_project_description": null,
                "fez_record_search_key_project_id": null,
                "fez_record_search_key_project_name": null,
                "fez_record_search_key_project_start_date": null,
                "fez_record_search_key_publisher": {
                    "rek_publisher_id": 4662453,
                    "rek_publisher_pid": "UQ:683770",
                    "rek_publisher_xsdmf_id": null,
                    "rek_publisher": "CAISTER ACADEMIC PRESS"
                },
                "fez_record_search_key_pubmed_id": null,
                "fez_record_search_key_refereed": {
                    "rek_refereed_id": 2735769,
                    "rek_refereed_pid": "UQ:683770",
                    "rek_refereed_xsdmf_id": null,
                    "rek_refereed": 1
                },
                "fez_record_search_key_refereed_source": {
                    "rek_refereed_source_id": 1456883,
                    "rek_refereed_source_pid": "UQ:683770",
                    "rek_refereed_source_xsdmf_id": null,
                    "rek_refereed_source": null
                },
                "fez_record_search_key_related_datasets": null,
                "fez_record_search_key_related_publications": null,
                "fez_record_search_key_report_number": null,
                "fez_record_search_key_retracted": null,
                "fez_record_search_key_rights": null,
                "fez_record_search_key_roman_script_book_title": null,
                "fez_record_search_key_roman_script_conference_name": null,
                "fez_record_search_key_roman_script_journal_name": null,
                "fez_record_search_key_roman_script_proceedings_title": null,
                "fez_record_search_key_roman_script_title": null,
                "fez_record_search_key_scale": null,
                "fez_record_search_key_scopus_id": null,
                "fez_record_search_key_section": null,
                "fez_record_search_key_seo_code": [],
                "fez_record_search_key_series": null,
                "fez_record_search_key_software_required": [],
                "fez_record_search_key_source": null,
                "fez_record_search_key_start_date": null,
                "fez_record_search_key_start_page": {
                    "rek_start_page_id": 5807417,
                    "rek_start_page_pid": "UQ:683770",
                    "rek_start_page_xsdmf_id": null,
                    "rek_start_page": "201"
                },
                "fez_record_search_key_structural_systems": [],
                "fez_record_search_key_style": [],
                "fez_record_search_key_subcategory": [],
                "fez_record_search_key_subject": [],
                "fez_record_search_key_supervisor": [],
                "fez_record_search_key_supervisor_id": [],
                "fez_record_search_key_surrounding_features": [],
                "fez_record_search_key_time_period_end_date": null,
                "fez_record_search_key_time_period_start_date": null,
                "fez_record_search_key_total_chapters": null,
                "fez_record_search_key_total_pages": {
                    "rek_total_pages_id": 5774615,
                    "rek_total_pages_pid": "UQ:683770",
                    "rek_total_pages_xsdmf_id": null,
                    "rek_total_pages": "29"
                },
                "fez_record_search_key_transcript": null,
                "fez_record_search_key_translated_book_title": null,
                "fez_record_search_key_translated_conference_name": null,
                "fez_record_search_key_translated_journal_name": null,
                "fez_record_search_key_translated_newspaper": null,
                "fez_record_search_key_translated_proceedings_title": null,
                "fez_record_search_key_translated_title": null,
                "fez_record_search_key_type_of_data": [],
                "fez_record_search_key_volume_number": null
            }];
        const scopusList = [
            {
                "currentSource": "scopus",
                "sources": [{source: "scopus", id: "111"}],
                "fez_record_search_key_ismemberof": [{"rek_ismemberof": "UQ:308300", "rek_ismemberof_order": 1}],
                "rek_object_type": 3,
                "rek_status": 2,
                "fez_record_search_key_publisher": {"rek_publisher": "BioMed Central Ltd."},
                "fez_record_search_key_subject": [{
                    "rek_subject": 453397,
                    "rek_subject_order": 1
                }, {"rek_subject": 453444, "rek_subject_order": 2}],
                "fez_record_search_key_author_affiliation_name": [{
                    "rek_author_affiliation_name": "Department of Plant Sciences,University of Cambridge",
                    "rek_author_affiliation_name_order": 1
                }, {
                    "rek_author_affiliation_name": "International Livestock Research Institute",
                    "rek_author_affiliation_name_order": 2
                }, {
                    "rek_author_affiliation_name": "Department of Plant Sciences,University of Cambridge",
                    "rek_author_affiliation_name_order": 3
                }, {
                    "rek_author_affiliation_name": "Biosciences Eastern and Central Africa-International Livestock Research Institute (BecA-ILRI) Hub",
                    "rek_author_affiliation_name_order": 4
                }, {
                    "rek_author_affiliation_name": "Biosciences Eastern and Central Africa-International Livestock Research Institute (BecA-ILRI) Hub",
                    "rek_author_affiliation_name_order": 5
                }, {
                    "rek_author_affiliation_name": "Biosciences Eastern and Central Africa-International Livestock Research Institute (BecA-ILRI) Hub",
                    "rek_author_affiliation_name_order": 6
                }, {
                    "rek_author_affiliation_name": "Biosciences Eastern and Central Africa-International Livestock Research Institute (BecA-ILRI) Hub",
                    "rek_author_affiliation_name_order": 7
                }, {
                    "rek_author_affiliation_name": "Department of Plant Sciences,University of Cambridge",
                    "rek_author_affiliation_name_order": 8
                }],
                "fez_record_search_key_author_affiliation_full_address": [{
                    "rek_author_affiliation_full_address": "Cambridge",
                    "rek_author_affiliation_full_address_order": 1
                }, {
                    "rek_author_affiliation_full_address": "30709 Naivasha Road,Nairobi",
                    "rek_author_affiliation_full_address_order": 2
                }, {
                    "rek_author_affiliation_full_address": "Cambridge",
                    "rek_author_affiliation_full_address_order": 3
                }, {
                    "rek_author_affiliation_full_address": "Nairobi",
                    "rek_author_affiliation_full_address_order": 4
                }, {
                    "rek_author_affiliation_full_address": "Nairobi",
                    "rek_author_affiliation_full_address_order": 5
                }, {
                    "rek_author_affiliation_full_address": "Nairobi",
                    "rek_author_affiliation_full_address_order": 6
                }, {
                    "rek_author_affiliation_full_address": "Nairobi",
                    "rek_author_affiliation_full_address_order": 7
                }, {
                    "rek_author_affiliation_full_address": "Cambridge",
                    "rek_author_affiliation_full_address_order": 8
                }],
                "fez_record_search_key_author_affiliation_country": [{
                    "rek_author_affiliation_country": "gbr",
                    "rek_author_affiliation_country_order": 1
                }, {
                    "rek_author_affiliation_country": "ken",
                    "rek_author_affiliation_country_order": 2
                }, {
                    "rek_author_affiliation_country": "gbr",
                    "rek_author_affiliation_country_order": 3
                }, {
                    "rek_author_affiliation_country": "ken",
                    "rek_author_affiliation_country_order": 4
                }, {
                    "rek_author_affiliation_country": "ken",
                    "rek_author_affiliation_country_order": 5
                }, {
                    "rek_author_affiliation_country": "ken",
                    "rek_author_affiliation_country_order": 6
                }, {
                    "rek_author_affiliation_country": "ken",
                    "rek_author_affiliation_country_order": 7
                }, {"rek_author_affiliation_country": "gbr", "rek_author_affiliation_country_order": 8}],
                "rek_scopus_citation_count": "0",
                "fez_record_search_key_corresponding_name": [{
                    "rek_corresponding_name": "Carr J.P.",
                    "rek_corresponding_name_order": 1
                }],
                "fez_record_search_key_corresponding_email": [{
                    "rek_corresponding_email": "jpc1005@hermes.cam.ac.uk",
                    "rek_corresponding_email_order": 1
                }],
                "fez_record_search_key_corresponding_organization": [{
                    "rek_corresponding_organization": "Department of Plant Sciences,University of Cambridge",
                    "rek_corresponding_organization_order": 1
                }],
                "fez_record_search_key_corresponding_country": [{
                    "rek_corresponding_country": "gbr",
                    "rek_corresponding_country_order": 1
                }],
                "rek_description": "Background: Aphids are major vectors of plant viruses. Common bean (Phaseolus vulgaris L.) and maize (Zea mays L.) are important crops that are vulnerable to aphid herbivory and aphid-transmitted viruses. In East and Central Africa, common bean is frequently intercropped by smallholder farmers to provide fixed nitrogen for cultivation of starch crops such as maize. We used a PCR-based technique to identify aphids prevalent in smallholder bean farms and next generation sequencing shotgun metagenomics to examine the diversity of viruses present in aphids and in maize leaf samples. Samples were collected from farms in Kenya in a range of agro-ecological zones. Results: Cytochrome oxidase 1 (CO1) gene sequencing showed that Aphis fabae was the sole aphid species present in bean plots in the farms visited. Sequencing of total RNA from aphids using the Illumina platform detected three dicistroviruses. Maize leaf RNA was also analysed. Identification of Aphid lethal paralysis virus (ALPV), Rhopalosiphum padi virus (RhPV), and a novel Big Sioux River virus (BSRV)-like dicistrovirus in aphid and maize samples was confirmed using reverse transcription-polymerase chain reactions and sequencing of amplified DNA products. Phylogenetic, nucleotide and protein sequence analyses of eight ALPV genomes revealed evidence of intra-species recombination, with the data suggesting there may be two ALPV lineages. Analysis of BSRV-like virus genomic RNA sequences revealed features that are consistent with other dicistroviruses and that it is phylogenetically closely related to dicistroviruses of the genus Cripavirus. Conclusions: The discovery of ALPV and RhPV in aphids and maize further demonstrates the broad occurrence of these dicistroviruses. Dicistroviruses are remarkable in that they use plants as reservoirs that facilitate infection of their insect replicative hosts, such as aphids. This is the first report of these viruses being isolated from either organism. The BSRV-like sequences represent a potentially novel dicistrovirus infecting A. fabae.",
                "fez_record_search_key_keywords": [{
                    "rek_keywords": "Aphid",
                    "rek_keywords_order": 1
                }, {"rek_keywords": "Dicistrovirus", "rek_keywords_order": 2}, {
                    "rek_keywords": "Epidemiology",
                    "rek_keywords_order": 3
                }, {"rek_keywords": "Metagenomics", "rek_keywords_order": 4}, {
                    "rek_keywords": "Phylogenetics",
                    "rek_keywords_order": 5
                }, {"rek_keywords": "Potyvirus", "rek_keywords_order": 6}, {
                    "rek_keywords": "Recombination",
                    "rek_keywords_order": 7
                }, {"rek_keywords": "Vector", "rek_keywords_order": 8}],
                "rek_title": "Viral metagenomics of aphids present in bean and maize plots on mixed-use farms in Kenya reveals the presence of three dicistroviruses including a novel Big Sioux River virus-like dicistrovirus",
                "fez_record_search_key_doi": {"rek_doi": "10.1186\/s12985-017-0854-x"},
                "fez_record_search_key_issn": [{"rek_issn": "1743-422X", "rek_issn_order": 1}],
                "fez_record_search_key_issue_number": {"rek_issue_number": "1"},
                "rek_date": "2017-10-02T00:00:00Z",
                "fez_record_search_key_volume_number": {"rek_volume_number": "14"},
                "fez_record_search_key_embase_id": {"rek_embase_id": "618612189"},
                "fez_record_search_key_scopus_id": {"rek_scopus_id": "2-s2.0-85030864188"},
                "fez_record_search_key_language": [{"rek_language": "eng", "rek_language_order": 1}],
                "fez_record_search_key_article_number": {"rek_article_number": "188"},
                "fez_record_search_key_institutional_status": {"rek_institutional_status": "453224"},
                "rek_scopus_doc_type": "ar",
                "rek_display_type": 179,
                "rek_genre": "Journal Article",
                "rek_genre_type": "Article (original research)",
                "rek_subtype": "Article (original research)",
                "fez_record_search_key_journal_name": {"rek_journal_name": "Virology Journal"},
                "fez_record_search_key_author": {
                    "0": {"rek_author": "Wamonje, Francis O.", "rek_author_order": 1},
                    "2": {"rek_author": "Braidwood, Luke A.", "rek_author_order": 3},
                    "7": {"rek_author": "Carr, John P.", "rek_author_order": 8},
                    "1": {"rek_author": "Michuki, George N.", "rek_author_order": 2},
                    "3": {"rek_author": "Njuguna, Joyce N.", "rek_author_order": 4},
                    "4": {"rek_author": "Musembi Mutuku, J.", "rek_author_order": 5},
                    "5": {"rek_author": "Djikeng, Appolinaire", "rek_author_order": 6},
                    "6": {"rek_author": "Harvey, Jagger J. W.", "rek_author_order": 7}
                },
                "fez_record_search_key_author_id": {
                    "0": {
                        "rek_author_id": 0,
                        "rek_author_id_order": 1,
                        "fez_author": {
                            "aut_id": 0,
                            "aut_scopus_id": 45561823600,
                            "aut_display_name": "Wamonje F.O.",
                            "aut_fname": "Francis O.",
                            "aut_lname": "Wamonje",
                            "aut_email": ""
                        }
                    },
                    "2": {
                        "rek_author_id": 0,
                        "rek_author_id_order": 3,
                        "fez_author": {
                            "aut_id": 0,
                            "aut_scopus_id": 57021629100,
                            "aut_display_name": "Braidwood L.A.",
                            "aut_fname": "Luke A.",
                            "aut_lname": "Braidwood",
                            "aut_email": ""
                        }
                    },
                    "7": {
                        "rek_author_id": 0,
                        "rek_author_id_order": 8,
                        "fez_author": {
                            "aut_id": 0,
                            "aut_scopus_id": 24735192400,
                            "aut_display_name": "Carr J.P.",
                            "aut_fname": "John P.",
                            "aut_lname": "Carr",
                            "aut_email": "jpc1005@hermes.cam.ac.uk"
                        }
                    },
                    "1": {
                        "rek_author_id": 0,
                        "rek_author_id_order": 2,
                        "fez_author": {
                            "aut_id": 0,
                            "aut_scopus_id": 55363283300,
                            "aut_display_name": "Michuki G.N.",
                            "aut_fname": "George N.",
                            "aut_lname": "Michuki",
                            "aut_email": ""
                        }
                    },
                    "3": {
                        "rek_author_id": 0,
                        "rek_author_id_order": 4,
                        "fez_author": {
                            "aut_id": 0,
                            "aut_scopus_id": 56798002400,
                            "aut_display_name": "Njuguna J.N.",
                            "aut_fname": "Joyce N.",
                            "aut_lname": "Njuguna",
                            "aut_email": ""
                        }
                    },
                    "4": {
                        "rek_author_id": 0,
                        "rek_author_id_order": 5,
                        "fez_author": {
                            "aut_id": 0,
                            "aut_scopus_id": 57196004095,
                            "aut_display_name": "Musembi Mutuku J.",
                            "aut_fname": "J.",
                            "aut_lname": "Musembi Mutuku",
                            "aut_email": ""
                        }
                    },
                    "5": {
                        "rek_author_id": 0,
                        "rek_author_id_order": 6,
                        "fez_author": {
                            "aut_id": 0,
                            "aut_scopus_id": 6603493573,
                            "aut_display_name": "Djikeng A.",
                            "aut_fname": "Appolinaire",
                            "aut_lname": "Djikeng",
                            "aut_email": ""
                        }
                    },
                    "6": {
                        "rek_author_id": 0,
                        "rek_author_id_order": 7,
                        "fez_author": {
                            "aut_id": 0,
                            "aut_scopus_id": 25922174700,
                            "aut_display_name": "Harvey J.J.W.",
                            "aut_fname": "Jagger J. W.",
                            "aut_lname": "Harvey",
                            "aut_email": ""
                        }
                    }
                }
            },
            {
                "currentSource": "scopus",
                "sources": [{source: "scopus", id: "111"}],
                "fez_record_search_key_ismemberof": [{"rek_ismemberof": "UQ:308300", "rek_ismemberof_order": 1}],
                "rek_object_type": 3,
                "rek_status": 2,
                "fez_record_search_key_publisher": {"rek_publisher": "Elsevier Inc."},
                "fez_record_search_key_subject": [{
                    "rek_subject": 453248,
                    "rek_subject_order": 1
                }, {"rek_subject": 453237, "rek_subject_order": 2}],
                "fez_record_search_key_author_affiliation_name": [{
                    "rek_author_affiliation_name": "University of Prince Edward Island",
                    "rek_author_affiliation_name_order": 1
                }],
                "fez_record_search_key_author_affiliation_full_address": [{
                    "rek_author_affiliation_full_address": "Charlottetown,PE",
                    "rek_author_affiliation_full_address_order": 1
                }],
                "fez_record_search_key_author_affiliation_country": [{
                    "rek_author_affiliation_country": "can",
                    "rek_author_affiliation_country_order": 1
                }],
                "rek_scopus_citation_count": "0",
                "fez_record_search_key_corresponding_name": [{
                    "rek_corresponding_name": "Kibenge F.S.B.",
                    "rek_corresponding_name_order": 1
                }],
                "fez_record_search_key_corresponding_organization": [{
                    "rek_corresponding_organization": "University of Prince Edward Island",
                    "rek_corresponding_organization_order": 1
                }],
                "fez_record_search_key_corresponding_country": [{
                    "rek_corresponding_country": "can",
                    "rek_corresponding_country_order": 1
                }],
                "rek_description": "The family Dicistroviridae contains viruses of insects and crustaceans and is divided into two genera, Cripavirus and Aparavirus. The abbreviation Dicistro is derived from the two open reading frames (ORFs), or cistrons, encoded in the positive-sense, single-stranded RNA genome, whereby each ORF is translated from an independent internal ribosome entry site (IRES). The family belongs to the order Picornavirales, but differs from Picornaviridae in having the structural proteins at the 3'-end of the genome rather than at the 5' end, and by the presence of the intergenic region, which serves as the IRES for ORF2. Taura syndrome virus (TSV), which infects many species of shrimp, prawn, and crab, is in the genus Aparavirus, although data suggest that it may belong to a novel genus of the family Dicistroviridae. Recently, a new virus, Scylla bicistronic virus-l (mud crab Dicistrovirus-l, MCDV-l), was isolated from diseased farmed Portunidae hole crab. This topic was addressed in the review article by Don V. Lightner, R.M. Redman, Carlos R. Pantoja, Kathy F.J. Tang, Brenda L. Noble, Paul Schofield, L.L. Mohney, Linda M. Nunan and S.A Navarro S. A., \"Historic emergence, impact and current status of shrimp pathogens in the Americas\" from Journal of Invertebrate Pathology (2012), which describes the status of shrimp viruses in the Americas to foster understanding of the historic importance and capacity of TSV to cause disease and the methods used for its detection.",
                "fez_record_search_key_keywords": [{
                    "rek_keywords": "Crustacean viruses",
                    "rek_keywords_order": 1
                }, {
                    "rek_keywords": "Dicistroviridae",
                    "rek_keywords_order": 2
                }, {"rek_keywords": "Taura syndrome virus (TSV)", "rek_keywords_order": 3}],
                "rek_title": "Dicistroviruses of Crustaceans",
                "fez_record_search_key_doi": {"rek_doi": "10.1016\/B978-0-12-801573-5.00033-4"},
                "fez_record_search_key_isbn": [{"rek_isbn": "9780128017548", "rek_isbn_order": 1}],
                "rek_date": "2016-07-14T00:00:00Z",
                "fez_record_search_key_embase_id": {"rek_embase_id": "616868236"},
                "fez_record_search_key_scopus_id": {"rek_scopus_id": "2-s2.0-85020491241"},
                "fez_record_search_key_language": [{"rek_language": "eng", "rek_language_order": 1}],
                "fez_record_search_key_institutional_status": {"rek_institutional_status": "453224"},
                "rek_scopus_doc_type": "ch",
                "rek_display_type": 177,
                "rek_genre": "Book Chapter",
                "rek_genre_type": "Research book chapter (original research)",
                "rek_subtype": "Research book chapter (original research)",
                "fez_record_search_key_series": {"rek_series": "Aquaculture Virology"},
                "fez_record_search_key_journal_name": {"rek_journal_name": "Aquaculture Virology"},
                "fez_record_search_key_author": [{"rek_author": "Kibenge, F. S.B.", "rek_author_order": 1}],
                "fez_record_search_key_author_id": [{
                    "rek_author_id": 0,
                    "rek_author_id_order": 1,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 56867463300,
                        "aut_display_name": "Kibenge F.S.B.",
                        "aut_fname": "F. S.B.",
                        "aut_lname": "Kibenge",
                        "aut_email": ""
                    }
                }]
            },
            {
                "currentSource": "scopus",
                "sources": [{source: "scopus", id: "111"}],
                "fez_record_search_key_ismemberof": [{"rek_ismemberof": "UQ:308300", "rek_ismemberof_order": 1}],
                "rek_object_type": 3,
                "rek_status": 2,
                "fez_record_search_key_publisher": {"rek_publisher": "Microbiology Society"},
                "fez_record_search_key_subject": [{"rek_subject": 453397, "rek_subject_order": 1}],
                "fez_record_search_key_author_affiliation_name": [{
                    "rek_author_affiliation_name": "Instituto Biofisika (CSIC,UPV\/EHU)",
                    "rek_author_affiliation_name_order": 1
                }, {
                    "rek_author_affiliation_name": "Instituto Biofisika (CSIC,UPV\/EHU)",
                    "rek_author_affiliation_name_order": 2
                }, {
                    "rek_author_affiliation_name": "Instituto Biofisika (CSIC,UPV\/EHU)",
                    "rek_author_affiliation_name_order": 3
                }, {
                    "rek_author_affiliation_name": "Centro de Estudios Parasitol\u00f3gicos y de Vectores (CEPAVE-CCT-La Plata-CONICET-UNLP)",
                    "rek_author_affiliation_name_order": 4
                }, {
                    "rek_author_affiliation_name": "Instituto Biofisika (CSIC,UPV\/EHU)",
                    "rek_author_affiliation_name_order": 5
                }],
                "fez_record_search_key_author_affiliation_full_address": [{
                    "rek_author_affiliation_full_address": "Barrio Sarriena S\/N,Leioa,Bizkaia",
                    "rek_author_affiliation_full_address_order": 1
                }, {
                    "rek_author_affiliation_full_address": "Barrio Sarriena S\/N,Leioa,Bizkaia",
                    "rek_author_affiliation_full_address_order": 2
                }, {
                    "rek_author_affiliation_full_address": "Barrio Sarriena S\/N,Leioa,Bizkaia",
                    "rek_author_affiliation_full_address_order": 3
                }, {
                    "rek_author_affiliation_full_address": "Boulevard 120 e\/61 y 62,La Plata",
                    "rek_author_affiliation_full_address_order": 4
                }, {
                    "rek_author_affiliation_full_address": "Barrio Sarriena S\/N,Leioa,Bizkaia",
                    "rek_author_affiliation_full_address_order": 5
                }],
                "fez_record_search_key_author_affiliation_country": [{
                    "rek_author_affiliation_country": "esp",
                    "rek_author_affiliation_country_order": 1
                }, {
                    "rek_author_affiliation_country": "esp",
                    "rek_author_affiliation_country_order": 2
                }, {
                    "rek_author_affiliation_country": "esp",
                    "rek_author_affiliation_country_order": 3
                }, {
                    "rek_author_affiliation_country": "arg",
                    "rek_author_affiliation_country_order": 4
                }, {"rek_author_affiliation_country": "esp", "rek_author_affiliation_country_order": 5}],
                "rek_scopus_citation_count": "0",
                "fez_record_search_key_corresponding_name": [{
                    "rek_corresponding_name": "Guerin D.M.A.",
                    "rek_corresponding_name_order": 1
                }],
                "fez_record_search_key_corresponding_email": [{
                    "rek_corresponding_email": "diego.guerin@gmail.com",
                    "rek_corresponding_email_order": 1
                }],
                "fez_record_search_key_corresponding_organization": [{
                    "rek_corresponding_organization": "Instituto Biofisika (CSIC,UPV\/EHU)",
                    "rek_corresponding_organization_order": 1
                }],
                "fez_record_search_key_corresponding_country": [{
                    "rek_corresponding_country": "esp",
                    "rek_corresponding_country_order": 1
                }],
                "rek_description": "In viruses, uncoating and RNA release are two key steps of successfully infecting a target cell. During these steps, the capsid must undergo the necessary conformational changes to allow RNA egress. Despite their importance, these processes are poorly understood in the family Dicistroviridae. Here, we used X-ray crystallography to solve the atomic structure of a Triatoma virus(TrV) empty particle (Protein Data Bank ID 5L7O), which is the resulting capsid after RNA release. It is observed that the overall shape of the capsid and of the three individual proteins is maintained in comparison with the mature virion. Furthermore, no channels indicative of RNA release are formed in the TrV empty particle. However, the most prominent change in the empty particle when compared with the mature virion is the loss of order in the N-terminal domain of the VP2 protein. In mature virions, the VP2 N-terminal domain of one pentamer is swapped with its twofold related copy in an adjacent pentamer, thereby stabilizing the binding between the pentamers. The loss of these interactions allows us to propose that RNA release may take place through transient flipping-out of pentameric subunits. The lower number of stabilizing interactions between the pentamers and the lack of formation of new holes support this model. This model differs from the currently accepted model for rhinoviruses and enteroviruses, in which genome externalization occurs by extrusion of the RNA through capsid channels.",
                "fez_record_search_key_keywords": [{
                    "rek_keywords": "Capsid disassembly",
                    "rek_keywords_order": 1
                }, {"rek_keywords": "Dicistroviridae", "rek_keywords_order": 2}, {
                    "rek_keywords": "RNA release",
                    "rek_keywords_order": 3
                }, {"rek_keywords": "Triatoma virus", "rek_keywords_order": 4}, {
                    "rek_keywords": "Uncoating",
                    "rek_keywords_order": 5
                }],
                "rek_title": "X-ray structure of Triatoma virus empty capsid: Insights into the mechanism of uncoating and RNA release in dicistroviruses",
                "fez_record_search_key_doi": {"rek_doi": "10.1099\/jgv.0.000580"},
                "fez_record_search_key_issn": [{"rek_issn": "1465-2099", "rek_issn_order": 1}, {
                    "rek_issn": "0022-1317",
                    "rek_issn_order": 2
                }],
                "fez_record_search_key_pubmed": {"rek_pubmed": "27519423"},
                "fez_record_search_key_issue_number": {"rek_issue_number": "10"},
                "rek_date": "2016-10-01T00:00:00Z",
                "fez_record_search_key_volume_number": {"rek_volume_number": "97"},
                "fez_record_search_key_start_page": {"rek_start_page": "2769"},
                "fez_record_search_key_end_page": {"rek_end_page": "2779"},
                "fez_record_search_key_total_pages": {"rek_total_pages": "11"},
                "fez_record_search_key_embase_id": {"rek_embase_id": "612827095"},
                "fez_record_search_key_scopus_id": {"rek_scopus_id": "2-s2.0-84991737284"},
                "fez_record_search_key_language": [{"rek_language": "eng", "rek_language_order": 1}],
                "fez_record_search_key_article_number": {"rek_article_number": "000580"},
                "fez_record_search_key_institutional_status": {"rek_institutional_status": "453224"},
                "rek_scopus_doc_type": "ar",
                "rek_display_type": 179,
                "rek_genre": "Journal Article",
                "rek_genre_type": "Article (original research)",
                "rek_subtype": "Article (original research)",
                "fez_record_search_key_journal_name": {"rek_journal_name": "Journal of General Virology"},
                "fez_record_search_key_author": {
                    "0": {
                        "rek_author": "S\u00e1nchez-Eugenia, Rub\u00e9n",
                        "rek_author_order": 1
                    },
                    "1": {"rek_author": "Durana, Aritz", "rek_author_order": 2},
                    "2": {"rek_author": "L\u00f3pez-Marijuan, Ibai", "rek_author_order": 3},
                    "4": {"rek_author": "Gu\u00e9rin, Diego M. A.", "rek_author_order": 5},
                    "3": {"rek_author": "Marti, Gerardo A.", "rek_author_order": 4}
                }
            },
            {
                "currentSource": "scopus",
                "sources": [{source: "scopus", id: "111"}],
                "fez_record_search_key_ismemberof": [{"rek_ismemberof": "UQ:308300", "rek_ismemberof_order": 1}],
                "rek_object_type": 3,
                "rek_status": 2,
                "fez_record_search_key_publisher": {"rek_publisher": "American Society for Microbiology"},
                "fez_record_search_key_subject": [{
                    "rek_subject": 453394,
                    "rek_subject_order": 1
                }, {"rek_subject": 453397, "rek_subject_order": 2}],
                "fez_record_search_key_author_affiliation_name": [{
                    "rek_author_affiliation_name": "Department of Biochemistry and Molecular Biology,University of British Columbia",
                    "rek_author_affiliation_name_order": 1
                }, {
                    "rek_author_affiliation_name": "Department of Biochemistry and Molecular Biology,University of British Columbia",
                    "rek_author_affiliation_name_order": 2
                }],
                "fez_record_search_key_author_affiliation_full_address": [{
                    "rek_author_affiliation_full_address": "Vancouver,BC",
                    "rek_author_affiliation_full_address_order": 1
                }, {
                    "rek_author_affiliation_full_address": "Vancouver,BC",
                    "rek_author_affiliation_full_address_order": 2
                }],
                "fez_record_search_key_author_affiliation_country": [{
                    "rek_author_affiliation_country": "can",
                    "rek_author_affiliation_country_order": 1
                }, {"rek_author_affiliation_country": "can", "rek_author_affiliation_country_order": 2}],
                "rek_scopus_citation_count": "2",
                "fez_record_search_key_corresponding_name": [{
                    "rek_corresponding_name": "Jan E.",
                    "rek_corresponding_name_order": 1
                }],
                "fez_record_search_key_corresponding_email": [{
                    "rek_corresponding_email": "ej@mail.ubc.ca",
                    "rek_corresponding_email_order": 1
                }],
                "fez_record_search_key_corresponding_organization": [{
                    "rek_corresponding_organization": "Department of Biochemistry and Molecular Biology,University of British Columbia",
                    "rek_corresponding_organization_order": 1
                }],
                "fez_record_search_key_corresponding_country": [{
                    "rek_corresponding_country": "can",
                    "rek_corresponding_country_order": 1
                }],
                "rek_description": "To replicate, all viruses depend entirely on the enslavement of host cell ribosomes for their own advantage. To this end, viruses have evolved a multitude of translational strategies to usurp the ribosome. RNA-based structures known as internal ribosome entry sites (IRESs) are among the most notable mechanisms employed by viruses to seize host ribosomes. In this article, we spotlight the intergenic region IRES from the Dicistroviridae family of viruses and its importance as a model for IRES-dependent translation and in understanding fundamental properties of translation.",
                "fez_record_search_key_grant_agency": [{
                    "rek_grant_agency": "Natural Sciences and Engineering Research Council of Canada",
                    "rek_grant_agency_order": 1
                }],
                "fez_record_search_key_grant_acronym": [{"rek_grant_acronym": "NSERC", "rek_grant_acronym_order": 1}],
                "fez_record_search_key_grant_text": [{
                    "rek_grant_text": "This work, including the efforts of Craig H. Kerr, was funded by Gouvernement du Canada | Natural Sciences and Engineering Research Council of Canada (NSERC). This work, including the efforts of Eric Jan, was funded by Gouvernement du Canada | Canadian Institutes of Health Research (CIHR) (MOP-81244).",
                    "rek_grant_text_order": 1
                }],
                "rek_title": "Commandeering the ribosome: Lessons learned from dicistroviruses about translation",
                "fez_record_search_key_doi": {"rek_doi": "10.1128\/JVI.00737-15"},
                "fez_record_search_key_issn": [{"rek_issn": "1098-5514", "rek_issn_order": 1}, {
                    "rek_issn": "0022-538X",
                    "rek_issn_order": 2
                }],
                "fez_record_search_key_pubmed": {"rek_pubmed": "27053555"},
                "fez_record_search_key_issue_number": {"rek_issue_number": "12"},
                "rek_date": "2016-06-01T00:00:00Z",
                "fez_record_search_key_volume_number": {"rek_volume_number": "90"},
                "fez_record_search_key_start_page": {"rek_start_page": "5538"},
                "fez_record_search_key_end_page": {"rek_end_page": "5540"},
                "fez_record_search_key_total_pages": {"rek_total_pages": "3"},
                "fez_record_search_key_embase_id": {"rek_embase_id": "610588605"},
                "fez_record_search_key_scopus_id": {"rek_scopus_id": "2-s2.0-84971467438"},
                "fez_record_search_key_language": [{"rek_language": "eng", "rek_language_order": 1}],
                "fez_record_search_key_institutional_status": {"rek_institutional_status": "453224"},
                "rek_scopus_doc_type": "ar",
                "rek_display_type": 179,
                "rek_genre": "Journal Article",
                "rek_genre_type": "Article (original research)",
                "rek_subtype": "Article (original research)",
                "fez_record_search_key_journal_name": {"rek_journal_name": "Journal of Virology"},
                "fez_record_search_key_author": [{
                    "rek_author": "Kerr, Craig H.",
                    "rek_author_order": 1
                }, {"rek_author": "Jan, Eric", "rek_author_order": 2}],
                "fez_record_search_key_author_id": [{
                    "rek_author_id": 0,
                    "rek_author_id_order": 1,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 56651803100,
                        "aut_display_name": "Kerr C.H.",
                        "aut_fname": "Craig H.",
                        "aut_lname": "Kerr",
                        "aut_email": ""
                    }
                }, {
                    "rek_author_id": 0,
                    "rek_author_id_order": 2,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 6603942994,
                        "aut_display_name": "Jan E.",
                        "aut_fname": "Eric",
                        "aut_lname": "Jan",
                        "aut_email": "ej@mail.ubc.ca"
                    }
                }]
            },
            {
                "currentSource": "scopus",
                "sources": [{source: "scopus", id: "111"}],
                "fez_record_search_key_ismemberof": [{"rek_ismemberof": "UQ:308300", "rek_ismemberof_order": 1}],
                "rek_object_type": 3,
                "rek_status": 2,
                "fez_record_search_key_subject": [{
                    "rek_subject": 453267,
                    "rek_subject_order": 1
                }, {"rek_subject": 453271, "rek_subject_order": 2}],
                "fez_record_search_key_author_affiliation_name": [{
                    "rek_author_affiliation_name": "Department of Entomology,Iowa State University",
                    "rek_author_affiliation_name_order": 1
                }, {
                    "rek_author_affiliation_name": "Department of Plant Pathology and Biochemistry, Biophysics, and Molecular Biology,Iowa State University",
                    "rek_author_affiliation_name_order": 2
                }],
                "fez_record_search_key_author_affiliation_full_address": [{
                    "rek_author_affiliation_full_address": "Ames, IA 50011",
                    "rek_author_affiliation_full_address_order": 1
                }, {
                    "rek_author_affiliation_full_address": "Ames, IA 50011",
                    "rek_author_affiliation_full_address_order": 2
                }],
                "fez_record_search_key_author_affiliation_country": [{
                    "rek_author_affiliation_country": "usa",
                    "rek_author_affiliation_country_order": 1
                }, {"rek_author_affiliation_country": "usa", "rek_author_affiliation_country_order": 2}],
                "rek_scopus_citation_count": "75",
                "fez_record_search_key_corresponding_name": [{
                    "rek_corresponding_name": "Bonning B. C.",
                    "rek_corresponding_name_order": 1
                }],
                "fez_record_search_key_corresponding_email": [{
                    "rek_corresponding_email": "bbonning@iastate.edu",
                    "rek_corresponding_email_order": 1
                }],
                "fez_record_search_key_corresponding_organization": [{
                    "rek_corresponding_organization": "Department of Entomology,Iowa State University",
                    "rek_corresponding_organization_order": 1
                }],
                "fez_record_search_key_corresponding_country": [{
                    "rek_corresponding_country": "usa",
                    "rek_corresponding_country_order": 1
                }],
                "rek_description": "Dicistroviruses are members of a recently defined and rapidly growing family of picornavirus-like RNA viruses called the Dicistroviridae. Dicistroviruses are pathogenic to beneficial arthropods such as honey bees and shrimp and to insect pests of medical and agricultural importance. Our understanding of these viruses is uneven. We present highly advanced studies of the virus particle structure, remarkable mechanisms of internal ribosome entry in translation of viral RNA, and the use of dicistroviruses to study the insect immune system. However, little is known about dicistrovirus RNA replication mechanisms or gene function, except by comparison with picornaviruses. The recent construction of infectious clones of dicistrovirus genomes may fill these gaps in knowledge. We discuss economically important diseases caused by dicistroviruses. Future research may lead to protection of beneficial arthropods from dicistroviruses and to application of dicistroviruses as biopesticides targeting pestiferous insects. ",
                "fez_record_search_key_keywords": [{
                    "rek_keywords": "Aphid viruses",
                    "rek_keywords_order": 1
                }, {
                    "rek_keywords": "Colony collapse disorder",
                    "rek_keywords_order": 2
                }, {
                    "rek_keywords": "Dicistroviridae",
                    "rek_keywords_order": 3
                }, {
                    "rek_keywords": "Insect antiviral immunity",
                    "rek_keywords_order": 4
                }, {
                    "rek_keywords": "Internal ribosome entry sites",
                    "rek_keywords_order": 5
                }, {"rek_keywords": "Pest management", "rek_keywords_order": 6}, {
                    "rek_keywords": "RNA virus",
                    "rek_keywords_order": 7
                }],
                "rek_title": "Dicistroviruses",
                "fez_record_search_key_doi": {"rek_doi": "10.1146\/annurev-ento-112408-085457"},
                "fez_record_search_key_issn": [{"rek_issn": "0066-4170", "rek_issn_order": 1}],
                "fez_record_search_key_pubmed": {"rek_pubmed": "19961327"},
                "rek_date": "2010-01-01T00:00:00Z",
                "fez_record_search_key_volume_number": {"rek_volume_number": "55"},
                "fez_record_search_key_start_page": {"rek_start_page": "129"},
                "fez_record_search_key_end_page": {"rek_end_page": "150"},
                "fez_record_search_key_total_pages": {"rek_total_pages": "22"},
                "fez_record_search_key_embase_id": {"rek_embase_id": "358900524"},
                "fez_record_search_key_scopus_id": {"rek_scopus_id": "2-s2.0-77449149944"},
                "fez_record_search_key_language": [{"rek_language": "eng", "rek_language_order": 1}],
                "fez_record_search_key_institutional_status": {"rek_institutional_status": "453224"},
                "rek_scopus_doc_type": "re",
                "rek_display_type": 179,
                "rek_genre": "Journal Article",
                "rek_genre_type": "Critical review of research, literature review, critical commentary",
                "rek_subtype": "Critical review of research, literature review, critical commentary",
                "fez_record_search_key_journal_name": {"rek_journal_name": "Annual Review of Entomology"},
                "fez_record_search_key_author": [{
                    "rek_author": "Bonning, Bryony C.",
                    "rek_author_order": 1
                }, {"rek_author": "Miller, W. Allen", "rek_author_order": 2}],
                "fez_record_search_key_author_id": [{
                    "rek_author_id": 0,
                    "rek_author_id_order": 1,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 57195255260,
                        "aut_display_name": "Bonning B.C.",
                        "aut_fname": "Bryony C.",
                        "aut_lname": "Bonning",
                        "aut_email": "bbonning@iastate.edu"
                    }
                }, {
                    "rek_author_id": 0,
                    "rek_author_id_order": 2,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 55665743000,
                        "aut_display_name": "Miller W.A.",
                        "aut_fname": "W. Allen",
                        "aut_lname": "Miller",
                        "aut_email": "wamiller@iastate.edu"
                    }
                }]
            }
        ];
        const wosList = [
            {
                "currentSource": "wos",
                "sources": [{source: "wos", id: "111"}],
                "fez_record_search_key_ismemberof": [{"rek_ismemberof": "UQ:180159", "rek_ismemberof_order": 1}],
                "rek_object_type": 3,
                "fez_record_search_key_isi_loc": {"rek_isi_loc": "000412197500001"},
                "rek_status": 2,
                "fez_record_search_key_publisher": {"rek_publisher": "BIOMED CENTRAL LTD"},
                "rek_title": "Viral metagenomics of aphids present in bean and maize plots on mixed-use farms in Kenya reveals the presence of three dicistroviruses including a novel Big Sioux River virus-like dicistrovirus",
                "fez_record_search_key_issn": [{"rek_issn": "1743-422X", "rek_issn_order": 1}],
                "fez_record_search_key_doi": {"rek_doi": "10.1186\/s12985-017-0854-x"},
                "rek_date": "2017-10-02T00:00:00Z",
                "fez_record_search_key_collection_year": {"rek_collection_year": "2017-10-02T00:00:00Z"},
                "fez_record_search_key_date_available": {"rek_date_available": "2017-10-02T00:00:00Z"},
                "fez_record_search_key_keywords": [{
                    "rek_keywords": "Rhopalosiphum-Padi-Virus",
                    "rek_keywords_order": 1
                }, {
                    "rek_keywords": "Lethal Paralysis Virus",
                    "rek_keywords_order": 2
                }, {"rek_keywords": "Sequence-Analysis", "rek_keywords_order": 3}, {
                    "rek_keywords": "Rna Viruses",
                    "rek_keywords_order": 4
                }, {"rek_keywords": "Recombination", "rek_keywords_order": 5}, {
                    "rek_keywords": "Transmission",
                    "rek_keywords_order": 6
                }, {"rek_keywords": "Plant", "rek_keywords_order": 7}, {
                    "rek_keywords": "Alignment",
                    "rek_keywords_order": 8
                }, {"rek_keywords": "Taxonomy", "rek_keywords_order": 9}, {
                    "rek_keywords": "Member",
                    "rek_keywords_order": 10
                }],
                "fez_record_search_key_volume_number": {"rek_volume_number": "14"},
                "fez_record_search_key_total_pages": {"rek_total_pages": "13"},
                "fez_record_search_key_language": [{"rek_language": "eng", "rek_language_order": 1}],
                "fez_record_search_key_author_affiliation_name": [{
                    "rek_author_affiliation_name": "University of Cambridge",
                    "rek_author_affiliation_name_order": 1
                }, {
                    "rek_author_affiliation_name": "International Livestock Research Institute|Africa Genom Ctr & Consultancy",
                    "rek_author_affiliation_name_order": 2
                }, {
                    "rek_author_affiliation_name": "University of Cambridge",
                    "rek_author_affiliation_name_order": 3
                }, {
                    "rek_author_affiliation_name": "Biosci Eastern & Cent Africa Int Livestock Res In",
                    "rek_author_affiliation_name_order": 4
                }, {
                    "rek_author_affiliation_name": "Biosci Eastern & Cent Africa Int Livestock Res In",
                    "rek_author_affiliation_name_order": 5
                }, {
                    "rek_author_affiliation_name": "Biosci Eastern & Cent Africa Int Livestock Res In|BBSRC Roslin Institute|University of Edinburgh",
                    "rek_author_affiliation_name_order": 6
                }, {
                    "rek_author_affiliation_name": "Biosci Eastern & Cent Africa Int Livestock Res In|Kansas State University",
                    "rek_author_affiliation_name_order": 7
                }, {"rek_author_affiliation_name": "University of Cambridge", "rek_author_affiliation_name_order": 8}],
                "fez_record_search_key_author_affiliation_country": [{
                    "rek_author_affiliation_country": "England",
                    "rek_author_affiliation_country_order": 1
                }, {
                    "rek_author_affiliation_country": "Kenya|Kenya",
                    "rek_author_affiliation_country_order": 2
                }, {
                    "rek_author_affiliation_country": "England",
                    "rek_author_affiliation_country_order": 3
                }, {
                    "rek_author_affiliation_country": "Kenya",
                    "rek_author_affiliation_country_order": 4
                }, {
                    "rek_author_affiliation_country": "Kenya",
                    "rek_author_affiliation_country_order": 5
                }, {
                    "rek_author_affiliation_country": "Kenya|Scotland|Scotland",
                    "rek_author_affiliation_country_order": 6
                }, {
                    "rek_author_affiliation_country": "Kenya|USA",
                    "rek_author_affiliation_country_order": 7
                }, {"rek_author_affiliation_country": "England", "rek_author_affiliation_country_order": 8}],
                "fez_record_search_key_author_affiliation_full_address": [{
                    "rek_author_affiliation_full_address": "Univ Cambridge, Dept Plant Sci, Cambridge CB2 3EA, England",
                    "rek_author_affiliation_full_address_order": 1
                }, {
                    "rek_author_affiliation_full_address": "Int Livestock Res Inst, 30709 Naivasha Rd, Nairobi, Kenya|Africa Genom Ctr & Consultancy, Nairobi, Kenya",
                    "rek_author_affiliation_full_address_order": 2
                }, {
                    "rek_author_affiliation_full_address": "Univ Cambridge, Dept Plant Sci, Cambridge CB2 3EA, England",
                    "rek_author_affiliation_full_address_order": 3
                }, {
                    "rek_author_affiliation_full_address": "Biosci Eastern & Cent Africa Int Livestock Res In, Nairobi 3070900100, Kenya",
                    "rek_author_affiliation_full_address_order": 4
                }, {
                    "rek_author_affiliation_full_address": "Biosci Eastern & Cent Africa Int Livestock Res In, Nairobi 3070900100, Kenya",
                    "rek_author_affiliation_full_address_order": 5
                }, {
                    "rek_author_affiliation_full_address": "Biosci Eastern & Cent Africa Int Livestock Res In, Nairobi 3070900100, Kenya|Roslin Inst, Ctr Trop Livestock Genet & Hlth, Edinburgh EH25 9RG, Midlothian, Scotland|Royal Dick Sch Vet Studies, Edinburgh EH25 9RG, Midlothian, Scotland",
                    "rek_author_affiliation_full_address_order": 6
                }, {
                    "rek_author_affiliation_full_address": "Biosci Eastern & Cent Africa Int Livestock Res In, Nairobi 3070900100, Kenya|Kansas State Univ, Feed Future Innovat Lab Reduct Postharvest Loss, Manhattan, KS 66506 USA",
                    "rek_author_affiliation_full_address_order": 7
                }, {
                    "rek_author_affiliation_full_address": "Univ Cambridge, Dept Plant Sci, Cambridge CB2 3EA, England",
                    "rek_author_affiliation_full_address_order": 8
                }],
                "rek_thomson_citation_count": 0,
                "fez_record_search_key_corresponding_organisation": [{
                    "rek_corresponding_organisation": "University of Cambridge",
                    "rek_corresponding_organisation_order": 1
                }, {
                    "rek_corresponding_organisation": "International Livestock Research Institute",
                    "rek_corresponding_organisation_order": 2
                }, {
                    "rek_corresponding_organisation": "Biosci Eastern & Cent Africa Int Livestock Res In",
                    "rek_corresponding_organisation_order": 3
                }, {
                    "rek_corresponding_organisation": "Africa Genom Ctr & Consultancy",
                    "rek_corresponding_organisation_order": 4
                }, {
                    "rek_corresponding_organisation": "BBSRC Roslin Institute",
                    "rek_corresponding_organisation_order": 5
                }, {
                    "rek_corresponding_organisation": "University of Edinburgh",
                    "rek_corresponding_organisation_order": 6
                }, {
                    "rek_corresponding_organisation": "Kansas State University",
                    "rek_corresponding_organisation_order": 7
                }],
                "fez_record_search_key_corresponding_country": [{
                    "rek_corresponding_country": "England",
                    "rek_corresponding_country_order": 1
                }, {
                    "rek_corresponding_country": "Kenya",
                    "rek_corresponding_country_order": 2
                }, {
                    "rek_corresponding_country": "Kenya",
                    "rek_corresponding_country_order": 3
                }, {
                    "rek_corresponding_country": "Kenya",
                    "rek_corresponding_country_order": 4
                }, {
                    "rek_corresponding_country": "Scotland",
                    "rek_corresponding_country_order": 5
                }, {
                    "rek_corresponding_country": "Scotland",
                    "rek_corresponding_country_order": 6
                }, {"rek_corresponding_country": "USA", "rek_corresponding_country_order": 7}],
                "fez_record_search_key_corresponding_email": [{
                    "rek_corresponding_email": "jpc1005@hermes.cam.ac.uk",
                    "rek_corresponding_email_order": 1
                }],
                "fez_record_search_key_corresponding_name": [{
                    "rek_corresponding_name": "Carr, John P.",
                    "rek_corresponding_name_order": 1
                }],
                "fez_record_search_key_grant_agency": [{
                    "rek_grant_agency": "Sustainable Crop Production Research for International Development programme",
                    "rek_grant_agency_order": 1
                }, {
                    "rek_grant_agency": "UK Biotechnology and Biological Sciences Research Council (BBSRC)",
                    "rek_grant_agency_order": 2
                }, {
                    "rek_grant_agency": "UK Department for International Development",
                    "rek_grant_agency_order": 3
                }, {
                    "rek_grant_agency": "Bill & Melinda Gates Foundation",
                    "rek_grant_agency_order": 4
                }, {
                    "rek_grant_agency": "Department of Biotechnology of India's Ministry of Science and Technology",
                    "rek_grant_agency_order": 5
                }, {
                    "rek_grant_agency": "Indian Council of Agricultural Research",
                    "rek_grant_agency_order": 6
                }, {
                    "rek_grant_agency": "Global Challenges Research Fund Foundation Award",
                    "rek_grant_agency_order": 7
                }, {
                    "rek_grant_agency": "Cambridge BBSRC doctoral training programme studentship",
                    "rek_grant_agency_order": 8
                }],
                "fez_record_search_key_grant_id": [{
                    "rek_grant_id": "BB\/J011762\/1",
                    "rek_grant_id_order": 1
                }, {"rek_grant_id": "BB\/P023223\/1", "rek_grant_id_order": 2}],
                "fez_record_search_key_institutional_status": {"rek_institutional_status": "453224"},
                "rek_display_type": 179,
                "rek_genre": "Journal Article",
                "rek_wok_doc_type": "@",
                "rek_genre_type": "Article (original research)",
                "rek_subtype": "Article (original research)",
                "fez_record_search_key_journal_name": {"rek_journal_name": "Virology Journal"},
                "fez_record_search_key_author": [{
                    "rek_author": "Wamonje, Francis O.",
                    "rek_author_order": 1
                }, {"rek_author": "Michuki, George N.", "rek_author_order": 2}, {
                    "rek_author": "Braidwood, Luke A.",
                    "rek_author_order": 3
                }, {"rek_author": "Njuguna, Joyce N.", "rek_author_order": 4}, {
                    "rek_author": "Mutuku, J. Musembi",
                    "rek_author_order": 5
                }, {"rek_author": "Djikeng, Appolinaire", "rek_author_order": 6}, {
                    "rek_author": "Harvey, Jagger J. W.",
                    "rek_author_order": 7
                }, {"rek_author": "Carr, John P.", "rek_author_order": 8}],
                "fez_record_search_key_author_id": [{
                    "rek_author_id": 0,
                    "rek_author_id_order": 1,
                    "fez_author": {
                        "aut_fname": "Francis O.",
                        "aut_lname": "Wamonje",
                        "aut_display_name": "Wamonje, Francis O.",
                        "aut_id": 0
                    }
                }, {
                    "rek_author_id": 0,
                    "rek_author_id_order": 2,
                    "fez_author": {
                        "aut_fname": "George N.",
                        "aut_lname": "Michuki",
                        "aut_display_name": "Michuki, George N.",
                        "aut_id": 0
                    }
                }, {
                    "rek_author_id": 0,
                    "rek_author_id_order": 3,
                    "fez_author": {
                        "aut_fname": "Luke A.",
                        "aut_lname": "Braidwood",
                        "aut_display_name": "Braidwood, Luke A.",
                        "aut_id": 0
                    }
                }, {
                    "rek_author_id": 0,
                    "rek_author_id_order": 4,
                    "fez_author": {
                        "aut_fname": "Joyce N.",
                        "aut_lname": "Njuguna",
                        "aut_display_name": "Njuguna, Joyce N.",
                        "aut_id": 0
                    }
                }, {
                    "rek_author_id": 0,
                    "rek_author_id_order": 5,
                    "fez_author": {
                        "aut_fname": "J. Musembi",
                        "aut_lname": "Mutuku",
                        "aut_display_name": "Mutuku, J. Musembi",
                        "aut_id": 0
                    }
                }, {
                    "rek_author_id": 0,
                    "rek_author_id_order": 6,
                    "fez_author": {
                        "aut_fname": "Appolinaire",
                        "aut_lname": "Djikeng",
                        "aut_display_name": "Djikeng, Appolinaire",
                        "aut_id": 0
                    }
                }, {
                    "rek_author_id": 0,
                    "rek_author_id_order": 7,
                    "fez_author": {
                        "aut_fname": "Jagger J. W.",
                        "aut_lname": "Harvey",
                        "aut_display_name": "Harvey, Jagger J. W.",
                        "aut_id": 0
                    }
                }, {
                    "rek_author_id": 0,
                    "rek_author_id_order": 8,
                    "fez_author": {
                        "aut_fname": "John P.",
                        "aut_lname": "Carr",
                        "aut_display_name": "Carr, John P.",
                        "aut_email": "jpc1005@hermes.cam.ac.uk",
                        "aut_id": 0
                    }
                }]
            }, 
            {
                "currentSource": "wos",
                "sources": [{source: "wos", id: "111"}],
                "fez_record_search_key_ismemberof": [{"rek_ismemberof": "UQ:180159", "rek_ismemberof_order": 1}],
                "rek_object_type": 3,
                "fez_record_search_key_isi_loc": {"rek_isi_loc": "000386872100029"},
                "rek_status": 2,
                "fez_record_search_key_publisher": {"rek_publisher": "MICROBIOLOGY SOC"},
                "rek_title": "X-ray structure of Triatoma virus empty capsid: insights into the mechanism of uncoating and RNA release in dicistroviruses",
                "fez_record_search_key_issn": [{"rek_issn": "0022-1317", "rek_issn_order": 1}],
                "fez_record_search_key_doi": {"rek_doi": "10.1099\/jgv.0.000580"},
                "rek_date": "2016-10-01T00:00:00Z",
                "fez_record_search_key_collection_year": {"rek_collection_year": "2016-10-01T00:00:00Z"},
                "fez_record_search_key_date_available": {"rek_date_available": "2016-10-01T00:00:00Z"},
                "fez_record_search_key_keywords": [{
                    "rek_keywords": "Mouth-Disease Virus",
                    "rek_keywords_order": 1
                }, {"rek_keywords": "Poliovirus", "rek_keywords_order": 2}, {
                    "rek_keywords": "Particle",
                    "rek_keywords_order": 3
                }, {"rek_keywords": "Intermediate", "rek_keywords_order": 4}, {
                    "rek_keywords": "Enterovirus",
                    "rek_keywords_order": 5
                }, {"rek_keywords": "Infestans", "rek_keywords_order": 6}, {
                    "rek_keywords": "Reveals",
                    "rek_keywords_order": 7
                }, {"rek_keywords": "Model", "rek_keywords_order": 8}],
                "fez_record_search_key_volume_number": {"rek_volume_number": "97"},
                "fez_record_search_key_start_page": {"rek_start_page": "2769"},
                "fez_record_search_key_end_page": {"rek_end_page": "2779"},
                "fez_record_search_key_total_pages": {"rek_total_pages": "11"},
                "fez_record_search_key_language": [{"rek_language": "eng", "rek_language_order": 1}],
                "fez_record_search_key_author_affiliation_name": [{
                    "rek_author_affiliation_name": "CSIC-UPV - Unidad de Biofisica (UBF)",
                    "rek_author_affiliation_name_order": 1
                }, {
                    "rek_author_affiliation_name": "CSIC-UPV - Unidad de Biofisica (UBF)|Fdn Biofis Bizkaia",
                    "rek_author_affiliation_name_order": 2
                }, {
                    "rek_author_affiliation_name": "CSIC-UPV - Unidad de Biofisica (UBF)|Fdn Biofis Bizkaia",
                    "rek_author_affiliation_name_order": 3
                }, {
                    "rek_author_affiliation_name": "Consejo Nacional de Investigaciones Cientificas y Tecnicas (CONICET)",
                    "rek_author_affiliation_name_order": 4
                }, {
                    "rek_author_affiliation_name": "CSIC-UPV - Unidad de Biofisica (UBF)|University of Basque Country",
                    "rek_author_affiliation_name_order": 5
                }],
                "fez_record_search_key_author_affiliation_country": [{
                    "rek_author_affiliation_country": "Spain",
                    "rek_author_affiliation_country_order": 1
                }, {
                    "rek_author_affiliation_country": "Spain|Spain",
                    "rek_author_affiliation_country_order": 2
                }, {
                    "rek_author_affiliation_country": "Spain|Spain",
                    "rek_author_affiliation_country_order": 3
                }, {
                    "rek_author_affiliation_country": "Argentina",
                    "rek_author_affiliation_country_order": 4
                }, {"rek_author_affiliation_country": "Spain|Spain", "rek_author_affiliation_country_order": 5}],
                "fez_record_search_key_author_affiliation_full_address": [{
                    "rek_author_affiliation_full_address": "Univ Basque Country, CSIC, Inst Biofisika, Barrio Sarriena S-N, Leioa 48940, Bizkaia, Spain",
                    "rek_author_affiliation_full_address_order": 1
                }, {
                    "rek_author_affiliation_full_address": "Univ Basque Country, CSIC, Inst Biofisika, Barrio Sarriena S-N, Leioa 48940, Bizkaia, Spain|Fdn Biofis Bizkaia, Barrio Sarriena S-N, Leioa 48940, Bizkaia, Spain",
                    "rek_author_affiliation_full_address_order": 2
                }, {
                    "rek_author_affiliation_full_address": "Univ Basque Country, CSIC, Inst Biofisika, Barrio Sarriena S-N, Leioa 48940, Bizkaia, Spain|Fdn Biofis Bizkaia, Barrio Sarriena S-N, Leioa 48940, Bizkaia, Spain",
                    "rek_author_affiliation_full_address_order": 3
                }, {
                    "rek_author_affiliation_full_address": "CEPAVE CCT La Plata CONICET UNLP, Ctr Estudios Parasitol & Vectores, Blvd 120 E-61 & 62, RA-1900 La Plata, Buenos Aires, Argentina",
                    "rek_author_affiliation_full_address_order": 4
                }, {
                    "rek_author_affiliation_full_address": "Univ Basque Country, CSIC, Inst Biofisika, Barrio Sarriena S-N, Leioa 48940, Bizkaia, Spain|Univ Basque Country, UPV EHU, Fac Ciencia & Tecnol, Dept Bioquim & Biol Mol, Barrio Sarriena S-N, Leioa 48940, Bizkaia, Spain",
                    "rek_author_affiliation_full_address_order": 5
                }],
                "rek_thomson_citation_count": 0,
                "fez_record_search_key_corresponding_organisation": [{
                    "rek_corresponding_organisation": "CSIC-UPV - Unidad de Biofisica (UBF)",
                    "rek_corresponding_organisation_order": 1
                }, {
                    "rek_corresponding_organisation": "Fdn Biofis Bizkaia",
                    "rek_corresponding_organisation_order": 2
                }, {
                    "rek_corresponding_organisation": "Consejo Nacional de Investigaciones Cientificas y Tecnicas (CONICET)",
                    "rek_corresponding_organisation_order": 3
                }, {
                    "rek_corresponding_organisation": "University of Basque Country",
                    "rek_corresponding_organisation_order": 4
                }],
                "fez_record_search_key_corresponding_country": [{
                    "rek_corresponding_country": "Spain",
                    "rek_corresponding_country_order": 1
                }, {
                    "rek_corresponding_country": "Spain",
                    "rek_corresponding_country_order": 2
                }, {
                    "rek_corresponding_country": "Argentina",
                    "rek_corresponding_country_order": 3
                }, {"rek_corresponding_country": "Spain", "rek_corresponding_country_order": 4}],
                "fez_record_search_key_corresponding_email": [{
                    "rek_corresponding_email": "diego.guerin@gmail.com",
                    "rek_corresponding_email_order": 1
                }, {"rek_corresponding_email": "diego.guerin@gmail.com", "rek_corresponding_email_order": 2}],
                "fez_record_search_key_corresponding_name": [{
                    "rek_corresponding_name": "Guerin, Diego M. A.",
                    "rek_corresponding_name_order": 1
                }, {"rek_corresponding_name": "Guerin, Diego M. A.", "rek_corresponding_name_order": 2}],
                "fez_record_search_key_grant_agency": [{
                    "rek_grant_agency": "Basque Government (BG)",
                    "rek_grant_agency_order": 1
                }, {
                    "rek_grant_agency": "Fundacion Biofisica Bizkaia (FBB), Spain",
                    "rek_grant_agency_order": 2
                }, {
                    "rek_grant_agency": "Consejo Nacional de Investigaciones Cientificas y Tecnicas (CONICET)",
                    "rek_grant_agency_order": 3
                }, {
                    "rek_grant_agency": "Comision de Investigaciones Cientificas de la Provincia de Buenos Aires (CICPBA)",
                    "rek_grant_agency_order": 4
                }, {
                    "rek_grant_agency": "Agencia Nacional de Promocion Cientifica y Tecnica, Argentina",
                    "rek_grant_agency_order": 5
                }, {
                    "rek_grant_agency": "University of La Plata",
                    "rek_grant_agency_order": 6
                }, {
                    "rek_grant_agency": "BG",
                    "rek_grant_agency_order": 7
                }, {
                    "rek_grant_agency": "Universidad del Pais Vasco (UPV\/EHU)",
                    "rek_grant_agency_order": 8
                }, {
                    "rek_grant_agency": "Ministerio de Ciencia e Innovacion (MICINN), Spain",
                    "rek_grant_agency_order": 9
                }],
                "fez_record_search_key_grant_id": [{
                    "rek_grant_id": "PIP2011-0007",
                    "rek_grant_id_order": 1
                }, {"rek_grant_id": "PICT N_2011-1081", "rek_grant_id_order": 2}, {
                    "rek_grant_id": "MV-2012-2-41",
                    "rek_grant_id_order": 3
                }, {"rek_grant_id": "IT849-13", "rek_grant_id_order": 4}, {
                    "rek_grant_id": "BFU2012-36241",
                    "rek_grant_id_order": 5
                }],
                "fez_record_search_key_institutional_status": {"rek_institutional_status": "453224"},
                "rek_display_type": 179,
                "rek_genre": "Journal Article",
                "rek_wok_doc_type": "@",
                "rek_genre_type": "Article (original research)",
                "rek_subtype": "Article (original research)",
                "fez_record_search_key_journal_name": {"rek_journal_name": "Journal of General Virology"},
                "fez_record_search_key_author": [{
                    "rek_author": "Sanchez-Eugenia, Ruben",
                    "rek_author_order": 1
                }, {"rek_author": "Durana, Aritz", "rek_author_order": 2}, {
                    "rek_author": "Lopez-Marijuan, Ibai",
                    "rek_author_order": 3
                }, {"rek_author": "Marti, Gerardo A.", "rek_author_order": 4}, {
                    "rek_author": "Guerin, Diego M. A.",
                    "rek_author_order": 5
                }],
                "fez_record_search_key_author_id": [{
                    "rek_author_id": 0,
                    "rek_author_id_order": 1,
                    "fez_author": {
                        "aut_fname": "Ruben",
                        "aut_lname": "Sanchez-Eugenia",
                        "aut_display_name": "Sanchez-Eugenia, Ruben",
                        "aut_id": 0
                    }
                }, {
                    "rek_author_id": 0,
                    "rek_author_id_order": 2,
                    "fez_author": {
                        "aut_fname": "Aritz",
                        "aut_lname": "Durana",
                        "aut_display_name": "Durana, Aritz",
                        "aut_id": 0
                    }
                }, {
                    "rek_author_id": 0,
                    "rek_author_id_order": 3,
                    "fez_author": {
                        "aut_fname": "Ibai",
                        "aut_lname": "Lopez-Marijuan",
                        "aut_display_name": "Lopez-Marijuan, Ibai",
                        "aut_id": 0
                    }
                }, {
                    "rek_author_id": 0,
                    "rek_author_id_order": 4,
                    "fez_author": {
                        "aut_fname": "Gerardo A.",
                        "aut_lname": "Marti",
                        "aut_display_name": "Marti, Gerardo A.",
                        "aut_id": 0
                    }
                }, {
                    "rek_author_id": 0,
                    "rek_author_id_order": 5,
                    "fez_author": {
                        "aut_fname": "Diego M. A.",
                        "aut_lname": "Guerin",
                        "aut_display_name": "Guerin, Diego M. A.",
                        "aut_email": "diego.guerin@gmail.com",
                        "aut_id": 0
                    }
                }]
            }, 
            {
                "currentSource": "wos",
                "sources": [{source: "wos", id: "111"}],
                "fez_record_search_key_ismemberof": [{"rek_ismemberof": "UQ:180159", "rek_ismemberof_order": 1}],
                "rek_object_type": 3,
                "fez_record_search_key_isi_loc": {"rek_isi_loc": "000377227600002"},
                "rek_status": 2,
                "fez_record_search_key_publisher": {"rek_publisher": "AMER SOC MICROBIOLOGY"},
                "rek_title": "Commandeering the Ribosome: Lessons Learned from Dicistroviruses about Translation",
                "fez_record_search_key_issn": [{"rek_issn": "0022-538X", "rek_issn_order": 1}],
                "fez_record_search_key_doi": {"rek_doi": "10.1128\/JVI.00737-15"},
                "rek_date": "2016-06-01T00:00:00Z",
                "fez_record_search_key_collection_year": {"rek_collection_year": "2016-06-01T00:00:00Z"},
                "fez_record_search_key_date_available": {"rek_date_available": "2016-06-01T00:00:00Z"},
                "fez_record_search_key_keywords": [{
                    "rek_keywords": "Paralysis Virus Ires",
                    "rek_keywords_order": 1
                }, {"rek_keywords": "Structural Basis", "rek_keywords_order": 2}, {
                    "rek_keywords": "Rna Viruses",
                    "rek_keywords_order": 3
                }, {"rek_keywords": "Viral Ires", "rek_keywords_order": 4}, {
                    "rek_keywords": "Initiation",
                    "rek_keywords_order": 5
                }, {"rek_keywords": "Binding", "rek_keywords_order": 6}, {
                    "rek_keywords": "Complexes",
                    "rek_keywords_order": 7
                }, {"rek_keywords": "Reveals", "rek_keywords_order": 8}, {
                    "rek_keywords": "Element",
                    "rek_keywords_order": 9
                }],
                "fez_record_search_key_issue_number": {"rek_issue_number": "12"},
                "fez_record_search_key_volume_number": {"rek_volume_number": "90"},
                "fez_record_search_key_start_page": {"rek_start_page": "5538"},
                "fez_record_search_key_end_page": {"rek_end_page": "5540"},
                "fez_record_search_key_total_pages": {"rek_total_pages": "3"},
                "fez_record_search_key_language": [{"rek_language": "eng", "rek_language_order": 1}],
                "fez_record_search_key_author_affiliation_name": [{
                    "rek_author_affiliation_name": "University of British Columbia",
                    "rek_author_affiliation_name_order": 1
                }, {
                    "rek_author_affiliation_name": "University of British Columbia",
                    "rek_author_affiliation_name_order": 2
                }],
                "fez_record_search_key_author_affiliation_country": [{
                    "rek_author_affiliation_country": "Canada",
                    "rek_author_affiliation_country_order": 1
                }, {"rek_author_affiliation_country": "Canada", "rek_author_affiliation_country_order": 2}],
                "fez_record_search_key_author_affiliation_full_address": [{
                    "rek_author_affiliation_full_address": "Univ British Columbia, Dept Biochem & Mol Biol, Vancouver, BC V5Z 1M9, Canada",
                    "rek_author_affiliation_full_address_order": 1
                }, {
                    "rek_author_affiliation_full_address": "Univ British Columbia, Dept Biochem & Mol Biol, Vancouver, BC V5Z 1M9, Canada",
                    "rek_author_affiliation_full_address_order": 2
                }],
                "rek_thomson_citation_count": 2,
                "fez_record_search_key_corresponding_organisation": [{
                    "rek_corresponding_organisation": "University of British Columbia",
                    "rek_corresponding_organisation_order": 1
                }],
                "fez_record_search_key_corresponding_country": [{
                    "rek_corresponding_country": "Canada",
                    "rek_corresponding_country_order": 1
                }],
                "fez_record_search_key_corresponding_email": [{
                    "rek_corresponding_email": "ej@mail.ubc.ca",
                    "rek_corresponding_email_order": 1
                }],
                "fez_record_search_key_corresponding_name": [{
                    "rek_corresponding_name": "Jan, Eric",
                    "rek_corresponding_name_order": 1
                }],
                "fez_record_search_key_grant_agency": [{
                    "rek_grant_agency": "Gouvernement du Canada | Natural Sciences and Engineering Research Council of Canada (NSERC)",
                    "rek_grant_agency_order": 1
                }, {
                    "rek_grant_agency": "Gouvernement du Canada | Canadian Institutes of Health Research (CIHR)",
                    "rek_grant_agency_order": 2
                }],
                "fez_record_search_key_grant_id": [{"rek_grant_id": "MOP-81244", "rek_grant_id_order": 1}],
                "fez_record_search_key_institutional_status": {"rek_institutional_status": "453224"},
                "rek_display_type": 179,
                "rek_genre": "Journal Article",
                "rek_wok_doc_type": "@",
                "rek_genre_type": "Article (original research)",
                "rek_subtype": "Article (original research)",
                "fez_record_search_key_journal_name": {"rek_journal_name": "Journal of Virology"},
                "fez_record_search_key_author": [{
                    "rek_author": "Kerr, Craig H.",
                    "rek_author_order": 1
                }, {"rek_author": "Jan, Eric", "rek_author_order": 2}],
                "fez_record_search_key_author_id": [{
                    "rek_author_id": 0,
                    "rek_author_id_order": 1,
                    "fez_author": {
                        "aut_fname": "Craig H.",
                        "aut_lname": "Kerr",
                        "aut_display_name": "Kerr, Craig H.",
                        "aut_id": 0
                    }
                }, {
                    "rek_author_id": 0,
                    "rek_author_id_order": 2,
                    "fez_author": {
                        "aut_fname": "Eric",
                        "aut_lname": "Jan",
                        "aut_display_name": "Jan, Eric",
                        "aut_email": "ej@mail.ubc.ca",
                        "aut_id": 0
                    }
                }]
            }, 
            {
                "currentSource": "wos",
                "sources": [{source: "wos", id: "111"}],
                "fez_record_search_key_ismemberof": [{"rek_ismemberof": "UQ:180159", "rek_ismemberof_order": 1}],
                "rek_object_type": 3,
                "fez_record_search_key_isi_loc": {"rek_isi_loc": "000283520500009"},
                "rek_status": 2,
                "fez_record_search_key_publisher": {"rek_publisher": "CAISTER ACADEMIC PRESS"},
                "rek_title": "Dicistroviruses",
                "fez_record_search_key_isbn": [{"rek_isbn": "978-1-904455-71-4", "rek_isbn_order": 1}],
                "rek_date": "2010-01-01T00:00:00Z",
                "fez_record_search_key_collection_year": {"rek_collection_year": "2010-01-01T00:00:00Z"},
                "fez_record_search_key_date_available": {"rek_date_available": "2010-01-01T00:00:00Z"},
                "fez_record_search_key_keywords": [{
                    "rek_keywords": "Cricket-Paralysis-Virus",
                    "rek_keywords_order": 1
                }, {
                    "rek_keywords": "Internal Ribosome Entry",
                    "rek_keywords_order": 2
                }, {
                    "rek_keywords": "Rhopalosiphum-Padi Virus",
                    "rek_keywords_order": 3
                }, {
                    "rek_keywords": "Drosophila-C-Virus",
                    "rek_keywords_order": 4
                }, {
                    "rek_keywords": "Picorna-Like Virus",
                    "rek_keywords_order": 5
                }, {
                    "rek_keywords": "Stali-Intestine-Virus",
                    "rek_keywords_order": 6
                }, {
                    "rek_keywords": "Double-Stranded-Rna",
                    "rek_keywords_order": 7
                }, {
                    "rek_keywords": "Colony Collapse Disorder",
                    "rek_keywords_order": 8
                }, {
                    "rek_keywords": "Taura-Syndrome Virus",
                    "rek_keywords_order": 9
                }, {"rek_keywords": "Kashmir Bee Virus", "rek_keywords_order": 10}],
                "fez_record_search_key_start_page": {"rek_start_page": "201"},
                "fez_record_search_key_end_page": {"rek_end_page": "229"},
                "fez_record_search_key_total_pages": {"rek_total_pages": "29"},
                "fez_record_search_key_language": [{"rek_language": "eng", "rek_language_order": 1}],
                "fez_record_search_key_author_affiliation_name": [{
                    "rek_author_affiliation_name": "Iowa State University",
                    "rek_author_affiliation_name_order": 1
                }, {"rek_author_affiliation_name": "University of Queensland", "rek_author_affiliation_name_order": 2}],
                "fez_record_search_key_author_affiliation_country": [{
                    "rek_author_affiliation_country": "USA",
                    "rek_author_affiliation_country_order": 1
                }, {"rek_author_affiliation_country": "Australia", "rek_author_affiliation_country_order": 2}],
                "fez_record_search_key_author_affiliation_full_address": [{
                    "rek_author_affiliation_full_address": "Iowa State Univ, Dept Entomol, Ames, IA 50011 USA",
                    "rek_author_affiliation_full_address_order": 1
                }, {
                    "rek_author_affiliation_full_address": "Univ Queensland, Sch Biol Sci, St Lucia, Qld, Australia",
                    "rek_author_affiliation_full_address_order": 2
                }],
                "rek_thomson_citation_count": 2,
                "fez_record_search_key_corresponding_organisation": [{
                    "rek_corresponding_organisation": "Iowa State University",
                    "rek_corresponding_organisation_order": 1
                }, {
                    "rek_corresponding_organisation": "University of Queensland",
                    "rek_corresponding_organisation_order": 2
                }],
                "fez_record_search_key_corresponding_country": [{
                    "rek_corresponding_country": "USA",
                    "rek_corresponding_country_order": 1
                }, {"rek_corresponding_country": "Australia", "rek_corresponding_country_order": 2}],
                "fez_record_search_key_corresponding_email": [{
                    "rek_corresponding_email": "bbonning@iastate.edu",
                    "rek_corresponding_email_order": 1
                }, {"rek_corresponding_email": "karynj@uq.edu.au", "rek_corresponding_email_order": 2}],
                "fez_record_search_key_corresponding_name": [{
                    "rek_corresponding_name": "Bonning, Bryony C.",
                    "rek_corresponding_name_order": 1
                }],
                "fez_record_search_key_institutional_status": {"rek_institutional_status": "453223"},
                "rek_display_type": 179,
                "rek_genre": "Journal Article",
                "rek_wok_doc_type": "@",
                "rek_genre_type": "Article (original research)",
                "rek_subtype": "Article (original research)",
                "fez_record_search_key_journal_name": {"rek_journal_name": "Insect Virology"},
                "fez_record_search_key_author": [{
                    "rek_author": "Bonning, Bryony C.",
                    "rek_author_order": 1
                }, {"rek_author": "Johnson, Karyn N.", "rek_author_order": 2}],
                "fez_record_search_key_author_id": [{
                    "rek_author_id": 0,
                    "rek_author_id_order": 1,
                    "fez_author": {
                        "aut_fname": "Bryony C.",
                        "aut_lname": "Bonning",
                        "aut_display_name": "Bonning, Bryony C.",
                        "aut_email": "bbonning@iastate.edu",
                        "aut_id": 0
                    }
                }, {
                    "rek_author_id": 2999,
                    "rek_author_id_order": 2,
                    "fez_author": {
                        "aut_id": 2999,
                        "aut_org_username": "uqkjohn3",
                        "aut_org_staff_id": "0045091",
                        "aut_org_student_id": null,
                        "aut_email": "karynj@uq.edu.au",
                        "aut_display_name": "Johnson, Karyn N.",
                        "aut_fname": "Karyn",
                        "aut_mname": null,
                        "aut_lname": "Johnson",
                        "aut_title": "Dr",
                        "aut_position": null,
                        "aut_homepage_link": null,
                        "aut_created_date": null,
                        "aut_update_date": "2017-08-06 00:00:00",
                        "aut_external_id": "0000083297",
                        "aut_ref_num": null,
                        "aut_researcher_id": "B-7980-2008",
                        "aut_scopus_id": "7405970998",
                        "aut_mypub_url": null,
                        "aut_rid_password": "",
                        "aut_people_australia_id": "",
                        "aut_description": null,
                        "aut_orcid_id": "0000-0001-8647-8985",
                        "aut_google_scholar_id": "",
                        "aut_rid_last_updated": "2012-09-13 00:00:00",
                        "aut_publons_id": "1",
                        "aut_student_username": null,
                        "matcher": {}
                    }
                }]
            }, 
            {
                "currentSource": "wos",
                "sources": [{source: "wos", id: "111"}],
                "fez_record_search_key_ismemberof": [{"rek_ismemberof": "UQ:180159", "rek_ismemberof_order": 1}],
                "rek_object_type": 3,
                "fez_record_search_key_isi_loc": {"rek_isi_loc": "000273712100008"},
                "rek_status": 2,
                "fez_record_search_key_publisher": {"rek_publisher": "ANNUAL REVIEWS"},
                "rek_title": "Dicistroviruses",
                "fez_record_search_key_issn": [{"rek_issn": "0066-4170", "rek_issn_order": 1}],
                "fez_record_search_key_isbn": [{"rek_isbn": "978-0-8243-0155-2", "rek_isbn_order": 1}],
                "fez_record_search_key_doi": {"rek_doi": "10.1146\/annurev-ento-112408-085457"},
                "rek_date": "2010-01-01T00:00:00Z",
                "fez_record_search_key_collection_year": {"rek_collection_year": "2010-01-01T00:00:00Z"},
                "fez_record_search_key_date_available": {"rek_date_available": "2010-01-01T00:00:00Z"},
                "fez_record_search_key_keywords": [{
                    "rek_keywords": "Cricket Paralysis Virus",
                    "rek_keywords_order": 1
                }, {
                    "rek_keywords": "Picorna-Like Virus",
                    "rek_keywords_order": 2
                }, {
                    "rek_keywords": "Rhopalosiphum-Padi Virus",
                    "rek_keywords_order": 3
                }, {
                    "rek_keywords": "Double-Stranded-Rna",
                    "rek_keywords_order": 4
                }, {
                    "rek_keywords": "Drosophila-C-Virus",
                    "rek_keywords_order": 5
                }, {
                    "rek_keywords": "Internal Ribosome Entry",
                    "rek_keywords_order": 6
                }, {
                    "rek_keywords": "Taura-Syndrome Virus",
                    "rek_keywords_order": 7
                }, {"rek_keywords": "Kashmir Bee Virus", "rek_keywords_order": 8}, {
                    "rek_keywords": "Imported Fire Ant",
                    "rek_keywords_order": 9
                }, {"rek_keywords": "Nucleotide-Sequence Analysis", "rek_keywords_order": 10}],
                "fez_record_search_key_volume_number": {"rek_volume_number": "55"},
                "fez_record_search_key_start_page": {"rek_start_page": "129"},
                "fez_record_search_key_end_page": {"rek_end_page": "150"},
                "fez_record_search_key_total_pages": {"rek_total_pages": "22"},
                "fez_record_search_key_language": [{"rek_language": "eng", "rek_language_order": 1}],
                "fez_record_search_key_author_affiliation_name": [{
                    "rek_author_affiliation_name": "Iowa State University",
                    "rek_author_affiliation_name_order": 1
                }, {
                    "rek_author_affiliation_name": "Iowa State University|Iowa State University|Iowa State University",
                    "rek_author_affiliation_name_order": 2
                }],
                "fez_record_search_key_author_affiliation_country": [{
                    "rek_author_affiliation_country": "USA",
                    "rek_author_affiliation_country_order": 1
                }, {"rek_author_affiliation_country": "USA|USA|USA", "rek_author_affiliation_country_order": 2}],
                "fez_record_search_key_author_affiliation_full_address": [{
                    "rek_author_affiliation_full_address": "Iowa State Univ, Dept Entomol, Ames, IA 50011 USA",
                    "rek_author_affiliation_full_address_order": 1
                }, {
                    "rek_author_affiliation_full_address": "Iowa State Univ, Dept Plant Pathol & Biochem, Ames, IA 50011 USA|Iowa State Univ, Dept Biophys, Ames, IA 50011 USA|Iowa State Univ, Dept Mol Biol, Ames, IA 50011 USA",
                    "rek_author_affiliation_full_address_order": 2
                }],
                "rek_thomson_citation_count": 71,
                "fez_record_search_key_corresponding_organisation": [{
                    "rek_corresponding_organisation": "Iowa State University",
                    "rek_corresponding_organisation_order": 1
                }, {
                    "rek_corresponding_organisation": "Iowa State University",
                    "rek_corresponding_organisation_order": 2
                }, {
                    "rek_corresponding_organisation": "Iowa State University",
                    "rek_corresponding_organisation_order": 3
                }, {
                    "rek_corresponding_organisation": "Iowa State University",
                    "rek_corresponding_organisation_order": 4
                }],
                "fez_record_search_key_corresponding_country": [{
                    "rek_corresponding_country": "USA",
                    "rek_corresponding_country_order": 1
                }, {
                    "rek_corresponding_country": "USA",
                    "rek_corresponding_country_order": 2
                }, {
                    "rek_corresponding_country": "USA",
                    "rek_corresponding_country_order": 3
                }, {"rek_corresponding_country": "USA", "rek_corresponding_country_order": 4}],
                "fez_record_search_key_corresponding_email": [{
                    "rek_corresponding_email": "bbonning@iastate.edu",
                    "rek_corresponding_email_order": 1
                }, {
                    "rek_corresponding_email": "wamiller@iastate.edu",
                    "rek_corresponding_email_order": 2
                }, {
                    "rek_corresponding_email": "wamiller@iastate.edu",
                    "rek_corresponding_email_order": 3
                }, {"rek_corresponding_email": "wamiller@iastate.edu", "rek_corresponding_email_order": 4}],
                "fez_record_search_key_corresponding_name": [{
                    "rek_corresponding_name": "Bonning, Bryony C.",
                    "rek_corresponding_name_order": 1
                }],
                "fez_record_search_key_grant_agency": [{
                    "rek_grant_agency": "Iowa State University Plant Sciences Institute",
                    "rek_grant_agency_order": 1
                }, {"rek_grant_agency": "Consortium for Plant Biotechnology Research", "rek_grant_agency_order": 2}],
                "fez_record_search_key_grant_id": [{"rek_grant_id": "6673", "rek_grant_id_order": 1}],
                "fez_record_search_key_institutional_status": {"rek_institutional_status": "453224"},
                "rek_display_type": 179,
                "rek_genre": "Journal Article",
                "rek_wok_doc_type": "R",
                "rek_genre_type": "Critical review of research, literature review, critical commentary",
                "rek_subtype": "Critical review of research, literature review, critical commentary",
                "fez_record_search_key_journal_name": {"rek_journal_name": "Annual Review of Entomology"},
                "fez_record_search_key_author": [{
                    "rek_author": "Bonning, Bryony C.",
                    "rek_author_order": 1
                }, {"rek_author": "Miller, W. Allen", "rek_author_order": 2}],
                "fez_record_search_key_author_id": [{
                    "rek_author_id": 0,
                    "rek_author_id_order": 1,
                    "fez_author": {
                        "aut_fname": "Bryony C.",
                        "aut_lname": "Bonning",
                        "aut_display_name": "Bonning, Bryony C.",
                        "aut_email": "bbonning@iastate.edu",
                        "aut_id": 0
                    }
                }, {
                    "rek_author_id": 0,
                    "rek_author_id_order": 2,
                    "fez_author": {
                        "aut_fname": "W. Allen",
                        "aut_lname": "Miller",
                        "aut_display_name": "Miller, W. Allen",
                        "aut_email": "wamiller@iastate.edu",
                        "aut_id": 0
                    }
                }]
            }];

        const result = reducer.deduplicateResults([...espaceList, ...scopusList, ...wosList]);

        expect(result.length).toEqual(8);

        result.map((item, index) => {
            if (item.fez_record_search_key_doi &&
                (item.fez_record_search_key_doi.rek_doi === '10.1186/s12985-017-0854-x'
                    || item.fez_record_search_key_doi.rek_doi === '10.1099/jgv.0.000580'
                    || item.fez_record_search_key_doi.rek_doi === '10.1146/annurev-ento-112408-085457'
                    || item.fez_record_search_key_doi.rek_doi === '10.1128/JVI.00737-15')) {
                expect(item.sources.map(item => item.source)).toEqual(['scopus', 'wos']);
            }
        });

        expect(result[0].currentSource).toEqual('espace');
        expect(result[1].currentSource).toEqual('espace');
        
    });
});