import commonFields from './commonFields';

export default {
    ...commonFields,
    admin: () => [
        {
            groups: [['internalNotes'], ['rek_herdc_notes']],
        },
    ],
    identifiers: () => [
        {
            title: 'Manage identifiers',
            groups: [['rek_wok_doc_type', 'rek_scopus_doc_type']],
        },
        {
            title: 'Manage links',
            groups: [['links']],
        },
    ],
    bibliographic: (isLote = false) => [
        {
            groups: [['rek_title'], ...(isLote ? [['fez_record_search_key_translated_title']] : []), ['languages']],
        },
        {
            title: 'Bibliographic',
            groups: [
                ['fez_record_search_key_place_of_publication', 'fez_record_search_key_publisher'],
                ['fez_record_search_key_series'],
                ['rek_date', 'fez_record_search_key_date_available'],
                ['fez_record_search_key_acknowledgements'],
            ],
        },
        {
            title: 'Keywords',
            groups: [['fez_record_search_key_keywords']],
        },
        {
            title: 'Subject',
            groups: [['subjects']],
        },
        {
            title: 'Related publications', // Succeeds
            groups: [['fez_record_search_key_isderivationof']],
        },
        {
            groups: [
                ['rek_description'],
                ['fez_record_search_key_refereed_source', 'fez_record_search_key_original_format'],
                ['fez_record_search_key_rights'],
                ['fez_record_search_key_source'],
                ['fez_record_search_key_license'],
            ],
        },
    ],
    authors: () => [
        {
            title: 'Creators',
            groups: [['authors']],
        },
        {
            title: 'Contributors',
            groups: [['editors']],
        },
    ],
    additionalInformation: () => [
        {
            title: 'Member of Collections',
            groups: [['collections']],
        },
        {
            groups: [
                ['additionalNotes'],
                ['fez_record_search_key_institutional_status', 'fez_record_search_key_oa_status'],
            ],
        },
    ],
    ntro: () => [],
};
