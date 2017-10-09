const path = (...fns) => (url = '') => fns.reduceRight((part, f) =>  f() + part, url);

const dashboard = () => '/dashboard';
const mine = () => '/mine';
const find = () => '/find';
const results = () => '/results';
const addNew = () => '/new';
const claim = () => '/claim';
const possible = () => '/possible';
const browse = () => '/browse';
const about = () => '/about';
const records = () => '/records';
const add = () => '/add';

export default {
    index: '/',
    dashboard: path(dashboard)(),
    browse: path(browse)(),
    about: path(about)(),
    records: {
        mine: path(records, mine)(),
        possible: path(records, possible)(),
        claim: path(records, claim)(),
        add: {
            index: path(records, add)(),
            find: path(records, add, find)(),
            searchResults: path(records, add, results)(),
            addNew: path(records, add, addNew)()
        }
    }
};
