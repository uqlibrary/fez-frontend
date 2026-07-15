import * as transformer from './academicDataTransformers';
import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { ACADEMIC_STATS_PUBLICATION_HINDEX_API, AUTHOR_STATS_BY_AUTHOR_ID_API } from 'repositories/routes';

export function loadAuthorStatsByAuthorId(authorId, username) {
    return dispatch => {
        dispatch({ type: actions.AUTHOR_STATS_LOADING });
        let statsData = null;
        return get(AUTHOR_STATS_BY_AUTHOR_ID_API({ authorId }))
            .then(response => {
                let data = [];
                let topPublicationTypes = [];
                let years = [];

                if (((response || {}).filters || {}).facets) {
                    data = response.filters.facets?.['Year published']?.buckets || [];
                    topPublicationTypes = transformer.getPublicationsPerType(data, 4);
                    years = transformer.getPublicationsPerYearCategories(data);
                    statsData = transformer.getPublicationsStats(years, response.filters.facets);
                }

                dispatch({ type: actions.AUTHOR_STATS_PER_TYPE_LOADED, payload: topPublicationTypes });
                dispatch({
                    type: actions.AUTHOR_STATS_BY_YEAR_LOADED,
                    payload: {
                        series: transformer.getPublicationsPerYearSeries(data, topPublicationTypes),
                        categories: years,
                    },
                });

                if (username) {
                    return get(ACADEMIC_STATS_PUBLICATION_HINDEX_API({ userId: username }));
                }
                return null;
            })
            .then(response => {
                if (response && response.hindex_scopus && statsData?.scopus_citation_count_i) {
                    statsData.scopus_citation_count_i.hindex = response.hindex_scopus;
                }
                if (response && response.hindex_incites && statsData?.thomson_citation_count_i) {
                    statsData.thomson_citation_count_i.hindex = response.hindex_incites;
                }
                dispatch({ type: actions.AUTHOR_STATS_LOADED, payload: statsData });
            })
            .catch(error => {
                if (!statsData) {
                    dispatch({ type: actions.AUTHOR_STATS_FAILED, payload: error.message });
                } else {
                    dispatch({ type: actions.AUTHOR_STATS_LOADED, payload: statsData });
                }
            });
    };
}
