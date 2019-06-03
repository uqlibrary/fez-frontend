import * as actions from './actionTypes';
import * as transformers from './transformers';
import { patch, post } from 'repositories/generic';
import { EXISTING_RECORD_API, RECORDS_ISSUES_API } from 'repositories/routes';
import { putUploadFiles } from 'repositories';

/**
 * Update incomplete record request: patch record, send issue to espace admins:
 *      update record with uploaded files, other field data
 *      send issue message to notify espace team
 *      upload files,
 * If error occurs on any stage failed action is displayed
 * @param {object} data to be posted, refer to backend API data: {publication, author, files}
 * @returns {promise} - this method is used by redux form onSubmit which requires Promise resolve/reject as a return
 */
export function updateIncompleteRecord(data) {
    if (!data.publication || !data.author) {
        return dispatch => {
            dispatch({
                type: actions.FIX_RECORD_FAILED,
                payload: 'Incomplete data for requests'
            });

            return Promise.reject(new Error('Incomplete data for requests'));
        };
    }

    const isAuthorLinked = data.publication.fez_record_search_key_author_id && data.publication.fez_record_search_key_author_id.length > 0 &&
        data.publication.fez_record_search_key_author_id.filter(authorId => authorId.rek_author_id === data.author.aut_id).length > 0;

    const isContributorLinked = data.publication.fez_record_search_key_contributor_id && data.publication.fez_record_search_key_contributor_id.length > 0 &&
        data.publication.fez_record_search_key_contributor_id.filter(contributorId => contributorId.rek_contributor_id === data.author.aut_id).length > 0;

    if (!isAuthorLinked && !isContributorLinked) {
        return dispatch => {
            dispatch({
                type: actions.FIX_RECORD_FAILED,
                payload: 'Current author is not linked to this record'
            });
            return Promise.reject(new Error('Current author is not linked to this record'));
        };
    }

    const hasFilesToUpload = data.files && data.files.queue && data.files.queue.length > 0;

    return dispatch => {
        dispatch({type: actions.FIX_RECORD_PROCESSING});

        // if user updated NTRO data - update record
        let patchRecordRequest = null;
        patchRecordRequest = {
            rek_pid: data.publication.rek_pid,
            ...JSON.parse(JSON.stringify(data)),
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
        !!patchRecordRequest.author && delete patchRecordRequest.author;
        !!patchRecordRequest.publication && delete patchRecordRequest.publication;
        !!patchRecordRequest.authorsAffiliation && delete patchRecordRequest.authorsAffiliation;
        !!patchRecordRequest.files && delete patchRecordRequest.files;
        !!patchRecordRequest.ntroAbstract && delete patchRecordRequest.ntroAbstract;
        !!patchRecordRequest.grants && delete patchRecordRequest.grants;
        !!patchRecordRequest.significance && delete patchRecordRequest.significance;
        !!patchRecordRequest.impactStatement && delete patchRecordRequest.impactStatement;
        !!patchRecordRequest.languages && delete patchRecordRequest.languages;
        !!patchRecordRequest.qualityIndicators && delete patchRecordRequest.qualityIndicators;

        // create request for issue notification
        const createIssueRequest = transformers.getFixIssueRequest(data);

        return Promise.resolve([])
            .then(()=> (hasFilesToUpload ? putUploadFiles(data.publication.rek_pid, data.files.queue, dispatch) : null))
            .then(()=> (patch(EXISTING_RECORD_API({pid: data.publication.rek_pid}), patchRecordRequest)))
            .then(()=> ((!!data.comments || !!data.files) ? post(RECORDS_ISSUES_API({pid: data.publication.rek_pid}), createIssueRequest) : null))
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
                dispatch({
                    type: actions.FIX_RECORD_FAILED,
                    payload: error.message
                });
                return Promise.reject(error);
            });
    };
}
