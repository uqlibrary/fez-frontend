import {getSearchInternal, getSearchExternal} from 'repositories/search';
import {locale} from 'config';

/**
 * Action types
 * for specific source actions will create source@SEARCH_ACTION, eg SEARCH_LOADING@wos etc
 */
export const SEARCH_LOADING = 'SEARCH_LOADING';
export const SEARCH_COMPLETED = 'SEARCH_COMPLETED';
export const SEARCH_FAILED = 'SEARCH_FAILED';
export const SEARCH_SOURCE_COUNT = 'SEARCH_SOURCE_COUNT';

/**
 * External search sources
 */
export const SOURCE_WOS = 'wos';
export const SOURCE_CROSSREF = 'crossref';
export const SOURCE_SCOPUS = 'scopus';
export const SOURCE_PUBMED = 'pubmed';

/**
 * Internal search source
 */
export const SOURCE_ESPACE = 'espace';

/**
 * List of valid external sources
 *
 * @type {[*]}
 */
export const externalSources = [
    SOURCE_CROSSREF,
    SOURCE_PUBMED,
    SOURCE_SCOPUS,
    SOURCE_WOS
];

function getSearch(source, queryString) {
    if (source === SOURCE_ESPACE) {
        return getSearchInternal(queryString);
    } else {
        return getSearchExternal(source, queryString);
    }
}

// Create a function to translate the source value into a URL to add to the item.

export function createSearchPromise(source, queryString, dispatch) {
    return new Promise((resolve) => {
        dispatch({type: `${SEARCH_LOADING}@${source}`});
        getSearch(source, queryString)
            .then(response => {
                const data = response && response.hasOwnProperty('data') ? response.data
                    .map(item => {
                        const sourceConfig = locale.global.sources[source];
                        item.sources = [
                            {
                                source: source,
                                id: sourceConfig.idKey
                                    .split('.')
                                    .reduce((objectValue, pathProperty) => objectValue[pathProperty], item)
                            }];
                        item.currentSource = source;
                        return item;
                    }) : [];
                dispatch({
                    type: `${SEARCH_COMPLETED}@${source}`,
                    payload: data
                });
                resolve(data);
            })
            .catch((error) => {
                dispatch({
                    type: `${SEARCH_FAILED}@${source}`,
                    payload: error
                });
                // do not reject - not to prevent Promise.all throwing an error
                resolve([]);
            });
    });
}

/**
 * Search publications from various sources
 * @param searchQuery
 * @returns {action}
 */
export function searchPublications(searchQuery) {
    return dispatch => {
        dispatch({type: SEARCH_LOADING});

        const internalSearchPropmise = createSearchPromise(SOURCE_ESPACE, searchQuery, dispatch);
        const externalSearchPropmises = externalSources.map(source => createSearchPromise(source, searchQuery, dispatch));

        dispatch({
            type: SEARCH_SOURCE_COUNT,
            payload: externalSearchPropmises.length
        });

        Promise.all([internalSearchPropmise, ...externalSearchPropmises])
            .then((response) => {
                let flattenedResults = [].concat.apply([], response);
                flattenedResults = flattenedResults.slice(0, flattenedResults.length);
                dispatch({
                    type: SEARCH_COMPLETED,
                    payload: flattenedResults
                });
            }, error => {
                dispatch({
                    type: SEARCH_FAILED,
                    payload: error
                });
            });
    };
}
