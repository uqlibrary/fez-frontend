import { hydrateMock } from '../../../helpers/general';

const communityRecord = {
    "rek_pid": "UQ:3883",
    "rek_title": "The University of Queensland Library",
    "rek_display_type": 11,
    "rek_status": 2,
    "rek_object_type": 1,
    "rek_depositor": 112,
    "rek_created_date": "2006-12-05T15:29:26Z",
    "rek_updated_date": "2020-12-18T04:12:20Z",
    "rek_file_downloads": 0,
    "rek_citation": "<a class=\"citation_community\" title=\"Click to view Fedora Community Display The University of Queensland Library\" href=\"/view/UQ%3A3883\">The University of Queensland Library</a>",
    "rek_security_inherited": 0,
    "rek_security_policy": 5,
    "fez_record_search_key_keywords": ["library"],
    "rek_display_type_lookup": "Community",
    "rek_object_type_lookup": "Community",
    "rek_status_lookup": "Published",
    "rek_wok_doc_type_lookup": "Abstract of Published Item",
};
export default hydrateMock(communityRecord);
