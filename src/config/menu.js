export const researcherMenuItems = (locale, email, components) => [
    {
        linkTo: '/dashboard',
        path: '/dashboard',
        primaryText: locale.menu.myDashboard.primaryText,
        secondaryText: email,
        component: components.Dashboard
    },
    {
        linkTo: '/research',
        path: '/research',
        primaryText: locale.menu.myResearch.primaryText,
        component: components.Research
    },
    {
        linkTo: '/add-record',
        path: '/add-record',
        primaryText: locale.menu.addMissingRecord.primaryText,
        component: components.AddRecord
    },
    {
        path: '/claim-publications/:id',
        linkTo: '/claim-publications/:id',
        component: components.ClaimPublicationForm
    },
    {
        linkTo: '/claim-publications',
        path: '/claim-publications',
        primaryText: locale.menu.claimPublication.primaryText,
        component: components.ClaimPublication
    },
    {
        divider: true,
        path: '/' + (new Date()).getTime() // TODO: fix: workaround: empty Route is constructed from divider
    },
    {
        linkTo: 'https://www.library.uq.edu.au/mylibrary/#!masquerade',
        path: 'https://www.library.uq.edu.au/mylibrary/#!masquerade',
        primaryText: 'Masquerade as a user',
        secondaryText: 'for testing purposes only',
        target: '_blank'
    },

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
        render: () => components.StaticPage(locale.pages.about)
    }
];
