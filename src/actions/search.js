import locale from 'locale/global';
import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import {
    COLLECTIONS_BY_COMMUNITY_LOOKUP_API,
    ROR_LOOKUP_API,
    SEARCH_AUTHOR_LOOKUP_API,
    SEARCH_EXTERNAL_RECORDS_API,
    SEARCH_INTERNAL_RECORDS_API,
    SEARCH_KEY_LOOKUP_API,
} from 'repositories/routes';
import { exportPublications } from './exportPublications';
import { isValidROR } from 'config/validation';

function getSearch(source, searchQuery) {
    if (source === locale.global.sources.espace.id) {
        return get(SEARCH_INTERNAL_RECORDS_API({ searchQuery, pageSize: 5, sortBy: 'score' }));
    } else {
        return get(SEARCH_EXTERNAL_RECORDS_API({ source, searchQuery }));
    }
}

export const getCollectionsListAPI = parentPid => {
    if (parentPid !== null) {
        return COLLECTIONS_BY_COMMUNITY_LOOKUP_API({ communityPid: parentPid });
    }
    return SEARCH_INTERNAL_RECORDS_API({
        searchMode: 'advanced',
        searchQueryParams: { rek_object_type: 2 },
        pageSize: 999,
        sortBy: 'title',
        sortDirection: 'asc',
    });
};

/**
 * collectionsList - returns records for a list of collections in eSpace
 * either all collections, or restricted by parent-community
 * @returns {Promise}
 */
export function collectionsList(parentPid = null) {
    return dispatch => {
        dispatch({ type: actions.SEARCH_COLLECTION_LOADING });
        return get(getCollectionsListAPI(parentPid)).then(
            response => {
                dispatch({ type: actions.SEARCH_COLLECTION_LOADED, payload: response.data });
            },
            error => {
                dispatch({ type: actions.SEARCH_COLLECTION_FAILED, payload: error.message });
            },
        );
    };
}

/**
 * loadCommunitiesList - returns records for a list of all communities in eSpace
 * @returns {Promise}
 */
export function communitiesList() {
    return dispatch => {
        dispatch({ type: actions.SEARCH_COMMUNITIES_LOADING });
        return get(
            SEARCH_INTERNAL_RECORDS_API({
                searchMode: 'advanced',
                searchQueryParams: { rek_object_type: 1 },
                pageSize: 999,
                sortBy: 'title',
                sortDirection: 'asc',
            }),
        ).then(
            response => {
                dispatch({ type: actions.SEARCH_COMMUNITIES_LOADED, payload: response.data });
            },
            error => {
                dispatch({ type: actions.SEARCH_COMMUNITIES_FAILED, payload: error.message });
            },
        );
    };
}

/**
 * createSearchPromise - returns a promise for search in a specific source
 * @param source
 * @param queryString
 * @param dispatch
 * @returns {Promise}
 */
