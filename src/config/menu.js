/* eslint-disable react/no-multi-comp*/

import React from 'react';

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
        divider: true,
        path: '/' + (new Date()).getTime() // TODO: fix: workaround: empty Route is constructed from divider
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
    {
        linkTo: '/search',
        path: '/search',
        primaryText: 'Search',
        render: () => <div> eSpace search coming soon ...</div>
    },
    {
        linkTo: '/faqs',
        path: '/faqs',
        primaryText: locale.menu.faqs.primaryText,
        render: () => <div> eSpace FAQ coming soon ...</div>
    },
    {
        linkTo: '/about',
        path: '/about',
        primaryText: locale.menu.about.primaryText,
        secondaryText: locale.menu.about.secondaryText,
        render: () => components.StaticPage(locale.pages.about)
    }
];
