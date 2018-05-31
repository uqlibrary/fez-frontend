import {locale} from 'locale';
import {default as formLocale} from 'locale/publicationForm';
import param from 'can-param';
import {defaultSearchParams} from 'config/general';
import {openAccessIds} from 'config/openAccess';

const fullPath = process.env.BRANCH === 'production' ? 'https://espace.library.uq.edu.au' : 'https://fez-staging.library.uq.edu.au';
export const pidRegExp = 'UQ:[a-z0-9]+';

const getSearchUrl = ({searchQuery, activeFacets = {}}) => (
    `${fullPath}/records/search?${param({
        ...defaultSearchParams,
        searchQueryParams: {
            all: !!searchQuery && searchQuery || ''
        },
        activeFacets: {
            ...defaultSearchParams.activeFacets,
            ...activeFacets
        }
    })}`
);

export const pathConfig = {
    index: '/',
    dashboard: '/dashboard',
    browse: '/browse',
    contact: '/contact',
    hdrSubmission: '/rhdsubmission',
    sbsSubmission: '/sbslodge_new',
    records: {
        mine: '/records/mine',
        possible: '/records/possible',
        claim: '/records/claim',
        search: '/records/search',
        view: (pid, includeFullPath = false) => (`${includeFullPath ? fullPath : ''}/records/${pid}`),
        fix: (pid) => (`/records/${pid}/fix`),
        add: {
            find: '/records/add/find',
            results: '/records/add/results',
            new: '/records/add/new',
        }
    },
    dataset: {
        mine: '/data-collections/mine',
        add: `${fullPath}/workflow/new.php?xdis_id=371&pid=UQ:289097&cat=select_workflow&wft_id=315`,
    },
    collection: {
        view: (pid) => (`${fullPath}/collection/${pid}`),
    },
    // TODO: update how we get files after security is implemented in fez file api
    // (this is used in metadata to reflect legacy file urls for citation_pdf_url - Google Scholar)
    file: {
        url: (pid, fileName) => (`https://espace.library.uq.edu.au/view/${pid}/${fileName}`)
    },
    // TODO: update links when we have list pages
    list: {
        author: (author) => getSearchUrl({searchQuery: author}),
        authorId: (authorId) => getSearchUrl({
            activeFacets: {
                filters: {
                    'Author': authorId
                }
            }
        }),
        subject: (subjectId) => (`${fullPath}/list/subject/${subjectId}`),
        herdcStatus: (herdcStatus) => getSearchUrl({searchQuery: herdcStatus}),
        keyword: (keyword) => getSearchUrl({searchQuery: keyword}),
        institutionalStatus: (institutionalStatus) => getSearchUrl({searchQuery: institutionalStatus}),
        openAccessStatus: (openAccessStatusId) => getSearchUrl({
            activeFacets: {
                showOpenAccessOnly: openAccessIds.indexOf(openAccessStatusId) >= 0
            }
        }),
        journalName: (journalName) => getSearchUrl({
            searchQuery: journalName,
            activeFacets: {
                filters: {
                    'Journal name': journalName
                }
            }
        }),
        publisher: (publisher) => getSearchUrl({searchQuery: publisher}),
        license: (license) => getSearchUrl({searchQuery: license}),
        accessCondition: (accessCondition) => (`${fullPath}/list/?cat=quick_filter&search_keys[core_95]=${accessCondition}`),
        collectionType: (collectionType) => (`${fullPath}/list/?cat=quick_filter&search_keys[core_92]=${collectionType}`),
        orgUnitName: (orgUnitName) => getSearchUrl({searchQuery: orgUnitName}),
        series: (series) => getSearchUrl({searchQuery: series}),
        bookTitle: (bookTitle) => getSearchUrl({searchQuery: bookTitle}),
        jobNumber: (jobNumber) => getSearchUrl({searchQuery: jobNumber}),
        conferenceName: (conferenceName) => getSearchUrl({searchQuery: conferenceName}),
        proceedingsTitle: (proceedingsTitle) => getSearchUrl({searchQuery: proceedingsTitle}),
    },
    admin: {
        masquerade: '/admin/masquerade'
    },
    authorIdentifiers: {
        orcid: {
            link: '/author-identifiers/orcid/link',
            absoluteLink: `${window.location.origin}${process.env.BRANCH === 'development' ? window.location.pathname : ''}${!!window.location.hash ? '#' : ''}/author-identifiers/orcid/link`
            // unlink: '/author-identifiers/orcid/link'
        },
        googleScholar: {
            link: '/author-identifiers/google-scholar/link',
            // unlink: '/author-identifiers/google-scholar/link'
        }
    },
    legacyEspace: `${fullPath}/my_research_claimed.php`,
    authorStatistics: {
        url: (id) => `https://app.library.uq.edu.au/#/authors/${id}`
    },
    help: 'https://guides.library.uq.edu.au/for-researchers/research-publications-guide'
};

