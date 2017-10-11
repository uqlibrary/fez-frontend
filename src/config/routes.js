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
        add: {
            find: '/records/add/find',
            results: '/records/add/results',
            new: '/records/add/new',
        }
    },
    admin: {
        masquerade: '/admin/masquerade',
        permissions: '/admin/permissions'
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
                component: components.Research,
                access: [roles.researcher, roles.admin],
                exact: true
            },
            {
                path: pathConfig.records.possible,
                component: components.ClaimPublication,
                access: [roles.researcher, roles.admin],
                exact: true
            },
            {
                path: pathConfig.records.claim,
                component: components.ClaimPublicationForm,
                access: [roles.researcher, roles.admin],
                exact: true
            },
            {
                path: pathConfig.records.add.find,
                render: (props) => components.AddRecordPage({...props, addRecordStep: components.SearchRecord}),
                access: [roles.researcher, roles.admin],
                exact: true
            },
            {
                path: pathConfig.records.add.results,
                render: (props) => components.AddRecordPage({...props, addRecordStep: components.SearchRecordResults}),
                access: [roles.researcher, roles.admin],
                exact: true
            },
            {
                path: pathConfig.records.add.new,
                render: (props) => components.AddRecordPage({...props, addRecordStep: components.AddNewRecord}),
                access: [roles.researcher, roles.admin],
                exact: true
            },
        ] : []),
        ...(account && account.canMasquerade ? [
            {
                path: pathConfig.admin.masquerade,
                render: () => components.StandardPage({title: 'Masquerade as...'}),
                exact: true,
                access: [roles.admin]
            },
            {
                path: pathConfig.admin.permissions,
                render: () => components.StandardPage({title: 'Permissions administration'}),
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
            primaryText: 'Masquerade',
            secondaryText: 'as another user'
        },
        {
            linkTo: pathConfig.admin.permissions,
            primaryText: 'Permissions',
            secondaryText: 'manage permissions'
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
