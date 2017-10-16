import {locale} from 'config';

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
            primaryText: locale.menu.myResearch.primaryText
        },
        {
            linkTo: pathConfig.records.add.find,
            primaryText: locale.menu.addMissingRecord.primaryText
        },
        {
            linkTo: pathConfig.records.possible,
            primaryText: locale.menu.claimPublication.primaryText
        },
        {
            divider: true,
            path: '/234234234242'
        }
    ] : []),
    ...(account && account.canMasquerade ? [
        {
            linkTo: pathConfig.admin.masquerade,
            primaryText: locale.menu.masquerade.primaryText,
            secondaryText: locale.menu.masquerade.secondaryText
        },
        {
            divider: true,
            path: '/234234234242'
        }
    ] : []),
    {
        linkTo: pathConfig.browse,
        primaryText: locale.menu.browse.primaryText,
        secondaryText: locale.menu.browse.secondaryText,
        public: true
    },
    {
        linkTo: pathConfig.about,
        primaryText: locale.menu.about.primaryText,
        secondaryText: locale.menu.about.secondaryText,
        public: true
    }
];
