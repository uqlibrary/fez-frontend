import {
    ISSN_SHERPA_LOADING,
    ISSN_SHERPA_LOADED,
    ISSN_SHERPA_LOAD_FAILED,
    ISSN_ULRICHS_LOADING,
    ISSN_ULRICHS_LOADED,
    ISSN_ULRICHS_LOAD_FAILED,
} from './actionTypes';
import { post } from 'repositories/generic';
import { ISSN_LINKS_API } from 'repositories/routes';

export const getSherpaFromIssn = issn => {
    return dispatch => {
        dispatch({ type: ISSN_SHERPA_LOADING, payload: issn });

        return post(ISSN_LINKS_API({ type: 'sherpa-romeo' }), { issn })
            .then(response => {
                dispatch({
                    type: ISSN_SHERPA_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: ISSN_SHERPA_LOAD_FAILED,
                    payload: {
                        issn,
                        message: error.message,
                    },
                });
            });
    };
};

export const getUlrichsFromIssn = issn => {
    return dispatch => {
        dispatch({ type: ISSN_ULRICHS_LOADING, payload: issn });

        return post(ISSN_LINKS_API({ type: 'ulrichs' }), { issn })
            .then(response => {
                dispatch({
                    type: ISSN_ULRICHS_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: ISSN_ULRICHS_LOAD_FAILED,
                    payload: {
                        issn,
                        message: error.message,
                    },
                });
            });
    };
};
