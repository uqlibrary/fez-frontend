export const researcherMenuItems = (locale, email, components) => [
    {
        linkTo: '/dashboard',
        path: '/dashboard',
        primaryText: locale.menu.myDashboard.primaryText,
        secondaryText: email,
        component: components.Dashboard
    },
    {
        linkTo: '/records/mine',
        path: '/records/mine',
        primaryText: locale.menu.myResearch.primaryText,
        render: components.Research
    },
    {
        linkTo: '/records/add/find',
        path: '/records/add/find',
        primaryText: locale.menu.addMissingRecord.primaryText,
        component: components.SearchRecord
    },
    {
        linkTo: '/records/possible',
        path: '/records/possible',
        primaryText: locale.menu.claimPublication.primaryText,
        component: components.ClaimPublication
    },
    {
        divider: true,
        path: '/234234234242' // '/' + (new Date()).getTime() // TODO: fix: workaround: empty Route is constructed from divider
    }
];

export const adminMenuItems = (locale, email, components) => [
    {
        linkTo: '/dashboard',
        path: '/dashboard',
        primaryText: locale.menu.myDashboard.primaryText,
        secondaryText: email,
        component: components.Dashboard
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

export const defaultMenuItems = (locale, components) => [
    {
        linkTo: '/browse',
        primaryText: locale.menu.browse.primaryText,
        secondaryText: locale.menu.browse.secondaryText,
        path: '/browse',
        render: () => components.Browse(locale.pages.browse)
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
        linkTo: '/about',
        path: '/about',
        primaryText: locale.menu.about.primaryText,
        secondaryText: locale.menu.about.secondaryText,
        render: () => components.StandardPage(locale.pages.about)
    }
];
