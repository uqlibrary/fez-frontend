import { hydrateMockSearchList } from '../../../helpers/general';

const publicationTypeListSeminarPaper = {
    "total": 1,
    "took": 1,
    "per_page": 999,
    "current_page": 1,
    "from": 1,
    "to": 1,
    "data": [
        {
            "rek_pid": "UQ:311752",
            "rek_title": "Group 7 Workshop Presentation. Bridge to bridge, ridge to river: an urban design workshop. Outcomes and key recommendations",
            "rek_description": "<b>Key Recommendations</b> <br> • A pedestrian focussed street network with regular city blocks. <br> • streets to connect the high ground on George Street to the river’s edge and Brisbane Square through to the Goodwill Bridge. <br> • Respect the enhance the heritage quality. Use a development framework (requirements for podiums, a restricted material palette and carefully managed building heights, etc) to achieve these aims. <br> • Use ferry terminals as key waterfront activators within the precinct. <br> • Activate the spaces under REX with temporary leisure (fitness) and startup business opportunities. <br> • Linear park under REX in the medium term with physical connections to river between the Victoria and Goodwill Bridges. <br> • Lessen the impact of buses - remove bus standing and service street functions from precinct to consolidate first aims. <br> • Investigate long term strategy for REX to allow unimpeded connection to river (eg cross river connections rather than along river solution). <br> • New grade separated pedestrian connection across Victoria Bridge linking Cultural Centre arts plaza above bus station level to a new “peoples’ amphitheatre at Reddacliffe Place designed to both facilitate and conceal bus movements.",
            "rek_display_type": 189,
            "rek_status": 2,
            "rek_date": "2013-08-05T00:00:00Z",
            "rek_object_type": 3,
            "rek_depositor": 298,
            "rek_created_date": "2013-10-08T09:46:16Z",
            "rek_updated_date": "2019-02-22T13:18:32Z",
            "rek_genre": "Seminar Paper",
            "rek_depositor_affiliation": 888,
            "rek_security_inherited": 1,
            "rek_copyright": "on",
            "rek_security_policy": 1,
            "fez_record_search_key_author": [
                "Skinner, Peter R.",
                "Thompson, Shane",
                "Loneragan, John",
                "Bouman, Oscar",
                "Clausen, Nathan",
                "Cloake, Des",
                "Edson, Naomi",
                "Henma, Murray",
                "Kennedy, Morgan",
                "McKeown, Mike",
                "Zietsman, Milton",
            ],
            "fez_record_search_key_author_id": [
                {
                    "rek_author_id": 146,
                    "rek_author_id_lookup": "Skinner, Peter R."
                },
                {
                    "rek_author_id": 0,
                },
                {
                    "rek_author_id": 0,
                },
                {
                    "rek_author_id": 0,
                },
                {
                    "rek_author_id": 0,
                },
                {
                    "rek_author_id": 0,
                },
                {
                    "rek_author_id": 96226,
                    "rek_author_id_lookup": "Naomi Edson"
                },
                {
                    "rek_author_id": 0,
                },
                {
                    "rek_author_id": 0,
                },
                {
                    "rek_author_id": 0,
                },
                {
                    "rek_author_id": 0,
                }
            ],
            "fez_record_search_key_contributor": [
                "Linda Cupitt",
                "Peter Edwards",
                "Caroline Stalker",
                "Leigh Shutter",
                "John Lonergan",
            ],
            "fez_record_search_key_contributor_id": [0, 0, 0, 0, 0],
            "fez_record_search_key_file_attachment_name": ["UQ311752.pdf", "presmd_UQ311752.xml"],
            "fez_record_search_key_ismemberof": [
                {
                    "rek_ismemberof": "UQ:3804",
                    "parent": {
                        "rek_pid": "UQ:3804",
                        "rek_security_policy": 5,
                        "rek_datastream_policy": 5
                    },
                    "rek_ismemberof_lookup": "School of Architecture Publications"
                }
            ],
            "fez_record_search_key_language": ["eng"],
            "fez_record_search_key_license": {
                "rek_license": 454104,
                "rek_license_lookup": "Permitted Re-Use with Commercial Use Restriction"
            },
            "fez_record_search_key_location": ["Brisbane, QLD, Australia"],
            "fez_record_search_key_org_name": "UDAL, BDA, GU, AIA, UQ, QUT, Architectus",
            "fez_record_search_key_org_unit_name": "Urban Design Alliance of Queensland",
            "fez_record_search_key_publisher": "Urban Design Alliance of Queensland",
            "fez_record_search_key_refereed_source": {
                "rek_refereed_source": "453638",
                "rek_refereed_source_lookup": "Not yet assessed"
            },
            "fez_record_search_key_series": "Bridge to Bridge; Ridge to River: An Urban Design Workshop",
            "fez_record_search_key_subject": [
                {
                    "rek_subject_order": 1,
                    "rek_subject_lookup": "310101 Architecture"
                }
            ],
            "fez_datastream_info": [
                {
                    "dsi_pid": "UQ:311752",
                    "dsi_dsid": "presmd_UQ311752.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "",
                    "dsi_mimetype": "application/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 1248,
                    "dsi_security_policy": 1,
                    "dsi_security_inherited": 0
                },
                {
                    "dsi_pid": "UQ:311752",
                    "dsi_dsid": "UQ311752.pdf",
                    "dsi_embargo_date": null,
                    "dsi_open_access": 0,
                    "dsi_label": "HERDC evidence - not publicly available",
                    "dsi_mimetype": "application/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 7868733,
                    "dsi_security_policy": 1,
                    "dsi_security_inherited": 0
                }
            ],
            "rek_display_type_lookup": "Seminar Paper",
            "rek_object_type_lookup": "Record",
            "rek_status_lookup": "Published",
        },
    ]
}
export default hydrateMockSearchList(publicationTypeListSeminarPaper);
