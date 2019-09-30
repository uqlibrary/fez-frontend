import commonFields from './commonFields';

export default {
    ...commonFields,
    bibliographic: (isLote = false) => [
        {
            title: 'Dataset name',
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
            title: 'Bibliographic',
            groups: [
                ['fez_record_search_key_publisher'],
                ['rek_date'],
                ['rek_description'],
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
            title: 'Subject(s)',
            groups: [['subjects']],
        },
        {
            title: 'Software(s)',
            groups: [['fez_record_search_key_software_required']],
        },
        {
            title: 'Type(s) of data',
            groups: [['fez_record_search_key_type_of_data']],
        },
        {
            title: 'Related datasets/work',
            groups: [['fez_record_search_key_isdatasetof']],
        },
    ],
    authors: () => [
        {
            title: 'Creator',
            groups: [['authors']],
        },
    ],
    additionalInformation: () => [
        {
            title: 'Member of collections',
            groups: [['collections']],
        },
        {
            title: 'Dataset information',
            groups: [['contactName', 'contactNameId'], ['contactEmail']],
        },
        {
            title: 'Additional information',
            groups: [
                [
                    'fez_record_search_key_access_conditions',
                    'fez_record_search_key_license',
                    'fez_record_search_key_rights',
                ],
                ['fez_record_search_key_start_date', 'fez_record_search_key_end_date'],
                ['fez_record_search_key_time_period_start_date', 'fez_record_search_key_time_period_end_date'],
                ['fez_record_search_key_oa_status'],
                ['additionalNotes'],
            ],
        },
        {
            title: 'Project information',
            groups: [['fez_record_search_key_project_name'], ['fez_record_search_key_project_description']],
        },
    ],
    ntro: () => [],
};

export const validateDataCollection = (
    { additionalInformationSection: ais, filesSection: fs },
    { validationErrorsSummary: summary },
) => ({
    additionalInformationSection: {
        ...((!(ais || {}).contactName && {
            contactName: summary.contactName,
        }) ||
            {}),
        ...((!(ais || {}).contactNameId && {
            contactNameId: summary.contactNameId,
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
    },
    filesSection: {
        ...(((fs || {}).depositAgreement !== 'on' && {
            depositAgreement: summary.rek_copyright,
        }) ||
            {}),
    },
});
