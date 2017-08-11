import * as transformer from './academicDataTransformers';

import {
    getAuthorPublicationsByYear
    // , getAuthorPublicationsHindex, getAuthorPublicationsStats
} from '../repositories';


export const ACADEMIC_PUBLICATIONS_BY_YEAR_LOADING = 'ACADEMIC_PUBLICATIONS_BY_YEAR_LOADING';
export const ACADEMIC_PUBLICATIONS_BY_YEAR_LOADED = 'ACADEMIC_PUBLICATIONS_BY_YEAR_LOADED';
export const ACADEMIC_PUBLICATIONS_COUNT_LOADED = 'ACADEMIC_PUBLICATIONS_COUNT_LOADED';
export const ACADEMIC_PUBLICATIONS_BY_YEAR_FAILED = 'ACADEMIC_PUBLICATIONS_BY_YEAR_FAILED';


/**
 * Load a list of file access types from fez, eg open access, embargo, etc
 */
export function loadAuthorPublicationsByYear(userName) {
    return dispatch => {
        dispatch({type: ACADEMIC_PUBLICATIONS_BY_YEAR_LOADING});

        getAuthorPublicationsByYear(userName).then(response => {
            const data = response !== null && response.hasOwnProperty('facet_counts')
            && response.facet_counts.hasOwnProperty('facet_pivot') ?
                response.facet_counts.facet_pivot['date_year_t,display_type_i_lookup_exact'] : [];

            const topPublicationTypes = transformer.getPublicationsPerType(data, 4);
            dispatch({
                type: ACADEMIC_PUBLICATIONS_COUNT_LOADED,
                payload: topPublicationTypes
            });
            dispatch({
                type: ACADEMIC_PUBLICATIONS_BY_YEAR_LOADED,
                payload: {
                    series: transformer.getPublicationsPerYearSeries(data, topPublicationTypes),
                    categories: transformer.getPublicationsPerYearCategories(data)
                }
            });
        }).catch((error) => {
            dispatch({
                type: ACADEMIC_PUBLICATIONS_BY_YEAR_FAILED,
                payload: error
            });
        });
    };
}
