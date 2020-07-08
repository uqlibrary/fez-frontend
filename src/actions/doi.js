import * as actions from './actionTypes';
import { put } from 'repositories/generic';

import { EXISTING_RECORD_API } from 'repositories/routes';

export function updateDoi(record) {
    return dispatch => {
        dispatch({ type: actions.RECORD_DOI_UPDATE_REQUESTING });
        return put(EXISTING_RECORD_API({ pid: record.rek_pid }), record).then(
            response => {
                dispatch({
                    type: actions.RECORD_DOI_UPDATE_SUCCEEDED,
                    payload: {
                        pid: response.data,
                    },
                });
                return Promise.resolve(response);
            },
            error => {
                dispatch({ type: actions.RECORD_DOI_UPDATE_FAILED, payload: error.message });
                return Promise.reject(error);
            },
        );
    };
}

export function resetDoi() {
    return dispatch => dispatch({ type: actions.RECORD_DOI_RESET });
}
