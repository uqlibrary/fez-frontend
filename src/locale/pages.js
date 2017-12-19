import React from 'react';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';

/*

NOTE:
- text can be either plain text, eg text: 'Some text to display' or
- text can be formatted HTML text, eg text: (<div>Click here to search google: <a href='google.com'>search google</a></div>)
IMPORTANT: if currently text contains placeholders, eg any characters in square brackets, eg [noOfResults] it cannot be formatted with HTML tags’

- help objects have the following shape:
help: {
    title: 'About these metrics',
    text: (<div></div>),
    buttonLabel: 'OK'
}
- text can be plain or formatted HTML component with links/tags/etc
- if help is not required, delete help: {} fully (including closing '},')

*/

export default {
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
            text: (
                <div>
                    <p>Welcome to The University of Queensland's institutional digital repository</p>
                    <p>
                        Public browse is coming soon...
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
        notFound: {
            title: 'Page not found',
            children: (
                <StandardCard>
                    <p>The requested page could not be found.</p>
                    <p>Sorry about that, but here's what you can do next:
                        <ul>
                            <li>Try re-typing the address, checking for spelling, capitalisation and/or punctuation.</li>
                            <li>Start again at the home page.</li>
                            <li>If you’re sure the page should be at this address, email us at webmaster@library.uq.edu.au.</li>
                        </ul>
                    </p>
                </StandardCard>
            )
        },
        authenticationRequired: {
            title: 'Authentication required',
            children: (
                <StandardCard>
                    <p>The requested page is available to authenticated users only.</p>
                    <p>Please login to continue</p>
                </StandardCard>
            )
        },
        permissionDenied: {
            title: 'Permissions denied',
            children: (
                <StandardCard>
                    <p>The requested page available to authorised users only.</p>
                </StandardCard>
            )
        },
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
                viewFullCitationLinkTitle: 'View full citation',
                trendSharesThisMonth: 'Number of shares in the past month',
                trendDifferenceSharesThisMonth: 'Difference in shares since last month',
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
        myResearch: {
            pageTitle: 'My research',
            title: 'Showing [perPage] of [total] of your eSpace publications',
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
                    Add to this list by <a href="/records/possible">claiming a publication</a> or <a href="/records/add/find">adding a missing publication</a>.
                </div>
            ),
            loadingMessage: 'Searching for your publications...',
            loadingPagingMessage: 'Retrieving your publications...',
            noResultsFound: {
                title: 'No publications found',
                text: (
                    <div>
                        We were unable to find any results. You may be able to <a href="/records/possible">claim publications we think may be yours</a> or <a href="/records/add/find">add a
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
                claim: 'Claim this publication',
                inProgress: 'In progress'
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
                submit: 'Search',
                skip: 'Skip search'
            },
            step2: {
                noResultsFound: {
                    title: 'No matching publications found',
                    text: 'We were unable to match any results to your search criteria. Please search again or create a new eSpace record.',
                    help: {
                        title: 'No matching records found',
                        text: 'Why search didn\'t return any items....',
                        buttonLabel: 'Ok'
                    }
                },
                searchResults: {
                    title: 'Possible matches found',
                    resultsText: 'Top [noOfResults] potential match(es) displayed for "[searchQuery]".',
                    text: 'Claim a matching publication below, refine your search or create a new eSpace record.',
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
                claim: 'Claim this publication',
                unclaimable: 'All authors have been assigned'
            },
            step3: {
                // all text values come from forms.PublicationForm
            },
            successWorkflowConfirmation: {
                confirmationTitle: 'Your record has been submitted',
                successConfirmationMessage: (<p>Your item will be published immediately and an UQ eSpace Research Outputs Officer will review the record.</p>),
                fileFailConfirmationMessage: (<p>
                    Your record has been saved. <br/><br/>
                    <strong>Please note, file upload has failed. Retry uploading files via "Fix record" screen or contact eSpace administrators. </strong><br/><br/>
                    Your item will be published immediately and an UQ eSpace Research Outputs Officer will review the record.
                </p>),
                cancelButtonLabel: 'Add another missing record',
                confirmButtonLabel: 'Go to my research'
            }
        },
        fixRecord: {
            loadingMessage: 'Loading record...',
            title: 'Request a change/deposit a file',
            subTitle: 'Record to be amended',
            fieldLabels: {
                action: 'Select an action'
            },
            actionsOptions: [
                {
                    action: 'fix',
                    title: 'I am the author/editor/contributor of this record - I would like to make a correction, or upload files'
                },
                {
                    action: 'unclaim',
                    title: 'I am not the author/editor/contributor of this record - I would like this record removed from my profile'
                }
            ],
            cancel: 'Cancel',
            submit: 'Submit'
        },
        masquerade: {
            title: 'Masquerade',
            help: {
                title: 'Masquerade',
                text: (
                    <div>
                        Masquerade as another user...
                    </div>
                ),
                buttonLabel: 'OK'
            },
            description: (<div>
                <strong>WARNING!!</strong> Masquerading as a user you will effectively become the user you enter here, and changes you make will apply to their account!
            </div>),
            labels: {
                submit: 'Masquerade',
                hint: 'Username or student username'
            }
        }
    }
};
