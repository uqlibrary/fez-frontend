import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { VOCAB_LIST_API, CHILD_VOCAB_LIST_API } from 'repositories/routes';
// import { exportCommunities, exportCollections } from './exportCommunitiesCollections';

// zdebug
export { loadCommunitiesList } from './viewCommunitiesCollections';

/**
 * Load Communities List
 * @param {object}
 * @returns {action}
 */
export function loadControlledVocabList(params = {}) {
    alert('here');
    const { pageSize, page, direction, sortBy } = params;
    return dispatch => {
        alert('here3');
        dispatch({ type: actions.VIEW_VOCAB_LOADING });

        return get(VOCAB_LIST_API({ pageSize: pageSize, page: page, direction: direction, sortBy: sortBy }))
            .then(response => {
                alert('here2');
                console.log('resp=', response);
                dispatch({
                    type: actions.VIEW_VOCAB_LOADED,
                    payload: response,
                });

                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.VIEW_VOCAB_LOAD_FAILED,
                    payload: error,
                });
            });
    };
}
export function loadChildVocabList(params = {}) {
    const { pid, pageSize, page, direction, sortBy } = params;
    return dispatch => {
        dispatch({ type: actions.VIEW_CHILD_VOCAB_LOADING, payload: { pid: pid, pageSize: pageSize } });
        return get(
            CHILD_VOCAB_LIST_API({ pid: pid, pageSize: pageSize, page: page, direction: direction, sortBy: sortBy }),
        )
            .then(response => {
                dispatch({
                    type: actions.VIEW_CHILD_VOCAB_LOADED,
                    payload: {
                        parent: pid,
                        data: response,
                    },
                });

                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.VIEW_CHILD_VOCAB_LOAD_FAILED,
                    payload: error,
                });
            });
    };
}
export function clearControlledVocabList() {
    return dispatch => {
        dispatch({ type: actions.VIEW_CHILD_VOCAB_CLEARED });
    };
}
export function setControlledVocabArray(rowObject) {
    return dispatch => {
        dispatch({
            type: actions.SET_CHILD_VOCAB_ARRAY,
            payload: {
                pid: rowObject.pid,
                open: rowObject.open,
            },
        });
    };
}
// export function exportControlledVocabRecords(params) {
//     return exportCommunities(COMMUNITY_LIST_API({ ...params }));
// }
// export function exportCollectionRecords(params) {
//     return exportCollections(COLLECTION_LIST_API({ ...params }, 'export'));
// }
