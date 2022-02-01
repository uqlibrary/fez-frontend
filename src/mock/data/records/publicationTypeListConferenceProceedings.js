import { hydrateMockSearchList } from '../../../helpers/general';

const publicationTypeListConferenceProceedings = {
    "total": 2,
    "took": 1,
    "per_page": 999,
    "current_page": 1,
    "from": 1,
    "to": 2,
    "data": [
        {
            "rek_pid": "UQ:242447",
            "rek_title": "Cooperative learning: Pedagogy, policy and practice",
            "rek_display_type": 197,
            "rek_status": 2,
            "rek_date": "2010-01-01T00:00:00Z",
            "rek_object_type": 3,
            "rek_depositor": 11315,
            "rek_created_date": "2011-06-17T14:08:17Z",
            "rek_updated_date": "2019-02-22T13:18:32Z",
            "rek_file_downloads": 227,
            "rek_genre": "Conference Proceedings",
            "rek_depositor_affiliation": 854,
            "rek_security_inherited": 1,
            "rek_copyright": "on",
            "rek_security_policy": 1,
            "fez_record_search_key_conference_dates": "25-27 November 2010",
            "fez_record_search_key_conference_location": "Brisbane, Australia",
            "fez_record_search_key_conference_name": "The International Association for the Study of Cooperation in Education (IASCE) 2010",
            "fez_record_search_key_file_attachment_name": ["IASCE2010.pdf", "presmd_IASCE2010.xml"],
            "fez_record_search_key_isbn": ["9781742720241"],
            "fez_record_search_key_ismemberof": [
                {
                    "rek_ismemberof": "UQ:3856",
                    "parent": {
                        "rek_pid": "UQ:3856",
                        "rek_security_policy": 5,
                        "rek_datastream_policy": 5
                    },
                    "rek_ismemberof_lookup": "School of Education Publications"
                }
            ],
            "fez_record_search_key_language": ["eng"],
            "fez_record_search_key_license": {
                "rek_license": 453609,
                "rek_license_lookup": "Creative Commons Attribution-NoDerivatives 3.0 International (CC BY-ND 3.0)"
            },
            "fez_record_search_key_refereed_source": {
                "rek_refereed_source": "453638",
                "rek_refereed_source_lookup": "Not yet assessed"
            },
            "fez_record_search_key_total_pages": "5",
            "fez_datastream_info": [
                {
                    "dsi_pid": "UQ:242447",
                    "dsi_dsid": "IASCE2010.pdf",
                    "dsi_embargo_date": null,
                    "dsi_open_access": 1,
                    "dsi_label": "IASCE 2010 Proceedings contents",
                    "dsi_mimetype": "application/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 169082,
                    "dsi_security_policy": 5,
                    "dsi_security_inherited": 1
                },
                {
                    "dsi_pid": "UQ:242447",
                    "dsi_dsid": "presmd_IASCE2010.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "",
                    "dsi_mimetype": "application/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 20516,
                    "dsi_security_policy": 1,
                    "dsi_security_inherited": 0
                }
            ],
            "rek_display_type_lookup": "Conference Proceedings",
            "rek_object_type_lookup": "Record",
            "rek_status_lookup": "Published",
            "fez_record_search_key_security_policy": [5]
        },
    ],
}
export default hydrateMockSearchList(publicationTypeListConferenceProceedings);