export function createSearchPromise(source, queryString, dispatch) {
    return new Promise(resolve => {
        dispatch({ type: `${actions.SEARCH_LOADING}@${source}` });
        getSearch(source, queryString)
            .then(({ data = [] }) => {
                const processResponse = data.map(item => {
                    const sourceConfig = locale.global.sources[source];
                    item.sources = [
                        {
                            source: source,
                            id: sourceConfig.idKey
                                .split('.')
                                .reduce((objectValue, pathProperty) => objectValue[pathProperty], item),
                        },
                    ];
                    item.currentSource = source;
                    return item;
                });

                dispatch({
                    type: `${actions.SEARCH_LOADED}@${source}`,
                    payload: { data: processResponse },
                });
                resolve(processResponse);
            })
            .catch(error => {
                dispatch({
                    type: `${actions.SEARCH_FAILED}@${source}`,
                    payload: error.message,
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
        dispatch({
            type: actions.SEARCH_LOADING,
            payload: searchQuery,
        });

        const searchPromises = Object.keys(locale.global.sources).map(source =>
            createSearchPromise(source, searchQuery, dispatch),
        );

        dispatch({
            type: actions.SEARCH_SOURCE_COUNT,
            payload: searchPromises.length,
        });

        return Promise.all(searchPromises).then(response => {
            let flattenedResults = [].concat.apply([], response);
            flattenedResults = flattenedResults.slice(0, flattenedResults.length);
            dispatch({
                type: actions.SEARCH_LOADED,
                payload: {
                    data: flattenedResults,
                },
            });
        });
    };
}

export function getSearchLookupApi(searchQuery, searchKey) {
    if (searchKey === 'author') {
        return SEARCH_AUTHOR_LOOKUP_API({ searchQuery });
    } else {
        return SEARCH_KEY_LOOKUP_API({ searchQuery, searchKey });
    }
}

/**
 * Get a list of values based on search key and value, eg for auto suggest controls
 * @param string - search key, eg 'series'
 * @param string - search query, eg 'conference'
 * @returns {action}
 */
export function loadSearchKeyList(searchKey, searchQuery) {
    return dispatch => {
        dispatch({ type: `${actions.SEARCH_KEY_LOOKUP_LOADING}@${searchKey}`, payload: searchKey });
        return (
            searchQuery &&
            searchQuery.trim().length > 0 &&
            get(getSearchLookupApi(searchQuery, searchKey)).then(
                response => {
                    dispatch({
                        type: `${actions.SEARCH_KEY_LOOKUP_LOADED}@${searchKey}`,
                        payload: response.data,
                    });
                },
                error => {
                    dispatch({
                        type: `${actions.SEARCH_KEY_LOOKUP_FAILED}@${searchKey}`,
                        payload: error.message,
                    });
                },
            )
        );
    };
}

/**
 * searchEspacePublications - call eSpace internal search api
 * searchParameters are
 * {
 *  title: '',
 *  ...any other search parameters for advanced search...,
 *  page = 1, pageSize = 20, sortBy = 'score', sortDirection = 'Desc',
 *  activeFacets = {filters: {}, ranges: {}}
 * }
 *
 * @param searchParams
 * @return {function(*): Promise<any>}
 */
export function searchEspacePublications(searchParams) {
    return dispatch => {
        dispatch({
            type: actions.SET_SEARCH_QUERY,
            payload: searchParams,
        });

        dispatch({ type: actions.SEARCH_LOADING, payload: '' });

        return get(
            SEARCH_INTERNAL_RECORDS_API({
                ...searchParams,
                facets: searchParams.activeFacets || {},
            }),
        )
            .then(response => {
                dispatch({
                    type: actions.SEARCH_LOADED,
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.SEARCH_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function doesDOIExist(doi) {
    return get(SEARCH_KEY_LOOKUP_API({ searchKey: 'doi', searchQuery: doi }));
}

export function loadCollectionsList(searchKey, searchQuery) {
    return dispatch => {
        dispatch({
            type: `${actions.SEARCH_KEY_LOOKUP_LOADING}@${searchKey}`,
            payload: searchKey,
        });

        return get(
            SEARCH_INTERNAL_RECORDS_API({
                searchQueryParams: { all: searchQuery, rek_object_type: 2 },
                page: 1,
                pageSize: 20,
                sortBy: 'score',
                sortDirection: 'desc',
                facets: {},
            }),
        ).then(
            response => {
                dispatch({
                    type: `${actions.SEARCH_KEY_LOOKUP_LOADED}@${searchKey}`,
                    payload: response.data,
                });
            },
            error => {
                dispatch({
                    type: `${actions.SEARCH_KEY_LOOKUP_FAILED}@${searchKey}`,
                    payload: error.message,
                });
            },
        );
    };
}

export function loadPublicationList(searchKey, searchQuery) {
    return dispatch => {
        dispatch({
            type: `${actions.SEARCH_KEY_LOOKUP_LOADING}@${searchKey}`,
            payload: searchKey,
        });

        return get(
            SEARCH_INTERNAL_RECORDS_API({
                searchQueryParams: {
                    all: searchQuery,
                },
                page: 1,
                pageSize: 20,
                sortBy: 'score',
                sortDirection: 'Desc',
                facets: {},
            }),
        ).then(
            response => {
                dispatch({
                    type: `${actions.SEARCH_KEY_LOOKUP_LOADED}@${searchKey}`,
                    payload: response.data,
                });
            },
            error => {
                dispatch({
                    type: `${actions.SEARCH_KEY_LOOKUP_FAILED}@${searchKey}`,
                    payload: error.message,
                });
            },
        );
    };
}

export function loadRelatedServiceList(id) {
    const api = isValidROR(id)
        ? ROR_LOOKUP_API({ id: id })
        : SEARCH_INTERNAL_RECORDS_API({
              searchQueryParams: {
                  all: id,
              },
              page: 1,
              pageSize: 20,
              sortBy: 'score',
              sortDirection: 'Desc',
              facets: {},
          });

    return dispatch => {
        dispatch({
            type: actions.RELATED_SERVICE_LOOKUP_LOADING,
            payload: id,
        });

        return get(api).then(
            response => {
                const data = response.data;
                dispatch({
                    type: actions.RELATED_SERVICE_LOOKUP_LOADED,
                    payload: Array.isArray(data) ? data : [data],
                });
            },
            error => {
                dispatch({
                    type: actions.RELATED_SERVICE_LOOKUP_FAILED,
                    payload: error.message,
                });
            },
        );
    };
}

/**
 * Export publications list
 *
 * @param {array} publication list
 * @param {string} format
 * @returns {action}
 */
export function exportEspacePublications(searchParams) {
    return exportPublications(
        SEARCH_INTERNAL_RECORDS_API({ ...searchParams, facets: searchParams.activeFacets || {} }, 'export'),
    );
}

export function clearSearchQuery() {
    return dispatch => {
        dispatch({
            type: actions.CLEAR_SEARCH_QUERY,
        });
    };
}
