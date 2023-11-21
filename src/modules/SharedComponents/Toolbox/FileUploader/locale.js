import React from 'react';

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
        ['invalidMimeTypeFiles']: 'File(s) ([fileNames]) are not supported',
        ['tooBigFiles']: 'File(s) ([fileNames]) exceed maximum allowed upload file size',
        ['tooManyFiles']:
            'Maximum number of files ([maxNumberOfFiles]) has been exceeded. ' +
            'File(s) ([fileNames]) will not be uploaded',
        ['duplicateFiles']: 'File(s) ([fileNames]) are duplicates and have been ignored',
        ['sameFileNameWithDifferentExt']: 'File(s) ([fileNames]) name matches with an existing file.',
    },
    errorTitle: 'Upload Errors',
    successTitle: 'Success',
    successMessage: 'Successfully added [numberOfFiles] file(s) to upload queue.',
    delayNotice: 'Notice',
    delayMessage: 'During peak times, there may be a delay before newly uploaded files appear on the record.',
    fileUploadRestrictionHeading: 'File upload restrictions',
    fileUploadRestrictions: (
        <div>
            Please ensure:
            <ul>
                <li>files are under 5GB in size</li>
                <li>file names begin with a letter and are less than 45 characters long</li>
                <li>file names contain only upper and lowercase alphanumeric characters, and underscores</li>
                <li>file names must not contain any spaces</li>
                <li>
                    file names have only a single period which precedes the file extension: e.g. “.pdf”, “.mov”,
                    “.tiff”, “.wav” etc.
                    <br />
                    (two periods are allowed for multipart zip files. Allowed formats for part description are: e.g.
                    “.001 ... .999”, “.r01 ... .r999” and “.part1 ... .part999”)
                </li>
                <li>
                    file names have one of the following extensions: 7z, avi, csv, gif, gsheet, gz, jpe, jpeg, jpg, m1v,
                    m2v, m4a, mk3d, mks, mkv, mov, mp3, mp4, mp4v, mpe, mpeg, mpg, mxf, ods, pdf, png, qt, rar, tar,
                    tif, tiff, wav, wma, wmv, xla, xlc, xlm, xls, xlsx, xlt, xlw, zip
                </li>
                <li>file names, regardless of extension, must be unique</li>
                <li>files are uploaded individually and not inside a folder</li>
            </ul>
        </div>
    ),
    fileUploadInstruction: (
        <p>
            Click here to select files,
            <br />
            or drag files into this area to upload
        </p>
    ),
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
        invalidEmbargoDateWarning: filename => `Invalid embargo date for ${filename}. Date will be ignored.`,
        embargoDateClosedAccess: 'No date required',
        uploadInProgressText: 'Uploading...',
        defaultView: {
            embargoDateClosedAccess: 'No date required',
            accessCondition: {
                label: 'Access conditions',
                selectPrompt: 'Select access conditions',
                errorMessage: 'This field is required',
            },
        },
        mobileView: {
            filenameColumn: 'File name',
            fileAccessColumn: 'File access',
            embargoDateColumn: 'Embargo date',
            embargoDateClosedAccess: 'No date required',
            accessCondition: {
                label: 'Access conditions',
                selectPrompt: 'Select access conditions',
                errorMessage: 'This field is required',
            },
        },
    },
};