// a duplicate list of routes for
const flattedPathConfig = ['/', '/dashboard', '/contact', '/rhdsubmission', '/sbslodge_new', '/records/search',
    '/records/mine', '/records/possible', '/records/claim', '/records/add/find', '/records/add/results', '/records/add/new',
    '/admin/masquerade', '/author-identifiers/orcid/link', '/author-identifiers/google-scholar/link'];

// TODO: will we even have roles?
export const roles = {
    researcher: 'researcher',
    admin: 'admin'
};

export const getRoutesConfig = ({components = {}, account = null, forceOrcidRegistration = false, isHdrStudent = false}) => {
    const pid = `:pid(${pidRegExp})`;
    const publicPages = [
        {
            path: pathConfig.contact,
            render: () => components.StandardPage({...locale.pages.contact}),
            pageTitle: locale.pages.contact.title
        },
        {
            path: pathConfig.records.view(pid),
            component: components.ViewRecord,
            exact: true,
            pageTitle: locale.pages.viewRecord.title,
            regExPath: pathConfig.records.view(`(${pidRegExp})`)
        },
        // TODO: enable search route for public users
        // {
        //     path: pathConfig.records.search,
        //     component: components.SearchRecords,
        //     exact: true,
        //     pageTitle: locale.pages.searchRecords.title
        // },
        ...(!account
            ? [
                {
                    path: pathConfig.index,
                    component: components.Index,
                    exact: true,
                    pageTitle: locale.pages.index.title
                },
                {
                    path: pathConfig.dashboard,
                    component: components.Index,
                    exact: true,
                    pageTitle: locale.pages.index.title
                }]
            : [])
    ];
    const thesisSubmissionPages = [
        ...(account
            ? [
                {
                    path: pathConfig.hdrSubmission,
                    render: isHdrStudent
                        ? () => components.ThesisSubmission({isHdrThesis: true})
                        : () => components.StandardPage({...locale.pages.thesisSubmissionDenied}),
                    pageTitle: formLocale.thesisSubmission.hdrTitle
                },
                {
                    path: pathConfig.sbsSubmission,
                    render: isHdrStudent
                        ? () => components.ThesisSubmission({isHdrThesis: false})
                        : () => components.StandardPage({...locale.pages.thesisSubmissionDenied}),
                    pageTitle: formLocale.thesisSubmission.sbsTitle
                }
            ]
            : [])
    ];

    if (forceOrcidRegistration) {
        return [
            ...publicPages,
            ...thesisSubmissionPages,
            {
                component: components.Orcid,
                pageTitle: locale.pages.orcidLink.title
            }
        ];
    }

    return [
        ...thesisSubmissionPages,
        ...(account ? [
            {
                path: pathConfig.index,
                component: components.Index,
                exact: true,
                pageTitle: locale.pages.index.title
            },
            {
                path: pathConfig.dashboard,
                component: components.Dashboard,
                access: [roles.researcher, roles.admin],
                exact: true,
                pageTitle: locale.pages.dashboard.title
            },
            {
                path: pathConfig.records.mine,
                component: components.MyRecords,
                access: [roles.researcher, roles.admin],
                exact: true,
                pageTitle: locale.pages.myResearch.pageTitle
            },
            {
                path: pathConfig.dataset.mine,
                component: components.MyDataCollections,
                access: [roles.researcher, roles.admin],
                exact: true,
                pageTitle: locale.pages.myDatasets.pageTitle
            },
            {
                path: pathConfig.records.possible,
                component: components.PossiblyMyRecords,
                access: [roles.researcher, roles.admin],
                exact: true,
                pageTitle: locale.pages.claimPublications.title
            },
            {
                path: pathConfig.records.claim,
                component: components.ClaimRecord,
                access: [roles.researcher, roles.admin],
                exact: true,
                pageTitle: locale.forms.claimPublicationForm.title
            },
            {
                path: pathConfig.records.fix(pid),
                component: components.FixRecord,
                access: [roles.researcher, roles.admin],
                exact: true,
                pageTitle: locale.pages.fixRecord.title,
                regExPath: pathConfig.records.fix(`(${pidRegExp})`)
            },
            {
                path: pathConfig.records.add.find,
                render: (props) => components.AddMissingRecord({...props, addRecordStep: components.FindRecords}),
                access: [roles.researcher, roles.admin],
                exact: true,
                pageTitle: locale.pages.addRecord.title
            },
            {
                path: pathConfig.records.add.results,
                render: (props) => components.AddMissingRecord({
                    ...props,
                    addRecordStep: components.RecordsSearchResults
                }),
                access: [roles.researcher, roles.admin],
                exact: true,
                pageTitle: locale.pages.addRecord.title
            },
            {
                path: pathConfig.records.add.new,
                render: (props) => components.AddMissingRecord({...props, addRecordStep: components.NewRecord}),
                access: [roles.researcher, roles.admin],
                exact: true,
                pageTitle: locale.pages.addRecord.title
            },
            {
                path: pathConfig.authorIdentifiers.orcid.link,
                component: components.Orcid,
                exact: true,
                pageTitle: locale.pages.orcidLink.title
            },
            {
                path: pathConfig.authorIdentifiers.googleScholar.link,
                component: components.GoogleScholar,
                access: [roles.researcher, roles.admin],
                exact: true,
                pageTitle: locale.pages.googleScholarLink.title
            }
        ] : []),
        ...(account && account.canMasquerade ? [
            // TODO: remove search route for auth only when public search is enabled
            {
                path: pathConfig.records.search,
                component: components.SearchRecords,
                access: [roles.admin],
                exact: true,
                pageTitle: locale.pages.searchRecords.title
            },
            {
                path: pathConfig.admin.masquerade,
                component: components.Masquerade,
                exact: true,
                access: [roles.admin],
                pageTitle: locale.pages.masquerade.title
            }
        ] : []),
        ...publicPages,
        {
            render: (childProps) => {
                const isValidRoute = flattedPathConfig.indexOf(childProps.location.pathname) >= 0;
                if (isValidRoute && account) return components.StandardPage({...locale.pages.permissionDenied});
                if (isValidRoute) return components.StandardPage({...locale.pages.authenticationRequired});
                return components.StandardPage({...locale.pages.notFound});
            },
            pageTitle: locale.pages.notFound.title
        }
    ];
};

