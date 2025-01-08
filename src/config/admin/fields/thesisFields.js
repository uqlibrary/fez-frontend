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
            title: 'Bibliographic',
            groups: [
                ['fez_record_search_key_total_pages'],
                ['rek_date'],
                ['rek_description'],
                ['rek_genre_type'],
                ['fez_record_search_key_org_name'],
                ['fez_record_search_key_org_unit_name'],
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
            groups: [['fez_record_search_key_sustainable_development_goal']],
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
            title: 'Supervisors',
            groups: [['supervisors']],
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
                ['fez_record_search_key_oa_status', 'fez_record_search_key_oa_status_type'],
                ['fez_record_search_key_license'],
            ],
        },
    ],
    ntro: () => [],
};

export const validateThesis = (
    { bibliographicSection: bs, authorsSection: as },
    { validationErrorsSummary: summary },
) => ({
    bibliographicSection: {
        ...((!((bs || {}).fez_record_search_key_org_unit_name || {}).rek_org_unit_name && {
            fez_record_search_key_org_unit_name: {
                rek_org_unit_name: summary.rek_org_unit_name,
            },
        }) ||
            {}),
        ...((!(bs || {}).rek_genre_type && {
            rek_genre_type: summary.rek_genre_type,
        }) ||
            {}),
        ...((!(bs || {}).subjects && {
            subjects: summary.subjects,
        }) ||
            {}),
    },
    authorsSection: {
        ...(((as || {}).authors || []).length === 0 && {
            authors: summary.authors,
        }),
        ...(((as || {}).supervisors || []).length === 0 && {
            supervisors: summary.supervisors,
        }),
    },
});
