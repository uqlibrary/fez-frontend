import * as transformers from './transformers';
import * as actions from './actionTypes';
import { APP_URL, NEW_RECORD_DEFAULT_VALUES, UNPROCESSED_RECORDS_COLLECTION } from 'config/general';
import { get, patch, post } from 'repositories/generic';
import {
    CLAIM_PRE_CHECK,
    EXISTING_RECORD_API,
    HIDE_POSSIBLE_RECORD_API,
    NEW_RECORD_API,
    POSSIBLE_RECORDS_API,
    RECORDS_ISSUES_API,
} from 'repositories/routes';
import { putUploadFiles } from 'repositories';
import { dismissAppAlert } from './app';
import { createSentryFriendlyError } from '../config/axios';

/**
 * Load publication to claim full record
 * @param {object}
 * @returns {action}
 */
export function loadFullRecordToClaim(pid) {
    return dispatch => {
        dispatch({ type: actions.PUBLICATION_TO_CLAIM_LOADING });

        return get(EXISTING_RECORD_API({ pid: pid }))
            .then(response => {
                dispatch({
                    type: actions.PUBLICATION_TO_CLAIM_LOADED,
                    payload: response.data,
                });

                return Promise.resolve(response.data);
            })
            .catch(error => {
                dispatch({
                    type: actions.PUBLICATION_TO_CLAIM_FAILED,
                    payload: error.message,
                });
            });
    };
}

/**
 * Search publications from eSpace which are matched to currently logged in username
 * @param {object} activeFacets - optional list of facets
 * @returns {action}
 */
export function searchPossiblyYourPublications({
    activeFacets = {},
    page = 1,
    pageSize = 20,
    sortBy = 'score',
    sortDirection = 'Desc',
}) {
    return dispatch => {
        if (Object.keys(activeFacets).length === 0) {
            dispatch({ type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING });
        }

        dispatch({
            type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING,
            payload: activeFacets,
        });
        return get(
            POSSIBLE_RECORDS_API({
                facets: activeFacets,
                page: page,
                pageSize: pageSize,
                sortBy: sortBy,
                sortDirection: sortDirection,
            }),
        )
            .then(response => {
                dispatch({
                    type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADED,
                    payload: { ...response, type: 'possible' },
                });

                dispatch({
                    type: actions.POSSIBLY_YOUR_PUBLICATIONS_FACETS_LOADED,
                    payload: (response.filters || {}).facets || {},
                });

                if (Object.keys(activeFacets).length === 0) {
                    // only update total count if there's no filtering
                    dispatch({
                        type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADED,
                        payload: response,
                    });
                }
            })
            .catch(error => {
                dispatch({
                    type: actions.POSSIBLY_YOUR_PUBLICATIONS_FAILED,
                    payload: error.message,
                });

                dispatch({
                    type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED,
                    payload: error.message,
                });
            });
    };
}

/**
 * Get count of possibly your publications for an author
 * @param {string} author user name
 * @returns {action}
 */
export function countPossiblyYourPublications() {
    return searchPossiblyYourPublications({});
}

/**
 * Hide publications form user possibly your research view, eg hide
 * @param data {array} - list of publications to hide
 * @param author {object} - user user name
 * @returns {action}
 */
export function hideRecord({ record, facets = {} }) {
    return dispatch => {
        dispatch({ type: actions.HIDE_PUBLICATIONS_LOADING });

        // Transform data to api format:
        // POST records/search?rule=possible (with data: ['pid' => 'UQ:1', 'type' => 'H'])
        const data = {
            type: 'H',
            pid: record.rek_pid,
        };

        return post(HIDE_POSSIBLE_RECORD_API(), data)
            .then(() => {
                dispatch({
                    type: actions.HIDE_PUBLICATIONS_LOADED,
                    payload: { pid: record.rek_pid },
                });

                // reload current possibly your publications/count after user hides records
                return dispatch(searchPossiblyYourPublications({ facets: facets }));
            })
            .catch(error => {
                // TODO: display error message to user that this operation failed (in PT)
                dispatch({
                    type: actions.HIDE_PUBLICATIONS_FAILED,
                    payload: error.message,
                });
            });
    };
}

/**
 * Reset the error message and status when leaving the claim possible pubs page
 * @returns {action}
 */
export function hideRecordErrorReset() {
    return dispatch => {
        dispatch({ type: actions.HIDE_PUBLICATIONS_FAILED_RESET });
    };
}

/**
 * Set publication to be claimed
 * @param publication {object} - set a publication to be claimed (to display in claim publiation form)
 * @returns {action}
 */
export function setClaimPublication(publication) {
    return dispatch => {
        dispatch({
            type: actions.PUBLICATION_TO_CLAIM_SET,
            payload: publication,
        });
    };
}

/**
 * Clear publication to be claimed
 * @returns {action}
 */
