import { hydrateMockSearchList } from '../../../helpers/general';

const publicationTypeListJournal = {
    "total": 2,
    "took": 1,
    "per_page": 999,
    "current_page": 1,
    "from": 1,
    "to": 2,
    "data": [
        {
            "rek_pid": "UQ:175806",
            "rek_title": "Australian Archaeology",
            "rek_display_type": 294,
            "rek_status": 2,
            "rek_date": "2008-12-01T00:00:00Z",
            "rek_object_type": 3,
            "rek_depositor": 1741,
            "rek_created_date": "2009-04-15T11:16:53Z",
            "rek_updated_date": "2019-08-03T02:00:03Z",
            "rek_genre": "Journal",
            "rek_depositor_affiliation": 877,
            "rek_security_inherited": 1,
            "rek_copyright": "on",
            "rek_security_policy": 1,
            "fez_record_search_key_assigned_user_id": [1741],
            "fez_record_search_key_contributor": ["Sean G. F. Ulm", "Annie Ross"],
            "fez_record_search_key_contributor_id": [{
                "rek_contributor_id": 187,
                "rek_contributor_id_lookup": "Ulm, Sean G.F."
            }, {
                "rek_contributor_id": 641,
                "rek_contributor_id_lookup": "Ross, Anne C."
            }],
            "fez_record_search_key_end_page": "124",
            "fez_record_search_key_isbn": ["9780958922135"],
            "fez_record_search_key_ismemberof": [{
                "rek_ismemberof": "UQ:11398",
                "parent": {
                    "rek_pid": "UQ:11398",
                    "rek_security_policy": 1,
                    "rek_datastream_policy": 5
                },
                "rek_ismemberof_lookup": "Aboriginal and Torres Strait Islander Studies Unit Publications"
            }, {
                "rek_ismemberof": "UQ:3854",
                "parent": {
                    "rek_pid": "UQ:3854",
                    "rek_security_policy": 5,
                    "rek_datastream_policy": 5
                },
                "rek_ismemberof_lookup": "School of Social Science Publications"
            }, {
                "rek_ismemberof": "UQ:240731",
                "parent": {
                    "rek_pid": "UQ:240731",
                    "rek_security_policy": 5,
                    "rek_datastream_policy": 5
                },
                "rek_ismemberof_lookup": "School of Agriculture and Food Sciences"
            }],
            "fez_record_search_key_issn": [{
                "rek_issn": "0312-2417",
                "fez_journal_issns": [{
                    "jni_id": 31495,
                    "jni_jnl_id": 19216,
                    "jni_issn": "0312-2417",
                    "jni_issn_order": 1,
                    "fez_journal": {
                        "jnl_id": 19216,
                        "jnl_journal_name": "Australian Archaeology",
                        "jnl_era_id": 7963,
                        "jnl_era_year": 2010,
                        "jnl_created_date": "2010-11-19 00:00:00",
                        "jnl_updated_date": "2010-11-19 00:00:00",
                        "jnl_rank": "A",
                        "jnl_foreign_name": null
                    }
                }, {
                    "jni_id": 44014,
                    "jni_jnl_id": 26435,
                    "jni_issn": "0312-2417",
                    "jni_issn_order": 1,
                    "fez_journal": {
                        "jnl_id": 26435,
                        "jnl_journal_name": "Australian Archaeology",
                        "jnl_era_id": 7963,
                        "jnl_era_year": 2012,
                        "jnl_created_date": "2011-10-28 00:00:00",
                        "jnl_updated_date": "2011-10-28 00:00:00",
                        "jnl_rank": null,
                        "jnl_foreign_name": ""
                    }
                }, {
                    "jni_id": 107605,
                    "jni_jnl_id": 65665,
                    "jni_issn": "0312-2417",
                    "jni_issn_order": 1,
                    "fez_journal": {
                        "jnl_id": 65665,
                        "jnl_journal_name": "Australian Archaeology",
                        "jnl_era_id": 7963,
                        "jnl_era_year": 2015,
                        "jnl_created_date": "2014-07-16 00:00:00",
                        "jnl_updated_date": "2014-07-16 00:00:00",
                        "jnl_rank": null,
                        "jnl_foreign_name": ""
                    }
                }, {
                    "jni_id": 159497,
                    "jni_jnl_id": 96785,
                    "jni_issn": "0312-2417",
                    "jni_issn_order": 1,
                    "fez_journal": {
                        "jnl_id": 96785,
                        "jnl_journal_name": "Australian Archaeology",
                        "jnl_era_id": 7963,
                        "jnl_era_year": 2018,
                        "jnl_created_date": "2017-09-06 00:00:00",
                        "jnl_updated_date": "2017-09-06 00:00:00",
                        "jnl_rank": null,
                        "jnl_foreign_name": ""
                    }
                }],
                "fez_sherpa_romeo": {
                    "srm_id": 32188,
                    "srm_issn": "0312-2417",
                    "srm_journal_name": "Australian Archaeology",
                    "srm_journal_link": null,
                    "srm_colour": "green"
                },
                "rek_issn_lookup": ""
            }],
            "fez_record_search_key_issue_number": "4",
            "fez_record_search_key_language": ["eng"],
            "fez_record_search_key_license": {
                "rek_license": 453701,
                "rek_license_lookup": "Permitted Re-use with Acknowledgement"
            },
            "fez_record_search_key_oa_status": {
                "rek_oa_status": 453692,
                "rek_oa_status_lookup": "Not yet assessed"
            },
            "fez_record_search_key_place_of_publication": "St Lucia, QLD, Australia",
            "fez_record_search_key_publisher": "Australian Archaeological Association",
            "fez_record_search_key_refereed_source": {
                "rek_refereed_source": "453635",
                "rek_refereed_source_lookup": "Ulrichs"
            },
            "fez_record_search_key_start_page": "1",
            "fez_record_search_key_subject": [{
                "rek_subject": 450012,
                "rek_subject_lookup": "C5"
            }, {
                "rek_subject": 451586,
                "rek_subject_lookup": "950503 Understanding Australia's Past"
            }, {
                "rek_subject": 451615,
                "rek_subject_lookup": "970121 Expanding Knowledge in History and Archaeology"
            }, {
                "rek_subject": 453131,
                "rek_subject_lookup": "210101 Aboriginal and Torres Strait Islander Archaeology"
            }, {
                "rek_subject": 453134,
                "rek_subject_lookup": "210104 Archaeology of Australia (excl. Aboriginal and Torres Strait Islander)"
            }],
            "fez_record_search_key_total_pages": "124",
            "fez_record_search_key_volume_number": "67",
            "fez_record_search_key_doi": {
                "rek_doi":"10.14264/175806",
                "fez_altmetric":null
            },
            "rek_display_type_lookup": "Journal",
            "rek_object_type_lookup": "Record",
            "rek_status_lookup": "Published",
        },
        {
            "rek_pid": "UQ:320299",
            "rek_title": "Zeitschrift fuer Personalforschung",
            "rek_display_type": 294,
            "rek_status": 2,
            "rek_date": "2013-01-01T00:00:00Z",
            "rek_object_type": 3,
            "rek_depositor": 8524,
            "rek_created_date": "2014-01-05T00:03:55Z",
            "rek_updated_date": "2019-02-22T13:18:32Z",
            "rek_genre": "Journal",
            "rek_depositor_affiliation": 855,
            "rek_wok_doc_type": "E",
            "rek_security_inherited": 1,
            "rek_copyright": "on",
            "rek_security_policy": 1,
            "fez_record_search_key_contributor": ["J\u00fcrgen Wegge", "Meir Shemla", "Alex Haslam"],
            "fez_record_search_key_contributor_id": [{
                "rek_contributor_id": 0,
            }, {
                "rek_contributor_id": 0,
            }, {
                "rek_contributor_id": 87184,
                "rek_contributor_id_lookup": "Haslam, S. Alexander"
            }],
            "fez_record_search_key_herdc_code": {
                "rek_herdc_code": 450013,
                "rek_herdc_code_lookup": "CX"
            },
            "fez_record_search_key_herdc_status": {
                "rek_herdc_status": 453220,
                "rek_herdc_status_lookup": "Provisional Code"
            },
            "fez_record_search_key_institutional_status": {
                "rek_institutional_status": 453223,
                "rek_institutional_status_lookup": "UQ"
            },
            "fez_record_search_key_isi_loc": {
                "rek_isi_loc": "000328156000001",
                "fez_thomson_citations": {
                    "tc_isi_loc": "000328156000001",
                    "tc_created": "1526525233",
                    "tc_last_checked": "1564481895",
                    "tc_count": 0,
                    "tc_1d": 0,
                    "tc_2d": 0,
                    "tc_3d": 0,
                    "tc_4d": 0,
                    "tc_5d": 0,
                    "tc_6d": 0,
                    "tc_1w": 0,
                    "tc_1m": 0,
                    "tc_3m": 0,
                    "tc_6m": 0,
                    "tc_1y": 0,
                    "tc_citation_url": "https:\/\/go.openathens.net\/redirector\/uq.edu.au?url=https%3A%2F%2Fgateway.isiknowledge.com%2Fgateway%2FGateway.cgi%3FGWVersion%3D2%26SrcApp%3Dresolve1%26DestLinkType%3DCitingArticles%26DestApp%3DWOS_CPL%26SrcAuth%3Duqueensland%26KeyUT%3D000328156000001"
                }
            },
            "fez_record_search_key_ismemberof": [{
                "rek_ismemberof": "UQ:3852",
                "parent": {
                    "rek_pid": "UQ:3852",
                    "rek_security_policy": 5,
                    "rek_datastream_policy": 5
                },
                "rek_ismemberof_lookup": "School of Psychology Publications"
            }],
            "fez_record_search_key_issn": [{
                "rek_issn": "0179-6437",
                "fez_journal_issns": [],
                "fez_sherpa_romeo": {
                    "srm_id": 3305225,
                    "srm_issn": "0179-6437",
                    "srm_journal_name": "Zeitschrift f\u00fcr Personalforschung",
                    "srm_journal_link": "http://example.com"
                },
                "rek_issn_lookup": ""
            }, {
                "rek_issn": "1862-0000",
                "fez_journal_issns": [],
                "fez_sherpa_romeo": {
                    "srm_id": 4211829,
                    "srm_issn": "1862-0000",
                    "srm_journal_name": "Zeitschrift f\u00fcr Personalforschung",
                    "srm_journal_link": "http://example.com"
                },
                "rek_issn_lookup": ""
            }],
            "fez_record_search_key_issue_number": "4",
            "fez_record_search_key_language": ["ger", "eng"],
            "fez_record_search_key_license": {
                "rek_license": 454104,
                "rek_license_lookup": "Permitted Re-Use with Commercial Use Restriction"
            },
            "fez_record_search_key_notes": "Special Issue: \"Health Promotion through Leadership\".",
            "fez_record_search_key_oa_status": {
                "rek_oa_status": 453692,
                "rek_oa_status_lookup": "Not yet assessed"
            },
            "fez_record_search_key_place_of_publication": "Mering, Germany",
            "fez_record_search_key_publisher": "Rainer Hampp Verlag",
            "fez_record_search_key_refereed_source": {
                "rek_refereed_source": "453635",
                "rek_refereed_source_lookup": "Ulrichs"
            },
            "fez_record_search_key_translated_title": "German Journal of Research in Human Resource Management",
            "fez_record_search_key_volume_number": "27",
            "rek_display_type_lookup": "Journal",
            "rek_object_type_lookup": "Record",
            "rek_status_lookup": "Published",
        }
    ]
}
export default hydrateMockSearchList(publicationTypeListJournal);
