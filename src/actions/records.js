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

        console.log('step 1 - NEW_RECORD_API()');
        return post(routes.NEW_RECORD_API(), recordRequest)
            .then(response => {
                console.log('step 2 - putUploadFiles()');
                // set a pid on a new record
                data.rek_pid = response.data.rek_pid;
                newRecord = response.data;

                // process files
                if (!data.files || !data.files.queue || data.files.queue.length === 0) {
                    return response;
                } else {
                    const recordPatch = {
                        ...transformers.getRecordFileAttachmentSearchKey(data.files.queue)
                    };

                    // both of requests should success for files to be recorded successfully
                    return Promise.all([
                        putUploadFiles(response.data.rek_pid, data.files.queue, dispatch),
                        patch(routes.EXISTING_RECORD_API({pid: data.rek_pid}), recordPatch)
                    ]);
                }
            })
            .then(response => {
                console.log('Promise.all ??? ');

                dispatch({
                    type: actions.RECORD_CREATE_SUCCESS,
                    payload: response.data
                });
                return Promise.resolve(response.data);
            })
            .catch(error => {
                console.log('FAILED: catch(error): ' + error);
                console.log('FAILED: catch(error): ' + newRecord);

                if (error.status === 403) dispatch({type: actions.ACCOUNT_ANONYMOUS});
                dispatch({
                    type: actions.RECORD_CREATE_FAILED,
                    payload: error
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
