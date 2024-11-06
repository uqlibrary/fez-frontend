import { hydrateMockSearchList } from '../../../helpers/general';

const internalTitleSearchList = {
    total: 7,
    per_page: 10,
    current_page: 1,
    from: 1,
    to: 7,
    data: [
        {
            rek_pid: 'UQ:795469',
            rek_status_lookup: 'Published',
            rek_security_inherited: 1,
            fez_record_search_key_author: ['Parker, Malcolm'],
            fez_record_search_key_author_id: [410],
            fez_record_search_key_isbn: ['9783319715797', '9783319715803'],
            fez_record_search_key_ismemberof: [
                {
                    rek_ismemberof: 'UQ:218198',
                    rek_ismemberof_lookup: 'Unprocessed Records'
                }
            ],
            fez_record_search_key_place_of_publication: 'Cham',
            fez_record_search_key_contributor_id: [0, 0],
            rek_created_date: '2018-03-07T23:30:00Z',
            fez_record_search_key_contributor: ['El-Hawary, Ron', 'Eberson, Craig P.'],
            fez_record_search_key_publisher: 'Springer International Publishing',
            fez_record_search_key_doi: '10.1007/978-3-319-71580-3',
            rek_title: 'Early Onset Scoliosis',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453694,
                rek_oa_status_lookup: 'link (no DOI)'
            },
            fez_record_search_key_link: ["https://www.library.uq.edu.au/fryer-library/indigenous-voices"],
            fez_record_search_key_link_description: [
                "Browse Indigenous language resources from this collection online",
            ],
            rek_date: '2018-01-01T00:00:00Z',
            sources: [
                {
                    source: 'espace',
                    id: 'UQ:795469'
                },
                {
                    source: 'crossref',
                    id: '10.1007/978-3-319-71580-3'
                }
            ],
            rek_updated_date: '2018-03-14T03:11:09Z',
            rek_depositor: 6230,
            rek_display_type_lookup: 'Image',
            rek_display_type: 238,
            fez_record_search_key_advisory_statement: "Aboriginal and Torres Strait Islander people are warned that this photograph may contain images of Aboriginal and Islander people now deceased.",
            fez_datastream_info: [
                {
                    dsi_id: 2706296,
                    dsi_pid: 'UQ:252236',
                    dsi_dsid: 'My_UQ_eSpace_UPO_guidelines_2016.pdf',
                    dsi_embargo_date: '2018-01-01',
                    dsi_label: 'UPO Guide v.4',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 587005,
                    dsi_security_inherited: 1,
                    dsi_security_policy: 5,
                },
            ],
        },
        {
            "rek_pid": "UQ:342708",
            "rek_title_xsdmf_id": null,
            "rek_title": "Vaccination day",
            "rek_description_xsdmf_id": null,
            "rek_description": "They enterin curves and stoopslimping and tappinga file of bare armscreased faces upliftedred eyelids poutingeyes curtained in cataract.",
            "rek_display_type_xsdmf_id": null,
            "rek_display_type": 179,
            "rek_status_xsdmf_id": null,
            "rek_status": 2,
            "rek_date_xsdmf_id": null,
            "rek_date": "2014-06-01T00:00:00Z",
            "rek_object_type_xsdmf_id": null,
            "rek_object_type": 3,
            "rek_depositor_xsdmf_id": null,
            "rek_depositor": 8524,
            "rek_created_date_xsdmf_id": null,
            "rek_created_date": "2014-10-21T01:43:26Z",
            "rek_updated_date_xsdmf_id": null,
            "rek_updated_date": "2022-10-20T20:20:54Z",
            "rek_file_downloads": 0,
            "rek_citation": "<a class=\"author_id_link\" title=\"Browse by Author ID for Parker, Malcolm\" href=\"/records/search?searchQueryParams%5Brek_author_id%5D%5Bvalue%5D=710&searchQueryParams%5Brek_author_id%5D%5Blabel%5D=Parker%2C+Malcolm&searchMode=advanced\">Parker, Malcolm</a> (<span class=\"citation_date\">2014</span>). <i><a class=\"citation_title\" title=\"Click to view Journal Article: Vaccination day\" href=\"/view/UQ:342708\">Vaccination day</a></i>. <span class=\"citation_journal_name\">Journal of Bioethical Inquiry</span>, <span class=\"citation_volume_number\">11</span> (<span class=\"citation_issue_number\">2</span>), <span class=\"citation_start_page\">161</span>-<span class=\"citation_end_page\">161</span>. doi: <span class=\"citation_doi\">10.1007/s11673-014-9531-6</span>",
            "rek_genre_xsdmf_id": null,
            "rek_genre": "Journal Article",
            "rek_genre_type_xsdmf_id": null,
            "rek_genre_type": "Article (original research)",
            "rek_formatted_title_xsdmf_id": null,
            "rek_formatted_title": null,
            "rek_formatted_abstract_xsdmf_id": null,
            "rek_formatted_abstract": "They enter<br /><br />in curves and stoops<br /><br />limping and tapping<br /><br />a file of bare arms<br /><br />creased faces uplifted<br /><br />red eyelids pouting<br /><br />eyes curtained in cataract.<br />",
            "rek_depositor_affiliation_xsdmf_id": null,
            "rek_depositor_affiliation": 898,
            "rek_thomson_citation_count": null,
            "rek_thomson_citation_count_xsdmf_id": null,
            "rek_subtype_xsdmf_id": null,
            "rek_subtype": "Article (original research)",
            "rek_scopus_citation_count": 0,
            "rek_dimensions_citation_count": null,
            "rek_scopus_doc_type_xsdmf_id": null,
            "rek_scopus_doc_type": "ar",
            "rek_wok_doc_type_xsdmf_id": null,
            "rek_wok_doc_type": null,
            "rek_pubmed_doc_type_xsdmf_id": null,
            "rek_pubmed_doc_type": null,
            "rek_dimensions_doc_type": "article",
            "rek_security_inherited": 1,
            "rek_altmetric_score": 0,
            "rek_altmetric_score_xsdmf_id": null,
            "rek_altmetric_id": 63037219,
            "rek_altmetric_id_xsdmf_id": null,
            "rek_copyright_xsdmf_id": null,
            "rek_copyright": "on",
            "rek_security_policy": 1,
            "rek_datastream_policy": null,
            "rek_ci_notice_attribution_incomplete": null,
            "fez_datastream_info": [],
            "fez_record_search_key_advisory_statement": null,
            "fez_record_search_key_article_number": null,
            "fez_record_search_key_assigned_group_id": [],
            "fez_record_search_key_assigned_user_id": [],
            "fez_record_search_key_author": [
                {
                    "rek_author_id": 28704357,
                    "rek_author_pid": "UQ:342708",
                    "rek_author_xsdmf_id": null,
                    "rek_author": "Parker, Malcolm",
                    "rek_author_order": 1
                }
            ],
            "fez_record_search_key_author_id": [
                {
                    "rek_author_id_id": 28080611,
                    "rek_author_id_pid": "UQ:342708",
                    "rek_author_id_xsdmf_id": null,
                    "rek_author_id": 710,
                    "rek_author_id_order": 1,
                    "author": {
                        "aut_id": 710,
                        "aut_orcid_id": "0000-0002-8132-0115",
                        "aut_scopus_id": "7403672840",
                        "aut_researcher_id": "F-2779-2010",
                        "aut_title": "Emeritus Professor",
                        "aut_org_username": "mfmparke",
                        "aut_student_username": null
                    },
                    "rek_author_id_lookup": "Parker, Malcolm H."
                }
            ],
            "fez_record_search_key_author_crossref_authenticated": [],
            "fez_record_search_key_author_crossref_orcid": [],
            "fez_record_search_key_biosis_id": null,
            "fez_record_search_key_contributor": [],
            "fez_record_search_key_contributor_id": [],
            "fez_record_search_key_corresponding_country": [
                {
                    "rek_corresponding_country_id": 430713,
                    "rek_corresponding_country_pid": "UQ:342708",
                    "rek_corresponding_country_xsdmf_id": 0,
                    "rek_corresponding_country": "aus",
                    "rek_corresponding_country_order": 1
                }
            ],
            "fez_record_search_key_corresponding_email": [],
            "fez_record_search_key_corresponding_name": [
                {
                    "rek_corresponding_name_id": 142880,
                    "rek_corresponding_name_pid": "UQ:342708",
                    "rek_corresponding_name_xsdmf_id": 0,
                    "rek_corresponding_name": "Parker M.",
                    "rek_corresponding_name_order": 1
                }
            ],
            "fez_record_search_key_corresponding_organisation": [],
            "fez_record_search_key_datastream_policy": null,
            "fez_record_search_key_date_available": {
                "rek_date_available_id": 903643,
                "rek_date_available_pid": "UQ:342708",
                "rek_date_available_xsdmf_id": null,
                "rek_date_available": "2014-01-01T00:00:00Z"
            },
            "fez_record_search_key_dimensions_id": {
                "rek_dimensions_id_id": 72519,
                "rek_dimensions_id_pid": "UQ:342708",
                "rek_dimensions_id": "pub.1000062480"
            },
            "fez_record_search_key_deletion_notes": null,
            "fez_record_search_key_doi": {
                "rek_doi_id": 1500597,
                "rek_doi_pid": "UQ:342708",
                "rek_doi_xsdmf_id": null,
                "rek_doi": "10.1007/s11673-014-9531-6",
                "fez_altmetric": {
                    "as_id": 152192,
                    "as_amid": 63037219,
                    "as_doi": "10.1007/s11673-014-9531-6",
                    "as_score": 0,
                    "as_created": "2019-07-07 09:04:09",
                    "as_last_checked": "2024-10-30 23:42:47",
                    "as_1d": 0,
                    "as_2d": 0,
                    "as_3d": 0,
                    "as_4d": 0,
                    "as_5d": 0,
                    "as_6d": 0,
                    "as_1w": 0,
                    "as_1m": 0,
                    "as_3m": 0,
                    "as_6m": 0,
                    "as_1y": 0,
                    "as_total_posts_count": 0,
                    "as_facebook_posts_count": 0,
                    "as_policy_posts_count": 0,
                    "as_blogs_posts_count": 0,
                    "as_googleplus_posts_count": 0,
                    "as_news_posts_count": 0,
                    "as_reddit_posts_count": 0,
                    "as_twitter_posts_count": 0,
                    "as_syllabi_posts_count": 0,
                    "as_video_posts_count": 0,
                    "as_weibo_posts_count": 0,
                    "as_qa_posts_count": 0,
                    "as_f1000_posts_count": 0,
                    "as_wikipedia_posts_count": 0,
                    "as_pinterest_posts_count": 0,
                    "as_linkedin_posts_count": 0,
                    "as_peer_reviews_posts_count": 0,
                    "as_citation_url": "http://www.altmetric.com/details.php?citation_id=63037219"
                }
            },
            "fez_record_search_key_end_page": {
                "rek_end_page_id": 5474340,
                "rek_end_page_pid": "UQ:342708",
                "rek_end_page_xsdmf_id": null,
                "rek_end_page": "161"
            },
            "fez_record_search_key_external_label_id": [],
            "fez_record_search_key_file_attachment_access_condition": [],
            "fez_record_search_key_file_attachment_embargo_date": [],
            "fez_record_search_key_file_attachment_name": [],
            "fez_record_search_key_grant_acronym": [],
            "fez_record_search_key_grant_agency": [],
            "fez_record_search_key_grant_agency_id": [],
            "fez_record_search_key_grant_id": [],
            "fez_record_search_key_grant_text": [],
            "fez_record_search_key_herdc_code": {
                "rek_herdc_code_id": 4626366,
                "rek_herdc_code_pid": "UQ:342708",
                "rek_herdc_code_xsdmf_id": null,
                "rek_herdc_code": 450013,
                "rek_herdc_code_lookup": "CX"
            },
            "fez_record_search_key_herdc_status": {
                "rek_herdc_status_id": 3541497,
                "rek_herdc_status_pid": "UQ:342708",
                "rek_herdc_status_xsdmf_id": null,
                "rek_herdc_status": 453221,
                "rek_herdc_status_lookup": "Confirmed Code"
            },
            "fez_record_search_key_institutional_status": {
                "rek_institutional_status_id": 3203829,
                "rek_institutional_status_pid": "UQ:342708",
                "rek_institutional_status_xsdmf_id": null,
                "rek_institutional_status": 453223,
                "rek_institutional_status_lookup": "UQ"
            },
            "fez_record_search_key_isbn": [],
            "fez_record_search_key_isderivationof": [],
            "fez_record_search_key_isi_loc": null,
            "fez_record_search_key_ismemberof": [
                {
                    "rek_ismemberof_id": 11450931,
                    "rek_ismemberof_pid": "UQ:342708",
                    "rek_ismemberof_xsdmf_id": null,
                    "rek_ismemberof": "UQ:3831",
                    "rek_ismemberof_order": 1,
                    "parent": {
                        "rek_pid": "UQ:3831",
                        "rek_title": "School of Medicine Publications",
                        "rek_security_policy": 5,
                        "rek_datastream_policy": 5
                    },
                    "rek_ismemberof_lookup": "School of Medicine Publications"
                },
                {
                    "rek_ismemberof_id": 11450932,
                    "rek_ismemberof_pid": "UQ:342708",
                    "rek_ismemberof_xsdmf_id": null,
                    "rek_ismemberof": "UQ:237156",
                    "rek_ismemberof_order": 2,
                    "parent": {
                        "rek_pid": "UQ:237156",
                        "rek_title": "Non HERDC",
                        "rek_security_policy": 5,
                        "rek_datastream_policy": 5
                    },
                    "rek_ismemberof_lookup": "Non HERDC"
                }
            ],
            "fez_record_search_key_ismn": [],
            "fez_record_search_key_issn": [
                {
                    "rek_issn_id": 5052689,
                    "rek_issn_pid": "UQ:342708",
                    "rek_issn_xsdmf_id": null,
                    "rek_issn": "1176-7529",
                    "rek_issn_order": 1,
                    "fez_sherpa_romeo": {
                        "srm_id": 20154,
                        "srm_issn": "1176-7529",
                        "srm_journal_name": "Journal of Bioethical Inquiry",
                        "srm_journal_link": "https://v2.sherpa.ac.uk/id/publication/14858"
                    },
                    "fez_ulrichs": {
                        "ulr_issn": "1176-7529",
                        "ulr_title_id": "599458",
                        "ulr_title": "Journal of Bioethical Inquiry"
                    }
                },
                {
                    "rek_issn_id": 5052690,
                    "rek_issn_pid": "UQ:342708",
                    "rek_issn_xsdmf_id": null,
                    "rek_issn": "1872-4353",
                    "rek_issn_order": 2,
                    "fez_sherpa_romeo": {
                        "srm_id": 20155,
                        "srm_issn": "1872-4353",
                        "srm_journal_name": "Journal of Bioethical Inquiry",
                        "srm_journal_link": "https://v2.sherpa.ac.uk/id/publication/14858"
                    },
                    "fez_ulrichs": {
                        "ulr_issn": "1872-4353",
                        "ulr_title_id": "630468",
                        "ulr_title": "Journal of Bioethical Inquiry"
                    }
                }
            ],
            "fez_record_search_key_issue_number": {
                "rek_issue_number_id": 4377491,
                "rek_issue_number_pid": "UQ:342708",
                "rek_issue_number_xsdmf_id": null,
                "rek_issue_number": "2"
            },
            "fez_record_search_key_journal_name": {
                "rek_journal_name_id": 5023697,
                "rek_journal_name_pid": "UQ:342708",
                "rek_journal_name_xsdmf_id": null,
                "rek_journal_name": "Journal of Bioethical Inquiry"
            },
            "fez_record_search_key_keywords": [
                {
                    "rek_keywords_id": 30888647,
                    "rek_keywords_pid": "UQ:342708",
                    "rek_keywords_xsdmf_id": null,
                    "rek_keywords": "Health Policy",
                    "rek_keywords_order": 1
                },
                {
                    "rek_keywords_id": 30888648,
                    "rek_keywords_pid": "UQ:342708",
                    "rek_keywords_xsdmf_id": null,
                    "rek_keywords": "Health(social science)",
                    "rek_keywords_order": 2
                }
            ],
            "fez_record_search_key_language": [
                {
                    "rek_language_id": 5190088,
                    "rek_language_pid": "UQ:342708",
                    "rek_language_xsdmf_id": null,
                    "rek_language": "eng",
                    "rek_language_order": 1
                }
            ],
            "fez_record_search_key_language_of_journal_name": [],
            "fez_record_search_key_language_of_title": [],
            "fez_record_search_key_license": null,
            "fez_record_search_key_link": [],
            "fez_record_search_key_link_description": [],
            "fez_record_search_key_native_script_journal_name": null,
            "fez_record_search_key_native_script_title": null,
            "fez_record_search_key_new_doi": null,
            "fez_record_search_key_notes": null,
            "fez_record_search_key_oa_embargo_days": null,
            "fez_record_search_key_oa_notes": {
                "rek_oa_notes_id": 126321,
                "rek_oa_notes_pid": "UQ:342708",
                "rek_oa_notes_xsdmf_id": null,
                "rek_oa_notes": "Post print permissible - 12 months embargo."
            },
            "fez_record_search_key_oa_status": {
                "rek_oa_status_id": 1046931,
                "rek_oa_status_pid": "UQ:342708",
                "rek_oa_status_xsdmf_id": null,
                "rek_oa_status": 453693,
                "rek_oa_status_lookup": "DOI"
            },
            "fez_record_search_key_oa_status_type": {
                "rek_oa_status_type_id": 62365,
                "rek_oa_status_type_pid": "UQ:342708",
                "rek_oa_status_type": 454123,
                "rek_oa_status_type_lookup": "Bronze"
            },
            "fez_record_search_key_place_of_publication": {
                "rek_place_of_publication_id": 4140342,
                "rek_place_of_publication_pid": "UQ:342708",
                "rek_place_of_publication_xsdmf_id": null,
                "rek_place_of_publication": "Dordrecht, Netherlands"
            },
            "fez_record_search_key_possible_author_id": [],
            "fez_record_search_key_publisher": {
                "rek_publisher_id": 4402326,
                "rek_publisher_pid": "UQ:342708",
                "rek_publisher_xsdmf_id": null,
                "rek_publisher": "Springer Netherlands"
            },
            "fez_record_search_key_pubmed_id": null,
            "fez_record_search_key_pubmed_central_id": null,
            "fez_record_search_key_refereed": {
                "rek_refereed_id": 2673569,
                "rek_refereed_pid": "UQ:342708",
                "rek_refereed_xsdmf_id": null,
                "rek_refereed": 1
            },
            "fez_record_search_key_refereed_source": {
                "rek_refereed_source_id": 1146191,
                "rek_refereed_source_pid": "UQ:342708",
                "rek_refereed_source_xsdmf_id": null,
                "rek_refereed_source": 453635,
                "rek_refereed_source_lookup": "Ulrichs"
            },
            "fez_record_search_key_roman_script_journal_name": null,
            "fez_record_search_key_roman_script_title": null,
            "fez_record_search_key_scopus_id": {
                "rek_scopus_id_id": 2379790,
                "rek_scopus_id_pid": "UQ:342708",
                "rek_scopus_id_xsdmf_id": null,
                "rek_scopus_id": "2-s2.0-84957442577",
                "fez_scopus_citations": {
                    "sc_eid": "2-s2.0-84957442577",
                    "sc_created": "2018-05-17 02:04:49",
                    "sc_last_checked": "2024-10-30 09:28:05",
                    "sc_count": 0,
                    "sc_1d": 0,
                    "sc_2d": 0,
                    "sc_3d": 0,
                    "sc_4d": 0,
                    "sc_5d": 0,
                    "sc_6d": 0,
                    "sc_1w": 0,
                    "sc_1m": 0,
                    "sc_3m": 0,
                    "sc_6m": 0,
                    "sc_1y": 0,
                    "sc_citation_url": "https://resolver.library.uq.edu.au/openathens/redir?url=https://www.scopus.com/results/citedbyresults.uri?sort=plf-f&src=s&sot=cite&sdt=a&cite=2-s2.0-84957442577"
                }
            },
            "fez_record_search_key_security_policy": [
                {
                    "rek_security_policy_id": 565816,
                    "rek_security_policy_pid": "UQ:342708",
                    "rek_security_policy": 5,
                    "rek_security_policy_order": 1
                }
            ],
            "fez_record_search_key_sensitive_handling_note_id": null,
            "fez_record_search_key_sensitive_handling_note_other": null,
            "fez_record_search_key_start_page": {
                "rek_start_page_id": 5544476,
                "rek_start_page_pid": "UQ:342708",
                "rek_start_page_xsdmf_id": null,
                "rek_start_page": "161"
            },
            "fez_record_search_key_subject": [
                {
                    "rek_subject_id": 9709016,
                    "rek_subject_pid": "UQ:342708",
                    "rek_subject_xsdmf_id": null,
                    "rek_subject": 453527,
                    "rek_subject_order": 1,
                    "rek_subject_lookup": "3306 Health (social science)"
                },
                {
                    "rek_subject_id": 9709017,
                    "rek_subject_pid": "UQ:342708",
                    "rek_subject_xsdmf_id": null,
                    "rek_subject": 453438,
                    "rek_subject_order": 2,
                    "rek_subject_lookup": "2719 Health Policy"
                }
            ],
            "fez_record_search_key_total_pages": {
                "rek_total_pages_id": 5449442,
                "rek_total_pages_pid": "UQ:342708",
                "rek_total_pages_xsdmf_id": null,
                "rek_total_pages": "1"
            },
            "fez_record_search_key_translated_journal_name": null,
            "fez_record_search_key_translated_title": null,
            "fez_record_search_key_volume_number": {
                "rek_volume_number_id": 5081474,
                "rek_volume_number_pid": "UQ:342708",
                "rek_volume_number_xsdmf_id": null,
                "rek_volume_number": "11"
            },
            "fez_record_search_key_wok_doc_types": [],
            "fez_record_search_key_zoorec_id": null,
            "fez_matched_journals": {
                "mtj_pid": "UQ:342708",
                "mtj_jnl_id": 15897,
                "mtj_status": "A",
                "fez_journal": {
                    "jnl_jid": 15897,
                    "jnl_title": "Journal of Bioethical Inquiry",
                    "jnl_publisher": "Springer Netherlands",
                    "jnl_source_id_era": "34943",
                    "jnl_advisory_statement": null,
                    "jnl_editing_user": null,
                    "jnl_editing_start_date": null,
                    "jnl_changeable_by_external_sources": true,
                    "jnl_created_date": "2021-02-22 01:43:01",
                    "jnl_updated_date": "2021-02-22 16:00:47",
                    "fez_journal_era": [
                        {
                            "jnl_era_id": 106859,
                            "jnl_era_source_id": "34943",
                            "jnl_era_title": "Journal of Bioethical Inquiry",
                            "jnl_era_source_year": 2023
                        },
                        {
                            "jnl_era_id": 15897,
                            "jnl_era_source_id": "34943",
                            "jnl_era_title": "Journal of Bioethical Inquiry",
                            "jnl_era_source_year": 2018
                        },
                        {
                            "jnl_era_id": 39716,
                            "jnl_era_source_id": "34943",
                            "jnl_era_title": "Journal of Bioethical Inquiry",
                            "jnl_era_source_year": 2015
                        },
                        {
                            "jnl_era_id": 65393,
                            "jnl_era_source_id": "34943",
                            "jnl_era_title": "Journal of Bioethical Inquiry",
                            "jnl_era_source_year": 2012
                        },
                        {
                            "jnl_era_id": 82969,
                            "jnl_era_source_id": "34943",
                            "jnl_era_title": "Journal of Bioethical Inquiry",
                            "jnl_era_source_year": 2010
                        }
                    ]
                },
                "fezJournal": null
            },
            "fez_record_search_key_isdatasetof": [],
            "fez_record_search_key_has_related_datasets": [],
            "fez_record_search_key_has_derivations": [],
            "rek_display_type_lookup": "Journal Article",
            "rek_pubmed_doc_type_lookup": null,
            "rek_object_type_lookup": "Record",
            "rek_scopus_doc_type_lookup": "Article (original research)",
            "rek_status_lookup": "Published",
            "rek_wok_doc_type_lookup": null,
            "rek_editing_user": null,
            "rek_editing_user_lookup": null,
            "rek_editing_start_date": null,
            "fez_internal_notes": null,
            "fez_author_affiliation": [
                {
                    "af_id": 169439,
                    "af_pid": "UQ:342708",
                    "af_author_id": 710,
                    "af_percent_affiliation": 100000,
                    "af_org_id": 898,
                    "af_status": 1,
                    "fez_author": {
                        "aut_id": 710,
                        "aut_display_name": "Parker, Malcolm H."
                    },
                    "fez_org_structure": {
                        "org_id": 898,
                        "org_title": "School of Medicine"
                    }
                }
            ],
            "fez_record_search_key_audience_size": null,
            "fez_record_search_key_author_affiliation_id": [],
            "fez_record_search_key_author_affiliation_country": [
                {
                    "rek_author_affiliation_country_id": 4494077,
                    "rek_author_affiliation_country_pid": "UQ:342708",
                    "rek_author_affiliation_country_xsdmf_id": 0,
                    "rek_author_affiliation_country": "aus",
                    "rek_author_affiliation_country_order": 1
                }
            ],
            "fez_record_search_key_author_affiliation_full_address": [
                {
                    "rek_author_affiliation_full_address_id": 4454146,
                    "rek_author_affiliation_full_address_pid": "UQ:342708",
                    "rek_author_affiliation_full_address_xsdmf_id": 0,
                    "rek_author_affiliation_full_address": "St Lucia,Brisbane,QLD",
                    "rek_author_affiliation_full_address_order": 1
                }
            ],
            "fez_record_search_key_author_affiliation_name": [
                {
                    "rek_author_affiliation_name_id": 4595709,
                    "rek_author_affiliation_name_pid": "UQ:342708",
                    "rek_author_affiliation_name_xsdmf_id": 0,
                    "rek_author_affiliation_name": "School of Medicine|University of Queensland",
                    "rek_author_affiliation_name_order": 1
                }
            ],
            "fez_record_search_key_author_affiliation_type": [],
            "fez_record_search_key_content_indicator": [],
            "fez_record_search_key_creator_contribution_statement": [],
            "fez_record_search_key_grant_type": [],
            "fez_record_search_key_grant_agency_type": [],
            "fez_record_search_key_quality_indicator": [],
            "fez_record_search_key_significance": []
        },
        {
            rek_pid: 'UQ:288545',
            rek_title: 'Bacterial plaques staining composition <sup>for</sup> evaluating dental <sub>caries</sub> activity',
            rek_display_type: 185,
            rek_status: 2,
            rek_date: '2008-08-01T00:00:00Z',
            rek_object_type: 3,
            rek_depositor: 10923,
            rek_created_date: '2013-01-09T06:11:24Z',
            rek_updated_date: '2014-10-05T17:00:40Z',
            rek_genre: 'Patent',
            rek_genre_type: null,
            rek_formatted_title: null,
            rek_formatted_abstract:
                'PROBLEM TO BE SOLVED: To obtain a bacterial plaque staining composition for evaluating dental caries activity, which approximately simultaneously carries out bacterial plaque staining and dental caries activity evaluation and evaluates dental caries activity relatively accurately even in thick bacterial plaque in comparison with a conventional bacterial plaque staining composition.<br /><br />SOLUTION: The bacterial plaque staining composition for evaluating dental caries activity comprises a blue pigment that is soluble in water and does not change a color tone at pH7, a red pigment that is soluble in water at pH4.5 but not soluble in water and does not change a color tone at pH4.5 and a saccharide. The bacterial plaque staining composition comprises 1 pt.wt. of the total content of the blue pigment and the red pigment and 1-50 pts.wt. of saccharide content in the content ratio of the blue pigment to the red pigment of preferably 1:3-3:1.<br />',
            rek_depositor_affiliation: 840,
            rek_security_inherited: 1,
            rek_copyright: 'on',
            fez_record_search_key_author: [
                'Walsh, Laurence J',
                'Ota R',
                'Nagao S',
                'Sato T',
            ],
            fez_record_search_key_author_id: [471, 0, 0, 0],
            fez_record_search_key_country_of_issue: 'Japan',
            fez_record_search_key_ismemberof: ['UQ:3808'],
            fez_record_search_key_language: ['eng'],
            fez_record_search_key_patent_number: 'JP2008189575',
            fez_record_search_key_publisher: 'GC Corporation',
            fez_record_search_key_refereed_source: '453638',
            fez_record_search_key_subject: [270802, 270300, 320800],
        },
        {
            rek_pid: 'UQ:95980',
            rek_title: 'Lipid-core-peptides for vaccination.',
            rek_display_type: 130,
            rek_status: 2,
            rek_date: '2001-01-01T00:00:00Z',
            rek_object_type: 3,
            rek_created_date: '2007-08-24T00:08:15Z',
            rek_updated_date: '2014-10-05T07:33:29Z',
            rek_genre: 'Conference Paper',
            rek_subtype: 'Fully published paper',
            rek_security_inherited: 1,
            fez_record_search_key_author: [
                'Schubert, A.',
                'Olive, C.',
                'Wong, A. K.',
                'Good, M. F.',
                'Toth, I.',
                "de Crecy-Lagard, Valerie",
                "Diaz, Naryttza",
                "Disz, Terry",
                "Edwards, Robert",
                "Fonstein, Michael",
                "Frank, Ed D.",
                "Gerdes, Svetlana",
                "Glass, Elizabeth M.",
                "Goesmann, Alexander",
                "Hanson, Andrew",
                "Iwata-Reuyl, Dirk",
                "Jensen, Roy",
                "Jamshidi, Neema",
                "Krause, Lutz",
                "Kubal, Michael",
                "Larsen, Niels",
                "Linke, Burkhard",
                "McHardy, Alice C.",
                "Meyer, Folker",
                "Neuweger, Heiko",
                "Olsen, Gary",
                "Olsen, Robert",
                "Osterman, Andrei",
                "Portnoy, Vasiliy",
                "Pusch, Gordon D.",
            ],
            fez_record_search_key_author_id: [
                {
                    rek_author_id: 27856,
                },
                {
                    rek_author_id: 25707,
                },
                {
                    rek_author_id: 18932,
                },
                {
                    rek_author_id: 24216,
                },
                {
                    rek_author_id: 1475,
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 88421,
                    "author": {
                        "aut_id": 88421,
                        "aut_orcid_id": "0000-0003-3806-0845",
                        "aut_title": "Associate Professor"
                    },
                    "rek_author_id_lookup": "Lutz Krause"
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }
            ],
            fez_record_search_key_conference_dates: '30 Nov 2001',
            fez_record_search_key_conference_location: 'Univerity of Queensland, Brisbane',
            fez_record_search_key_conference_name: 'Brisbane Biological & Organic Chemistry Symposium 2001',
            fez_record_search_key_herdc_code: 450018,
            fez_record_search_key_ismemberof: ['UQ:3833'],
            fez_record_search_key_place_of_publication: 'Brisbane',
            fez_record_search_key_proceedings_title: 'Brisbane Biological & Organic Chemistry Symposium 2001',
            fez_record_search_key_refereed_source: '453638',
            fez_record_search_key_subject: [320501, 450018, 450282],
            fez_record_search_key_volume_number: '2001'
        },
        {
            rek_pid: 'UQ:433847',
            rek_title: 'A state-based vaccination register',
            rek_display_type: 179,
            rek_status: 2,
            rek_date: '1998-07-01T00:00:00Z',
            rek_object_type: 3,
            rek_depositor: 41783,
            rek_created_date: '2017-02-01T15:00:38Z',
            rek_updated_date: '2017-08-10T20:06:04Z',
            rek_genre: 'Journal Article',
            rek_subtype: 'Letter to editor, brief commentary or brief communication',
            rek_security_inherited: 1,
            fez_record_search_key_author: [ 'Selvey, LA', 'Peterson, KV'],
            fez_record_search_key_author_id: [ 3280085, 0 ],
            fez_record_search_key_end_page: '59',
            fez_record_search_key_herdc_code: 450013,
            fez_record_search_key_herdc_status: 453220,
            fez_record_search_key_institutional_status: 453225,
            fez_record_search_key_isi_loc: '000074671800020',
            fez_record_search_key_ismemberof: [ 'UQ:183940' ],
            fez_record_search_key_issn: [ '0025-729X' ],
            fez_record_search_key_issue_number: '1',
            fez_record_search_key_journal_name: {
                rek_journal_name: 'Medical Journal of Australia'
            },
            fez_record_search_key_keywords: [],
            fez_record_search_key_language: ['eng'],
            fez_record_search_key_oa_status: 453698,
            fez_record_search_key_publisher: 'AUSTRALASIAN MED PUBL CO LTD',
            fez_record_search_key_refereed_source: '453635',
            fez_record_search_key_start_page: '59',
            fez_record_search_key_total_pages: '1',
            fez_record_search_key_volume_number: '169',
        },
        {
            rek_pid: 'UQ:215681',
            rek_title: 'Rheumatic complications of influenza vaccination',
            rek_display_type: 179,
            rek_status: 2,
            rek_date: '1994-10-01T00:00:00Z',
            rek_object_type: 3,
            rek_created_date: '2010-09-07T10:01:15Z',
            rek_updated_date: '2017-09-24T01:04:27Z',
            rek_genre: 'Journal Article',
            rek_depositor_affiliation: 788,
            rek_thomson_citation_count: 20,
            rek_subtype: 'Other',
            rek_scopus_citation_count: 25,
            rek_wok_doc_type: 'N',
            rek_pubmed_doc_type: null,
            rek_security_inherited: 1,
            rek_altmetric_score: 4,
            rek_altmetric_id: 11749800,
            rek_copyright: 'on',
            fez_record_search_key_author: ['Brown, M. A.', 'Bertouch, J. V.'],
            fez_record_search_key_author_id: [3728, 0],
            fez_record_search_key_doi: '10.1111/j.1445-5994.1994.tb01760.x',
            fez_record_search_key_end_page: '573',
            fez_record_search_key_herdc_code: 450013,
            fez_record_search_key_herdc_status: 453220,
            fez_record_search_key_institutional_status: 453225,
            fez_record_search_key_isi_loc: 'A1994PP66100010',
            fez_record_search_key_ismemberof: ['UQ:3931'],
            fez_record_search_key_issn: ['0004-8291'],
            fez_record_search_key_issue_number: '5',
            fez_record_search_key_journal_name: 'Australian and New Zealand Journal of Medicine',
            fez_record_search_key_keywords: ['Immunization',],
            fez_record_search_key_language: ['eng'],
            fez_record_search_key_link: ['http://onlinelibrary.wiley.com/journal/10.1111/%28ISSN%291445-5994'],
            fez_record_search_key_link_description: ['Journal website'],
            fez_record_search_key_oa_status: 453698,
            fez_record_search_key_oa_status_type: null,
            fez_record_search_key_org_name: null,
            fez_record_search_key_org_unit_name: null,
            fez_record_search_key_original_format: null,
            fez_record_search_key_parent_publication: null,
            fez_record_search_key_patent_number: null,
            fez_record_search_key_period: [],
            fez_record_search_key_place_of_publication: 'Sydney, NSW, Australia',
            fez_record_search_key_publisher: 'Adis International',
            fez_record_search_key_refereed_source: '453634',
            fez_record_search_key_scopus_id: '2-s2.0-0028527457',
            fez_record_search_key_start_page: '572',
            fez_record_search_key_subject: [452090, 452548],
            fez_record_search_key_total_pages: '2',
            fez_record_search_key_volume_number: '24'
        },
        {
            rek_pid: 'UQ:175986',
            rek_title: 'Patient care drives mandatory vaccination',
            rek_display_type: 179,
            rek_status: 2,
            rek_date: '2008-11-01T00:00:00Z',
            rek_object_type: 3,
            rek_depositor: 1655,
            rek_created_date: '2009-04-15T16:04:56Z',
            rek_updated_date: '2017-09-24T00:38:21Z',
            rek_file_downloads: 0,
            rek_citation: '<a class="author_id_link" title="Browse by Author ID for Lambert, Stephen B." href="/list/author_id/72497/">Lambert, Stephen B.</a> (<span class="citation_date">2008</span>) <a class="citation_title" title="Click to view Journal Article: Patient care drives mandatory vaccination" href="/view/UQ:175986">Patient care drives mandatory vaccination</a>. <i><span class="citation_journal_name">British Medical Journal</span></i>, <i><span class="citation_volume_number">337</span></i> <span class="citation_issue_number">7680</span>: <span class="citation_start_page">1188</span>-<span class="citation_end_page">1188</span>. doi:<span class="citation_doi">10.1136/bmj.a2588</span>',
            rek_genre: 'Journal Article',
            rek_depositor_affiliation: 970,
            rek_thomson_citation_count: 4,
            rek_subtype: 'Article (original research)',
            rek_scopus_citation_count: 1,
            rek_scopus_doc_type: 'le',
            rek_wok_doc_type: 'L',
            rek_security_inherited: 1,
            rek_altmetric_score: 0,
            rek_altmetric_id: 0,
            rek_copyright: 'on',
            fez_record_search_key_assigned_user_id: [1655],
            fez_record_search_key_author: ['Lambert, Stephen B.'],
            fez_record_search_key_author_id: [72497],
            fez_record_search_key_contributor: ['F. Godlee'],
            fez_record_search_key_doi: '10.1136/bmj.a2588',
            fez_record_search_key_edition: null,
            fez_record_search_key_end_date: null,
            fez_record_search_key_end_page: '1188',
            fez_record_search_key_herdc_code: 450013,
            fez_record_search_key_herdc_status: 453221,
            fez_record_search_key_institutional_status: 453224,
            fez_record_search_key_isi_loc: '000262654000015',
            fez_record_search_key_ismemberof: ['UQ:138536', 'UQ:254105', 'UQ:7573'],
            fez_record_search_key_issn: ['0959-8146', '0959-535X'],
            fez_record_search_key_issue_number: '7680',
            fez_record_search_key_journal_name: 'British Medical Journal',
            fez_record_search_key_keywords: [
                'Healthcare workers',
                'Mandatory vaccination',
                'Patient care',
                'Vaccine',
            ],
            fez_record_search_key_language: ['eng'],
            fez_record_search_key_notes: 'Letters: "Mandatory flu vaccination"',
            fez_record_search_key_oa_status: 453698,
            fez_record_search_key_place_of_publication: 'London, United Kingdom',
            fez_record_search_key_publisher: 'BMJ Publishing Group',
            fez_record_search_key_refereed: 1,
            fez_record_search_key_refereed_source: '453635',
            fez_record_search_key_scopus_id: '2-s2.0-57349138348',
            fez_record_search_key_start_page: '1188',
            fez_record_search_key_subject: [450009, 451393, 451447, 452107, 452111 ],
            fez_record_search_key_total_pages: '1',
            fez_record_search_key_volume_number: '337'
        },
        {
            rek_pid: 'UQ:66e9f53',
            rek_title: 'Fluid mechanics in turbulent times: what can we learn in 2020?',
            rek_description: null,
            rek_display_type: 130,
            rek_status: 2,
            rek_date: '2020-12-11T00:00:00Z',
            rek_object_type: 3,
            rek_depositor: 41783,
            rek_created_date: '2020-11-17T04:30:51Z',
            rek_updated_date: '2020-11-18T04:47:52Z',
            rek_formatted_abstract:
                'The Proceedings of the 22nd Australasian Fluid Mechanics Conference AFMC2020 focus on many aspects of fluid mechanics and their applications, especially in terms of diversity, challenges, ecology, and public health relevant to the 21st century. The event organisation aimed to facilitate the sharing of information among biomedical, chemical, civil, environmental, mechanical, mining, nuclear and water engineers coming from different regions, universities, industries and background, including developed and developing countries, and students, young and senior professionals. After reviewing the challenges associated with fluid mechanics in terms of diversity, challenges, ecology, public health, socio-economics into the 21st century, the proceedings peer-review process is detailed. The proceedings contents are listed, as well as the AFMC2020 organisation. At the end, the reviewers are acknowledged.',
            rek_subtype: 'Fully published paper',
            rek_security_inherited: 1,
            rek_copyright: 'on',
            rek_security_policy: 1,
            fez_record_search_key_author: ['Chanson, Hubert', 'Brown, Richard', 'Kani, Michel'],
            fez_record_search_key_author_id: [
                {
                    rek_author_id: 0,
                    author: null,
                },
                {
                    rek_author_id: 0,
                    author: null,
                },
                {
                    rek_author_id: 0,
                    author: null,
                },
            ],
            fez_record_search_key_conference_dates: '7-10 December 2020',
            fez_record_search_key_conference_location: 'Brisbane, Australia',
            fez_record_search_key_conference_name: '22nd Australasian Fluid Mechanics Conference AFMC2020',
            fez_record_search_key_contributor: ['Abel, Gillian', 'Fitzgerald, Lisa', 'Healy, Catherine'],
            fez_record_search_key_contributor_id: [
                {
                    "rek_contributor_id": 0,
                }, {
                    "rek_contributor_id": 74066,
                    "rek_contributor_id_lookup": "Fitzgerald, Lisa J."
                }, {
                    "rek_contributor_id": 0,
                }
            ],
            fez_record_search_key_doi: '10.14264/66e9f53',
            fez_record_search_key_file_attachment_name: ['placeholder_2020xt.txt'],
            fez_record_search_key_herdc_code: {
                rek_herdc_code: 450014,
                rek_herdc_code_lookup: 'E1',
            },
            fez_record_search_key_herdc_status: {
                rek_herdc_status: 453220,
                rek_herdc_status_lookup: 'Provisional Code',
            },
            fez_record_search_key_isbn: ['9781742723419'],
            fez_record_search_key_ismemberof: [
                {
                    rek_ismemberof: 'UQ:ffbf03a',
                    parent: {
                        rek_pid: 'UQ:ffbf03a',
                        rek_security_policy: 1,
                        rek_datastream_policy: 0,
                    },
                    rek_ismemberof_lookup:
                        'Proceedings of the 22nd Australasian Fluid Mechanics Conference AFMC2020 (Holding collection)',
                },
            ],
            fez_record_search_key_keywords: [
                'Fluid mechanics',
                'Australasia',
                'AFMC2020',
                'Challenges',
                'Diversity',
                'Ecology',
                'Public Health',
                'Peer-review process',
                'Proceedings',
            ],
            fez_record_search_key_language: ['eng'],
            fez_record_search_key_license: {
                rek_license: 453610,
                rek_license_lookup: 'Creative Commons Attribution-NonCommercial 3.0 International (CC BY-NC 3.0)',
            },
            fez_record_search_key_notes: 'Conference paper number:E1',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453695,
                rek_oa_status_lookup: 'File (Publisher version)',
            },
            fez_record_search_key_place_of_publication: 'Brisbane, Australia',
            fez_record_search_key_proceedings_title:
                'Proceedings of the 22nd Australasian Fluid Mechanics Conference AFMC2020',
            fez_record_search_key_publisher: 'The University of Queensland',
            fez_record_search_key_security_policy: [1],
            rek_display_type_lookup: 'Conference Paper',
            rek_object_type_lookup: 'Record',
            rek_status_lookup: 'Published',
            rek_wok_doc_type_lookup: 'Abstract of Published Item',
        }
    ],
    filters: {
        facets: {
            'Scopus document type': {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 0,
                buckets: [
                    {
                        key: 'ar',
                        doc_count: 35
                    },
                    {
                        key: 're',
                        doc_count: 4
                    },
                    {
                        key: 'ed',
                        doc_count: 1
                    },
                    {
                        key: 'ip',
                        doc_count: 1
                    }
                ]
            },
            'Display type': {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 0,
                buckets: [
                    {
                        key: 179,
                        doc_count: 55
                    },
                    {
                        key: 130,
                        doc_count: 13
                    }
                ]
            },
            Keywords: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 436,
                buckets: [
                    {
                        key: 'Cell Biology',
                        doc_count: 19
                    },
                    {
                        key: 'Biochemistry & Molecular Biology',
                        doc_count: 11
                    },
                    {
                        key: 'CELL BIOLOGY',
                        doc_count: 8
                    },
                    {
                        key: '3t3-l1 Adipocytes',
                        doc_count: 7
                    },
                    {
                        key: 'Plasma-membrane',
                        doc_count: 7
                    }
                ]
            },
            'Scopus document type (lookup)': {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 0,
                buckets: []
            },
            'Subject (lookup)': {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 66,
                buckets: [
                    {
                        key: 'C1',
                        doc_count: 19
                    },
                    {
                        key: '1300 Biochemistry, Genetics and Molecular Biology',
                        doc_count: 9
                    },
                    {
                        key: '270104 Membrane Biology',
                        doc_count: 8
                    },
                    {
                        key: '780105 Biological sciences',
                        doc_count: 8
                    },
                    {
                        key: '2700 Medicine',
                        doc_count: 7
                    }
                ]
            },
            'Collection (lookup)': {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 61,
                buckets: [
                    {
                        key: 'Institute for Molecular Bioscience - Publications',
                        doc_count: 31
                    },
                    {
                        key: 'Queensland Brain Institute Publications',
                        doc_count: 18
                    },
                    {
                        key: 'ResearcherID Downloads - Archived',
                        doc_count: 17
                    },
                    {
                        key: 'Excellence in Research Australia (ERA) - Collection',
                        doc_count: 12
                    },
                    {
                        key: 'Australian Institute for Bioengineering and Nanotechnology Publications',
                        doc_count: 8
                    }
                ]
            },
            'Year published': {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 45,
                buckets: [
                    {
                        key: '1994',
                        doc_count: 5
                    },
                    {
                        key: '2012',
                        doc_count: 5
                    },
                    {
                        key: '2013',
                        doc_count: 5
                    },
                    {
                        key: '1998',
                        doc_count: 4
                    },
                    {
                        key: '2000',
                        doc_count: 4
                    }
                ]
            },
            'Author (lookup)': {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 185,
                buckets: [
                    {
                        key: 'Martin, Sally',
                        doc_count: 68
                    },
                    {
                        key: 'Parton, Robert G.',
                        doc_count: 22
                    },
                    {
                        key: 'Meunier, Frederic A.',
                        doc_count: 13
                    },
                    {
                        key: 'Andreas Papadopulos',
                        doc_count: 9
                    },
                    {
                        key: 'Rachel Sarah Gormal',
                        doc_count: 8
                    }
                ]
            },
            Subject: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 66,
                buckets: [
                    {
                        key: 450009,
                        doc_count: 19
                    },
                    {
                        key: 453239,
                        doc_count: 9
                    },
                    {
                        key: 270104,
                        doc_count: 8
                    },
                    {
                        key: 450774,
                        doc_count: 8
                    },
                    {
                        key: 453253,
                        doc_count: 7
                    }
                ]
            },
            'Journal name': {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 44,
                buckets: [
                    {
                        key: 'Journal of Biological Chemistry',
                        doc_count: 5
                    },
                    {
                        key: 'Molecular Biology of The Cell',
                        doc_count: 5
                    },
                    {
                        key: 'Molecular Biology of the Cell',
                        doc_count: 5
                    },
                    {
                        key: 'Biochemical Journal',
                        doc_count: 4
                    },
                    {
                        key: 'Journal of Cell Biology',
                        doc_count: 4
                    }
                ]
            },
            Collection: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 61,
                buckets: [
                    {
                        key: 'UQ:3858',
                        doc_count: 31
                    },
                    {
                        key: 'UQ:23912',
                        doc_count: 18
                    },
                    {
                        key: 'UQ:682195',
                        doc_count: 17
                    },
                    {
                        key: 'UQ:152266',
                        doc_count: 12
                    },
                    {
                        key: 'UQ:3860',
                        doc_count: 8
                    }
                ]
            },
            Author: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 185,
                buckets: [
                    {
                        key: 745,
                        doc_count: 68
                    },
                    {
                        key: 824,
                        doc_count: 22
                    },
                    {
                        key: 2746,
                        doc_count: 13
                    },
                    {
                        key: 89985,
                        doc_count: 9
                    },
                    {
                        key: 10992,
                        doc_count: 8
                    }
                ]
            },
            Genre: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 5,
                buckets: [
                    {
                        key: 'Article (original research)',
                        doc_count: 49
                    },
                    {
                        key: 'Molecular Biology of the Cell',
                        doc_count: 5
                    },
                    {
                        key: 'Review of research - research literature review (NOT book review',
                        doc_count: 4
                    },
                    {
                        key: 'Biochemical Society Transactions',
                        doc_count: 1
                    },
                    {
                        key: 'Chemistry and Physics of Lipids',
                        doc_count: 1
                    }
                ]
            },
            Subtype: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 2,
                buckets: [
                    {
                        key: 'Article (original research)',
                        doc_count: 50
                    },
                    {
                        key: 'Published abstract',
                        doc_count: 9
                    },
                    {
                        key: 'Critical review of research, literature review, critical commentary',
                        doc_count: 3
                    },
                    {
                        key: 'Fully published paper',
                        doc_count: 2
                    },
                    {
                        key: 'Editorial',
                        doc_count: 1
                    }
                ]
            },
            'Display type (lookup)': {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 0,
                buckets: [
                    {
                        key: 'Journal Article',
                        doc_count: 55
                    },
                    {
                        key: 'Conference Paper',
                        doc_count: 13
                    }
                ]
            }
        }
    }
};
export default hydrateMockSearchList(internalTitleSearchList);