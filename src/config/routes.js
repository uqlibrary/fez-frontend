import {locale} from 'locale';

export const pathConfig =  {
    index: '/',
    dashboard: '/dashboard',
    browse: '/browse',
    about: '/about',
    records: {
        mine: '/records/mine',
        possible: '/records/possible',
        claim: '/records/claim',
        fix: (pid) => (`/records/${pid}/fix`),
        add: {
            find: '/records/add/find',
            results: '/records/add/results',
            new: '/records/add/new',
        }
    },
    admin: {
        masquerade: '/admin/masquerade'
    },
    authorIdentifiers: {
        orcid: {
            link: '/author-identifiers/orcid/link',
            // unlink: '/author-identifiers/orcid/link'
        },
        googleScholar: {
            link: '/author-identifiers/googleScholar/link',
            // unlink: '/author-identifiers/googleScholar/link'
        }
    }
};

// TODO: will we even have roles?
export const roles = {
    researcher: 'researcher',
    admin: 'admin'
};

export const getRoutesConfig = (components, account) => {
    return [
        {
            path: pathConfig.about,
            render: () => components.StandardPage({...locale.pages.about})
        },
        {
            path: pathConfig.browse,
            render: () => components.Browse(locale.pages.browse)
        },
        ...(!account ? [
            {
                path: pathConfig.index,
                render: () => components.Browse(locale.pages.browse),
                exact: true
            }
        ] : []),
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
                path: pathConfig.records.fix(':pid'),
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
                render: () => components.StandardPage({title: 'Link ORCID ID to UQ eSpace', children: 'Link or register ORCID ID here.... Coming soon....'})
            },
            {
                path: pathConfig.authorIdentifiers.googleScholar.link,
                render: () => components.StandardPage({title: 'Link Google Scholar ID to UQ eSpace', children: 'Link Google Scholar here.... Coming soon....'})
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
        {
            render: (childProps) => {
                const isValidRoute = childProps.location.pathname.split('/')
                    .filter(Boolean)
                    .reduce((subpath, locationItem) =>
                        (subpath && !!subpath[locationItem] ? subpath[locationItem] : ''), pathConfig)
                    .length > 0;

                if (isValidRoute && account) return components.StandardPage({...locale.pages.permissionDenied});
                if (isValidRoute) return components.StandardPage({...locale.pages.authenticationRequired});
                return components.StandardPage({...locale.pages.notFound});
            }
        }
    ];
};

export const getMenuConfig = (account) => [
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
