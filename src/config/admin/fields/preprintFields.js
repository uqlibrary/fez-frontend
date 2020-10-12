import commonFields from './commonFields';

export default {
    ...commonFields,
    bibliographic: () => [
        {
            title: 'Title',
            groups: [['rek_title']],
        },
        {
            title: 'Bibliographic',
            groups: [['fez_record_search_key_publisher'], ['rek_date'], ['rek_description']],
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
                [
                    'fez_record_search_key_herdc_code',
                    'fez_record_search_key_herdc_status',
                    'fez_record_search_key_institutional_status',
                ],
                ['fez_record_search_key_refereed_source', 'contentIndicators'],
                ['fez_record_search_key_oa_status', 'fez_record_search_key_oa_status_type'],
                ['fez_record_search_key_license'],
                ['additionalNotes'],
            ],
        },
        {
            title: 'Notes',
            groups: [['internalNotes'], ['rek_herdc_notes']],
        },
    ],
    ntro: () => [],
};

export const validatePreprint = ({ filesSection: fs, authorsSection: as }, { validationErrorsSummary: summary }) => ({
    filesSection: {
        ...((fs || {}).rek_copyright !== 'on' && {
            rek_copyright: summary.rek_copyright,
        }),
    },
    authorsSection: {
        ...(((as || {}).authors || []).length === 0 && {
            authors: summary.authors,
        }),
    },
});
