import {
    getPossibleUnclaimedPublications,
    postHidePossiblePublications,
    getCountPossibleUnclaimedPublications,
    postClaimPossiblePublication,
    putUploadFiles,
    patchRecord, postRecord
} from 'repositories';

import {recordRekLink, recordFileAttachment, claimAttachments} from './transformers';
import {NEW_RECORD_DEFAULT_VALUES} from 'config/general';

export const POSSIBLY_YOUR_PUBLICATIONS_LOADING = 'POSSIBLY_YOUR_PUBLICATIONS_LOADING';
export const POSSIBLY_YOUR_PUBLICATIONS_COMPLETED = 'POSSIBLY_YOUR_PUBLICATIONS_COMPLETED';
export const POSSIBLY_YOUR_PUBLICATIONS_FACETS_COMPLETED = 'POSSIBLY_YOUR_PUBLICATIONS_FACETS_COMPLETED';
export const POSSIBLY_YOUR_PUBLICATIONS_FAILED = 'POSSIBLY_YOUR_PUBLICATIONS_FAILED';

export const COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING = 'COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING';
export const COUNT_POSSIBLY_YOUR_PUBLICATIONS_COMPLETED = 'COUNT_POSSIBLY_YOUR_PUBLICATIONS_COMPLETED';
export const COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED = 'COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED';

export const HIDE_PUBLICATIONS_LOADING = 'HIDE_PUBLICATIONS_LOADING';
export const HIDE_PUBLICATIONS_COMPLETED = 'HIDE_PUBLICATIONS_COMPLETED';
export const HIDE_PUBLICATIONS_FAILED = 'HIDE_PUBLICATIONS_FAILED';

export const PUBLICATION_TO_CLAIM_SET = 'PUBLICATION_TO_CLAIM_SET';
export const PUBLICATION_TO_CLAIM_CLEAR = 'PUBLICATION_TO_CLAIM_CLEAR';


export const CLAIM_PUBLICATION_CREATE_PROCESSING = 'CLAIM_PUBLICATION_CREATE_PROCESSING';
export const CLAIM_PUBLICATION_CREATE_COMPLETED = 'CLAIM_PUBLICATION_CREATE_COMPLETED';
export const CLAIM_PUBLICATION_CREATE_FAILED = 'CLAIM_PUBLICATION_CREATE_FAILED';

/**
 * Get count of possibly your publications for an author
 * @param {string} author user name
 * @returns {action}
 */
export function countPossiblyYourPublications(authorUsername) {
    return dispatch => {
        dispatch({type: COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING});
        getCountPossibleUnclaimedPublications(authorUsername).then(response => {
            dispatch({
                type: COUNT_POSSIBLY_YOUR_PUBLICATIONS_COMPLETED,
                payload: response.data
            });
        }).catch((error) => {
            console.log(error);
            dispatch({
                type: COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED
            });
        });
    };
}

/**
 * Search publications from eSpace which are matched to author's username
 * @param {string} author user name
 * @returns {action}
 */
