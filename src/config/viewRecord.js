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
        },
        453701: {
            className: 'uq',
            url: 'http://guides.library.uq.edu.au/deposit_your_data/terms_and_conditions'
        },
        453702: {
            className: 'uq',
            url: 'http://guides.library.uq.edu.au/deposit_your_data/terms_and_conditions'
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
    files: {
        blacklist: {
            namePrefixRegex: '^(FezACML|stream|web|thumbnail|preview|presmd)',
            descriptionKeywordsRegex: '(ERA |HERDC|not publicly available|corrected thesis|restricted|lodgement|submission|corrections)'
        }
    }
};
