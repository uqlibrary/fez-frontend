import React from 'react';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {pathConfig} from 'config/routes';
import locale from 'locale/components';

/*

NOTE:
- text can be either plain text, eg text: 'Some text to display' or
- text can be formatted HTML text, eg text: (<div>Click here to search google: <a href='google.com'>search google</a></div>)
IMPORTANT: if currently text contains placeholders, eg any characters in square brackets, eg [noOfResults] it cannot be formatted with HTML tags’

- help objects have the following shape:
help: {
    title: 'About these metrics',
    text: (<div></div>),
    buttonLabel: 'CLOSE'
}
- text can be plain or formatted HTML component with links/tags/etc
- if help is not required, delete help: {} fully (including closing '},')

*/

export default {
    pages: {
        index: {
            title: 'eSpace'
        },
        contact: {
            title: 'Contact UQ eSpace',
            children: (
                <StandardCard>
                    <h3>General Enquiries</h3>
                    <p>
                        Tel: 07 334 69775 <br/>
                        Email: <a href="mailto:espace@library.uq.edu.au">espace@library.uq.edu.au</a><br/>
                    </p>
                    <h3>Staff contact</h3>
                    <p>
                        Mary-Anne Marrington<br/>
                        Manager, UQ eSpace<br/>
                        Tel: 07 334 69981<br/>
                        Email: <a href="mailto:m.marrington@library.uq.edu.au">m.marrington@library.uq.edu.au</a><br/>
                    </p>
                    <h3>About UQ eSpace</h3>
                    The University of Queensland's institutional repository, UQ eSpace, aims to create global visibility and accessibility of UQ’s scholarly research by:
                    <ul>
                        <li>Enhancing discovery of UQ research via search engines such as Google and Trove</li>
                        <li>Allowing researchers to deposit publications, datasets and open access materials and to view publication metrics</li>
                        <li>Maintaining a complete and accurate record of all UQ research publications and research data sets that feeds into central UQ systems including UQ Researchers and the Academic Portal</li>
                        <li>Enabling government reporting such as Australian Research Council’s Excellence in Research for Australia and the Engagement and Impact Assessment</li>
                        <li>Supporting the deposit of open access publications to make UQ research globally accessible</li>
                        <li>Preserving and making digitised materials accessible to the world including HDR theses, photographs, audio materials, videos, manuscripts and other original works.</li>
                    </ul>
                    <p>You can also read the <a href="https://espace.library.uq.edu.au/view/UQ:295655/eSpaceScopeandPolicy.pdf">UQ eSpace Scope and Policy</a>.</p>
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
                buttonLabel: 'CLOSE'
            }
        },
        notFound: {
            title: 'Page not found',
            children: (
                <StandardCard>
                    <p>The requested page could not be found.</p>
                    <p>Sorry about that, but here's what you can do next:</p>
                    <ul>
                        <li>Try re-typing the address, checking for spelling, capitalisation and/or punctuation.</li>
                        <li>Start again at the home page.</li>
                        <li>If you’re sure the page should be at this address, email us at webmaster@library.uq.edu.au.</li>
                    </ul>
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
        thesisSubmissionDenied: {
            title: 'Thesis deposit access denied',
            children: (
                <StandardCard>
                    <p>
                        Your account does not have rights for thesis deposit workflow.
                    </p>
                    <p>
                        For depositing your thesis you must login with your <b>student username</b> (you may have logged into eSpace with your staff username).
                    </p>
                    <p>
                        Please logout and login with the correct user account.
                    </p>
                </StandardCard>
            )
        },
        dashboard: {
            loading: 'Loading your dashboard',
            header: {
                // help: {
                //     title: 'Your dashboard',
                //     text: 'Your profile help....',
                //     buttonLabel: 'CLOSE'
                // },
                dashboardArticleCount: {
                    yearSeparator: ' to ',
                    countTitle: 'eSpace works from'
                },
                dashboardAuthorAvatar: {
                    ariaPrefix: 'Photograph of '
                },
                dashboardResearcherIds: {
                    researcherIsLinked: 'Your [resource] ID is [id] - Click to review',
                    researcherIsNotLinked: 'You are not linked to [resource] - Click for more information',
                    orcidUrlPrefix: process.env.ORCID_URL ? `${process.env.ORCID_URL}/` : 'https://orcid.org/',
                    orcidLinkPrefix: ' orcid.org/',
                    orcidlinkLabel: 'Click to visit your ORCId profile',
                    titles: {
                        publons: 'Publons',
                        scopus: 'Scopus',
                        researcher: 'Researcher (ISI)',
                        google_scholar: 'Google Scholar',
                        orcid: 'ORCID'
                    },
                    links: {
                        linkedUrl: {
                            publons: 'https://publons.com/author/',
                            scopus: 'http://www.scopus.com/authid/detail.url?authorId=',
                            researcher: 'http://www.researcherid.com/rid/',
                            google_scholar: 'https://scholar.google.com.au/citations?user=',
                            orcid: 'https://orcid.org/'
                        },
                        notLinkedUrl: {
                            publons: 'http://guides.library.uq.edu.au/for-researchers/researcher-identifier/publons',
                            scopus: 'http://guides.library.uq.edu.au/for-researchers/researcher-identifier/scopus-authorid',
                            researcher: 'http://guides.library.uq.edu.au/for-researchers/researcher-identifier/researcherid',
                            google_scholar: 'http://guides.library.uq.edu.au/for-researchers/researcher-identifier/google-scholar-profile',
                            // google_scholar: pathConfig.authorIdentifiers.googleScholar.link,
                            orcid: pathConfig.authorIdentifiers.orcid.link
                        }
                    }
                }
            },
            myLatestPublications: {
                title: 'My works',
            },
            myTrendingPublications: {
                title: 'My trending works'
            },
            possiblePublicationsLure: {
                title: 'Claim now!',
                message: 'We have found [count] record(s) that could possibly be your works.',
                type: 'info_outline',
                actionButtonLabel: 'Claim your works now'
            },
            nothingToClaimLure: {
                title: 'Add your work to eSpace',
                message: 'We found nothing new for you to claim, but you may add a work any time.',
                type: 'info_outline',
                actionButtonLabel: 'Add a missing work'
            },
            publicationsByYearChart: {
                title: 'eSpace works per year',
                yAxisTitle: 'Total publications'
            },
            publicationTypesCountChart: {
                title: 'Work types overview'
            },
            incompleteRecordLure: {
                title: 'NTRO Data Required',
                message: 'We have found [count] work(s) that require[verbEnding] more information.',
                type: 'warning',
                actionButtonLabel: 'View and Complete'
            },
        },
        myResearch: {
            pageTitle: 'My research',
            recordCount: 'Displaying records [recordsFrom] to [recordsTo] of [recordsTotal] total records. ',
            text: (
                <span>
                    Add to this list by <a href={`${pathConfig.records.possible}`}>claiming a work</a> or <a href={`${pathConfig.records.add.find}`}>adding a missing work</a>.
                </span>
            ),
            loadingMessage: 'Searching for your works',
            loadingPagingMessage: 'Retrieving your works',
            exportPublicationsLoadingMessage: 'Exporting your works',
            noResultsFound: {
                title: 'No works found',
                text: (
                    <div>
                        We were unable to find any results. You may be able to <a href={`${pathConfig.records.possible}`}>claim
                        works we think may be yours</a> or <a href={`${pathConfig.records.add.find}`}>add a
                        missing publication</a>
                    </div>
                ),
            },
            facetsFilter: {...locale.components.facetsFilter}
        },
        myDatasets: {
            pageTitle: 'My research data',
            recordCount: 'Displaying records [recordsFrom] to [recordsTo] of [recordsTotal] total records. ',
            text: (
                <span>
                    Add to this list by <a href={`${pathConfig.dataset.add}`}>adding a missing dataset</a>.
                </span>
            ),
            loadingMessage: 'Searching for your datasets',
            loadingPagingMessage: 'Retrieving your datasets',
            noResultsFound: {
                title: 'No datasets found',
                text: (
                    <div>
                        We were unable to find any results. You may be able to <a href={`${pathConfig.dataset.add}`}>add a missing dataset</a>.
                    </div>
                ),
            },
            facetsFilter: {
                ...locale.components.facetsFilter,
                excludeFacetsList: ['Scopus document type', 'Subtype', 'Year published', 'Display type'],
                renameFacetsList: {}
            }
        },
        addDataset: {
            pageTitle: 'Add data collection',
            depositAgreement: 'Lorem ipsum',
            successWorkflowConfirmation: {
                confirmationTitle: 'Your dataset has been submitted',
                datasetSuccessConfirmationMessage: (
                    <p>
                        Your dataset has been saved.<br/><br/>
                        Your item will be published immediately and an UQ eSpace Research Outputs Officer will review the
                        record.
                    </p>),
                fileFailConfirmationAlert: {
                    title: 'File upload and/or notes post failed',
                    message: 'lorem ipsum',
                    type: 'warning'
                },
                cancelButtonLabel: 'Add another missing dataset',
                confirmButtonLabel: 'Go to my datasets'
            }
        },
        claimPublications: {
            title: 'Claim possible works',
            loadingMessage: 'Searching for possibly your works',
            noResultsFound: {
                title: 'No matching works found',
                text: (
                    <div>
                        <p>No works were automatically matched for you to claim.</p>
                    </div>
                ),
                // help: {
                //     title: 'No matching records found',
                //     text: 'Why search didn\'t return any items....',
                //     buttonLabel: 'CLOSE'
                // }
            },
            searchResults: {
                // title: 'Possibly your publications',
                text: '[resultsCount] out of [totalCount] potential match(es) displayed. Select any item to claim it as your work.',
                // help: {
                //     title: 'Possibly your publications',
                //     text: 'Help about ....',
                //     buttonLabel: 'CLOSE'
                // },
                hide: 'Not mine',
                claim: 'Claim this work',
                inProgress: 'In progress'
            },
            hidePublicationConfirmation: {
                confirmationTitle: 'Hide work',
                confirmationMessage: 'Are you sure you want to hide selected possible work from this view?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            },
            hidePublicationFailedAlert: {
                title: 'Error',
                message: (message) => (`Error has occurred during request and request cannot be processed. ${message} Please contact eSpace administrators or try again later.`),
                type: 'error'
            },
            hideAllPublicationsConfirmation: {
                confirmationTitle: 'Hide works',
                confirmationMessage: 'Are you sure you want to hide all possible works from this view?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            },
            facetsFilter: {...locale.components.facetsFilter}
        },
        addRecord: {
            title: 'Add a missing work to eSpace',
            stepper: [
                {label: 'Search for your work'},
                {label: 'Search results'},
                {label: 'Add your work'}
            ],
            step1: {
                title: 'Search for your works',
                text: 'Enter either the DOI (e.g. 10.1163/9789004326828), Pubmed Id (e.g. 28131963) or the title of work. This will allow us to check whether the record is already in eSpace or is available from another source.',
                // help: {
                //     title: 'Search for your publication',
                //     text: 'Help about search....',
                //     buttonLabel: 'CLOSE'
                // },
                fieldLabels: {
                    search: 'Enter DOI, Pubmed Id or Title'
                },
                submit: 'Search',
                skip: 'Skip search'
            },
            step2: {
                noResultsFound: {
                    title: 'No matching works found',
                    text: 'We were unable to match any results to your search criteria. Please search again or create a new eSpace record.',
                    // help: {
                    //     title: 'No matching records found',
                    //     text: 'Why search didn\'t return any items....',
                    //     buttonLabel: 'CLOSE'
                    // }
                },
                searchResults: {
                    title: 'Possible matches found',
                    resultsText: 'Top [noOfResults] potential match(es) displayed for "[searchQuery]".',
                    text: 'Claim a matching work below, refine your search or create a new eSpace record.',
                    // help: {
                    //     title: 'Possible matches found',
                    //     text: 'Why search displays these items....',
                    //     buttonLabel: 'CLOSE'
                    // },
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
                loadingMessage: 'Searching for works',
                cancel: 'Abandon and search again',
                submit: 'Create a new eSpace record',
                claim: 'Claim this work',
                unclaimable: 'All authors have been assigned'
            },
            step3: {
                // all text values come from forms.PublicationForm
            },
            successWorkflowConfirmation: {
                confirmationTitle: 'Your work has been submitted',
                recordSuccessConfirmationMessage: (
                    <p>
                        Your work has been saved.<br/><br/>
                        Your work will be published immediately and a UQ eSpace Research Outputs Officer will review the record.
                    </p>),
                fileFailConfirmationAlert: {
                    title: 'File upload and/or notes post failed',
                    message: 'Retry uploading files and/or submitting notes via "Fix record" screen or contact eSpace administrators.',
                    type: 'warning'
                },
                cancelButtonLabel: 'Add another missing work',
                confirmButtonLabel: 'Go to my research'
            }
        },
        fixRecord: {
            loadingMessage: 'Loading work',
            title: 'Request a correction or upload files',
            subTitle: 'Work to be amended',
            fieldLabels: {
                action: 'Select an action'
            },
            actionsOptions: [
                {
                    action: 'fix',
                    title: 'I am the author/editor/contributor of this work - I would like to make a correction, or upload files'
                },
                {
                    action: 'unclaim',
                    title: 'I am not the author/editor/contributor of this work - I would like this work removed from my profile'
                }
            ],
            cancel: 'Cancel',
            submit: 'Submit'
        },
        viewRecord: {
            loadingMessage: 'Loading record',
            thumbnailTitle: 'Click to open a preview of [image]'
        },
        searchRecords: {
            title: 'eSpace search',
            loadingMessage: 'Searching for works',
            recordCount: 'Displaying works [recordsFrom] to [recordsTo] of [recordsTotal] total records. ',
            loadingPagingMessage: 'Searching for works',
            exportPublicationsLoadingMessage: 'Exporting search results',
            noResultsFound: {
                title: 'No works found',
                text: (
                    <div>
                        We were unable to find any results.
                    </div>
                ),
            },
            facetsFilter: {
                ...locale.components.facetsFilter,
                excludeFacetsList: ['Scopus document type', 'Genre', 'Year published', 'Published year range']},
            errorAlert: {
                type: 'error_outline',
                title: 'Error',
                message: (message) => message
            },
        },
        collection: {
            title: 'Add a missing collection',
            cancelWorkflowConfirmation: {
                confirmationTitle: 'Cancel collection creation',
                confirmationMessage: 'Are you sure you want to cancel creating this collection?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            },
        },
        community: {
            title: 'Add a missing community',
            cancelWorkflowConfirmation: {
                confirmationTitle: 'Cancel community creation',
                confirmationMessage: 'Are you sure you want to cancel creating this community?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            },
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
                buttonLabel: 'CLOSE'
            },
            description: (account) => account && account.canMasqueradeType && account.canMasqueradeType === 'readonly' ?
                (<p>
                    <strong>NOTE:</strong> As a read-only masquerader, you can view all parts of the profile, but you are not able to make any changes to the account.
                </p>) :
                (<p>
                    <strong>WARNING!!</strong> When masquerading as a user, you will effectively become that user, and changes you make will apply to the account!
                </p>),
            labels: {
                submit: 'Masquerade',
                hint: 'Enter a UQ staff or student username (eg. uqjsmith1 or s123456)'
            }
        },
        googleScholarLink: {
            title: 'Google Scholar identifier',
            help: {
                title: 'About Google Scholar',
                text: (
                    <div>
                        <h3>How to create Google Scholar profile?</h3>
                        <ol>
                            <li>Sign to your Google account, or create one if you don't have one.</li>
                            <li>After you sign in, the Citations sign up form will ask you to confirm the spelling of
                                your name, to enter your affiliation, etc.
                            </li>
                            <li>On the next page, you will see a list of articles. Add the articles that are yours.</li>
                            <li>Once you're done with adding articles, it will ask you what to do when the article data
                                changes in Google Scholar. You can either have the updates applied to your profile
                                automatically or you can choose to review them beforehand.
                            </li>
                            <li>Finally, you will see your profile.Once you are satisfied with the results, make your
                                profile public.
                            </li>
                        </ol>
                    </div>
                ),
                buttonLabel: 'CLOSE'
            },
            labels: {
                submit: 'Save Google Scholar ID',
                cancel: 'Cancel',
                googleScholarIdField: {
                    floatingLabelText: 'Google Scholar ID',
                    hintText: 'Enter your Google Scholar ID'
                }
            },
            add: {
                title: 'Add your Google Scholar identifier',
                description: (
                    <div>
                        <p>Creating your Google Scholar Citation profile will make sure that Google Scholar will easily and
                            accurately group all the citations of your works into one pool. A profile generally lists
                            your name, chosen keywords of research interest, generated citation metrics, and citations
                            (including links to citing articles).</p>
                        <p>In order to create a Google Scholar Citation profile, you need a Google Account.</p>
                        <p>For more information see the <a
                            href="http://guides.library.uq.edu.au/researcher-identifiers/google-scholar-citations-profile"
                            target="_blank">Google Scholar Citations help page.</a></p>
                    </div>
                )
            },
            edit: {
                title: 'Update your Google Scholar identifier',
                description: (
                    <div>
                        <p>Update your Google Scholar ID below.</p>
                        <p>For more information see the <a
                            href="http://guides.library.uq.edu.au/researcher-identifiers/google-scholar-citations-profile"
                            target="_blank">Google Scholar Citations help page.</a></p>
                    </div>
                )
            },
            errorAlert: {
                type: 'error_outline',
                title: 'Error',
                message: (message) => (`Error has occurred during request and request cannot be processed. ${message} Please contact eSpace administrators or try again later.`)
            },
            progressAlert: {
                type: 'info_outline',
                title: 'Saving',
                message: 'Request is being processed.',
                showLoader: true
            },
            successAlert: {
                type: 'done',
                title: 'Google Scholar ID updated',
                message: 'Your Google Scholar ID has been updated in your eSpace profile.',
                allowDismiss: true
            }
        },
        orcidLink: {
            title: 'Link ORCID ID to UQ eSpace',
            grantAccessConfirmation: {
                confirmationTitle: 'ORCID Grant Access',
                confirmationMessage: (
                    <div>
                        <p>
                            In order to proceed you will now be directed to ORCID.org website.
                        </p>
                        <p>
                            You will be redirected back after you have granted UQ access.
                        </p>
                    </div>
                ),
                cancelButtonLabel: 'Cancel',
                confirmButtonLabel: 'OK'
            },
            help: {
                title: 'About ORCID',
                text: (
                    <div>
                        <p>
                            ORCID (Open Researcher Contributor ID) is an open, non-profit, community-based effort
                            endeavouring to provide a registry of unique researcher identifiers and a transparent method
                            of linking research activities and outputs to these identifiers.
                        </p>
                        <p>
                            An ORCID iD (often referred to as an ORCID) provides a persistent digital identifier that
                            distinguishes you from every other researcher and, through integration in key research
                            workflows such as manuscript and grant submission, supports automated linkages between you
                            and your professional activities ensuring that your work is recognised.
                        </p>
                        <p>
                            ORCID records hold only non-sensitive information such as name, email, organisation and
                            research activities. Plus, you can control who sees information in your ORCID iD via
                            <a href="http://support.orcid.org/knowledgebase/articles/124518-orcid-privacy-settings" target="_blank">privacy tools</a>.
                        </p>
                        <p>
                            Your ORCID iD will belong to you throughout your scholarly career as a persistent identifier
                            to distinguish you from other researchers ensuring you receive consistent and reliable
                            attribution of your work.
                        </p>
                        <h3>Adding information to your profile</h3>
                        <p>
                            Import your research outputs from your Scopus Author Identifier and ResearcherID – you can do
                            this on the ORCID site with the Search and Link tool under Add works. For more information
                            <a href="http://support.orcid.org/knowledgebase/articles/188278-link-works-website-user" target="_blank">click here</a>.
                        </p>
                        <p>
                            You can also import works from your Google Scholar to your ORCID iD. <a href="http://support.orcid.org/knowledgebase/articles/390530-import-works-from-bibtex-files-website-user" target="_blank">Click here</a> for information
                        </p>
                        <p>
                            There are many other types of work that you may add to your ORCID including artistic
                            performances, stand-alone websites, licenses and datasets. For a full list of works that can
                            be added, <a href="http://members.orcid.org/api/supported-work-types" target="_blank">click here</a>.
                        </p>
                        <p>
                            More information about how to add details such as your employment, education, awards and
                            funding can be found <a href="http://support.orcid.org/knowledgebase/topics/32827-website-user" target="_blank">here</a>.
                        </p>
                        <h3>Peer review acknowledgement in ORCID</h3>
                        <p>Your ORCID record can acknowledge peer review assignments that you undertake.</p>
                        <p>Simply provide your ORCID iD when accepting a peer review assignment and upon completion the
                            organisation* you have done the peer review for will post an acknowledgement of this
                            activity to your ORCID record, if you have granted this permission.</p>
                        <p><em>* The organisation needs to be participating in the ORCID peer review program.</em></p>
                        <h3>Do you have more than one ORCID iD?</h3>
                        <p>If you have more than one ORCID, the <a href="http://about.orcid.org/help/contact-us" target="_blank">ORCID Support team</a> can help with
                            marking one ORCID iD as the primary identifier and deprecate the other ORCID iDs.</p>
                        <p>Because ORCID identifiers are designed to be persistent, obsolete iDs will be deprecated, not
                            deleted. The record associated with a deprecated iD will contain a pointer to the primary
                            record</p>
                    </div>
                ),
                buttonLabel: 'CLOSE'
            },
            linkOrcid: {
                title: 'I already have an ORCID iD',
                description: 'This option enables you to link your existing ORCID iD to UQ.',
                labels: {
                    submit: 'Link your existing ORCID iD'
                }
            },
            createOrcid: {
                title: 'I need an ORCID iD',
                description: (
                    <React.Fragment>
                        <p>This option enables you to create a new ORCID iD and link it with UQ.</p>
                        <p>Use this option if you are unsure if you already have an ORCID iD. It will detect matches to
                            your name and email from the ORCID registry and prompt you to log in to avoid creating a new
                            ORCID iD.</p>
                    </React.Fragment>
                ),
                labels: {
                    submit: 'Create a new ORCID iD',
                }
            },
            errorAlert: {
                type: 'error_outline',
                title: 'Error',
                message: (message) => (`Error has occurred during request and request cannot be processed. ${message} Please contact eSpace administrators or try again later.`),
                orcidStateError: 'Invalid authorisation state response from ORCID. '
            },
            successAlert: {
                type: 'done',
                title: 'ORCID linked',
                message: 'Your ORCID has been linked to your eSpace profile. Works from Web of Science, Scopus PubMed and CrossRef will be synced to your eSpace profile within the next 7 days.',
                allowDismiss: true
            },
            progressAlert: {
                type: 'info_outline',
                title: 'Linking ORCID',
                message: 'Request is being processed.',
                showLoader: true
            }
        },
        unpublished: {
            title: 'Unpublished buffer'
        },
        incompletePublications: {
            pageTitle: 'My incomplete works',
            recordCount: 'Displaying works [recordsFrom] to [recordsTo] of [recordsTotal] total works. ',
            loadingMessage: 'Searching for incomplete works',
            noResultsFound: {
                title: 'No incomplete works found',
                text: (
                    <div>
                        <p>No incomplete works were found for you to rectify.</p>
                    </div>
                ),
            },
            completeRecordButton: 'Complete work',
            facetsFilter: {
                ...locale.components.facetsFilter,
                excludeFacetsList: ['Author'],
                renameFacetsList: {}
            }
        },
        incompletePublication: {
            title: 'Complete my work',
            help: {
                title: 'Add more information to an existing NTRO',
                text: (<div>For help, click <a href="https://guides.library.uq.edu.au/for-researchers/uqespace-publications-datasets/add-missing-ntro-information" target="_blank">here</a>.</div>),
                buttonLabel: 'CLOSE'
            },
            submitButtonLabel: 'Complete work',
            cancelButtonLabel: 'Cancel and return to my incomplete works list',
            fields: {
                notes: {
                    title: 'Notes',
                    label: 'Notes for this work',
                    placeholder: 'Add any other notes or comments about this work to send to the eSpace team.',
                },
                grants: {
                    title: 'Grant information',
                },
                authors: {
                    ...locale.components.authors,
                    description: (
                        <span>For each author marked with a <span style={{color: 'red', weight: 'bold'}}>red</span> prompt, select the author name at Step 1, add the affiliation information as at time of publication at Step 2, then click <b>UPDATE AUTHOR</b>.</span>
                    ),
                    field: {
                        ...locale.components.authors.field,
                        form: {
                            locale: {
                                ...locale.components.authors.field.form.locale,
                                descriptionStep1: (<div>
                                    <span className="authorSteps" key="step-2">Step 2 of 2</span> - <b>Update the affiliation information</b>.
                                </div>),
                                addButton: 'Update author'
                            }
                        },
                        header: {
                            ...locale.components.authors.field.header,
                            locale: {
                                ...locale.components.authors.field.header.locale,
                                descriptionStep2: (<div>
                                    <span className="authorSteps" key="step-1">Step 1 of 2</span> - <b>Select an author</b>.
                                </div>)
                            }
                        },
                        row: {
                            ...locale.components.authors.field.row,
                            locale: {
                                ...locale.components.authors.field.row.locale,
                                selectHint: 'Select this author ([name]) to update their affiliation data.',
                                requiredLabel: 'This author\'s data is incomplete.'
                            }
                        }
                    },
                },
                fileUpload: {
                    title: 'Upload files',
                    locale: {
                        instructions: '',
                        accessTermsAndConditions: 'I understand that the files indicated above as open access will be submitted as open access and will be made publicly available immediately or will be made available on the indicated embargo date.  All other files submitted will be accessible by UQ eSpace administrators.',
                        validation: {
                            ['notFiles']: 'Invalid files ([fileNames])',
                            ['invalidFileNames']: 'File(s) ([fileNames]) have invalid file name',
                            ['tooBigFiles']: 'File(s) ([fileNames]) exceed maximum allowed upload file size',
                            ['tooManyFiles']: 'Maximum number of files ([maxNumberOfFiles]) has been exceeded. File(s) ([fileNames]) will not be uploaded',
                            ['duplicateFiles']: 'File(s) ([fileNames]) are duplicates and have been ignored'
                        },
                        successTitle: 'Success',
                        successMessage: 'Successfully added [numberOfFiles] file(s) to upload queue.',
                        errorTitle: 'Upload Errors',
                        fileUploadRestrictionHeading: 'File upload restrictions',
                        fileUploadRestrictions: (
                            <div>
                                Maximum file size is 8GB. <br/>
                                PDF files must be saved using the following naming structure <b>&lt;student number&gt;_&lt;degree type&gt;_&lt;document name&gt;.pdf</b>.
                                Document name could be thesis, abstract, and etc.
                                For example:
                                <ul>
                                    <li>s1234567_phd_thesis.pdf</li>
                                    <li>s1234567_phd_abstract.pdf</li>
                                </ul>
                                Supplementary audio files are to be in MP 3 format. <br />
                                Supplementary video files are to be in WMV or AVI format. <br />
                            </div>
                        ),
                        fileUploadInstruction: (
                            <p>Click here to select files, or drag files into this area to upload</p>
                        ),
                    },
                    text: (
                        <div>
                            <span className="requiredField"><label>&nbsp;</label></span>
                        </div>
                    ),
                },
            },
            successWorkflowConfirmation: {
                confirmationTitle: 'Your work has been updated',
                fileFailConfirmationAlert: {
                    title: 'UPLOAD FAILED',
                    message: 'File upload and/or notes post failed',
                    type: 'warning'
                },
                cancelButtonLabel: 'Complete another work',
                confirmButtonLabel: 'Go to my dashboard'
            },
            prompt: {
                title: 'Missing data',
                message: 'follow the red prompts to add missing information. You can also provide additional grant details or include notes to the eSpace team.',
                type: 'info_outline'
            },
            progressAlert: {
                type: 'info_outline',
                title: 'Saving',
                message: 'Updating work is in progress.',
                showLoader: true
            },
            successAlert: {
                type: 'done',
                title: 'Success',
                message: 'New information has been saved successfully.'
            },
        }
    }
};
