import {
    getAuthorPublicationsByYear
    // , getAuthorPublicationsHindex, getAuthorPublicationsStats
} from '../repositories';

export const ACADEMIC_PUBLICATIONS_BY_YEAR_LOADING = 'ACADEMIC_PUBLICATIONS_BY_YEAR_LOADING';
export const ACADEMIC_PUBLICATIONS_BY_YEAR_LOADED = 'ACADEMIC_PUBLICATIONS_BY_YEAR_LOADED';
export const ACADEMIC_PUBLICATIONS_BY_YEAR_FAILED = 'ACADEMIC_PUBLICATIONS_BY_YEAR_FAILED';


/**
 * Load a list of file access types from fez, eg open access, embargo, etc
 */
export function loadAuthorPublicationsByYear(userName) {
    return dispatch => {
        dispatch({type: ACADEMIC_PUBLICATIONS_BY_YEAR_LOADING});

        console.log('ACADEMIC_PUBLICATIONS_BY_YEAR_LOADING');

        getAuthorPublicationsByYear(userName).then(response => {
            dispatch({
                type: ACADEMIC_PUBLICATIONS_BY_YEAR_LOADED,
                payload: response
            });

            // dispatch({
            //     type: ACADEMIC_PUBLICATIONS_BY_YEAR_LOADED,
            //     payload: {
            //         series: [];
            //
            //     }
            // });

            // data: [
            //     ['Journal articles', 329],
            //     ['Conference papers', 112],
            //     ['Magazine articles', 106],
            //     ['Other', 12]
            // ]
        }).catch((error) => {
            dispatch({
                type: ACADEMIC_PUBLICATIONS_BY_YEAR_FAILED,
                payload: error
            });
        });
    };
}
