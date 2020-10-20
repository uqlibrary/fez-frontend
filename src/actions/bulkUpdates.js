import { BULK_UPDATES_LIST_LOADING, BULK_UPDATES_LIST_LOADED, BULK_UPDATES_LIST_FAILED } from './actionTypes';
import { get } from 'repositories/generic';
import { BULK_UPDATES_API } from 'repositories/routes';

export function loadBulkUpdatesList() {
    return async dispatch => {
        dispatch({ type: BULK_UPDATES_LIST_LOADING });

        try {
            const response = await get(BULK_UPDATES_API());
            dispatch({
                type: BULK_UPDATES_LIST_LOADED,
                payload: response.data,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: BULK_UPDATES_LIST_FAILED,
                payload: e,
            });

            return false;
        }
    };
}
