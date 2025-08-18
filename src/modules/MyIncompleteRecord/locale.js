import React from 'react';
import locale from 'locale/components';
import fileUploaderLocale from 'modules/SharedComponents/Toolbox/FileUploader/locale';

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
    loadingMessage: 'Loading work',
    help: {
        title: 'Add more information to an existing NTRO',
        text: (
            <p>
                For help, click{' '}
                <a
                    href="https://guides.library.uq.edu.au/research-and-teaching-staff/uqespace-publications-datasets/add-information-to-existing-ntro"
                    target="_blank"
                >
                    here
                </a>
                .
            </p>
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
                    select the pencil edit icon to the right of the author name at Step 1, add the affiliation
                    information as at time of publication at Step 2, then click <b>CHANGE DETAILS</b>.
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
                ...fileUploaderLocale,
                fileUploadRow: {},
                instructions: '',
                ntroSpecificInstructions: '',
                validation: {
                    ...fileUploaderLocale.validation,
                    ['sameFileNameWithDifferentExt']: '',
                },
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