export function clearClaimPublication() {
    return dispatch => {
        dispatch({
            type: actions.PUBLICATION_TO_CLAIM_CLEAR,
        });
        dispatch(dismissAppAlert());
    };
}

/**
 *
 * @param record
 * @param match
 * @param searchKey
 * @param mergedSearchKey
 * @returns boolean
 */
export const updateMatchedRecordAuthoringData = (authorId, record, match, searchKey) => {
    const idTable = `fez_record_search_key_${searchKey}_id`;
    const idField = `rek_${searchKey}_id`;
    const table = `fez_record_search_key_${searchKey}`;
    const field = `rek_${searchKey}`;

    // check if author/contributor can be claimed in the matched record
    for (const [index, item] of record[idTable].entries?.()) {
        if (item[idField] !== authorId) {
            continue;
        }

        if (
            match[idTable][index][idField] !== 0 ||
            (record[table] && match[table] && record[table][index][field] !== match[table][index][field])
        ) {
            return false;
        }

        // if can, update the matched record
        match[idTable][index][idField] = authorId;
    }

    return true;
};

/**
 *
 * @param isAuthorLinked
 * @param isContributorLinked
 * @param espaceMatch
 * @returns Object
 */
export const mergeAvailableAuthoringData = (isAuthorLinked, isContributorLinked, espaceMatch) => ({
    ...(isAuthorLinked && {
        fez_record_search_key_author_id: espaceMatch.fez_record_search_key_author_id,
    }),
    ...(isContributorLinked && {
        fez_record_search_key_contributor_id: espaceMatch.fez_record_search_key_contributor_id,
    }),
});

/**
 * @param pid
 * @returns Object
 */
export const getPreCheckError = pid => {
    const message = `The record you are trying to claim is already exists in eSpace, however, with different authors/contributors:\n${APP_URL}view/${pid}`;
    return createSentryFriendlyError(message, {
        original: { data: message },
        request: { responseURL: CLAIM_PRE_CHECK().apiUrl },
    });
};

/**
 * Save a publication claim record involves up to three steps:
 * If user claims a publications from eSpace:
 *      patch record with author details, link,
 *      upload files,
 *      update record with uploaded files
 * If user claims an publication from external sources:
 *      create a publication record (same as AddRecord process),
 *      upload files
 *      patch record with uploaded files
 *
 * If error occurs on any stage failed action is displayed
 * @param {object} data to be posted, refer to backend API data: {publication, author, files}
 * @returns {Promise} - this method is used by redux form onSubmit which requires Promise resolve/reject as a return
 */
