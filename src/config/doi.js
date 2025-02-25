import {
    PUBLICATION_TYPE_BOOK,
    PUBLICATION_TYPE_BOOK_CHAPTER,
    PUBLICATION_TYPE_CONFERENCE_PAPER,
    PUBLICATION_TYPE_DATA_COLLECTION,
    PUBLICATION_TYPE_DEPARTMENT_TECHNICAL_REPORT,
    PUBLICATION_TYPE_INSTRUMENT,
    PUBLICATION_TYPE_JOURNAL,
    PUBLICATION_TYPE_RESEARCH_REPORT,
    PUBLICATION_TYPE_THESIS,
    PUBLICATION_TYPE_WORKING_PAPER,
} from './general';

// Field order values copied from locale/viewRecord.js:viewRecord.fields
/**
 * @type {{[number]: {fields: {field: string, order: number}[]}}}
 */
export const doiFields = {
    [PUBLICATION_TYPE_BOOK_CHAPTER]: {
        fields: [
            {
                field: 'fez_record_search_key_author',
                order: 1,
            },
            {
                field: 'rek_title',
                order: 2,
            },
            {
                field: 'rek_description',
                order: 2.5,
            },
            {
                field: 'rek_date',
                order: 10,
            },
            {
                field: 'fez_record_search_key_start_page',
                order: 21,
            },
            {
                field: 'fez_record_search_key_end_page',
                order: 22,
            },
        ],
    },

    [PUBLICATION_TYPE_BOOK]: {
        fields: [
            {
                field: 'fez_record_search_key_author',
                order: 1,
            },
            {
                field: 'rek_title',
                order: 2,
            },
            {
                field: 'fez_record_search_key_place_of_publication',
                order: 5,
            },
            {
                field: 'fez_record_search_key_publisher',
                order: 6,
                requiresUQ: true,
            },
            {
                field: 'rek_date',
                order: 7,
            },
            {
                field: 'fez_record_search_key_edition',
                order: 11,
            },
            {
                field: 'fez_record_search_key_series',
                order: 12,
                needsIssnForVisibility: true,
            },
            {
                field: 'fez_record_search_key_isbn',
                order: 13,
            },
            {
                field: 'fez_record_search_key_issn',
                order: 14,
                needsSeriesForVisibility: true,
            },
            {
                field: 'fez_record_search_key_contributor',
                order: 15,
            },
            {
                field: 'fez_record_search_key_start_page',
                order: 17,
            },
            {
                field: 'fez_record_search_key_end_page',
                order: 18,
            },
        ],
    },

    [PUBLICATION_TYPE_CONFERENCE_PAPER]: {
        subtypes: ['Fully published paper'],
        fields: [
            {
                field: 'fez_record_search_key_author',
                order: 1,
            },
            {
                field: 'rek_title',
                order: 2,
            },
            {
                field: 'fez_record_search_key_conference_name',
                order: 5,
                isRequired: true,
            },
            {
                field: 'fez_record_search_key_conference_location',
                order: 7,
            },
            {
                field: 'fez_record_search_key_proceedings_title',
                order: 10,
                isRequired: true,
            },
            {
                field: 'fez_record_search_key_publisher',
                order: 18,
                requiresUQ: true,
            },
            {
                field: 'rek_date',
                order: 19,
            },
            {
                field: 'fez_record_search_key_isbn',
                order: 23,
            },
            {
                field: 'fez_record_search_key_issn',
                order: 24,
            },
            {
                field: 'fez_record_search_key_start_page',
                order: 28,
            },
            {
                field: 'fez_record_search_key_end_page',
                order: 29,
            },
        ],
    },

    [PUBLICATION_TYPE_DATA_COLLECTION]: {
        fields: [
            {
                field: 'fez_record_search_key_author',
                order: 5,
            },
            {
                field: 'rek_title',
                order: 7,
            },
            {
                field: 'rek_description',
                order: 7.5,
            },
            {
                // Manually added (not found in locale file mentioned above)
                field: 'fez_record_search_key_org_name',
                order: 7.7,
            },
            {
                field: 'fez_record_search_key_publisher',
                order: 26,
                requiresUQ: true,
            },
            {
                field: 'rek_date',
                order: 27,
            },
        ],
    },

    [PUBLICATION_TYPE_DEPARTMENT_TECHNICAL_REPORT]: {
        fields: [
            {
                field: 'fez_record_search_key_author',
                order: 1,
            },
            {
                field: 'rek_title',
                order: 2,
            },
            {
                field: 'fez_record_search_key_parent_publication',
                order: 3.5,
            },
            {
                // Manually added (not found in locale file mentioned above)
                field: 'fez_record_search_key_org_name',
                order: 3.7,
            },
            {
                field: 'fez_record_search_key_org_unit_name',
                order: 4,
            },
            {
                field: 'fez_record_search_key_report_number',
                order: 7,
            },
            {
                field: 'fez_record_search_key_series',
                order: 8,
                needsIssnForVisibility: true,
            },
            {
                field: 'rek_date',
                order: 9,
            },
            {
                field: 'fez_record_search_key_start_page',
                order: 10,
            },
            {
                field: 'fez_record_search_key_end_page',
                order: 11,
            },
            {
                field: 'fez_record_search_key_publisher',
                order: 13,
                requiresUQ: true,
            },
            {
                // Manually added (not found in locale file mentioned above)
                field: 'fez_record_search_key_place_of_publication',
                order: 13.5,
            },
            {
                field: 'fez_record_search_key_isbn',
                order: 18,
            },
            {
                field: 'fez_record_search_key_issn',
                order: 19,
                needsSeriesForVisibility: true,
            },
        ],
    },

    [PUBLICATION_TYPE_INSTRUMENT]: {
        fields: [
            {
                field: 'fez_record_search_key_author',
                order: 1,
            },
            {
                field: 'rek_title',
                order: 2,
            },
            {
                field: 'rek_description',
                order: 3,
            },
            {
                field: 'fez_record_search_key_publisher',
                order: 4,
                requiresUQ: true,
            },
            {
                field: 'rek_date',
                order: 5,
            },
            {
                field: 'fez_record_search_key_contributor',
                order: 6,
            },
            {
                field: 'fez_record_search_key_start_date',
                order: 7,
            },
            {
                field: 'fez_record_search_key_end_date',
                order: 8,
            },
            {
                field: 'fez_record_search_key_alternate_identifier',
                order: 9,
            },
            {
                field: 'fez_record_search_key_resource_type',
                order: 10,
            },
        ],
    },

    [PUBLICATION_TYPE_JOURNAL]: {
        fields: [
            {
                field: 'rek_title',
                order: 1,
            },
            {
                field: 'rek_date',
                order: 5,
            },
            {
                field: 'fez_record_search_key_volume_number',
                order: 6,
            },
            {
                field: 'fez_record_search_key_issue_number',
                order: 7,
            },
            {
                field: 'fez_record_search_key_issn',
                order: 9,
                isRequired: true,
            },
            {
                field: 'fez_record_search_key_contributor',
                order: 14,
            },
            {
                field: 'fez_record_search_key_place_of_publication',
                order: 15,
            },
            {
                field: 'fez_record_search_key_publisher',
                order: 16,
                requiresUQ: true,
            },
        ],
    },

    [PUBLICATION_TYPE_RESEARCH_REPORT]: {
        fields: [
            {
                field: 'fez_record_search_key_author',
                order: 1,
            },
            {
                field: 'rek_title',
                order: 2,
            },
            {
                field: 'fez_record_search_key_parent_publication',
                order: 4,
            },
            {
                // Manually added (not found in locale file mentioned above)
                field: 'fez_record_search_key_org_unit_name',
                order: 4.5,
            },
            {
                field: 'rek_date',
                order: 6,
            },
            {
                field: 'fez_record_search_key_isbn',
                order: 7,
            },
            {
                field: 'fez_record_search_key_issn',
                order: 8,
                needsSeriesForVisibility: true,
            },
            {
                field: 'fez_record_search_key_publisher',
                order: 11,
                requiresUQ: true,
            },
            {
                field: 'fez_record_search_key_series',
                order: 12,
                needsIssnForVisibility: true,
            },
            {
                field: 'fez_record_search_key_place_of_publication',
                order: 13,
            },
            {
                // Manually added (not found in locale file mentioned above)
                field: 'fez_record_search_key_org_name',
                order: 13.5,
            },
            {
                field: 'fez_record_search_key_start_page',
                order: 14,
            },
            {
                field: 'fez_record_search_key_end_page',
                order: 15,
            },
            {
                field: 'fez_record_search_key_report_number',
                order: 20,
            },
        ],
    },

    [PUBLICATION_TYPE_THESIS]: {
        fields: [
            {
                field: 'fez_record_search_key_author',
                order: 1,
            },
            {
                field: 'rek_title',
                order: 2,
            },
            {
                field: 'fez_record_search_key_org_unit_name',
                order: 4,
            },
            {
                field: 'fez_record_search_key_org_name',
                order: 5,
                requiresUQ: true,
            },
            {
                field: 'rek_date',
                order: 7,
            },
            {
                field: 'rek_genre_type',
                order: 8,
            },
        ],
    },

    [PUBLICATION_TYPE_WORKING_PAPER]: {
        fields: [
            {
                field: 'fez_record_search_key_author',
                order: 1,
            },
            {
                field: 'rek_title',
                order: 2,
            },
            {
                field: 'fez_record_search_key_parent_publication',
                order: 4.5,
            },
            {
                field: 'fez_record_search_key_org_unit_name',
                order: 5,
            },
            {
                field: 'fez_record_search_key_org_name',
                order: 6,
            },
            {
                field: 'fez_record_search_key_series',
                order: 8,
                needsIssnForVisibility: true,
            },
            {
                field: 'fez_record_search_key_report_number',
                order: 9,
            },
            {
                field: 'rek_date',
                order: 10,
            },
            {
                field: 'fez_record_search_key_publisher',
                order: 12,
                requiresUQ: true,
            },
            {
                field: 'fez_record_search_key_start_page',
                order: 14,
            },
            {
                field: 'fez_record_search_key_end_page',
                order: 15,
            },
            {
                field: 'fez_record_search_key_issn',
                order: 21,
                needsSeriesForVisibility: true,
            },
        ],
    },
};

// Collection with RCC datasets
export const rccDatasetCollection = 'UQ:5d1d4fb';
