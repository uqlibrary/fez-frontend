import * as transformer from './academicDataTransformers';
import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import * as routes from 'repositories/routes';

export function loadAuthorPublicationsStats(userName) {
    return dispatch => {
        dispatch({type: actions.ACADEMIC_PUBLICATIONS_STATS_LOADING});
        let statsData = null;
        let authorArticleCount = null;
        return get(routes.ACADEMIC_PUBLICATIONS_STATS_API({}))
            .then(response => {
                let data = [];
                let topPublicationTypes = [];
                let years = [];

                if (response !== null && response.hasOwnProperty('filters') && response.filters.hasOwnProperty('facets')) {
                    data = response.filters.facets.hasOwnProperty('Year published') && response.filters.facets['Year published'].buckets;
                    topPublicationTypes = transformer.getPublicationsPerType(data, 4);
                    years = transformer.getPublicationsPerYearCategories(data);
                    statsData = response !== null && transformer.getPublicationsStats(years, response.filters.facets);
                    authorArticleCount = response !== null && transformer.getAuthorArticleCount(response.total, response.filters.facets);
                }

                dispatch({
                    type: actions.ACADEMIC_PUBLICATIONS_COUNT_PER_TYPE_LOADED,
                    payload: topPublicationTypes
                });

                dispatch({
                    type: actions.ACADEMIC_PUBLICATIONS_COUNT_TOTAL_LOADED,
                    payload: authorArticleCount
                });

                dispatch({
                    type: actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADED,
                    payload: {
                        series: transformer.getPublicationsPerYearSeries(data, topPublicationTypes),
                        categories: years
                    }
                });

                return get(routes.ACADEMIC_STATS_PUBLICATION_HINDEX_API({userId: userName}));
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
                if (!statsData) {
                    dispatch({
                        type: actions.ACADEMIC_PUBLICATIONS_STATS_FAILED,
                        payload: error.message
                    });
                } else {
                    dispatch({
                        type: actions.ACADEMIC_PUBLICATIONS_STATS_LOADED,
                        payload: statsData
                    });
                }
            });
    };
}
