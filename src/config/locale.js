import React from 'react';
import {StandardCard} from 'uqlibrary-react-toolbox';

export default {
    global: {
        title: 'UQ eSpace',
        logo: 'https://static.uq.net.au/v1/logos/corporate/uq-logo-white.svg',
        loading: 'loading...',
        loginAlert: {
            title: 'You are not logged in',
            message: 'Please, login to UQ eSpace for full search results and more services.',
            type: 'info_outline',
        },
        notRegisteredAuthorAlert: {
            title: 'You are not registered in UQ eSpace as an author',
            message: 'Please contact the UQ Manager to resolve this.',
            type: 'info_outline'
        },
        sources: {
            ezproxyPrefix: 'http://ezproxy.library.uq.edu.au/login?url=',
            espace: {
                id: 'espace',
                title: 'eSpace',
                priority: 0,
                externalURL: 'https://espace.library.uq.edu.au/view/[ID]',
                idKey: 'rek_pid'
            },
            wos: {
                id: 'wos',
                title: 'Web of science',
                priority: 1,
                externalURL: 'http://gateway.isiknowledge.com/gateway/Gateway.cgi?GWVersion=2&SrcApp=resolve1&DestLinkType=FullRecord&DestApp=WOS_CPL&KeyUT=[ID]&SrcAuth=uqueensland',
                idLocation: 'fez_record_search_key_isi_loc',
                idKey: 'rek_isi_loc'
            },
            scopus: {
                id: 'scopus',
                title: 'Scopus',
                priority: 2,
                externalURL: 'http://www.scopus.com/record/display.url?eid=[ID]&origin=inward',
                idLocation: 'fez_record_search_key_scopus_id',
                idKey: 'rek_scopus_id'
            },
            pubmed: {
                id: 'pubmed',
                title: 'PubMed',
                priority: 3,
                externalURL: 'https://www.ncbi.nlm.nih.gov/pubmed/[ID]',
                idLocation: 'fez_record_search_key_pubmed_id',
                idKey: 'rek_pubmed_id'
            },
            crossref: {
                id: 'crossref',
                title: 'Crossref',
                priority: 4,
                externalURL: 'https://doi.org/[ID]',
                idLocation: 'fez_record_search_key_doi',
                idKey: 'rek_doi'
            }
        },
        embargoDateFormat: 'YYYY-MM-DD'
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
        dashboard: {
            loading: 'Loading your dashboard...',
            header: {
                help: {
                    title: 'Your dashboard',
                    text: 'Your profile help....',
                    buttonLabel: 'OK'
                },
                dashboardArticleCount: {
                    yearSeparator: ' to ',
                    countTitle: 'eSpace articles from'
                },
                dashboardAuthorAvatar: {
                    ariaPrefix: 'Photograph of '
                },
                dashboardResearcherIds: {
                    researcherIsLinked: 'Your [resource] ID is [id]',
                    researcherIsNotLinked: 'You are not linked to [resource]',
                    orcidUrlPrefix: 'http://orcid.org/',
                    orcidLinkPrefix: 'orcid.org/',
                    orcidlinkLabel: 'Click to visit your ORCId profile',
                    titles: {
                        publons: 'Publons',
                        scopus: 'Scopus',
                        researcher: 'Researcher',
                        google_scholar: 'Google Scholar',
                        orcid: 'ORCID'
                    },
                    linksPrefix: {
                        publons: 'https://publons.com/author/',
                        scopus: 'http://www.scopus.com/authid/detail.url?authorId=',
                        researcher: 'http://www.researcherid.com/rid/',
                        google_scholar: 'https://scholar.google.com.au/citations?user=',
                        orcid: 'https://orcid.org/'
                    }
                }
            },
            possiblePublicationsLure: {
                title: 'Claim now!',
                message: 'We have found [count] record(s) that could possibly be your work.',
                type: 'warning',
                actionButtonLabel: 'Claim your publications now'
            },
            publicationsByYearChart: {
                title: 'eSpace publications per year',
                yAxisTitle: 'Total publications'
            },
            publicationTypesCountChart: {
                title: 'Publication types overview'
            },
            myPublications: {
                title: 'My publications',
                viewAllButtonLabel: 'View all'
            },
            myTrendingPublications: {
                title: 'My trending publications',
                metrics: {
                    altmetric: {
                        title: 'Altmetric score'
                    },
                    thomson: {
                        title: 'Web of Science citation count'
                    },
                    scopus: {
                        title: 'Scopus citation count'
                    }
                },
                help: {
                    title: 'About these metrics',
                    text: (
                        <div>
                            <p>
                                For the above metrics, the larger number is the total current citation count, and the +
                                (plus) value indicates how much the citation count has changed in the last month. The
                                Altmetric score plus value is slightly different, as it shows the 3 most recent
                                increases first, ranging from 1 day to 1 year.
                            </p>
                            <p>
                                You can click on the number as a link to see who is citing each publication, or in the
                                case of Altmetric who is referencing the publication in social media and news outlets.
                            </p>
                        </div>),
                    buttonLabel: 'OK'
                },
            },
        },
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
            text: (
                <div>
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
                buttonLabel: 'OK'
            }
        },
        myResearch: {
            title: 'My research',
            help: {
                title: 'My research help',
                text: (
                    <div>
                        your research help....
                    </div>
                ),
                buttonLabel: 'OK'
            },
            text: (
                <div>
                    <div>Please, check if there are any possibly your publications via <a href="#claim-publications">claim
                        possible publications</a> or <a href="#add-record">add a missing publication</a></div>
                </div>
            ),
            loadingMessage: 'Searching for your publications...',
            loadingPagingMessage: 'Retrieving for your publications...',
            noResultsFound: {
                title: 'No publications found',
                text: (
                    <div>
                        We were unable to find any results. Please, check if there are any possibly your publications
                        via <a href="#claim-publications">claim possible publications</a> or <a href="#add-record">add a
                        missing publication</a>
                    </div>
                ),
            },
            facetsFilter: {
                title: 'Refine results',
                help: {
                    title: 'Refining your results',
                    text: 'Help about ....',
                    buttonLabel: 'Ok'
                },
                excludeFacetsList: ['Scopus document type', 'Subtype']
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
                    searchDashboard: {
                        title: 'Repository search',
                        recordSuffix: ' record(s)',
                        ariaCircularProgressLabelSuffix: 'loading',
                        repositories: [
                            {
                                id: 'espace',
                                title: 'eSpace'
                            },
                            {
                                id: 'wos',
                                title: 'Web of science'
                            },
                            {
                                id: 'scopus',
                                title: 'Scopus'
                            },
                            {
                                id: 'pubmed',
                                title: 'PubMed'
                            },
                            {
                                id: 'crossref',
                                title: 'Crossref'
                            },
                        ]
                    }
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
            facetSearchMessage: 'Applying filters...',
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
                claim: 'Claim this publication'
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
            },
            facetsFilter: {
                title: 'Refine results',
                help: {
                    title: 'Refining your results',
                    text: 'Help about ....',
                    buttonLabel: 'Ok'
                },
                excludeFacetsList: ['Scopus document type', 'Subtype']
            }
        }
    },
    components: {
        facetsFilter: {
            resetButtonText: 'Reset'
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
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Author\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
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
                },
                validationError: 'Please, provide a list of authors of the publication and link one author to the current user'
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
                        bookTitle: 'Book title',
                        subtype: 'Publication subtype',
                        publicationPlace: 'Place of publication',
                        publisher: 'Publisher',
                        date: {
                            day: 'Day',
                            month: 'Month',
                            year: 'Year'
                        }
                    }
                },
                authors: {
                    title: 'Authors',
                    help: {
                        title: 'Authors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    description: 'Provide a list of authors for this publication and assign yourself as an author or an editor',
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Author\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
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
                    description: 'Provide a list of editors for this publication',
                    help: {
                        title: 'Editors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Editor\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
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
                optional: {
                    title: 'Optional publication details',
                    help: {
                        title: 'Optional publication details',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    fieldLabels: {
                        articleNumber: 'Article number',
                        notes: 'Notes (not publicly viewable)',
                        url: 'Link (URL)'
                    }
                },
                validationError: 'Please, provide a list of authors and/or editors of the publication and link one author or editor to the current user'
            },
            bookChapter: {
                information: {
                    title: 'Book chapter information',
                    help: {
                        title: 'Book chapter information',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    fieldLabels: {
                        bookChapterTitle: 'Book chapter title',
                        bookTitle: 'Book title',
                        subtype: 'Publication subtype',
                        publicationPlace: 'Place of publication',
                        publisher: 'Publisher',
                        date: {
                            day: 'Day',
                            month: 'Month',
                            year: 'Year'
                        }
                    }
                },
                authors: {
                    title: 'Authors',
                    help: {
                        title: 'Authors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    description: 'Provide a list of authors for this publication and assign yourself as an author or an editor',
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Author\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
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
                    description: 'Provide a list of editors for this publication',
                    help: {
                        title: 'Editors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Editor\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
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
                other: {
                    title: 'Other publication details',
                    help: {
                        title: 'Other publication details',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    fieldLabels: {
                        edition: 'Edition',
                        startPage: 'Start page',
                        endPage: 'End page',
                        notes: 'Notes (not publicly viewable)',
                        url: 'Link (URL)'
                    }
                },
                validationError: 'Please, provide a list of authors of the publication and link an author name to the current user'
            },
            conferencePaper: {
                information: {
                    title: 'Conference paper information',
                    help: {
                        title: 'Conference paper information',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    fieldLabels: {
                        title: 'Title of paper',
                        conferenceName: 'Conference name',
                        conferenceLocation: 'Conference location',
                        conferenceDates: 'Conference dates (eg 13-15 December 2011)',
                        proceedingsTitle: 'Proceedings title',
                        subtype: 'Publication subtype',
                        publicationPlace: 'Place of publication',
                        publisher: 'Publisher',
                        date: {
                            day: 'Day',
                            month: 'Month',
                            year: 'Year'
                        }
                    }
                },
                authors: {
                    title: 'Authors',
                    help: {
                        title: 'Authors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    description: 'Provide a list of authors for this publication and assign yourself as an author',
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Author\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
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
                other: {
                    title: 'Other publication details',
                    help: {
                        title: 'Other publication details',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    fieldLabels: {
                        startPage: 'Start page',
                        endPage: 'End page',
                        notes: 'Notes (not publicly viewable)',
                        url: 'Link (URL)'
                    }
                },
                validationError: 'Please, provide a list of authors of the publication and link one author to the current user'
            },
            fileUpload: {
                title: 'Files',
                help: {
                    title: 'Files',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.',
                    buttonLabel: 'OK'
                }
            },
            cancelWorkflowConfirmation: {
                confirmationTitle: 'Abandon workflow',
                confirmationMessage: 'Are you sure you want to abandon workflow?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            },
            validationAlert: {
                title: 'Validation',
                message: 'Form cannot be submitted until all fields are valid. Please, review all input fields.'
            },
            errorAlert: {
                title: 'Error',
                createRecordMessage: 'Error has occurred during request and adding new publication cannot be processed. Please, review the form and try again.',
                fileUploadMessage: 'Files failed to upload but record was saved, please contact eSpace admins',
                patchFilesMessage: 'Record was created and files were uploaded but failed to link files to created record, please contact eSpace admins'
            },
            progressAlert: {
                title: 'Saving',
                message: 'Creating new publication is in progress.'
            },
            successAlert: {
                title: 'Success',
                message: 'New publication has been saved successfully.'
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
                    text: 'Enter the text that will help people here',
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
                title: 'Please suggest changes and/or upload additional files below',
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
            validationAlert: {
                title: 'Validation',
                message: 'Form cannot be submitted until all fields are valid. Please, review all input fields.'
            },
            errorAlert: {
                title: 'Error',
                message: 'Error has occurred during request and claim cannot be processed. Please, review the form and try again.'
            },
            progressAlert: {
                title: 'Saving',
                message: 'Claim publication is being processed.'
            },
            successAlert: {
                title: 'Success',
                message: 'Publication claim has been submitted successfully.'
            }
        },
        publicationCitation: {
            publicationSourcesLabel: 'Found in: ',
            citationCounts: {
                wosCountLabel: 'Web of Science citation count is [count]',
                scopusCountLabel: 'Scopus citation count is [count]',
                googleCountLabel: 'Citation counts in Google Scholar',
                altmetricCountLabel: 'Altmetric score is [count]',
                openAccessLabel: 'Open Access - free to read (embargo date might apply)',
                openAccessValues: ['DOI', 'Link (no DOI)', 'File (Publisher version)', 'File (Author Post-print)', 'Other'],
                statsLabel: 'View full statistics'
            },
            defaultActions: [
                {key: 'fixRecord', label: 'Fix record', primary: false}, // TODO: implement fixRecord
                // {key: 'shareRecord', primaryText: 'Share'} // TODO: implement shareRecord
            ]
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
                        inputFieldHint: 'Please type ISBN value',
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
                        inputFieldHint: 'Please type ISSN value',
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
                {value: 'thomson_citation_count', label: 'Thompson citation count'},
                {value: 'file_downloads', label: 'Downloads'}
            ],
            sortDirection: [
                'Desc',
                'Asc'
            ]
        }
    },
    validationErrors: {
        publicationSearch: 'Please, enter a valid publication DOI (e.g. 10.1163/9789004326828), Pubmed ID (e.g. 28131963) or the title (min 10 characters) of the publication',
        isbn: 'Invalid ISBN value',
        issn: 'Invalid ISSN value',
        fileUpload: 'File upload is not in valid state',
        required: 'This field is required',
        email: 'Please enter a valid email address',
        uniqueValue: 'This value has already been used',
        url: 'Please enter a valid URL',
        arrayRequired: 'You must select at least one item',
        canNotBeCI: 'You must specify a lead UQ supervisor for a RHD project',
        shortCode: 'The project short code must consist of 8 alpha numeric characters',
        dateTimeDay: 'Invalid date',
        dateTimeYear: 'Invalid year',
        maxLength: 'Must be [max] characters or less',
        minLength: 'Must be at least [min] characters',
        authorLinking: 'One author must be selected and be confirmed'
    }
};


