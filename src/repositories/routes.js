import {validation} from 'config';

/**
 * Translate selected facets to query string parameters
 * @param {object} selected facets
 * @returns {string}
 */
const getFacetsQueryString = (facets) => {
    return Object.keys(facets).map(key => {
        return ('filters[facets][' + key + ']=' + facets[key]);
    }).join('&');
};

/**
 * prepareTextSearchQuery - escape/remove ElasticSearch special characters
 * @param {string} query string
 * @returns {string}
 */
export const prepareTextSearchQuery = (searchQuery) => {
    const escapeConfig = [
        {
            find: /([\!\*\+\-\=\&\|\(\)\[\]\{\}\^\~\?\:\\/"])/g,
            replaceWith: '\\$1'
        },
        {
            find: /([\<\>])/g,
            replaceWith: ''
        },
        {
            find: /\s/g,
            replaceWith: '+'
        }
    ];
    const value = escapeConfig.reduce((query, config) =>
        (query.replace(config.find, config.replaceWith)), searchQuery.trim());
    return value;
};

/**
 * Translate parameters into standard search string
 * @param {object} {page = 1, pageSize = 20, sortBy = 'published_date', sortDirection = 'desc', withUnknownAuthors = -1, facets = {}}
 * @returns {string}
 */
const getStandardSearchParameters = ({page = 1, pageSize = 20, sortBy = 'published_date', sortDirection = 'desc', withUnknownAuthors = -1, facets = {}}) => (
    `page=${page}&per_page=${pageSize}&sort=${sortBy}&order_by=${sortDirection}&${getFacetsQueryString(facets)}${withUnknownAuthors >= 0 ? `&with_unknown_authors=${withUnknownAuthors}` : ''}`
);

/**
 * getSearchType - based on data provided returns query string attribute
 * @param {string} pid/pubmed/string title to search
 * @returns {string} query string attribute based on input
 */
const getSearchType = (searchQuery) => {
    if (validation.isValidDOIValue(searchQuery)) {
        return `doi=${searchQuery.trim()}`;
    }

    if (validation.isValidPubMedValue(searchQuery)) {
        return `id=pmid:${searchQuery.trim()}`;
    }

    return `title=${prepareTextSearchQuery(searchQuery)}`;
};

export const ACCOUNT_API = () => (`account?${new Date().getTime()}`);
export const AUTHORS_SEARCH_API = ({query}) => (`fez-authors/search?query=${query}`);
export const CURRENT_AUTHOR_API = () => ('fez-authors');
export const AUTHOR_DETAILS_API = ({userId}) => (`authors/details/${userId}`);

// academic stats apis
export const ACADEMIC_STATS_PUBLICATION_YEARS_API = ({userId}) => (`academic/${userId}/publication-years`);
export const ACADEMIC_STATS_PUBLICATION_HINDEX_API = ({userId}) => (`academic/${userId}/hindex`);
export const ACADEMIC_STATS_PUBLICATION_STATS_API = ({userId}) => (`academic/${userId}/publication-stats`);
export const ACADEMIC_STATS_PUBLICATIONS_TRENDING_API = ({userId}) => (`academic/${userId}/trending_publications`);

// lookup apis
export const GET_ACML_QUICK_TEMPLATES_API = () => ('acml/quick-templates');
export const VOCABULARIES_API  = ({id}) => (`vocabularies/${id}`);
export const GET_PUBLICATION_TYPES_API = () => ('records/types');

// file uploading apis
export const FILE_UPLOAD_API = ({pid, fileName}) => (`file/upload/presigned/${pid}/${fileName}`);

// create/patch record apis
export const NEW_RECORD_API = () => ('records');
export const EXISTING_RECORD_API = ({pid}) => (`records/${pid}`);
export const RECORDS_ISSUES_API = ({pid}) => (`records/${pid}/issues`);

// search/list records apis
export const POSSIBLE_RECORDS_API = ({facets = {}}) => (`records/search?rule=possible&${getFacetsQueryString(facets)}`);
export const HIDE_POSSIBLE_RECORD_API = () => ('records/search?rule=possible'); // (POST: with data: [\'pid\' => \'UQ:1\', \'type\' => \'H\'])`);

export const CURRENT_USER_RECORDS_API = (values) => (`records/search?rule=mine&${getStandardSearchParameters(values)}`);
export const SEARCH_INTERNAL_RECORDS_API = (values) => (
    // values = {searchQuery, page = 1, pageSize = 20, sortBy = 'published_date', sortDirection = 'desc', facets = {}}
    `records/search?${getSearchType(values.searchQuery)}&${getStandardSearchParameters(values)}`
);

export const SEARCH_EXTERNAL_RECORDS_API = ({source = 'wos', searchQuery}) => (
    `external/records/search?source=${source}&${getSearchType(searchQuery)}`
);
