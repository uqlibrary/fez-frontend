import {getPossibleUnclaimedPublications, postHidePossiblePublications} from 'repositories/publications';

export const POSSIBLY_YOURS_PUBLICATIONS_LOADING = 'POSSIBLY_YOURS_PUBLICATIONS_LOADING';
export const POSSIBLY_YOURS_PUBLICATIONS_COMPLETED = 'POSSIBLY_YOURS_PUBLICATIONS_COMPLETED';
export const POSSIBLY_YOURS_PUBLICATIONS_FAILED = 'POSSIBLY_YOURS_PUBLICATIONS_FAILED';

export const HIDE_PUBLICATIONS_LOADING = 'HIDE_PUBLICATIONS_LOADING';
export const HIDE_PUBLICATIONS_COMPLETED = 'HIDE_PUBLICATIONS_COMPLETED';
export const HIDE_PUBLICATIONS_FAILED = 'HIDE_PUBLICATIONS_FAILED';

/**
 * Search publications from eSpace which are matched to username
 * @param username {string}
 * @returns {action}
 */
export function searchPossiblyYourPublications(username) {
    return dispatch => {
        dispatch({type: POSSIBLY_YOURS_PUBLICATIONS_LOADING});
        getPossibleUnclaimedPublications(username).then(response => {
            dispatch({
                type: POSSIBLY_YOURS_PUBLICATIONS_COMPLETED,
                payload: response
            });
        }).catch(() => {
            dispatch({
                type: POSSIBLY_YOURS_PUBLICATIONS_FAILED,
                payload: []
            });
        });
    };
}

/**
 * Hide publications form user possibly your research view, eg hide
 * @param data {array} - list of publications to hide
 * @param author_id {number} - optional, author id to claim as
 * @returns {action}
 */
export function hidePublications(publicationsToHide, authorId) {
    return dispatch => {
        dispatch({type: HIDE_PUBLICATIONS_LOADING});

        // Transform data to api format:
        // { "author_id" : "3", "publications": [ { "pid": "UQ:662328" } ] }
        const data = {
            publications: publicationsToHide.map((item) => { return {pid: item.rek_pid}; })
        };

        if (authorId) {
            data.author_id = authorId;
        }
        console.log(data);
        return postHidePossiblePublications(data).then(response => {
            dispatch({
                type: HIDE_PUBLICATIONS_COMPLETED,
                payload: response
            });
        }).catch(() => {
            dispatch({
                type: HIDE_PUBLICATIONS_FAILED,
                payload: []
            });
        });
    };
}

// claim-possible format:
// "{ "pid": "UQ:2", "comments": "test1", "claims": [ { "description_id": "12", "embargo_date": "11/11/2019", "file": "file1.pdf" }, { "description_id": "2", "embargo_date": "11/11/2019", "file": "file2.pdf" } ] }"
