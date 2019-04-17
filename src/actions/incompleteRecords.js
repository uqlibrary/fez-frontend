import * as actions from './actionTypes';
import {get, post} from 'repositories/generic';
import {INCOMPLETE_RECORD_SAVE_API, CURRENT_USER_INCOMPLETE_RECORDS_API} from 'repositories/routes';
import * as transformers from './transformers';

/**
 * Load a list of incomplete NTRO Records from fez
 * @returns {action}
 */
export function loadIncompleteRecords() {
    return dispatch => {
        dispatch({type: actions.INCOMPLETE_RECORDS_LOADING});

        return get(CURRENT_USER_INCOMPLETE_RECORDS_API())
            .then(response => {
                dispatch({
                    type: actions.INCOMPLETE_RECORDS_LOADED,
                    payload: response
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.INCOMPLETE_RECORDS_FAILED,
                    payload: error.message
                });
            });
    };
}


/**
 * Fix record request: patch record, send issue to espace admins:
 *      update record with uploaded files, url
 *      send issue message to notify espace team
 *      upload files,
 * If error occurs on any stage failed action is displayed
 * @param {object} data to be posted, refer to backend API data: {publication, author, files}
 * @returns {promise} - this method is used by redux form onSubmit which requires Promise resolve/reject as a return
 */
export function patchIncompleteRecord(data) {
    // if (!data.publication || !data.author) {
    //     return dispatch => {
    //         dispatch({
    //             type: actions.INCOMPLETE_RECORD_SAVE_FAILED,
    //             payload: 'Incomplete data for requests'
    //         });
    //
    //         return Promise.reject(new Error('Incomplete data for requests'));
    //     };
    // }
    console.log('patchIncompleteRecord');
    console.log(data);

    return dispatch => {
        dispatch({
            type: actions.INCOMPLETE_RECORD_SAVE_PROCESSING,
            payload: data
        });

        // create request for notification
        const createIncompleteRequest = transformers.getIncompleteRequestFields(data);

        return Promise.resolve([])
            .then(()=> (post(INCOMPLETE_RECORD_SAVE_API({pid: data.publication.rek_pid}), createIncompleteRequest)))
            .then(responses => {
                dispatch({
                    type: actions.INCOMPLETE_RECORD_SAVE_SUCCESS,
                    payload: {
                        pid: data.publication.rek_pid
                    }
                });
                return Promise.resolve(responses);
            })
            .catch(error => {
                dispatch({
                    type: actions.INCOMPLETE_RECORD_SAVE_FAILED,
                    payload: error.message
                });
                return Promise.reject(error);
            });
    };
}