export const getMenuConfig = (account, disabled) => {
    const publicPages = [
        // TODO: enable when search is public
        // {
        //     linkTo: pathConfig.records.search,
        //     ...locale.menu.search,
        //     public: true
        // },
        {
            linkTo: pathConfig.help,
            ...locale.menu.help,
            public: true
        },
        {
            linkTo: pathConfig.contact,
            ...locale.menu.contact,
            public: true
        },
        {
            linkTo: pathConfig.legacyEspace,
            ...locale.menu.legacyEspace,
            public: true
        }
    ];

    if (disabled) {
        return [
            ...(account ? [
                {
                    linkTo: pathConfig.dashboard,
                    primaryText: locale.menu.myDashboard.primaryText,
                    secondaryText: account.mail
                },
                {
                    divider: true,
                    path: '/234234234242'
                }] : []),
            ...publicPages
        ];
    }

    return [
        ...(account ? [
            {
                linkTo: pathConfig.dashboard,
                primaryText: locale.menu.myDashboard.primaryText,
                secondaryText: account.mail
            },
            {
                linkTo: pathConfig.records.mine,
                ...locale.menu.myResearch
            },
            {
                linkTo: pathConfig.records.possible,
                ...locale.menu.claimPublication
            },
            {
                linkTo: pathConfig.records.add.find,
                ...locale.menu.addMissingRecord
            },
            {
                linkTo: pathConfig.dataset.mine,
                ...locale.menu.myDatasets
            },
            {
                linkTo: pathConfig.dataset.add,
                ...locale.menu.addDataset
            },
            {
                linkTo: pathConfig.authorStatistics.url(account.id),
                ...locale.menu.authorStatistics
            },
            {
                divider: true,
                path: '/234234234242'
            }
        ] : []),
        ...(account && account.canMasquerade ? [
            // TODO: remove when public search is enabled
            {
                linkTo: pathConfig.records.search,
                ...locale.menu.search
            },
            {
                linkTo: pathConfig.admin.masquerade,
                ...locale.menu.masquerade,
            },
            {
                divider: true,
                path: '/234234234242'
            }
        ] : []),
        ...publicPages
    ];
};

export const ORCID_REDIRECT_URL = `${window.location.origin}${window.location.pathname}${!!window.location.hash ? '#' : ''}${pathConfig.authorIdentifiers.orcid.link}`;
