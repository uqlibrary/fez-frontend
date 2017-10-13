import * as transformers from './transformers';
import * as actions from './actionTypes';
import {get, patch} from 'repositories/generic';
import * as routes from 'repositories/routes';
// import * as repositories from 'repositories';

/**
 * Load publication
 * @param {object}
 * @returns {action}
 */
export function loadRecordToFix(pid) {
    return dispatch => {
        dispatch({type: actions.FIX_RECORD_LOADING});

        get(routes.EXISTING_RECORD_API({pid: pid}))
            .then(response => {
                dispatch({
                    type: actions.FIX_RECORD_LOADED,
                    payload: response.data
                });
            })
            .catch((error) => {
                if (error.status === 403) dispatch({type: actions.ACCOUNT_ANONYMOUS});
                dispatch({
                    type: actions.FIX_RECORD_LOAD_FAILED,
                    payload: error
                });
            });
    };
}

/**
 * Set record to be fixed/unclaimedd
 * @param {object}
 * @returns {action}
 */
export function setFixRecord(record) {
    return dispatch => {
        dispatch({
            type: actions.FIX_RECORD_SET,
            payload: record
        });
    };
}

/**
 * Clear record to be fixed
 * @returns {action}
 */
export function clearFixRecord() {
    return dispatch => {
        dispatch({
            type: actions.FIX_RECORD_CLEAR
        });
    };
}

// TODO: fix record implementation
export function fixRecord(data) {
    console.log('fixing record...');
    console.log(data);
    return dispatch => {
        dispatch({type: actions.FIX_RECORD_PROCESSING});
        return Promise.resolve('DONE!');
    };
}

/**
 * Unclaim record
 * @param {object} - record to be unclaimed
 * @returns {action}
 */
export function unclaimRecord(data) {
    if (!data.publication || !data.author) {
        return dispatch => {
            dispatch({
                type: actions.FIX_RECORD_FAILED,
                payload: 'Incomplete data for requests'
            });

            return Promise.reject({message: 'Incomplete data for requests'});
        };
    }

    const isAuthorLinked = data.publication.fez_record_search_key_author_id && data.publication.fez_record_search_key_author_id.length > 0 &&
        data.publication.fez_record_search_key_author_id.filter(authorId => authorId.rek_author_id === data.author.aut_id).length > 0;

    if (!isAuthorLinked) {
        return dispatch => {
            dispatch({
                type: actions.FIX_RECORD_FAILED,
                payload: 'Current author is not linked to this record'
            });
            return Promise.reject({message: 'Current author is not linked to this record'});
        };
    }

    return dispatch => {
        dispatch({type: actions.FIX_RECORD_PROCESSING});

        // PATCH record (with the rek_author_id set to 0)
        const patchRecordRequest = {
            rek_pid: data.publication.rek_pid,
            ...transformers.unclaimRecordAuthorsIdSearchKey(data.publication.fez_record_search_key_author_id, data.author.aut_id)
        };

        return patch(routes.EXISTING_RECORD_API({pid: data.publication.rek_pid}), patchRecordRequest)
            .then((response) => {
                dispatch({
                    type: actions.FIX_RECORD_UNCLAIM_SUCCESS,
                    payload: {pid: data.publication.rek_pid}
                });
                return Promise.resolve(response);
            })
            .catch((error) => {
                if (error.status === 403) dispatch({type: actions.ACCOUNT_ANONYMOUS});
                dispatch({type: actions.FIX_RECORD_FAILED});
                return Promise.reject({message: 'Failed patch record request'});
            });
    };
}
