import * as repositories from 'repositories';
import * as transformers from './transformers';
import * as actions from './actionTypes';
import {NEW_RECORD_DEFAULT_VALUES} from 'config/general';

/**
 * Get count of possibly your publications for an author
 * @param {string} author user name
 * @returns {action}
 */
export function countPossiblyYourPublications(authorUsername) {
    return dispatch => {
        dispatch({type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING});
        repositories.getCountPossibleUnclaimedPublications(authorUsername)
            .then(
                response => {
                    dispatch({
                        type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_COMPLETED,
                        payload: response.data
                    });
                },
                error => {
                    dispatch({
                        type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED,
                        payload: error
                    });
                }
            );
    };
}

/**
 * Search publications from eSpace which are matched to author's username
 * @param {string} author user name
 * @returns {action}
 */
export function searchPossiblyYourPublications(authorUsername, activeFacets) {
    return dispatch => {
        dispatch({type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING, payload: activeFacets});
        // TODO: try some authors who are students - org username or student name to use?
        repositories.getPossibleUnclaimedPublications(authorUsername, activeFacets).then(response => {
            dispatch({
                type: actions.POSSIBLY_YOUR_PUBLICATIONS_COMPLETED,
                payload: response,
            });
            dispatch({
                type: actions.POSSIBLY_YOUR_PUBLICATIONS_FACETS_COMPLETED,
                payload: response.filters && response.filters.facets ? response.filters.facets : {}
            });
            dispatch(countPossiblyYourPublications(authorUsername));
        }).catch((error) => {
            dispatch({
                type: actions.POSSIBLY_YOUR_PUBLICATIONS_FAILED,
                payload: error
            });
        });
    };
}

/**
 * Hide publications form user possibly your research view, eg hide
 * @param data {array} - list of publications to hide
 * @param author {object} - user user name
 * @returns {action}
 */
export function hidePublications(publicationsToHide, author, activeFacets) {
    return dispatch => {
        if (!author) return;

        dispatch({type: actions.HIDE_PUBLICATIONS_LOADING});
        // Transform data to api format:
        // { "author_id" : "3", "publications": [ { "pid": "UQ:662328" } ] }
        const data = {
            publications: publicationsToHide.map((item) => { return {pid: item.rek_pid}; })
        };
        if (author.aut_id) {
            data.author_id = author.aut_id;
        }
        repositories.postHidePossiblePublications(data)
            .then(response => {
                dispatch({
                    type: actions.HIDE_PUBLICATIONS_COMPLETED,
                    payload: response
                });

                // reload current possibly your publications/count after user hides records
                dispatch(searchPossiblyYourPublications(author.aut_org_username, activeFacets));
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
 * @param {object} data to be posted, refer to backend API
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
        const createRecordRequest = data.publication.rek_pid ?
            data.publication : {
                ...data.publication,
                ...NEW_RECORD_DEFAULT_VALUES,
                ...recordAuthorsIdSearchKeys
            };

        // claim record from eSpace
        console.log(createRecordRequest);

        return repositories.postRecord(createRecordRequest)
            .then(response => {
                data.publication.rek_pid = response.data.rek_pid;
                const claimRequest = transformers.getClaimRequest(data);
                return repositories.postClaimPossiblePublication(claimRequest);
            })
            .then(response => {
                if (!data.files || !data.files.queue || data.files.queue.length === 0) {
                    return response;
                } else {
                    return repositories.putUploadFiles(data.publication.rek_pid, data.files.queue, dispatch);
                }
            })
            .then(() => {
                const recordPatchRequest = {
                    rek_pid: data.publication.rek_pid,
                    ...transformers.getRecordLinkSearchKey(data),
                    ...transformers.getRecordFileAttachmentSearchKey(data.files ? data.files.queue : [], data.publication),
                    ...recordAuthorsIdSearchKeys
                };
                console.log(recordPatchRequest);
                return repositories.patchRecord(data.publication.rek_pid, recordPatchRequest);
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
