import * as transformers from './transformers';
import * as actions from './actionTypes';
import {get, patch, post} from 'repositories/generic';
import * as routes from 'repositories/routes';
import * as repositories from 'repositories';

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
            .catch(error => {
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

/**
 * Fix record request: patch record, send issue to espace admins:
 *      update record with uploaded files, url
 *      send issue message to notify espace team
 *      upload files,
 * If error occurs on any stage failed action is displayed
 * @param {object} data to be posted, refer to backend API data: {publication, author, files}
 * @returns {action}
 */
export function fixRecord(data) {
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

    const hasFilesToUpload = data.files && data.files.queue && data.files.queue.length > 0;

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

        // if user updated links/added files - update record
        let patchRecordRequest = null;
        if (hasFilesToUpload || data.rek_link) {
            patchRecordRequest = {
                rek_pid: data.publication.rek_pid,
                ...transformers.getRecordLinkSearchKey(data),
                ...transformers.getRecordFileAttachmentSearchKey(data.files ? data.files.queue : [], data.publication)
            };
        }

        // create request for issue notification
        const createIssueRequest = transformers.getFixIssueRequest(data);

        return Promise.resolve([])
            .then(()=> (hasFilesToUpload ? repositories.putUploadFiles(data.publication.rek_pid, data.files.queue, dispatch) : null))
            .then(()=> (hasFilesToUpload || data.rek_link ? patch(routes.EXISTING_RECORD_API({pid: data.publication.rek_pid}), patchRecordRequest) : null))
            .then(()=> (post(routes.RECORDS_ISSUES_API({pid: data.publication.rek_pid}), createIssueRequest)))
            .then(responses => {
                dispatch({
                    type: actions.FIX_RECORD_SUCCESS,
                    payload: {
                        pid: data.publication.rek_pid
                    }
                });
                return Promise.resolve(responses);
            })
            .catch(error => {
                // dispatch an action if session failed
                if (error.status === 403) dispatch({type: actions.ACCOUNT_ANONYMOUS});
                dispatch({
                    type: actions.FIX_RECORD_FAILED,
                    payload: error.message
                });
                return Promise.reject(error);
            });
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
                payload: 'Incomplete data for requests.'
            });

            return Promise.reject({message: 'Incomplete data for requests.'});
        };
    }

    // TODO: special case for contributors required
    const isAuthorLinked = data.publication.fez_record_search_key_author_id && data.publication.fez_record_search_key_author_id.length > 0 &&
        data.publication.fez_record_search_key_author_id.filter(authorId => authorId.rek_author_id === data.author.aut_id).length > 0;

    if (!isAuthorLinked) {
        return dispatch => {
            dispatch({
                type: actions.FIX_RECORD_FAILED,
                payload: 'Current author is not linked to this record.'
            });
            return Promise.reject({message: 'Current author is not linked to this record.'});
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
            .then(response => {
                dispatch({
                    type: actions.FIX_RECORD_UNCLAIM_SUCCESS,
                    payload: {pid: data.publication.rek_pid}
                });
                return Promise.resolve(response);
            })
            .catch(error => {
                if (error.status === 403) dispatch({type: actions.ACCOUNT_ANONYMOUS});
                dispatch({type: actions.FIX_RECORD_FAILED});
                return Promise.reject({message: 'Failed patch record request.'});
            });
    };
}
