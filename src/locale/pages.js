/* eslint-disable max-len */
import React from 'react';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import OpenInNew from '@mui/icons-material/OpenInNew';

import locale from 'locale/components';
import globalLocale from './global';

import { pathConfig } from 'config/pathConfig';
import {
    DOI_CROSSREF_PREFIX,
    DOI_DATACITE_PREFIX,
    PUBLICATION_TYPE_DATA_COLLECTION,
    PUBLICATION_TYPE_INSTRUMENT,
} from 'config/general';
/*

NOTE:
- text can be either plain text, eg text: 'Some text to display' or
- text can be formatted HTML text, eg
    text: (<div>Click here to search google: <a href='google.com'>search google</a></div>)
IMPORTANT: if currently text contains placeholders, eg any characters in square brackets,
eg [noOfResults] it cannot be formatted with HTML tags’

- help objects have the following shape:
help: {
    title: 'About these metrics',
    text: (<div></div>),
    buttonLabel: 'CLOSE'
}
- text can be plain or formatted HTML component with links/tags/etc
- if help is not required, delete help: {} fully (including closing '},')

[LS 31-3-22] Inlined external link styles because the ExternalLink component would not compile in this context.
As the contact details changes are only temporary I think this is an ok (not great) approach to display the external link icon.

*/
/* eslint-disable max-len */
export default {
    pages: {
        index: {
            title: 'eSpace',
        },
        about: {
            children: (
                <React.Fragment>
                    <StandardCard noHeader>
                        <h3>General Enquiries</h3>
                        <p>
                            For assistance or technical issues please email:{' '}
                            <a href="mailto:espace@library.uq.edu.au">espace@library.uq.edu.au</a>
                            <br />
                        </p>
                        <p>
                            You can also view our{' '}
                            <a
                                href="https://guides.library.uq.edu.au/for-researchers/uqespace-publications-datasets"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="externalLink"
                                title={
                                    globalLocale.global.linkWillOpenInNewWindow.replace(
                                        '[destination]',
                                        'https://guides.library.uq.edu.au/for-researchers/uqespace-publications-datasets',
                                    ) || undefined
                                }
                                tabIndex={0}
                            >
                                <OpenInNew className="externalLinkIcon" /> online guide
                            </a>
                            .
                        </p>
                        <h3>About UQ eSpace</h3>
                        The University of Queensland's institutional repository, UQ eSpace, aims to create global
                        visibility and accessibility of UQ’s scholarly research by:
                        <ul>
                            <li>Enhancing discovery of UQ research via search engines such as Google and Trove</li>
                            <li>
                                Allowing researchers to deposit scholarly works, datasets and open access materials and
                                to view associated metrics
                            </li>
                            <li>
                                Maintaining a complete and accurate collection of all UQ scholarly works and data sets
                                that feeds into central UQ systems including UQ Researchers and the Academic Portal
                            </li>
                            <li>
                                Enabling government reporting such as Australian Research Council’s Excellence in
                                Research for Australia and the Engagement and Impact Assessment
                            </li>
                            <li>Supporting the deposit of open access works to make UQ research globally accessible</li>
                            <li>
                                Preserving and making digitised materials accessible to the world including HDR theses,
                                photographs, audio materials, videos, manuscripts and other original works.
                            </li>
                        </ul>
                        <p>
                            You can also read the{' '}
                            <a href="https://espace.library.uq.edu.au/view/UQ:847df85/UQ_eSpace_Scope_and_Policy.pdf">
                                UQ eSpace Scope and Policy
                            </a>
                            .
                        </p>
                        <h3>Cultural Institution (CI) Notices</h3>
                        <p>
                            The CI Notices are used by collecting institutions, data repositories and organisations who
                            engage in collaborative curation with Indigenous and other marginalised communities who have
                            been traditionally excluded from processes of documentation and record keeping. There are
                            two Notices that can be used in these contexts:
                        </p>
                        <div style={{ display: 'inline-block', clear: 'both' }}>
                            <img
                                style={{ display: 'block', float: 'left', padding: '0 10px 10px 0' }}
                                width={100}
                                src={locale.components.culturalNoticeOC.imagePath}
                                alt={locale.components.culturalNoticeOC.title}
                            />

                            <p style={{ marginLeft: 110, marginTop: 0 }}>
                                <strong>{locale.components.culturalNoticeOC.title}: </strong>
                                {locale.components.culturalNoticeOC.text}
                            </p>
                        </div>
                        <div style={{ display: 'inline-block', clear: 'both' }}>
                            <img
                                style={{ display: 'block', float: 'left', padding: '0 10px 10px 0' }}
                                width={100}
                                src={locale.components.culturalNoticeAI.imagePath}
                                alt={locale.components.culturalNoticeAI.title}
                            />

                            <p style={{ marginLeft: 110, marginTop: 0 }}>
                                <strong>{locale.components.culturalNoticeAI.title}: </strong>
                                {locale.components.culturalNoticeAI.text}
                            </p>
                        </div>
                    </StandardCard>
                </React.Fragment>
            ),
        },
        browse: {
            title: 'Browse eSpace',
            text: (
                <div>
                    <p>Welcome to The University of Queensland's institutional digital repository</p>
                    <p>Public browse is coming soon...</p>
                </div>
            ),
            help: {
                title: 'Browse eSpace help',
                text: (
                    <div>
                        <Typography component="h4" variant="h6">
                            Browse
                        </Typography>
                        <p>Latest articles....</p>
                        <Typography component="h4" variant="h6">
                            Browse collections
                        </Typography>
                        <p>Latest collections....</p>
                    </div>
                ),
                buttonLabel: 'CLOSE',
            },
        },
        pageNotFound: {
            title: 'Page not found',
            children: (
                <StandardCard>
                    <p>The requested page could not be found.</p>
                    <p>Sorry about that, but here's what you can do next:</p>
                    <ul>
                        <li>Try re-typing the address, checking for spelling, capitalisation and/or punctuation.</li>
                        <li>Start again at the home page.</li>
                        <li>
                            If you’re sure the page should be at this address, email us at webmaster@library.uq.edu.au.
                        </li>
                    </ul>
                </StandardCard>
            ),
        },
        workNotFound: {
            title: 'Work not found',
            message: (
                <div>
                    <p>The work you are attempting to access does not appear in our system.</p>
                    <p>
                        If you believe this is in error, please{' '}
                        <a href="https://guides.library.uq.edu.au/for-researchers/uqespace-publications-datasets/contact-us">
                            contact the eSpace team.
                        </a>
                    </p>
                </div>
            ),
        },
        authenticationRequired: {
            title: 'Authentication required',
            children: (
                <StandardCard>
                    <p>The requested page is available to authenticated users only.</p>
                    <p>Please login to continue</p>
                </StandardCard>
            ),
        },
        permissionDenied: {
            title: 'Permissions denied',
            children: (
                <StandardCard>
                    <p>The requested page is available to authorised users only.</p>
                </StandardCard>
            ),
        },
        permissionDeniedOrNotFound: {
            title: 'Permissions denied or file not found',
            children: (
                <StandardCard>
                    <p>The requested file could not be found or is available to authorised users only.</p>
                </StandardCard>
            ),
        },
        thesisSubmissionDenied: {
            title: 'Thesis deposit access denied',
            children: (
                <StandardCard>
                    <p>Your account does not have rights for thesis deposit workflow.</p>
                    <p>
                        For depositing your thesis you must login with your <b>student username</b> (you may have logged
                        into eSpace with your staff username).
                    </p>
                    <p>Please logout and login with the correct user account.</p>
                </StandardCard>
            ),
        },
        adminDashboard: {
            loading: 'Loading admin dashboard',
            title: 'Admin dashboard',
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
                    countTitle: 'eSpace works from',
                },
                dashboardAuthorAvatar: {
                    ariaPrefix: 'Photograph of ',
                },
                dashboardResearcherIds: {
                    researcherIsLinked: 'Your [resource] ID is [id] - Click to review',
                    researcherIsNotLinked: 'You are not linked to [resource] - Click for more information',
                    orcidUrlPrefix: process.env.ORCID_URL ? `${process.env.ORCID_URL}/` : 'https://orcid.org/',
                    orcidLinkPrefix: ' orcid.org/',
                    orcidlinkLabel: 'Click to visit your ORCID profile',
                    titles: {
                        scopus: 'Scopus',
                        researcher: 'Researcher (ISI)',
                        google_scholar: 'Google Scholar',
                        orcid: 'ORCID',
                    },
                    links: {
                        linkedUrl: {
                            scopus: 'http://www.scopus.com/authid/detail.url?authorId=',
                            researcher: 'https://www.webofscience.com/wos/author/rid/',
                            google_scholar: 'https://scholar.google.com.au/citations?user=',
                            orcid: 'https://orcid.org/',
                        },
                        notLinkedUrl: {
                            scopus:
                                'http://guides.library.uq.edu.au/for-researchers/researcher-identifier/scopus-authorid',
                            researcher:
                                'http://guides.library.uq.edu.au/for-researchers/researcher-identifier/researcherid',
                            // google scholar is linked via ORCID
                            google_scholar: pathConfig.authorIdentifiers.orcid.link,
                            orcid: pathConfig.authorIdentifiers.orcid.link,
                        },
                    },
                },
                dashboardOrcidSync: {
                    badgeTooltip: 'Information about uploading your eSpace works to ORCID',
                    helpDrawer: {
                        messages: {
                            // Persistent help message
                            activated: 'Weekly automatic upload of your works to ORCID is activated.',
                            // Statuses
                            done:
                                'There is no pending manual upload of your works to ORCID. You can trigger an immediate upload by clicking on the button below.',
                            error:
                                'There has been an error while processing a manual upload of your eSpace works to ORCID. Please try again in a few minutes or contact espace@library.uq.edu.au if you continue to experience difficulties.',
                            inProgress: 'A manual upload of your eSpace works to ORCID is in progress.',
                            // Date of last upload
                            lastUpload: 'The last upload was on [syncTime].',
                            noPrevious: 'There are no previous uploads of your eSpace works to ORCID.',
                        },
                        title: 'ORCID Upload',
                        type: 'info',
                        actionButtonLabel: 'Upload works to ORCID',
                        alternateActionButtonLabel: 'View works in ORCID',
                    },
                },
            },
            myLatestPublications: {
                title: 'My works',
            },
            myTrendingPublications: {
                title: 'My trending works',
            },
            possiblePublicationsLure: {
                title: 'Claim now!',
                message: 'We have found [count] work(s) that could possibly be your works.',
                type: 'info_outline',
                actionButtonLabel: 'Claim your works now',
            },
            nothingToClaimLure: {
                title: 'Add your work to eSpace',
                message: 'We found nothing new for you to claim, but you may add a work any time.',
                type: 'info_outline',
                actionButtonLabel: 'Add a missing work',
            },
            publicationsByYearChart: {
                title: 'eSpace works per year',
                yAxisTitle: 'Total works',
            },
            publicationTypesCountChart: {
                title: 'Work types overview',
            },
            incompleteRecordLure: {
                title: 'NTRO Data Required',
                message: 'We have found [count] work(s) that require[verbEnding] more information.',
                type: 'warning',
                actionButtonLabel: 'View and Complete',
            },
        },
        myResearch: {
            pageTitle: 'My works',
            recordCount: 'Displaying works [recordsFrom] to [recordsTo] of [recordsTotal] total works. ',
            bulkExportSizeMessage: 'The export will have the first [bulkExportSize] works.',
            text: (
                <span>
                    Add to this list by <a href={pathConfig.records.possible}>claiming a work</a> or{' '}
                    <a href={pathConfig.records.add.find}>adding a missing work</a>.
                </span>
            ),
            loadingMessage: 'Searching for your works',
            loadingPagingMessage: 'Retrieving your works',
            exportPublicationsLoadingMessage: 'Exporting your works',
            noResultsFound: {
                title: 'No works found',
                text: (
                    <div>
                        We were unable to find any results. You may be able to{' '}
                        <a href={pathConfig.records.possible}>claim works we think may be yours</a> or{' '}
                        <a href={pathConfig.records.add.find}>add a missing publication</a>
                    </div>
                ),
            },
            facetsFilter: { ...locale.components.facetsFilter },
        },
        myDatasets: {
            pageTitle: 'My research data',
            recordCount: 'Displaying works [recordsFrom] to [recordsTo] of [recordsTotal] total works. ',
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
                        We were unable to find any results. You may be able to{' '}
                        <a href={pathConfig.dataset.add}>add a missing dataset</a>.
                    </div>
                ),
            },
            facetsFilter: {
                ...locale.components.facetsFilter,
                excludeFacetsList: ['Scopus document type', 'Subtype', 'Year published', 'Display type'],
                renameFacetsList: {},
            },
        },
        addDataset: {
            pageTitle: 'Add data collection',
            depositAgreement: 'Lorem ipsum',
            successWorkflowConfirmation: {
                confirmationTitle: 'Your dataset has been submitted',
                datasetSuccessConfirmationMessage: (
                    <p>
                        Your dataset has been saved.
                        <br />
                        <br />
                        Your item will be published immediately and an UQ eSpace Research Outputs Officer will review
                        the work.
                    </p>
                ),
                fileFailConfirmationAlert: {
                    title: 'File upload and/or notes post failed',
                    message: 'lorem ipsum',
                    type: 'warning',
                    alertId: 'alert-warning',
                },
                cancelButtonLabel: 'Add another missing dataset',
                confirmButtonLabel: 'Go to my research data',
            },
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
                //     title: 'No matching works found',
                //     text: 'Why search didn\'t return any items....',
                //     buttonLabel: 'CLOSE'
                // }
            },
            searchResults: {
                // title: 'Possibly your publications',
                text:
                    '[resultsCount] out of [totalCount] potential match(es) displayed. Select any item to claim it as your work.',
                // help: {
                //     title: 'Possibly your publications',
                //     text: 'Help about ....',
                //     buttonLabel: 'CLOSE'
                // },
                hide: 'Not mine',
                claim: 'Claim this work',
                inProgress: 'In progress',
            },
            hidePublicationConfirmation: {
                confirmationTitle: 'Hide work',
                confirmationMessage: 'Are you sure you want to hide selected possible work from this view?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes',
            },
            hidePublicationFailedAlert: {
                title: 'Error',
                message: message =>
                    `Error has occurred during request and request cannot be processed. ${message} Please contact eSpace administrators or try again later.`,
                type: 'error',
                alertId: 'alert-error',
            },
            hideAllPublicationsConfirmation: {
                confirmationTitle: 'Hide works',
                confirmationMessage: 'Are you sure you want to hide all possible works from this view?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes',
            },
            facetsFilter: { ...locale.components.facetsFilter },
        },
        addRecord: {
            title: 'Add a missing work to eSpace',
            stepper: [{ label: 'Search for your work' }, { label: 'Search results' }, { label: 'Add your work' }],
            step1: {
                title: 'Search for your works',
                text:
                    'Enter either the DOI (e.g. 10.1163/9789004326828), Pubmed Id (e.g. 28131963) or the title of work. This will allow us to check whether the work is already in eSpace or is available from another source.',
                // help: {
                //     title: 'Search for your publication',
                //     text: 'Help about search....',
                //     buttonLabel: 'CLOSE'
                // },
                fieldLabels: {
                    search: 'Enter DOI, Pubmed Id or Title',
                },
                submit: 'Search',
                skip: 'Skip search',
            },
            step2: {
                noResultsFound: {
                    title: 'No matching works found',
                    text:
                        'We were unable to match any results to your search criteria. Please search again or create a new eSpace work.',
                    // help: {
                    //     title: 'No matching works found',
                    //     text: 'Why search didn\'t return any items....',
                    //     buttonLabel: 'CLOSE'
                    // }
                },
                searchResults: {
                    title: 'Possible matches found',
                    resultsText: 'Top [noOfResults] potential match(es) displayed for "[searchQuery]".',
                    text: 'Claim a matching work below, refine your search or create a new eSpace work.',
                    // help: {
                    //     title: 'Possible matches found',
                    //     text: 'Why search displays these items....',
                    //     buttonLabel: 'CLOSE'
                    // },
                    searchDashboard: {
                        title: 'Repository search',
                        recordSuffix: ' work(s)',
                        ariaCircularProgressLabelSuffix: 'loading',
                        repositories: [
                            {
                                id: 'espace',
                                title: 'eSpace',
                            },
                            {
                                id: 'wos',
                                title: 'Web of science',
                            },
                            {
                                id: 'scopus',
                                title: 'Scopus',
                            },
                            {
                                id: 'pubmed',
                                title: 'PubMed',
                            },
                            {
                                id: 'crossref',
                                title: 'Crossref',
                            },
                        ],
                    },
                },
                loadingMessage: 'Searching for works',
                cancel: 'Abandon and search again',
                submit: 'Create a new eSpace work',
                claim: 'Claim this work',
                unclaimable: 'All authors have been assigned',
            },
            step3: {
                // all text values come from forms.PublicationForm
            },
            successWorkflowConfirmation: {
                confirmationTitle: 'Your work has been submitted',
                recordSuccessConfirmationMessage: (
                    <p>
                        Your work has been saved.
                        <br />
                        <br />
                        Your work will be published immediately and a UQ eSpace Research Outputs Officer will review the
                        work.
                    </p>
                ),
                fileFailConfirmationAlert: {
                    title: 'File upload and/or notes post failed',
                    message: 'Retry via "Fix work" screen or contact eSpace administrators.',
                    type: 'warning',
                    alertId: 'alert-warning',
                },
                cancelButtonLabel: 'Add another missing work',
                confirmButtonLabel: 'Go to my works',
                alternateActionButtonLabel: 'Fix work',
            },
        },
        fixRecord: {
            loadingMessage: 'Loading work',
            title: 'Request a correction, add more information or upload files',
            subTitle: 'Work to be amended',
            fieldLabels: {
                action: 'Select an action',
            },
            actionsOptions: [
                {
                    action: 'fix',
                    title:
                        'I am the author/editor/contributor of this work - I would like to add information, make a correction, or upload files',
                },
                {
                    action: 'unclaim',
                    title:
                        'I am not the author/editor/contributor of this work - I would like this work removed from my profile',
                },
            ],
            cancel: 'Cancel',
            submit: 'Submit',
        },
        viewRecord: {
            loadingMessage: 'Loading work',
            thumbnailTitle: 'Click to open a preview of [image]',
            deletedAlert: {
                type: 'info_outline',
                title: '',
                message: record => (
                    <>
                        {record.rek_display_type === PUBLICATION_TYPE_DATA_COLLECTION &&
                        record.fez_record_search_key_new_doi?.rek_new_doi ? (
                            <>
                                This Data Collection has been deleted and substituted by{' '}
                                <a
                                    href={`https://doi.org/${record.fez_record_search_key_new_doi?.rek_new_doi}`}
                                    target="_blank"
                                >
                                    another version
                                </a>
                                .
                            </>
                        ) : (
                            'This work has been deleted.'
                        )}
                        {record.fez_record_search_key_deletion_notes?.rek_deletion_notes && (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: record.fez_record_search_key_deletion_notes?.rek_deletion_notes,
                                }}
                            />
                        )}
                    </>
                ),
                alertId: 'alert-info',
            },
            version: {
                title: 'View Version',
                alert: {
                    version: {
                        type: 'info_outline',
                        title: '',
                        message: (record, isDeletedVersion = false) => (
                            <>
                                You are looking at version <b>{record.rek_version}</b> of{' '}
                                {isDeletedVersion ? <b>deleted</b> : ''} record <b>{record.rek_pid}</b>
                            </>
                        ),
                        alertId: 'alert-info',
                    },
                    warning: {
                        type: 'warning',
                        title: '',
                        message:
                            "Note: reference values (lookups) might not be accurate as we don't keep history of these, only for the record's data.",
                        alertId: 'alert-warning',
                    },
                },
            },
            adminRecordData: {
                drawer: {
                    title: 'Record Data',
                    nameIfAuthorUnavailable: 'This work',
                    sectionTitles: {
                        notes: 'Notes',
                        authorAffiliations: 'Author Affiliations',
                        wosId: 'WoS ID',
                        wosDocType: 'WoS Doc Type',
                        scopusId: 'Scopus ID',
                        scopusDocType: 'Scopus Doc Type',
                        pubmedId: 'Pubmed ID',
                        pubmedCentralId: 'Pubmed Central ID',
                        pubmedDocType: 'Pubmed Doc Type',
                    },
                },
                clipboard: {
                    unavailable: 'Clipboard unavailable',
                    copied: 'Copied to clipboard',
                },
            },
        },
        searchRecords: {
            title: 'eSpace search',
            loadingMessage: 'Searching for works',
            recordCount: 'Displaying works [recordsFrom] to [recordsTo] of [recordsTotal] total works. ',
            bulkExportSizeMessage: 'The export will have the first [bulkExportSize] works.',
            bulkExport: {
                buttonText: 'Bulk Export',
                sizeMessage: 'Each export will have [bulkExportSize] works. Use the links below to queue exports.',
                successMessage:
                    'Bulk export requests have been queued. When the requests have been processed, ' +
                    'you will receive an email for each request with the exported file as an attachment.',
                rowLabel: 'Export works [start] to [end]',
            },
            loadingPagingMessage: 'Searching for works',
            exportPublicationsLoadingMessage: 'Exporting search results',
            noResultsFound: {
                title: 'No works found',
                text: <div>We were unable to find any results.</div>,
                standardCardId: 'search-records-no-results',
            },
            facetsFilter: {
                ...locale.components.facetsFilter,
                excludeFacetsList: ['Scopus document type', 'Genre', 'Year published', 'Published year range'],
            },
            errorAlert: {
                type: 'error_outline',
                title: 'Error',
                message: message => message,
                alertId: 'alert-error',
            },
        },
        searchJournals: {
            title: 'Journal search',
            loadingMessage: 'Searching for journals',
            errorAlert: {
                type: 'error_outline',
                title: 'Error',
                message: message => message,
                alertId: 'alert-error',
            },
        },
        collection: {
            title: 'Add a missing collection',
            cancelWorkflowConfirmation: {
                confirmationTitle: 'Cancel collection creation',
                confirmationMessage: 'Are you sure you want to cancel creating this collection?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes',
            },
        },
        community: {
            title: 'Add a missing community',
            cancelWorkflowConfirmation: {
                confirmationTitle: 'Cancel community creation',
                confirmationMessage: 'Are you sure you want to cancel creating this community?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes',
            },
        },
        communityList: {
            title: 'List of Communities',
        },
        collectionList: {
            title: 'List of Collections',
        },
        masquerade: {
            title: 'Masquerade',
            help: {
                title: 'Masquerade',
                text: <p>Masquerade as another user...</p>,
                buttonLabel: 'CLOSE',
            },
            description: {
                readonly: (
                    <>
                        <strong>NOTE:</strong> As a read-only masquerader, you can view all parts of the profile, but
                        you are not able to make any changes to the account.
                    </>
                ),
                full: (
                    <>
                        <strong>WARNING!!</strong> When masquerading as a user, you will effectively become that user,
                        and changes you make will apply to the account!
                    </>
                ),
            },
            labels: {
                submit: 'Masquerade',
                hint: 'Enter a UQ staff or student username (eg. uqjsmith1 or s123456)',
            },
        },
        orcidLink: {
            title: 'Link ORCID ID to UQ eSpace',
            grantAccessConfirmation: {
                confirmationTitle: 'ORCID Grant Access',
                confirmationMessage: (
                    <div>
                        <p>In order to proceed you will now be directed to ORCID.org website.</p>
                        <p>You will be redirected back after you have granted UQ access.</p>
                    </div>
                ),
                cancelButtonLabel: 'Cancel',
                confirmButtonLabel: 'OK',
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
                            ORCID works hold only non-sensitive information such as name, email, organisation and
                            research activities. Plus, you can control who sees information in your ORCID iD via{' '}
                            <a
                                href="http://support.orcid.org/knowledgebase/articles/124518-orcid-privacy-settings"
                                target="_blank"
                            >
                                privacy tools
                            </a>
                            .
                        </p>
                        <p>
                            Your ORCID iD will belong to you throughout your scholarly career as a persistent identifier
                            to distinguish you from other researchers ensuring you receive consistent and reliable
                            attribution of your work.
                        </p>
                        <h3>Adding information to your profile</h3>
                        <p>
                            Import your research outputs from your Scopus Author Identifier and ResearcherID – you can
                            do this on the ORCID site with the Search and Link tool under Add works. For more
                            information{' '}
                            <a
                                href="http://support.orcid.org/knowledgebase/articles/188278-link-works-website-user"
                                target="_blank"
                            >
                                click here
                            </a>
                            .
                        </p>
                        <p>
                            You can also import works from your Google Scholar to your ORCID iD.{' '}
                            <a
                                href="http://support.orcid.org/knowledgebase/articles/390530-import-works-from-bibtex-files-website-user"
                                target="_blank"
                            >
                                Click here
                            </a>{' '}
                            for information
                        </p>
                        <p>
                            There are many other types of work that you may add to your ORCID including artistic
                            performances, stand-alone websites, licenses and datasets. For a full list of works that can
                            be added,{' '}
                            <a href="http://members.orcid.org/api/supported-work-types" target="_blank">
                                click here
                            </a>
                            .
                        </p>
                        <p>
                            More information about how to add details such as your employment, education, awards and
                            funding can be found{' '}
                            <a href="http://support.orcid.org/knowledgebase/topics/32827-website-user" target="_blank">
                                here
                            </a>
                            .
                        </p>
                        <h3>Peer review acknowledgement in ORCID</h3>
                        <p>Your ORCID work can acknowledge peer review assignments that you undertake.</p>
                        <p>
                            Simply provide your ORCID iD when accepting a peer review assignment and upon completion the
                            organisation* you have done the peer review for will post an acknowledgement of this
                            activity to your ORCID work, if you have granted this permission.
                        </p>
                        <p>
                            <em>* The organisation needs to be participating in the ORCID peer review program.</em>
                        </p>
                        <h3>Do you have more than one ORCID iD?</h3>
                        <p>
                            If you have more than one ORCID, the{' '}
                            <a href="http://about.orcid.org/help/contact-us" target="_blank">
                                ORCID Support team
                            </a>{' '}
                            can help with marking one ORCID iD as the primary identifier and deprecate the other ORCID
                            iDs.
                        </p>
                        <p>
                            Because ORCID identifiers are designed to be persistent, obsolete iDs will be deprecated,
                            not deleted. The work associated with a deprecated iD will contain a pointer to the primary
                            work
                        </p>
                    </div>
                ),
                buttonLabel: 'CLOSE',
            },
            linkOrcid: {
                title: 'I already have an ORCID iD',
                description: 'This option enables you to link your existing ORCID iD to UQ.',
                labels: {
                    submit: 'Link your existing ORCID iD',
                },
            },
            createOrcid: {
                title: 'I need an ORCID iD',
                description: (
                    <React.Fragment>
                        <p>This option enables you to create a new ORCID iD and link it with UQ.</p>
                        <p>
                            Use this option if you are unsure if you already have an ORCID iD. It will detect matches to
                            your name and email from the ORCID registry and prompt you to log in to avoid creating a new
                            ORCID iD.
                        </p>
                    </React.Fragment>
                ),
                labels: {
                    submit: 'Create a new ORCID iD',
                },
            },
            errorAlert: {
                type: 'error_outline',
                alertId: 'alert-error',
                title: 'Error',
                message: message =>
                    `Error has occurred during request and request cannot be processed. ${message} Please contact eSpace administrators or try again later.`,
                orcidStateError: 'Invalid authorisation state response from ORCID. ',
            },
            successAlert: {
                type: 'done',
                alertId: 'alert-done',
                title: 'ORCID linked',
                message:
                    'Your ORCID has been linked to your eSpace profile. Works from Web of Science, Scopus PubMed and Crossref will be synced to your eSpace profile within the next 7 days.',
                allowDismiss: true,
            },
            progressAlert: {
                type: 'info_outline',
                alertId: 'alert-info',
                title: 'Linking ORCID',
                message: 'Request is being processed.',
                showLoader: true,
            },
        },
        unpublished: {
            title: 'Unpublished buffer',
        },
        prototype: {
            title: 'Admin prototype',
        },
        favouriteSearch: {
            title: 'Favourite searches',
            loadingMessage: 'Loading list of favourite searches',
            aliasExistsAlert: {
                type: 'error',
                message: 'Alias "[alias]" has been taken',
                title: 'Alias check',
            },
        },
        doi: {
            loadingMessage: 'Loading work',
            pageTitle: ({ doi, displayTypeLookup, title, pid }) =>
                `${!!doi ? 'Update' : 'Create'} DOI for ${displayTypeLookup} - ${title}: ${pid}`,
            cardTitles: {
                doi: 'DOI',
                depositor: 'Depositor Information',
                work: 'Work details',
            },
            doiLabel: {
                hasDoi: 'DOI (Existing)',
                noDoi: 'DOI (Preview)',
            },
            doiTemplate: (pid, displayType) =>
                displayType === PUBLICATION_TYPE_DATA_COLLECTION || displayType === PUBLICATION_TYPE_INSTRUMENT
                    ? `${DOI_DATACITE_PREFIX}/${pid.slice(3)}`
                    : `${DOI_CROSSREF_PREFIX}/${pid.slice(3)}`,
            depositorNameTitle: 'Name',
            depositorEmailTitle: 'Email',
            alertMessages: {
                errorTitle: 'Error:',
                invalidOptionalField:
                    'Field [FIELDNAME] has an invalid value[REASON]; it will be omitted from submission.',
                fieldValidationDetail: {
                    edition: ', e.g. 3rd or 3rd edn instead of 3',
                },
                missingRequiredField: 'Required field [FIELDNAME] is either missing or invalid.',
                unsupportedMessage: 'Sorry, type [TYPE] is not currently supported.',
                uqCheckMessage: '[FIELDNAME] should contain "The University of Queensland".',
                uqIsNotPublisher: '[SUBJECT] does not appear to be have an UQ DOI',
                warningTitle: 'Please note:',
                wrongSubtype: 'Sorry, only the following subytypes are supported for [TYPE]: [SUBTYPES]',
                bookChapter: {
                    parent: {
                        missing: "Sorry, this book chapter doesn't seem to belong to a existing book",
                    },
                },
                rccDataset: 'RCC Datasets are not allowed.',
            },
            cancelButtonLabel: 'Cancel',
            confirmButtonLabel: hasDoi => (hasDoi ? 'Update DOI' : 'Create DOI'),
            alertProps: {
                progressAlert: {
                    type: 'info_outline',
                    title: 'Requesting',
                    message: 'Upload to Crossref is being queued.',
                    showLoader: true,
                },
                successAlert: {
                    type: 'done',
                    title: 'Success',
                    message: 'Upload to Crossref has been queued successfully.',
                },
                errorAlert: {
                    type: 'error_outline',
                    title: 'Error',
                    message:
                        'An error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
                },
            },
            successConfirmation: {
                confirmationTitle: 'Request successful',
                confirmationMessage:
                    'The request to create/update DOI has been submitted to Crossref. You will receive an email indicating whether the DOI is successfully generated.',
                confirmButtonLabel: 'View work',
            },
        },
        edit: {
            sections: {
                identifiers: {
                    title: 'Identifiers',
                },
                bibliographic: {
                    title: 'Bibliographic',
                },
                grants: {
                    title: 'Grants',
                },
                authors: {
                    title: 'Authors',
                },
                admin: {
                    title: 'Admin',
                },
                ntro: {
                    title: 'NTRO',
                },
                notes: {
                    title: 'Notes',
                },
                files: {
                    title: 'Files',
                },
                security: {
                    title: 'Security',
                },
                reason: {
                    title: 'Reason for Edit',
                },
                culturalInstitutionNotice: {
                    title: 'Cultural Institution (CI) Notice',
                },
                uqData: {
                    title: 'UQ eSpace',
                },
                doaj: {
                    title: 'Open Access (Directory of Open Access Journals - DOAJ)',
                },
                indexed: {
                    title: 'Indexed in',
                },
            },
            help: {
                tooltip: 'Learn about keyboard shortcuts',
                title: 'Keyboard shortcuts',
                text: (
                    <div>
                        <Typography component="h4" variant="h6">
                            Tab navigation
                        </Typography>
                        <p>
                            To navigate tabs while in tabbed mode, hold CTRL and SHIFT and use the LEFT and RIGHT arrow
                            keys.
                        </p>
                        <Typography component="h4" variant="h6">
                            Form style
                        </Typography>
                        <p>
                            To switch between tabbed or full form mode, hold CTRL and SHIFT and use the UP and DOWN
                            arrow keys.
                        </p>
                        <p>
                            Your preference is saved as a cookie on this browser and it will remember your preference.
                        </p>
                        <Typography component="h4" variant="h6">
                            Page zoom
                        </Typography>
                        <p>
                            Using <b>CTRL</b> & <b>+/-</b> will zoom the page in/out further for more screen real
                            estate.
                        </p>
                    </div>
                ),
                buttonLabel: 'Got it',
            },
            loadingMessage: 'Loading work',
            notSupportedMessage: 'Editing of [pubType] is not yet supported.',
            retractedMessage: 'This work has been retracted',
            community: {
                title: 'Edit community',
                loadingMessage: 'Loading community',
            },
            collection: {
                title: 'Edit collection',
                loadingMessage: 'Loading collection',
            },
            record: {
                title: 'Edit work',
                loadingMessage: 'Loading work',
            },
            successWorkflowConfirmation: {
                confirmationTitle: 'Work has been updated',
                confirmationMessage: 'Work has been updated',
                cancelButtonLabel: 'View updated work',
                confirmButtonLabel: 'Edit another work',
            },
            successAddWorkflowConfirmation: {
                confirmationTitle: 'Work has been added',
                confirmationMessage: 'Your new work has been added to eSpace.',
                cancelButtonLabel: 'View new work',
                confirmButtonLabel: 'Add another work',
            },
            successJobCreatedConfirmation: {
                confirmationTitle: 'Work is now updating',
                confirmationMessage:
                    'This work requires additional time to fully process.  You will receive a status update via email soon.',
                cancelButtonLabel: 'Return to view page',
                confirmButtonLabel: 'Edit another work',
            },
            alerts: {
                errorAlert: {
                    type: 'error_outline',
                    alertId: 'alert-error',
                    title: 'Error',
                    message: message =>
                        `Error has occurred during request and request cannot be processed. ${message} Please contact eSpace administrators or try again later.`,
                },
                successAlert: {
                    type: 'done',
                    alertId: 'alert-done',
                    title: 'Success',
                    message: 'Work has been saved successfully',
                    allowDismiss: true,
                },
                progressAlert: {
                    type: 'info_outline',
                    alertId: 'alert-info',
                    title: 'Saving',
                    message: 'Request is being processed.',
                    showLoader: true,
                },
                validationAlert: {
                    type: 'warning',
                    alertId: 'alert-warning',
                    title: 'Validation',
                    message: 'Form cannot be submitted until all fields are valid. Please review all input fields.',
                },
                lockedAlert: {
                    type: 'custom',
                    title: 'THIS WORK IS LOCKED',
                    message:
                        'This work is currently being edited by [name] ([username]). Make sure that you confirm with this user before ignoring the work lock as it may cause work overwrite issues.',
                    actionButtonLabel: 'IGNORE LOCK',
                    customIcon: <LockIcon id="locked-icon" className="icon" />,
                    customType: 'error',
                    alertId: 'alert-error',
                },
            },
            journal: {
                title: 'Edit journal',
                loadingMessage: 'Loading journal',
            },
        },
        deleteRecord: {
            loadingMessage: 'Loading work',
            title: isDeleted => (isDeleted ? 'Update deleted work' : 'Delete work'),
            subTitle: isDeleted => (isDeleted ? 'Work deleted' : 'Work to be deleted'),
            cancel: 'Cancel',
            submit: isDeleted => (isDeleted ? 'Update' : 'Delete'),
        },
        adminAdd: {
            title: 'Add a new work',
            step1: 'Identify your new work',
            buttonLabel: 'Create work',
            cancelLabel: 'Cancel',
            submitFailed: 'Failed to assign details to the administrator add form',
            formLabels: {
                ismemberof: {
                    floatingLabelText: 'Member of collections',
                    hintText: 'Begin typing to select and add work to a list of collection(s)',
                },
                rek_display_type: {
                    inputLabelText: 'Work type',
                    hintText: 'Select a Work type from the dropdown list',
                },
                rek_subtype: {
                    inputLabelText: 'Work subtype',
                    hintText: 'Select a work subtype from the dropdown list',
                },
                submit: 'Submit',
                cancel: 'Cancel',
            },
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
            publicationsList: {
                complete: 'Complete work',
            },
            facetsFilter: {
                ...locale.components.facetsFilter,
                excludeFacetsList: [...locale.components.facetsFilter.excludeFacetsList, 'Author'],
            },
        },
        incompletePublication: {
            title: 'Complete my work',
        },
        bulkUpdates: {
            title: 'Bulk updates',
            loadingMessage: 'Loading bulk updates',
        },
        editorialAppointments: {
            title: 'My editorial appointments',
            loadingMessage: 'Loading editorial appointments',
        },
        journal: {
            view: {
                title: 'Journal details',
                pageId: 'journal-view',
                loadingMessage: 'Loading journal data',
                loadFailureAlert: {
                    alertId: 'alert-error-journal-load',
                    title: 'Loading failed',
                    message: 'Unable to load journal details',
                    type: 'error_outline',
                },
                favouriteTooltip: {
                    isFavourite: 'Remove journal from your favourites',
                    isNotFavourite: 'Add journal to your favourites',
                },
                errorAlert: {
                    type: 'error_outline',
                    title: 'Error',
                    message: message => message,
                    alertId: 'alert-error',
                },
                advisoryStatement: {
                    title: 'Advisory statement',
                },
            },
        },
        authors: {
            title: 'Manage authors',
            loadingMessage: 'Loading authors',
        },
        users: {
            title: 'Manage users',
            loadingMessage: 'Loading users',
        },
        controlledVocabularies: {
            title: 'Controlled Vocabularies',
        },
    },
};
