import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import {
    COMMUNITY_LIST_API,
    COLLECTION_LIST_API,
    EXPORT_COMMUNITY_LIST_API,
    EXPORT_COLLECTION_LIST_API,
} from 'repositories/routes';
import { exportCommunities, exportCollections } from './exportCommunitiesCollections';

/**
 * Load Communities List
 * @param {object}
 * @returns {action}
 */
export function loadCommunitiesList(params = {}) {
    const { pageSize, page, direction, sortBy } = params;
    return dispatch => {
        dispatch({ type: actions.VIEW_COMMUNITIES_LOADING });

        return get(COMMUNITY_LIST_API({ pageSize: pageSize, page: page, direction: direction, sortBy: sortBy }))
            .then(response => {
                dispatch({
                    type: actions.VIEW_COMMUNITIES_LOADED,
                    payload: response,
                });

                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.VIEW_COMMUNITIES_LOAD_FAILED,
                    payload: error,
                });
            });
    };
}
export function loadCCCollectionsList(params = {}) {
    const { pid, pageSize, page, direction, sortBy } = params;
    return dispatch => {
        dispatch({ type: actions.VIEW_COLLECTIONS_LOADING, payload: { pid: pid, pageSize: pageSize } });
        return get(
            COLLECTION_LIST_API({ pid: pid, pageSize: pageSize, page: page, direction: direction, sortBy: sortBy }),
        )
            .then(response => {
                dispatch({
                    type: actions.VIEW_COLLECTIONS_LOADED,
                    payload: {
                        parent: pid,
                        data: response,
                    },
                });

                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.VIEW_COLLECTIONS_LOAD_FAILED,
                    payload: error,
                });
            });
    };
}
export function clearCCCollectionsList() {
    return dispatch => {
        dispatch({ type: actions.VIEW_COLLECTIONS_CLEARED });
    };
}
export function setCollectionsArray(rowObject) {
    return dispatch => {
        dispatch({
            type: actions.SET_COLLECTIONS_ARRAY,
            payload: {
                pid: rowObject.pid,
                open: rowObject.open,
            },
        });
    };
}
export function exportCommunityRecords(params) {
    return exportCommunities(EXPORT_COMMUNITY_LIST_API({ ...params }));
}
export function exportCollectionRecords(params) {
    return exportCollections(EXPORT_COLLECTION_LIST_API({ ...params }));
}
