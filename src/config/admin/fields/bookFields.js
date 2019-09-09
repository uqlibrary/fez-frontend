import commonFields from './commonFields';

export default {
    ...commonFields,
    admin: () => [
        {
            groups: [
                ['internalNotes'],
                ['rek_herdc_notes'],
                // ['fez_record_search_key_retracted']
            ],
        },
    ],
    identifiers: () => [
        {
            title: 'Manage identifiers',
            groups: [
                ['fez_record_search_key_doi'],
                ['fez_record_search_key_isi_loc', 'rek_wok_doc_type'],
                ['fez_record_search_key_scopus_id', 'rek_scopus_doc_type'],
                ['fez_record_search_key_pubmed_id', 'rek_pubmed_doc_type'],
            ],
        },
        {
            title: 'Manage links',
            groups: [['links']],
        },
    ],
    bibliographic: (isLote = false) => [
        {
            groups: [
                ['rek_title'],
                ...(isLote
                    ? [
                        ['languageOfTitle'],
                        ['fez_record_search_key_native_script_title'],
                        ['fez_record_search_key_translated_title'],
                        ['fez_record_search_key_roman_script_title'],
                    ]
                    : []),
                ['languages'],
            ],
        },
        {
            title: 'ISBN',
            groups: [['fez_record_search_key_isbn']],
        },
        {
            title: 'ISSN',
            groups: [['fez_record_search_key_issn']],
        },
        {
            title: 'Bibliographic',
            groups: [
                ['fez_record_search_key_place_of_publication', 'fez_record_search_key_publisher'],
                ['fez_record_search_key_edition'],
                ['fez_record_search_key_series'],
                ['fez_record_search_key_volume_number'],
                [
                    'fez_record_search_key_start_page',
                    'fez_record_search_key_end_page',
                    'fez_record_search_key_total_pages',
                ],
                [
                    'rek_date',
                    // 'rek_date_available',
                    'fez_record_search_key_date_available',
                ],
                ['rek_description'],
                ['fez_record_search_key_keywords'],
                ['subjects'],
                ['fez_record_search_key_refereed_source'],
            ],
        },
    ],
    authors: () => [
        {
            title: 'Author',
            groups: [['authors']],
        },
        {
            title: 'Editor',
            groups: [['editors']],
        },
    ],
    additionalInformation: () => [
        {
            groups: [
                ['collections'],
                ['rek_subtype'],
                ['fez_record_search_key_herdc_code', 'fez_record_search_key_herdc_status'],
                ['fez_record_search_key_institutional_status'],
                ['contentIndicators'],
                ['additionalNotes'],
            ],
        },
    ],
    ntro: () => [
        {
            title: 'Scale/Significance of work & Creator contribution statement',
            groups: [['significanceAndContributionStatement']],
        },
        {
            title: 'ISMN',
            groups: [['fez_record_search_key_ismn']],
        },
        {
            title: 'Quality indicators',
            groups: [['qualityIndicators']],
        },
    ],
};
