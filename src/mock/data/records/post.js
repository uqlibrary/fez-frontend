const createJournalArticle = {
    "rek_display_type": 179,
    "rek_title": "this is a test journal article",
    "fez_record_search_key_journal_name": {"rek_journal_name": "test journal"},
    "rek_date": "1982-01-01",
    "rek_subtype": "Critical review of research, literature review, critical commentary",
    "authors": [
        {"nameAsPublished": "TEST C", "selected": true},
        {"nameAsPublished": "TEST B", "selected": false},
        {"nameAsPublished": "TEST D", "selected": false}
        ],
    "rek_object_type": 3,
    "rek_status": 3,
    "fez_record_search_key_ismemberof": [{"rek_ismemberof": "UQ:218198"}],
    "fez_record_search_key_author": [
        {
            "rek_author_id": null,
            "rek_author": "TEST C",
            "rek_author_order": 1
        },
        {
            "rek_author_id": null,
            "rek_author": "TEST B",
            "rek_author_order": 2},
        {
            "rek_author_id": null,
            "rek_author": "TEST D",
            "rek_author_order": 3
        }],
    "fez_record_search_key_author_id": [
        {
            "rek_author_id": 1671,
            "rek_author_id_order": 1
        }
    ]
};

const createBook = {
    "rek_object_type": 3,
    "rek_status": 3,
    "fez_record_search_key_ismemberof": [{"rek_ismemberof": "UQ:218198"}],
    "fez_record_search_key_place_of_publication": {"rek_place_of_publication": "test"},
    "fez_record_search_key_publisher": {"rek_publisher": "test"},
    "rek_title": "test",
    "fez_record_search_key_issn": [{"rek_issn": "12341234", "rek_issn_order": 1}, {
        "rek_issn": "12222222",
        "rek_issn_order": 2
    }],
    "rek_subtype": "Textbook",
    "rek_date": "2000-01-01",
    "rek_display_type": 174,
    "fez_record_search_key_author": [{
        "rek_author_id": null,
        "rek_author": "test 1",
        "rek_author_order": 1
    }, {"rek_author_id": null, "rek_author": "test 2", "rek_author_order": 2}],
    "fez_record_search_key_author_id": [{"rek_author_id": 1671, "rek_author_id_order": 1}, {
        "rek_author_id": null,
        "rek_author_id_order": 2
    }],
    "fez_record_search_key_contributor": [{
        "rek_contributor_id": null,
        "rek_contributor": "test 3",
        "rek_contributor_order": 1
    }],
    "fez_record_search_key_contributor_id": [{"rek_contributor_id": null, "rek_contributor_id_order": 1}]
};

const request = {
    "rek_object_type": 3,
    "rek_status": 3,
    "fez_record_search_key_ismemberof": [{"rek_ismemberof": "UQ:218198"}],
    "rek_display_type": 174,
    "rek_title": "test",
    "rek_subtype": "Textbook",
    "fez_record_search_key_author": [
        {"rek_author_id": null, "rek_author": "A. Smith", "rek_author_order": 1},
        {"rek_author_id": null, "rek_author": "J. Smith", "rek_author_order": 2},
        {"rek_author_id": null, "rek_author": "O. Smith", "rek_author_order": 3}
        ],
    "fez_record_search_key_author_id": [
        {"rek_author_id": null, "rek_author_id_order": 1},
        {"rek_author_id": 1671, "rek_author_id_order": 2},
        {"rek_author_id": null, "rek_author_id_order": 3}
        ]
};