import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { promptForDownload } from './exportPublicationsDataTransformers';

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

        return get(requestParams, { responseType: 'blob' })
            .then(response => {
                promptForDownload(requestParams.options.params.export_to, response);

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
