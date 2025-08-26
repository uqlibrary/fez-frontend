import React from 'react';
import { default as txt } from './components';
import {
    fileUploaderLocale,
    FILE_ACCESS_CONDITION_OPEN,
    FILE_ACCESS_CONDITION_CLOSED,
} from 'modules/SharedComponents/Toolbox/FileUploader';
import { selectFields } from 'locale/selectFields';

const thesisSubmission = {
    title: 'Higher degree by research thesis deposit',
    text: (
        <span>
            Required fields are marked with
            <span className="requiredField">
                <label>&nbsp;</label>
            </span>
        </span>
    ),
    notAllowedMessage: (
        <p>
            Are you submitting a HDR thesis? HDR theses are now submitted via the UQ Research Data Manager (UQRDM)
            following{' '}
            <a href="https://my.uq.edu.au/information-and-services/higher-degree-research/my-thesis/2-thesis-submission">
                this process
            </a>
            . Please see the{' '}
            <a href="https://guides.library.uq.edu.au/for-researchers/uq-research-data-manager/hdr-support-thesis#s-lg-box-22941538">
                UQRDM thesis submission guide
            </a>{' '}
            for more information.
        </p>
    ),
    fileUpload: {
        title: 'Upload files',
        failedAlertLocale: {
            type: 'error',
            title: 'FILE UPLOAD ERROR',
            messageWithRetry:
                "There was an issue uploading your thesis files. You can try uploading again by clicking the 'Retry upload' button, but if you continue to have trouble uploading, please contact [linkStart]the Graduate School[linkEnd].",
            message:
                'Not all files were uploaded. Please contact [linkStart]the Graduate School[linkEnd] for assistance.',
            emailRecipient: 'thesis@gradschool.uq.edu.au',
            emailSubject: 'Problem with Submission to UQ eSpace - [studentFullName], [studentNumber]',
            actionButtonLabel: 'Retry upload',
        },
        retrySuccessLocale: {
            type: 'done',
            title: 'FILE UPLOAD SUCCESS',
            message: 'File upload retry succeeded.',
        },
        locale: {
            instructions: '',
            accessTermsAndConditions:
                'I understand that the files indicated above as open access will be submitted as open access and will be made publicly available immediately or will be made available on the indicated embargo date.  All other files submitted will be accessible by UQ eSpace administrators.',
            validation: {
                ['notFiles']: 'Invalid files ([fileNames])',
                ['invalidFileNames']: 'File(s) ([fileNames]) have invalid file name',
                ['invalidMimeTypeFiles']: 'File(s) ([fileNames]) are not supported',
                ['tooBigFiles']: 'File(s) ([fileNames]) exceed maximum allowed upload file size',
                ['tooManyFiles']:
                    'Maximum number of files ([maxNumberOfFiles]) has been exceeded. File(s) ([fileNames]) will not be uploaded',
                ['duplicateFiles']: 'File(s) ([fileNames]) are duplicates and have been ignored',
            },
            successTitle: 'Success',
            successMessage: 'Successfully added [numberOfFiles] file(s) to upload queue.',
            delayNotice: 'Notice',
            delayMessage: 'During peak times, there may be a delay before newly uploaded files appear on the work.',
            errorTitle: 'Upload Errors',
            fileUploadRestrictionHeading: 'File upload restrictions',
            fileUploadRestrictions: (
                <div>
                    Maximum file size is 5GB. <br />
                    PDF files must be saved using the following naming structure{' '}
                    <b>&lt;student number&gt;_&lt;degree type&gt;_&lt;document name&gt;.pdf</b>. Document name could be
                    thesis, abstract, and etc. For example:
                    <ul>
                        <li>s1234567_phd_thesis.pdf</li>
                        <li>s1234567_phd_abstract.pdf</li>
                    </ul>
                    Supplementary audio files are to be in MP3 format. <br />
                    Supplementary video files are to be in WMV or AVI format. <br />
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
    cancelLink: 'https://my.uq.edu.au/information-and-services/higher-degree-research/my-thesis/2-thesis-submission',
    cancel: 'Cancel',
    submit: 'Deposit your thesis',
    afterSubmitLink:
        'https://my.uq.edu.au/information-and-services/higher-degree-research/my-thesis/2-thesis-submission',
    afterSubmit: 'Return to the Graduate School website',
    afterSubmitTitle: 'Your thesis has been deposited',
    afterSubmitText: 'You will receive an email confirming your thesis deposit shortly.',
    depositConfirmation: {
        confirmationTitle: 'Thesis deposit',
        confirmationMessage:
            'You are about to deposit your thesis with attached files. Are you sure you want to proceed?',
        cancelButtonLabel: 'No, continue editing',
        confirmButtonLabel: 'Yes, deposit thesis',
    },
    sessionExpiredConfirmation: {
        confirmationTitle: 'Session Expired',
        confirmationMessage:
            'Your session has expired and you will now be redirected to the login page and then redeposit your thesis.',
        cancelButtonLabel: 'Cancel',
        confirmButtonLabel: 'Redirect to login',
    },
    depositFailedMessage:
        'Error has occurred during request and request cannot be processed. Check your internet connection and TRY AGAIN or contact UQ Graduate School administrators.',
};

export default {
    cancel: 'Abandon and search again',
    submit: 'Submit for approval',
    publicationType: {
        title: 'Work type',
        inputLabelText: 'Work type',
        hintText: 'Select a Work type from the dropdown list',
        help: {
            title: 'Add a missing work',
            text: (
                <>
                    <p>
                        For help manually adding a work, access the help guide{' '}
                        <a
                            style={{ fontWeight: 700 }}
                            target="_blank"
                            rel="noreferrer"
                            href="https://guides.library.uq.edu.au/research-and-teaching-staff/uqespace-publications-datasets/add-missing-work"
                        >
                            here
                        </a>
                        .
                    </p>
                    <h3>Non-traditional research outputs</h3>
                    <p>
                        For help selecting the relevant type for your work, access the guide{' '}
                        <a
                            style={{ fontWeight: 700 }}
                            target="_blank"
                            rel="noreferrer"
                            href="https://guides.library.uq.edu.au/research-and-teaching-staff/uqespace-publications-datasets/non-traditional-research-outputs#s-lg-box-20857679"
                        >
                            here
                        </a>
                        .
                    </p>
                </>
            ),
            buttonLabel: 'Close',
        },
    },
    publicationSubtype: {
        title: 'Work subtype',
        inputLabelText: 'Work subtype',
        hintText: 'Select a work subtype from the dropdown list',
    },
    contentIndicators: {
        help: {
            title: 'Content Indicators',
            text: (
                <p>
                    For more information about content indicators, click{' '}
                    <a
                        style={{ fontWeight: 700 }}
                        target="_blank"
                        rel="noreferrer"
                        href="https://guides.library.uq.edu.au/research-and-teaching-staff/uqespace-publications-datasets/content-indicators"
                    >
                        here
                    </a>
                </p>
            ),
            buttonLabel: 'Close',
        },
        title: 'Optional: Content Indicators',
        description:
            'If relevant to your work, you can select multiple content indicators ' +
            'to add more information about your work.',
        fieldLabels: {
            label: 'Select any relevant indicator(s).',
        },
    },
    generic: {
        information: {
            title: 'Generic document information',
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Title of generic document',
                },
                publicationPlace: {
                    label: 'Place of publication',
                    placeholder: '',
                },
                publisher: {
                    label: 'Publisher',
                    placeholder: '',
                },
                abstract: {
                    label: 'Abstract',
                    placeholder: 'Add a full article abstract here.',
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
            },
        },
        authors: txt.components.authors,
        optional: {
            title: 'Optional information',
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information',
                },
                url: {
                    label: 'Link',
                    placeholder: 'Enter URL for this work',
                },
            },
        },
    },
    journalArticle: {
        information: {
            title: 'Journal article information',
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Title of journal article',
                },
                journalTitle: {
                    label: 'Journal name',
                    placeholder: '',
                },
                doi: {
                    label: 'DOI',
                    placeholder: 'Enter a valid DOI (e.g. 10.123/456)',
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
                subtype: 'Work subtype',
            },
        },
        authors: txt.components.authors,
        optional: {
            title: 'Optional details',
            fieldLabels: {
                volume: 'Volume',
                issue: 'Issue',
                startPage: 'Start page',
                endPage: 'End page',
                articleNumber: 'Article number',
                notes: 'Notes (not publicly viewable)',
                url: 'Link (URL)',
            },
        },
    },
    book: {
        information: {
            title: 'Book information',
            fieldLabels: {
                bookTitle: 'Book title',
                subtype: 'Work subtype',
                publicationPlace: 'Place of publication',
                publisher: 'Publisher',
                date: {
                    title: 'Date published',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
                extent: {
                    label: 'Total pages',
                    placeholder: '',
                },
                doi: {
                    label: 'DOI',
                    placeholder: 'Enter a valid DOI (e.g. 10.123/456)',
                },
            },
        },
        authors: txt.components.authors,
        editors: txt.components.editors,
        optional: {
            title: 'Optional details',
            fieldLabels: {
                articleNumber: 'Article number',
                notes: 'Notes (not publicly viewable)',
                url: 'Link (URL)',
            },
        },
        ntro: {
            title: 'NTRO metadata',
        },
    },
    bookChapter: {
        information: {
            title: 'Book chapter information',
            fieldLabels: {
                bookChapterTitle: 'Book chapter title',
                bookTitle: 'Book title',
                subtype: 'Work subtype',
                publicationPlace: 'Place of publication',
                publisher: 'Publisher',
                doi: {
                    label: 'DOI',
                    placeholder: 'Enter a valid DOI (e.g. 10.123/456)',
                },
                date: {
                    title: 'Date published',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
            },
        },
        authors: txt.components.authors,
        editors: txt.components.editors,
        other: {
            title: 'Other work details',
            fieldLabels: {
                edition: 'Edition',
                startPage: 'Start page',
                endPage: 'End page',
                notes: 'Notes (not publicly viewable)',
                url: 'Link (URL)',
            },
        },
    },
    conferencePaper: {
        information: {
            title: 'Conference paper information',
            fieldLabels: {
                title: 'Title of paper',
                conferenceName: 'Conference name',
                conferenceLocation: 'Conference location',
                conferenceDates: 'Conference dates (e.g 3-5 May)',
                proceedingsTitle: 'Proceedings title',
                subtype: 'Work subtype',
                publicationPlace: 'Place of publication',
                publisher: 'Publisher',
                journalName: 'Journal name',
                doi: {
                    label: 'DOI',
                    placeholder: 'Enter a valid DOI (e.g. 10.123/456)',
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
            },
        },
        authors: txt.components.authors,
        other: {
            title: 'Other work details',
            fieldLabels: {
                startPage: 'Start page',
                endPage: 'End page',
                notes: 'Notes (not publicly viewable)',
                url: 'Link (URL)',
            },
        },
    },
    researchReport: {
        information: {
            title: 'Research report information',
            fieldLabels: {
                orgUnitName: {
                    floatingLabelText: 'School, Centre or Institute',
                    hintText: 'Organisational unit, eg. School of Business',
                },
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Type title of research report',
                },
                publicationPlace: {
                    label: 'Place of publication',
                    placeholder: 'Type the place of publication',
                },
                publisher: {
                    label: 'Publisher',
                    placeholder: 'Type the name of the publisher',
                },
                reportNumber: {
                    label: 'Report number',
                    placeholder: 'Type the report number',
                },
                doi: {
                    label: 'DOI',
                    placeholder: 'Enter a valid DOI (e.g. 10.123/456)',
                },
                date: {
                    title: 'Date published',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
                series: {
                    floatingLabelText: 'Series title',
                    hintText: 'Enter title of series',
                },
                totalPages: {
                    label: 'Total pages',
                    placeholder: 'Type total number of pages',
                },
            },
        },
        authors: txt.components.authors,
        other: {
            title: 'Other work details',
            fieldLabels: {
                abstract: {
                    label: 'Abstract',
                    placeholder: 'Type an abstract or summary of the work',
                },
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here',
                },
                url: {
                    label: 'Link',
                    placeholder: 'Type URL for this work',
                },
            },
        },
    },
    audioDocument: {
        information: {
            title: 'Audio document information',
            help: {
                title: 'Audio document information',
                text: (
                    <React.Fragment>
                        <p>
                            <b>Place of publication:</b> Provide the geographical location for the publisher or producer
                            of the work, i.e. city, country
                        </p>
                        <p>
                            <b>Publication date:</b> Provide the date recorded on the work, where available. For online
                            recordings or broadcasts, provide the date first publicly presented or released.
                        </p>
                    </React.Fragment>
                ),
                buttonLabel: 'Close',
            },
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Title of work',
                },
                publicationPlace: {
                    label: 'Place of publication',
                    placeholder: 'City, Country',
                },
                publisher: {
                    label: 'Publisher',
                    placeholder: 'Type the name of the publisher or producer of the work.',
                },
                abstract: {
                    label: 'Abstract',
                    placeholder: 'Provide an abstract or summary of the work.',
                },
                doi: {
                    label: 'DOI',
                    placeholder: 'Enter a valid DOI (e.g. 10.123/456)',
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
            },
        },
        creator: txt.components.creators,
        contributor: txt.components.contributors,
        optional: {
            title: 'Optional information',
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here.',
                },
                url: {
                    label: 'Link',
                    placeholder: 'Enter URL for this work.',
                },
            },
        },
    },
    patent: {
        information: {
            title: 'Patent information',
            fieldLabels: {
                title: 'Title of patent',
                patentNumber: 'Patent number',
                countryOfOrigin: 'Country of origin',
                date: {
                    title: 'Date patent issued',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
                patentOwner: 'Patent owner',
            },
        },
        authors: txt.components.creators,
        other: {
            title: 'Other patent details',
            fieldLabels: {
                notes: 'Notes (not publicly viewable)',
                url: 'Enter URL for this patent',
            },
        },
    },
    seminarPaper: {
        information: {
            title: 'Seminar paper information',
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Title of paper',
                },
                orgUnitName: {
                    floatingLabelText: 'School, Centre or Institute',
                    hintText: '',
                },
                orgName: {
                    floatingLabelText: 'Institution',
                    hintText: '',
                },
                series: {
                    floatingLabelText: 'Series',
                    hintText: 'Enter seminar series',
                },
                seminarDate: {
                    title: 'Seminar date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
                doi: {
                    label: 'DOI',
                    placeholder: 'Enter a valid DOI (e.g. 10.123/456)',
                },
            },
        },
        authors: txt.components.authors,
        optional: {
            title: 'Optional information',
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here',
                },
                url: {
                    label: 'Link',
                    placeholder: 'Enter a valid URL for this work',
                },
            },
        },
    },
    thesis: {
        information: {
            title: 'Thesis information',
            message: (
                <React.Fragment>
                    <p>Are you submitting a UQ Higher Degree by Research (HDR) thesis?</p>
                    <ul>
                        <li>
                            If you currently have a thesis already under examination and submitted your original thesis
                            via UQ eSpace please click <a href="/rhdsubmission">here</a>.
                        </li>
                        <li>
                            If you are submitting your thesis for the first time, please submit via UQ Research Data
                            Manager (UQRDM) following{' '}
                            <a href="https://my.uq.edu.au/information-and-services/higher-degree-research/my-thesis/2-thesis-submission">
                                this process
                            </a>
                            . Please see the{' '}
                            <a href="https://guides.library.uq.edu.au/for-researchers/uq-research-data-manager/hdr-support-thesis#s-lg-box-22941538">
                                UQRDM thesis submission guide
                            </a>{' '}
                            for more information.
                        </li>
                    </ul>
                    <p>To deposit another thesis type, use the form below.</p>
                </React.Fragment>
            ),
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Thesis title',
                },
                orgName: {
                    floatingLabelText: 'Institution name',
                    hintText: '',
                },
                orgUnitName: {
                    floatingLabelText: 'School, Centre or Institute',
                    hintText: 'School, Centre or Institute, eg. School of Business',
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
                thesisType: {
                    ...selectFields.thesisSubtype,
                },
                author: {
                    label: 'Author name',
                    placeholder: '',
                },
            },
        },
        supervisors: {
            ...txt.components.supervisors,
        },
        fieldOfResearch: {
            title: 'Field of research',
            description: 'Select up to 3 Field of Research (FoR) codes',
        },
        keywords: {
            title: 'Keywords',
            description:
                'Add up to 10 individual keywords, or a pipe separated list, that describe the content of the thesis. (eg. one|two|three)',
        },
        optional: {
            title: 'Optional information',
            fieldLabels: {
                doi: {
                    label: 'DOI',
                    placeholder: 'Enter a valid DOI (e.g. 10.123/456)',
                },
                totalPages: {
                    label: 'Total pages',
                    placeholder: '',
                },
                abstract: {
                    label: 'Abstract',
                    placeholder: 'Provide an abstract or summary of the work',
                },
                notes: {
                    title: 'Additional notes',
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Provide any additional information',
                },
            },
        },
    },
    collection: {
        title: 'Add a missing collection',
        information: {
            title: 'Collection information',
            fieldLabels: {
                documentTitle: {
                    placeholderlabel: 'Title',
                    placeholder: 'Thesis title',
                },
                orgName: {
                    floatingLabelText: 'Institution name',
                    hintText: '',
                },
                orgUnitName: {
                    floatingLabelText: 'Enrolling unit',
                    hintText: 'Enrolling unit, eg. School of Business',
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
                thesisType: {
                    label: 'Thesis type',
                },
                author: {
                    label: 'Author name',
                    placeholder: '',
                },
            },
        },
        supervisors: {
            ...txt.components.supervisors,
        },
        fieldOfResearch: {
            title: 'Field of research',
            description: 'Select up to 3 Field of Research (FoR) codes',
        },
        keywords: {
            title: 'Keywords',
            description:
                'Add up to 10 individual keywords, or a pipe separated list, that describe the content of the thesis. (eg. one|two|three)',
        },
        optional: {
            title: 'Optional information',
            fieldLabels: {
                doi: {
                    label: 'DOI',
                    placeholder: 'Enter a valid DOI (e.g. 10.123/456)',
                },
                totalPages: {
                    label: 'Total pages',
                    placeholder: '',
                },
                abstract: {
                    label: 'Abstract',
                    placeholder: 'Provide an abstract or summary of the work',
                },
                notes: {
                    title: 'Additional notes',
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Provide any additional information',
                },
            },
        },
    },
    preprint: {
        information: {
            title: 'Preprint information',
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Title of report',
                },
                date: {
                    title: 'Preprint date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
                doi: {
                    label: 'DOI',
                    placeholder: 'Enter a valid DOI (e.g. 10.123/456)',
                },
            },
        },
        authors: txt.components.authors,
        optional: {
            title: 'Optional details',
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here',
                },
                url: {
                    label: 'Link (URL)',
                    placeholder: 'Enter URL for this work',
                },
            },
        },
    },
    creativeWork: {
        information: {
            title: 'Creative work information',
            fieldLabels: {
                articleTitle: {
                    label: 'Title',
                    placeholder: 'Title of creative work',
                },
                placeOfPublication: {
                    label: 'Place of publication',
                    placeholder: 'Enter the place, location or venue',
                },
                publisher: {
                    label: 'Publisher',
                    placeholder: 'Enter the publisher or producer',
                },
                doi: {
                    label: 'DOI',
                    placeholder: 'Enter a valid DOI (e.g. 10.123/456)',
                },
                date: {
                    title: 'Publication/Start date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
                endDate: {
                    title: 'End date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
                startdate: {
                    title: 'Publication start date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
                abstract: {
                    label: 'Abstract/Description',
                    placeholder: 'Provide an abstract or summary of the work.',
                },
            },
        },
        authors: txt.components.authors,
        optional: {
            title: 'Optional information',
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here.',
                },
                url: {
                    label: 'Link',
                    placeholder: 'Enter a valid URL to the work',
                },
            },
        },
    },
    video: {
        information: {
            title: 'Video information',
            help: {
                title: 'Video information',
                text: (
                    <div>
                        <p>
                            <b>Place of publication:</b> Type the geographical location for the publisher or producer of
                            the work, i.e. city, country
                        </p>
                        <p>
                            <b>Publication date:</b> Type the date recorded on the work, where available. For online
                            recordings or broadcasts, enter the date first publicly presented or released.
                        </p>
                    </div>
                ),
                buttonLabel: 'Close',
            },
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Title of work',
                },
                publicationPlace: {
                    label: 'Place of publication',
                    placeholder: 'City, Country',
                },
                publisher: {
                    label: 'Publisher',
                    placeholder: 'Type the name of the publisher or producer of the work.',
                },
                abstract: {
                    label: 'Abstract',
                    placeholder: 'Provide an abstract or summary of the work.',
                },
                doi: {
                    label: 'DOI',
                    placeholder: 'Enter a valid DOI (e.g. 10.123/456)',
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
            },
        },
        creator: txt.components.creators,
        contributor: txt.components.contributors,
        optional: {
            title: 'Optional information',
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here.',
                },
                url: {
                    label: 'Link',
                    placeholder: 'Enter URL for this work.',
                },
            },
        },
    },
    imageDocument: {
        information: {
            title: 'Image information',
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Title of image',
                },
                doi: {
                    label: 'DOI',
                    placeholder: 'Enter a valid DOI (e.g. 10.123/456)',
                },
                date: {
                    title: 'Date created',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
                abstract: {
                    label: 'Abstract',
                    placeholder: 'Provide an abstract or summary of the work.',
                },
            },
        },
        creator: txt.components.creators,
        optional: {
            title: 'Optional information',
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here.',
                },
                url: {
                    label: 'Link',
                    placeholder: 'Enter URL for this work.',
                },
            },
        },
    },
    design: {
        information: {
            title: 'Design information',
            fieldLabels: {
                articleTitle: {
                    label: 'Title',
                    placeholder: 'Title of design',
                },
                projectName: {
                    label: 'Project name',
                    placeholder: 'Title of project',
                },
                projectDescription: {
                    label: 'Project description',
                    placeholder: 'Provide a summary/description of the project.',
                },
                placeOfPublication: {
                    label: 'Place of publication',
                    placeholder: 'Geographical location of publisher',
                },
                publisher: {
                    label: 'Publisher',
                    placeholder: 'The client, builder, or curator',
                },
                location: {
                    label: 'Location',
                    placeholder: 'Geographical location of design.',
                },
                doi: {
                    label: 'DOI',
                    placeholder: 'Enter a valid DOI (e.g. 10.123/456)',
                },
                date: {
                    title: 'Publication/Start date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
                projectStartDate: {
                    title: 'Project start date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
                endDate: {
                    title: 'End date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
            },
        },
        authors: txt.components.designers,
        optional: {
            title: 'Optional information',
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here.',
                },
                url: {
                    label: 'Link',
                    placeholder: 'Enter URL for this work.',
                },
            },
        },
    },
    newspaperArticle: {
        information: {
            title: 'Newspaper article information',
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Enter article title',
                },
                newspaperName: {
                    floatingLabelText: 'Newspaper name',
                    hintText: 'Enter title of the journal',
                },
                date: {
                    title: 'Publication Date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
                startPage: {
                    label: 'Start page',
                    placeholder: '',
                },
                endPage: {
                    label: 'End page',
                    placeholder: '',
                },
            },
        },
        authors: txt.components.authors,
        optional: {
            title: 'Optional details',
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here',
                },
                url: {
                    label: 'Link',
                    placeholder: 'Type URL for this work',
                },
            },
        },
    },
    departmentTechnicalReport: {
        information: {
            title: 'Department technical report information',
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Title of report',
                },
                orgName: {
                    floatingLabelText: 'Institution name',
                    hintText: '',
                },
                orgUnitName: {
                    floatingLabelText: 'School, Centre or Institute',
                    hintText: '',
                },
                series: {
                    floatingLabelText: 'Series',
                    placeholder: '',
                },
                reportNumber: {
                    floatingLabelText: 'Report number',
                    hintText: '',
                },
                doi: {
                    label: 'DOI',
                    placeholder: 'Enter a valid DOI (e.g. 10.123/456)',
                },
                date: {
                    title: 'Date published',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
                totalPages: {
                    label: 'Total pages',
                    placeholder: 'Type total number of pages',
                },
                abstract: {
                    label: 'Abstract',
                    placeholder: 'Provide an abstract or summary of the work.',
                },
            },
        },
        authors: txt.components.authors,
        other: {
            title: 'Other details',
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here',
                },
                url: {
                    label: 'Link',
                    placeholder: 'Type URL for this work',
                },
            },
        },
    },
    workingPaper: {
        information: {
            title: 'Working paper information',
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Title of paper',
                },
                orgUnitName: {
                    floatingLabelText: 'School, Centre or Institute',
                    hintText: '',
                },
                orgName: {
                    floatingLabelText: 'Institution',
                    hintText: '',
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
                series: {
                    floatingLabelText: 'Series',
                    hintText: '',
                },
                paperNumber: {
                    floatingLabelText: 'Paper number',
                    hintText: '',
                },
                totalPages: {
                    label: 'Total pages',
                    placeholder: 'Enter total number of pages in the paper.',
                },
                abstract: {
                    label: 'Abstract',
                    placeholder: 'Provide an abstract or summary of the work.',
                },
                doi: {
                    label: 'DOI',
                    placeholder: 'Enter a valid DOI (e.g. 10.123/456)',
                },
            },
        },
        authors: txt.components.authors,
        other: {
            title: 'Optional details',
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here',
                },
                url: {
                    label: 'Link',
                    placeholder: 'Type URL for this work',
                },
            },
        },
    },
    conferenceProceedings: {
        information: {
            title: 'Conference proceedings information',
            fieldLabels: {
                title: {
                    label: 'Title',
                    placeholder: 'Proceedings title',
                },
                conferenceName: {
                    label: 'Conference name',
                    placeholder: 'Type the name of conference',
                },
                conferenceLocation: {
                    label: 'Conference location',
                    placeholder: 'Type the place of conference',
                },
                conferenceDates: {
                    label: 'Conference dates (e.g 3-5 May)',
                    placeholder: 'Type the dates of conference',
                },
                proceedingsTitle: {
                    label: 'Proceedings title',
                    placeholder: 'Type the title of proceedings',
                },
                publicationPlace: {
                    label: 'Place of publication',
                    placeholder: 'Type the place of publication',
                },
                publisher: {
                    label: 'Publisher',
                    placeholder: 'Type the name of the publisher',
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                },
            },
        },
        editors: txt.components.editors,
        other: {
            title: 'Optional details',
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information',
                },
                link: {
                    label: 'Link (URL)',
                    placeholder: 'Enter URL for this work',
                },
            },
        },
    },
    fileUpload: {
        title: 'Upload files',
    },
    cancelWorkflowConfirmation: {
        confirmationTitle: 'Abandon workflow',
        confirmationMessage: 'Are you sure you want to abandon workflow?',
        cancelButtonLabel: 'No',
        confirmButtonLabel: 'Yes',
    },
    validationAlert: {
        type: 'warning',
        title: 'Validation',
        message: 'Form cannot be submitted until all fields are valid. Please review all input fields.',
    },
    errorAlert: {
        type: 'error_outline',
        title: 'Error',
        message: message =>
            `Error has occurred during request and request cannot be processed. ${message} Please contact eSpace administrators or try again later.`,
    },
    progressAlert: {
        type: 'info_outline',
        title: 'Saving',
        message: 'Creating new work is in progress.',
        showLoader: true,
    },
    successAlert: {
        type: 'done',
        title: 'Success',
        message: 'New work has been saved successfully.',
    },
    thesisSubmission,
    sbsSubmission: {
        ...thesisSubmission,
        title: 'Professional doctorate deposit',
        afterSubmitText:
            'You have successfully deposited your thesis to UQ eSpace. You wil receive a confirmation email soon.',
        cancelLink: undefined,
        afterSubmitLink: undefined,
        afterSubmit: undefined,
        fileUpload: {
            ...thesisSubmission.fileUpload,
            failedAlertLocale: {
                ...thesisSubmission.fileUpload.failedAlertLocale,
                messageWithRetry:
                    "There was an issue uploading your thesis files. You can try uploading again by clicking the 'Retry upload' button, but if you continue to have trouble uploading, please contact [linkStart]UQ eSpace[linkEnd].",
                message: 'Not all files were uploaded. Please contact [linkStart]UQ eSpace[linkEnd] for assistance.',
                emailRecipient: 'espace@library.uq.edu.au',
            },
            locate: {
                ...thesisSubmission.fileUpload.locale,
                accessTermsAndConditions: undefined,
                fileUploadRestrictions: (
                    <div>
                        Maximum file size is 5GB. <br />
                        PDF files must be saved using the following naming structure{' '}
                        <b>&lt;student number&gt;_&lt;degree type&gt;_&lt;document name&gt;.pdf</b>. Document name could
                        be thesis, abstract, and etc. For example:
                        <ul>
                            <li>s1234567_pd_abstract.pdf</li>
                            <li>s1234567_pd_totalthesis.pdf</li>
                        </ul>
                        Supplementary audio files are to be in MP3 format. <br />
                        Supplementary video files are to be in WMV or AVI format. <br />
                    </div>
                ),
            },
        },
    },
    addDataset: {
        pageTitle: 'Add data collection',
        information: {
            agreement: {
                title: 'Deposit agreement',
                text: (
                    <div>
                        <p>
                            1. I am the creator or co-creator of this dataset, or otherwise authorised to deposit or
                            describe it;
                        </p>
                        <p>2. I have permission to include any third-party content contained in the dataset;</p>
                        <p>3. The dataset is original;</p>
                        <p>4. The dataset does not infringe the legal rights of any third-party;</p>
                        <p>
                            5. I acknowledge that in depositing the dataset, I grant to UQeSpace a perpetual
                            non-exclusive licence to reproduce it and make it available in any format or language;
                        </p>
                        <p>
                            6. The dataset's creator(s) moral rights to be associated with the dataset will be respected
                            by UQeSpace.
                        </p>
                    </div>
                ),
            },
            dataset: {
                title: 'Dataset information',
                fieldLabels: {
                    datasetTitle: {
                        label: 'Dataset name',
                        placeholder: 'Type the descriptive name for the dataset',
                    },
                    description: {
                        label: 'Dataset description',
                        placeholder: "Describe the dataset's topic(s) and theme(s)",
                    },
                    contactName: {
                        label: 'Contact name',
                        placeholder: 'Type the name of primary contact for this dataset',
                    },
                    contactId: {
                        floatingLabelText: 'Contact name ID',
                        hintText: 'Type to search ID of primary contact for this dataset',
                    },
                    contactEmail: {
                        label: 'Contact email',
                        placeholder: 'Type the email address of primary contact for this dataset',
                    },
                    publisher: {
                        label: 'Publisher',
                        placeholder: 'This is where the dataset was originally made available e.g. UQ eSpace',
                    },
                    doi: {
                        label: 'DOI',
                        placeholder: 'Enter a valid DOI (e.g. 10.123/456)',
                    },
                    date: {
                        title: 'Publication year',
                        day: 'Day',
                        month: 'Month',
                        year: 'Year',
                    },
                    fieldOfResearchCodes: {
                        title: 'ANZSRC field of research (FoR) codes',
                        placeholder: '',
                    },
                },
            },
            creator: {
                ...txt.components.creators,
            },
            fieldOfResearchCodes: {
                ...txt.components.fieldOfResearchForm,
                text: 'Select Field of Research (FoR) codes',
            },
            accessAndLicensing: {
                title: 'Access and licence',
                help: {
                    title: 'Access and licence',
                },
                fieldLabels: {
                    accessConditions: {
                        label: 'Access conditions',
                    },
                    licensingAndTermsOfAccess: {
                        label: 'Licence',
                    },
                    copyrightNotice: {
                        label: 'Copyright notice',
                        placeholder: 'e.g. 2012, The University of Queensland',
                    },
                },
            },
            project: {
                title: 'Project information',
                fieldLabels: {
                    projectName: {
                        label: 'Project name',
                        placeholder: 'Type the name of the project that initiated the dataset',
                    },
                    projectDescription: {
                        label: 'Project description',
                        placeholder: 'Briefly describe the project, including purpose',
                    },
                    projectId: {
                        label: 'Project ID',
                        placeholder: 'Type the ID of the project',
                    },
                    fundingBody: {
                        label: 'Funding body',
                        placeholder:
                            'Type the name of the funding body9s) associated with your research e.g. ARC, NHMRC',
                    },
                    grantId: {
                        label: 'Grant IDs',
                        placeholder: 'e.g. ARC or NHMRC grant number',
                    },
                },
            },
            optionalDatasetDetails: {
                title: 'Dataset details',
                fieldLabels: {
                    typeOfData: {
                        label: 'Describe type',
                        placeholder: 'Type represented in the dataset e.g. excel file, images, video',
                    },
                    softwareRequired: {
                        label: 'Software required',
                        placeholder: 'List any software required to view the data',
                    },
                    collectionStart: {
                        label: 'Collection start date',
                        placeholder: 'Date that data started being collected',
                        name: 'fez_record_search_key_start_date.rek_start_date',
                    },
                    collectionEnd: {
                        label: 'Collection end date',
                        placeholder: 'Date that data ceased being collected',
                        name: 'fez_record_search_key_end_date.rek_end_date',
                        id: 'rek_end_date',
                    },
                    collectionValidationMessage: {
                        day: 'Invalid date',
                    },
                    geographicCoordinates: {
                        label: 'Geographic coordinates',
                        description: 'Use this tool to specify the geographic co-ordinates the data relates to',
                    },
                    relatedDatasets: {
                        title: 'Related datasets/work',
                        form: {
                            locale: {
                                title: 'Related datasets/work',
                                inputFieldLabel: 'Related datasets/works in eSpace',
                                inputFieldHint:
                                    'Begin searching by title or PID for related works in eSpace and add it to the list',
                            },
                        },
                        header: {
                            locale: {
                                nameColumn: 'Related datasets/work',
                                reorderColumn: 'Reorder Related datasets/work',
                                deleteAll: 'Remove all Related datasets/work',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all Related datasets/work?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes',
                                },
                            },
                        },
                        row: {
                            locale: {
                                editHint: 'Edit this item',
                                moveUpHint: 'Move Related datasets/work up the order',
                                moveDownHint: 'Move Related datasets/work down the order',
                                deleteHint: 'Remove this Related datasets/work',
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete Related datasets/work',
                                    confirmationMessage: 'Are you sure you want to delete this Related datasets/work?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes',
                                },
                            },
                        },
                    },
                },
            },
            additionalNotes: {
                title: 'Additional information',
                fieldLabels: {
                    notes: {
                        label: 'Additional information',
                        placeholder: 'Additional information related to the dataset',
                    },
                    links: {
                        label: 'Link to data in external repository',
                        placeholder: 'Provide the URL to the dataset where stored in another repository',
                    },
                },
            },
        },
        cancel: 'Cancel',
        submit: 'Submit for approval',
        fileUpload: {
            title: 'Upload files',
            fileUploader: {
                ...fileUploaderLocale,
                fileUploadRow: {
                    ...fileUploaderLocale.fileUploadRow,
                    fileUploadRowAccessSelector: {
                        ...fileUploaderLocale.fileUploadRow.fileUploadRowAccessSelector,
                        options: [
                            { text: 'Open Access', value: FILE_ACCESS_CONDITION_OPEN },
                            { text: 'Mediated Access', value: FILE_ACCESS_CONDITION_CLOSED },
                        ],
                    },
                },
            },
        },
        cancelWorkflowConfirmation: {
            confirmationTitle: 'Cancel data collection',
            confirmationMessage: 'Are you sure you want to cancel adding this data collection?',
            cancelButtonLabel: 'No',
            confirmButtonLabel: 'Yes',
        },
    },
    addACollection: {
        title: 'Add a missing collection',
        help: {},
        details: {
            title: 'Collection details',
            help: {},
        },
        formLabels: {
            ismemberof: {
                ...selectFields.community,
                selectPrompt: 'Select a community this collection is a member of',
            },
            title: {
                label: 'Title of collection',
                placeholder: 'Type a title for this collection',
            },
            description: {
                label: 'Collection description',
                placeholder: 'Type a description of this collection.',
            },
            keywords: {
                description:
                    'Add up to 10 individual keywords, or a pipe separated list, that describe the content of the collection. (eg. one|two|three)',
                field: {
                    form: {
                        locale: {
                            inputFieldLabel: 'Keywords',
                            inputFieldHint: 'Type keywords',
                            addButtonLabel: 'Add',
                            id: 'keywords-input',
                        },
                    },
                    header: {
                        locale: {
                            nameColumn: 'Keyword',
                            reorderColumn: 'Reorder keywords',
                            deleteAll: 'Remove all keywords',
                            deleteAllConfirmation: {
                                confirmationTitle: 'Delete all',
                                confirmationMessage: 'Are you sure you want to delete all keywords?',
                                cancelButtonLabel: 'No',
                                confirmButtonLabel: 'Yes',
                            },
                        },
                    },
                    row: {
                        locale: {
                            moveUpHint: 'Move keyword up the order',
                            moveDownHint: 'Move keyword down the order',
                            deleteHint: 'Remove this keyword',
                            deleteRecordConfirmation: {
                                confirmationTitle: 'Delete keyword',
                                confirmationMessage: 'Are you sure you want to delete this keyword?',
                                cancelButtonLabel: 'No',
                                confirmButtonLabel: 'Yes',
                            },
                        },
                    },
                },
            },
            internalNotes: {
                label: 'Internal Notes (admin)',
                placeholder: 'Optionally enter internal notes',
            },
        },
        submit: 'Add collection',
        cancel: 'Return to the homepage',
        afterSubmitTitle: 'Collection added successfully',
        afterSubmitText: 'Your new collection was created successfully.',
        afterSubmitButton: 'Return to the homepage',
        reloadFormButton: 'Add another collection',
        addFailedMessage: error =>
            `Your attempt to add this collection has failed (Error: ${error.message}). Please try again later or contact the eSpace team.`,
    },
    addACommunity: {
        title: 'Add a missing community',
        help: {},
        details: {
            title: 'Community details',
            help: {},
        },
        formLabels: {
            title: {
                label: 'Title of community',
                placeholder: 'Type a title for this community',
            },
            description: {
                label: 'Community description',
                placeholder: 'Type a description of this community.',
            },
            keywords: {
                description:
                    'Add up to 10 individual keywords, or a pipe separated list, that describe the content of the community. (eg. one|two|three)',
                field: {
                    form: {
                        locale: {
                            inputFieldLabel: 'Keywords',
                            inputFieldHint: 'Type keywords',
                            addButtonLabel: 'Add',
                            id: 'keywords-input',
                        },
                    },
                    header: {
                        locale: {
                            nameColumn: 'Keyword',
                            reorderColumn: 'Reorder keywords',
                            deleteAll: 'Remove all keywords',
                            deleteAllConfirmation: {
                                confirmationTitle: 'Delete all',
                                confirmationMessage: 'Are you sure you want to delete all keywords?',
                                cancelButtonLabel: 'No',
                                confirmButtonLabel: 'Yes',
                            },
                        },
                    },
                    row: {
                        locale: {
                            moveUpHint: 'Move keyword up the order',
                            moveDownHint: 'Move keyword down the order',
                            deleteHint: 'Remove this keyword',
                            deleteRecordConfirmation: {
                                confirmationTitle: 'Delete keyword',
                                confirmationMessage: 'Are you sure you want to delete this keyword?',
                                cancelButtonLabel: 'No',
                                confirmButtonLabel: 'Yes',
                            },
                        },
                    },
                },
            },
            internalNotes: {
                label: 'Internal Notes (admin)',
                placeholder: 'Optionally enter internal notes',
            },
        },
        submit: 'Add community',
        cancel: 'Cancel and return to the homepage',
        afterSubmitTitle: 'Community added successfully',
        afterSubmitText: 'Your new community was created successfully.',
        afterSubmitButton: 'Return to the homepage',
        AddAnotherButton: 'Add another community',
        addFailedMessage: error =>
            `Your attempt to add this community has failed (Error: ${error.message}). Please try again later or contact the eSpace team.`,
    },
};
