/* eslint-disable react/no-multi-comp*/

import React from 'react';

export const researcherMenuItems = (email, components) => [
    {
        linkTo: '/dashboard',
        path: '/dashboard',
        primaryText: 'My dashboard',
        secondaryText: email,
        component: components.Dashboard
    },
    {
        linkTo: '/research',
        path: '/research',
        primaryText: 'My research',
        component: components.Research
    },
    {
        linkTo: '/add-record',
        path: '/add-record',
        primaryText: 'Add a missing record',
        component: components.AddRecord
    },
    {
        divider: true,
        path: '/' + (new Date()).getTime() // TODO: fix: workaround: empty Route is constructed from divider
    }
];

export const adminMenuItems = (email, components) => [
    {
        linkTo: '/dashboard',
        path: '/dashboard',
        primaryText: 'My dashboard',
        secondaryText: email,
        component: components.Dashboard
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

export const defaultMenuItems = components => [
    {
        linkTo: '/browse',
        primaryText: 'Browse',
        path: '/browse',
        component: components.Browse
    },
    {
        linkTo: '/search',
        path: '/search',
        primaryText: 'Search',
        render: () => <div> eSpace search coming soon ...</div>
    },
    {
        linkTo: '/faqs',
        path: '/faqs',
        primaryText: 'FAQs',
        render: () => <div> eSpace FAQ coming soon ...</div>
    },
    {
        linkTo: '/about',
        path: '/about',
        primaryText: 'About',
        component: components.About
    }
];
