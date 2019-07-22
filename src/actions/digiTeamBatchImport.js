import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { BATCH_IMPORT_DIRECTORIES_API } from 'repositories/routes';

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
