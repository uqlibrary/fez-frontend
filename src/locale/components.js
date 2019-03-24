import React from 'react';

export default {
    components: {
        facetsFilter: {
            title: 'Refine results',
            resetButtonText: 'Reset',
            yearPublishedCategory: 'Year published',
            yearPublishedFacet: {
                displayTitle: 'Published year range',
                fromFieldLabel: 'From',
                toFieldLabel: 'To',
                rangeSubmitButtonLabel: 'Go'
            },
            openAccessFilter: {
                displayTitle: 'Open access status',
                activeFilter: 'Show only open access records'
            },
            excludeFacetsList: ['Scopus document type', 'Genre', 'Year published'],
            renameFacetsList: {'Display type': 'Work type', 'Subtype': 'Work subtype'},
            lookupFacetsList: {
                'Author': 'Author (lookup)',
                'Collection': 'Collection (lookup)',
                'Subject': 'Subject (lookup)'
            },
            // help: {
            //     title: 'Refining your results',
            //     text: 'Help about ....',
            //     buttonLabel: 'CLOSE'
            // },
        },
        publicationStats: {
            publicationStatsTitle1: 'eSpace works',
            publicationStatsTitle2: 'Web of science',
            publicationStatsTitle2mobile: 'WOS',
            publicationStatsTitle3: 'Scopus',
            publicationStatsRowTitle1: 'h-index',
            publicationStatsRowTitle2: 'Average citation count per work',
            publicationStatsRowTitle3: 'Total citations',
            publicationStatsRowTitle4: 'Total works',
            publicationStatsRowTitle5: 'Works year range',
            publicationStatsNA: 'N/A'
        },
        publicationCitation: {
            publicationSourcesLabel: 'Found in: ',
            citationCounts: {
                wosCountLabel: 'Web of Science citation count is [count]',
                scopusCountLabel: 'Scopus citation count is [count]',
                googleCountLabel: 'Citation counts in Google Scholar',
                altmetricCountLabel: 'Altmetric score is [count]',
                openAccessLabel: 'Open Access - [oa_status] - Free to read (embargo date might apply)',
                openAccessLockedLabel: 'Open Access - [oa_status] - Embargoed until [embargo_date]',
                statsLabel: 'View full statistics',
                altmetric: {
                    externalUrl: 'http://www.altmetric.com/details.php?citation_id=[id]',
                    title: 'Altmetric',
                },
                google: {
                    externalUrl: 'https://scholar.google.com/scholar?q=intitle:[id]',
                    title: 'Google scholar',
                }
            },
            linkWillOpenInNewWindow: 'Full citation in [destination] will open in a new window',
            citationAuthors: {
                showMoreLabel: 'Show [numberOfAuthors] more...',
                showMoreTitle: 'Click to show [numberOfAuthors] more authors',
                showLessLabel: 'Show less',
                showLessTitle: 'Show less authors'
            },
            defaultActions: [
                {key: 'fixRecord', label: 'Request Correction', primary: false},
                // {key: 'shareRecord', primaryText: 'Share'} // TODO: implement shareRecord
            ],
            myTrendingPublications: {
                trendDifferenceShares: {
                    scopus: 'Difference in citations',
                    thomson: 'Difference in citations',
                    altmetric: 'Difference in social media activities'
                },
                sourceTitles: {
                    scopus: 'Scopus',
                    thomson: 'Web of science',
                    altmetric: 'Altmetric'
                },
                recordsPerSource: 5
            }
        },
        myTrendingPublications: {
            loading: 'Loading your trending publications',
            metrics: {
                altmetric: {
                    title: 'Altmetric score',
                    subtitle: 'The +plus score indicates recent increase in social media activity',
                    order: 2
                },
                thomson: {
                    title: 'Web of Science citation count',
                    subtitle: 'The + (plus) value indicates how much the citation count has increased in the last three months.',
                    order: 1
                },
                scopus: {
                    title: 'Scopus citation count',
                    subtitle: 'The + (plus) value indicates how much the citation count has increased in the last three months.',
                    order: 0
                }
            }
        },
        trendingPublicationHelp: {
            title: 'About these metrics',
            text: (
                <React.Fragment>
                    <h3>WOS and Scopus</h3>
                    <p>
                        The + (plus) value indicates how much the citation count has increased in the last three months.
                    </p>
                    <h3>Altmetric score (social media activity)</h3>
                    <p>
                        The Altmetric score measures social media activity. The + (plus) value shows the increase in social media activity over time.
                    </p>
                    <p>
                        You can click on the number as a link to see who is citing each publication, or in the
                        case of Altmetric who is referencing the publication in social media and news outlets.
                    </p>
                    For more information visit :<br/>
                    <a href="https://www.altmetric.com/about-altmetrics/what-are-altmetrics/" target="_blank" rel="noopener noreferrer">
                        https://www.altmetric.com/about-altmetrics/what-are-altmetrics/
                    </a>
                </React.Fragment>),
            buttonLabel: 'CLOSE'
        },
        myLatestPublications: {
            loading: 'Loading your latest publications',
            viewAllButtonLabel: 'View all'
        },
        topCitedPublications: {
            loading: 'Loading trending publications',
            notAvailableAlert: {
                type: 'error',
                title: 'There has been an error',
                message: 'Trending publications are temporarily unavailable'
            },
            altmetric: {
                title: (<span>Trending on Altmetric</span>),
                mobileTitle: 'Trending',
                heading: 'Altmetric score',
                subHeading: 'The +plus score indicates recent increase in social media activity',
                order: 0
            },
            scopus: {
                title: (<span>Trending on Scopus</span>),
                mobileTitle: 'Scopus',
                heading: 'Scopus citation count',
                subHeading: 'The + (plus) value indicates how much the citation count has increased in the last three months.',
                order: 1
            },
            thomson: {
                title: (<span>Trending on Web of science</span>),
                mobileTitle: 'WOS',
                heading: 'Web of Science citation count',
                subHeading: 'The + (plus) value indicates how much the citation count has increased in the last three months.',
                order: 2
            },
            recordsPerSource: 20
        },
        keywordsForm: {
            field: {
                form: {
                    locale: {
                        inputFieldLabel: 'Keywords',
                        inputFieldHint: 'Type keywords',
                        addButtonLabel: 'Add',
                        id: 'keywords-input'
                    }
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
                            confirmButtonLabel: 'Yes'
                        }
                    }
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
                            confirmButtonLabel: 'Yes'
                        }
                    }
                }
            }
        },
        fundingBodyForm: {
            field: {
                form: {
                    locale: {
                        inputFieldLabel: 'Funding body',
                        inputFieldHint: 'Type the name of the funding body(s) associated with your research e.g. ARC, NHMRC',
                        addButtonLabel: 'Add',
                        id: 'funding-body-input'
                    }
                },
                header: {
                    locale: {
                        nameColumn: 'Funding body',
                        reorderColumn: 'Reorder funding bodies',
                        deleteAll: 'Remove all funding bodies',
                        deleteAllConfirmation: {
                            confirmationTitle: 'Delete all',
                            confirmationMessage: 'Are you sure you want to delete all funding bodies?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                },
                row: {
                    locale: {
                        moveUpHint: 'Move funding body up the order',
                        moveDownHint: 'Move funding body down the order',
                        deleteHint: 'Remove this funding body',
                        deleteRecordConfirmation: {
                            confirmationTitle: 'Delete funding body',
                            confirmationMessage: 'Are you sure you want to delete this funding body?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                }
            }
        },
        grantIdForm: {
            field: {
                form: {
                    locale: {
                        inputFieldLabel: 'Grant IDs',
                        inputFieldHint: 'Type grantID',
                        addButtonLabel: 'Add',
                        id: 'grant-id-input'
                    }
                },
                header: {
                    locale: {
                        nameColumn: 'Grant ID',
                        reorderColumn: 'Reorder grant IDs',
                        deleteAll: 'Remove all grant IDs',
                        deleteAllConfirmation: {
                            confirmationTitle: 'Delete all',
                            confirmationMessage: 'Are you sure you want to delete all grant IDs?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                },
                row: {
                    locale: {
                        moveUpHint: 'Move grant ID up the order',
                        moveDownHint: 'Move grant ID down the order',
                        deleteHint: 'Remove this grant ID',
                        deleteRecordConfirmation: {
                            confirmationTitle: 'Delete grant ID',
                            confirmationMessage: 'Are you sure you want to delete this grant ID?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                }
            }
        },
        thirdPartyLookupTools: {
            display: {
                title: 'Lookup Tools - view raw output from APIs',
                loadingMessage: 'Loading',
                tooltip: {
                    show: 'Show form for',
                    hide: 'Hide form for'
                },
                resultsLabel: 'Results',
                noResultsFound: {
                    text: 'No results found'
                },
                clearButtonLabel: 'New Search'
            },
            forms: [
                {
                    apiType: 'incites', // this value should match the 'type' in the path used in api
                    lookupLabel: 'Incites',
                    primaryField: {
                        heading: 'UTs',
                        fromAria: '',
                        tip: '',
                        inputPlaceholder: 'Enter one or more UTs separated by a comma e.g. 000455548800001',
                    },
                    secondaryField: {
                        heading: 'API Key',
                        fromAria: '',
                        tip: 'Optional, a default key is provided. Limit: 1,000 queries per day',
                        inputPlaceholder: 'Enter API key',
                        reportInOutput: false, // determines if secondaryField will apear in the results page
                    },
                    bottomTip: '',
                    submitButtonLabel: 'Submit to Incites',
                    isMinimised: false // set this to true when we have more than one form
                }
            ],
        },
        typeOfDataForm: {
            field: {
                form: {
                    locale: {
                        inputFieldLabel: 'Type of data',
                        inputFieldHint: 'Type type of data',
                        addButtonLabel: 'Add',
                        id: 'type-of-data-input'
                    }
                },
                header: {
                    locale: {
                        nameColumn: 'Type of data',
                        reorderColumn: 'Reorder type of data',
                        deleteAll: 'Remove all type of data',
                        deleteAllConfirmation: {
                            confirmationTitle: 'Delete all',
                            confirmationMessage: 'Are you sure you want to delete all type of data?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                },
                row: {
                    locale: {
                        moveUpHint: 'Move type of data up the order',
                        moveDownHint: 'Move type of data down the order',
                        deleteHint: 'Remove this type of data',
                        deleteRecordConfirmation: {
                            confirmationTitle: 'Delete type of data',
                            confirmationMessage: 'Are you sure you want to delete this type of data?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                }
            }
        },
        softwareRequiredForm: {
            field: {
                form: {
                    locale: {
                        inputFieldLabel: 'Software required',
                        inputFieldHint: 'Type software required',
                        addButtonLabel: 'Add',
                        id: 'software-required-input'
                    }
                },
                header: {
                    locale: {
                        nameColumn: 'Software required',
                        reorderColumn: 'Reorder software required',
                        deleteAll: 'Remove all software required',
                        deleteAllConfirmation: {
                            confirmationTitle: 'Delete all',
                            confirmationMessage: 'Are you sure you want to delete all software required?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                },
                row: {
                    locale: {
                        moveUpHint: 'Move software required up the order',
                        moveDownHint: 'Move software required down the order',
                        deleteHint: 'Remove this software required',
                        deleteRecordConfirmation: {
                            confirmationTitle: 'Delete software required',
                            confirmationMessage: 'Are you sure you want to delete this software required?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                }
            }
        },
        isbnForm: {
            title: 'ISBN',
            text: 'You can add up to five ISBN values',
            // help: {
            //     title: 'ISBN value',
            //     text: 'Acceptable ISBN formats are....',
            //     buttonLabel: 'CLOSE'
            // },
            field: {
                form: {
                    locale: {
                        inputFieldLabel: 'ISBN value',
                        inputFieldHint: 'Enter ISBN, e.g. 13 digit: 9780815375296 or 10 digit: 1861972717',
                        addButtonLabel: 'Add ISBN',
                        remindToAdd: (<span>Pleasepress <b>ENTER</b> or click <b>ADD</b> button to add this value to the list</span>)
                    }
                },
                header: {
                    locale: {
                        nameColumn: 'ISBN',
                        reorderColumn: 'Reorder items',
                        deleteAll: 'Remove all items',
                        deleteAllConfirmation: {
                            confirmationTitle: 'Delete all',
                            confirmationMessage: 'Are you sure you want to delete all items?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                },
                row: {
                    locale: {
                        moveUpHint: 'Move item up the order',
                        moveDownHint: 'Move item down the order',
                        deleteHint: 'Remove this item',
                        deleteRecordConfirmation: {
                            confirmationTitle: 'Delete item',
                            confirmationMessage: 'Are you sure you want to delete this item?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                }
            }
        },
        issnForm: {
            title: 'ISSN',
            text: 'You can add up to five ISSN values',
            // help: {
            //     title: 'ISSN value',
            //     text: 'Acceptable ISSN formats are....',
            //     buttonLabel: 'CLOSE'
            // },
            field: {
                form: {
                    locale: {
                        inputFieldLabel: 'ISSN value',
                        inputFieldHint: 'Enter ISSN, e.g. 1838-9414',
                        addButtonLabel: 'Add ISSN',
                        remindToAdd: (<span>Pleasepress <b>ENTER</b> or click <b>ADD</b> button to add this value to the list</span>)
                    }
                },
                header: {
                    locale: {
                        nameColumn: 'ISSN',
                        reorderColumn: 'Reorder items',
                        deleteAll: 'Remove all items',
                        deleteAllConfirmation: {
                            confirmationTitle: 'Delete all',
                            confirmationMessage: 'Are you sure you want to delete all items?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                },
                row: {
                    locale: {
                        moveUpHint: 'Move item up the order',
                        moveDownHint: 'Move item down the order',
                        deleteHint: 'Remove this item',
                        deleteRecordConfirmation: {
                            confirmationTitle: 'Delete item',
                            confirmationMessage: 'Are you sure you want to delete this item?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                }
            }
        },
        ismnForm: {
            title: 'ISMN',
            text: 'You can add up to five ISMN values',
            // help: {
            //     title: 'ISMN value',
            //     text: 'Acceptable ISMN formats are....',
            //     buttonLabel: 'CLOSE'
            // },
            field: {
                form: {
                    locale: {
                        inputFieldLabel: 'ISMN value',
                        inputFieldHint: 'Enter ISMN, e.g. 9790720208015',
                        addButtonLabel: <span>Add&nbsp;ISMN</span>,
                        remindToAdd: (<span>Pleasepress <b>ENTER</b> or click <b>ADD</b> button to add this value to the list</span>)
                    }
                },
                header: {
                    locale: {
                        nameColumn: 'ISMN',
                        reorderColumn: 'Reorder items',
                        deleteAll: 'Remove all items',
                        deleteAllConfirmation: {
                            confirmationTitle: 'Delete all',
                            confirmationMessage: 'Are you sure you want to delete all items?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                },
                row: {
                    locale: {
                        moveUpHint: 'Move item up the order',
                        moveDownHint: 'Move item down the order',
                        deleteHint: 'Remove this item',
                        deleteRecordConfirmation: {
                            confirmationTitle: 'Delete item',
                            confirmationMessage: 'Are you sure you want to delete this item?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                }
            }
        },
        isrcForm: {
            title: 'ISRC',
            text: 'You can add up to five ISRC values',
            // help: {
            //     title: 'ISRC value',
            //     text: 'Acceptable ISRC formats are....',
            //     buttonLabel: 'CLOSE'
            // },
            field: {
                form: {
                    locale: {
                        inputFieldLabel: 'ISRC value',
                        inputFieldHint: 'Enter ISRC, e.g. US6R21320619',
                        addButtonLabel: <span>Add&nbsp;ISRC</span>,
                        remindToAdd: (<span>Pleasepress <b>ENTER</b> or click <b>ADD</b> button to add this value to the list</span>)
                    }
                },
                header: {
                    locale: {
                        nameColumn: 'ISRC',
                        reorderColumn: 'Reorder items',
                        deleteAll: 'Remove all items',
                        deleteAllConfirmation: {
                            confirmationTitle: 'Delete all',
                            confirmationMessage: 'Are you sure you want to delete all items?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                },
                row: {
                    locale: {
                        moveUpHint: 'Move item up the order',
                        moveDownHint: 'Move item down the order',
                        deleteHint: 'Remove this item',
                        deleteRecordConfirmation: {
                            confirmationTitle: 'Delete item',
                            confirmationMessage: 'Are you sure you want to delete this item?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                }
            }
        },
        authors: {
            title: 'Authors',
            description: 'Please provide a list of authors and then select your name from the list.',
            descriptionAuthorOrEditor: 'Please provide a list of authors and then select your name once from the list of authors or editors.',
            help: {
                title: 'Authors/Designers name',
                text: (
                    <p>For more information about identification of author/creator/designer, click <a target="_blank" href="https://guides.library.uq.edu.au/for-researchers/uqespace-publications-datasets/ntro-submission-requirements#s-lg-box-20836546">here</a></p>
                ),
                buttonLabel: 'CLOSE'
            },
            field: {
                form: {
                    locale: {
                        descriptionStep1: (
                            <div><span className="authorSteps" key="step-1">Step 1 of 2</span> - Please <b>add to a list of authors below</b>, in the format and order that they are published.</div>
                        ),
                        descriptionStep1NoStep2: (
                            <div>Please <b>add to a list of authors below</b>, in the format and order that they are published.</div>
                        ),
                        nameAsPublishedLabel: 'Enter each author\'s name as published (eg. Smith, John)',
                        nameAsPublishedHint: 'Type the name exactly as published',
                        identifierLabel: 'UQ identifier (if available)',
                        addButton: 'Add author'
                    }
                },
                header: {
                    locale: {
                        descriptionStep2: (
                            <div><span className="authorSteps" key="step-2">Step 2 of 2</span> - Please <b>select your name</b> from the list below (if applicable).</div>
                        ),
                        contributorAssignmentColumn: 'Select your name',
                        nameColumn: 'Author\'s name as published',
                        identifierColumn: 'UQ identifier',
                        reorderColumn: 'Reorder items',
                        deleteAll: 'Remove all items',
                        deleteAllConfirmation: {
                            confirmationTitle: 'Delete all',
                            confirmationMessage: 'Are you sure you want to delete all items?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                },
                row: {
                    locale: {
                        suffix: ' listed author',
                        unselectedHint: 'Select this to confirm [identifier] is you',
                        selectedHint: 'This is you',
                        moveUpHint: 'Move item up the order',
                        moveDownHint: 'Move item down the order',
                        deleteHint: 'Remove this item',
                        selectHint: 'Select this author ([name]) to assign it as you',
                        deleteRecordConfirmation: {
                            confirmationTitle: 'Delete item',
                            confirmationMessage: 'Are you sure you want to delete this item?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                }
            }

        },
        editors: {
            title: 'Editors',
            description: 'Please provide a list of editors and then select your name from the list.',
            descriptionAuthorOrEditor: 'Please provide a list of editors and then select your name once from the list of authors or editors.',
            // help: {
            //     title: 'Editors',
            //     text: 'some help',
            //     buttonLabel: 'CLOSE'
            // },
            field: {
                form: {
                    locale: {
                        descriptionStep1: (
                            <div><span className="authorSteps" key="step-1">Step 1 of 2</span> - Please <b>add to a list of editors below</b>, in the format "John Smith".</div>
                        ),
                        descriptionStep1NoStep2: (
                            <div>Please <b>add to a list of editors below</b>, in the format and order that they are published.</div>
                        ),
                        nameAsPublishedLabel: 'Enter each editor\'s name as published (eg. John Smith)',
                        nameAsPublishedHint: 'Type the name in the format eg. "John Smith"',
                        identifierLabel: 'UQ identifier (if available)',
                        addButton: 'Add editor'
                    }
                },
                header: {
                    locale: {
                        descriptionStep2: (
                            <div><span className="authorSteps" key="step-2">Step 2 of 2</span> - Please <b>select your name</b> from the list below (if applicable).</div>
                        ),
                        contributorAssignmentColumn: 'Select your name (if applicable)',
                        nameColumn: 'Editor\'s name in the format eg. "John Smith"',
                        identifierColumn: 'UQ identifier',
                        reorderColumn: 'Reorder items',
                        deleteAll: 'Remove all items',
                        deleteAllConfirmation: {
                            confirmationTitle: 'Delete all',
                            confirmationMessage: 'Are you sure you want to delete all items?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                },
                row: {
                    locale: {
                        suffix: ' listed editor',
                        unselectedHint: 'Select this to confirm this editor is you',
                        selectedHint: 'This is you',
                        moveUpHint: 'Move item up the order',
                        moveDownHint: 'Move item down the order',
                        deleteHint: 'Remove this item',
                        selectHint: 'Select this editor ([name]) to assign it as you',
                        deleteRecordConfirmation: {
                            confirmationTitle: 'Delete item',
                            confirmationMessage: 'Are you sure you want to delete this item?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                }
            }
        },
        creators: {
            title: 'Creators',
            // help: {
            //     title: 'Creators',
            //     text: 'some help',
            //     buttonLabel: 'CLOSE'
            // },
            description: 'Please provide a list of creators (e.g. producer or performer if self-produced) and then select your name from the list.',
            descriptionCreatorOrContributor: 'Please provide a list of creators (e.g. producer or performer if self-produced) and then select your name once from the list of creators or contributors.',
            field: {
                form: {
                    locale: {
                        descriptionStep1: (
                            <div><span className="authorSteps" key="step-1">Step 1 of 2</span> - Please <b>add to a list of creators below</b>, in the format and order that they are published.</div>
                        ),
                        descriptionStep1NoStep2: (
                            <div>Please <b>add to a list of creators below</b>, in the format and order that they are published.</div>
                        ),
                        nameAsPublishedLabel: 'Enter each creator\'s name as published (eg. Smith, John)',
                        nameAsPublishedHint: 'Type the name exactly as published',
                        creatorRoleLabel: 'Enter creator\'s role',
                        creatorRoleHint: 'Select role from list or type the role of the creator in relation to the dataset',
                        identifierLabel: 'UQ identifier (if available)',
                        addButton: 'Add creator'
                    }
                },
                header: {
                    locale: {
                        descriptionStep2: (
                            <div><span className="authorSteps" key="step-2">Step 2 of 2</span> - Please <b>select your name</b> from the list below (if applicable).</div>
                        ),
                        contributorAssignmentColumn: 'Select your name',
                        nameColumn: 'Creator\'s name as published',
                        roleColumn: 'Creator\'s role',
                        identifierColumn: 'UQ identifier',
                        reorderColumn: 'Reorder items',
                        deleteAll: 'Remove all items',
                        deleteAllConfirmation: {
                            confirmationTitle: 'Delete all',
                            confirmationMessage: 'Are you sure you want to delete all items?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                },
                row: {
                    locale: {
                        suffix: ' listed creator',
                        unselectedHint: 'Select this to confirm this creator is you',
                        selectedHint: 'This is you',
                        moveUpHint: 'Move item up the order',
                        moveDownHint: 'Move item down the order',
                        deleteHint: 'Remove this item',
                        selectHint: 'Select this creator ([name]) to assign it as you',
                        deleteRecordConfirmation: {
                            confirmationTitle: 'Delete item',
                            confirmationMessage: 'Are you sure you want to delete this item?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                }
            }
        },
        designers: {
            title: 'Designer name',
            description: 'Please provide a list of designers and then select your name from the list.',
            help: {
                title: 'Designers',
                text: (
                    <p>For more information about identification of author/creator/designer, click <a target="_blank" href="https://guides.library.uq.edu.au/for-researchers/uqespace-publications-datasets/ntro-submission-requirements#s-lg-box-20836546">here</a></p>
                ),
                buttonLabel: 'CLOSE'
            },
            field: {
                form: {
                    locale: {
                        descriptionStep1: (
                            <div><span className="authorSteps" key="step-1">Step 1 of 2</span> - Please <b>add to a list of designers below</b>, in the format and order that they are published.</div>
                        ),
                        descriptionStep1NoStep2: (
                            <div>Please <b>add to a list of designers below</b>, in the format and order that they are published.</div>
                        ),
                        nameAsPublishedLabel: 'Enter each designer\'s name as published (eg. Smith, John)',
                        nameAsPublishedHint: 'Type the name exactly as published',
                        identifierLabel: 'UQ identifier (if available)',
                        addButton: 'Add designer'
                    }
                },
                header: {
                    locale: {
                        descriptionStep2: (
                            <div><span className="authorSteps" key="step-2">Step 2 of 2</span> - Please <b>select your name</b> from the list below (if applicable).</div>
                        ),
                        contributorAssignmentColumn: 'Select your name',
                        nameColumn: 'Designers name as published',
                        identifierColumn: 'UQ identifier',
                        reorderColumn: 'Reorder items',
                        deleteAll: 'Remove all items',
                        deleteAllConfirmation: {
                            confirmationTitle: 'Delete all',
                            confirmationMessage: 'Are you sure you want to delete all items?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                },
                row: {
                    locale: {
                        suffix: ' listed designer',
                        unselectedHint: 'Select this to confirm this designer is you',
                        selectedHint: 'This is you',
                        moveUpHint: 'Move item up the order',
                        moveDownHint: 'Move item down the order',
                        deleteHint: 'Remove this item',
                        selectHint: 'Select this designer ([name]) to assign it as you',
                        deleteRecordConfirmation: {
                            confirmationTitle: 'Delete item',
                            confirmationMessage: 'Are you sure you want to delete this item?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                },
            }
        },
        supervisors: {
            title: 'Supervisors',
            // help: {
            //     title: 'Supervisors help',
            //     text: 'Enter supervisor names e.g. first name, last name. Additional boxes will appear for more supervisors.',
            //     buttonLabel: 'CLOSE'
            // },
            description: 'Please provide a list of supervisors and then select your name from the list.',
            field: {
                form: {
                    locale: {
                        descriptionStep1: (
                            <div><span className="authorSteps" key="step-1">Step 1 of 2</span> - Please <b>add to a list of supervisors below</b>, in the format and order that they are published.</div>
                        ),
                        descriptionStep1NoStep2: (
                            <div>Please <b>add to a list of supervisors below</b>, in the format and order that they are published.</div>
                        ),
                        nameAsPublishedLabel: 'Enter each supervisor\'s name as published (eg. Smith, John)',
                        nameAsPublishedHint: '',
                        identifierLabel: 'UQ identifier (if available)',
                        addButton: 'Add supervisor'
                    }
                },
                header: {
                    locale: {
                        descriptionStep2: (
                            <div><span className="authorSteps" key="step-2">Step 2 of 2</span> - Please <b>select your name</b> from the list below (if applicable).</div>
                        ),
                        contributorAssignmentColumn: 'Select your name',
                        nameColumn: 'Supervisor\'s name as published',
                        identifierColumn: 'UQ identifier',
                        reorderColumn: 'Reorder items',
                        deleteAll: 'Remove all items',
                        deleteAllConfirmation: {
                            confirmationTitle: 'Delete all',
                            confirmationMessage: 'Are you sure you want to delete all items?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                },
                row: {
                    locale: {
                        suffix: ' listed supervisor',
                        unselectedHint: 'Select this to confirm this supervisor is you',
                        selectedHint: 'This is you',
                        moveUpHint: 'Move item up the order',
                        moveDownHint: 'Move item down the order',
                        deleteHint: 'Remove this item',
                        selectHint: 'Select this supervisor ([name]) to assign it as you',
                        deleteRecordConfirmation: {
                            confirmationTitle: 'Delete item',
                            confirmationMessage: 'Are you sure you want to delete this item?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                }
            }
        },
        thesisSubmissionSupervisors: {
            title: 'Supervisors',
            // help: {
            //     title: 'Supervisors help',
            //     text: 'Enter supervisor names e.g. first name, last name. Additional boxes will appear for more supervisors.',
            //     buttonLabel: 'CLOSE'
            // },
            field: {
                form: {
                    locale: {
                        descriptionStep1: '',
                        descriptionStep1NoStep2: 'List your current supervisors',
                        nameAsPublishedLabel: 'Enter each supervisor’s name on a separate line e.g. Firstname Surname',
                        nameAsPublishedHint: '',
                        identifierLabel: 'UQ identifier (if available)',
                        addButton: 'Add supervisor'
                    }
                },
                header: {
                    locale: {
                        descriptionStep2: '',
                        contributorAssignmentColumn: 'Select your name',
                        nameColumn: 'Supervisor\'s name',
                        identifierColumn: 'UQ identifier',
                        reorderColumn: 'Reorder items',
                        deleteAll: 'Remove all items',
                        deleteAllConfirmation: {
                            confirmationTitle: 'Delete all',
                            confirmationMessage: 'Are you sure you want to delete all items?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                },
                row: {
                    locale: {
                        suffix: ' listed supervisor',
                        moveUpHint: 'Move item up the order',
                        moveDownHint: 'Move item down the order',
                        deleteHint: 'Remove this item',
                        selectHint: 'Select this supervisor ([name]) to assign it as you',
                        deleteRecordConfirmation: {
                            confirmationTitle: 'Delete item',
                            confirmationMessage: 'Are you sure you want to delete this item?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                }
            }
        },
        contributors: {
            title: 'Contributors',
            help: {
                title: 'Contributors',
                text: 'This is the contributor, and may be different to the creator, e.g. interviewee, performer (if not self-produced). Type contributors in the order and form they appear on the work or associated material. Examples of associated material are programs or promotional material. Additional boxes will appear for more contributors.',
                buttonLabel: 'CLOSE'
            },
            field: {
                form: {
                    locale: {
                        descriptionStep1: (
                            <div><span className="authorSteps" key="step-1">Step 1 of 2</span> - Please <b>add to a list of contributors below</b>, in the format and order that they are published.</div>
                        ),
                        descriptionStep1NoStep2: (
                            <div>Please <b>add to a list of contributors below</b>, in the format and order that they are published.</div>
                        ),
                        nameAsPublishedLabel: 'Enter each contributor\'s name as published (eg. Smith, John)',
                        nameAsPublishedHint: 'Type the name exactly as published',
                        identifierLabel: 'UQ identifier (if available)',
                        addButton: 'Add contributor'
                    }
                },
                header: {
                    locale: {
                        descriptionStep2: (
                            <div><span className="authorSteps" key="step-2">Step 2 of 2</span> - Please <b>select your name</b> from the list below (if applicable).</div>
                        ),
                        contributorAssignmentColumn: 'Select your name',
                        nameColumn: 'Contributor\'s name as published',
                        identifierColumn: 'UQ identifier',
                        reorderColumn: 'Reorder items',
                        deleteAll: 'Remove all items',
                        deleteAllConfirmation: {
                            confirmationTitle: 'Delete all',
                            confirmationMessage: 'Are you sure you want to delete all items?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                },
                row: {
                    locale: {
                        suffix: ' listed contributor',
                        unselectedHint: 'Select this to confirm this contributor is you',
                        selectedHint: 'This is you',
                        moveUpHint: 'Move item up the order',
                        moveDownHint: 'Move item down the order',
                        deleteHint: 'Remove this item',
                        selectHint: 'Select this contributor ([name]) to assign it as you',
                        deleteRecordConfirmation: {
                            confirmationTitle: 'Delete item',
                            confirmationMessage: 'Are you sure you want to delete this item?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                }
            }
        },
        fieldOfResearchForm: {
            title: 'Field of research',
            text: 'Select up to 3 Field of Research (FoR) codes at the 4 digit level',
            // help: {
            //     title: 'Field of research',
            //     text: 'more info',
            //     buttonLabel: 'CLOSE'
            // },
            field: {
                form: {
                    locale: {
                        inputFieldLabel: 'Field of research',
                        inputFieldHint: 'Start typing code or field name and select from list'
                    }
                },
                header: {
                    locale: {
                        nameColumn: 'Field of research',
                        deleteAll: 'Remove all items',
                        deleteAllConfirmation: {
                            confirmationTitle: 'Delete all',
                            confirmationMessage: 'Are you sure you want to delete all items?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                },
                row: {
                    locale: {
                        deleteHint: 'Remove this item',
                        deleteRecordConfirmation: {
                            confirmationTitle: 'Delete item',
                            confirmationMessage: 'Are you sure you want to delete this item?',
                            cancelButtonLabel: 'No',
                            confirmButtonLabel: 'Yes'
                        }
                    }
                }
            }
        },
        paging: {
            nextPage: 'Next',
            previousPage: 'Previous',
            maxPagesToShow: 5,
            pageSize: 'Records per page',
            pageOf: 'Page [currentPage] of [totalPages]',
            totalRecords: '([total] records)',
            pagingBracket: 3,
            pageButtonAriaLabel: 'Click to select page [pageNumber] of [totalPages] result pages',
            firstLastSeparator: '...'
        },
        sorting: {
            pageSize: 'Records per page',
            sortLabel: 'Sort results by',
            sortDirectionLabel: 'Sort order',
            sortBy: [
                {value: 'published_date', label: 'Published date'},
                {value: 'score', label: 'Search relevance'},
                {value: 'title', label: 'Title'},
                {value: 'created_date', label: 'Created date'},
                {value: 'updated_date', label: 'Updated date'},
                {value: 'altmetric_score', label: 'Altmetric score'},
                {value: 'scopus_citation_count', label: 'Scopus citation count'},
                {value: 'thomson_citation_count', label: 'Web of Science citation count'}
            ],
            sortDirection: [
                'Desc',
                'Asc'
            ],
            recordsPerPage: [20, 50, 100]
        },
        newsFeed: {
            title: 'Latest news'
        },
        ntroFields: {
            header: {
                title: 'Non-traditional research output (NTRO) requirements',
                body: (
                    <React.Fragment>
                        <p>In order to submit this NTRO work type or update an existing NTRO work, you must include:</p>
                        <ol>
                            <li>A creator research statement of up to 2000 characters (250 – 300 words) that includes the background, contribution and significance of the work. It must be substantiated by the 'Major' or ‘Minor’ Scale/Significance option that you select on the form. <b>This is not for public view.</b></li>
                            <li>An abstract/description of the work, up to 800 characters (approx. 100 words). This is for public view.</li>
                            <li>At least one evidence file, e.g. a .pdf, .mp4, .tiff or .wav copy, representation or review of the work.</li>
                        </ol>

                        <p>Note:<br/>
                            A research statement can be updated at any time via the REQUEST CORRECTION button for the work.
                        </p>
                    </React.Fragment>
                )
            },
            metadata: {
                help: {
                    title: 'NTRO data',
                    text: (
                        <React.Fragment>
                            <h3>Quality indicators</h3>
                            <p>For more information about each quality indicator option, click <b><a style={{fontWeight: 700}} target="_blank" href="https://guides.library.uq.edu.au/for-researchers/uqespace-publications-datasets/ntro-submission-requirements#s-lg-box-20836609">here</a></b></p>
                        </React.Fragment>
                    ),
                    buttonLabel: 'CLOSE'
                }
            }
        },
        export: {
            label: 'Export results',
            format: [
                {value: 'excel', label: 'Excel File'},
                {value: 'endnote', label: 'Endnote File'}
            ],
            filename: {
                prefix: 'espace_export',
                dateFormat: 'YYYYMMDDHHmmss'
            },
        },
        searchComponent: {
            searchBoxPlaceholder: 'Search eSpace',
            searchBoxHint: 'Enter your search query to search all fields in eSpace',
            ariaInputLabel: 'Enter your search query to search eSpace and then press Enter',
            searchButtonHint: 'Search eSpace',
            mobileSearchButtonAriaLabel: 'Click to search eSpace',
            advancedSearchButtonText: 'Advanced search',
            advancedSearchButtonAriaLabel: 'Click to switch to Advanced search',
            searchButtonText: 'Search',
            searchButtonAriaLabel: 'Click to search eSpace',
            simpleSearchToggle: 'Simple search',
            advancedSearch: {
                title: 'Advanced search',
                mode: 'advanced',
                tooltip: {
                    show: 'Show advanced search',
                    hide: 'Hide advanced search'
                },
                selectAria: 'Click to select a field to search from the list - [current_selection] currently selected',
                deleteAria: 'Click to delete this search row',
                fieldTypes: {
                    '0': {
                        order: 0, // order of appearance in adv search field list
                        map: '', // map refers to its real world lookup name to match Facets
                        title: 'Select a field',
                        combiner: null,
                        type: 'TextField',
                        hint: 'Select a field to search on',
                        validation: [],
                        ariaLabel: 'Select a field to search on'
                    },
                    'divider1': {
                        order: 0.5,
                        type: 'divider'
                    },
                    'all': {
                        order: 1,
                        map: '',
                        title: 'Any field',
                        combiner: 'contains',
                        type: 'TextField',
                        hint: 'Add some text to search all fields with',
                        captionValue: 'anything',
                        validation: ['maxLength500'],
                        ariaLabel: 'Type a value to search all fields for'
                    },
                    'rek_title': {
                        order: 2,
                        map: 'Title',
                        title: 'Title',
                        combiner: 'contains',
                        type: 'TextField',
                        hint: 'Add a title',
                        validation: ['required', 'maxLength255'],
                        ariaLabel: 'Type a title to search for'
                    },
                    'rek_book_title': {
                        order: 2.5,
                        map: 'Book title',
                        title: 'Book title for chapters',
                        combiner: 'contains',
                        type: 'TextField',
                        hint: 'Add a book title',
                        validation: ['required', 'maxLength255'],
                        ariaLabel: 'Type a book title to search for'
                    },
                    'rek_pid': {
                        order: 9,
                        map: 'PID',
                        title: 'PID',
                        combiner: 'is',
                        type: 'TextField',
                        hint: 'Add a PID',
                        validation: ['required'],
                        ariaLabel: 'Type a PID to search for'
                    },
                    'rek_author': {
                        order: 3,
                        map: 'Author',
                        title: 'Author Name',
                        combiner: 'contains',
                        type: 'TextField',
                        hint: 'Add an author name',
                        validation: ['required', 'maxLength255'],
                        ariaLabel: 'Type an author name to search for'
                    },
                    'rek_contributor': {
                        order: 5,
                        map: 'Contributor',
                        title: 'Editor/Contributor',
                        combiner: 'contains',
                        type: 'TextField',
                        hint: 'Add an editor/contributor name',
                        validation: ['required', 'maxLength255'],
                        ariaLabel: 'Type a contributor name to search for'
                    },
                    'rek_series': {
                        order: 10,
                        map: 'Series',
                        title: 'Series',
                        combiner: 'contains',
                        type: 'TextField',
                        hint: 'Add a series name',
                        validation: ['required', 'maxLength500'],
                        ariaLabel: 'Type a series name to search for'
                    },
                    'rek_journal_name': {
                        order: 11,
                        map: 'Journal name',
                        title: 'Journal name',
                        combiner: 'contains',
                        type: 'TextField',
                        hint: 'Add a journal name',
                        validation: ['required', 'maxLength500'],
                        ariaLabel: 'Type a journal name to search for'
                    },
                    'rek_conference_name': {
                        order: 12,
                        map: 'Conference name',
                        title: 'Conference Name',
                        combiner: 'contains',
                        type: 'TextField',
                        hint: 'Add a conference name',
                        validation: ['required', 'maxLength500'],
                        ariaLabel: 'Type a conference name to search for'
                    },
                    'rek_doi': {
                        order: 8,
                        map: '',
                        title: 'DOI',
                        combiner: 'contains',
                        type: 'TextField',
                        hint: 'Add a DOI',
                        validation: ['required', 'doi'],
                        ariaLabel: 'Type a DOI to search for'
                    },
                    'rek_publisher': {
                        order: 13,
                        map: 'Publisher',
                        title: 'Publisher',
                        combiner: 'is',
                        type: 'PublisherLookup',
                        hint: 'Add a publisher',
                        validation: ['required'],
                        ariaLabel: 'Type a publisher to search for'
                    },
                    'rek_ismemberof': {
                        order: 7,
                        map: 'Collection',
                        title: 'Collection',
                        combiner: 'is one of',
                        type: 'CollectionsLookup',
                        hint: 'Select collections',
                        loadingHint: 'Loading collections',
                        errorHint: 'There has been an error loading collections',
                        multiple: true,
                        validation: ['requiredList'],
                        ariaLabel: 'Select multiple collections to search for'
                    },
                    'rek_genre_type': {
                        order: 14,
                        map: 'Genre',
                        title: 'Thesis type',
                        combiner: 'is one of',
                        type: 'ThesisTypeLookup',
                        hint: 'Select a Thesis type',
                        multiple: true,
                        validation: ['required'],
                        ariaLabel: 'Select multiple thesis types to search for'
                    },
                    'rek_author_id': {
                        order: 4,
                        map: 'Author Id',
                        title: 'Author ID',
                        combiner: 'is',
                        type: 'AuthorIdLookup',
                        hint: 'Add an author id',
                        validation: ['required', 'maxLength9'],
                        ariaLabel: 'Begin typing an author ID to select an author from the list'
                    },
                    'rek_contributor_id': {
                        order: 6,
                        map: 'Contributor Id',
                        title: 'Contributor ID',
                        combiner: 'is',
                        type: 'ContributorIdLookup',
                        hint: 'Add a contributor id',
                        validation: ['required', 'maxLength9'],
                        ariaLabel: 'Begin typing an contributor ID to select an author from the list'
                    },
                    'rek_org_unit_name': {
                        order: 15,
                        map: '',
                        title: 'School, Centre or Institute',
                        combiner: 'is',
                        type: 'OrgUnitLookup',
                        hint: 'Add a school, centre or institute',
                        validation: ['required'],
                        ariaLabel: 'Begin typing an school, centre or institute name to select an author from the list'
                    },
                    'rek_display_type': {
                        order: 20,
                        map: 'Work type',
                        title: 'Work type',
                        combiner: 'is one of',
                        type: null,
                        hint: 'Select document types',
                        validation: [],
                        ariaLabel: 'Select multiple publications types to search on'
                    },
                    'facet_year_range': {
                        order: 21,
                        map: '',
                        title: 'Published year range',
                        captionTitle: 'Published',
                        type: null,
                        combiner: 'between',
                        fromHint: 'Year from',
                        fromAria: 'Enter a year to search from',
                        toAria: 'Enter a year to search to',
                        toHint: 'Year to',
                        invalidText: 'Invalid year range',
                        ariaLabel: 'Add valid year ranges to search between'
                    },
                    'rek_status': {
                        order: 16,
                        map: 'Status',
                        title: 'Status',
                        combiner: 'is',
                        type: 'StatusLookup',
                        hint: 'Select status',
                        validation: [],
                        ariaLabel: 'Select a status to search on',
                        isUnpublishedField: true
                    },
                    'rek_created_date': {
                        order: 22,
                        title: 'Created date range',
                        captionTitle: 'Created',
                        type: null,
                        combiner: 'between',
                        ariaLabel: 'Add valid date ranges to search between',
                        isUnpublishedField: true,
                        validation: [],
                        captionFn: (value) => (value.from && value.to && value.from.isBefore(value.to) && {title: 'Created', combiner: 'between', value: `${value.from.format('Do MMMM, YYYY')} and ${value.to.format('Do MMMM, YYYY')}`} || null)
                    },
                    'rek_updated_date': {
                        order: 23,
                        title: 'Updated date range',
                        captionTitle: 'Updated',
                        type: null,
                        combiner: 'between',
                        ariaLabel: 'Add valid date ranges to search between',
                        isUnpublishedField: true,
                        validation: [],
                        captionFn: (value) => (value.from && value.to && value.from.isBefore(value.to) && {title: 'Updated', combiner: 'between', value: `${value.from.format('Do MMMM, YYYY')} and ${value.to.format('Do MMMM, YYYY')}`} || null)
                    }
                },
                openAccess: {
                    title: 'Open access',
                    combiner: 'is',
                    captionText: (
                        <span className="value">open access/full text</span>
                    ),
                    ariaLabel: 'Check to search for publications with are only open access / full text'
                },
                addField: {
                    title: 'Add another field',
                    aria: 'Click to add another advanced search field'
                },
                reset: {
                    title: 'Reset',
                    aria: 'Click to reset the advanced search'
                },
                simpleSearch: {
                    title: 'Simple search',
                    aria: 'Click to return to the simple search'
                }
            }
        },
        whatIsEspace: {
            title: 'What is eSpace?',
            text: (<span>
                The University of Queensland's institutional repository, UQ eSpace, aims to create global visibility and accessibility of UQ’s scholarly research by enhancing discovery of UQ research via search engines such as Google and Trove...
            </span>),
            readMoreLabel: ' read more',
            readMoreTitle: 'Click to read more about UQ eSpace',
            readMoreLink: '/contact'
        },
        fileUploader: {
            label: 'Click here to select files, or drag files into this area to upload'
        },
        securitySection: {
            admin: {
                field: {
                    label: 'Use this interface as a...',
                    menuItemText: {
                        superAdmin: 'Super admin',
                        admin: 'Admin'
                    },
                },
                warning: {
                    message: 'This section is to be handled by admins only - changes made to these sections may inadvertantly hide or show records in error - please make sure you know what you\'re doing.',
                    title: 'Warning'
                }
            },
            community: {
                prompt: 'Select a security policy to apply',
                fieldLabel: '',
                selectedTitle: 'Selected community record security policy details',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id aliquam sapien. Aliquam rhoncus congue consectetur. Aenean sed sapien ipsum.',
            },
            collection: {
                prompt: 'Select a security policy to apply',
                fieldLabel: '',
                dataStreamFieldLabel: (<span>
                    Collection policy to apply to the <b>datastream</b> of this PID
                </span>),
                selectedTitle: 'Selected collection record security policy details',
                dataStreamSelectedTitle: (<span>
                    Selected collection <b>datastream</b> security policy details
                </span>),
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id aliquam sapien. Aliquam rhoncus congue consectetur. Aenean sed sapien ipsum.',
            },
            record: {
                prompt: 'Select a security policy to apply',
                fieldLabel: '',
                dataStreamFieldLabel: '',
                selectedTitle: 'Selected record level security policy details',
                dataStreamSelectedTitle: 'Selected record level datastream security policy details',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id aliquam sapien. Aliquam rhoncus congue consectetur. Aenean sed sapien ipsum.',
            },
            submit: 'Submit'
        }
    }
};
