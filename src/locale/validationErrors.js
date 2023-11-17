import React from 'react';

export default {
    validationErrors: {
        publicationSearch:
            'Type a valid DOI (e.g. 10.1163/9789004326828), ' +
            'Pubmed ID (e.g. 28131963) or the title (min 10 characters) of the publication',
        isbn: 'ISBN value is not valid',
        issn: 'ISSN value is not valid',
        ismn: 'ISMN value is not valid',
        isrc: 'ISRC value is not valid',
        fileUpload: 'File upload is not in valid state',
        fileUploadRequired: 'Add at least one file to upload',
        fileName: 'File name value is not valid',
        required: 'This field is required',
        email: 'Email address is not valid',
        url: 'URL is not valid',
        doi: 'DOI is not valid',
        researcherId: 'ResearcherId is not valid',
        pid: 'Please provide a valid PID (e.g. UQ:129af6)',
        forRequired: 'Field of research values are required',
        subRequired: 'Subject values are required',
        dateTimeDay: 'Invalid date',
        dateTimeYear: 'Invalid year',
        maxLength: 'Must be [max] characters or less',
        minLength: 'Must be at least [min] characters',
        maxWords: 'Must be [max] words or less',
        authorLinking: 'Please select and confirm an author',
        contributorLinking: 'Please select and confirm a contributor',
        authorRequired: (
            <span>
                Please <b>provide a list as described</b> and <b>select one</b> as you
            </span>
        ),
        authorRequiredAdmin: (
            <span>
                Please <b>provide a list as described</b>
            </span>
        ),
        editorRequired: (
            <span>
                Please <b>provide a list of editors/contributors</b> of the work and{' '}
                <b>select an editor/contributor or author/creator</b> as you
            </span>
        ),
        editorRequiredAdmin: (
            <span>
                Please <b>provide a list of editors/contributors</b> of the work
            </span>
        ),
        onlyOneOfAuthorOrEditor: <span>Please provide either authors/creators or editors/contributors, not both.</span>,
        supervisorRequired: 'Please provide a list of supervisors',
        googleScholarId: 'Please provide a valid 12 character Google Scholar ID',
        advancedSearchSelectionRequired: 'Please select a field to search',
        dateRange: 'Please provide a valid start/end date range',
        collectionDateRange: 'Please provide a valid start/end Collection Date range',
        pageRange: 'Please provide a valid start/end page range',
        remindToAdd: 'Please remember to click ADD to add this item to your list',
        requireChecked: 'Please accept deposit agreement',
        authorsAffiliationIncomplete: 'Rows marked with a red prefix must be updated',
        authorAffiliationIncomplete: 'Please update affiliation data for the selected author',
        grants: 'You must click ADD GRANT to enter the value to the grants list',
        keywords: 'Limited to [max] characters',
    },
    validationErrorsSummary: {
        // appears in footer error block
        rek_display_type: 'Work type is required',
        rek_title: 'Title is required',
        rek_description: 'Description is required',
        rek_book_title: 'Book title is required',
        rek_date: 'Publication date is required',
        rek_subtype: 'Work subtype is required',
        authors: 'Author/creator names are required',
        currentAuthor: 'Author name is required',
        editors: 'Editor/contributor names are required',
        supervisors: 'Supervisor names are required',
        rek_journal_name: 'Journal name is required',
        rek_link: 'Link is invalid',
        rek_doi: 'DOI is invalid',
        rek_newspaper: 'Newspaper name is required',
        rek_end_page: 'End page is required',
        rek_start_page: 'Start page is required',
        rek_publisher: 'Publisher is required',
        rek_place_of_publication: 'Place of publication is required',
        rek_total_pages: 'Total page is required',
        rek_conference_name: 'Conference name is required',
        rek_conference_location: 'Conference location is required',
        rek_conference_dates: 'Conference dates are required',
        rek_org_unit_name: 'Enrolling unit is required',
        rek_org_name: 'Institution name is required',
        rek_genre_type: 'Thesis type is required',
        thesisTitle: 'Thesis title is required',
        thesisAbstract: 'Thesis abstract is required',
        ntroAbstract: 'Abstract/Description is required',
        files: 'File submission to be completed',
        fileNames: 'You are required to enter valid file name(s) for attached files',
        fieldOfResearch: 'Field of research (FoR) codes are required',
        fez_record_search_key_keywords: 'Keywords are required',
        contributorLinking: 'You are required to select a contributor from the list, then confirm that it is you',
        authorLinking: 'You are required to select a author from the list, then confirm that it is you',
        onlyOneOfAuthorOrEditor: 'Please provide either authors/creators or editors/contributors, not both',
        comments: 'Comments are required',
        fixRecordAnyField: 'Please provide additional information, corrections or upload file(s).',
        contactName: 'Contact name is required',
        contactNameId: 'ID for contact name is required',
        contactEmail: 'Contact email is required',
        rek_access_conditions: 'Access condition is required',
        rek_copyright: 'You are required to accept deposit agreement',
        depositAgreement: 'You are required to accept deposit agreement',
        rek_license: 'Licence and terms of access is required',
        rek_project_name: 'Project name is required',
        rek_project_description: 'Project description is required',
        fez_record_search_key_grant_id: 'Grant information is required',
        qualityIndicators: 'Quality indicator is required',
        impactStatement: 'Creator research statement is required',
        significance: 'Scale/Significance of work is required',
        dateRange: 'Publication start/end dates are invalid',
        collectionDateRange: 'Collection start/end dates are invalid',
        pageRange: 'Please provide a valid start/end page range',
        // Collection form validations
        communityID: 'You must select a community',
        collection_pid: 'You must select a collection',
        collections: 'You must select at least one collection',
        communities: 'You must select at least one community',
        doc_type_id: 'You must select a document type',
        directory: 'You must select a directory',
        title: 'Title is required',
        authorsAffiliation: 'Author affiliation rows marked with red are required',
        rek_audience_size: 'Audience size is required',
        grants: 'You must click ADD GRANT to enter the value to the grants list',
        subjects: 'Subjects are required',
        rek_rights: 'Rights is required',
        rek_ands_collection_type: 'Dataset collection type is required',
        rek_date_available: 'Invalid year',
        rek_project_start_date: 'Project start date is required',
        rek_security_policy: 'Security policy is required',
        jnl_title: 'Journal title is required',
    },
};
