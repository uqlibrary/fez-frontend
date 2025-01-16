import commonFields from './commonFields';

export default {
    ...commonFields,
    bibliographic: ({ isLote = false }) => [
        {
            title: 'Title of proceedings',
            groups: [['rek_title'], ...(isLote ? [['fez_record_search_key_translated_title']] : [])],
        },
        {
            title: 'Language of work',
            groups: [['languages']],
        },
        {
            title: 'Conference name',
            groups: [
                ['fez_record_search_key_conference_name'],
                ...(isLote ? [['fez_record_search_key_translated_conference_name']] : []),
            ],
        },
        {
            title: 'Conference details',
            groups: [['fez_record_search_key_conference_location', 'fez_record_search_key_conference_dates']],
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
                ['fez_record_search_key_volume_number', 'fez_record_search_key_issue_number'],
                [
                    'fez_record_search_key_start_page',
                    'fez_record_search_key_end_page',
                    'fez_record_search_key_total_pages',
                ],
                ['rek_date'],
                ['fez_record_search_key_date_available'],
                ['rek_description'],
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
        {
            title: 'Sustainable Development Goal',
            groups: [['fez_record_search_key_sdg']],
        },
        {
            title: 'Related publications', // Succeeds
            groups: [['fez_record_search_key_isderivationof']],
        },
    ],
    authors: () => [
        {
            title: 'Authors',
            groups: [['authors']],
        },
        {
            title: 'Editors',
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
                [
                    'fez_record_search_key_herdc_code',
                    'fez_record_search_key_herdc_status',
                    'fez_record_search_key_institutional_status',
                ],
                ['fez_record_search_key_refereed_source', 'contentIndicators'],
                ['fez_record_search_key_oa_status', 'fez_record_search_key_oa_status_type'],
                ['fez_record_search_key_license'],
            ],
        },
    ],
    ntro: () => [
        {
            title: 'Quality indicators',
            groups: [['qualityIndicators']],
        },
    ],
};

export const validateConferenceProceedings = (
    { bibliographicSection: bs, authorsSection: as },
    { validationErrorsSummary: summary },
) => ({
    bibliographicSection: {
        ...((!((bs || {}).fez_record_search_key_conference_name || {}).rek_conference_name && {
            fez_record_search_key_conference_name: {
                rek_conference_name: summary.rek_conference_name,
            },
        }) ||
            {}),
        ...((!((bs || {}).fez_record_search_key_conference_location || {}).rek_conference_location && {
            fez_record_search_key_conference_location: {
                rek_conference_location: summary.rek_conference_location,
            },
        }) ||
            {}),
        ...((!((bs || {}).fez_record_search_key_conference_dates || {}).rek_conference_dates && {
            fez_record_search_key_conference_dates: {
                rek_conference_dates: summary.rek_conference_dates,
            },
        }) ||
            {}),
    },
    authorsSection: {
        ...(((as || {}).editors || []).length === 0 && {
            editors: summary.editors,
        }),
    },
});
