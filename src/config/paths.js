const  buildPath = (...fns) => (url = '') => fns.reduceRight((part, f) =>  f() + part, url);

const dashboard = () => '/dashboard';
const records = () => '/records';

const add = () => '/add';
const find = () => '/find';
const results = () => '/results';
const create = () => '/new';

const mine = () => '/mine';
const possible = () => '/possible';
const claim = () => '/claim';

const browse = () => '/browse';
const about = () => '/about';

export default {
    index: '/',
    dashboard: buildPath(dashboard)(),
    browse: buildPath(browse)(),
    about: buildPath(about)(),
    records: {
        mine: buildPath(records, mine)(),
        possible: buildPath(records, possible)(),
        claim: buildPath(records, claim)(),
        add: {
            index: buildPath(records, add)(),
            find: buildPath(records, add, find)(),
            searchResults: buildPath(records, add, results)(),
            new: buildPath(records, add, create)()
        }
    }
};
