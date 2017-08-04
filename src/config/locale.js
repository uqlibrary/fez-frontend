import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import { StandardCard } from 'uqlibrary-react-toolbox';

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
                submissionInProgress: 'Submitting...',
                claimPublication: 'Claim this publication'
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
            primaryText: 'Claim possible publications'
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
    pages: {
        about: {
            title: 'About UQ eSpace',
            children: (
              <StandardCard>
                  UQ eSpace is the single authoritative source for the research outputs and research data of the
                  staff and students of the University of Queensland and is the archival home of UQ Research
                  Higher Degree digital theses. UQ eSpace raises the visibility and accessibility of UQ
                  publications to the wider world and provides data for mandatory Government reporting
                  requirements such as Excellence in Research for Australia (ERA), as well as for internal UQ
                  systems, including Academic Portal and the DataHub. It operates as an institutional repository
                  for open access publications, research datasets and other digitised materials created by staff
                  of the University such as print materials, photographs, audio materials, videos, manuscripts and
                  other original works. UQ eSpace provides metadata to UQ Researchers in order to raise the
                  publication profile of researchers at UQ.
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
              </StandardCard>
            )
        },
        browse: {
            title: 'Browse eSpace',
            text: ( <div>
                  <p>Welcome to The University of Queensland's institutional digital repository</p>
                  <p>
                      <a href="https://auth.library.uq.edu.au/login">Please, login to continue.</a>
                  </p>
              </div>
            ),
            help: {
                title: 'Browse eSpace help',
                text: (
                  <div>
                      <h3>Browse</h3>
                      <p>
                          Latest articles....
                      </p>
                      <h3>Browse collections</h3>
                      <p>
                          Latest collections....
                      </p>
                  </div>
                ),
                buttonLabel: 'no worries!'
            }
        },
        addRecord: {
            title: 'Add a missing record to eSpace',
            stepper: [
                {label: 'Search for your publication'},
                {label: 'Search results'},
                {label: 'Add your publication'}
            ],
            step1: {
                title: 'Search for your publication',
                text: 'Enter either the publication DOI (e.g. 10.1163/9789004326828), Pubmed Id (e.g. 28131963) or the title of the publication. This will allow us to check whether the record is already in eSpace or is available from another source.',
                help: {
                    title: 'Search for your publication',
                    text: 'Help about search....',
                    buttonLabel: 'Ok'
                },
                fieldLabels: {
                    search: 'Enter DOI, Pubmed Id or Title'
                },
                submit: 'Search'
            },
            step2: {
                noResultsFound: {
                    title: 'No matching publications found',
                    text: 'We were unable to match any results to your search criteria. Please, search again or create a new eSpace record.',
                    help: {
                        title: 'No matching records found',
                        text: 'Why search didn\'t return any items....',
                        buttonLabel: 'Ok'
                    }
                },
                searchResults: {
                    title: 'Possible matches found',
                    text: 'Top [noOfResults] potential match(es) displayed - claim a matching publication below, refine your search or create a new eSpace record.',
                    help: {
                        title: 'Possible matches found',
                        text: 'Why search displays these items....',
                        buttonLabel: 'Ok'
                    },
                },
                loadingMessage: 'Searching for publications...',
                cancel: 'Abandon and search again',
                submit: 'Create a new eSpace record',
                claim: 'Claim this publication'
            },
            step3: {
                // all text values come from components.publicationForm
            },
            confirmationDialog: {
                confirmationTitle: 'Your record has been submitted',
                confirmationMessage: 'Your item will be referred to a UQ eSpace Staging staff member for editing, prior to being moved into a publicly viewable collection. Please note that our current processing priority is for publications between 2008 and 2014 to meet the requirements of ERA 2015, HERDC 2015 and Q-index.',
                cancelButtonLabel: 'Add another missing record',
                confirmButtonLabel: 'OK'
            }
        },
        claimPublications: {
            title: 'Claim possible publications',
            loadingMessage: 'Searching for your publications...',
            noResultsFound: {
                title: 'No matching publications found',
                text: 'No publications were automatically matched for you to claim.',
                help: {
                    title: 'No matching records found',
                    text: 'Why search didn\'t return any items....',
                    buttonLabel: 'Ok'
                }
            },
            searchResults: {
                title: 'Possibly your publications',
                text: '[resultsCount] out of [totalCount] potential match(es) displayed. Select any item to claim it as your work.',
                help: {
                    title: 'Possibly your publications',
                    text: 'Help about ....',
                    buttonLabel: 'Ok'
                },
                hide: 'Not mine',
                claim: 'Claim this publication',
                hideAll: 'None of these publications are mine'
            },
            hidePublicationConfirmation: {
                confirmationTitle: 'Hide publication',
                confirmationMessage: 'Are you sure you want to hide selected possibly your publication from this view?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            },
            hideAllPublicationsConfirmation: {
                confirmationTitle: 'Hide publications',
                confirmationMessage: 'Are you sure you want to hide all possibly your publications from this view?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            }
        }
    },
    components: {
        publicationForm: {
            cancel: 'Abandon and search again',
            submit: 'Submit for approval',
            publicationType: {
                title: 'Publication type',
                inputLabelText: 'Select publication type',
                help: {
                    title: 'Publication type',
                    text: 'Help about publication types, eg journal article, book, conference paper etc',
                    buttonLabel: 'OK'
                }
            },
            journalArticle: {
                information: {
                    title: 'Journal article information',
                    help: {
                        title: 'Journal article information',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    fieldLabels: {
                        articleTitle: 'Title',
                        journalTitle: 'Journal name',
                        date: {
                            day: 'Day',
                            month: 'Month',
                            year: 'Year'
                        },
                        subtype: 'Publication subtype'
                    }
                },
                authors: {
                    title: 'Authors',
                    help: {
                        title: 'Authors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    suffix: ' listed author'
                },
                optional: {
                    title: 'Optional publication details',
                    help: {
                        title: 'Optional publication details',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    fieldLabels: {
                        volume: 'Volume',
                        issue: 'Issue',
                        startPage: 'Start page',
                        endPage: 'End page',
                        articleNumber: 'Article number',
                        notes: 'Notes (not publicly viewable)',
                        url: 'Link (URL)'
                    }
                }
            },
            book: {
                information: {
                    title: 'Book information',
                    help: {
                        title: 'Book information',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    fieldLabels: {
                        bookTitle: 'Book title'
                    }
                },
                authors: {
                    title: 'Authors',
                    help: {
                        title: 'Authors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    suffix: ' listed author'
                },
                editors: {
                    title: 'Editors',
                    help: {
                        title: 'Editors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    suffix: ' listed editor'
                }
            },
            fileUpload: {
                title: 'Files',
                help: {
                    title: 'Files',
                    text: '...',
                    buttonLabel: 'OK'
                }
            },
            dialog: {
                success: {
                    title: 'Your record has been submitted',
                    content: 'Your item will be referred to a UQ eSpace Staging staff member for editing, prior to being moved into a publicly viewable collection. Please note that our current processing priority is for publications between 2008 and 2014 to meet the requirements of ERA 2015, HERDC 2015 and Q-index.',
                    primaryButtonLabel: 'Ok',
                    primaryLink: '/dashboard',
                    secondaryButtonLabel: 'Add another missing record'
                },
                cancel: {
                    title: 'Cancel adding a missing record',
                    content: 'Are you sure you want to cancel adding this record?',
                    primaryButtonLabel: 'Yes',
                    primaryLink: '/dashboard',
                    secondaryButtonLabel: 'No'
                }
            },
            cancelWorkflowConfirmation: {
                confirmationTitle: 'Abandon workflow',
                confirmationMessage: 'Are you sure you want to abandon workflow?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            }
        },
        claimPublicationForm: {
            title: 'Claim a publication',
            cancel: 'Cancel this claim',
            submit: 'Claim this publication',
            claimingInformation: {
                title: 'You are claiming to be an author for the following item:',
                help: {
                    title: 'Claiming a publication',
                    text: '...',
                    buttonLabel: 'OK'
                }
            },
            authorLinking: {
                title: 'Author linking',
                text: 'We were unable to automatically detect who you are from the list of authors on this publication. Please, select your name from the list below: ',
                help: {
                    title: 'Author linking',
                    text: '...',
                    buttonLabel: 'OK'
                }
            },
            comments: {
                title: 'If necessary, please suggest changes or upload additional files below',
                help: {
                    title: 'Additional information',
                    text: '...',
                    buttonLabel: 'OK'
                },
                fieldLabels: {
                    comments: 'Type edits/changes/comments here',
                    url: 'Link (URL)'
                }
            },
            fileUpload: {
                title: 'Upload additional files',
                help: {
                    title: 'Files',
                    text: '...',
                    buttonLabel: 'OK'
                }
            },
            cancelWorkflowConfirmation: {
                confirmationTitle: 'Cancel claiming a publication',
                confirmationMessage: 'Are you sure you want to cancel claiming this publication?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            },
            successWorkflowConfirmation: {
                confirmationTitle: 'Claim has been submitted',
                confirmationMessage: 'Your item will be referred to a UQ eSpace Staging staff member for editing, prior to being moved into a publicly viewable collection.',
                cancelButtonLabel: 'Claim more publications',
                confirmButtonLabel: 'OK'
            },
        },
        publicationClaimFrom: {
            title: 'Claim a publication',
            authorLinking: {
                title: 'Author linking',
                subTitle: 'We were unable to automatically detect who you are from the list of authors on this publication. Please select your name from the list below:',
                confirmation: 'I confirm and understand that I am claiming this publication under the above name, and confirm this is me',
                formSectionPrefix: 'authorLinking',
                instructions: 'Please select an author to proceed',
                noAuthorSelectedMessage: 'Please select an author before submitting the form'
            },
            publicationDetails: {
                title: 'You are claiming to be an author for the following item:',
                help: {
                    title: 'Claim a publication',
                    text: (
                      <div>
                          <p>
                              Mauris pharetra vel arcu in hendrerit. Ut iaculis, quam id cursus fringilla, velit enim
                              sodales dui, sed commodo massa justo quis dui. Nulla ornare massa nibh, quis laoreet eros
                              ultrices nec. Curabitur efficitur ipsum ut metus dignissim ornare. Vestibulum fringilla
                              viverra tortor ac hendrerit.
                          </p>
                      </div>
                    ),
                    button: 'OK'
                },
            },
            comments: {
                title: 'If necessary, please suggest changes or upload additional files below',
                fields: {
                    descriptionLabel: 'Type edits/changes/comments here'
                }
            },
            files: {
                title: 'Upload new files',
                fields: {
                    filenameLabel: 'Filename selected',
                    filenameRestrictions: (
                      <div className="fileInstructions">
                          <h3>File name restrictions</h3>
                          <div style={{width: '100%'}}>
                              <ul>
                                  <li>Only upper or lowercase alphanumeric characters or underscores (a0z, A-Z, _ and
                                      0-9 only)
                                  </li>
                                  <li>Only numbers and lowercase characters in the file extension</li>
                                  <li>Under 45 characters</li>
                                  <li>Only one file extension (on period (.) character) and</li>
                                  <li>Starting with a letter. Eg "s12345678_phd_thesis.pdf"</li>
                              </ul>
                          </div>
                      </div>
                    ),
                    accessConditionsLabel: 'Access conditions',
                    embargoDateLabel: 'Embargo date',
                    descriptionLabel: 'Description'
                },
                buttons: {
                    browseLabel: 'Browse files'
                }
            },
            dialog: {
                success: {
                    title: 'Claim publication',
                    content: 'The publication has been successfully claimed.',
                    primaryButtonLabel: 'Ok',
                    primaryLink: '/claim-publications'
                },
                cancel: {
                    title: 'Cancel claiming publication',
                    content: 'Are you sure you want to cancel claiming this publication?',
                    primaryButtonLabel: 'Yes',
                    primaryLink: '/claim-publications',
                    secondaryButtonLabel: 'No'
                }
            }
        },
        searchDashboard: {
            title: 'Repository search',
            repositories: [
                {
                    id: 'wos',
                    title: 'World of science',
                    icon: '../../../images/wos_icon.svg'
                },
                {
                    id: 'scopus',
                    title: 'Scopus',
                    icon: '../../../images/scopus_icon.svg'
                },
                {
                    id: 'pubmed',
                    title: 'PubMed',
                    icon: '../../../images/pubmed_icon.svg'
                },
                {
                    id: 'crossref',
                    title: 'Crossref',
                    icon: '../../../images/crossref_icon.svg'
                },
            ],
            pubtitle: ' records',
            noOfRepos: 4
        },
        dashboardArticleCount: {
            yearSeparator: ' to ',
            countTitle: 'eSpace articles from'
        },
        dashboardAuthorAvatar: {
            ariaPrefix: 'Photograph of '
        },
        dashboardResearcherIds: {
            ariaTxt1: 'Your',
            ariaTxt2: 'Id is',
            ariaTxt3: 'Id is not linked'
        }
    },
    sharedComponents: {
        authors: {
            title: 'Authors',
            help: {
                title: 'Authors',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
            },
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
            subTitle: 'You may add up to 10 files (max 5Gb each)',
            help: {
                title: 'Files',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
            },
            limit: 10,
            filenameLimit: 45,
            formSectionPrefix: 'fileUploader',
            messages: {
                deleteAllFilesDialogContent: 'Are you sure you want to remove all these files from the upload queue?',
                deleteFileDialogContent: 'Are you sure you want to remove this file from the upload queue?',
                deleteAllFilesToolTip: 'Remove all files from the upload queue',
                deleteFileToolTip: 'Remove this file from the upload queue',
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
                openAccessConfirmation: 'I understand that the Open Access file(s) above will be publicly available on the embargo release date. Closed Access file(s) will not be publicly available.'
            },
            fields: {
                filenameRestrictions: (
                  <div className="columns file-instructions">
                      <div className="column">
                          <h3>File upload restrictions</h3>
                          <div>
                              Please ensure your files:
                              <ul>
                                  <li>begin with a letter and are less than 45 characters long</li>
                                  <li>contain only upper and lowercase alphanumeric characters, and underscores</li>
                                  <li>have only a single period which precedes the file extension: “.pdf”</li>
                                  <li>are uploaded individually and not inside a folder</li>
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
    },
    validationErrors: {
        publicationSearch: 'Please, enter a valid publication DOI (e.g. 10.1163/9789004326828), Pubmed ID (e.g. 28131963) or the title (min 10 characters) of the publication'
    }
};


