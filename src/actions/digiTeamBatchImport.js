import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { COMMUNITY_LOOKUP_API } from 'repositories/routes';

/**
 * loadCollectionsList - returns records for a list of collections that are a child of a specific community in eSpace
 * @param communityPid - the pid for which we want the child Collections
 * @returns {function(*): Promise<any | never>}
 */
export function collectionsByCommunityList(communityPid) {
    if (!!communityPid) {
        return dispatch => {
            dispatch({ type: actions.COLLECTION_LIST_LOADING });
            return get(
                COMMUNITY_LOOKUP_API(communityPid)
            )
                .then(
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
