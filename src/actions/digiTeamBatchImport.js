import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { COLLECTIONS_BY_COMMUNITY_LOOKUP_API, BATCH_IMPORT_DIRECTORIES_API } from 'repositories/routes';

/**
 * Fetches collections that belong to a specific community
 *
 * @param communityPid - the pid for which we want the child Collections
 * @returns {function(*): Promise<any | never>}
 */
export function getCollectionsInCommunity(communityPid) {
    if (!!communityPid) {
        return dispatch => {
            dispatch({ type: actions.COLLECTION_LIST_LOADING });
            return get(COLLECTIONS_BY_COMMUNITY_LOOKUP_API({ communityPid })).then(
                response => {
                    dispatch({ type: actions.COLLECTION_LIST_LOADED, payload: response.data });
                },
                error => {
                    dispatch({ type: actions.COLLECTION_LIST_FAILED, payload: error.message });
                }
            );
        };
    }
    return false; // should we instead dispatch a _FAILED ?
}

export function createDigiTeamBatchImport() {
    // TODO
}

export function getBatchImportDirectories() {
    return dispatch => {
        dispatch({ type: actions.DIRECTORY_LIST_LOADING });
        return get(BATCH_IMPORT_DIRECTORIES_API()).then(
            response => {
                dispatch({ type: actions.DIRECTORY_LIST_LOADED, payload: response.data });
            },
            error => {
                dispatch({ type: actions.DIRECTORY_LIST_FAILED, payload: error.message });
            }
        );
    };
}
