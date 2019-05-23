import {locale} from 'locale';
import {default as formLocale} from 'locale/publicationForm';
import param from 'can-param';
import {defaultQueryParams} from 'config/general';

const fullPath = process.env.FULL_PATH && process.env.FULL_PATH || 'https://fez-staging.library.uq.edu.au';
export const pidRegExp = 'UQ:[a-z0-9]+';

const getSearchUrl = ({searchQuery = {all: ''}, activeFacets = {}}, searchUrl = '/records/search') => {
    const params = {
        ...defaultQueryParams,
        searchQueryParams: {
            ...searchQuery
        },
        activeFacets: {
            ...defaultQueryParams.activeFacets,
            ...activeFacets
        }
    };

    if (searchQuery && !searchQuery.hasOwnProperty('all')) {
        params.searchMode = 'advanced';
    }

    return `${searchUrl}?${param(params)}`;
};

export const pathConfig = {
    index: '/',
    dashboard: '/dashboard',
    contact: '/contact',
    hdrSubmission: '/rhdsubmission',
    sbsSubmission: '/habslodge',
    records: {
        mine: '/records/mine',
        possible: '/records/possible',
        incomplete: '/records/incomplete',
        incompleteFix: (pid) => (`/records/${pid}/incomplete`),
        claim: '/records/claim',
        search: '/records/search',
        view: (pid, includeFullPath = false) => (`${includeFullPath ? fullPath : ''}/view/${pid}`),
        view_new: (pid, includeFullPath = false) => (`${includeFullPath ? fullPath : ''}/view_new/${pid}`), //  temporary for MM to view pids without being redirected to legacy
        fix: (pid) => (`/records/${pid}/fix`),
        add: {
            find: '/records/add/find',
            results: '/records/add/results',
            new: '/records/add/new',
        }
    },
    dataset: {
        mine: '/data-collections/mine',
        // legacy: `${fullPath}/workflow/new.php?xdis_id=371&pid=UQ:289097&cat=select_workflow&wft_id=315`,
        add: '/data-collections/add'
    },
    // TODO: update how we get files after security is implemented in fez file api
    // (this is used in metadata to reflect legacy file urls for citation_pdf_url - Google Scholar)
    file: {
        url: (pid, fileName) => (`${fullPath}/view/${pid}/${fileName}`)
    },
    // TODO: review institutional status and herdc status links when we start administrative epic
    list: {
        author: (author, authorId) => getSearchUrl(
            authorId ? {
                searchQuery: {
                    'rek_author_id': {
                        'value': authorId,
                        'label': `${authorId} (${author})`
                    }
                }
            } : {
                searchQuery: {
                    'rek_author': {
                        'value': author
                    }
                }
            }
        ),
        journalName: (journalName) => getSearchUrl({searchQuery: {'rek_journal_name': {'value': journalName}}}),
        bookTitle: (bookTitle) => getSearchUrl({searchQuery: {'rek_book_title': {'value': bookTitle}}}),
        collection: (collectionId) => getSearchUrl({searchQuery: {'rek_ismemberof': {'value': [collectionId]}}}),
        contributor: (contributor) => getSearchUrl({searchQuery: {'rek_contributor': {'value': contributor}}}),
        conferenceName: (conferenceName) => getSearchUrl({searchQuery: {'rek_conference_name': {'value': conferenceName}}}),
        orgUnitName: (orgUnitName) => getSearchUrl({searchQuery: {'rek_org_unit_name': {'value': orgUnitName}}}),
        publisher: (publisher) => getSearchUrl({searchQuery: {'rek_publisher': {'value': publisher}}}),
        series: (series) => getSearchUrl({searchQuery: {'rek_series': {'value': series}}}),
        license: (license) => getSearchUrl({searchQuery: {all: license}}),
        jobNumber: (jobNumber) => getSearchUrl({searchQuery: {all: jobNumber}}),
        proceedingsTitle: (proceedingsTitle) => getSearchUrl({searchQuery: {all: proceedingsTitle}}),
        // Exact match on Any Field
        keyword: (keyword) => getSearchUrl({searchQuery: {all: `"${keyword}"`}}),
        herdcStatus: (herdcStatus) => getSearchUrl({searchQuery: {all: herdcStatus}}),
        institutionalStatus: (institutionalStatus) => getSearchUrl({searchQuery: {all: institutionalStatus}})
    },
    admin: {
        masquerade: '/admin/masquerade',
        thirdPartyTools: '/tool/lookup',
        legacyEspace: `${fullPath}/my_upo_tools.php`,
        unpublished: '/admin/unpublished'
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
    authorStatistics: {
        url: (id) => `https://app.library.uq.edu.au/#/authors/${id}`
    },
    help: 'https://guides.library.uq.edu.au/for-researchers/research-publications-guide'
};

// a duplicate list of routes for
const flattedPathConfig = ['/', '/dashboard', '/contact', '/rhdsubmission', '/sbslodge_new', '/records/search',
    '/records/mine', '/records/possible', '/records/incomplete', '/records/claim', '/records/add/find', '/records/add/results', '/records/add/new',
    '/admin/masquerade', '/admin/unpublished', '/admin/thirdPartyTools', '/author-identifiers/orcid/link', '/author-identifiers/google-scholar/link'
];

// TODO: will we even have roles?
export const roles = {
    researcher: 'researcher',
    admin: 'admin'
};

export const getRoutesConfig = ({components = {}, account = null, forceOrcidRegistration = false, isHdrStudent = false}) => {
    const pid = `:pid(${pidRegExp})`;
    const publicPages = [
        {
            path: pathConfig.index,
            component: components.Index,
            exact: true,
            pageTitle: locale.pages.index.title
        },
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
        {
            path: pathConfig.records.view_new(pid),
            component: components.ViewRecord,
            exact: true,
            pageTitle: locale.pages.viewRecord.title,
            regExPath: pathConfig.records.view_new(`(${pidRegExp})`)
        },
        {
            path: pathConfig.records.search,
            component: components.SearchRecords,
            exact: true,
            pageTitle: locale.pages.searchRecords.title
        },
        ...(!account
            ? [
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
                        ? () => components.SbsSubmission({isHdrThesis: false})
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
                path: pathConfig.dataset.add,
                component: components.AddDataCollection,
                access: [roles.researcher, roles.admin],
                exact: true,
                pageTitle: locale.pages.addDataset.pageTitle
            },
            {
                path: pathConfig.records.possible,
                component: components.PossiblyMyRecords,
                access: [roles.researcher, roles.admin],
                exact: true,
                pageTitle: locale.pages.claimPublications.title
            },
            {
                path: pathConfig.records.incomplete,
                component: components.MyIncompleteRecords,
                access: [roles.researcher, roles.admin],
                exact: true,
                pageTitle: locale.pages.incompletePublications.title
            },
            {
                path: pathConfig.records.incompleteFix(pid),
                render: (props) => components.MyIncompleteRecord({...props, disableInitialGrants: true, disableDeleteAllGrants: true}),
                access: [roles.researcher, roles.admin],
                exact: true,
                pageTitle: locale.pages.incompletePublication.title
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
            },
        ] : []),
        ...(account && account.canMasquerade ? [
            {
                path: pathConfig.admin.masquerade,
                component: components.Masquerade,
                exact: true,
                access: [roles.admin],
                pageTitle: locale.pages.masquerade.title
            },
            {
                path: pathConfig.admin.unpublished,
                render: (props) => components.SearchRecords({...props, isAdvancedSearch: true}),
                exact: true,
                access: [roles.admin],
                pageTitle: locale.pages.unpublished.title
            },
            {
                path: pathConfig.admin.thirdPartyTools,
                component: components.ThirdPartyLookupTool,
                exact: true,
                access: [roles.admin],
                pageTitle: locale.components.thirdPartyLookupTools.title
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
    const homePage = [
        {
            linkTo: pathConfig.index,
            ...locale.menu.index,
            public: true
        },
    ];
    const publicPages = [
        {
            linkTo: pathConfig.records.search,
            ...locale.menu.search,
            public: true
        },
        {
            linkTo: pathConfig.help,
            ...locale.menu.help,
            public: true
        },
        {
            linkTo: pathConfig.contact,
            ...locale.menu.contact,
            public: true
        }
    ];

    if (disabled) {
        return [
            ...homePage,
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
        ...homePage,
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
                linkTo: pathConfig.records.incomplete,
                ...locale.menu.incompleteRecords
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
                ...locale.menu.addMissingDataset
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
            {
                linkTo: pathConfig.admin.masquerade,
                ...locale.menu.masquerade,
            },
            {
                // maybe this should be in some admin bit? tbd
                linkTo: pathConfig.admin.thirdPartyTools,
                ...locale.menu.thirdPartyLookupTools,
            },
            {
                linkTo: getSearchUrl({searchQuery: {'rek_status': {'value': -4}}}, pathConfig.admin.unpublished),
                ...locale.menu.unpublished
            },
            {
                linkTo: pathConfig.admin.legacyEspace,
                ...locale.menu.legacyEspace
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
