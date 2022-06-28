import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { promptForDownload } from './exportPublicationsDataTransformers';
import { COMMUNITY_COLLECTION_BULK_EXPORT_SIZE } from 'config/general';

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

        const bulkExportSizes = [COMMUNITY_COLLECTION_BULK_EXPORT_SIZE];
        const getOptions = {};
        if (!bulkExportSizes.includes(requestParams.options.params.per_page)) {
            getOptions.responseType = 'blob';
        }

        return get(requestParams, { ...getOptions })
            .then(response => {
                if (getOptions.responseType === 'blob') {
                    promptForDownload(exportConfig.format, response);
                }
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

        const bulkExportSizes = [COMMUNITY_COLLECTION_BULK_EXPORT_SIZE];
        const getOptions = {};
        if (!bulkExportSizes.includes(requestParams.options.params.per_page)) {
            getOptions.responseType = 'blob';
        }

        delete requestParams.options.params.pid;

        return get(requestParams, { ...getOptions })
            .then(response => {
                if (getOptions.responseType === 'blob') {
                    promptForDownload(exportConfig.format, response);
                }
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

export const resetExportCommunitiesCollectionsStatus = () => {
    return dispatch => {
        dispatch({
            type: actions.EXPORT_PUBLICATIONS_RESET,
        });
    };
};
