import React from 'react';
import FontIcon from 'material-ui/FontIcon';

export default {
    global: {
        title: 'UQ eSpace',
        logo: 'https://static.uq.net.au/v1/logos/corporate/uq-logo-white.svg',
        labels: {
            buttons: {
                cancel: 'Cancel',
                abandon: 'Abandon and search again',
                close: 'Close',
                delete: 'Delete',
                submitForApproval: 'Submit for approval',
                submissionInProgress: 'Submitting...'
            }
        }
    },
    authentication: {
        signInText: 'Log in',
        signOutText: 'Log out'
    },
    menu: {
        myDashboard: {
            primaryText: 'My dashboard'
        },
        myResearch: {
            primaryText: 'My research'
        },
        addMissingRecord: {
            primaryText: 'Add a missing record'
        },
        claimPublication: {
            primaryText: 'Claim publications'
        },
        manageUsers: {
            primaryText: 'Manage users'
        },
        manageGroups: {
            primaryText: 'Manage groups'
        },
        manageAuthors: {
            primaryText: 'Manage authors'
        },
        browse: {
            primaryText: 'Browse',
            secondaryText: 'UQ\'s digital repository'
        },
        search: {
            primaryText: 'Search'
        },
        faqs: {
            primaryText: 'FAQs'
        },
        about: {
            primaryText: 'About',
        },
    },
    notifications: {
        addRecord: {
            cancelMessage: 'Publication has not been saved',
            saveMessage: 'Publication has been saved for later',
            submitMessage: 'Publication has been submitted for approval'
        }
    },
    mapping: {
        vocabs: [
            {'documentId': 174, 'vocabId': 453581},
            {'documentId': 177, 'vocabId': 453588},
            {'documentId': 130, 'vocabId': 453596},
            {'documentId': 313, 'vocabId': 453594},
            {'documentId': 179, 'vocabId': 453573}
        ]
    },
    pages: {
        about: {
            title: 'About UQ eSpace',
            text: (
                <div>
                    <h3>Information</h3>
                    <p>UQ eSpace is the single authoritative source for the research outputs and research data of the
                        staff and students of the University of Queensland and is the archival home of UQ Research
                        Higher Degree digital theses. UQ eSpace raises the visibility and accessibility of UQ
                        publications to the wider world and provides data for mandatory Government reporting
                        requirements such as Excellence in Research for Australia (ERA), as well as for internal UQ
                        systems, including Academic Portal and the DataHub. It operates as an institutional repository
                        for open access publications, research datasets and other digitised materials created by staff
                        of the University such as print materials, photographs, audio materials, videos, manuscripts and
                        other original works. UQ eSpace provides metadata to UQ Researchers in order to raise the
                        publication profile of researchers at UQ.</p>
                    <p>The University of Queensland has implemented an Open Access for UQ Research Outputs policy that
                        requires UQ researchers to make publications arising from their research openly available via UQ
                        eSpace. It has also implemented a Research Data Management policy that sets out the requirements
                        for University of Queensland researchers to ensure that their research data are managed
                        according to legal, statutory, ethical and funding body requirements.</p>
                    <h3>General Enquiries</h3>
                    <p>
                        Tel: 07 334 69775 <br/>
                        Email: espace@library.uq.edu.au <br/>
                    </p>
                    <h3>Staff contact</h3>
                    <p>
                        Andrew Heath <br/>
                        Manager, UQ eSpace<br/>
                        Tel: 07 334 69981<br/>
                        Email: a.heath@library.uq.edu.au<br/>
                    </p>
                    <p>
                        Mary-Anne Marrington<br/>
                        Senior Librarian, UQ eSpace<br/>
                        Tel: 07 334 69775<br/>
                        Email: m.marrington@library.uq.edu.au<br/>
                    </p>
                </div>
            ),
            help: {
                title: 'Search help',
                text: (
                    <div>
                        <h3>Simple search</h3>
                        <p>
                            Searching all fields is the default when using the front page or upper right search field.
                        </p>
                        <h3>Advanced search</h3>
                        <p>
                            Select SEARCH in the navigation bar above for advanced search options. (Link)
                        </p>
                    </div>
                ),
                button: 'OK'
            }
        },
        browse: {
            title: 'Browse eSpace',
            text: ( <div>
                    <p>
                        <a href="https://auth.library.uq.edu.au/login">Temporary login link...</a>
                    </p>
                </div>
            ),
            help: {
                title: 'Search help',
                text: (
                    <div>
                        <h3>Simple search</h3>
                        <p>
                            Searching all fields is the default when using the front page or upper right search field.
                        </p>
                        <h3>Advanced search</h3>
                        <p>
                            Select SEARCH in the navigation bar above for advanced search options. (Link)
                        </p>
                    </div>
                ),
                button: 'OK'
            }
        },
        addRecord: {
            title: 'Add a missing record to eSpace',
            stepper: {
                step1Label: 'Search for your publication',
                step2Label: 'Search results',
                step3Label: 'Add your publication',
                defaultErrorMessage: 'Error'
            },
            searchForPublication: {
                title: 'Search for your publication',
                explanationText: 'Enter either the publication DOI (e.g. 10.1163/9789004326828), Pubmed Id (e.g. 28131963) or the title of the publication. This will allow us to check whether the record is already in eSpace or is available from another source.',
                defaultSearchFieldLabel: 'Enter DOI, Pubmed Id or Title',
                defaultButtonLabel: 'Search',
                errorMsg: 'Please enter a valid publication DOI (e.g. 10.1163/9789004326828), Pubmed ID (e.g. 28131963) or the title (min 10 characters) of the publication',
                help: {
                    title: 'Search for your publication',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                }
            },
            inlineLoader: {
                message: 'Loading ...'
            },
            searchResults: {
                title: 'Possible matches found',
                explanationText: 'Top [noOfResults] potential match(es) displayed - claim a matching article below, refine your search or create a new eSpace record.',
                claimRecordBtnLabel: 'Claim This Record',
                help: {
                    title: 'Possible matches found',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                },
                limit: 5
            },
            noMatchingRecords: {
                title: 'No matching records found',
                explanationText: 'We were unable to match any results to your search criteria. Please, search again or create a new eSpace record.',
                searchAgainBtnLabel: 'Search again',
                addPublicationBtnLabel: 'Add a new publication',
                help: {
                    title: 'No matchings records?',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                },
                defaultProps: {
                    searchAgainBtnLabel: 'Search again?',
                    addPublicationBtnLabel: 'Add new publication'
                }
            },
            publicationTypeForm: {
                popularTypesList: ['Book', 'Book Chapter', 'Conference Paper', 'Journal Article'],
                title: 'Add your publication',
                maxSearchResults: 10,
                publicationTypeLabel: 'Select publication type',
                selectFirstOptionLabel: 'Choose a publication type',
                help: {
                    title: 'Add your publication',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                },
                documentTypes: {
                    JOURNAL_ARTICLE: 'journal article'
                }
            },
            addJournalArticle: {
                journalArticleInformation: {
                    title: 'Journal article information',
                    help: {
                        title: 'Journal article information',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                    },
                    fields: {
                        titleLabel: 'Title',
                        nameLabel: 'Journal name',
                        publishDateLabel: 'Publishing date',
                        publicationSubType: 'Publication subtype',
                        selectFirstPublicationSubTypeLabel: 'Choose a publication subtype',
                    }
                },
                optionalDetails: {
                    title: 'Optional publication details',
                    help: {
                        title: 'Optional publication details',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                    },
                    fields: {
                        volumeLabel: 'Volume',
                        issueLabel: 'Issue',
                        startPageLabel: 'Start page',
                        endPageLabel: 'End page',
                        articleNumber: 'Article number',
                        notesLabel: 'Notes (not publicly viewable)',
                        urlLabel: 'Link (URL)'
                    }
                },
                dialog: {
                    title: 'Submission sent',
                    content: 'Your item will be referred to a UQ eSpace Staging staff member for editing, prior to being moved into a publicly viewable collection. Please note that our current processing priority is for publications between 2008 and 2014 to meet the requirements of ERA 2015, HERDC 2015 and Q-index.',
                    primaryButtonLabel: 'Ok',
                    primaryLink: '/dashboard',
                    secondaryButtonLabel: 'Add another missing record'
                }
            }
        },
        claimPublications: {
            title: 'Claim publications',
            text: ( <div>
                    <p>
                        possibly your publications....
                    </p>
                </div>
            ),
            help: {
                title: 'Help',
                text: (
                    <div>
                        <p>
                            Help on possibly your publications...
                        </p>
                    </div>
                ),
                button: 'OK'
            }
        },
    },
    sharedComponents: {
        authors: {
            title: 'Authors',
            help: {
                title: 'Authors',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
            },
            limit: 5,
            fields: {
                authorName: 'authorName',
                authorIdentifier: 'authorIdentifier',
                authorNameLabel: 'Add an author (name as published)',
                authorIdentifierLabel: 'UQ identifier',
                autoCompleteFirstEntryLabel: 'Add author as entered:'
            },
            rows: {
                moveRecordUp: 'Move record up the order',
                moveRecordDown: 'Move record down the order',
                removeRecord: 'Remove this author'
            },
            messages: {
                authorIdentifierExists: 'Author identifier is already added',
                authorNameMissing: 'Please enter an author\s name',
                deleteAllAuthorsDialogContent: 'Are you sure you want to remove all these authors?',
                deleteAuthorDialogContent: 'Are you sure you want to remove this author?',
            },
            buttons: {
                addAuthorLabel: 'Add Author',
                removeAllLabel: 'Remove all authors'
            },
            ordinalData: {
                list: [
                    'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Nineth', 'Tenth'
                ],
                default: 'Next',
                suffix: 'listed author'
            },
            constants: {
                autoCompleteEnterKey: -1,
                autoCompleteFirstOption: 0,
                enterKey: 'Enter',
                firstRow: 0,
                tabKey: 'Tab',
                timeoutLimit: 300
            }
        },
        files: {
            title: 'Files',
            subTitle: 'Upload new files',
            help: {
                title: 'Files',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
            },
            limit: 10,
            filenameLimit: 45,
            formSectionPrefix: 'fileUploader',
            messages: {
                deleteAllFilesDialogContent: 'Are you sure you want to delete all these files?',
                deleteFileDialogContent: 'Are you sure you want to delete this file?',
                deleteAllFilesToolTip: 'Delete all files',
                deleteFileToolTip: 'Delete this file',
                maxFiles: 'Only [maxNumberOfFiles] files are allowed to be uploaded.',
                invalidFormatFile: 'Invalid file name.',
                invalidFormatFiles: '[numberOfRejectedFiles] have an invalid file name.',
                invalidFileLength: 'Filename is too long',
                invalidFileLengths: '[numberOfLongFiles] filenames are too long',
                existingFile: 'File has already been added.',
                existingFiles: '[numberOfExistingFiles] have already been added.',
                cancelledUpload: 'File upload cancelled.',
                noDate: 'No Date',
                uploadError: {
                    default: 'There seems to be a problem uploading file(s). Please, try again later.'
                },
                openAccessConfirmation: (
                    <div>I understand that the files indicated above will be submitted as open access and will be made publicaly available immediately,
                        or where indicated as closed access, will be made available on the indicated embargo date.</div>
                )
            },
            fields: {
                filenameRestrictions: (
                    <div className="columns file-instructions">
                        <div className="column">
                            <h3>File upload restrictions</h3>
                            <div>
                                <ul>
                                    <li>No folders</li>
                                    <li>Limited to 10 files</li>
                                    <li>Begin with a letter and are less than 45 characters long</li>
                                    <li>Contain only upper and lowercase alphanumeric characters, and underscores</li>
                                    <li>Have only a single period which precedes the file extension: “.pdf”</li>
                                </ul>
                            </div>
                        </div>
                        <div className="column upload-instructions">
                            <FontIcon
                                className="material-icons">cloud_upload</FontIcon>
                            <p>Click here to select files, or drag files into this area to upload</p>
                        </div>
                    </div>
                ),
                fileAccess: 'fileAccess',
                datepickerAccess: 'accessDate',
                selectField: {
                    openAccessValue: 'Open Access',
                    closedAccessValue: 'Closed Access',
                    initialValue: 'Select access conditions'
                }
            },
            list: {
                filenameLabel: 'Filename',
                fileAccessLabel: 'Access conditions',
                embargoDateLabel: 'Embargo release date'
            },
            constants: {
                openAccessId: 9,
                closedAccessId: 8,
                completed: 100
            }
        }
    }
};


