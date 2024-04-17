import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { ADMIN_DASHBOARD_TODAY_API } from 'repositories/routes';

/**
 * Fetches the controlled vocabularies list
 * @returns {function(*)}
 */
export function loadAdminDashboardToday() {
    return dispatch => {
        dispatch({
            type: actions.ADMIN_DASHBOARD_TODAY_LOADING,
        });
        return get(ADMIN_DASHBOARD_TODAY_API())
            .then(result => {
                dispatch({
                    type: actions.ADMIN_DASHBOARD_TODAY_SUCCESS,
                    payload: result.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.ADMIN_DASHBOARD_TODAY_FAILED,
                    payload: error.message,
                });
            });
    };
}
