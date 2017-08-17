import {
    getLatestPublications,
    getTrendingPublications
} from 'repositories';

export const LATEST_PUBLICATIONS_LOADING = 'LATEST_PUBLICATIONS_LOADING';
export const LATEST_PUBLICATIONS_COMPLETED = 'LATEST_PUBLICATIONS_COMPLETED';
export const LATEST_PUBLICATIONS_FAILED = 'LATEST_PUBLICATIONS_FAILED';

export const TRENDING_PUBLICATIONS_LOADING = 'TRENDING_PUBLICATIONS_LOADING';
export const TRENDING_PUBLICATIONS_COMPLETED = 'TRENDING_PUBLICATIONS_COMPLETED';
export const TRENDING_PUBLICATIONS_FAILED = 'TRENDING_PUBLICATIONS_FAILED';

/**
 * Get latest publications
 * @param {string} author user name
 * @returns {action}
 */
export function searchLatestPublications(authorUsername) {
    return dispatch => {
        dispatch({type: LATEST_PUBLICATIONS_LOADING});
        // TODO: try some authors who are students - org username or student name to use?
        getLatestPublications(authorUsername).then(response => {
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