export function claimPublication(data) {
    const isAuthorLinked =
        (data.publication.fez_record_search_key_author_id || []).filter(
            authorId => authorId.rek_author_id === data.author.aut_id,
        ).length > 0;

    const isContributorLinked =
        (data.publication.fez_record_search_key_contributor_id || []).filter(
            authorId => authorId.rek_contributor_id === data.author.aut_id,
        ).length > 0;

    // do not try to claim record if it's internal record and already assigned to the current author
    if (data.publication.rek_pid && (isAuthorLinked || isContributorLinked)) {
        return dispatch => {
            dispatch({
                type: actions.CLAIM_PUBLICATION_CREATE_FAILED,
                payload: 'Current author has already been assigned to this publication.',
            });
            return Promise.reject(
                new Error('Current author has already been assigned to this publication as an author or contributor.'),
            );
        };
    }

    const hasFilesToUpload = ((data.files || {}).queue || []).length > 0;
    return dispatch => {
        dispatch({ type: actions.CLAIM_PUBLICATION_CREATE_PROCESSING });

        let recordAuthorsIdSearchKeys = {};
        let recordContributorsIdSearchKeys = {};

        if (data.authorLinking && data.authorLinking.authors) {
            recordAuthorsIdSearchKeys = transformers.getRecordAuthorsIdSearchKey(
                data.authorLinking.authors,
                data.author.aut_id,
            );
        }

        if (data.contributorLinking && data.contributorLinking.valid && data.contributorLinking.authors) {
            recordContributorsIdSearchKeys = transformers.getRecordContributorsIdSearchKey(
                data.contributorLinking.authors,
                data.author.aut_id,
            );
        }

        // claim record from external source
        let createRecordRequest = !data.publication.rek_pid
            ? {
                  ...NEW_RECORD_DEFAULT_VALUES,
                  ...data.publication,
                  // remove any other Collection eg WOS Import in favour of Unprocessed Record
                  ...UNPROCESSED_RECORDS_COLLECTION,
                  ...transformers.getRecordLinkSearchKey(data),
                  ...transformers.getRecordFileAttachmentSearchKey(
                      data.files ? data.files.queue : [],
                      data.publication,
                  ),
                  ...transformers.getExternalSourceIdSearchKeys(data.publication.sources),
                  ...transformers.getContentIndicatorSearchKey(data.contentIndicators || null),
                  ...recordAuthorsIdSearchKeys,
                  ...recordContributorsIdSearchKeys,
              }
            : null;

        // update record with author/contributor id, link, content indicators
        let patchRecordRequest = data.publication.rek_pid
            ? {
                  ...transformers.getRecordLinkSearchKey(data),
                  ...transformers.getContentIndicatorSearchKey(data.contentIndicators || null),
                  ...recordAuthorsIdSearchKeys,
                  ...recordContributorsIdSearchKeys,
              }
            : null;

        // update record with files
        let patchFilesRecordRequest = hasFilesToUpload
            ? {
                  ...transformers.getRecordFileAttachmentSearchKey(data.files.queue, data.publication),
              }
            : null;

        // track success of either save or patch request
        let claimRecordRequestSuccess = false;

        // create request for issue notification
        const createIssueRequest = transformers.getClaimIssueRequest(data);

        return (
            Promise.resolve([])
                // for external records, check if doesn't already exists in eSpace
                .then(() => (!data.publication.rek_pid ? post(CLAIM_PRE_CHECK(), createRecordRequest) : null))
                // if an eSpace record has been matched
                .then(response => {
                    if (!response?.data) {
                        return null;
                    }

                    const externalRecord = data.publication;
                    const espaceMatch = response.data;
                    // swap external record with matched record
                    data.publication = espaceMatch;
                    // clean create request
                    createRecordRequest = undefined;

                    if (
                        (isAuthorLinked &&
                            !updateMatchedRecordAuthoringData(
                                data.author.aut_id,
                                externalRecord,
                                espaceMatch,
                                'author',
                            )) ||
                        (isContributorLinked &&
                            !updateMatchedRecordAuthoringData(
                                data.author.aut_id,
                                externalRecord,
                                espaceMatch,
                                'contributor',
                            ))
                    ) {
                        // bail in case author/contributor can't be claimed in the matched record
                        return Promise.reject(getPreCheckError(espaceMatch.rek_pid));
                    }

                    // update patch request
                    patchRecordRequest = {
                        ...patchRecordRequest,
                        ...mergeAvailableAuthoringData(isAuthorLinked, isContributorLinked, espaceMatch),
                    };
                    // update file upload request
                    patchFilesRecordRequest = hasFilesToUpload
                        ? {
                              ...transformers.getRecordFileAttachmentSearchKey(data.files.queue, data.publication),
                          }
                        : null;

                    return null;
                })
                // save a new record if claiming from external source
                .then(() => (!data.publication.rek_pid ? post(NEW_RECORD_API(), createRecordRequest) : null))
                // update pid of newly saved record
                .then(newRecord => {
                    if ((newRecord || {}).data && !data.publication.rek_pid) {
                        data.publication.rek_pid = newRecord.data.rek_pid;
                    }
                    return null;
                })
                // claim record if claiming from internal source
                .then(() =>
                    !createRecordRequest
                        ? patch(EXISTING_RECORD_API({ pid: data.publication.rek_pid }), patchRecordRequest)
                        : null,
                )
                // set save/claim record status if either is a success
                .then(() => {
                    claimRecordRequestSuccess = true;
                    return null;
                })
                // try to upload files
                .then(() =>
                    hasFilesToUpload ? putUploadFiles(data.publication.rek_pid, data.files.queue, dispatch) : null,
                )
                // patch record with files if file upload has succeeded
                .then(() =>
                    hasFilesToUpload
                        ? patch(EXISTING_RECORD_API({ pid: data.publication.rek_pid }), patchFilesRecordRequest)
                        : null,
                )
                // send comments or content indicator changes as an issue request
                .then(() =>
                    createIssueRequest.issue.length
                        ? post(RECORDS_ISSUES_API({ pid: data.publication.rek_pid }), createIssueRequest)
                        : null,
                )
                // finish claim record action
                .then(() => {
                    dispatch({
                        type: actions.CLAIM_PUBLICATION_CREATE_COMPLETED,
                        payload: { pid: data.publication.rek_pid },
                        fileUploadOrIssueFailed: false,
                    });
                    return Promise.resolve(data.publication);
                })
                .catch(error => {
                    // new record was created or author claim request was saved, but file upload failed
                    if (claimRecordRequestSuccess) {
                        dispatch({
                            type: actions.CLAIM_PUBLICATION_CREATE_COMPLETED,
                            payload: {
                                pid: data.publication.rek_pid,
                                fileUploadOrIssueFailed: true,
                            },
                        });

                        return Promise.resolve(data.publication);
                    }

                    // failed to create a claim/new record request
                    dispatch({
                        type: actions.CLAIM_PUBLICATION_CREATE_FAILED,
                        payload: error.message,
                    });
                    return Promise.reject(error);
                })
        );
    };
}
