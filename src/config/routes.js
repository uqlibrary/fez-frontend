import React from 'react';
import {locale, paths} from 'config';
import Immutable from 'immutable';

/**
 * Pages
 */
import {StandardPage} from 'uqlibrary-react-toolbox';
import {
    App,
    Browse,
    Dashboard,
    Research,
    ClaimPublication,
    ClaimPublicationForm,
    AddRecordPage,
    SearchRecord,
    SearchRecordResults,
    AddNewRecord
} from 'modules';

/**
 * Used for static components
 * @param RoutedComponent
 */
const routedComponent = (RoutedComponent) => (route) => (<RoutedComponent {...route.route}/>);

/**
 * Generate key for each route page from path
 * @param path
 */
const routeKey = (path) => (path.replace('/', '').replace(/\//g, '-'));

/**
 * Get basic route
 * @param path
 * @param component
 * @param extraProps
 */
const route = (path, component, extraProps = {}) => ({
    path: path,
    component: component,
    key: routeKey(path),
    ...extraProps
});

/**
 * Get exact route
 * @param path
 * @param component
 * @param exactProps
 */
const exactRoute = (path, component, exactProps = {}) => ({
    ...route(path, component, exactProps),
    exact: true
});

/**
 * Index route
 * @param isAuthorised
 */
const indexRoute = (isAuthorised) => (exactRoute(
    paths.index,
    (isAuthorised ? Dashboard : routedComponent(Browse)),
    (isAuthorised ? {} : locale.pages.browse)
));

const defaultRoutes = () => ([
    route(paths.browse, routedComponent(Browse), locale.pages.browse),
    route(paths.about, routedComponent(StandardPage), locale.pages.about)
]);

const researcherRoutes = () => ([
    route(paths.dashboard, Dashboard),
    route(paths.records.mine, Research),
    route(paths.records.possible, ClaimPublication),
    route(paths.records.claim, ClaimPublicationForm),
    {
        path: paths.records.add.index,
        component: AddRecordPage,
        routes: [
            route(paths.records.add.find, SearchRecord),
            route(paths.records.add.searchResults, SearchRecordResults),
            route(paths.records.add.new, AddNewRecord)
        ]
    }
]);

/*
const adminRoutes = () => ([
    route(paths.dashboard, Dashboard)
]);
*/

export default [
    {
        component: App,
        routes: (isAuthorised) => (Immutable.Set([
            indexRoute(isAuthorised),
            ...(isAuthorised ? researcherRoutes() : []),
            ...defaultRoutes()
        ]).toArray())
    }
];
