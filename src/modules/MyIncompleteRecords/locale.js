import React from 'react';
import locale from 'locale/components';

/*

NOTE:
- text can be either plain text, eg text: 'Some text to display' or
- text can be formatted HTML text, eg
    text: (<div>Click here to search google: <a href='google.com'>search google</a></div>)
IMPORTANT: if currently text contains placeholders, eg any characters in square brackets,
eg [noOfResults] it cannot be formatted with HTML tags’

- help objects have the following shape:
help: {
    title: 'About these metrics',
    text: (<div></div>),
    buttonLabel: 'CLOSE'
}
- text can be plain or formatted HTML component with links/tags/etc
- if help is not required, delete help: {} fully (including closing '},')

*/
/* eslint-disable max-len */
export default {
    title: 'Complete my work',
    help: {
        title: 'Add more information to an existing NTRO',
        text: (
            <div>
                For help, click{' '}
                <a
                    href="https://guides.library.uq.edu.au/for-researchers/uqespace-publications-datasets/add-missing-ntro-information"
                    target="_blank"
                >
                    here
                </a>
                .
            </div>
        ),
        buttonLabel: 'CLOSE',
    },
    submitButtonLabel: 'Complete work',
    cancelButtonLabel: 'Cancel and return to my incomplete works list',
    fields: {
        notes: {
            title: 'Notes',
            label: 'Notes for this work',
            placeholder: 'Add any other notes or comments about this work to send to the eSpace team.',
        },
        grants: {
            title: 'Grant information',
        },
        authors: {
            ...locale.components.authors,
            description: (
                <span>
                    For each author marked with a <span style={{ color: '#e60000', weight: 'bold' }}>red</span> prompt,
                    select the author name at Step 1, add the affiliation information as at time of publication at Step
                    2, then click <b>UPDATE AUTHOR</b>.
                </span>
            ),
            field: {
                ...locale.components.authors.field,
                form: {
                    locale: {
                        ...locale.components.authors.field.form.locale,
                        descriptionStep1: (
                            <div>
                                <span className="authorSteps" key="step-2">
                                    Step 2 of 2
                                </span>{' '}
                                - <b>Update the affiliation information</b>.
                            </div>
                        ),
                        addButton: 'Update author',
                    },
                },
                header: {
                    ...locale.components.authors.field.header,
                    locale: {
                        ...locale.components.authors.field.header.locale,
                        descriptionStep2: (
                            <div>
                                <span className="authorSteps" key="step-1">
                                    Step 1 of 2
                                </span>{' '}
                                - <b>Select an author</b>.
                            </div>
                        ),
                    },
                },
                row: {
                    ...locale.components.authors.field.row,
                    locale: {
                        ...locale.components.authors.field.row.locale,
                        selectHint: 'Select this author ([name]) to update their affiliation data.',
                        requiredLabel: "This author's data is incomplete.",
                    },
                },
            },
        },
        fileUpload: {
            title: 'Upload files',
            locale: {
                instructions: '',
                accessTermsAndConditions:
                    'I understand that the files indicated above as open access will be submitted as open access and will be made publicly available immediately or will be made available on the indicated embargo date.  All other files submitted will be accessible by UQ eSpace administrators.',
                validation: {
                    ['notFiles']: 'Invalid files ([fileNames])',
                    ['invalidFileNames']: 'File(s) ([fileNames]) have invalid file name',
                    ['tooBigFiles']: 'File(s) ([fileNames]) exceed maximum allowed upload file size',
                    ['tooManyFiles']:
                        'Maximum number of files ([maxNumberOfFiles]) has been exceeded. File(s) ([fileNames]) will not be uploaded',
                    ['duplicateFiles']: 'File(s) ([fileNames]) are duplicates and have been ignored',
                },
                successTitle: 'Success',
                successMessage: 'Successfully added [numberOfFiles] file(s) to upload queue.',
                delayNotice: 'Notice',
                delayMessage:
                    'During peak times, there may be a delay before newly uploaded files appear on the record.',
                errorTitle: 'Upload Errors',
                fileUploadRestrictionHeading: 'File upload restrictions',
                fileUploadRestrictions: (
                    <div>
                        Please ensure:
                        <ul>
                            <li>file names begin with a letter and are less than 45 characters long</li>
                            <li>file names contain only upper and lowercase alphanumeric characters, and underscores</li>
                            <li>
                                file names have only a single period which precedes the file extension: e.g. “.pdf”, “.mov”,
                                “.tiff”, “.wav” etc.<br />
                                (two periods are allowed for multipart zip files. Allowed formats for part description are: e.g.
                                “.001 ... .999”, “.r01 ... .r999” and “.part1 ... .part999”)
                            </li>
                            <li>files are uploaded individually and not inside a folder</li>
                            <li>files are smaller than 8GB.</li>
                        </ul>
                    </div>
                ),
                fileUploadInstruction: <p>Click here to select files, or drag files into this area to upload</p>,
            },
            text: (
                <div>
                    <span className="requiredField">
                        <label>&nbsp;</label>
                    </span>
                </div>
            ),
        },
    },
    successWorkflowConfirmation: {
        confirmationTitle: 'Your work has been updated',
        fileFailConfirmationAlert: {
            title: 'UPLOAD FAILED',
            message: 'File upload and/or notes post failed',
            type: 'warning',
        },
        cancelButtonLabel: 'Complete another work',
        confirmButtonLabel: 'Go to my dashboard',
    },
    prompt: {
        title: 'Missing data',
        message:
            'follow the red prompts to add missing information. You can also provide additional grant details or include notes to the eSpace team.',
        type: 'info_outline',
    },
    progressAlert: {
        type: 'info_outline',
        title: 'Saving',
        message: 'Updating work is in progress.',
        showLoader: true,
    },
    successAlert: {
        type: 'done',
        title: 'Success',
        message: 'New information has been saved successfully.',
    },
};
