import * as actions from './actionTypes';
import { get, post, put, destroy } from 'repositories/generic';
import {
    ADMIN_DASHBOARD_CONFIG_API,
    ADMIN_DASHBOARD_TODAY_API,
    ADMIN_DASHBOARD_QUICKLINKS_API,
    ADMIN_DASHBOARD_SYSTEM_ALERTS_API,
} from 'repositories/routes';

/**
 * Fetches the config data for admin dashboard
 * @returns {function(*)}
 */
export function loadAdminDashboardConfig() {
    return dispatch => {
        dispatch({
            type: actions.ADMIN_DASHBOARD_CONFIG_LOADING,
        });
        return get(ADMIN_DASHBOARD_CONFIG_API())
            .then(response => {
                dispatch({
                    type: actions.ADMIN_DASHBOARD_CONFIG_SUCCESS,
                    payload: response.data,
                });
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.ADMIN_DASHBOARD_CONFIG_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}

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
            .then(response => {
                dispatch({
                    type: actions.ADMIN_DASHBOARD_TODAY_SUCCESS,
                    payload: response.data,
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
            .then(response => {
                dispatch({
                    type: actions.ADMIN_DASHBOARD_QUICKLINKS_SUCCESS,
                    payload: response.data,
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

/**
 * Handles admin operations on quick links (edit, delete)
 * @returns {function(*)}
 */
export function adminDashboardQuickLink(request, action) {
    // eslint-disable-next-line no-nested-ternary
    const verb = action === 'DELETE' ? destroy : action === 'EDIT' || action === 'REORDER' ? put : post;
    return dispatch => {
        dispatch({ type: actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATING });
        return verb(ADMIN_DASHBOARD_QUICKLINKS_API(), request)
            .then(response => {
                if (response?.status?.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_SUCCESS,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}

/**
 * Fetches the System Alerts
 * @returns {function(*)}
 */
export function loadAdminDashboardSystemAlerts() {
    return dispatch => {
        dispatch({
            type: actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_LOADING,
        });
        return get(ADMIN_DASHBOARD_SYSTEM_ALERTS_API())
            .then(response => {
                dispatch({
                    type: actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_SUCCESS,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_FAILED,
                    payload: error.message,
                });
            });
    };
}

/**
 * Handles admin operations on system alerts (assign, resolve)
 * @returns {function(*)}
 */
export function adminDashboardSystemAlerts(request) {
    return dispatch => {
        dispatch({ type: actions.ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATING });
        return put(ADMIN_DASHBOARD_SYSTEM_ALERTS_API(), request)
            .then(response => {
                if (response?.status?.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATE_SUCCESS,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATE_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATE_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}
