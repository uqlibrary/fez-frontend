import {APP_URL} from 'config';

export const viewRecordsConfig = {
    licenseLinks: {
        453608: {
            className: 'cc-by',
            url: 'http://creativecommons.org/licenses/by/3.0/deed.en_US'
        },
        453609: {
            className: 'cc-by-nd',
            url: 'http://creativecommons.org/licenses/by-nd/3.0/deed.en_US'
        },
        453610: {
            className: 'cc-by-nc',
            url: 'http://creativecommons.org/licenses/by-nc/3.0/deed.en_US'
        },
        453611: {
            className: 'cc-by-nc-nd',
            url: 'http://creativecommons.org/licenses/by-nc-nd/3.0/deed.en_US'
        },
        453612: {
            className: 'cc-by-nc-sa',
            url: 'http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US'
        },
        453613: {
            className: 'cc-by-sa',
            url: 'http://creativecommons.org/licenses/by-sa/3.0/deed.en_US'
        }
    },
    htmlFields: [
        'rek_transcript',
        'rek_notes',
        'rek_additional_notes',
        'rek_project_description',
        'rek_acknowledgements',
        'rek_advisory_statement',
        'rek_related_datasets',
        'rek_related_publications'
    ],
    // apart from rek_date
    dateFields: [
        'rek_date_available',
        'rek_date_recorded',
        'rek_date_photo_taken',
        'rek_date_scanned',
        'rek_start_date',
        'rek_end_date',
        'rek_time_period_start_date',
        'rek_time_period_end_date',
        'rek_project_start_date'
    ],
    dateFieldFormat: {
        'rek_date_available': 'YYYY',
        'rek_date_photo_taken': 'YYYY'
    },
    // some display types have different publication date format
    publicationDateFormat: {
        'Book': 'YYYY',
        'Book Chapter': 'YYYY',
        'Conference Paper': 'YYYY',
        'Data Collection': 'YYYY',
        'Design': 'YYYY'
    },
    metaTags: [
        {
            field: null,
            subkey: 'rek_pid',
            tags: [
                {
                    name: 'DC.Identifier',
                    multiple: false
                }
            ],
            url: (pid) => `${APP_URL}record/${pid}`
        },
        {
            field: 'fez_record_search_key_subject',
            subkey: 'rek_subject',
            tags: [
                {
                    name: 'DC.Subject',
                    multiple: true
                }
            ]
        },
        {
            field: 'fez_record_search_key_file_attachment_name',
            subkey: 'rek_file_attachment_name',
            tags: [
                {
                    name: 'citation_pdf_url',
                    multiple: true,
                }
            ],
            url: (pid, fileName) => `${APP_URL}view/${pid}/${fileName}`.trim()
        },
        {
            field: null,
            subkey: 'rek_title',
            tags: [
                {
                    name: 'DC.Title',
                    multiple: false
                },
                {
                    name: 'citation_title',
                    multiple: false
                }
            ]
        },
        {
            field: 'fez_record_search_key_author',
            subkey: 'rek_author',
            tags: [
                {
                    name: 'DC.Creator',
                    multiple: true
                },
                {
                    name: 'citation_authors',
                    multiple: false
                }
            ]
        },
        {
            field: 'fez_record_search_key_journal_name',
            subkey: 'rek_journal_name',
            tags: [
                {
                    name: 'citation_journal_title',
                    multiple: false
                }
            ]
        },
        {
            field: 'fez_record_search_key_issn',
            subkey: 'rek_issn',
            tags: [
                {
                    name: 'citation_issn',
                    multiple: true
                }
            ]
        },
        {
            field: null,
            subkey: 'rek_date',
            tags: [
                {
                    name: 'DC.Date',
                    multiple: false,
                    format: 'YYYY-MM-DD'
                },
                {
                    name: 'citation_date',
                    multiple: false,
                    format: 'YYYY/MM/DD'
                }
            ]
        },
        {
            field: 'fez_record_search_key_doi',
            subkey: 'rek_doi',
            tags: [
                {
                    name: 'citation_doi',
                    multiple: false
                }
            ]
        },
        {
            field: 'fez_record_search_key_volume_number',
            subkey: 'rek_volume_number',
            tags: [
                {
                    name: 'citation_volume',
                    multiple: false
                }
            ]
        },
        {
            field: 'fez_record_search_key_issue_number',
            subkey: 'rek_issue_number',
            tags: [
                {
                    name: 'citation_issue',
                    multiple: false
                }
            ]
        },
        {
            field: 'fez_record_search_key_start_page',
            subkey: 'rek_start_page',
            tags: [
                {
                    name: 'citation_firstpage',
                    multiple: false
                }
            ]
        },
        {
            field: 'fez_record_search_key_end_page',
            subkey: 'rek_end_page',
            tags: [
                {
                    name: 'citation_lastpage',
                    multiple: false
                }
            ]
        },
        {
            field: 'fez_record_search_key_publisher',
            subkey: 'rek_publisher',
            tags: [
                {
                    name: 'DC.Publisher',
                    multiple: false
                },
                {
                    name: 'citation_publisher',
                    multiple: false
                }
            ]
        },
        {
            field: 'fez_record_search_key_language',
            subkey: 'rek_language',
            tags: [
                {
                    name: 'citation_language',
                    multiple: true
                }
            ]
        },
        {
            field: null,
            subkey: 'rek_description',
            tags: [
                {
                    name: 'DC.Description',
                    multiple: false
                },
                {
                    name: 'citation_description',
                    multiple: false
                }
            ]
        },
        {
            field: 'fez_record_search_key_keywords',
            subkey: 'rek_keywords',
            tags: [
                {
                    name: 'citation_keywords',
                    multiple: false
                }
            ]
        },
        {
            field: 'fez_record_search_key_conference_name',
            subkey: 'rek_conference_name',
            tags: [
                {
                    name: 'citation_conference',
                    multiple: false
                }
            ]
        },
        {
            field: 'fez_record_search_key_contributor',
            subkey: 'rek_contributor',
            tags: [
                {
                    name: 'DC.Contributor',
                    multiple: true
                }
            ]
        },
        {
            field: 'fez_record_search_key_coverage_period',
            subkey: 'rek_coverage_period',
            tags: [
                {
                    name: 'DC.Subject',
                    multiple: true
                }
            ]
        },
        {
            field: 'fez_record_search_key_geographic_area',
            subkey: 'rek_geographic_area',
            tags: [
                {
                    name: 'DC.Subject',
                    multiple: true
                }
            ]
        },
        {
            field: 'fez_record_search_key_isbn',
            subkey: 'rek_isbn',
            tags: [
                {
                    name: 'citation_isbn',
                    multiple: true
                }
            ]
        },
        {
            field: 'fez_record_search_key_report_number',
            subkey: 'rek_report_number',
            tags: [
                {
                    name: 'citation_technical_report_number',
                    multiple: false
                }
            ]
        },
    ]
};
