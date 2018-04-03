import {locale} from 'locale';

const fullPath = process.env.NODE_ENV === 'development' ? 'https://fez-staging.library.uq.edu.au' : '';

export const pathConfig =  {
    index: '/',
    dashboard: '/dashboard',
    browse: '/browse',
    about: '/about',
    hdrSubmission: '/rhdsubmission_new',
    sbsSubmission: '/sbslodge_new',
    records: {
        mine: '/records/mine',
        possible: '/records/possible',
        claim: '/records/claim',
        view: (pid) => (`/records/${pid}`),
        fix: (pid) => (`/records/${pid}/fix`),
        add: {
            find: '/records/add/find',
            results: '/records/add/results',
            new: '/records/add/new',
        }
    },
    collection: {
        view: (pid) => (`/collection/${pid}`),
    },
    // TODO: update how we get files after security is implemented in fez file api
    file: {
        url: (pid, fileName) => (`${fullPath}/view/${pid}/${fileName}`)
    },
    // TODO: update links when we have list pages
    list: {
        author: (author) => (`${fullPath}/list/author/${author}`),
        authorId: (authorId) => (`${fullPath}/list/author_id/${authorId}`),
        subject: (subjectId) => (`${fullPath}/list/subject/${subjectId}`),
        herdcStatus: (herdcStatusId) => (`${fullPath}/list/?cat=quick_filter&search_keys[UQ_22]=${herdcStatusId}`),
        keyword: (keyword) => (`${fullPath}/list/?cat=quick_filter&search_keys[0]=${keyword}`),
        institutionalStatus: (institutionalStatusId) => (`${fullPath}/list/?cat=quick_filter&search_keys[UQ_23]=${institutionalStatusId}`),
        openAccessStatus: (openAccessStatusId) => (`${fullPath}/list/?cat=quick_filter&search_keys[UQ_54]=${openAccessStatusId}`),
        journalName: (journalName) => (`${fullPath}/list/?cat=quick_filter&search_keys[core_34]=${journalName}`),
        publisher: (publisher) => (`${fullPath}/list/?cat=quick_filter&search_keys[core_29]=${publisher}`),
        license: (license) => (`${fullPath}/list/?cat=quick_filter&search_keys[core_112]=${license}`),
        accessCondition: (accessCondition) => (`${fullPath}/list/?cat=quick_filter&search_keys[core_95]=${accessCondition}`),
        collectionType: (collectionType) => (`${fullPath}/list/?cat=quick_filter&search_keys[core_92]=${collectionType}`),
        orgUnitName: (orgUnitName) => (`${fullPath}/list/?cat=quick_filter&search_keys[core_70]=${orgUnitName}`),
        series: (series) => (`${fullPath}/list/?cat=quick_filter&search_keys[core_33]=${series}`),
        bookTitle: (bookTitle) => (`${fullPath}/list/?cat=quick_filter&search_keys[core_37]=${bookTitle}`),
        conferenceName: (conferenceName) => (`${fullPath}/list/?cat=quick_filter&search_keys[core_36]=${conferenceName}`),
        proceedingsTitle: (proceedingsTitle) => (`${fullPath}/list/?cat=quick_filter&search_keys[UQ_2]=${proceedingsTitle}`),
    },
    admin: {
        masquerade: '/admin/masquerade'
    },
    authorIdentifiers: {
        orcid: {
            link: '/author-identifiers/orcid/link',
            absoluteLink: `${window.location.origin}${window.location.pathname}${!!window.location.hash ? '#' : ''}/author-identifiers/orcid/link`
            // unlink: '/author-identifiers/orcid/link'
        },
        googleScholar: {
            link: '/author-identifiers/google-scholar/link',
            // unlink: '/author-identifiers/google-scholar/link'
        }
    }
};

// a duplicate list of routes for
const flattedPathConfig = ['/', '/dashboard', '/browse', '/about', '/rhdsubmission_new', '/sbslodge_new',
    '/records/mine', '/records/possible', '/records/claim', '/records/add/find', '/records/add/results', '/records/add/new',
    '/admin/masquerade', '/author-identifiers/orcid/link', '/author-identifiers/google-scholar/link'];

// TODO: will we even have roles?
export const roles = {
    researcher: 'researcher',
    admin: 'admin'
};

