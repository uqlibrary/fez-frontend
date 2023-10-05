import { hydrateMockSearchList } from '../../../helpers/general';

const publicationTypeListGenericDocument = {
    "total": 1,
    "took": 1,
    "per_page": 999,
    "current_page": 1,
    "from": 1,
    "to": 1,
    "data": [
        {
            "rek_pid": "UQ:151480",
            "rek_title": "Minutes Project Team Meetings",
            "rek_description": null,
            "rek_display_type": 202,
            "rek_status": 2,
            "rek_date": "2008-06-19T00:00:00Z",
            "rek_object_type": 3,
            "rek_depositor": 2101,
            "rek_created_date": "2008-06-19T16:00:09Z",
            "rek_updated_date": "2019-02-24T13:43:01Z",
            "rek_file_downloads": 78,
            "rek_citation": "",
            "rek_genre": "Generic Document",
            "rek_genre_type": null,
            "rek_formatted_title": null,
            "rek_formatted_abstract": null,
            "rek_depositor_affiliation": null,
            "rek_thomson_citation_count": null,
            "rek_subtype": null,
            "rek_scopus_citation_count": null,
                "rek_scopus_doc_type": null,
            "rek_wok_doc_type": null,
            "rek_pubmed_doc_type": null,
            "rek_security_inherited": 1,
            "rek_altmetric_score": null,
            "rek_altmetric_id": null,
            "rek_copyright": "on",
            "rek_security_policy": 1,
            "rek_datastream_policy": null,
            "fez_record_search_key_ismemberof": [
                {
                    "rek_ismemberof": "UQ:151282",
                    "parent": {
                        "rek_pid": "UQ:151282",
                        "rek_security_policy": 5,
                        "rek_datastream_policy": 5
                    },
                    "rek_ismemberof_lookup": "A National Entomology Curriculum for Australia Project (A project funded by the Carrick Institute)"
                }
            ],
            "fez_record_search_key_keywords": ["University of Queensland. Library", "University of Queensland. Library -- Exhibitions"],
            "fez_record_search_key_license": {
                "rek_license": 454104,
                "rek_license_lookup": "Permitted Re-Use with Commercial Use Restriction"
            },
            "fez_record_search_key_oa_status": {
                "rek_oa_status": 453698,
                "rek_oa_status_lookup": "Not Open Access"
            },
            "fez_record_search_key_notes": "https://brisbanepowerhouse.org/events/2017/07/07/joh-for-pm/",
            "fez_datastream_info": [
                {
                    "dsi_pid": "UQ:151480",
                    "dsi_dsid": "FezACML_UQ_151480.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "FezACML security for PID - UQ:151480",
                    "dsi_mimetype": "text/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 3639,
                    "dsi_security_policy": 1,
                    "dsi_security_inherited": 0
                },
                {
                    "dsi_pid": "UQ:151480",
                    "dsi_dsid": "Minutes17April.doc",
                    "dsi_embargo_date": null,
                    "dsi_open_access": 1,
                    "dsi_label": "Minutes17April.doc",
                    "dsi_mimetype": "application/msword",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 89600,
                    "dsi_security_policy": 5,
                    "dsi_security_inherited": 1
                },
                {
                    "dsi_pid": "UQ:151480",
                    "dsi_dsid": "Minutes26May.doc",
                    "dsi_embargo_date": null,
                    "dsi_open_access": 1,
                    "dsi_label": "Minutes26May.doc",
                    "dsi_mimetype": "application/msword",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 36352,
                    "dsi_security_policy": 5,
                    "dsi_security_inherited": 1
                },
                {
                    "dsi_pid": "UQ:151480",
                    "dsi_dsid": "Minutes30June.doc",
                    "dsi_embargo_date": null,
                    "dsi_open_access": 1,
                    "dsi_label": "Minutes30June.doc",
                    "dsi_mimetype": "application/msword",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 61952,
                    "dsi_security_policy": 5,
                    "dsi_security_inherited": 1
                },
                {
                    "dsi_pid": "UQ:151480",
                    "dsi_dsid": "presmd_Minutes17April.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "",
                    "dsi_mimetype": "application/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 690,
                    "dsi_security_policy": 1,
                    "dsi_security_inherited": 0
                },
                {
                    "dsi_pid": "UQ:151480",
                    "dsi_dsid": "presmd_Minutes26May.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "",
                    "dsi_mimetype": "application/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 527,
                    "dsi_security_policy": 1,
                    "dsi_security_inherited": 0
                },
                {
                    "dsi_pid": "UQ:151480",
                    "dsi_dsid": "presmd_Minutes30June.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "",
                    "dsi_mimetype": "application/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 528,
                    "dsi_security_policy": 1,
                    "dsi_security_inherited": 0
                }
            ],
            "fez_matched_journals": null,
            "rek_display_type_lookup": "Generic Document",
            "rek_pubmed_doc_type_lookup": null,
            "rek_object_type_lookup": "Record",
            "rek_scopus_doc_type_lookup": null,
            "rek_status_lookup": "Published",
            "rek_wok_doc_type_lookup": null
        }
    ]
}
export default hydrateMockSearchList(publicationTypeListGenericDocument);
