import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { ADMIN_DASHBOARD_TODAY_API, ADMIN_DASHBOARD_QUICKLINKS_API } from 'repositories/routes';

/**
 * Fetches the metrics for the Today tab
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

/**
 * Fetches the quicklinks
 * @returns {function(*)}
 */
export function loadAdminDashboardQuickLinks() {
    return dispatch => {
        dispatch({
            type: actions.ADMIN_DASHBOARD_QUICKLINKS_LOADING,
        });
        return get(ADMIN_DASHBOARD_QUICKLINKS_API())
            .then(result => {
                dispatch({
                    type: actions.ADMIN_DASHBOARD_QUICKLINKS_SUCCESS,
                    payload: result.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.ADMIN_DASHBOARD_QUICKLINKS_FAILED,
                    payload: error.message,
                });
            });
    };
}
