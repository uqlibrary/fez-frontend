import * as transformer from './academicDataTransformers';
import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { ACADEMIC_STATS_PUBLICATION_HINDEX_API, AUTHOR_PUBLICATIONS_STATS_ONLY_API } from 'repositories/routes';

export function loadAuthorPublicationsStats(userName, authorDetails) {
    return dispatch => {
        dispatch({ type: actions.AUTHOR_PUBLICATIONS_STATS_LOADING });
        let statsData = null;
        let publicationTotalCount = null;
        return get(AUTHOR_PUBLICATIONS_STATS_ONLY_API({}))
            .then(response => {
                let data = [];
                let topPublicationTypes = [];
                let years = [];

                if (((response || {}).filters || {}).facets) {
                    data =
                        response.filters.facets.hasOwnProperty('Year published') &&
                        response.filters.facets['Year published'].buckets;
                    topPublicationTypes = transformer.getPublicationsPerType(data, 4);
                    years = transformer.getPublicationsPerYearCategories(data);
                    statsData = response !== null && transformer.getPublicationsStats(years, response.filters.facets);
                    publicationTotalCount =
                        response !== null && transformer.getAuthorArticleCount(response.total, authorDetails);
                }

                dispatch({
                    type: actions.AUTHOR_PUBLICATIONS_COUNT_PER_TYPE_LOADED,
                    payload: topPublicationTypes,
                });

                dispatch({
                    type: actions.AUTHOR_PUBLICATIONS_COUNT_TOTAL_LOADED,
                    payload: publicationTotalCount,
                });

                dispatch({
                    type: actions.AUTHOR_PUBLICATIONS_BY_YEAR_LOADED,
                    payload: {
                        series: transformer.getPublicationsPerYearSeries(data, topPublicationTypes),
                        categories: years,
                    },
                });

                return get(ACADEMIC_STATS_PUBLICATION_HINDEX_API({ userId: userName }));
            })
            .then(response => {
                if (response && response.hindex_scopus && statsData && statsData.scopus_citation_count_i) {
                    statsData.scopus_citation_count_i.hindex = response.hindex_scopus;
                }
                if (response && response.hindex_incites && statsData && statsData.thomson_citation_count_i) {
                    statsData.thomson_citation_count_i.hindex = response.hindex_incites;
                }
                dispatch({
                    type: actions.AUTHOR_PUBLICATIONS_STATS_LOADED,
                    payload: statsData,
                });
            })
            .catch(error => {
                if (!statsData) {
                    dispatch({
                        type: actions.AUTHOR_PUBLICATIONS_STATS_FAILED,
                        payload: error.message,
                    });
                } else {
                    dispatch({
                        type: actions.AUTHOR_PUBLICATIONS_STATS_LOADED,
                        payload: statsData,
                    });
                }
            });
    };
}
