import * as transformers from './transformers';
import * as actions from './actionTypes';
import { get, patch, post } from 'repositories/generic';
import {
    EXISTING_RECORD_API,
    RECORDS_ISSUES_API,
    HIDE_POSSIBLE_RECORD_API,
    MAKE_OPEN_ACCESS_API,
} from 'repositories/routes';
import { putUploadFiles } from 'repositories';

/**
 * Load publication
 * @param {string}
 * @returns {action}
 */
export function loadRecordToFix(pid) {
    return dispatch => {
        dispatch({ type: actions.FIX_RECORD_LOADING });

        return get(EXISTING_RECORD_API({ pid: pid }))
            .then(response => {
                dispatch({
                    type: actions.FIX_RECORD_LOADED,
                    payload: response.data,
                });

                return Promise.resolve(response.data);
            })
            .catch(error => {
                dispatch({
                    type: actions.FIX_RECORD_LOAD_FAILED,
                    payload: error.message,
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
            payload: record,
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
            type: actions.FIX_RECORD_CLEAR,
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
 * @param {boolean} [myOpenAccess=false] indicates if the fix request is for "my open access" compliance
 * @returns {Promise}
 */
export function fixRecord(data, myOpenAccess = false) {
    if (!data.publication || !data.author) {
        return dispatch => {
            dispatch({
                type: actions.FIX_RECORD_FAILED,
                payload: 'Incomplete data for requests',
            });

            return Promise.reject(new Error('Incomplete data for requests'));
        };
    }

    const isAuthorLinked =
        data.publication.fez_record_search_key_author_id &&
        data.publication.fez_record_search_key_author_id.length > 0 &&
        data.publication.fez_record_search_key_author_id.filter(
            authorId => authorId.rek_author_id === data.author.aut_id,
        ).length > 0;

    const isContributorLinked =
        data.publication.fez_record_search_key_contributor_id &&
        data.publication.fez_record_search_key_contributor_id.length > 0 &&
        data.publication.fez_record_search_key_contributor_id.filter(
            contributorId => contributorId.rek_contributor_id === data.author.aut_id,
        ).length > 0;

    const hasFilesToUpload = data.files && data.files.queue && data.files.queue.length > 0;

    const hasAddedContentIndicators =
        !!data.contentIndicators &&
        data.contentIndicators.length > (data.publication.fez_record_search_key_content_indicator || []).length;

    if (!isAuthorLinked && !isContributorLinked) {
        return dispatch => {
            dispatch({
                type: actions.FIX_RECORD_FAILED,
                payload: 'Current author is not linked to this record',
            });
            return Promise.reject(new Error('Current author is not linked to this record'));
        };
    }

    return dispatch => {
        dispatch({ type: actions.FIX_RECORD_PROCESSING });

        // if user updated links/added files - update record
        let patchRecordRequest = null;
        if (hasFilesToUpload || data.rek_link || hasAddedContentIndicators) {
            patchRecordRequest = {
                rek_pid: data.publication.rek_pid,
                ...transformers.getRecordLinkSearchKey(data),
                ...transformers.getRecordFileAttachmentSearchKey(data.files ? data.files.queue : [], data.publication),
                ...transformers.getContentIndicatorSearchKey(data.contentIndicators || null),
            };
        }

        // create request for issue notification
        const createIssueRequest = transformers.getFixIssueRequest(data);

        return Promise.resolve([])
            .then(() =>
                hasFilesToUpload ? putUploadFiles(data.publication.rek_pid, data.files.queue, dispatch) : null,
            )
            .then(() =>
                hasFilesToUpload || data.rek_link || hasAddedContentIndicators
                    ? patch(EXISTING_RECORD_API({ pid: data.publication.rek_pid }), patchRecordRequest)
                    : null,
            )
            .then(() => {
                return post(
                    !myOpenAccess
                        ? RECORDS_ISSUES_API({ pid: data.publication.rek_pid })
                        : MAKE_OPEN_ACCESS_API({ pid: data.publication.rek_pid }),
                    createIssueRequest,
                );
            })
            .then(responses => {
                dispatch({
                    type: actions.FIX_RECORD_SUCCESS,
                    payload: {
                        pid: data.publication.rek_pid,
                    },
                });
                return Promise.resolve(responses);
            })
            .catch(error => {
                dispatch({
                    type: actions.FIX_RECORD_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}

/**
 * Unclaim record
 * @param   {object}  data    Record to be unclaimed
 * @returns {Promise}
 */
export function unclaimRecord(data) {
    if (!data.publication || !data.author) {
        return dispatch => {
            dispatch({
                type: actions.FIX_RECORD_FAILED,
                payload: 'Incomplete data for requests.',
            });

            return Promise.reject(new Error('Incomplete data for requests.'));
        };
    }

    const isAuthorLinked =
        data.publication.fez_record_search_key_author_id &&
        data.publication.fez_record_search_key_author_id.length > 0 &&
        data.publication.fez_record_search_key_author_id.filter(
            authorId => authorId.rek_author_id === data.author.aut_id,
        ).length > 0;

    const isContributorLinked =
        data.publication.fez_record_search_key_contributor_id &&
        data.publication.fez_record_search_key_contributor_id.length > 0 &&
        data.publication.fez_record_search_key_contributor_id.filter(
            contributorId => contributorId.rek_contributor_id === data.author.aut_id,
        ).length > 0;

    if (!isAuthorLinked && !isContributorLinked) {
        return dispatch => {
            dispatch({
                type: actions.FIX_RECORD_FAILED,
                payload: 'Current author is not linked to this record.',
            });
            return Promise.reject(new Error('Current author is not linked to this record.'));
        };
    }

    return dispatch => {
        dispatch({ type: actions.FIX_RECORD_PROCESSING });

        // PATCH record (with the rek_author_id set to 0)
        const patchRecordRequest = {
            rek_pid: data.publication.rek_pid,
            ...transformers.unclaimRecordAuthorsIdSearchKey(
                data.publication.fez_record_search_key_author_id,
                data.author.aut_id,
            ),
            ...transformers.unclaimRecordContributorsIdSearchKey(
                data.publication.fez_record_search_key_contributor_id,
                data.author.aut_id,
            ),
        };

        return patch(EXISTING_RECORD_API({ pid: data.publication.rek_pid }), patchRecordRequest)
            .then(() => post(HIDE_POSSIBLE_RECORD_API(), { pid: data.publication.rek_pid, type: 'H' }))
            .then(response => {
                dispatch({
                    type: actions.FIX_RECORD_UNCLAIM_SUCCESS,
                    payload: { pid: data.publication.rek_pid },
                });
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.FIX_RECORD_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}
