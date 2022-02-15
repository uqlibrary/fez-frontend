import { hydrateMock } from '../../../helpers/general';

const recordWithoutAuthorIds = {
    "rek_pid": "UQ:290371",
    "rek_title": "Religious statue, St Stephen's Cathederal precinct, Brisbane",
    "rek_display_type": 228,
    "rek_status": 2,
    "rek_object_type": 3,
    "rek_depositor": 218,
    "rek_created_date": "2013-02-01T15:41:18Z",
    "rek_updated_date": "2018-06-06T09:02:42Z",
    "rek_file_downloads": 4,
    "rek_citation": "<a class=\"citation_author_name\" title=\"Browse by Author Name for De Gruchy, Graham Francis\" href=\"/list/author/De+Gruchy%2C+Graham+Francis/\">De Gruchy, Graham Francis</a>. <i><a class=\"citation_title\" title=\"Click to view Digilib Image: Religious statue, St Stephen's Cathederal precinct, Brisbane\" href=\"/view/UQ:290371\">Religious statue, St Stephen's Cathederal precinct, Brisbane</a></i>. ",
    "rek_genre": "Image",
    "rek_depositor_affiliation": 1167,
    "rek_security_inherited": 1,
    "rek_copyright": "on",
    "fez_record_search_key_alternative_title": ["Brisbane Art"],
    "fez_record_search_key_author": ["De Gruchy, Graham Francis"],
    "fez_record_search_key_building_materials": ["Marble"],
    "fez_record_search_key_category": ["Artwork"],
    "fez_record_search_key_condition": ["Original"],
    "fez_record_search_key_construction_date": "1980",
    "fez_record_search_key_date_photo_taken": "1980-01-01T00:00:00Z",
    "fez_record_search_key_date_scanned": "2012-11-26T00:00:00Z",
    "fez_record_search_key_file_attachment_name": [
        "Slide_011.tif",
        "presmd_Slide_011.xml",
        "preview_Slide_011.jpg",
        "thumbnail_Slide_011.jpg",
        "web_Slide_011.jpg",
    ],
    "fez_record_search_key_ismemberof": [
        {
            "rek_ismemberof": "UQ:290315",
            "rek_ismemberof_lookup": "Art Forms in Brisbane"
        },
        {
            "rek_ismemberof": "UQ:209864",
            "rek_ismemberof_lookup": "UQ Library - Digitised Materials - open access"
        }
    ],
    "fez_record_search_key_location": ["249 Elizabeth St", "Brisbane City, Queensland"],
    "fez_record_search_key_oa_status": {
        "rek_oa_status": 453697,
        "rek_oa_status_lookup": "Other"
    },
    "fez_record_search_key_refereed_source": {
        "rek_refereed_source": "453638",
        "rek_refereed_source_lookup": "Not yet assessed"
    },
    "fez_record_search_key_rights":
        "Research and private study only. Not to be reproduced without prior written permission. Rights holder: Graham Francis De Gruchy.",
    "fez_record_search_key_subcategory": ["Street sculpture"],
    "fez_datastream_info": [
        {
            "dsi_pid": "UQ:290371",
            "dsi_dsid": "FezACML_Slide_011.tif.xml",
            "dsi_label": "FezACML security for datastream - Slide_011.tif",
            "dsi_mimetype": "text/xml",
            "dsi_state": "A",
            "dsi_size": 64
        },
        {
            "dsi_pid": "UQ:290371",
            "dsi_dsid": "FezACML_UQ_290371.xml",
            "dsi_label": "FezACML security for PID - UQ:290371",
            "dsi_mimetype": "text/xml",
            "dsi_state": "A",
            "dsi_size": 3705
        },
        {
            "dsi_pid": "UQ:290371",
            "dsi_dsid": "presmd_Slide_011.xml",
            "dsi_mimetype": "application/xml",
            "dsi_state": "A",
            "dsi_size": 138174
        },
        {
            "dsi_pid": "UQ:290371",
            "dsi_dsid": "preview_Slide_011.jpg",
            "dsi_mimetype": "image/jpeg",
            "dsi_state": "A",
            "dsi_size": 30600
        },
        {
            "dsi_pid": "UQ:290371",
            "dsi_dsid": "Slide_011.tif",
            "dsi_open_access": 1,
            "dsi_mimetype": "image/tiff",
            "dsi_state": "A",
            "dsi_size": 55369916
        },
        {
            "dsi_pid": "UQ:290371",
            "dsi_dsid": "thumbnail_Slide_011.jpg",
            "dsi_mimetype": "image/jpeg",
            "dsi_state": "A",
            "dsi_size": 2163
        },
        {
            "dsi_pid": "UQ:290371",
            "dsi_dsid": "web_Slide_011.jpg",
            "dsi_mimetype": "image/jpeg",
            "dsi_state": "A",
            "dsi_size": 51587
        }
    ],
    "rek_status_lookup": "Published",
    "rek_object_type_lookup": "Record",
    "rek_display_type_lookup": "Digilib Image"
};
export default hydrateMock(recordWithoutAuthorIds);