export function searchPossiblyYourPublications(authorUsername) {
    return dispatch => {
        dispatch({type: POSSIBLY_YOUR_PUBLICATIONS_LOADING});
        // TODO: try some authors who are students - org username or student name to use?
        getPossibleUnclaimedPublications(authorUsername).then(response => {
            dispatch({
                type: POSSIBLY_YOUR_PUBLICATIONS_COMPLETED,
                payload: response.data
            });
            dispatch({
                type: POSSIBLY_YOUR_PUBLICATIONS_FACETS_COMPLETED,
                payload: response.filters && response.filters.facets ? response.filters.facets : {}
            });
            dispatch(countPossiblyYourPublications(authorUsername));
        }).catch(() => {
            dispatch({
                type: POSSIBLY_YOUR_PUBLICATIONS_FAILED,
                payload: []
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
export function hidePublications(publicationsToHide, author) {
    return dispatch => {
        if (!author) return;

        dispatch({type: HIDE_PUBLICATIONS_LOADING});
        // Transform data to api format:
        // { "author_id" : "3", "publications": [ { "pid": "UQ:662328" } ] }
        const data = {
            publications: publicationsToHide.map((item) => { return {pid: item.rek_pid}; })
        };
        if (author.aut_id) {
            data.author_id = author.aut_id;
        }
        postHidePossiblePublications(data)
            .then(response => {
                dispatch({
                    type: HIDE_PUBLICATIONS_COMPLETED,
                    payload: response
                });

                // reload current possibly your publications/count after user hides records
                dispatch(searchPossiblyYourPublications(author.aut_org_username));
            })
            .catch(() => {
                dispatch({
                    type: HIDE_PUBLICATIONS_FAILED,
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
            type: PUBLICATION_TO_CLAIM_SET,
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
            type: PUBLICATION_TO_CLAIM_CLEAR
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
    return dispatch => {
        dispatch({type: CLAIM_PUBLICATION_CREATE_PROCESSING});
        if (data.publication.rek_pid) {
            // claim record from eSpace
            const claimRequest = {
                pid: data.publication.rek_pid,
                author_id: data.author.aut_id,
                comments: data.comments,
                ...claimAttachments(data.files.queue)
            };
            console.log(claimRequest);
            return postClaimPossiblePublication(claimRequest)
                .then(response => {
                    if (!data.files.queue || data.files.queue.length === 0) {
                        return response;
                    } else {
                        return putUploadFiles(data.publication.rek_pid, data.files.queue, dispatch);
                    }
                })
                .then(() => {
                    // patch the record with new data
                    const recordPatchRequest = {
                        rek_pid: data.publication.rek_pid,
                        ...recordRekLink(data),
                        ...recordFileAttachment(data.files.queue, data.publication)
                        // TODO: updated record's author_id and order ...recordAuthors(data.publication)
                    };
                    console.log(recordPatchRequest);
                    return patchRecord(data.publication.rek_pid, recordPatchRequest);
                })
                .then(response => {
                    dispatch({
                        type: CLAIM_PUBLICATION_CREATE_COMPLETED,
                        payload: response
                    });
                    return Promise.resolve(response);
                })
                .catch(error => {
                    console.log(error);

                    dispatch({
                        type: CLAIM_PUBLICATION_CREATE_FAILED,
                        payload: error
                    });
                    return Promise.reject(error);
                });
        } else {
            // claim record from external source
            // what about required fields - are they set, eg subtype, publication year etc?
            const recordRequest = {
                ...JSON.parse(JSON.stringify(data.publication)),
                ...recordRekLink(data),
                ...NEW_RECORD_DEFAULT_VALUES
            };

            console.log(recordRequest);

            let newPid;

            return postRecord(recordRequest)
                // .then(response => {
                //     newPid = response.rek_pid;
            //     if (data.files.queue.length === 0) return response;
            //     return putUploadFiles(data.rek_pid, data.files.queue);
                // })
                // .then(response => {
                //     // TODO: build a request to match author to pid, should return order for current author or not found
                //     return matchAuthor(data.rek_pid, data.author);
                // })
                .then(response => {
                    newPid = response.rek_pid;
                    const claimRequest = {
                        pid: newPid,
                        author_id: data.author.aut_id,
                        comments: data.comments,
                        ...claimAttachments(data.files.queue)
                    };
                    console.log(claimRequest);
                    return postClaimPossiblePublication(claimRequest);
                })
                .then(() => {
                    // patch the record with new data
                    const recordPatchRequest = {
                        rek_pid: newPid,
                        ...recordRekLink(data),
                        ...recordFileAttachment(data.files.queue)
                        // TODO: updated record's author_id and order ...recordAuthors(data.publication)
                    };
                    console.log(recordPatchRequest);
                    return patchRecord(newPid, recordPatchRequest);
                })
                .then(response => {
                    dispatch({
                        type: CLAIM_PUBLICATION_CREATE_COMPLETED,
                        payload: response
                    });
                    return Promise.resolve(response);
                })
                .catch(error => {
                    dispatch({
                        type: CLAIM_PUBLICATION_CREATE_FAILED,
                        payload: error
                    });
                    return Promise.reject(error);
                });
        }
    };
}

// claim-possible format:
// "{ "pid": "UQ:2", "comments": "test1", "claims": [ { "description_id": "12", "embargo_date": "11/11/2019", "file": "file1.pdf" }, { "description_id": "2", "embargo_date": "11/11/2019", "file": "file2.pdf" } ] }"
