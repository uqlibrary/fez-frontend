import * as actions from './actionTypes';
import { get } from 'repositories/generic';

import { DOI_API } from 'repositories/routes';

export function updateDoi(pid) {
    return dispatch => {
        dispatch({ type: actions.RECORD_DOI_UPDATE_REQUESTING });
        return get(DOI_API({ pid })).then(
            response => {
                dispatch({ type: actions.RECORD_DOI_UPDATE_SUCCEEDED });
                return Promise.resolve(response);
            },
            error => {
                dispatch({ type: actions.RECORD_DOI_UPDATE_FAILED, payload: error.message });
                return Promise.reject(new Error(error.message));
            },
        );
    };
}
