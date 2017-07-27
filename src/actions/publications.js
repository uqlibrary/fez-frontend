import {getPossibleUnclaimedPublications, postHidePossiblePublications, getCountPossibleUnclaimedPublications} from 'repositories/publications';

export const POSSIBLY_YOUR_PUBLICATIONS_LOADING = 'POSSIBLY_YOUR_PUBLICATIONS_LOADING';
export const POSSIBLY_YOUR_PUBLICATIONS_COMPLETED = 'POSSIBLY_YOUR_PUBLICATIONS_COMPLETED';
export const POSSIBLY_YOUR_PUBLICATIONS_FAILED = 'POSSIBLY_YOUR_PUBLICATIONS_FAILED';

export const COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING = 'COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING';
export const COUNT_POSSIBLY_YOUR_PUBLICATIONS_COMPLETED = 'COUNT_POSSIBLY_YOUR_PUBLICATIONS_COMPLETED';
export const COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED = 'COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED';

export const HIDE_PUBLICATIONS_LOADING = 'HIDE_PUBLICATIONS_LOADING';
export const HIDE_PUBLICATIONS_COMPLETED = 'HIDE_PUBLICATIONS_COMPLETED';
export const HIDE_PUBLICATIONS_FAILED = 'HIDE_PUBLICATIONS_FAILED';

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

// claim-possible format:
// "{ "pid": "UQ:2", "comments": "test1", "claims": [ { "description_id": "12", "embargo_date": "11/11/2019", "file": "file1.pdf" }, { "description_id": "2", "embargo_date": "11/11/2019", "file": "file2.pdf" } ] }"
