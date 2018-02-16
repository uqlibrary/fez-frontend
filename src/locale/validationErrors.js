import React from 'react';

export default {
    validationErrors: {
        publicationSearch: 'Type a valid publication DOI (e.g. 10.1163/9789004326828), Pubmed ID (e.g. 28131963) or the title (min 10 characters) of the publication',
        isbn: 'ISBN value is not valid',
        issn: 'ISSN value is not valid',
        fileUpload: 'File upload is not in valid state',
        fileUploadRequired: 'Add at least one file to upload',
        required: 'This field is required',
        email: 'Email address is not valid',
        url: 'URL is not valid',
        doi: 'DOI is not valid',
        forRequired: 'Field of research values are required',
        dateTimeDay: 'Invalid date',
        dateTimeYear: 'Invalid year',
        maxLength: 'Must be [max] characters or less',
        minLength: 'Must be at least [min] characters',
        authorLinking: 'Please select and confirm an author',
        contributorLinking: 'Please select and confirm a contributor',
        authorRequired: (<span>Please <b>provide a list of authors/creators</b> of the publication and <b>select an author/creator as you</b></span>),
        authorEditorRequired: (<span>Please <b>provide a list of authors/creators and/or editors/contributors</b> of the publication and <b>select one author/creator or editor/contributor</b> as you</span>),
        supervisorRequired: 'Please provide a list of supervisors',
        editorRequired: (<span>Please <b>provide a list of editors</b> of the publication and <b>select an editor name</b> as you</span>),
        googleScholarId: 'Please provide a valid 12 character Google Scholar ID',
    }
};
