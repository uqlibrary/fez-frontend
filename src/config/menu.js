export const researcherMenuItems = email => [
    {
        linkTo: '/',
        primaryText: 'My dashboard',
        secondaryText: email
    },
    {
        linkTo: '/research',
        primaryText: 'My research'
    },
    {
        linkTo: '/add-record',
        primaryText: 'Add a missing record',
    },
    {
        divider: true
    }
];

export const adminMenuItems = email => [
    {
        linkTo: '/',
        primaryText: 'My dashboard',
        secondaryText: email
    },
    {
        linkTo: '/',
        primaryText: 'Manage users'
    },
    {
        linkTo: '/',
        primaryText: 'Manage groups'
    },
    {
        linkTo: '/',
        primaryText: 'Manage authors'
    },
    {
        divider: true
    }
];

export const defaultMenuItems = () => [
    {
        linkTo: '/browse',
        primaryText: 'Browse'
    },
    {
        linkTo: '/search',
        primaryText: 'Search'
    },
    {
        linkTo: '/faqs',
        primaryText: 'FAQs'
    },
    {
        linkTo: '/about',
        primaryText: 'About'
    }
];

