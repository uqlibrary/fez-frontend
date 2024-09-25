import { pathConfig } from 'config';

const prefixFileNameSuffix = (prefix = '', fileName, suffix = '', extension) =>
    `${prefix}${prefix !== '' ? '_' : ''}${fileName.substr(0, fileName.lastIndexOf('.'))}${
        suffix !== '' ? '_' : ''
    }${suffix}.${extension}`;

// const prefixFileNameSuffix = (prefix, suffix, fileName, extension) =>
//     `${prefix}_${fileName.substr(0, fileName.lastIndexOf('.'))}_${suffix}.${extension}`;

export const viewRecordsConfig = {
    genericDataEmail: 'data@library.uq.edu.au',
    licenseLinks: {
        453608: {
            className: 'cc-by',
            url: 'http://creativecommons.org/licenses/by/3.0/deed.en_US',
        },
        453609: {
            className: 'cc-by-nd',
            url: 'http://creativecommons.org/licenses/by-nd/3.0/deed.en_US',
        },
        453610: {
            className: 'cc-by-nc',
            url: 'http://creativecommons.org/licenses/by-nc/3.0/deed.en_US',
        },
        453611: {
            className: 'cc-by-nc-nd',
            url: 'http://creativecommons.org/licenses/by-nc-nd/3.0/deed.en_US',
        },
        453612: {
            className: 'cc-by-nc-sa',
            url: 'http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US',
        },
        453613: {
            className: 'cc-by-sa',
            url: 'http://creativecommons.org/licenses/by-sa/3.0/deed.en_US',
        },
        456710: {
            className: 'cc-by',
            url: 'http://creativecommons.org/licenses/by/4.0/deed.en',
        },
        456711: {
            className: 'cc-by-sa',
            url: 'http://creativecommons.org/licenses/by-sa/4.0/deed.en',
        },
        456712: {
            className: 'cc-by-nd',
            url: 'http://creativecommons.org/licenses/by-nd/4.0/deed.en',
        },
        456713: {
            className: 'cc-by-nc',
            url: 'http://creativecommons.org/licenses/by-nc/4.0/deed.en',
        },
        456714: {
            className: 'cc-by-nc-sa',
            url: 'http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en',
        },
        456715: {
            className: 'cc-by-nc-nd',
            url: 'http://creativecommons.org/licenses/by-nc-nd/4.0/deed.en',
        },
        // Permitted Re-use with Acknowledgement
        453701: {
            className: 'uq',
            url: 'https://guides.library.uq.edu.au/deposit-your-data/license-reuse-with-acknowledgement',
        },
        // Permitted Non-commercial Re-use with Acknowledgement
        453702: {
            className: 'uq',
            url: 'https://guides.library.uq.edu.au/deposit_your_data/terms_and_conditions',
        },
        // Permitted Re-Use with Commercial Use Restriction
        454104: {
            className: 'uq',
            url: 'https://guides.library.uq.edu.au/deposit-your-data/license-reuse-noncommercial',
        },
        // Permitted Re-Use with Share Alike Requirement
        454105: {
            className: 'uq',
            url: 'https://guides.library.uq.edu.au/deposit-your-data/license-reuse-share-alike',
        },
        // Permitted reuse only with a Data Sharing Agreement in place between UQ and recipient
        456807: {
            className: 'uq',
            url: 'https://guides.library.uq.edu.au/deposit-your-data/license-reuse-data-agreement',
        },
    },
    htmlFields: [
        'rek_transcript',
        'rek_notes',
        'rek_project_description',
        'rek_acknowledgements',
        'rek_advisory_statement',
        'rek_related_datasets',
        'rek_related_publications',
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
        'rek_project_start_date',
    ],
    dateFieldFormat: {
        rek_date_available: 'YYYY',
        rek_date_photo_taken: 'YYYY',
    },
    // some display types have different publication date format
    publicationDateFormat: {
        Book: 'YYYY',
        'Book Chapter': 'YYYY',
        'Conference Paper': 'YYYY',
        'Data Collection': 'YYYY',
    },
    files: {
        blacklist: {
            namePrefixRegex: '^(FezACML|stream|web_|thumbnail_|preview_|presmd)',
            nameSuffixRegex: '(_t\\.)',
            collections: ['UQ:413806', 'UQ:357493', 'UQ:211157', 'UQ:342107'],
        },
        thumbnailFileName: fileName => [
            prefixFileNameSuffix('thumbnail', fileName, 'compressed_t', 'jpg'),
            prefixFileNameSuffix('thumbnail', fileName, 'override_t', 'jpg'),
            prefixFileNameSuffix('thumbnail', fileName, 't', 'jpg'),
            prefixFileNameSuffix('thumbnail', fileName, '', 'jpg'),
        ],
        previewFileName: fileName => [
            prefixFileNameSuffix('preview', fileName, 'compressed_t', 'jpg'),
            prefixFileNameSuffix('preview', fileName, 'override_t', 'jpg'),
            prefixFileNameSuffix('preview', fileName, 't', 'jpg'),
            prefixFileNameSuffix('preview', fileName, '', 'jpg'),
        ],
        webFileName: fileName => [
            prefixFileNameSuffix('web', fileName, 'compressed_t', 'jpg'),
            prefixFileNameSuffix('web', fileName, 'override_t', 'jpg'),
            prefixFileNameSuffix('web', fileName, 't', 'jpg'),
            prefixFileNameSuffix('web', fileName, '', 'jpg'),
        ],
    },
    metaTags: [
        {
            searchKey: null,
            subkey: 'rek_pid',
            tags: [
                {
                    name: 'DC.Identifier',
                    isMultiple: false,
                },
            ],
            url: pid => pathConfig.records.view(pid, true),
        },
        {
            searchKey: 'fez_record_search_key_subject',
            subkey: 'rek_subject',
            tags: [
                {
                    name: 'DC.Subject',
                    isMultiple: true,
                },
            ],
        },
        {
            searchKey: null,
            subkey: 'fez_datastream_info',
            tags: [
                {
                    name: 'citation_pdf_url',
                    isMultiple: true,
                },
            ],
            // TODO add dsi_checksum as a third param, if this function ever gets used in the future
            url: (pid, fileName) => pathConfig.file.url(pid, fileName),
        },
        {
            searchKey: null,
            subkey: 'rek_title',
            tags: [
                {
                    name: 'DC.Title',
                    isMultiple: false,
                },
                {
                    name: 'citation_title',
                    isMultiple: false,
                },
            ],
        },
        {
            searchKey: 'fez_record_search_key_contributor',
            subkey: 'rek_contributor',
            tags: [
                {
                    name: 'DC.Contributor',
                    isMultiple: true,
                },
            ],
        },
        {
            searchKey: 'fez_record_search_key_author',
            subkey: 'rek_author',
            tags: [
                {
                    name: 'DC.Creator',
                    isMultiple: true,
                },
                {
                    name: 'citation_authors',
                    isMultiple: false,
                },
            ],
        },
        {
            searchKey: 'fez_record_search_key_journal_name',
            subkey: 'rek_journal_name',
            tags: [
                {
                    name: 'citation_journal_title',
                    isMultiple: false,
                },
            ],
        },
        {
            searchKey: 'fez_record_search_key_issn',
            subkey: 'rek_issn',
            tags: [
                {
                    name: 'citation_issn',
                    isMultiple: true,
                },
            ],
        },
        {
            searchKey: null,
            subkey: 'rek_date',
            tags: [
                {
                    name: 'DC.Date',
                    isMultiple: false,
                    format: 'YYYY-MM-DD',
                },
                {
                    name: 'citation_date',
                    isMultiple: false,
                    format: 'YYYY/MM/DD',
                },
            ],
        },
        {
            searchKey: 'fez_record_search_key_start_date',
            subkey: 'rek_start_date',
            tags: [
                {
                    name: 'citation_start_date',
                    isMultiple: false,
                    format: 'YYYY/MM/DD',
                },
            ],
        },
        {
            searchKey: 'fez_record_search_key_end_date',
            subkey: 'rek_end_date',
            tags: [
                {
                    name: 'citation_end_date',
                    isMultiple: false,
                    format: 'YYYY/MM/DD',
                },
            ],
        },
        {
            searchKey: 'fez_record_search_key_doi',
            subkey: 'rek_doi',
            tags: [
                {
                    name: 'citation_doi',
                    isMultiple: false,
                },
            ],
        },
        {
            searchKey: 'fez_record_search_key_volume_number',
            subkey: 'rek_volume_number',
            tags: [
                {
                    name: 'citation_volume',
                    isMultiple: false,
                },
            ],
        },
        {
            searchKey: 'fez_record_search_key_issue_number',
            subkey: 'rek_issue_number',
            tags: [
                {
                    name: 'citation_issue',
                    isMultiple: false,
                },
            ],
        },
        {
            searchKey: 'fez_record_search_key_start_page',
            subkey: 'rek_start_page',
            tags: [
                {
                    name: 'citation_firstpage',
                    isMultiple: false,
                },
            ],
        },
        {
            searchKey: 'fez_record_search_key_end_page',
            subkey: 'rek_end_page',
            tags: [
                {
                    name: 'citation_lastpage',
                    isMultiple: false,
                },
            ],
        },
        {
            searchKey: 'fez_record_search_key_publisher',
            subkey: 'rek_publisher',
            tags: [
                {
                    name: 'DC.Publisher',
                    isMultiple: false,
                },
                {
                    name: 'citation_publisher',
                    isMultiple: false,
                },
            ],
        },
        {
            searchKey: 'fez_record_search_key_language',
            subkey: 'rek_language',
            tags: [
                {
                    name: 'citation_language',
                    isMultiple: true,
                },
            ],
        },
        {
            searchKey: null,
            subkey: 'rek_description',
            tags: [
                {
                    name: 'DC.Description',
                    isMultiple: false,
                },
                {
                    name: 'citation_abstract',
                    isMultiple: false,
                },
            ],
        },
        {
            searchKey: 'fez_record_search_key_keywords',
            subkey: 'rek_keywords',
            tags: [
                {
                    name: 'citation_keywords',
                    isMultiple: false,
                },
            ],
        },
        {
            searchKey: 'fez_record_search_key_conference_name',
            subkey: 'rek_conference_name',
            tags: [
                {
                    name: 'citation_conference',
                    isMultiple: false,
                },
            ],
        },
        {
            searchKey: 'fez_record_search_key_coverage_period',
            subkey: 'rek_coverage_period',
            tags: [
                {
                    name: 'DC.Subject',
                    isMultiple: true,
                },
            ],
        },
        {
            searchKey: 'fez_record_search_key_geographic_area',
            subkey: 'rek_geographic_area',
            tags: [
                {
                    name: 'DC.Subject',
                    isMultiple: true,
                },
            ],
        },
        {
            searchKey: 'fez_record_search_key_isbn',
            subkey: 'rek_isbn',
            tags: [
                {
                    name: 'citation_isbn',
                    isMultiple: true,
                },
            ],
        },
        {
            searchKey: 'fez_record_search_key_report_number',
            subkey: 'rek_report_number',
            tags: [
                {
                    name: 'citation_technical_report_number',
                    isMultiple: false,
                },
            ],
        },
    ],
};

export const STATE_ADDED = 'A';
export const STATE_DELETED = 'D';
