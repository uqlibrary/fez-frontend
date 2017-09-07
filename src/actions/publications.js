import {
    getLatestPublications,
    getTrendingPublications
} from 'repositories';

export const LATEST_PUBLICATIONS_LOADING = 'LATEST_PUBLICATIONS_LOADING';
export const LATEST_PUBLICATIONS_COMPLETED = 'LATEST_PUBLICATIONS_COMPLETED';
export const LATEST_PUBLICATIONS_FAILED = 'LATEST_PUBLICATIONS_FAILED';

export const AUTHOR_PUBLICATIONS_LOADING = 'AUTHOR_PUBLICATIONS_LOADING';
export const AUTHOR_PUBLICATIONS_COMPLETED = 'AUTHOR_PUBLICATIONS_COMPLETED';
export const AUTHOR_PUBLICATIONS_PAGING_COMPLETED = 'AUTHOR_PUBLICATIONS_PAGING_COMPLETED';
export const AUTHOR_PUBLICATIONS_FAILED = 'AUTHOR_PUBLICATIONS_FAILED';

export const TRENDING_PUBLICATIONS_LOADING = 'TRENDING_PUBLICATIONS_LOADING';
export const TRENDING_PUBLICATIONS_COMPLETED = 'TRENDING_PUBLICATIONS_COMPLETED';
export const TRENDING_PUBLICATIONS_FAILED = 'TRENDING_PUBLICATIONS_FAILED';

/**
 * Get latest publications
 * @param {string} author user name
 * @returns {action}
 */
export function searchLatestPublications(userName) {
    return dispatch => {
        dispatch({type: LATEST_PUBLICATIONS_LOADING});
        // TODO: try some authors who are students - org username or student name to use?
        getLatestPublications({userName: userName, pageSize: 5}).then(response => {
            dispatch({
                type: LATEST_PUBLICATIONS_COMPLETED,
                payload: response
            });
        }).catch(() => {
            dispatch({
                type: LATEST_PUBLICATIONS_FAILED,
                payload: []
            });
        });
    };
}

/**
 * Get author's publications
 * @param {string} author user name
 * @returns {action}
 */
export function searchAuthorPublications({userName, page = 1, pageSize = 20, sortBy, sortDirection}) {
    return dispatch => {
        dispatch({type: AUTHOR_PUBLICATIONS_LOADING});
        getLatestPublications({userName: userName, page: page, pageSize: pageSize, sortBy: sortBy, sortDirection: sortDirection}).then(response => {
            dispatch({
                type: AUTHOR_PUBLICATIONS_COMPLETED,
                payload: response
            });
        }).catch((error) => {
            dispatch({
                type: AUTHOR_PUBLICATIONS_FAILED,
                payload: error
            });
        });
    };
}

/**
 * Get trending publications
 * @param {string} author user name
 * @returns {action}
 */
export function searchTrendingPublications(authorUsername) {
    return dispatch => {
        dispatch({type: TRENDING_PUBLICATIONS_LOADING});
        // TODO: try some authors who are students - org username or student name to use?
        getTrendingPublications(authorUsername).then(response => {
            // TODO: this response will change when this api endpoint will be moved to fez
            dispatch({
                type: TRENDING_PUBLICATIONS_COMPLETED,
                payload: Object.keys(response)
                    .filter(item => {
                        return item !== 'author_details';
                    })
                    .map(item => {
                        return {key: item, values: response[item]};
                    })
            });
        }).catch(() => {
            dispatch({
                type: TRENDING_PUBLICATIONS_FAILED,
                payload: []
            });
        });
    };
}
