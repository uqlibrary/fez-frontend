import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { promptForDownload } from './exportPublicationsDataTransformers';
import { MY_RECORDS_BULK_EXPORT_SIZE, PUB_SEARCH_BULK_EXPORT_SIZE } from 'config/general';

/**
 * Reusable export publications action
 *
 * @param format
 * @param doRequest
 * @param dispatch
 * @return {*}
 */
export function exportPublications(requestParams) {
    return dispatch => {
        dispatch({ type: actions.EXPORT_PUBLICATIONS_LOADING });

        const bulkExportSizes = [MY_RECORDS_BULK_EXPORT_SIZE, PUB_SEARCH_BULK_EXPORT_SIZE];
        const getOptions = {};
        if (!bulkExportSizes.includes(requestParams.options.params.per_page)) {
            getOptions.responseType = 'blob';
        }

        return get(requestParams, { ...getOptions })
            .then(response => {
                if (getOptions.responseType === 'blob') {
                    promptForDownload(requestParams.options.params.export_to, response);
                }

                dispatch({
                    type: actions.EXPORT_PUBLICATIONS_LOADED,
                    payload: requestParams.options.params.export_to,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.EXPORT_PUBLICATIONS_FAILED,
                    payload: error.message,
                });
            });
    };
}
