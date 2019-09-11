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
            groups: [
                ['fez_record_search_key_isi_loc', 'rek_wok_doc_type'],
                ['fez_record_search_key_scopus_id', 'rek_scopus_doc_type'],
                ['rek_pubmed_doc_type'],
            ],
        },
        {
            title: 'Manage links',
            groups: [['links']],
        },
        {
            title: 'Identifiers',
            groups: [['fez_record_search_key_identifier']],
        },
        {
            title: 'Location',
            groups: [['fez_record_search_key_location']],
        },
    ],
    bibliographic: (isLote = false) => [
        {
            title: 'Book title',
            groups: [
                ['rek_title'],
                ...(isLote
                    ? [
                        ['languageOfTitle'],
                        ['fez_record_search_key_native_script_title'],
                        ['fez_record_search_key_roman_script_title'],
                        ['fez_record_search_key_translated_title'],
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
            title: 'Bibliographic',
            groups: [
                ['fez_record_search_key_place_of_publication', 'fez_record_search_key_publisher'],
                ['fez_record_search_key_series'],
                ['rek_date', 'fez_record_search_key_date_available', 'fez_record_search_key_date_recorded'],
                ['rek_description'],
                ['fez_record_search_key_acknowledgements'],
                ['fez_record_search_key_length', 'rek_genre'],
                ['fez_record_search_key_original_format'],
                ['fez_record_search_key_license'],
                ['fez_record_search_key_source'],
                ['fez_record_search_key_rights'],
                ['fez_record_search_key_transcript'],
                ['fez_record_search_key_alternate_genre'],
                ['fez_record_search_key_refereed_source'],
            ],
        },
        {
            title: 'Keyword(s)',
            groups: [['fez_record_search_key_keywords']],
        },
        {
            title: 'Subject',
            groups: [['subjects']],
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
            title: 'Member of collections',
            groups: [['collections']],
        },
        {
            title: 'Additional information',
            groups: [
                ['fez_record_search_key_institutional_status', 'fez_record_search_key_oa_status', 'contentIndicators'],
                ['additionalNotes'],
            ],
        },
    ],
    ntro: () => [],
};
