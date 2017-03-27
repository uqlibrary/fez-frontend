export const menuItems = email => [
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
    },
    {
        linkTo: '/browse',
        primaryText: 'Browse'
    },
    {
        linkTo: '/about',
        primaryText: 'About eSpace'
    }
];

