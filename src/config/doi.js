import { PUBLICATION_TYPE_RESEARCH_REPORT } from './general';

export const DOI_ORG_PREFIX = '10.14264';

// Field order values copied from locale/viewRecord.js:viewRecord.fields
export const doiFields = {
    [PUBLICATION_TYPE_RESEARCH_REPORT]: {
        crossRefType: 'report-paper',
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
            },
            {
                field: 'fez_record_search_key_publisher',
                order: 11,
            },
            {
                field: 'fez_record_search_key_place_of_publication',
                order: 13,
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
};
