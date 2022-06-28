import * as actions from './actionTypes';
import { get } from 'repositories/generic';

/**
 * Reusable export Communities action
 *
 * @param format
 * @param doRequest
 * @param dispatch
 * @return {*}
 */
export function exportCommunities(requestParams) {
    return dispatch => {
        const exportConfig = {
            format: requestParams.options.params.export_to,
            page: requestParams.options.params.page,
        };

        dispatch({
            type: actions.EXPORT_COMMUNITIES_LOADING,
            payload: exportConfig,
        });

        return get(requestParams)
            .then(() => {
                dispatch({
                    type: actions.EXPORT_COMMUNITIES_LOADED,
                    payload: exportConfig,
                });
                return Promise.resolve();
            })
            .catch(error => {
                dispatch({
                    type: actions.EXPORT_COMMUNITIES_FAILED,
                    payload: {
                        ...exportConfig,
                        errorMessage: error.message,
                    },
                });
            });
    };
}

/**
 * Reusable export Collections action
 *
 * @param format
 * @param doRequest
 * @param dispatch
 * @return {*}
 */
export function exportCollections(requestParams) {
    return dispatch => {
        const exportConfig = {
            format: requestParams.options.params.export_to,
            page: requestParams.options.params.page,
            pid: requestParams.options.params.pid,
        };

        dispatch({
            type: actions.EXPORT_COLLECTIONS_LOADING,
            payload: exportConfig,
        });

        delete requestParams.options.params.pid;

        return get(requestParams)
            .then(() => {
                dispatch({
                    type: actions.EXPORT_COLLECTIONS_LOADED,
                    payload: exportConfig,
                });
                return Promise.resolve();
            })
            .catch(error => {
                dispatch({
                    type: actions.EXPORT_COLLECTIONS_FAILED,
                    payload: {
                        ...exportConfig,
                        errorMessage: error.message,
                    },
                });
            });
    };
}
