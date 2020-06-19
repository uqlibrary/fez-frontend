import {
    ISSN_SHERPA_LOADING,
    ISSN_SHERPA_LOADED,
    ISSN_SHERPA_LOAD_FAILED,
    ISSN_ULRICHS_LOADING,
    ISSN_ULRICHS_LOADED,
    ISSN_ULRICHS_LOAD_FAILED,
} from './actionTypes';
import { get } from 'repositories/generic';
import { ISSN_LINKS_API } from 'repositories/routes';

/**
 * Returns the sherpa romeo details, cached in our db, for a specific issn
 * @param {string} issn
 * @returns {action}
 */
export const getSherpaFromIssn = issn => {
    return dispatch => {
        dispatch({ type: ISSN_SHERPA_LOADING, payload: issn });

        return get(ISSN_LINKS_API({ type: 'sherpa-romeo', issn: issn }))
            .then(response => {
                dispatch({
                    type: ISSN_SHERPA_LOADED,
                    payload: response.data.length > 0 ? { [issn]: response.data[0] } : {},
                });
            })
            .catch(error => {
                dispatch({
                    type: ISSN_SHERPA_LOAD_FAILED,
                    payload: {
                        [issn]: error.message,
                    },
                });
            });
    };
};

/**
 * Returns the ulrichs details, cached in our db, for a specific issn
 * @param {string} issn
 * @returns {action}
 */
export const getUlrichsFromIssn = issn => {
    return dispatch => {
        dispatch({ type: ISSN_ULRICHS_LOADING, payload: issn });

        return get(ISSN_LINKS_API({ type: 'ulrichs', issn: issn }))
            .then(response => {
                dispatch({
                    type: ISSN_ULRICHS_LOADED,
                    payload: response.data.length > 0 ? { [issn]: response.data[0] } : {},
                });
            })
            .catch(error => {
                dispatch({
                    type: ISSN_ULRICHS_LOAD_FAILED,
                    payload: {
                        [issn]: error.message,
                    },
                });
            });
    };
};
