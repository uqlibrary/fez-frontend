/* eslint-disable */
import {App, Browse, Dashboard, Research, SearchRecord, ClaimPublication} from '../modules';
import {StandardPage} from 'uqlibrary-react-toolbox';
import {locale, PATHS} from 'config';

const indexRoute = (isAuthorised) => ([
    {
        path: PATHS.index,
        exact: true,
        component: isAuthorised ? Dashboard : Browse,
        ...(isAuthorised ? [] : locale.pages.browse)
    }
]);

const defaultMenuRoutes = [
    {
        path: PATHS.browse,
        component: Browse,
        ...locale.pages.browse
    },
    {
        path: PATHS.about,
        component: StandardPage,
        ...locale.pages.about
    }
];

const researcherMenuRoutes = [
    {
        path: PATHS.dashboard,
        component: Dashboard
    },
    {
        path: PATHS.records.mine,
        component: Research
    },
    {
        path: PATHS.records.find,
        component: SearchRecord
    },
    {
        path: PATHS.records.possible,
        component: ClaimPublication
    }
];

export default [
    {
        component: App,
        routes: [
            // ...indexRoute(isAuthorised),
            // ...defaultMenuRoutes,
            // ...researcherMenuRoutes
        ]
    }
];
