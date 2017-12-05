import React from 'react';
import {locale} from 'locale';

import Async from 'modules/SharedComponents/Async';
const FixRecord = () => (<Async load={import('modules/FixRecord/containers/FixRecord')} />);
const ClaimRecord = () => (<Async load={import('modules/ClaimRecord/containers/ClaimRecord')} />);
const PossiblyMyRecords = () => (<Async load={import('modules/PossiblyMyRecords/containers/PossiblyMyRecords')} />);
const MyRecords = () => (<Async load={import('modules/MyRecords/containers/MyRecords')} />);
const Dashboard = () => (<Async load={import('modules/Dashboard/containers/Dashboard')} />);
// const AddMissingRecord = () => (<Async load={import('modules/AddMissingRecord/containers/AddMissingRecord')} />);
// const FindRecords = () => (<Async load={import('modules/AddMissingRecord/components/steps/FindRecords')} />);
// const RecordsSearchResults = () => (<Async load={import('modules/AddMissingRecord/components/steps/RecordsSearchResults')} />);
// const NewRecord = () => (<Async load={import('modules/AddMissingRecord/components/steps/NewRecord')} />);

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
                component: Dashboard,
                exact: true
            },
            {
                path: pathConfig.dashboard,
                component: Dashboard,
                access: [roles.researcher, roles.admin],
                exact: true
            },
            {
                path: pathConfig.records.mine,
                component: MyRecords,
                access: [roles.researcher, roles.admin],
                exact: true
            },
            {
                path: pathConfig.records.possible,
                component: PossiblyMyRecords,
                access: [roles.researcher, roles.admin],
                exact: true
            },
            {
                path: pathConfig.records.claim,
                component: ClaimRecord,
                access: [roles.researcher, roles.admin],
                exact: true
            },
            {
                path: pathConfig.records.fix(':pid'),
                component: FixRecord,
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
