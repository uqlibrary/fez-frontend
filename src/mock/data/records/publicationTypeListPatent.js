import { hydrateMockSearchList } from '../../../helpers/general';

const publicationTypeListPatent = {
    "total": 1,
    "took": 1,
    "per_page": 999,
    "current_page": 1,
    "from": 1,
    "to": 1,
    "data": [
        {
            "rek_pid": "UQ:324188",
            "rek_title": "Immunogenic compositions and methods therefor",
            "rek_display_type": 185,
            "rek_status": 2,
            "rek_date": "2013-02-14T00:00:00Z",
            "rek_object_type": 3,
            "rek_depositor": 9148,
            "rek_created_date": "2014-02-26T13:32:41Z",
            "rek_updated_date": "2019-02-22T13:18:32Z",
            "rek_genre": "Patent",
            "rek_formatted_abstract": "&nbsp;The present invention provides compositions relating to viral capsomeres which comprise foreign immunogenic sequences for use in pharmaceutical compositions and methods of producing such compositions, and related isolated or purified protein and nucleic acid molecules, vectors, host cells, compositions, and methods of use to augment an immune response, immunise an animal and prophylactically or therapeutically treat a disease, disorder or condition. The viral capsomere may be derived from a polyomavirus and comprise an immunogen of interest at the N-terminus and further at the C-terminus and/or at one or more exposed loops of the capsomere.",
            "rek_depositor_affiliation": 1015,
            "rek_security_inherited": 1,
            "rek_copyright": "on",
            "rek_security_policy": 1,
            "fez_record_search_key_assigned_group_id": [],
            "fez_record_search_key_assigned_user_id": [],
            "fez_record_search_key_author": ["Middelberg, Anton P. J.", "Lua, Linda H. L"],
            "fez_record_search_key_author_id": [
                {
                    "rek_author_id": 2797,
                    "rek_author_id_lookup": "Middelberg, Anton P.J."
                },
                {
                    "rek_author_id": 6948,
                    "rek_author_id_lookup": "Linda Lua"
                }
            ],
            "fez_record_search_key_country_of_issue": "Australia",
            "fez_record_search_key_date_available": "2013-01-01T00:00:00Z",
            "fez_record_search_key_institutional_status": {
                "rek_institutional_status": 453223,
                "rek_institutional_status_lookup": "UQ"
            },
            "fez_record_search_key_ismemberof": [
                {
                    "rek_ismemberof": "UQ:3860",
                    "parent": {
                        "rek_pid": "UQ:3860",
                        "rek_security_policy": 5,
                        "rek_datastream_policy": 5
                    },
                    "rek_ismemberof_lookup": "Australian Institute for Bioengineering and Nanotechnology Publications"
                }
            ],
            "fez_record_search_key_language": ["eng"],
            "fez_record_search_key_license": {
                "rek_license": 454104,
                "rek_license_lookup": "Permitted Re-Use with Commercial Use Restriction"
            },
            "fez_record_search_key_patent_number": "WO2013020183 A1",
            "fez_record_search_key_publisher": "The University of Queensland",
            "fez_record_search_key_refereed_source": {
                "rek_refereed_source": "453638",
                "rek_refereed_source_lookup": "Not yet assessed"
            },
            "rek_display_type_lookup": "Patent",
            "rek_object_type_lookup": "Record",
            "rek_status_lookup": "Published",
        },
    ]
}
export default hydrateMockSearchList(publicationTypeListPatent);
