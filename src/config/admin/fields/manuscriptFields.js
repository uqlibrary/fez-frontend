import commonFields from './commonFields';

export default {
    ...commonFields,
    identifiers: () => [
        {
            title: 'Manage identifiers',
            groups: [['rek_wok_doc_type'], ['rek_scopus_doc_type'], ['rek_pubmed_doc_type']],
        },
        {
            title: 'Manage links',
            groups: [['links']],
        },
    ],
    bibliographic: (isLote = false) => [
        {
            title: 'Title',
            groups: [['rek_title'], ...(isLote ? [['fez_record_search_key_translated_title']] : [])],
        },
        {
            title: 'Language of work',
            groups: [['languages']],
        },
        {
            title: 'Bibliographic',
            groups: [
                ['fez_record_search_key_series'],
                ['rek_date', 'fez_record_search_key_date_available'],
                ['fez_record_search_key_acknowledgements'],
                ['fez_record_search_key_source'],
                ['fez_record_search_key_rights'],
                ['fez_record_search_key_transcript'],
                ['rek_description'],
            ],
        },
        {
            title: 'Geographic area',
            groups: [['geoCoordinates']],
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
            groups: [['rek_subtype'], ['fez_record_search_key_oa_status'], ['fez_record_search_key_original_format']],
        },
    ],
    ntro: () => [],
};
