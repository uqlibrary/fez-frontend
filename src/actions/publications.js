import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import * as routes from 'repositories/routes';
import {transformTrendingPublicationsMetricsData} from './academicDataTransformers';
import {promptForDownload} from './publicationDataTransformers';

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

function getTrendingPublications(page = 1, pageSize = 20, sortBy = 'altmetric_score', sortDirection = 'Desc', interval = '1m') {
    return get(routes.TRENDING_PUBLICATIONS_API({
        page: page,
        pageSize: pageSize,
        sortBy: sortBy,
        sortDirection: sortDirection,
        interval: interval
    }));
}

export function searchTopAltmetricCitedPublications(interval = '1m', source = 'altmetric', page = 1, pageSize = 20, sortBy = 'altmetric_score', sortDirection = 'Desc') {
    return dispatch => {
        dispatch({type: actions.TOP_ALTMETRIC_CITED_PUBLICATIONS_LOADING});
        return getTrendingPublications(page, pageSize, sortBy, sortDirection, interval)
            .then(response => {
                let result = response.data;
                if (response.data.length > 0) {
                    const transformedTopCitedPublications = transformTrendingPublicationsMetricsData(response);
                    for (const data of transformedTopCitedPublications) {
                        if (data.key === source) {
                            result = data.values;
                            break;
                        }
                    }
                }

                dispatch({
                    type: actions.TOP_ALTMETRIC_CITED_PUBLICATIONS_LOADED,
                    payload: {data: result}
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.TOP_ALTMETRIC_CITED_PUBLICATIONS_FAILED,
                    payload: error.message
                });
            });
    };
}

/**
 * Get top cited publications
 * @returns {action}
 */
export function searchTopCitedPublications({page = 1, pageSize = 20, source = 'scopus', sortBy = 'scopus_citation_count', sortDirection = 'Desc'}) {
    return dispatch => {
        dispatch({type: `${actions.TOP_CITED_PUBLICATIONS_LOADING}@${source}`, source: source});
        return getTrendingPublications(page, pageSize, sortBy, sortDirection)
            .then(response => {
                let result = response.data;
                if (response.data.length > 0) {
                    const transformedTopCitedPublications = transformTrendingPublicationsMetricsData(response);
                    for (const data of transformedTopCitedPublications) {
                        if (data.key === source) {
                            result = data.values;
                            break;
                        }
                    }
                }

                dispatch({
                    type: `${actions.TOP_CITED_PUBLICATIONS_LOADED}@${source}`,
                    source: source,
                    payload: {data: result},
                });
            })
            .catch(error => {
                dispatch({
                    type: `${actions.TOP_CITED_PUBLICATIONS_FAILED}@${source}`,
                    source: source,
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
export function exportAuthorPublications({exportFormat = '', page = 1, pageSize = 20, sortBy = 'published_date', sortDirection = 'Desc', activeFacets = {filters: {}, ranges: {}}}) {
    return dispatch => {
        dispatch({type: actions.EXPORT_PUBLICATIONS_LOADING});

        return get(
            routes.CURRENT_USER_RECORDS_API({
                exportFormat: exportFormat,
                page: page,
                pageSize: pageSize,
                sortBy: sortBy,
                sortDirection: sortDirection,
                facets: activeFacets
            }), {
                responseType: 'blob'
            })
            .then(response => {
                promptForDownload(exportFormat, response);

                dispatch({
                    type: actions.EXPORT_PUBLICATIONS_LOADED,
                    payload: exportFormat
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.EXPORT_PUBLICATIONS_FAILED,
                    payload: error.message
                });
            });
    };
}
