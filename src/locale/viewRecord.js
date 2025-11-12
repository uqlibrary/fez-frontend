export default {
    viewRecord: {
        fireFoxAlert: {
            type: 'help_outline',
            title: 'FireFox Users',
            message: 'Please RIGHT CLICK then select link SAVE AS option to save and play video files',
        },
        linkTexts: {
            journalOpenAccessPolicyLink: "Check publisher's open access policy",
            eraJournalListed: '(ERA [year] Journal(s) Listed)',
        },
        sections: {
            publicationDetails: 'Type & Collection',
            publicationDetailsCustom: {
                Community: 'Type',
                Collection: 'Type & Community',
            },
            grantInformation: 'Grant information',
            additionalInformation: {
                title: 'Additional information',
                license: {
                    link: {
                        text: 'View license details',
                    },
                },
                sdg: {
                    link: {
                        text: 'About SDGs',
                        url: 'https://sdgs.un.org/goals',
                    },
                },
            },
            relatedPublications: {
                title: 'Related works and datasets in eSpace',
                depositedBy: 'deposited',
                currentRecord: 'Current Record',
            },
            availableVersions: 'Available versions',
            files: {
                title: 'Files',
                fileName: 'File name',
                description: 'Description',
                embargoDate: 'Open access after [embargoDate]',
                size: 'Size',
                culturalSensitivityStatement:
                    'Cultural Sensitivity Statement - Be advised that some files may contain content which is of a sensitive nature to some cultures or tastes.',
                linkTitle: 'Click to open this file in a new window - [filename] - [description] - [size]',
                preview: {
                    videoTitle: 'Video preview',
                    imageTitle: 'Image preview',
                    openOriginal: 'Open original file in a new window',
                    openWeb: 'Open web version file in a new window',
                    close: 'Close',
                    videoLoadingMessage: 'Loading',
                },
            },
            links: {
                title: 'Links',
                headerTitles: {
                    link: 'Link (will open in a new window)',
                    description: 'Description',
                    oaStatus: ' ',
                },
                linkMissingDescription: 'No description available',
                linkMissingDescriptionTitle: 'Click to open link in a new window',
                rdmLinkMissingDescriptionTitle: 'Access this dataset',
                doiDescription: 'Full text from publisher',
                openAccessLabel: 'Open Access - [oa_status] - Free to read',
                openAccessEmbargoedLabel: '[oa_status] - Open access after [embargo_date]',
                securityLocked: 'You do not have access to this file',
                labelNoOpenAccessLookup: 'Open Access - Embargo applies',
                labelOpenAccessNoStatus: 'Open Access - Free to read',
                labelClosedAccess: 'Closed access',
                pubmedCentralLinkDescription: 'Full text from PubMed Central',
                embargoedUntil: 'Open access after [embargo_date] ',
                googleScholar: {
                    linkPrefix: 'https://scholar.google.com/scholar?q=intitle:%22[title]%22',
                    linkDescription: 'Search Google Scholar for this open access article',
                },
                rdmRequestAccessTitle: 'Send email to [data_email]',
            },
            abstract: {
                default: 'Abstract',
                Journal: 'Summary/Description',
                'Data Collection': 'Dataset description',
                Design: 'Abstract/Description',
            },
            ntro: {
                title: 'Non-traditional research output metadata',
                fields: {
                    abstract: {
                        label: 'Abstract/Description (for public view)',
                        description:
                            'Enter a statement (800 characters or less, approximately 100 words) that summarises the work',
                    },
                    series: {
                        floatingLabelText: 'Series',
                        hintText: 'Enter the name of publication, performance, recording, or event series',
                    },
                    volume: {
                        label: 'Volume',
                    },
                    issue: {
                        label: 'Issue',
                    },
                    startPage: {
                        label: 'Start page',
                    },
                    endPage: {
                        label: 'End page',
                    },
                    extent: {
                        label: 'Extent',
                        placeholder: 'Total pages, size, or duration',
                    },
                    physicalDescription: {
                        label: 'Physical description',
                        placeholder: 'Type of work, e.g. Video, Map, Oil painting',
                    },
                    audienceSize: {
                        label: 'Audience size',
                    },
                    peerReviewActivity: {
                        label: 'Quality indicators',
                    },
                    notes: {
                        label: 'Notes',
                    },
                },
            },
        },
        headings: {
            default: {
                rek_title: 'Title',
                rek_date: 'Publication/Start date',
                rek_subtype: 'Sub-type',
                rek_genre: 'Type',
                rek_genre_type: 'Sub-type',
                rek_description: 'Abstract',
                fez_record_search_key_author: 'Author(s)',
                fez_record_search_key_contributor: 'Editor(s)',
                fez_record_search_key_supervisor: 'Supervisor(s)',
                fez_record_search_key_translated_title: 'Translated title',
                fez_record_search_key_language_of_title: 'Language of title',
                fez_record_search_key_alternative_title: 'Alternative title',
                fez_record_search_key_place_of_publication: 'Place of publication',
                fez_record_search_key_publisher: 'Publisher',
                fez_record_search_key_date_available: 'Year available',
                fez_record_search_key_doi: 'DOI',
                fez_record_search_key_isbn: 'ISBN',
                fez_record_search_key_issn: 'ISSN',
                fez_record_search_key_article_number: 'Article number',
                fez_record_search_key_volume_number: 'Volume',
                fez_record_search_key_issue_number: 'Issue',
                fez_record_search_key_chapter_number: 'Chapter number',
                fez_record_search_key_start_page: 'Start page',
                fez_record_search_key_end_page: 'End page',
                fez_record_search_key_total_pages: 'Total pages',
                fez_record_search_key_total_chapters: 'Total chapters',
                fez_record_search_key_language: 'Language',
                fez_record_search_key_subject: 'Subject(s)',
                fez_record_search_key_sdg_source: 'Sustainable Development Goal(s)',
                fez_record_search_key_journal_name: 'Journal name',
                fez_record_search_key_language_of_journal_name: 'Language of journal name',
                fez_record_search_key_translated_journal_name: 'Translated journal name',
                fez_record_search_key_book_title: 'Title of book',
                fez_record_search_key_translated_book_title: 'Translated title of book',
                fez_record_search_key_language_of_book_title: 'Language of book title',
                fez_record_search_key_keywords: 'Keyword(s)',
                fez_record_search_key_series: 'Series',
                fez_record_search_key_edition: 'Edition',
                fez_record_search_key_building_materials: 'Building materials',
                fez_record_search_key_architect_name: 'Architect',
                fez_record_search_key_architectural_features: 'Architectural features',
                fez_record_search_key_alternate_identifier: 'Alternate identifier',
                fez_record_search_key_instrument_type: 'Instrument type',
                fez_record_search_key_measured_variable: 'Measured variable',
                fez_record_search_key_model: 'Model',
                fez_record_search_key_oa_status: 'Open access status',
                fez_record_search_key_oa_status_type: 'Open access status type',
                fez_record_search_key_raid: 'RAiD',
                fez_record_search_key_conference_name: 'Conference name',
                fez_record_search_key_translated_conference_name: 'Translated conference name',
                fez_record_search_key_conference_location: 'Conference Location',
                fez_record_search_key_conference_dates: 'Conference dates',
                fez_record_search_key_section: 'Section',
                fez_record_search_key_convener: 'Convener',
                fez_record_search_key_proceedings_title: 'Proceedings title',
                fez_record_search_key_language_of_proceedings_title: 'Language of proceedings title',
                fez_record_search_key_translated_proceedings_title: 'Translated proceedings title',
                fez_record_search_key_org_unit_name: 'School, Centre or Institute',
                fez_record_search_key_org_name: 'Institution',
                fez_record_search_key_access_conditions: 'Access conditions',
                fez_record_search_key_seo_code: 'ANZSRC Socio-Economic Objective (SEO) Code',
                fez_record_search_key_ands_collection_type: 'Collection type',
                fez_record_search_key_contact_details_email: 'Contact email',
                fez_record_search_key_contributor_identifier: 'Editor(s) Identifiers',
                fez_record_search_key_author_role: 'Author(s) role',
                fez_record_search_key_data_volume: 'Data Volume',
                fez_record_search_key_project_id: 'Project ID',
                fez_record_search_key_project_description: 'Project description',
                fez_record_search_key_project_name: 'Project name',
                fez_record_search_key_license: 'Licence and terms of access',
                fez_record_search_key_geographic_area: 'Geographic area',
                fez_record_search_key_rights: 'Copyright notice',
                rek_ci_notice_attribution_incomplete: 'Cultural Institution Notice',
                fez_record_search_key_software_required: 'Software required',
                fez_record_search_key_type_of_data: 'Type',
                fez_record_search_key_original_format: 'Original format',
                fez_record_search_key_job_number: 'Job number',
                fez_record_search_key_scale: 'Scale',
                fez_record_search_key_creator_name: 'Creator',
                fez_record_search_key_source: 'Source',
                fez_record_search_key_transcript: 'Transcript',
                fez_record_search_key_length: 'Duration',
                fez_record_search_key_date_recorded: 'Recording date',
                fez_record_search_key_location: 'Location',
                fez_record_search_key_identifier: 'Identifier',
                fez_record_search_key_alternate_genre: 'Genres',
                fez_record_search_key_acknowledgements: 'Acknowledgements',
                fez_record_search_key_advisory_statement: 'Advisory statement',
                fez_record_search_key_sensitive_handling_note_id: 'Sensitive Handling Note',
                fez_record_search_key_sensitive_handling_note_other: 'Sensitive Handling Note (Other)',
                fez_record_search_key_report_number: 'Report number',
                fez_record_search_key_parent_publication: 'Parent work',
                fez_record_search_key_related_publications: 'Related works',
                fez_record_search_key_related_datasets: 'Related datasets',
                fez_record_search_key_time_period_start_date: 'Time coverage start date',
                fez_record_search_key_time_period_end_date: 'Time coverage end date',
                fez_record_search_key_start_date: 'Collection start date',
                fez_record_search_key_end_date: 'Collection end date',
                fez_record_search_key_project_start_date: 'Project start date',
                fez_record_search_key_construction_date: 'Date of construction',
                fez_record_search_key_date_photo_taken: 'Date photo taken',
                fez_record_search_key_date_scanned: 'Date scanned',
                fez_record_search_key_category: 'Category',
                fez_record_search_key_subcategory: 'Subcategory',
                fez_record_search_key_condition: 'Condition',
                fez_record_search_key_period: 'Period',
                fez_record_search_key_resource_type: 'Resource type',
                fez_record_search_key_style: 'Style',
                fez_record_search_key_structural_systems: 'Structural systems & elements',
                fez_record_search_key_interior_features: 'Interior features',
                fez_record_search_key_surrounding_features: 'Surrounding features',
                fez_record_search_key_newspaper: 'Newspaper',
                fez_record_search_key_translated_newspaper: 'Translated newspaper',
                fez_record_search_key_patent_number: 'Patent number',
                fez_record_search_key_country_of_issue: 'Country of origin',
                fez_record_search_key_herdc_code: 'HERDC code',
                fez_record_search_key_herdc_status: 'HERDC status',
                fez_record_search_key_institutional_status: 'Institutional status',
                fez_record_search_key_notes: 'Additional notes',
                grantInformation: {
                    fez_record_search_key_grant_agency: 'Grant agency',
                    fez_record_search_key_grant_id: 'Grant ID',
                    fez_record_search_key_grant_text: 'Grant text',
                },
                publicationDetails: {
                    rek_display_type: 'Type of work',
                    rek_subtype: 'Sub-type',
                    fez_record_search_key_ismemberof: 'Collections',
                    fez_record_search_key_ismemberof_custom: {
                        Collection: plural => `${plural ? 'Communities' : 'Community'}`,
                    },
                },
            },
            Community: {
                rek_description: 'Abstract/Description',
            },
            Collection: {
                rek_description: 'Abstract/Description',
            },
            'Audio Document': {
                rek_date: 'Date',
                fez_record_search_key_author: 'Creator(s)',
                fez_record_search_key_contributor: 'Contributor(s)',
                fez_record_search_key_location: 'Place of recording',
                fez_record_search_key_geographic_area: 'Geographic co-ordinates',
                fez_record_search_key_rights: 'Rights',
                fez_record_search_key_license: 'Licence',
            },
            Book: {
                rek_date: 'Publication year',
                fez_record_search_key_original_format: 'Physical description',
            },
            'Book Chapter': {
                rek_date: 'Publication year',
                rek_title: 'Title of chapter',
                fez_record_search_key_translated_title: 'Translated title of chapter',
            },
            'Conference Paper': {
                rek_date: 'Publication year',
                rek_description: 'Abstract',
                rek_title: 'Title of paper',
                fez_record_search_key_translated_title: 'Translated title of paper',
            },
            'Conference Proceedings': {
                rek_title: 'Title of proceedings',
                fez_record_search_key_date_available: 'Collection year',
                fez_record_search_key_translated_title: 'Translated title of proceedings',
            },
            'Creative Work': {
                rek_genre: 'Type',
                fez_record_search_key_contributor: isNtro => (isNtro ? 'Contributor(s)' : 'Editor(s)'),
                fez_record_search_key_start_date: 'Start date',
                fez_record_search_key_end_date: 'End date',
                rek_total_pages: 'Extent',
            },
            'Data Collection': {
                rek_date: 'Publication year',
                rek_genre: 'Collection type',
                rek_title: 'Dataset name',
                rek_description: 'Dataset description',
                fez_record_search_key_author: 'Creator(s) name',
                fez_record_search_key_contributor: 'Contact(s) name',
                fez_record_search_key_author_role: 'Creator(s) role',
                fez_record_search_key_geographic_area: 'Geographic co-ordinates',
                fez_record_search_key_type_of_data: 'Type of data',
                fez_record_search_key_grant_id: 'Grant ID',
                fez_record_search_key_subject: 'ANZSRC Field of Research (FoR) Code',
                fez_record_search_key_related_publications: 'Additional related publication(s)',
                fez_record_search_key_related_datasets: 'Additional related dataset(s)',
            },
            'Department Technical Report': {},
            Design: {
                rek_date: 'Date',
                rek_description: 'Abstract/Description',
                fez_record_search_key_date_available: 'Year available',
                fez_record_search_key_end_date: 'End date',
                fez_record_search_key_author: 'Designer(s)',
                fez_record_search_key_geographic_area: 'Geographic co-ordinates',
                fez_record_search_key_contributor: 'Contributor(s)',
                fez_record_search_key_original_format: 'Physical description',
                fez_record_search_key_rights: 'Rights',
            },
            'Digilib Image': {
                fez_record_search_key_author: 'Photographer(s)',
                fez_record_search_key_rights: 'Rights',
            },
            'Generic Document': {
                rek_date: 'Date',
                fez_record_search_key_subject: 'Research fields, Courses and Disciplines',
                fez_record_search_key_contributor: 'Contributor(s)',
            },
            Image: {
                rek_date: 'Date',
                fez_record_search_key_author: 'Creator(s)',
                fez_record_search_key_contributor: 'Contributor(s)',
                fez_record_search_key_rights: 'Rights',
                fez_record_search_key_geographic_area: 'Geographic co-ordinates',
            },
            Instrument: {
                rek_date: 'Publication Date',
                rek_description: 'Description',
                rek_title: 'Instrument Name',
                fez_record_search_key_author: 'Manufacturer(s)',
                fez_record_search_key_contributor: 'Owner',
                fez_record_search_key_contact_details_email: 'Owner Email',
                fez_record_search_key_contributor_identifier: 'Owner Identifier',
                fez_record_search_key_doi: 'Instrument Identifier',
                fez_record_search_key_start_date: 'Commissioned Date',
                fez_record_search_key_end_date: 'Decommissioned Date',
            },
            Journal: {
                rek_title: 'Title of journal',
                rek_description: 'Summary/Description',
            },
            Manuscript: {
                rek_date: 'Date',
                fez_record_search_key_author: 'Creator(s)',
                fez_record_search_key_contributor: 'Contributor(s)',
                fez_record_search_key_rights: 'Rights',
                fez_record_search_key_geographic_area: 'Geographic co-ordinates',
            },
            'Newspaper Article': {},
            'Reference Entry': {
                rek_title: 'Title of entry',
                fez_record_search_key_translated_title: 'Translated title of entry',
            },
            'Research Report': {
                rek_title: 'Title of report',
                fez_record_search_key_translated_title: 'Translated title of report',
                fez_record_search_key_contributor: 'Contributor(s)',
            },
            Patent: {
                rek_title: 'Patent title',
                rek_date: 'Date of issue',
                fez_record_search_key_author: 'Creator(s)',
                fez_record_search_key_publisher: 'Patent owner',
                fez_record_search_key_contributor: 'Contributor(s)',
                fez_record_search_key_translated_title: 'Translated title of patent',
            },
            Preprint: {
                rek_date: 'Date',
            },
            'Seminar Paper': {
                fez_record_search_key_series: 'Seminar series',
            },
            Thesis: {
                rek_title: 'Thesis title',
                rek_genre_type: 'Thesis type',
                fez_record_search_key_org_unit_name: 'School, Centre or Institute',
                fez_record_search_key_translated_title: 'Translated thesis title',
            },
            'Video Document': {
                rek_date: 'Date',
                fez_record_search_key_original_format: 'Format',
                fez_record_search_key_author: 'Creator(s)',
                fez_record_search_key_contributor: 'Contributor(s)',
                fez_record_search_key_rights: 'Rights',
            },
            'Working Paper': {},
            NTRO: {
                significance: 'Scale/Significance of work',
                impactStatement: 'Creator research statement',
                ntroAbstract: 'Abstract/Description',
                fez_record_search_key_ismn: 'ISMN',
                fez_record_search_key_isrc: 'ISRC',
                rek_series: 'Series',
                rek_volume_number: 'Volume',
                rek_issue_number: 'Issue',
                rek_start_page: 'Start page',
                rek_end_page: 'End page',
                rek_total_pages: 'Extent',
                rek_original_format: 'Physical description',
                rek_audience_size: 'Audience size',
                qualityIndicators: 'Quality indicators',
                rek_language: 'Language(s)',
            },
        },
        fields: {
            'Audio Document': [
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
                    field: 'fez_record_search_key_translated_title',
                    order: 3,
                },
                {
                    field: 'fez_record_search_key_place_of_publication',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 6,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 6.5,
                },
                {
                    field: 'rek_date',
                    order: 7,
                },
                {
                    field: 'fez_record_search_key_date_recorded',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 8.5,
                },
                {
                    field: 'fez_record_search_key_location',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_geographic_area',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_date_available',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_series',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_isbn',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_issn',
                    order: 15,
                },
                {
                    field: 'fez_record_search_key_type_of_data',
                    order: 16,
                },
                {
                    field: 'fez_record_search_key_original_format',
                    order: 17,
                },
                {
                    field: 'fez_record_search_key_source',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_length',
                    order: 19,
                },
                {
                    field: 'fez_record_search_key_language',
                    order: 20,
                },
                {
                    field: 'fez_record_search_key_rights',
                    order: 21,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 22,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 22.1,
                },
                {
                    field: 'fez_record_search_key_alternate_genre',
                    order: 23,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 24,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 25,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 25.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 26,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 27,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 27.5,
                },
                {
                    field: 'fez_record_search_key_acknowledgements',
                    order: 28,
                },
                {
                    field: 'fez_record_search_key_transcript',
                    order: 29,
                },
                {
                    field: 'fez_record_search_key_identifier',
                    order: 30,
                },
            ],
            Book: [
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
                    field: 'fez_record_search_key_translated_title',
                    order: 3,
                },
                {
                    field: 'fez_record_search_key_language_of_title',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_place_of_publication',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 6,
                },
                {
                    field: 'rek_date',
                    order: 7,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 9.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 9.6,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 9.8,
                },
                {
                    field: 'fez_record_search_key_volume_number',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_edition',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_series',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_isbn',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_issn',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 15,
                },
                // {
                //     field: 'fez_record_search_key_language',
                //     order: 16
                // },
                {
                    field: 'fez_record_search_key_start_page',
                    order: 17,
                },
                {
                    field: 'fez_record_search_key_end_page',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_total_pages',
                    order: 19,
                },
                {
                    field: 'fez_record_search_key_original_format',
                    order: 19.5,
                },
                {
                    field: 'fez_record_search_key_date_available',
                    order: 20,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 21,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 22,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 22.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 23,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 24,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 24.5,
                },
            ],
            'Book Chapter': [
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
                    field: 'fez_record_search_key_translated_title',
                    order: 3,
                },
                {
                    field: 'fez_record_search_key_language_of_title',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_book_title',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_translated_book_title',
                    order: 6,
                },
                {
                    field: 'fez_record_search_key_language_of_book_title',
                    order: 7,
                },
                {
                    field: 'fez_record_search_key_place_of_publication',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 9,
                },
                {
                    field: 'rek_date',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 12.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 12.6,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 12.8,
                },
                {
                    field: 'fez_record_search_key_date_available',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_series',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_edition',
                    order: 15,
                },
                {
                    field: 'fez_record_search_key_isbn',
                    order: 16,
                },
                {
                    field: 'fez_record_search_key_issn',
                    order: 17,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_volume_number',
                    order: 19,
                },
                {
                    field: 'fez_record_search_key_chapter_number',
                    order: 20,
                },
                {
                    field: 'fez_record_search_key_start_page',
                    order: 21,
                },
                {
                    field: 'fez_record_search_key_end_page',
                    order: 22,
                },
                {
                    field: 'fez_record_search_key_total_pages',
                    order: 23,
                },
                {
                    field: 'fez_record_search_key_total_chapters',
                    order: 24,
                },
                // {
                //     field: 'fez_record_search_key_language',
                //     order: 25
                // },
                {
                    field: 'fez_record_search_key_subject',
                    order: 26,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 27,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 27.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 28,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 29,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 29.5,
                },
            ],
            Community: [
                {
                    field: 'rek_description',
                    order: 1,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 2,
                },
            ],
            Collection: [
                {
                    field: 'rek_description',
                    order: 1,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 2,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 3,
                },
            ],
            'Conference Paper': [
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
                    field: 'fez_record_search_key_language_of_title',
                    order: 3,
                },
                {
                    field: 'fez_record_search_key_translated_title',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_conference_name',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_translated_conference_name',
                    order: 6,
                },
                {
                    field: 'fez_record_search_key_conference_location',
                    order: 7,
                },
                {
                    field: 'fez_record_search_key_conference_dates',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_convener',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_proceedings_title',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_language_of_proceedings_title',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_translated_proceedings_title',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_journal_name',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_series',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_language_of_journal_name',
                    order: 15,
                },
                {
                    field: 'fez_record_search_key_translated_journal_name',
                    order: 16,
                },
                {
                    field: 'fez_record_search_key_place_of_publication',
                    order: 17,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 18,
                },
                {
                    field: 'rek_date',
                    order: 19,
                },
                {
                    field: 'fez_record_search_key_date_available',
                    order: 20,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 21,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 22,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 22.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 22.6,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 22.8,
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
                    field: 'fez_record_search_key_contributor',
                    order: 25,
                },
                {
                    field: 'fez_record_search_key_volume_number',
                    order: 26,
                },
                {
                    field: 'fez_record_search_key_issue_number',
                    order: 27,
                },
                {
                    field: 'fez_record_search_key_start_page',
                    order: 28,
                },
                {
                    field: 'fez_record_search_key_end_page',
                    order: 29,
                },
                {
                    field: 'fez_record_search_key_total_pages',
                    order: 30,
                },
                {
                    field: 'fez_record_search_key_chapter_number',
                    order: 31,
                },
                {
                    field: 'fez_record_search_key_total_chapters',
                    order: 32,
                },
                {
                    field: 'fez_record_search_key_language',
                    order: 33,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 34,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 35,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 35.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 36,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 37,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 37.5,
                },
            ],
            'Conference Proceedings': [
                {
                    field: 'rek_title',
                    order: 1,
                },
                {
                    field: 'rek_description',
                    order: 2,
                },
                {
                    field: 'fez_record_search_key_language_of_title',
                    order: 3,
                },
                {
                    field: 'fez_record_search_key_translated_title',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_conference_name',
                    order: 6,
                },
                {
                    field: 'fez_record_search_key_translated_conference_name',
                    order: 7,
                },
                {
                    field: 'fez_record_search_key_conference_location',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_conference_dates',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_convener',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_proceedings_title',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_language_of_proceedings_title',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_translated_proceedings_title',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_journal_name',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_series',
                    order: 15,
                },
                {
                    field: 'fez_record_search_key_language_of_journal_name',
                    order: 16,
                },
                {
                    field: 'fez_record_search_key_translated_journal_name',
                    order: 17,
                },
                {
                    field: 'fez_record_search_key_isbn',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_issn',
                    order: 19,
                },
                {
                    field: 'fez_record_search_key_place_of_publication',
                    order: 20,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 21,
                },
                {
                    field: 'rek_date',
                    order: 22,
                },
                {
                    field: 'fez_record_search_key_date_available',
                    order: 23,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 24,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 25,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 25.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 25.6,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 25.8,
                },
                {
                    field: 'fez_record_search_key_volume_number',
                    order: 26,
                },
                {
                    field: 'fez_record_search_key_issue_number',
                    order: 27,
                },
                {
                    field: 'fez_record_search_key_start_page',
                    order: 28,
                },
                {
                    field: 'fez_record_search_key_end_page',
                    order: 29,
                },
                {
                    field: 'fez_record_search_key_total_pages',
                    order: 30,
                },
                {
                    field: 'fez_record_search_key_chapter_number',
                    order: 31,
                },
                {
                    field: 'fez_record_search_key_total_chapters',
                    order: 32,
                },
                {
                    field: 'fez_record_search_key_language',
                    order: 33,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 34,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 35,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 35.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 36,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 37,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 37.5,
                },
            ],
            'Creative Work': [
                // {
                //     field: 'rek_genre',
                //     order: 1,
                // },
                {
                    field: 'fez_record_search_key_translated_title',
                    order: 2,
                },
                {
                    field: 'fez_record_search_key_author',
                    order: 3,
                },
                {
                    field: 'rek_title',
                    order: 4,
                },
                {
                    field: 'rek_description',
                    order: 4.5,
                },
                {
                    field: 'fez_record_search_key_place_of_publication',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 6,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 6.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 6.6,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 6.8,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 7,
                },
                {
                    field: 'rek_date',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 8.5,
                },
                {
                    field: 'fez_record_search_key_start_date',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_end_date',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_date_available',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_series',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_edition',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_isbn',
                    order: 15,
                },
                {
                    field: 'fez_record_search_key_issn',
                    order: 16,
                },
                {
                    field: 'fez_record_search_key_start_page',
                    order: 17,
                },
                {
                    field: 'fez_record_search_key_end_page',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 20,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 22,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 22.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 23,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 24,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 24.5,
                },
            ],
            'Data Collection': [
                {
                    field: 'fez_record_search_key_project_name',
                    order: 1,
                },
                {
                    field: 'fez_record_search_key_project_description',
                    order: 2,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 3,
                },
                {
                    field: 'fez_record_search_key_contact_details_email',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_author',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_author_role',
                    order: 6,
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
                    field: 'fez_record_search_key_access_conditions',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 9.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 10,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 10.6,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_type_of_data',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_software_required',
                    order: 15,
                },
                {
                    field: 'fez_record_search_key_language',
                    order: 16,
                },
                {
                    field: 'fez_record_search_key_start_date',
                    order: 17,
                },
                {
                    field: 'fez_record_search_key_end_date',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_time_period_start_date',
                    order: 19,
                },
                {
                    field: 'fez_record_search_key_time_period_end_date',
                    order: 20,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 21,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 21.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 22,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 23,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 23.5,
                },
                {
                    field: 'fez_record_search_key_geographic_area',
                    order: 24,
                },
                {
                    field: 'fez_record_search_key_seo_code',
                    order: 25,
                },
                {
                    field: 'fez_record_search_key_project_id',
                    order: 26,
                },
                {
                    field: 'fez_record_search_key_ands_collection_type',
                    order: 27,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 28,
                },
                {
                    field: 'rek_date',
                    order: 29,
                },
                {
                    field: 'fez_record_search_key_rights',
                    order: 30,
                },
                {
                    field: 'fez_record_search_key_data_volume',
                    order: 31,
                },
                {
                    field: 'fez_record_search_key_raid',
                    order: 32,
                },
                {
                    field: 'fez_record_search_key_related_publications',
                    order: 33,
                },
                {
                    field: 'fez_record_search_key_related_datasets',
                    order: 34,
                },
            ],
            'Department Technical Report': [
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
                    field: 'fez_record_search_key_translated_title',
                    order: 3,
                },
                {
                    field: 'fez_record_search_key_parent_publication',
                    order: 3.5,
                },
                {
                    field: 'fez_record_search_key_org_unit_name',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_org_name',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 6,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 6.5,
                },
                {
                    field: 'fez_record_search_key_report_number',
                    order: 7,
                },
                {
                    field: 'fez_record_search_key_series',
                    order: 8,
                },
                {
                    field: 'rek_date',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 9.5,
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
                    field: 'fez_record_search_key_total_pages',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_language',
                    order: 15,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 16,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 17,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 17.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 19,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 19.5,
                },
                {
                    field: 'fez_record_search_key_isbn',
                    order: 20,
                },
                {
                    field: 'fez_record_search_key_issn',
                    order: 21,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 22,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 22.1,
                },
            ],
            Design: [
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
                    field: 'fez_record_search_key_project_name',
                    order: 3,
                },
                {
                    field: 'fez_record_search_key_translated_title',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_project_start_date',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_end_date',
                    order: 6,
                },
                {
                    field: 'fez_record_search_key_date_available',
                    order: 7,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_place_of_publication',
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
                    field: 'fez_record_search_key_total_pages',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 13.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 13.6,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 13.75,
                },
                {
                    field: 'rek_date',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 14.5,
                },
                {
                    field: 'fez_record_search_key_location',
                    order: 15,
                },
                {
                    field: 'fez_record_search_key_type_of_data',
                    order: 16,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 17,
                },
                // {
                //     field: 'fez_record_search_key_language',
                //     order: 17
                // },
                {
                    field: 'fez_record_search_key_subject',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_rights',
                    order: 19,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 20,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 20.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 21,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 22,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 22.5,
                },
                {
                    field: 'fez_record_search_key_series',
                    order: 23,
                },
                {
                    field: 'fez_record_search_key_job_number',
                    order: 24,
                },
                {
                    field: 'fez_record_search_key_source',
                    order: 25,
                },
                {
                    field: 'fez_record_search_key_original_format',
                    order: 26,
                },
                {
                    field: 'fez_record_search_key_scale',
                    order: 27,
                },
                {
                    field: 'fez_record_search_key_creator_name',
                    order: 28,
                },
                {
                    field: 'fez_record_search_key_geographic_area',
                    order: 29,
                },
                {
                    field: 'fez_record_search_key_acknowledgements',
                    order: 30,
                },
            ],
            'Digilib Image': [
                {
                    field: 'rek_title',
                    order: 1,
                },
                {
                    field: 'rek_description',
                    order: 1.5,
                },
                {
                    field: 'fez_record_search_key_translated_title',
                    order: 2,
                },
                {
                    field: 'fez_record_search_key_alternative_title',
                    order: 3,
                },
                {
                    field: 'fez_record_search_key_construction_date',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_date_photo_taken',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_date_scanned',
                    order: 6,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 6.5,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 7,
                },
                {
                    field: 'fez_record_search_key_architect_name',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_author',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_location',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 12.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 12.6,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 12.8,
                },
                {
                    field: 'fez_record_search_key_category',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_subcategory',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_period',
                    order: 15,
                },
                {
                    field: 'fez_record_search_key_style',
                    order: 16,
                },
                {
                    field: 'fez_record_search_key_type_of_data',
                    order: 16.5,
                },
                {
                    field: 'fez_record_search_key_condition',
                    order: 17,
                },
                {
                    field: 'fez_record_search_key_structural_systems',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_building_materials',
                    order: 19,
                },
                {
                    field: 'fez_record_search_key_architectural_features',
                    order: 20,
                },
                {
                    field: 'fez_record_search_key_interior_features',
                    order: 21,
                },
                {
                    field: 'fez_record_search_key_surrounding_features',
                    order: 22,
                },
                {
                    field: 'fez_record_search_key_rights',
                    order: 23,
                },
            ],
            'Generic Document': [
                {
                    field: 'rek_title',
                    order: 1,
                },
                {
                    field: 'rek_description',
                    order: 1.5,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 2,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 2.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 3,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 4.5,
                },
                {
                    field: 'fez_record_search_key_place_of_publication',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 6,
                },
                {
                    field: 'fez_record_search_key_series',
                    order: 7,
                },
                {
                    field: 'rek_date',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 8.5,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_author',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 14,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 14.5,
                },
            ],
            Image: [
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
                    field: 'fez_record_search_key_translated_title',
                    order: 3,
                },
                {
                    field: 'fez_record_search_key_language_of_title',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_place_of_publication',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 6,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 7,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 7.5,
                },
                {
                    field: 'rek_date',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 8.5,
                },
                {
                    field: 'fez_record_search_key_date_available',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_series',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_type_of_data',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_original_format',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_source',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_language',
                    order: 15,
                },
                {
                    field: 'fez_record_search_key_rights',
                    order: 16,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 17,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 17.2,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 17.5,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 18.5,
                },
                {
                    field: 'fez_record_search_key_geographic_area',
                    order: 19,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 20,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 21,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 21.5,
                },
                {
                    field: 'fez_record_search_key_acknowledgements',
                    order: 22,
                },
            ],
            Instrument: [
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
                },
                {
                    field: 'rek_date',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 6,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 7,
                },
                {
                    field: 'fez_record_search_key_contact_details_email',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_contributor_identifier',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_start_date',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_end_date',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_model',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_measured_variable',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_instrument_type',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_alternate_identifier',
                    order: 15,
                },
            ],
            Journal: [
                {
                    field: 'rek_title',
                    order: 1,
                },
                {
                    field: 'rek_description',
                    order: 1.5,
                },
                {
                    field: 'fez_record_search_key_series',
                    order: 2,
                },
                {
                    field: 'fez_record_search_key_translated_title',
                    order: 3,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 4,
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
                    field: 'fez_record_search_key_isbn',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_issn',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_start_page',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 10.5,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 11.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 11.6,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 11.8,
                },
                {
                    field: 'fez_record_search_key_end_page',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_total_pages',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_author',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_place_of_publication',
                    order: 15,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 16,
                },
                {
                    field: 'fez_record_search_key_language',
                    order: 17,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 19,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 19.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 20,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 21,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 21.5,
                },
            ],
            'Journal Article': [
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
                    field: 'fez_record_search_key_translated_title',
                    order: 3,
                },
                {
                    field: 'fez_record_search_key_language_of_title',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_journal_name',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_translated_journal_name',
                    order: 6,
                },
                {
                    field: 'fez_record_search_key_language_of_journal_name',
                    order: 7,
                },
                {
                    field: 'fez_record_search_key_issn',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_isbn',
                    order: 9,
                },
                {
                    field: 'rek_date',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_date_available',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 13.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 13.6,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 13.8,
                },
                {
                    field: 'fez_record_search_key_volume_number',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_issue_number',
                    order: 15,
                },
                {
                    field: 'fez_record_search_key_start_page',
                    order: 16,
                },
                {
                    field: 'fez_record_search_key_end_page',
                    order: 17,
                },
                {
                    field: 'fez_record_search_key_total_pages',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_article_number',
                    order: 19,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 20,
                },
                {
                    field: 'fez_record_search_key_place_of_publication',
                    order: 21,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 22,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 23,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 24,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 24.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 25,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 26,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 26.5,
                },
            ],
            Manuscript: [
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
                    field: 'fez_record_search_key_translated_title',
                    order: 3,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 4.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 4.6,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 4.75,
                },
                {
                    field: 'rek_date',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 5.5,
                },
                {
                    field: 'fez_record_search_key_date_available',
                    order: 6,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 7,
                },
                {
                    field: 'fez_record_search_key_series',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_type_of_data',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_original_format',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_source',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_language',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_rights',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 15,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 15.5,
                },
                {
                    field: 'fez_record_search_key_geographic_area',
                    order: 16,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 17,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 19,
                },
                {
                    field: 'fez_record_search_key_acknowledgements',
                    order: 20,
                },
                {
                    field: 'fez_record_search_key_transcript',
                    order: 21,
                },
            ],
            'Newspaper Article': [
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
                    field: 'fez_record_search_key_translated_title',
                    order: 3,
                },
                {
                    field: 'fez_record_search_key_newspaper',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 5.5,
                },
                {
                    field: 'fez_record_search_key_translated_newspaper',
                    order: 6,
                },
                {
                    field: 'fez_record_search_key_issn',
                    order: 7,
                },
                {
                    field: 'rek_date',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 8.5,
                },
                {
                    field: 'fez_record_search_key_edition',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_section',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_start_page',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_end_page',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_total_pages',
                    order: 13,
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
                },
                {
                    field: 'fez_record_search_key_language',
                    order: 17,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 19,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 19.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 20,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 21,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 21.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 22,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 22.1,
                },
            ],
            'Reference Entry': [
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
                    field: 'fez_record_search_key_translated_title',
                    order: 3,
                },
                {
                    field: 'fez_record_search_key_parent_publication',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_place_of_publication',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 6,
                },
                {
                    field: 'rek_date',
                    order: 7,
                },
                {
                    field: 'fez_record_search_key_date_available',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 8.5,
                },
                {
                    field: 'fez_record_search_key_edition',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_volume_number',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_issue_number',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_isbn',
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
                    field: 'fez_record_search_key_total_pages',
                    order: 16,
                },
                {
                    field: 'fez_record_search_key_language',
                    order: 17,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 19,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 19.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 20,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 21,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 21.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 22,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 22.1,
                },
            ],
            'Research Report': [
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
                    field: 'fez_record_search_key_translated_title',
                    order: 3,
                },
                {
                    field: 'fez_record_search_key_parent_publication',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 5,
                },
                {
                    field: 'rek_date',
                    order: 6,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 6.5,
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
                    field: 'fez_record_search_key_date_available',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 10.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 10.6,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 10.8,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_org_unit_name',
                    order: 11.1,
                },
                {
                    field: 'fez_record_search_key_series',
                    order: 12,
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
                    field: 'fez_record_search_key_total_pages',
                    order: 16,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 19,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 19.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 20,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 21,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 21.5,
                },
                {
                    field: 'fez_record_search_key_report_number',
                    order: 22,
                },
            ],
            Patent: [
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
                    field: 'fez_record_search_key_translated_title',
                    order: 3,
                },
                {
                    field: 'rek_date',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_date_available',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 5.5,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 6,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 6.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 6.6,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 6.8,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 7,
                },
                {
                    field: 'fez_record_search_key_patent_number',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_country_of_issue',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_language',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 13.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 15,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 15.5,
                },
            ],
            Preprint: [
                {
                    field: 'rek_title',
                    order: 1,
                },
                {
                    field: 'rek_description',
                    order: 1.5,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 2,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 3,
                },
                {
                    field: 'rek_date',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 4.5,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_author',
                    order: 6,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 7,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 8.5,
                },
                {
                    field: 'fez_record_search_key_country_of_issue',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_language',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 12.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 14.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 15,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 16,
                },
            ],
            'Seminar Paper': [
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 1,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 1.5,
                },
                {
                    field: 'fez_record_search_key_author',
                    order: 2,
                },
                {
                    field: 'rek_title',
                    order: 3,
                },
                {
                    field: 'rek_description',
                    order: 3.5,
                },
                {
                    field: 'fez_record_search_key_org_unit_name',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_org_name',
                    order: 6,
                },
                {
                    field: 'fez_record_search_key_series',
                    order: 7,
                },
                {
                    field: 'rek_date',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 8.5,
                },
                {
                    field: 'fez_record_search_key_start_page',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_end_page',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_total_pages',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_location',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_language',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 15,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 16,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 16.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 17,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 18.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 19,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 20,
                },
            ],
            Thesis: [
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
                    field: 'fez_record_search_key_translated_title',
                    order: 3,
                },
                {
                    field: 'fez_record_search_key_org_unit_name',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_org_name',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 6,
                },
                {
                    field: 'rek_date',
                    order: 7,
                },
                {
                    field: 'rek_genre_type',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 9.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 9.6,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 9.8,
                },
                {
                    field: 'fez_record_search_key_supervisor',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_total_pages',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_language',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 15,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 15.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 16,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 18.5,
                },
            ],
            'Video Document': [
                {
                    field: 'fez_record_search_key_oa_status',
                    order: 3.75,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 3.8,
                },
                {
                    field: 'fez_record_search_key_author',
                    order: 2,
                },
                {
                    field: 'rek_title',
                    order: 3,
                },
                {
                    field: 'rek_description',
                    order: 3.5,
                },
                {
                    field: 'fez_record_search_key_translated_title',
                    order: 4,
                },
                {
                    field: 'fez_record_search_key_place_of_publication',
                    order: 5,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 6,
                },
                {
                    field: 'rek_date',
                    order: 7,
                },
                {
                    field: 'fez_record_search_key_date_available',
                    order: 8,
                },
                {
                    field: 'fez_record_search_key_doi',
                    order: 8.5,
                },
                {
                    field: 'fez_record_search_key_contributor',
                    order: 9,
                },
                {
                    field: 'fez_record_search_key_series',
                    order: 10,
                },
                {
                    field: 'fez_record_search_key_issn',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_type_of_data',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_original_format',
                    order: 13,
                },
                {
                    field: 'fez_record_search_key_source',
                    order: 14,
                },
                {
                    field: 'fez_record_search_key_language',
                    order: 15,
                },
                {
                    field: 'fez_record_search_key_rights',
                    order: 16,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 17,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 18.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 19,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 19.6,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 20,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 21,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 22,
                },
            ],
            'Working Paper': [
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
                    field: 'fez_record_search_key_translated_title',
                    order: 3,
                },
                {
                    field: 'fez_record_search_key_language_of_title',
                    order: 4,
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
                    field: 'fez_record_search_key_oa_status',
                    order: 7,
                },
                {
                    field: 'fez_record_search_key_oa_status_type',
                    order: 7.5,
                },
                {
                    field: 'fez_record_search_key_license',
                    order: 7.6,
                },
                {
                    field: 'rek_ci_notice_attribution_incomplete',
                    order: 7.8,
                },
                {
                    field: 'fez_record_search_key_series',
                    order: 8,
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
                    field: 'fez_record_search_key_doi',
                    order: 11,
                },
                {
                    field: 'fez_record_search_key_publisher',
                    order: 12,
                },
                {
                    field: 'fez_record_search_key_contributor',
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
                    field: 'fez_record_search_key_total_pages',
                    order: 16,
                },
                {
                    field: 'fez_record_search_key_language',
                    order: 17,
                },
                {
                    field: 'fez_record_search_key_subject',
                    order: 18,
                },
                {
                    field: 'fez_record_search_key_keywords',
                    order: 19,
                },
                {
                    field: 'fez_record_search_key_sdg_source',
                    order: 19.5,
                },
                {
                    field: 'fez_record_search_key_advisory_statement',
                    order: 20,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_id',
                    order: 21,
                },
                {
                    field: 'fez_record_search_key_sensitive_handling_note_other',
                    order: 21.5,
                },
                {
                    field: 'fez_record_search_key_isbn',
                    order: 22,
                },
                {
                    field: 'fez_record_search_key_issn',
                    order: 23,
                },
            ],
            footer: [
                {
                    field: 'fez_record_search_key_herdc_code',
                    order: 50,
                },
                {
                    field: 'fez_record_search_key_herdc_status',
                    order: 51,
                },
                {
                    field: 'fez_record_search_key_institutional_status',
                    order: 52,
                },
                {
                    field: 'fez_record_search_key_notes',
                    order: 54,
                },
            ],
        },
        adminFields: [
            'fez_record_search_key_herdc_code',
            'fez_record_search_key_herdc_status',
            'fez_record_search_key_institutional_status',
        ],
        videoFailedAlert: {
            type: 'error',
            title: 'VIDEO PLAYER ERROR',
            message: 'Please click the download/open in a new window link above to open the original file format.',
        },
        imageFailedAlert: {
            type: 'error',
            title: 'IMAGE FAILED TO LOAD',
            message:
                'You may need to log in to view the preview and original files. Please click the download/open in a new window link above to open the original file format.',
        },
        adminViewRecordDrawerFields: {
            notes: 'fez_internal_notes.ain_detail',
            authorAffiliates: 'fez_author_affiliation',
            wosId: 'fez_record_search_key_isi_loc.rek_isi_loc',
            wosDocType: 'rek_wok_doc_type',
            wosDocTypeLookup: 'rek_wok_doc_type_lookup',
            openalexId: 'fez_record_search_key_openalex_id.rek_openalex_id',
            openalexDocType: 'rek_openalex_doc_type',
            // openalexDocTypeLookup: 'rek_wok_doc_type_lookup',
            scopusId: 'fez_record_search_key_scopus_id.rek_scopus_id',
            scopusDocType: 'rek_scopus_doc_type',
            scopusDocTypeLookup: 'rek_scopus_doc_type_lookup',
            pubMedId: 'fez_record_search_key_pubmed_id.rek_pubmed_id',
            pubMedCentralId: 'fez_record_search_key_pubmed_central_id.rek_pubmed_central_id',
            pubMedDocType: 'rek_pubmed_doc_type',
            pubMedDocTypeLookup: 'rek_pubmed_doc_type_lookup',
            hasAffiliates: 'Valid author affiliation information has been added.',
            hasNoAffiliates: 'No linked authors.',
            affiliatesDoNotApply: 'Not applicable.',
            buttonLabel: 'Edit Affiliations',
            errorDetail: item =>
                ` has ${!!!item.isNotOrphaned ? 'orphaned author' : 'incomplete author affiliation'} information`,
        },
        adminViewRecordDefaultContent: {
            index: {
                notes: 0,
                authors: 2,
                wos: 4,
                scopus: 6,
                pubmed: 8,
                openalex: 10,
            },
            object: {
                sections: [
                    [
                        {
                            type: 'header',
                            value: undefined, // notes
                            error: null,
                        },
                        {
                            type: 'content',
                            value: undefined,
                            scrollable: true,
                            key: 'key-scrollable-notes-1',
                        },
                    ],
                    {
                        type: 'divider',
                    },
                    [
                        {
                            type: 'header',
                            value: undefined, // author affiliates
                        },
                        {
                            type: 'content',
                            value: undefined,
                            error: null,
                            AAError: [],
                            AAOrphans: [],
                        },
                    ],
                    {
                        type: 'divider',
                    },
                    [
                        {
                            type: 'header', // wos ID
                            value: undefined,
                        },
                        {
                            type: 'content',
                            value: undefined,
                            clipboard: true,
                        },
                        {
                            type: 'header', // wos doc type
                            value: undefined,
                        },
                        {
                            type: 'content',
                            value: undefined,
                        },
                    ],
                    {
                        type: 'divider',
                    },
                    [
                        {
                            type: 'header', // scopus id
                            value: undefined,
                        },
                        {
                            type: 'content',
                            value: undefined,
                            clipboard: true,
                        },
                        {
                            type: 'header', // scopus doc type
                            value: undefined,
                        },
                        {
                            type: 'content',
                            value: undefined,
                        },
                    ],
                    {
                        type: 'divider',
                    },
                    [
                        {
                            type: 'header', // pubmed id
                            value: undefined,
                        },
                        {
                            type: 'content',
                            value: undefined,
                            clipboard: true,
                        },
                        {
                            type: 'header', // pubmed central id
                            value: undefined,
                        },
                        {
                            type: 'content',
                            value: undefined,
                            clipboard: true,
                        },
                        {
                            type: 'header', // pubmed doc type
                            value: undefined,
                        },
                        {
                            type: 'content',
                            value: undefined,
                        },
                    ],
                    {
                        type: 'divider',
                    },
                    [
                        {
                            type: 'header', // scopus id
                            value: undefined,
                        },
                        {
                            type: 'content',
                            value: undefined,
                            clipboard: true,
                        },
                        {
                            type: 'header', // scopus doc type
                            value: undefined,
                        },
                        {
                            type: 'content',
                            value: undefined,
                        },
                    ],
                ],
            },
        },
        culturalNoticeAI: {
            title: 'Attribution Incomplete',
            imagePath: 'https://assets.library.uq.edu.au/local-contexts/ci_notice_attribution_incomplete.png',
            text: 'Collections and items in UQ eSpace have incomplete, inaccurate, and/or missing attribution. We are using this notice to clearly identify this material so that it can be updated, or corrected by communities of origin. Our institution is committed to collaboration and partnerships to address this problem of incorrect or missing attribution',
        },
    },
};
