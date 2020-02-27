import { ISSN_SHERPA_LOADING, ISSN_SHERPA_LOADED, ISSN_SHERPA_LOAD_FAILED } from './actionTypes';
import { post } from 'repositories/generic';
import { ISSN_LINKS_API } from 'repositories/routes';

export const getSherpaFromIssn = issn => {
    return dispatch => {
        dispatch({ type: ISSN_SHERPA_LOADING });

        return post(ISSN_LINKS_API({ type: 'sherpa' }), { issn })
            .then(response => {
                dispatch({
                    type: ISSN_SHERPA_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: ISSN_SHERPA_LOAD_FAILED,
                    payload: error.message,
                });
            });
    };
};
