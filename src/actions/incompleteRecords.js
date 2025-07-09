import * as actions from './actionTypes';
import * as transformers from './transformers';
import { patch, post } from 'repositories/generic';
import { EXISTING_RECORD_API, RECORDS_ISSUES_API } from 'repositories/routes';
import { putUploadFiles } from 'repositories';
import { sanitiseData } from './records';

/**
 * Update incomplete record request: patch record, send issue to espace admins:
 *      update record with uploaded files, other field data
 *      send issue message to notify espace team
 *      upload files,
 * If error occurs on any stage failed action is displayed
 * @param {object} data to be posted, refer to backend API data: {publication, author, files}
 * @returns {Promise}
 */
export function updateIncompleteRecord(data) {
    if (!data.publication || !data.author) {
        return dispatch => {
            dispatch({
                type: actions.FIX_RECORD_FAILED,
                payload: 'Incomplete data for requests',
            });

            return Promise.reject(new Error('Incomplete data for requests'));
        };
    }

    const isAuthorLinked = (data.publication.fez_record_search_key_author_id || []).some(
        authorId => authorId.rek_author_id === data.author.aut_id,
    );

    const isContributorLinked = (data.publication.fez_record_search_key_contributor_id || []).some(
        contributorId => contributorId.rek_contributor_id === data.author.aut_id,
    );

    if (!isAuthorLinked && !isContributorLinked) {
        return dispatch => {
            dispatch({
                type: actions.FIX_RECORD_FAILED,
                payload: 'Current author is not linked to this record',
            });
            return Promise.reject(new Error('Current author is not linked to this record'));
        };
    }

    const hasFilesToUpload = data.files && data.files.queue && data.files.queue.length > 0;

    return dispatch => {
        dispatch({ type: actions.FIX_RECORD_PROCESSING });

        // if user updated NTRO data - update record
        let patchRecordRequest = null;
        patchRecordRequest = {
            rek_pid: data.publication.rek_pid,
            ...sanitiseData(data),
            ...transformers.getRecordAbstractDescriptionSearchKey(data.ntroAbstract),
            ...transformers.getLanguageSearchKey(data.languages),
            ...transformers.getQualityIndicatorSearchKey(data.qualityIndicators),
            ...transformers.getSignificanceAndContributionStatementSearchKeys(data),
            ...transformers.getGrantsListSearchKey(data.grants),
            ...transformers.getRecordFileAttachmentSearchKey(data.files ? data.files.queue : [], data.publication),
            ...transformers.getRecordAuthorAffiliationSearchKey(data.authorsAffiliation),
            ...transformers.getRecordAuthorAffiliationTypeSearchKey(data.authorsAffiliation),
        };

        // delete extra form values from request object
        const keysToDelete = [
            'author',
            'authorsAffiliation',
            'files',
            'grants',
            'impactStatement',
            'languages',
            'ntroAbstract',
            'publication',
            'qualityIndicators',
            'significance',
            'initialValues',
        ];
        keysToDelete.forEach(key => {
            delete patchRecordRequest[key];
        });

        // create request for issue notification
        const createIssueRequest = transformers.getFixIssueRequest(data);

        return Promise.resolve([])
            .then(() =>
                hasFilesToUpload ? putUploadFiles(data.publication.rek_pid, data.files.queue, dispatch) : null,
            )
            .then(() =>
                patch(
                    EXISTING_RECORD_API({
                        pid: data.publication.rek_pid,
                    }),
                    patchRecordRequest,
                ),
            )
            .then(() =>
                !!data.comments || !!data.files
                    ? post(
                          RECORDS_ISSUES_API({
                              pid: data.publication.rek_pid,
                          }),
                          createIssueRequest,
                      )
                    : null,
            )
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
