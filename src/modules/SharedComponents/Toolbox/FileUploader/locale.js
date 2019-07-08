import React from 'react';
import { OPEN_ACCESS_ID, CLOSED_ACCESS_ID } from './config';

export default {
    instructions: 'You may add up to [fileUploadLimit] files (max [maxFileSize][fileSizeUnit] each)',
    ntroSpecificInstructions: (
        <span>
            You must upload at least one piece of evidence that demonstrates claims you have made about this work, e.g.
            Event program, music score, recording, scholarly review, front matter (book, catalogue) or full chapter.
            <a
                href="https://guides.library.uq.edu.au/for-researchers/uqespace-publications-datasets/ntro-submission-requirements#s-lg-box-20836613"
                target="_blank"
            >
                More information
            </a>
            .
        </span>
    ),
    accessTermsAndConditions:
        'I understand that the files indicated above as open access will be submitted as open access ' +
        'and will be made publicly available immediately or will be made available on the indicated ' +
        'embargo date.  All other files submitted will be accessible by UQ eSpace administrators.',
    validation: {
        ['notFiles']: 'Invalid files ([fileNames])',
        ['invalidFileNames']: 'File(s) ([fileNames]) have invalid file name',
        ['tooBigFiles']: 'File(s) ([fileNames]) exceed maximum allowed upload file size',
        ['tooManyFiles']:
            'Maximum number of files ([maxNumberOfFiles]) has been exceeded. ' +
            'File(s) ([fileNames]) will not be uploaded',
        ['duplicateFiles']: 'File(s) ([fileNames]) are duplicates and have been ignored',
        ['sameFileNameWithDifferentExt']:
            'File(s) ([fileNames]) have same name that match with other files with different extension',
    },
    errorTitle: 'Upload Errors',
    successTitle: 'Success',
    successMessage: 'Successfully added [numberOfFiles] file(s) to upload queue.',
    fileUploadRestrictionHeading: 'File upload restrictions',
    fileUploadRestrictions: (
        <div>
            Please ensure your files:
            <ul>
                <li>begin with a letter and are less than 45 characters long</li>
                <li>contain only upper and lowercase alphanumeric characters, and underscores</li>
                <li>
                    have only a single period which precedes the file extension: e.g. “.pdf”, “.mov”, “.tiff”, “.wav”
                    etc.
                </li>
                <li>
                    two periods are allowed for multipart zip files. Allowed formats for part description are: e.g.
                    “.001 ... .999”, “.r01 ... .r999” and “.part1 ... .part999”
                </li>
                <li>are uploaded individually and not inside a folder</li>
            </ul>
        </div>
    ),
    fileUploadInstruction: <p>Click here to select files, or drag files into this area to upload</p>,
    fileUploadRow: {
        deleteHint: 'Remove this file',
        deleteRecordConfirmation: {
            confirmationTitle: 'Delete file',
            confirmationMessage: 'Are you sure you want to remove this file from the uploaded queue?',
            cancelButtonLabel: 'No',
            confirmButtonLabel: 'Yes',
        },
        filenameColumn: 'File name',
        fileAccessColumn: 'File access',
        embargoDateColumn: 'Embargo date',
        embargoDateClosedAccess: 'No date required',
        uploadInProgressText: 'Uploading...',
        defaultView: {
            embargoDateClosedAccess: 'No date required',
        },
        mobileView: {
            filenameColumn: 'File name',
            fileAccessColumn: 'File access',
            embargoDateColumn: 'Embargo date',
            embargoDateClosedAccess: 'No date required',
        },
        fileUploadRowAccessSelector: {
            initialValue: 'Select access conditions',
            accessSelectOptionsText: {
                [OPEN_ACCESS_ID]: 'Open Access',
                [CLOSED_ACCESS_ID]: 'Closed Access',
            },
            errorMessage: 'This field is required',
        },
    },
};
