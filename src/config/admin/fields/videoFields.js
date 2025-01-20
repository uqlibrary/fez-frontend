import commonFields from './commonFields';

export default {
    ...commonFields,
    bibliographic: ({ isLote = false }) => [
        {
            title: 'Title',
            groups: [['rek_title'], ...(isLote ? [['fez_record_search_key_translated_title']] : [])],
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
            groups: [['issns']],
        },
        {
            title: 'Bibliographic',
            groups: [
                ['fez_record_search_key_place_of_publication', 'fez_record_search_key_publisher'],
                ['fez_record_search_key_series'],
                ['rek_date'],
                ['fez_record_search_key_date_available'],
                ['rek_description'],
                ['fez_record_search_key_type_of_data'],
                ['fez_record_search_key_original_format'],
                ['fez_record_search_key_source'],
                ['fez_record_search_key_rights'],
            ],
        },
        {
            title: 'Geographic co-ordinates',
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
        {
            title: 'Sustainable Development Goal',
            groups: [['fez_record_search_key_sdg_source']],
        },
        {
            title: 'Related publications', // Succeeds
            groups: [['fez_record_search_key_isderivationof']],
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
    admin: () => [
        {
            title: 'Member of collections',
            groups: [['collections']],
        },
        {
            title: 'Additional information',
            groups: [
                ['fez_record_search_key_institutional_status'],
                ['fez_record_search_key_refereed_source', 'contentIndicators'],
                ['fez_record_search_key_oa_status', 'fez_record_search_key_oa_status_type'],
                ['fez_record_search_key_license'],
            ],
        },
    ],
    ntro: () => [],
};

export const validateVideo = ({ bibliographicSection: bs }, { validationErrorsSummary: summary }) => ({
    bibliographicSection: {
        ...((!((bs || {}).fez_record_search_key_rights || {}).rek_rights && {
            fez_record_search_key_rights: {
                rek_rights: summary.rek_rights,
            },
        }) ||
            {}),
    },
});
