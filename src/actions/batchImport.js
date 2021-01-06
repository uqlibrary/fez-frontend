import * as actions from './actionTypes';
import { get, post } from 'repositories/generic';
import { BATCH_IMPORT_DIRECTORIES_API, BATCH_IMPORT_API } from 'repositories/routes';

export function getBatchImportDirectories() {
    return dispatch => {
        dispatch({ type: actions.DIRECTORY_LIST_LOADING });
        return get(BATCH_IMPORT_DIRECTORIES_API()).then(
            response => {
                dispatch({ type: actions.DIRECTORY_LIST_LOADED, payload: response.data });
                return Promise.resolve(response);
            },
            error => {
                dispatch({ type: actions.DIRECTORY_LIST_FAILED, payload: error.message });
                return Promise.reject(new Error(error.message));
            },
        );
    };
}

export const createBatchImport = data => {
    delete data.communityID;

    return async dispatch => {
        dispatch({
            type: actions.BATCH_IMPORT_REQUESTING,
        });
        try {
            const response = await post(BATCH_IMPORT_API(), data);
            dispatch({
                type: actions.BATCH_IMPORT_REQUESTED,
                payload: response,
            });

            return Promise.resolve(response);
        } catch (e) {
            dispatch({
                type: actions.BATCH_IMPORT_REQUEST_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
};
