import * as transformers from './transformers';
import * as actions from './actionTypes';
import {NEW_RECORD_DEFAULT_VALUES} from 'config/general';

import {get, post, patch} from 'repositories/generic';
import * as routes from 'repositories/routes';
import * as repositories from 'repositories';


/**
 * Search publications from eSpace which are matched to currently logged in username
 * @param {object} activeFacets - optional list of facets
 * @returns {action}
 */
export function searchPossiblyYourPublications({facets = {}}) {
    return dispatch => {
        if (Object.keys(facets).length === 0) {
            dispatch({type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING});
        }

        dispatch({type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING, payload: facets});

        get(routes.POSSIBLE_RECORDS_API({facets: facets}))
            .then(response => {
                dispatch({
                    type: actions.POSSIBLY_YOUR_PUBLICATIONS_COMPLETED,
                    payload: response,
                });

                dispatch({
                    type: actions.POSSIBLY_YOUR_PUBLICATIONS_FACETS_COMPLETED,
                    payload: response.filters && response.filters.facets ? response.filters.facets : {}
                });

                if (Object.keys(facets).length === 0) {
                    // only update total count if there's no filtering
                    dispatch({
                        type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_COMPLETED,
                        payload: response
                    });
                }
            })
            .catch((error) => {
                dispatch({
                    type: actions.POSSIBLY_YOUR_PUBLICATIONS_FAILED,
                    payload: error
                });

                dispatch({
                    type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED,
                    payload: error
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
export function hideRecord({record, facets = {}}) {
    return dispatch => {
        dispatch({type: actions.HIDE_PUBLICATIONS_LOADING});

        // Transform data to api format:
        // POST records/search?rule=possible (with data: ['pid' => 'UQ:1', 'type' => 'H'])
        const data = {
            type: 'H',
            pid: record.rek_pid
        };

        post(routes.HIDE_POSSIBLE_RECORD_API(), data)
            .then(response => {
                dispatch({
                    type: actions.HIDE_PUBLICATIONS_COMPLETED,
                    payload: response
                });

                // reload current possibly your publications/count after user hides records
                dispatch(searchPossiblyYourPublications({facets: facets}));
            })
            .catch(() => {
                dispatch({
                    type: actions.HIDE_PUBLICATIONS_FAILED,
                    payload: []
                });
            });
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
            payload: publication
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
            type: actions.PUBLICATION_TO_CLAIM_CLEAR
        });
    };
}

/**
 * Save a publication claim record involves up to three steps:
 * If user claims a publications from eSpace:
 *      create a claim record,
 *      upload files,
 *      update record with uploaded files and author details
 * If user claims an publication from external sources:
 *      create a publication record (same as AddRecord process),
 *      create a claim record
 *      (files/authors will be updated by create new publication record process)
 *
 * If error occurs on any stage failed action is displayed
 * @param {object} data to be posted, refer to backend API data: {publication, author, files}
 * @param {array} files to be uploaded for this record
 * @returns {action}
 */
export function claimPublication(data) {
    console.log(data);

    const isAuthorLinked = data.publication.fez_record_search_key_author_id && data.publication.fez_record_search_key_author_id.length > 0 &&
    data.publication.fez_record_search_key_author_id.filter(authorId => authorId.rek_author_id === data.author.aut_id).length > 0;

    // do not try to claim record if it's internal record and already assigned to the current author
    if (data.publication.rek_pid && isAuthorLinked) {
        return dispatch => {
            dispatch({
                type: actions.CLAIM_PUBLICATION_CREATE_FAILED,
                payload: 'Current author has already been assigned to this publication.'
            });
        };
    }

    return dispatch => {
        dispatch({type: actions.CLAIM_PUBLICATION_CREATE_PROCESSING});

        let recordAuthorsIdSearchKeys = {};
        if (data.publication.fez_record_search_key_author &&
            data.publication.fez_record_search_key_author.length === 1) {
            // auto-assign current author if there's only one author
            recordAuthorsIdSearchKeys = {
                fez_record_search_key_author_id: {
                    rek_author_id: data.author.aut_id,
                    rek_author_id_order: 1
                }
            };
        } else if (data.authorLinking && data.authorLinking.authors) {
            // author has assigned themselves on the form
            recordAuthorsIdSearchKeys = transformers.getRecordAuthorsIdSearchKey(data.authorLinking.authors);
        }

        // claim record from external source
        const createRecordRequest = {
            ...data.publication,
            ...NEW_RECORD_DEFAULT_VALUES,
            ...transformers.getRecordLinkSearchKey(data),
            ...transformers.getRecordFileAttachmentSearchKey(data.files ? data.files.queue : [], data.publication),
            // notes!
            ...recordAuthorsIdSearchKeys
        };
        // patch record from eSpace
        const patchRecordRequest = {
            rek_pid: data.publication.rek_pid,
            ...transformers.getRecordLinkSearchKey(data),
            ...transformers.getRecordFileAttachmentSearchKey(data.files ? data.files.queue : [], data.publication),
            ...recordAuthorsIdSearchKeys
        };

        return Promise.all([data.publication.rek_pid
            ? patch(routes.EXISTING_RECORD_API({pid: data.publication.rek_pid}), patchRecordRequest)
            : post(routes.NEW_RECORD_API(), createRecordRequest)])
            .then(responseAll => {
                const response = responseAll[0];
                // if it's a claim of an existing eSpace record, send an issue request
                if (data.publication.rek_pid) {
                    // notes!
                    const createIssueRequest = transformers.getClaimIssueRequest(data);
                    // TODO: will submin an issue with notes provided by user from the form
                    return post(routes.RECORDS_ISSUES_API({pid: data.publication.rek_pid}), createIssueRequest);
                }
                data.publication.rek_pid = response.data.rek_pid;
                return response;
            })
            .then(response => {
                if (!data.files || !data.files.queue || data.files.queue.length === 0) {
                    return response;
                } else {
                    return repositories.putUploadFiles(data.publication.rek_pid, data.files.queue, dispatch);
                }
            })
            .then(response => {
                dispatch({
                    type: actions.CLAIM_PUBLICATION_CREATE_COMPLETED,
                    payload: response
                });
                return Promise.resolve(response);
            })
            .catch(error => {
                console.log(error);
                dispatch({
                    type: actions.CLAIM_PUBLICATION_CREATE_FAILED,
                    payload: error
                });
                return Promise.reject(error);
            });
    };
}
