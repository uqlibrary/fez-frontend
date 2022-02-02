import { hydrateMock } from '../../../helpers/general';

const recordWithTiffAndThumbnail = {
    "rek_pid": "UQ:107683",
    "rek_title": "Lahz House, Spring Hill",
    "rek_description": "Winner of the Robin Dods Award RAIA Queensland Chapter 1990",
    "rek_display_type": 228,
    "rek_status": 2,
    "rek_object_type": 3,
    "rek_depositor": 220,
    "rek_created_date": "2007-08-27T11:09:38Z",
    "rek_updated_date": "2018-04-12T09:21:56Z",
    "rek_file_downloads": 25,
    "rek_citation": "<a class=\"citation_author_name\" title=\"Browse by Author Name for Keniger, Michael 1947-\" href=\"/list/author/Keniger%2C+Michael+1947-/\">Keniger, Michael 1947-</a>. <i><a class=\"citation_title\" title=\"Click to view Digilib Image: Lahz House, Spring Hill\" href=\"/view/UQ:107683\">Lahz House, Spring Hill</a></i>. ",
    "rek_genre": "Image",
    "rek_depositor_affiliation": 790,
    "rek_copyright": "off",
    "fez_record_search_key_architect_name": [
        "Lambert and Smith",
        "Lahz, Annabel",
        "Price, John",
    ],
    "fez_record_search_key_architect_id": [0, 0, 0],
    "fez_record_search_key_architectural_features": [
        "Three-storey",
        "Hipped roofs",
        "Timber battens",
        "Timber shutters",
        "Corrugated metal roofs",
    ],
    "fez_record_search_key_author": ["Keniger, Michael 1947-"],
    "fez_record_search_key_building_materials": [
        "Timber",
        "Besser block",
        "Weatherboard",
        "Fibre cement sheeting",
        "Corrugated metal",
    ],
    "fez_record_search_key_category": ["Dwellings"],
    "fez_record_search_key_condition": ["Renovated"],
    "fez_record_search_key_construction_date": "1989",
    "fez_record_search_key_date_photo_taken": "1999-01-01T00:00:00Z",
    "fez_record_search_key_date_scanned": "2007-02-19T00:00:00Z",
    "fez_record_search_key_file_attachment_name": [
        "AL_LH_01.tif",
        "presmd_AL_LH_01.xml",
        "preview_AL_LH_01.jpg",
        "thumbnail_AL_LH_01.jpg",
        "web_AL_LH_01.jpg",
    ],
    "fez_record_search_key_ismemberof": [
        {
            "rek_ismemberof": "UQ:3903",
            "rek_ismemberof_lookup": "Queensland Contemporary Architects"
        },
        {
            "rek_ismemberof": "UQ:209864",
            "rek_ismemberof_lookup": "UQ Library - Digitised Materials - open access"
        }
    ],
    "fez_record_search_key_location": ["Spring Hill, Queensland", "Australia"],
    "fez_record_search_key_notes":
        "Alterations and additions to existing workers' cottage. RAIA Queensland Chapter, The Robin Dods award for domestic architecture, 1990.",
    "fez_record_search_key_oa_status": {
        "rek_oa_status": 453697,
        "rek_oa_status_lookup": "Other"
    },
    "fez_record_search_key_period": ["Late twentieth-century (1960-)"],
    "fez_record_search_key_publisher": "The University of Queensland Library",
    "fez_record_search_key_refereed_source": {
        "rek_refereed_source": "453638",
        "rek_refereed_source_lookup": "Not yet assessed"
    },
    "fez_record_search_key_rights":
        "Research and private study only. Not to be reproduced without prior written permission. Rights holder: Michael Keniger.",
    "fez_record_search_key_structural_systems": ["Timber construction", "Masonry construction"],
    "fez_record_search_key_subcategory": ["Houses"],
    "fez_record_search_key_surrounding_features": ["Trees", "Roads & streets"],
    "fez_datastream_info": [
        {
            "dsi_pid": "UQ:107683",
            "dsi_dsid": "AL_LH_01.tif",
            "dsi_embargo_date": null,
            "dsi_open_access": 1,
            "dsi_label": "",
            "dsi_mimetype": "image/tiff",
            "dsi_copyright": null,
            "dsi_state": "A",
            "dsi_size": 27932352
        },
        {
            "dsi_pid": "UQ:107683",
            "dsi_dsid": "FezACML_AL_LH_01.tif.xml",
            "dsi_embargo_date": null,
            "dsi_open_access": null,
            "dsi_label": "FezACML security for datastream - AL_LH_01.tif",
            "dsi_mimetype": "text/xml",
            "dsi_copyright": null,
            "dsi_state": "A",
            "dsi_size": 64
        },
        {
            "dsi_pid": "UQ:107683",
            "dsi_dsid": "FezACML_UQ_107683.xml",
            "dsi_embargo_date": null,
            "dsi_open_access": null,
            "dsi_label": "FezACML security for PID - UQ:107683",
            "dsi_mimetype": "text/xml",
            "dsi_copyright": null,
            "dsi_state": "A",
            "dsi_size": 3633
        },
        {
            "dsi_pid": "UQ:107683",
            "dsi_dsid": "presmd_AL_LH_01.xml",
            "dsi_embargo_date": null,
            "dsi_open_access": null,
            "dsi_label": "",
            "dsi_mimetype": "application/xml",
            "dsi_copyright": null,
            "dsi_state": "A",
            "dsi_size": 239623
        },
        {
            "dsi_pid": "UQ:107683",
            "dsi_dsid": "preview_AL_LH_01.jpg",
            "dsi_embargo_date": null,
            "dsi_open_access": null,
            "dsi_label": "",
            "dsi_mimetype": "image/jpeg",
            "dsi_copyright": null,
            "dsi_state": "A",
            "dsi_size": 95360
        },
        {
            "dsi_pid": "UQ:107683",
            "dsi_dsid": "thumbnail_AL_LH_01.jpg",
            "dsi_embargo_date": null,
            "dsi_open_access": null,
            "dsi_label": "",
            "dsi_mimetype": "image/jpeg",
            "dsi_copyright": null,
            "dsi_state": "A",
            "dsi_size": 3912
        },
        {
            "dsi_pid": "UQ:107683",
            "dsi_dsid": "web_AL_LH_01.jpg",
            "dsi_embargo_date": null,
            "dsi_open_access": null,
            "dsi_label": "",
            "dsi_mimetype": "image/jpeg",
            "dsi_copyright": null,
            "dsi_state": "A",
            "dsi_size": 163244
        }
    ],
    "rek_status_lookup": "Published",
    "rek_object_type_lookup": "Record",
    "rek_display_type_lookup": "Digilib Image",
};
export default hydrateMock(recordWithTiffAndThumbnail);
