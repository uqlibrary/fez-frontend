import commonFields from './commonFields';

export default {
    ...commonFields,
    bibliographic: () => [
        {
            title: 'Dataset name',
            groups: [['rek_title']],
        },
        {
            title: 'Language of work',
            groups: [['languages']],
        },
        {
            title: 'Bibliographic',
            groups: [
                ['fez_record_search_key_publisher'],
                ['rek_date'],
                ['rek_description'],
                ['fez_record_search_key_type_of_data'],
                ['fez_record_search_key_isdatasetof'],
                ['fez_record_search_key_related_publications'],
                ['fez_record_search_key_related_datasets'],
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
            title: 'Sustainable Development Goal',
            groups: [['fez_record_search_key_sdg_source']],
        },
        {
            title: 'ANZSRC Fields of Research (FoR) Code(s)',
            groups: [['subjects']],
        },
        {
            title: 'Software(s)',
            groups: [['fez_record_search_key_software_required']],
        },
        {
            title: 'Type(s) of data',
            groups: [['fez_record_search_key_data_volume']],
        },
    ],
    authors: () => [
        {
            title: 'Creator',
            groups: [['authors']],
        },
    ],
    admin: () => [
        {
            title: 'Member of collections',
            groups: [['collections']],
        },
        {
            title: 'Dataset information',
            groups: [
                ['contactName', 'contactNameId'],
                ['contactEmail'],
                ['fez_record_search_key_ands_collection_type'],
            ],
        },
        {
            title: 'Additional information',
            groups: [
                [
                    'fez_record_search_key_access_conditions',
                    'fez_record_search_key_oa_status',
                    'fez_record_search_key_oa_status_type',
                ],
                ['fez_record_search_key_license'],
                ['fez_record_search_key_rights'],
                ['fez_record_search_key_start_date'],
                ['fez_record_search_key_end_date'],
                ['fez_record_search_key_time_period_start_date'],
                ['fez_record_search_key_time_period_end_date'],
            ],
        },
        {
            title: 'Project information',
            groups: [
                ['fez_record_search_key_project_name'],
                ['fez_record_search_key_project_description'],
                ['fez_record_search_key_project_id'],
            ],
        },
    ],
    ntro: () => [],
};

export const validateDataCollection = (
    { bibliographicSection: bs, adminSection: ais, authorsSection: as },
    { validationErrorsSummary: summary },
) => ({
    bibliographicSection: {
        ...((!((bs || {}).fez_record_search_key_publisher || {}).rek_publisher && {
            fez_record_search_key_publisher: {
                rek_publisher: summary.rek_publisher,
            },
        }) ||
            {}),
    },
    adminSection: {
        ...((!(ais || {}).contactName && {
            contactName: summary.contactName,
        }) ||
            {}),
        ...((!(ais || {}).contactEmail && {
            contactEmail: summary.contactEmail,
        }) ||
            {}),
        ...((!((ais || {}).fez_record_search_key_project_name || {}).rek_project_name && {
            fez_record_search_key_project_name: {
                rek_project_name: summary.rek_project_name,
            },
        }) ||
            {}),
        ...((!((ais || {}).fez_record_search_key_project_description || {}).rek_project_description && {
            fez_record_search_key_project_description: {
                rek_project_description: summary.rek_project_description,
            },
        }) ||
            {}),
        ...((!((ais || {}).fez_record_search_key_access_conditions || {}).rek_access_conditions && {
            fez_record_search_key_access_conditions: {
                rek_access_conditions: summary.rek_access_conditions,
            },
        }) ||
            {}),
        ...((!((ais || {}).fez_record_search_key_ands_collection_type || {}).rek_ands_collection_type && {
            fez_record_search_key_ands_collection_type: {
                rek_ands_collection_type: summary.rek_ands_collection_type,
            },
        }) ||
            {}),
        ...((!((ais || {}).fez_record_search_key_license || {}).rek_license && {
            fez_record_search_key_license: {
                rek_license: summary.rek_license,
            },
        }) ||
            {}),
    },
    authorsSection: {
        ...(((as || {}).authors || []).length === 0 && {
            authors: summary.authors,
        }),
    },
});
