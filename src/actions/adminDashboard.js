import * as actions from './actionTypes';
import { get, post, put, destroy } from 'repositories/generic';
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

export function adminDashboardQuickLink(request, action) {
    // eslint-disable-next-line no-nested-ternary
    const verb = action === 'DELETE' ? destroy : action === 'EDIT' ? put : post;
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
// export function adminEditDashboardQuickLink(request) {
//     return dispatch => {
//         dispatch({ type: actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATING });
//         return put(ADMIN_DASHBOARD_QUICKLINKS_API(), request)
//             .then(response => {
//                 if (response?.status?.toLowerCase() === 'ok') {
//                     dispatch({
//                         type: actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_SUCCESS,
//                         payload: response,
//                     });
//                 } else {
//                     dispatch({
//                         type: actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_FAILED,
//                         payload: response.message,
//                     });
//                 }
//                 return Promise.resolve(response);
//             })
//             .catch(error => {
//                 dispatch({
//                     type: actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_FAILED,
//                     payload: error.message,
//                 });
//                 return Promise.reject(error);
//             });
//     };
// }
// export function adminDeleteDashboardQuickLink(request) {
//     return dispatch => {
//         dispatch({ type: actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATING });
//         return destroy(ADMIN_DASHBOARD_QUICKLINKS_API(), request)
//             .then(response => {
//                 if (response?.status?.toLowerCase() === 'ok') {
//                     dispatch({
//                         type: actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_SUCCESS,
//                         payload: response,
//                     });
//                 } else {
//                     dispatch({
//                         type: actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_FAILED,
//                         payload: response.message,
//                     });
//                 }
//                 return Promise.resolve(response);
//             })
//             .catch(error => {
//                 dispatch({
//                     type: actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_FAILED,
//                     payload: error.message,
//                 });
//                 return Promise.reject(error);
//             });
//     };
// }
