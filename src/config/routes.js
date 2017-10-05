import React from 'react';

import {
    App,
    Browse,
    Dashboard,
    Research,
    SearchRecord,
    ClaimPublication,
    ClaimPublicationForm,
    SearchRecordResults,
    AddNewRecord
} from '../modules';
import {StandardPage} from 'uqlibrary-react-toolbox';
import {locale, PATHS} from 'config';

const routedComponent = (RoutedComponent) => (route) => (<RoutedComponent {...route.route}/>);
const routeKey = (path) => (path.replace('/', '').replace(/\//g, '-'));

const indexRoute = (isAuthorised) => ({
    path: PATHS.index,
    exact: true,
    component: isAuthorised ? Dashboard : routedComponent(Browse),
    ...(isAuthorised ? {} : locale.pages.browse)
});

export default [
    {
        component: App,
        routes: (isAuthorised) => ([
            {...indexRoute(isAuthorised)},
            {
                path: PATHS.browse,
                component: routedComponent(Browse),
                key: routeKey(PATHS.browse),
                ...locale.pages.browse,
            },
            {
                path: PATHS.about,
                component: routedComponent(StandardPage),
                key: routeKey(PATHS.about),
                ...locale.pages.about
            },
            {
                path: PATHS.dashboard,
                component: Dashboard,
                key: routeKey(PATHS.dashboard),
            },
            {
                path: PATHS.records.mine,
                component: Research,
                key: routeKey(PATHS.records.mine),
            },
            {
                path: PATHS.records.find,
                component: SearchRecord,
                key: routeKey(PATHS.records.find),
            },
            {
                path: PATHS.records.possible,
                component: ClaimPublication,
                key: routeKey(PATHS.records.possible),
            },
            {
                path: PATHS.records.searchResults,
                component: SearchRecordResults,
                key: routeKey(PATHS.records.searchResults),
            },
            {
                path: PATHS.records.claim,
                component: ClaimPublicationForm,
                key: routeKey(PATHS.records.claim),
            },
            {
                path: PATHS.records.addNew,
                component: AddNewRecord,
                key: routeKey(PATHS.records.addNew),
            }
        ])
    }
];
