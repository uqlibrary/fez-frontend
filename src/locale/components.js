export default {
    components: {
        facetsFilter: {
            resetButtonText: 'Reset',
            yearPublishedCategory: 'Year published',
            yearPublishedFacet: {
                displayTitle: 'Published year range',
                fromFieldLabel: 'From',
                toFieldLabel: 'To',
                rangeSubmitButtonLabel: 'Go'
            }
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
                statsLabel: 'View full statistics',
                altmetric: {
                    externalUrl: 'http://www.altmetric.com/details.php?citation_id=[id]',
                    title: 'Altmetric',
                },
                google: {
                    externalUrl: 'https://scholar.google.com/scholar?q=intitle:[id]',
                    title: 'Google scholar',
                },
            },
            citationAuthors: {
                showMoreLabel: 'Show [numberOfAuthors] more...',
                showLessLabel: 'Show less'
            },
            defaultActions: [
                {key: 'fixRecord', label: 'Request Correction', primary: false},
                // {key: 'shareRecord', primaryText: 'Share'} // TODO: implement shareRecord
            ]
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
            help: {
                title: 'ISBN value',
                text: 'Acceptable ISBN formats are....',
                buttonLabel: 'OK'
            },
            field: {
                form: {
                    locale: {
                        inputFieldLabel: 'ISBN value',
                        inputFieldHint: 'Type ISBN value',
                        addButtonLabel: 'Add ISBN'
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
            help: {
                title: 'ISSN value',
                text: 'Acceptable ISSN formats are....',
                buttonLabel: 'OK'
            },
            field: {
                form: {
                    locale: {
                        inputFieldLabel: 'ISSN value',
                        inputFieldHint: 'Type ISSN value',
                        addButtonLabel: 'Add ISSN'
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
            help: {
                title: 'Adding contributors',
                text: 'Help text...',
                buttonLabel: 'OK'
            },
            field: {
                form: {
                    locale: {
                        nameAsPublishedLabel: 'Enter each author\'s name as published',
                        nameAsPublishedHint: 'Type the name exactly as published',
                        identifierLabel: 'UQ identifier (if available)',
                        addButton: 'Add author'
                    }
                },
                header: {
                    locale: {
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
                        moveUpHint: 'Move item up the order',
                        moveDownHint: 'Move item down the order',
                        deleteHint: 'Remove this item',
                        ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
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
            help: {
                title: 'Editors',
                text: 'some help',
                buttonLabel: 'OK'
            },
            field: {
                form: {
                    locale: {
                        nameAsPublishedLabel: 'Enter each editor\'s name as published',
                        nameAsPublishedHint: 'Type the name exactly as published',
                        identifierLabel: 'UQ identifier (if available)',
                        addButton: 'Add editor'
                    }
                },
                header: {
                    locale: {
                        contributorAssignmentColumn: 'Select your name (if applicable)',
                        nameColumn: 'Editor\'s name as published',
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
                        moveUpHint: 'Move item up the order',
                        moveDownHint: 'Move item down the order',
                        deleteHint: 'Remove this item',
                        ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
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
            help: {
                title: 'Creators',
                text: 'some help',
                buttonLabel: 'OK'
            },
            description: 'Please provide a list of creators (e.g. producer or performer if self-produced) and then select your name from the list.',
            descriptionCreatorOrContributor: 'Please provide a list of creators (e.g. producer or performer if self-produced) and then select your name once from the list of creators or contributors.',
            field: {
                form: {
                    locale: {
                        nameAsPublishedLabel: 'Enter each creator\'s name as published',
                        nameAsPublishedHint: 'Type the name exactly as published',
                        identifierLabel: 'UQ identifier (if available)',
                        addButton: 'Add creator'
                    }
                },
                header: {
                    locale: {
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
                        moveUpHint: 'Move item up the order',
                        moveDownHint: 'Move item down the order',
                        deleteHint: 'Remove this item',
                        ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
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
                text: 'Enter designers in the order and form they appear on the published paper. Additional boxes will appear for more authors.',
                buttonLabel: 'OK'
            },
            field: {
                form: {
                    locale: {
                        nameAsPublishedLabel: 'Enter each designer\'s name as published',
                        nameAsPublishedHint: 'Type the name exactly as published',
                        identifierLabel: 'UQ identifier (if available)',
                        addButton: 'Add designer'
                    }
                },
                header: {
                    locale: {
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
                        moveUpHint: 'Move item up the order',
                        moveDownHint: 'Move item down the order',
                        deleteHint: 'Remove this item',
                        ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
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
            help: {
                title: 'Supervisors help',
                text: 'Enter supervisor names e.g. first name, last name. Additional boxes will appear for more supervisors.',
                buttonLabel: 'OK'
            },
            description: 'Please provide a list of supervisors and then select your name from the list.',
            field: {
                form: {
                    locale: {
                        nameAsPublishedLabel: 'Enter each supervisor\'s name as published',
                        nameAsPublishedHint: '',
                        identifierLabel: 'UQ identifier (if available)',
                        addButton: 'Add supervisor'
                    }
                },
                header: {
                    locale: {
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
                        moveUpHint: 'Move item up the order',
                        moveDownHint: 'Move item down the order',
                        deleteHint: 'Remove this item',
                        ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
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
            help: {
                title: 'Supervisors help',
                text: 'Enter supervisor names e.g. first name, last name. Additional boxes will appear for more supervisors.',
                buttonLabel: 'OK'
            },
            description: 'List your current supervisors',
            field: {
                form: {
                    locale: {
                        nameAsPublishedLabel: 'Enter each supervisor’s name on a separate line e.g. Firstname Surname',
                        nameAsPublishedHint: '',
                        identifierLabel: 'UQ identifier (if available)',
                        addButton: 'Add supervisor'
                    }
                },
                header: {
                    locale: {
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
            description: 'Please provide a list of contributors (e.g. producer or performer if self-produced) and then select your name from the list.',
            descriptionCreatorOrContributor: 'Please provide a list of contributors (e.g. producer or performer if self-produced) and then select your name once from the list of creators or contributors.',
            help: {
                title: 'Contributors',
                text: 'This is the contributor, and may be different to the creator, e.g. interviewee, performer (if not self-produced). Type contributors in the order and form they appear on the work or associated material. Examples of associated material are programs or promotional material. Additional boxes will appear for more contributors.',
                buttonLabel: 'OK'
            },
            field: {
                form: {
                    locale: {
                        nameAsPublishedLabel: 'Enter each contributor\'s name as published',
                        nameAsPublishedHint: 'Type the name exactly as published',
                        identifierLabel: 'UQ identifier (if available)',
                        addButton: 'Add contributor'
                    }
                },
                header: {
                    locale: {
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
                        moveUpHint: 'Move item up the order',
                        moveDownHint: 'Move item down the order',
                        deleteHint: 'Remove this item',
                        ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
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
            help: {
                title: 'Field of research',
                text: 'more info',
                buttonLabel: 'OK'
            },
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
            totalRecords: '([total] records)'
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
            ]
        }
    }
};
