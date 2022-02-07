import { hydrateMockSearchList } from '../../../helpers/general';

const publicationTypeListReferenceEntry = {
    "total": 1,
    "took": 1,
    "per_page": 999,
    "current_page": 1,
    "from": 1,
    "to": 1,
    "data": [
        {
            "rek_pid": "UQ:191549",
            "rek_title": "Australia",
            "rek_display_type": 272,
            "rek_status": 2,
            "rek_date": "2009-01-01T00:00:00Z",
            "rek_object_type": 3,
            "rek_depositor": 7974,
            "rek_created_date": "2010-01-07T09:49:20Z",
            "rek_updated_date": "2020-03-09T05:48:35Z",
            "rek_file_downloads": 0,
            "rek_citation": "<a class=\"author_id_link\" title=\"Browse by Author ID for Hall, W. D.\" href=\"/list/author_id/1968/\">Hall, W. D.</a> and <a class=\"author_id_link\" title=\"Browse by Author ID for Gartner, C. E.\" href=\"/list/author_id/5852/\">Gartner, C. E.</a> (<span class=\"citation_date\">2009</span>) <a class=\"citation_title\" title=\"Click to view Reference Entry: Australia\" href=\"/view/UQ:191549\">Australia</a> in <span class=\"citation_contributor\"><span class=\"citation_contributor\">Pamela Korsmeyer</span> and <span class=\"citation_contributor\">Henry R. Kranzler</span></span> (eds.) <i><span class=\"citation_parent_publication\">Encyclopedia of drugs, alcohol &amp; addictive behavior</span></i>. <span class=\"citation_edition\">3rd</span> <span class=\"citation_place_of_publication\">Detroit, MI, U.S.</span>: <span class=\"citation_publisher\">Macmillan Reference</span>",
            "rek_genre": "Reference Entry",
            "rek_depositor_affiliation": 839,
            "rek_security_inherited": 1,
            "rek_copyright": "on",
            "rek_security_policy": 1,
            "fez_record_search_key_assigned_group_id": [],
            "fez_record_search_key_assigned_user_id": [],
            "fez_record_search_key_author": ["Hall, W. D.", "Gartner, C. E."],
            "fez_record_search_key_author_id": [
                {
                    "rek_author_id": 1968,
                    "author": {
                        "aut_org_username": "uqwhall",
                        "aut_student_username": null,
                        "aut_id": 1968,
                        "aut_orcid_id": "0000-0003-1984-0096",
                        "aut_people_australia_id": "",
                        "aut_title": "Professor"
                    },
                    "rek_author_id_lookup": "Hall, Wayne Denis (UQCCR)"
                },
                {
                    "rek_author_id": 5852,
                    "author": {
                        "aut_org_username": "uqcgarin",
                        "aut_student_username": null,
                        "aut_id": 5852,
                        "aut_orcid_id": "0000-0002-6651-8035",
                        "aut_people_australia_id": "",
                        "aut_title": "Associate Professor"
                    },
                    "rek_author_id_lookup": "Gartner, Coral Elizabeth "
                }
            ],
            "fez_record_search_key_contributor": ["Pamela Korsmeyer", "Henry R. Kranzler"],
            "fez_record_search_key_contributor_id": [0, 0],
            "fez_record_search_key_edition": "3rd",
            "fez_record_search_key_isbn": ["9780028660646", "0028660641"],
           "fez_record_search_key_ismemberof": [
                {
                    "rek_ismemberof": "UQ:152266",
                    "parent": {
                        "rek_pid": "UQ:152266",
                        "rek_security_policy": 5,
                        "rek_datastream_policy": 5
                    },
                    "rek_ismemberof_lookup": "Excellence in Research Australia (ERA) - Collection"
                },
                {
                    "rek_ismemberof": "UQ:3751",
                    "parent": {
                        "rek_pid": "UQ:3751",
                        "rek_security_policy": 5,
                        "rek_datastream_policy": 5
                    },
                    "rek_ismemberof_lookup": "School of Public Health Publications"
                }
            ],
            "fez_record_search_key_keywords": ["Substance abuse", "Addictive behaviour", "Australia"],
            "fez_record_search_key_language": ["eng"],
            "fez_record_search_key_license": {
                "rek_license": 454104,
                "rek_license_lookup": "Permitted Re-Use with Commercial Use Restriction"
            },
            "fez_record_search_key_parent_publication": "Encyclopedia of drugs, alcohol & addictive behavior",
            "fez_record_search_key_place_of_publication": "Detroit, MI, U.S.",
            "fez_record_search_key_publisher": "Macmillan Reference",
            "fez_record_search_key_security_policy": [5],
            "fez_record_search_key_subject": [
                {
                    "rek_subject": 452942,
                    "rek_subject_lookup": "170101 Biological Psychology (Neuropsychology, Psychopharmacology, Physiological Psychology)"
                }
            ],
            "fez_record_search_key_volume_number": "1; A–C",
            "rek_display_type_lookup": "Reference Entry",
            "rek_object_type_lookup": "Record",
            "rek_status_lookup": "Published",
        }
    ]
}
export default hydrateMockSearchList(publicationTypeListReferenceEntry);
