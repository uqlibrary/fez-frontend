import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import * as routes from 'repositories/routes';
import { transformTrendingPublicationsMetricsData } from './academicDataTransformers';
import { exportPublications } from './exportPublications';

/**
 * Get latest publications
 * @param {string} author user name
 * @returns {action}
 */
export function searchLatestPublications() {
    return dispatch => {
        dispatch({ type: actions.LATEST_PUBLICATIONS_LOADING });
        return get(
            routes.CURRENT_USER_RECORDS_API({
                pageSize: 5,
                sortBy: 'published_date',
                sortDirection: 'desc',
            }),
        )
            .then(response => {
                dispatch({
                    type: actions.LATEST_PUBLICATIONS_LOADED,
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.LATEST_PUBLICATIONS_FAILED,
                    payload: error.message,
                });
            });
    };
}

/**
 * Get top cited publications
 * @returns {action}
 */
export function searchTopCitedPublications(recordsPerSource = 20) {
    return dispatch => {
        dispatch({ type: actions.TOP_CITED_PUBLICATIONS_LOADING });
        return get(routes.TRENDING_PUBLICATIONS_API())
            .then(response => {
                const transformedTopCitedPublications =
                    !!response.data &&
                    response.data.length > 0 &&
                    transformTrendingPublicationsMetricsData(response, recordsPerSource);
                if (transformedTopCitedPublications.length > 0) {
                    transformedTopCitedPublications.map(({ key, values }) => {
                        dispatch({
                            type: `${actions.TOP_CITED_PUBLICATIONS_LOADED}@${key}`,
                            payload: { data: values },
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
                    payload: error.message,
                });
            });
    };
}

function searchAuthorPublicationsApiEndpoint(type) {
    switch (type) {
        case 'mine':
        case 'datasets':
            return routes.CURRENT_USER_RECORDS_API;
        case 'incomplete':
            return routes.INCOMPLETE_RECORDS_API;
        case 'oacompliance':
            return routes.OACOMPLIANCE_RECORDS_API;
        default:
            throw new Error('Please provide valid type');
    }
}

/**
 * Get author's publications
 * @param {string} author user name
 * @returns {action}
 */
export function searchAuthorPublications(
    { page = 1, pageSize = 20, sortBy = 'score', sortDirection = 'Desc', activeFacets = { filters: {}, ranges: {} } },
    type = 'mine',
) {
    return dispatch => {
        dispatch({ type: `${actions.AUTHOR_PUBLICATIONS_LOADING}@${type}` });

        return get(
            searchAuthorPublicationsApiEndpoint(type)({
                page: page,
                pageSize: pageSize,
                sortBy: sortBy,
                sortDirection: sortDirection,
                facets: activeFacets,
            }),
        )
            .then(response => {
                dispatch({
                    type: `${actions.AUTHOR_PUBLICATIONS_LOADED}@${type}`,
                    payload: { ...response },
                });
            })
            .catch(error => {
                dispatch({
                    type: `${actions.AUTHOR_PUBLICATIONS_FAILED}@${type}`,
                    payload: error.message,
                });
            });
    };
}

/**
 * Get trending publications
 * @param {string} author user name
 * @returns {action}
 */
export function searchTrendingPublications(recordsPerSource = 5) {
    return dispatch => {
        dispatch({ type: actions.TRENDING_PUBLICATIONS_LOADING });
        return get(routes.AUTHOR_TRENDING_PUBLICATIONS_API())
            .then(response => {
                const transformedTrendingPublications =
                    !!response.data &&
                    response.data.length > 0 &&
                    transformTrendingPublicationsMetricsData(response, recordsPerSource);
                if (transformedTrendingPublications.length > 0) {
                    transformedTrendingPublications.map(({ key, values }) => {
                        dispatch({
                            type: `${actions.TRENDING_PUBLICATIONS_LOADED}@${key}`,
                            payload: { data: values },
                        });
                    });
                } else {
                    dispatch({
                        type: actions.TRENDING_PUBLICATIONS_LOADED,
                        payload: { data: [] },
                    });
                }
            })
            .catch(error => {
                dispatch({
                    type: actions.TRENDING_PUBLICATIONS_FAILED,
                    payload: error.message,
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
export function exportAuthorPublications({
    exportPublicationsFormat = '',
    page = 1,
    pageSize = 20,
    sortBy = 'score',
    sortDirection = 'Desc',
    activeFacets = { filters: {}, ranges: {} },
}) {
    return exportPublications(
        routes.CURRENT_USER_RECORDS_API(
            {
                exportPublicationsFormat: exportPublicationsFormat,
                page: page,
                pageSize: pageSize,
                sortBy: sortBy,
                sortDirection: sortDirection,
                facets: activeFacets,
            },
            'export',
        ),
    );
}