export const getRoutesConfig = ({components = {}, account = null, forceOrcidRegistration = false, isHdrStudent = false}) => {
    const pid = ':pid(UQ:\\d+)';
    const publicPages = [
        {
            path: pathConfig.about,
            render: () => components.StandardPage({...locale.pages.about})
        },
        {
            path: pathConfig.browse,
            render: () => components.Browse(locale.pages.browse)
        },
        {
            path: pathConfig.records.view(pid),
            component: components.ViewRecord,
            exact: true
        },
        ...(!account ? [
            {
                path: pathConfig.index,
                render: () => components.Browse(locale.pages.browse),
                exact: true
            }
        ] : [])];

    const thesisSubmissionPages = (account ? [
        {
            path: pathConfig.hdrSubmission,
            render: isHdrStudent
                ? () => components.ThesisSubmission({isHdrThesis: true})
                : () => components.StandardPage({...locale.pages.thesisSubmissionDenied})
        },
        {
            path: pathConfig.sbsSubmission,
            render: isHdrStudent
                ? () => components.ThesisSubmission({isHdrThesis: false})
                : () => components.StandardPage({...locale.pages.thesisSubmissionDenied})
        },
    ] : []);

    if (forceOrcidRegistration) {
        return [
            ...publicPages,
            ...thesisSubmissionPages,
            {
                component: components.Orcid
            }
        ];
    }

    return [
        ...thesisSubmissionPages,
        ...(account ? [
            {
                path: pathConfig.index,
                component: components.Dashboard,
                exact: true
            },
            {
                path: pathConfig.dashboard,
                component: components.Dashboard,
                access: [roles.researcher, roles.admin],
                exact: true
            },
            {
                path: pathConfig.records.mine,
                component: components.MyRecords,
                access: [roles.researcher, roles.admin],
                exact: true
            },
            {
                path: pathConfig.records.possible,
                component: components.PossiblyMyRecords,
                access: [roles.researcher, roles.admin],
                exact: true
            },
            {
                path: pathConfig.records.claim,
                component: components.ClaimRecord,
                access: [roles.researcher, roles.admin],
                exact: true
            },
            {
                path: pathConfig.records.fix(pid),
                component: components.FixRecord,
                access: [roles.researcher, roles.admin],
                exact: true
            },
            {
                path: pathConfig.records.add.find,
                render: (props) => components.AddMissingRecord({...props, addRecordStep: components.FindRecords}),
                access: [roles.researcher, roles.admin],
                exact: true
            },
            {
                path: pathConfig.records.add.results,
                render: (props) => components.AddMissingRecord({...props, addRecordStep: components.RecordsSearchResults}),
                access: [roles.researcher, roles.admin],
                exact: true
            },
            {
                path: pathConfig.records.add.new,
                render: (props) => components.AddMissingRecord({...props, addRecordStep: components.NewRecord}),
                access: [roles.researcher, roles.admin],
                exact: true
            },
            {
                path: pathConfig.authorIdentifiers.orcid.link,
                component: components.Orcid,
                exact: true
            },
            {
                path: pathConfig.authorIdentifiers.googleScholar.link,
                component: components.GoogleScholar,
                access: [roles.researcher, roles.admin],
                exact: true
            },
        ] : []),
        ...(account && account.canMasquerade ? [
            {
                path: pathConfig.admin.masquerade,
                component: components.Masquerade,
                exact: true,
                access: [roles.admin]
            }
        ] : []),
        ...publicPages,
        {
            render: (childProps) => {
                const isValidRoute = flattedPathConfig.indexOf(childProps.location.pathname) >= 0;
                if (isValidRoute && account) return components.StandardPage({...locale.pages.permissionDenied});
                if (isValidRoute) return components.StandardPage({...locale.pages.authenticationRequired});
                return components.StandardPage({...locale.pages.notFound});
            }
        }
    ];
};

export const getMenuConfig = (account, disabled) => {
    const publicPages = [
        {
            linkTo: pathConfig.browse,
            ...locale.menu.browse,
            public: true
        },
        {
            linkTo: pathConfig.about,
            ...locale.menu.about,
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
                divider: true,
                path: '/234234234242'
            }
        ] : []),
        ...publicPages
    ];
};

export const ORCID_REDIRECT_URL = `${window.location.origin}${window.location.pathname}${!!window.location.hash ? '#' : ''}${pathConfig.authorIdentifiers.orcid.link}`;
