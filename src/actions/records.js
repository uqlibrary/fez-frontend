import {postRecord, patchRecord, putUploadFiles} from '../repositories';

export const RECORD_RESET = 'RECORD_RESET';
export const RECORD_CREATED = 'RECORD_CREATED';
export const RECORD_CREATE_FAILED = 'RECORD_CREATE_FAILED';
export const RECORD_PROCESSING = 'RECORD_PROCESSING';

/**
 * Save a new record involves up to three steps: create a new record, upload files, update record with uploaded files.
 * If error occurs on any stage failed action is displated
 * @param {object} data to be posted, refer to backend API
 * @param {array} files to be uploaded for this record
 * @returns {action}
 */
export function createNewRecord(data, files) {
    return dispatch => {
        dispatch({type: RECORD_PROCESSING});

        return postRecord(data)
            .then(response => {
                // update original record data
                data.rek_pid = response.rek_pid;
                if (files.length === 0) return response;
                return putUploadFiles(response.rek_pid, files);
            })
            .then(response => {
                if (files.length === 0) return response;

                // process uploaded files into API format for a patch
                const fileDataPatch = {
                    fez_record_search_key_file_attachment_name: files.map((file, index) => {
                        return {
                            'rek_file_attachment_name': file.name,
                            'rek_file_attachment_name_order': (index + 1)
                        };
                    })
                };

                return patchRecord(data.rek_pid, fileDataPatch);
            })
            .then(response => {
                dispatch({
                    type: RECORD_CREATED,
                    payload: response
                });
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: RECORD_CREATE_FAILED,
                    payload: error
                });
                return Promise.reject(error);
            });
    };
}

/**
 * Reset record state
 * @returns {action}
 */
export function resetRecordState() {
    return dispatch => dispatch({type: RECORD_RESET});
}
