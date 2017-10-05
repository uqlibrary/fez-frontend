import {PATHS} from 'config';

export const researcherMenuItems = (locale, email) => [
    {
        linkTo: PATHS.dashboard,
        primaryText: locale.menu.myDashboard.primaryText,
        secondaryText: email
    },
    {
        linkTo: PATHS.records.mine,
        primaryText: locale.menu.myResearch.primaryText
    },
    {
        linkTo: PATHS.records.find,
        primaryText: locale.menu.addMissingRecord.primaryText
    },
    {
        linkTo: PATHS.records.possible,
        primaryText: locale.menu.claimPublication.primaryText
    },
    {
        divider: true,
        path: '/234234234242' // '/' + (new Date()).getTime() // TODO: fix: workaround: empty Route is constructed from divider
    }
];

export const adminMenuItems = (locale, email) => [
    {
        linkTo: PATHS.dashboard,
        primaryText: locale.menu.myDashboard.primaryText,
        secondaryText: email
    },
    {
        linkTo: '/',
        primaryText: locale.menu.manageUsers.primaryText
    },
    {
        linkTo: '/',
        primaryText: locale.menu.manageGroups.primaryText
    },
    {
        linkTo: '/',
        primaryText: locale.menu.manageAuthors.primaryText
    },
    {
        divider: true
    }
];

export const defaultMenuItems = (locale) => [
    {
        linkTo: PATHS.browse,
        primaryText: locale.menu.browse.primaryText,
        secondaryText: locale.menu.browse.secondaryText
    },
    // TODO: coming soon
    // {
    //     linkTo: '/search',
    //     path: '/search',
    //     primaryText: 'Search',
    //     render: () => components.StaticPage({title: 'Search', text: 'public search coming soon...'})
    // },
    // {
    //     linkTo: '/faqs',
    //     path: '/faqs',
    //     primaryText: locale.menu.faqs.primaryText,
    //     render: () => components.StaticPage({title: 'FAQs', text: 'public FAQs coming soon...'})
    // },
    {
        linkTo: PATHS.about,
        primaryText: locale.menu.about.primaryText,
        secondaryText: locale.menu.about.secondaryText
    }
];
