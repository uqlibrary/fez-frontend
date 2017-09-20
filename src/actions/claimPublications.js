import * as repositories from 'repositories';
import * as transformers from './transformers';
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
        repositories.getCountPossibleUnclaimedPublications(authorUsername).then(response => {
            dispatch({
                type: COUNT_POSSIBLY_YOUR_PUBLICATIONS_COMPLETED,
                payload: response.data
            });
        }).catch((error) => {
            dispatch({
                type: COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED,
                payload: error
            });
        });
    };
}

/**
 * Search publications from eSpace which are matched to author's username
 * @param {string} author user name
 * @returns {action}
 */
export function searchPossiblyYourPublications(authorUsername, activeFacets) {
    return dispatch => {
        dispatch({type: POSSIBLY_YOUR_PUBLICATIONS_LOADING, payload: activeFacets});
        // TODO: try some authors who are students - org username or student name to use?
        repositories.getPossibleUnclaimedPublications(authorUsername, activeFacets).then(response => {
            dispatch({
                type: POSSIBLY_YOUR_PUBLICATIONS_COMPLETED,
                payload: response,
            });
            dispatch({
                type: POSSIBLY_YOUR_PUBLICATIONS_FACETS_COMPLETED,
                payload: response.filters && response.filters.facets ? response.filters.facets : {}
            });
            dispatch(countPossiblyYourPublications(authorUsername));
        }).catch((error) => {
            dispatch({
                type: POSSIBLY_YOUR_PUBLICATIONS_FAILED,
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

        dispatch({type: HIDE_PUBLICATIONS_LOADING});
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
                    type: HIDE_PUBLICATIONS_COMPLETED,
                    payload: response
                });

                // reload current possibly your publications/count after user hides records
                dispatch(searchPossiblyYourPublications(author.aut_org_username, activeFacets));
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

        // claim record from external source
        const createRecordRequest = data.publication.rek_pid ?
            data.publication : {
                ...JSON.parse(JSON.stringify(data.publication)),
                ...NEW_RECORD_DEFAULT_VALUES
            };

        // claim record from eSpace
        console.log(createRecordRequest);

        return repositories.postRecord(createRecordRequest)
            .then(response => {
                data.publication.rek_pid = response.rek_pid;
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
                // patch the record with new data
                // auto-assign current author if there's only one author
                const soloAuthor = {
                    fez_record_search_key_author_id: {
                        rek_author_id: data.author.aut_id,
                        rek_author_id_order: 1
                    }
                };

                const getRecordAuthorsIdSearchKeys = data.publication.fez_record_search_key_author.length === 1 && !data.authorLinking
                    ? soloAuthor : transformers.getRecordAuthorsIdSearchKey(data.authorLinking.authors);

                const recordPatchRequest = {
                    rek_pid: data.publication.rek_pid,
                    ...transformers.getRecordLinkSearchKey(data),
                    ...transformers.getRecordFileAttachmentSearchKey(data.files ? data.files.queue : [], data.publication),
                    ...getRecordAuthorsIdSearchKeys
                };
                console.log(recordPatchRequest);
                return repositories.patchRecord(data.publication.rek_pid, recordPatchRequest);
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
    };
}
