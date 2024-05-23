import * as actions from './actionTypes';
import { get, post, put, destroy } from 'repositories/generic';
import {
    ADMIN_DASHBOARD_CONFIG_API,
    ADMIN_DASHBOARD_TODAY_API,
    ADMIN_DASHBOARD_QUICKLINKS_API,
    ADMIN_DASHBOARD_SYSTEM_ALERTS_API,
    ADMIN_DASHBOARD_DISPLAY_REPORT_API,
    ADMIN_DASHBOARD_EXPORT_REPORT_API,
} from 'repositories/routes';

import { promptForDownload } from './exportPublicationsDataTransformers';

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

/**
 * Fetches export (legacy) report data as a file attachment
 * @returns {function(*)}
 */
export function loadAdminDashboardExportReport(request) {
    return dispatch => {
        const exportConfig = {
            format: request.export_to,
        };

        dispatch({
            type: actions.ADMIN_DASHBOARD_EXPORT_REPORT_LOADING,
        });

        const getOptions = { responseType: 'blob' };

        return get(ADMIN_DASHBOARD_EXPORT_REPORT_API({ id: request.id }), { ...getOptions })
            .then(response => {
                promptForDownload(exportConfig.format, response);

                dispatch({
                    type: actions.ADMIN_DASHBOARD_EXPORT_REPORT_SUCCESS,
                    payload: exportConfig,
                });

                return Promise.resolve();
            })
            .catch(error => {
                dispatch({
                    type: actions.ADMIN_DASHBOARD_EXPORT_REPORT_FAILED,
                    payload: {
                        ...exportConfig,
                        errorMessage: error.message,
                    },
                });
            });
    };
}

/**
 * Fetches display report data
 * @returns {function(*)}
 */
export function loadAdminDashboardDisplayReport(request) {
    return dispatch => {
        dispatch({
            type: actions.ADMIN_DASHBOARD_DISPLAY_REPORT_LOADING,
        });
        return get(ADMIN_DASHBOARD_DISPLAY_REPORT_API(request))
            .then(response => {
                dispatch({
                    type: actions.ADMIN_DASHBOARD_DISPLAY_REPORT_SUCCESS,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.ADMIN_DASHBOARD_DISPLAY_REPORT_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearAdminDashboardDisplayReport() {
    return dispatch => {
        dispatch({
            type: actions.ADMIN_DASHBOARD_DISPLAY_REPORT_CLEAR,
        });
    };
}

export function clearAdminDashboardExportReport() {
    return dispatch => {
        dispatch({
            type: actions.ADMIN_DASHBOARD_EXPORT_REPORT_CLEAR,
        });
    };
}
