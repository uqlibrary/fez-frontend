import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import * as routes from 'repositories/routes';
import {transformTrendingPublicationsMetricsData} from './academicDataTransformers';
import {exportPublications} from './exportPublications';

/**
 * Get latest publications
 * @param {string} author user name
 * @returns {action}
 */
export function searchLatestPublications() {
    return dispatch => {
        dispatch({type: actions.LATEST_PUBLICATIONS_LOADING});
        return get(routes.CURRENT_USER_RECORDS_API({pageSize: 5}))
            .then(response => {
                dispatch({
                    type: actions.LATEST_PUBLICATIONS_LOADED,
                    payload: response
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.LATEST_PUBLICATIONS_FAILED,
                    payload: error.message
                });
            });
    };
}

/**
 * Get top cited publications
 * @returns {action}
 */
export function searchTopCitedPublications() {
    return dispatch => {
        dispatch({type: actions.TOP_CITED_PUBLICATIONS_LOADING});
        return get(routes.TRENDING_PUBLICATIONS_API())
            .then(response => {
                if (response.data.length > 0) {
                    const transformedTopCitedPublications = transformTrendingPublicationsMetricsData(response);

                    transformedTopCitedPublications.map(({key, values}) => {
                        dispatch({
                            type: `${actions.TOP_CITED_PUBLICATIONS_LOADED}@${key}`,
                            payload: {data: values},
                        });
                    });
                } else {
                    dispatch({
                        type: actions.TOP_CITED_PUBLICATIONS_LOADED,
                        payload: response,
                    });
                }
            })
            .catch(error => {
                dispatch({
                    type: actions.TOP_CITED_PUBLICATIONS_FAILED,
                    payload: error.message
                });
            });
    };
}

/**
 * Get author's publications
 * @param {string} author user name
 * @returns {action}
 */
export function searchAuthorPublications({page = 1, pageSize = 20, sortBy = 'published_date', sortDirection = 'Desc', activeFacets = {filters: {}, ranges: {}}}) {
    return dispatch => {
        dispatch({type: actions.AUTHOR_PUBLICATIONS_LOADING});

        return get(routes.CURRENT_USER_RECORDS_API({
            page: page,
            pageSize: pageSize,
            sortBy: sortBy,
            sortDirection: sortDirection,
            facets: activeFacets
        }))
            .then(response => {
                dispatch({
                    type: actions.AUTHOR_PUBLICATIONS_LOADED,
                    payload: response
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.AUTHOR_PUBLICATIONS_FAILED,
                    payload: error.message
                });
            });
    };
}

/**
 * Get trending publications
 * @param {string} author user name
 * @returns {action}
 */
export function searchTrendingPublications() {
    return dispatch => {
        dispatch({type: actions.TRENDING_PUBLICATIONS_LOADING});
        return get(routes.ACADEMIC_STATS_PUBLICATIONS_TRENDING_API())
            .then(response => {
                if (response.data.length > 0) {
                    const transformedTrendingPublications = transformTrendingPublicationsMetricsData(response);

                    transformedTrendingPublications.map(({key, values}) => {
                        dispatch({
                            type: `${actions.TRENDING_PUBLICATIONS_LOADED}@${key}`,
                            payload: {data: values},
                        });
                    });
                } else {
                    dispatch({
                        type: actions.TRENDING_PUBLICATIONS_LOADED,
                        payload: response
                    });
                }
            })
            .catch(error => {
                dispatch({
                    type: actions.TRENDING_PUBLICATIONS_FAILED,
                    payload: error.message
                });
            });
    };
}

/**
 * Export publications list
 * @param {array} publication list
 * @param {string} format
 * @returns {action}
 */
export function exportAuthorPublications({exportPublicationsFormat = '', page = 1, pageSize = 20, sortBy = 'published_date', sortDirection = 'Desc', activeFacets = {filters: {}, ranges: {}}}) {
    return exportPublications(routes.CURRENT_USER_RECORDS_API(
        {
            exportPublicationsFormat: exportPublicationsFormat,
            page: page,
            pageSize: pageSize,
            sortBy: sortBy,
            sortDirection: sortDirection,
            facets: activeFacets
        },
        'export'
    ));
}
