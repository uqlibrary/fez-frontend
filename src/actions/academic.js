import * as transformer from './academicDataTransformers';
import * as actions from './actionTypes';
import * as repositories from 'repositories';

/**
 * Returns the author's publications per year
 * @param {string} user name
 * @returns {action}
 */
export function loadAuthorPublicationsByYear(userName) {
    return dispatch => {
        dispatch({type: actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADING});
        return repositories.get(repositories.routes.ACADEMIC_STATS_PUBLICATION_YEARS_API({userId: userName}))
            .then(response => {
                const data = response !== null && response.hasOwnProperty('facet_counts')
                && response.facet_counts.hasOwnProperty('facet_pivot') ?
                    response.facet_counts.facet_pivot['date_year_t,display_type_i_lookup_exact'] : [];

                const topPublicationTypes = transformer.getPublicationsPerType(data, 4);
                dispatch({
                    type: actions.ACADEMIC_PUBLICATIONS_COUNT_LOADED,
                    payload: topPublicationTypes
                });
                dispatch({
                    type: actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADED,
                    payload: {
                        series: transformer.getPublicationsPerYearSeries(data, topPublicationTypes),
                        categories: transformer.getPublicationsPerYearCategories(data)
                    }
                });
            })
            .catch(error => {
                if (error.status === 403) dispatch({type: actions.CURRENT_ACCOUNT_ANONYMOUS});
                dispatch({
                    type: actions.ACADEMIC_PUBLICATIONS_BY_YEAR_FAILED,
                    payload: error
                });
            });
    };
}

/**
 * Returns the author's publications stats
 * @param {string} user name
 * @returns {action}
 */
export function loadAuthorPublicationsStats(userName) {
    return dispatch => {
        dispatch({type: actions.ACADEMIC_PUBLICATIONS_STATS_LOADING});
        let statsData = null;
        return repositories.get(repositories.routes.ACADEMIC_STATS_PUBLICATION_STATS_API({userId: userName}))
            .then(response => {
                statsData = transformer.getPublicationsStats(response);
                return repositories.get(repositories.routes.ACADEMIC_STATS_PUBLICATION_HINDEX_API({userId: userName}));
            })
            .then(response => {
                if (response && response.hindex_scopus && statsData && statsData.scopus_citation_count_i) {
                    statsData.scopus_citation_count_i.hindex = response.hindex_scopus;
                }
                if (response && response.hindex_incites && statsData && statsData.thomson_citation_count_i) {
                    statsData.thomson_citation_count_i.hindex = response.hindex_incites;
                }
                dispatch({
                    type: actions.ACADEMIC_PUBLICATIONS_STATS_LOADED,
                    payload: statsData
                });
            })
            .catch(error => {
                if (error.status === 403) dispatch({type: actions.CURRENT_ACCOUNT_ANONYMOUS});
                if (!statsData) {
                    dispatch({
                        type: actions.ACADEMIC_PUBLICATIONS_STATS_FAILED,
                        payload: statsData
                    });
                } else {
                    dispatch({
                        type: actions.ACADEMIC_PUBLICATIONS_STATS_LOADED,
                        payload: error
                    });
                }
            });
    };
}
