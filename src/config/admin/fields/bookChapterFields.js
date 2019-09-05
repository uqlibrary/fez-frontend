import commonFields from './commonFields';

export default {
    ...commonFields,
    admin: () => [
        {
            groups: [['internalNotes']],
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
                ['fez_record_search_key_pubmed_central_id'],
            ],
        },
        {
            title: 'Manage links',
            groups: [['links']],
        },
    ],
    bibliographic: (isLote = false) => [
        {
            title: 'Book chapter title',
            groups: [
                ['rek_title'],
                ...(isLote
                    ? [
                        ['fez_record_search_key_native_script_title'],
                        ['fez_record_search_key_roman_script_title'],
                        ['fez_record_search_key_translated_title'],
                        ['languageOfTitle'],
                    ]
                    : []),
            ],
        },
        {
            title: 'Book title',
            groups: [
                ['fez_record_search_key_book_title'],
                ...(isLote
                    ? [
                        ['fez_record_search_key_native_script_book_title'],
                        ['fez_record_search_key_roman_script_book_title'],
                        ['fez_record_search_key_translated_book_title'],
                        ['languageOfBookTitle'],
                    ]
                    : []),
            ],
        },
        {
            title: 'Language of work',
            groups: [['languages']],
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
            title: 'Publication',
            groups: [
                ['fez_record_search_key_place_of_publication', 'fez_record_search_key_publisher'],
                ['fez_record_search_key_edition', 'fez_record_search_key_series'],
                ['fez_record_search_key_volume_number', 'fez_record_search_key_chapter_number'],
                ['fez_record_search_key_start_page', 'fez_record_search_key_total_pages'],
                ['fez_record_search_key_end_page'],
                ['rek_date', 'fez_record_search_key_date_available'],
            ],
        },
        {
            title: 'Abstract/Description',
            groups: [['rek_description']],
        },
        {
            title: 'Keyword(s)',
            groups: [['fez_record_search_key_keywords']],
        },
        {
            title: 'Subject',
            groups: [['subjects']],
        },
        {
            title: 'Succeeds',
            groups: [['fez_record_search_key_isderivationof']],
        },
        {
            title: 'Refereed source',
            groups: [['fez_record_search_key_refereed_source']],
        },
    ],
    authors: () => [
        {
            title: 'Authors',
            groups: [['authors']],
        },
    ],
    additionalInformation: () => [
        {
            title: 'Additional information',
            groups: [
                ['collections'],
                ['rek_subtype'],
                [
                    'fez_record_search_key_herdc_code',
                    'fez_record_search_key_herdc_status',
                    'fez_record_search_key_institutional_status',
                ],
                ['contentIndicators'],
                ['additionalNotes'],
            ],
        },
    ],
    ntro: () => [
        {
            title: 'Scale/Significance of work & Creator research statement',
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
