import { post, patch } from 'repositories/generic';
import { NEW_RECORD_API, EXISTING_RECORD_API, RECORDS_ISSUES_API } from 'repositories/routes';
import { putUploadFiles } from 'repositories';
import * as transformers from './transformers';
import { NEW_RECORD_DEFAULT_VALUES } from 'config/general';
import * as actions from './actionTypes';

/**
 * Save a new admin record involves up to three steps: create a new record, upload files,
 * update record with uploaded files. If error occurs on any stage failed action is dispatched
 * @param {object} data to be posted, refer to backend API
 * @returns {promise} - this method is used by redux form onSubmit which requires Promise resolve/reject as a return
 */
export function createNewAdminRecord(data) {
    return dispatch => {
        dispatch({ type: actions.CREATE_ADMIN_RECORD_SAVING });
        // set default values, links
        const recordRequest = {
            ...NEW_RECORD_DEFAULT_VALUES,
            ...JSON.parse(JSON.stringify(data)),
        };

        // delete extra form values from request object
        const keysToDelete = [];
        keysToDelete.forEach(key => {
            delete recordRequest[key];
        });

        let newRecord = null;
        const hasFilesToUpload = data.files && data.files.queue && data.files.queue.length > 0;
        const recordPatch = hasFilesToUpload ? transformers.getRecordFileAttachmentSearchKey(data.files.queue) : null;

        return post(NEW_RECORD_API(), recordRequest)
            .then(response => {
                // save new record response
                newRecord = response.data;
                return response;
            })
            .then(() => (hasFilesToUpload ? putUploadFiles(newRecord.rek_pid, data.files.queue, dispatch) : newRecord))
            .then(() =>
                hasFilesToUpload ? patch(EXISTING_RECORD_API({ pid: newRecord.rek_pid }), recordPatch) : newRecord,
            )
            .then(() =>
                data.comments
                    ? post(RECORDS_ISSUES_API({ pid: newRecord.rek_pid }), {
                        issue: 'Notes from creator of the new record: ' + data.comments,
                    })
                    : newRecord,
            )
            .then(response => {
                dispatch({
                    type: actions.CREATE_ADMIN_RECORD_SUCCESS,
                    payload: {
                        newRecord: response.data ? response.data : newRecord,
                        fileUploadOrIssueFailed: false,
                    },
                });
                return Promise.resolve(response.data ? response.data : newRecord);
            })
            .catch(error => {
                // record was created, but file upload or record patch failed or issue post failed
                if (!!newRecord && !!newRecord.rek_pid) {
                    dispatch({
                        type: actions.CREATE_ADMIN_RECORD_SUCCESS,
                        payload: {
                            newRecord: newRecord,
                            fileUploadOrIssueFailed: true,
                        },
                    });

                    return Promise.resolve(newRecord);
                }

                dispatch({
                    type: actions.CREATE_ADMIN_RECORD_FAILED,
                    payload: error.message,
                });

                return Promise.reject(error);
            });
    };
}
