import {locale} from 'config';
export const paths = {
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

export const getRoutesConfig = (components, account) => [
    {
        path: paths.about,
        render: () => components.StandardPage({...locale.pages.about})
    },
    {
        path: paths.browse,
        render: () => components.Browse(locale.pages.browse)
    },
    ...(!account ? [
        {
            path: paths.index,
            render: () => components.Browse(locale.pages.browse),
            exact: true
        }
    ] : []),
    ...(account ? [
        {
            path: paths.index,
            component: components.Dashboard,
            exact: true
        },
        {
            path: paths.dashboard,
            component: components.Dashboard,
            access: [roles.researcher, roles.admin]
        },
        {
            path: paths.records.mine,
            component: components.Research,
            access: [roles.researcher, roles.admin]
        },
        {
            path: paths.records.possible,
            component: components.ClaimPublication,
            access: [roles.researcher, roles.admin]
        },
        {
            path: paths.records.claim,
            component: components.ClaimPublicationForm,
            access: [roles.researcher, roles.admin]
        },
        // {
        //     path: paths.records.add.find,
        //     component: components.AddRecordSearch,
        //     access: [roles.researcher, roles.admin]
        // },
        // {
        //     path: paths.records.add.results,
        //     component: components.AddRecordSearchResults,
        //     access: [roles.researcher, roles.admin]
        // },
        // {
        //     path: paths.records.add.new,
        //     component: components.AddRecordCreate,
        //     access: [roles.researcher, roles.admin]
        // }
    ] : []),
    ...(account && account.canMasquerade ? [
        {
            path: paths.admin.masquerade,
            render: () => components.StandardPage({title: 'Masquerade as...'}),
            access: [roles.admin]
        },
        {
            path: paths.admin.permissions,
            render: () => components.StandardPage({title: 'Permissions administration'}),
            access: [roles.admin]
        }
    ] : []),
    {
        render: (childProps) => {
            const isValidRoute = childProps.location.pathname.split('/')
                .filter(Boolean)
                .reduce((subpath, locationItem) =>
                    (subpath && !!subpath[locationItem] ? subpath[locationItem] : ''), paths)
                .length > 0;

            if (isValidRoute && account) return components.StandardPage({...locale.pages.permissionDenied});
            if (isValidRoute) return components.StandardPage({...locale.pages.authenticationRequired});
            return components.StandardPage({...locale.pages.notFound});
        }
    }
];

export const getMenuItems = (account) => [
    ...(account ? [
        {
            linkTo: paths.dashboard,
            primaryText: locale.menu.myDashboard.primaryText,
            secondaryText: account.mail
        },
        {
            linkTo: paths.records.mine,
            primaryText: locale.menu.myResearch.primaryText
        },
        {
            linkTo: paths.records.add.find,
            primaryText: locale.menu.addMissingRecord.primaryText
        },
        {
            linkTo: paths.records.possible,
            primaryText: locale.menu.claimPublication.primaryText
        },
        {
            divider: true,
            path: '/234234234242'
        }
    ] : []),
    ...(account && account.canMasquerade ? [
        {
            linkTo: paths.admin.masquerade,
            primaryText: 'Masquerade',
            secondaryText: 'as another user'
        },
        {
            linkTo: paths.admin.permissions,
            primaryText: 'Permissions',
            secondaryText: 'manage permissions'
        },
        {
            divider: true,
            path: '/234234234242'
        }
    ] : []),
    ...[
        {
            linkTo: paths.browse,
            primaryText: locale.menu.browse.primaryText,
            secondaryText: locale.menu.browse.secondaryText,
            public: true
        },
        {
            linkTo: paths.about,
            primaryText: locale.menu.about.primaryText,
            secondaryText: locale.menu.about.secondaryText,
            public: true
        }
    ]
];
