import commonFields from './commonFields';

export default {
    ...commonFields,
    identifiers: () => [
        {
            title: 'Manage identifiers',
            groups: [['rek_wok_doc_type', 'rek_scopus_doc_type'], ['rek_pubmed_doc_type']],
        },
        {
            title: 'Manage links',
            groups: [['links']],
        },
    ],
    bibliographic: () => [
        {
            title: 'Title',
            groups: [['rek_title']],
        },
        {
            title: 'Bibliographic',
            groups: [
                ['fez_record_search_key_publisher'],
                ['rek_date'],
                ['rek_description'],
                ['fez_record_search_key_rights'],
                ['fez_record_search_key_refereed_source'],
            ],
        },
        {
            title: 'Related publications', // Succeeds
            groups: [['fez_record_search_key_isderivationof']],
        },
    ],
    authors: () => [
        {
            title: 'Architects',
            groups: [['architects']],
        },
        {
            title: 'Photographers',
            groups: [['authors']],
        },
        {
            title: 'Other contributors',
            groups: [['editors']],
        },
    ],
    additionalInformation: () => [
        {
            title: 'Member of collections',
            groups: [['collections']],
        },
        {
            title: 'Additional information',
            groups: [
                ['fez_record_search_key_institutional_status', 'fez_record_search_key_oa_status'],
                ['additionalNotes'],
            ],
        },
        {
            title: 'Holding Pen',
            groups: [
                ['fez_record_search_key_period'],
                ['fez_record_search_key_structural_systems'],
                ['fez_record_search_key_style'],
                ['fez_record_search_key_subcategory'],
                ['fez_record_search_key_surrounding_features'],
                ['fez_record_search_key_interior_features'],
                ['fez_record_search_key_date_photo_taken'],
                ['fez_record_search_key_date_scanned'],
                ['fez_record_search_key_building_materials'],
                ['fez_record_search_key_condition'],
                ['fez_record_search_key_construction_date'],
                ['fez_record_search_key_alternative_title'],
                ['fez_record_search_key_architectural_features'],
            ],
        },
    ],
    ntro: () => [],
};
