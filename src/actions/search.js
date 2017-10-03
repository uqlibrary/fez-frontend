import {locale} from 'config';
import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import * as routes from 'repositories/routes';

function getSearch(source, searchQuery) {
    if (source === locale.global.sources.espace.id) {
        return get(routes.SEARCH_INTERNAL_RECORDS_API({searchQuery: searchQuery.replace(/\s/g, '+'), pageSize: 5, sortBy: 'score'}));
    } else {
        return get(routes.SEARCH_EXTERNAL_RECORDS_API({source: source, searchQuery: searchQuery.replace(/\s/g, '+')}));
    }
}

/**
 * createSearchPromise - returns a promise for search in a specific source
 * @param source
 * @param queryString
 * @param dispatch
 * @returns {Promise}
 */
export function createSearchPromise(source, queryString, dispatch) {
    return new Promise((resolve) => {
        dispatch({type: `${actions.SEARCH_LOADING}@${source}`});
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
                    type: `${actions.SEARCH_COMPLETED}@${source}`,
                    payload: data
                });
                resolve(data);
            })
            .catch((error) => {
                dispatch({
                    type: `${actions.SEARCH_FAILED}@${source}`,
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
        dispatch({type: actions.SEARCH_LOADING});

        const searchPromises = Object.keys(locale.global.sources)
            .map(source => createSearchPromise(source, searchQuery, dispatch));

        dispatch({type: actions.SEARCH_SOURCE_COUNT, payload: searchPromises.length});

        Promise.all(searchPromises)
            .then((response) => {
                let flattenedResults = [].concat.apply([], response);
                flattenedResults = flattenedResults.slice(0, flattenedResults.length);
                dispatch({type: actions.SEARCH_COMPLETED, payload: flattenedResults});
            }, error => {
                dispatch({type: actions.SEARCH_FAILED, payload: error});
            });
    };
}
