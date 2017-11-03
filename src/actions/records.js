import {post, patch} from 'repositories/generic';
import * as routes from 'repositories/routes';
import {putUploadFiles} from '../repositories';
import * as transformers from './transformers';
import {NEW_RECORD_DEFAULT_VALUES} from 'config/general';
import * as actions from './actionTypes';

// actions should not care about locale only true front end should care - remove and return only api errors - let FE deside what to do with those errors!
import {locale} from 'config';

/**
 * Save a new record involves up to three steps: create a new record, upload files, update record with uploaded files.
 * If error occurs on any stage failed action is displated
 * @param {object} data to be posted, refer to backend API
 * @param {array} files to be uploaded for this record
 * @returns {action}
 */
export function createNewRecord(data) {
    const {errorAlert} = locale.components.publicationForm;
    return dispatch => {
        dispatch({type: actions.RECORD_CREATE_SAVING});

        // set default values, links
        const recordRequest = {
            ...NEW_RECORD_DEFAULT_VALUES,
            ...JSON.parse(JSON.stringify(data)),
            ...transformers.getRecordLinkSearchKey(data),
            ...transformers.getRecordAuthorsSearchKey(data.authors),
            ...transformers.getRecordAuthorsIdSearchKey(data.authors),
            ...transformers.getRecordContributorsSearchKey(data.editors),
            ...transformers.getRecordContributorsIdSearchKey(data.editors)
        };

        // delete extra form values from request object
        if (recordRequest.authors) delete recordRequest.authors;
        if (recordRequest.editors) delete recordRequest.editors;
        if (recordRequest.files) delete recordRequest.files;
        if (recordRequest.author) delete recordRequest.author;

        let newRecord = null;
        const hasFilesToUpload = data.files && data.files.queue && data.files.queue.length > 0;
        console.log(hasFilesToUpload);
        console.log(data);
        const recordPatch = hasFilesToUpload ? {...transformers.getRecordFileAttachmentSearchKey(data.files.queue)} : null;

        return post(routes.NEW_RECORD_API(), recordRequest)
            .then(response => {
                // save new record response
                newRecord = response.data;
                return response;
            })
            .then(() =>(hasFilesToUpload ? putUploadFiles(newRecord.rek_pid, data.files.queue, dispatch) : newRecord))
            .then(() => (hasFilesToUpload ? patch(routes.EXISTING_RECORD_API({pid: newRecord.rek_pid}), recordPatch) : newRecord))
            .then((response) => {
                dispatch({
                    type: actions.RECORD_CREATE_SUCCESS,
                    payload: response.data ? response.data : newRecord
                });
                return Promise.resolve(response.data ? response.data : newRecord);
            })
            .catch(error => {
                // record was created, but file upload or record patch failed
                if (!!newRecord && !!newRecord.rek_pid) {
                    dispatch({
                        type: actions.RECORD_CREATE_SUCCESS,
                        payload: {
                            ...newRecord,
                            fileUploadFailed: true
                        }
                    });

                    return Promise.resolve(newRecord);
                }
                // all requests failed
                if (error.status === 403) dispatch({type: actions.ACCOUNT_ANONYMOUS});

                dispatch({
                    type: actions.RECORD_CREATE_FAILED,
                    payload: error.message
                });

                return Promise.reject(new Error(`${errorAlert.createRecordMessage} (${error.message})`));
            });
    };
}

/**
 * Clear new record
 * @returns {action}
 */
export function clearNewRecord() {
    return dispatch => {
        dispatch({
            type: actions.RECORD_CREATE_RESET
        });
    };
}
