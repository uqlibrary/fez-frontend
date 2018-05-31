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
            excludeFacetsList: ['Scopus document type', 'Subtype', 'Year published'],
            renameFacetsList: {'Display type': 'Publication type'},
            lookupFacetsList: {
                'Author': 'Author (lookup)',
                'Collection': 'Collection (lookup)',
                'Subject': 'Subject (lookup)'
            },
            // help: {
            //     title: 'Refining your results',
            //     text: 'Help about ....',
            //     buttonLabel: 'Ok'
            // },
        },
        publicationStats: {
            publicationStatsTitle1: 'eSpace publications indexed in:',
            publicationStatsTitle2: 'Web of science',
            publicationStatsTitle2mobile: 'WOS',
            publicationStatsTitle3: 'Scopus',
            publicationStatsRowTitle1: 'h-index',
            publicationStatsRowTitle2: 'Average citation count per publication',
            publicationStatsRowTitle3: 'Total citations',
            publicationStatsRowTitle4: 'Total publications',
            publicationStatsRowTitle5: 'Publication range',
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
                }
            }
        },
        myTrendingPublications: {
            loading: 'Loading your trending publications...',
            metrics: {
                altmetric: {
                    title: 'Altmetric score',
                    subtitle: 'The +plus score indicates recent increase in social media activity',
                    order: 2
                },
                thomson: {
                    title: 'Web of Science citation count',
                    subtitle: 'The +plus score indicates the increase in citations over the last month',
                    order: 1
                },
                scopus: {
                    title: 'Scopus citation count',
                    subtitle: 'The +plus score indicates the increase in citations over the last month',
                    order: 0
                }
            }
        },
        trendingPublicationHelp: {
            title: 'About these metrics',
            text: (
                <div>
                    <h3>WOS and Scopus</h3>
                    <p>
                        The large number is the total citation count and the + (plus) value indicates how much the citation count has increased in the last three months.
                    </p>
                    <h3>Altmetric score (social media activity)</h3>
                    <p>
                        The Altmetric score measures social media activity. The + (plus) value shows the increase in social media activity over time.
                    </p>
                    <p>
                        You can click on the number as a link to see who is citing each publication, or in the
                        case of Altmetric who is referencing the publication in social media and news outlets.
                    </p>
                    <p>For more information visit :
                        <a href="https://www.altmetric.com/about-altmetrics/what-are-altmetrics/" target="_blank" rel="noopener noreferrer">
                            https://www.altmetric.com/about-altmetrics/what-are-altmetrics/
                        </a>
                    </p>
                </div>),
            buttonLabel: 'OK'
        },
        myLatestPublications: {
            loading: 'Loading your latest publications...',
            viewAllButtonLabel: 'View all'
        },
        topCitedPublications: {
            loading: 'Loading trending publications...',
            notAvailableAlert: {
                type: 'error',
                title: 'There has been an error',
                message: 'Trending publications are temporarily unavailable'
            },
            altmetric: {
                title: (<span>Trending publications</span>),
                mobileTitle: 'Trending',
                heading: 'Altmetric score',
                subHeading: 'The +plus score indicates recent increase in social media activity',
                order: 0
            },
            scopus: {
                title: (<span>Hot&nbsp;papers&nbsp;on Scopus</span>),
                mobileTitle: 'Scopus',
                heading: 'Scopus citation count',
                subHeading: 'The +plus score indicates the increase in citations over the three months',
                order: 1
            },
            thomson: {
                title: (<span>Hot&nbsp;papers&nbsp;on Web&nbsp;of&nbsp;science</span>),
                mobileTitle: 'WOS',
                heading: 'Web of Science citation count',
                subHeading: 'The +plus score indicates the increase in citations over the three months',
                order: 2
            }
        },
        keywordsForm: {
            field: {
                form: {
                    locale: {
                        inputFieldLabel: 'Keywords',
                        inputFieldHint: 'Type keywords',
                        addButtonLabel: 'Add'
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
        isbnForm: {
            title: 'ISBN',
            text: 'You can add up to five ISBN values',
            // help: {
            //     title: 'ISBN value',
            //     text: 'Acceptable ISBN formats are....',
            //     buttonLabel: 'OK'
            // },
            field: {
                form: {
                    locale: {
                        inputFieldLabel: 'ISBN value',
                        inputFieldHint: 'Type ISBN value',
                        addButtonLabel: 'Add ISBN',
                        remindToAdd: (<span>Please, press <b>ENTER</b> or click <b>ADD</b> button to add this value to the list</span>)
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
            //     buttonLabel: 'OK'
            // },
            field: {
                form: {
                    locale: {
                        inputFieldLabel: 'ISSN value',
                        inputFieldHint: 'Type ISSN value',
                        addButtonLabel: 'Add ISSN',
                        remindToAdd: (<span>Please, press <b>ENTER</b> or click <b>ADD</b> button to add this value to the list</span>)
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
        authors: {
            title: 'Authors',
            description: 'Please provide a list of authors and then select your name from the list.',
            descriptionAuthorOrEditor: 'Please provide a list of authors and then select your name once from the list of authors or editors.',
            // help: {
            //     title: 'Adding contributors',
            //     text: 'Help text...',
            //     buttonLabel: 'OK'
            // },
            field: {
                form: {
                    locale: {
                        descriptionStep1: (
                            <div><span className="authorSteps">Step 1 of 2</span> - Please <b>add to a list of authors below</b>, in the format and order that they are published.</div>
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
                            <div><span className="authorSteps">Step 2 of 2</span> - Please <b>select your name</b> from the list below (if applicable).</div>
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
                        ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
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
            //     buttonLabel: 'OK'
            // },
            field: {
                form: {
                    locale: {
                        descriptionStep1: (
                            <div><span className="authorSteps">Step 1 of 2</span> - Please <b>add to a list of editors below</b>, in the format "John Smith".</div>
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
                            <div><span className="authorSteps">Step 2 of 2</span> - Please <b>select your name</b> from the list below (if applicable).</div>
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
                        ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
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
            //     buttonLabel: 'OK'
            // },
            description: 'Please provide a list of creators (e.g. producer or performer if self-produced) and then select your name from the list.',
            descriptionCreatorOrContributor: 'Please provide a list of creators (e.g. producer or performer if self-produced) and then select your name once from the list of creators or contributors.',
            field: {
                form: {
                    locale: {
                        descriptionStep1: (
                            <div><span className="authorSteps">Step 1 of 2</span> - Please <b>add to a list of creators below</b>, in the format and order that they are published.</div>
                        ),
                        descriptionStep1NoStep2: (
                            <div>Please <b>add to a list of creators below</b>, in the format and order that they are published.</div>
                        ),
                        nameAsPublishedLabel: 'Enter each creator\'s name as published (eg. Smith, John)',
                        nameAsPublishedHint: 'Type the name exactly as published',
                        identifierLabel: 'UQ identifier (if available)',
                        addButton: 'Add creator'
                    }
                },
                header: {
                    locale: {
                        descriptionStep2: (
                            <div><span className="authorSteps">Step 2 of 2</span> - Please <b>select your name</b> from the list below (if applicable).</div>
                        ),
                        contributorAssignmentColumn: 'Select your name',
                        nameColumn: 'Creator\'s name as published',
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
                        ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
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
            // help: {
            //     title: 'Designers',
            //     text: 'Enter designers in the order and form they appear on the published paper. Additional boxes will appear for more authors.',
            //     buttonLabel: 'OK'
            // },
            field: {
                form: {
                    locale: {
                        descriptionStep1: (
                            <div><span className="authorSteps">Step 1 of 2</span> - Please <b>add to a list of designers below</b>, in the format and order that they are published.</div>
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
                            <div><span className="authorSteps">Step 2 of 2</span> - Please <b>select your name</b> from the list below (if applicable).</div>
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
                        ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
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
            //     buttonLabel: 'OK'
            // },
            description: 'Please provide a list of supervisors and then select your name from the list.',
            field: {
                form: {
                    locale: {
                        descriptionStep1: (
                            <div><span className="authorSteps">Step 1 of 2</span> - Please <b>add to a list of supervisors below</b>, in the format and order that they are published.</div>
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
                            <div><span className="authorSteps">Step 2 of 2</span> - Please <b>select your name</b> from the list below (if applicable).</div>
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
                        ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
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
            //     buttonLabel: 'OK'
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
                        ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
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
                buttonLabel: 'OK'
            },
            field: {
                form: {
                    locale: {
                        descriptionStep1: (
                            <div><span className="authorSteps">Step 1 of 2</span> - Please <b>add to a list of contributors below</b>, in the format and order that they are published.</div>
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
                            <div><span className="authorSteps">Step 2 of 2</span> - Please <b>select your name</b> from the list below (if applicable).</div>
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
                        ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
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
            //     buttonLabel: 'OK'
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
                {value: 'thomson_citation_count', label: 'Thompson citation count'}
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
            ariaInputLabel: 'Enter your search query to search eSpace and then press Enter',
            searchButtonHint: 'Search eSpace',
            mobileSearchButtonAriaLabel: 'Click to search eSpace',
            advancedSearchButtonText: 'Advanced search',
            advancedSearchButtonAriaLabel: 'Click to switch to Advanced search',
            searchButtonText: 'Search',
            searchButtonAriaLabel: 'Click to search eSpace',
            simpleSearchToggle: 'Simple search',

        },
        whatIsEspace: {
            title: 'What is eSpace?',
            text: (<span>
                The University of Queensland's institutional repository, UQ eSpace, aims to create global visibility and accessibility of UQ’s scholarly research by enhancing discovery of UQ research via search engines such as Google and Trove...
            </span>),
            readMoreLabel: ' read more',
            readMoreTitle: 'Click to read more about UQ eSpace',
            readMoreLink: '/contact'
        }
    }
};
