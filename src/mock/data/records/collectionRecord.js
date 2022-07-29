import { hydrateMock } from '../../../helpers/general';

const collectionRecord = {
    rek_pid: 'UQ:11398',
    rek_title: 'This is a Collection Record',
    rek_display_type: 9,
    rek_display_type_lookup: 'Collection',
    rek_status: 2,
    rek_status_lookup: 'Published',
    rek_object_type: 2,
    rek_object_type_lookup: 'Collection',
    "rek_citation": "<a class=\"citation_collections\" title=\"Click to list records in Collection Aboriginal+and+Torres+Strait+Islander+Studies+Unit+Publications\" href=\"/records/search?searchQueryParams%5Brek_ismemberof%5D%5Bvalue%5D%5B%5D=UQ%3A11398&searchMode=advanced\">Aboriginal+and+Torres+Strait+Islander+Studies+Unit+Publications</a>",
    "fez_record_search_key_ismemberof": [
        {
            "rek_ismemberof": "UQ:12096",
            "parent": {
                "rek_pid": "UQ:12096",
                "rek_security_policy": 1,
                "rek_datastream_policy": null
            },
            "rek_ismemberof_lookup": "Aboriginal and Torres Strait Islander Studies Unit"
        }
    ],
    "fez_record_search_key_keywords": [
        "Torres Strait Islanders",
        "Aborigines",
    ],
    fez_record_search_key_xsd_display_option: [263],
    rek_wok_doc_type_lookup: 'Abstract of Published Item',
    "ciNotices": {
        "rek_ci_notice_attribution_incomplete":true,
    },
};
export default hydrateMock(collectionRecord);
