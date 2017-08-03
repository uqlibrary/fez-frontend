import {
    getPossibleUnclaimedPublications,
    postHidePossiblePublications,
    getCountPossibleUnclaimedPublications,
    postClaimPossiblePublication,
    putUploadFiles
} from 'repositories';

export const POSSIBLY_YOUR_PUBLICATIONS_LOADING = 'POSSIBLY_YOUR_PUBLICATIONS_LOADING';
export const POSSIBLY_YOUR_PUBLICATIONS_COMPLETED = 'POSSIBLY_YOUR_PUBLICATIONS_COMPLETED';
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
 * @param {object} author
 * @returns {action}
 */
export function countPossiblyYourPublications(author) {
    return dispatch => {
        dispatch({type: COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING});
        getCountPossibleUnclaimedPublications(author.aut_org_username).then(response => {
            dispatch({
                type: COUNT_POSSIBLY_YOUR_PUBLICATIONS_COMPLETED,
                payload: response
            });
        }).catch(() => {
            dispatch({
                type: COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED,
                payload: 0
            });
        });
    };
}

/**
 * Search publications from eSpace which are matched to author's username
 * @param {object} author
 * @returns {action}
 */
export function searchPossiblyYourPublications(author) {
    return dispatch => {
        dispatch({type: POSSIBLY_YOUR_PUBLICATIONS_LOADING});
        // TODO: try some authors who are students - org username or student name to use?
        getPossibleUnclaimedPublications(author.aut_org_username).then(response => {
            dispatch({
                type: POSSIBLY_YOUR_PUBLICATIONS_COMPLETED,
                payload: response
            });
            dispatch(countPossiblyYourPublications(author));
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
 * @param author {object} - should include author id/user name
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
                dispatch(searchPossiblyYourPublications(author));
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
export function claimPublication(data, files) {
    console.log('claimPublication');

    return dispatch => {
        dispatch({type: CLAIM_PUBLICATION_CREATE_PROCESSING});

        // if (data.rek_pid) {
        // claim record from eSpace
        return postClaimPossiblePublication(data)
            .then(response => {
                if (files.length === 0) return response;
                return putUploadFiles(data.rek_pid, files);
            })
            // .then(response => {
            //     if (files.length === 0) return response;
            //
            //     // process uploaded files into API format for a patch
            //     const fileDataPatch = {
            //         fez_record_search_key_file_attachment_name: files.map((file, index) => {
            //             return {
            //                 'rek_file_attachment_name': file.name,
            //                 'rek_file_attachment_name_order': (index + 1)
            //             };
            //         })
            //     };
            //
            //     return patchRecord(data.rek_pid, fileDataPatch);
            // })
            .then(response => {
                dispatch({
                    type: CLAIM_PUBLICATION_CREATE_COMPLETED,
                    payload: response
                });
                console.log(CLAIM_PUBLICATION_CREATE_COMPLETED);
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: CLAIM_PUBLICATION_CREATE_FAILED,
                    payload: error
                });
                return Promise.reject(error);
            });
        // } else {
        //     // claim record from external source
        //     // what about required fields - are they set, eg subtype, publication year etc?
        // }
    };
}

// claim-possible format:
// "{ "pid": "UQ:2", "comments": "test1", "claims": [ { "description_id": "12", "embargo_date": "11/11/2019", "file": "file1.pdf" }, { "description_id": "2", "embargo_date": "11/11/2019", "file": "file2.pdf" } ] }"
