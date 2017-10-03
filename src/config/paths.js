const dashboard = '/dashboard';
const mine = '/mine';
const find = '/find';
const results = '/results';
const addNew = '/new';
const claim = '/claim';
const possible = '/possible';
const browse = '/browse';
const about = '/about';

/**
 * Composite functions
 */
const records = () => (action = '') => `/records${action}`;
const add = () => (action = '') => `/add${action}`;

export default {
    index: '/',
    dashboard: dashboard,
    browse: browse,
    about: about,
    records: {
        mine: records()(mine),
        possible: records()(possible),
        claim: records()(claim),
        find: records()(add()(find)),
        searchResults: records()(add()(results)),
        addNew: records()(add()(addNew))
    }
};
