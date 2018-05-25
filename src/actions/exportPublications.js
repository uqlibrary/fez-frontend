import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import {promptForDownload} from './exportPublicationsDataTransformers';

/**
 * Reusable export publications action
 *
 * @param format
 * @param doRequest
 * @param dispatch
 * @return {*}
 */
export function exportPublications({exportFormat, requestParams}) {
    return dispatch => {
        dispatch({type: actions.EXPORT_PUBLICATIONS_LOADING});

        return get(requestParams, {responseType: 'blob'})
            .then(response => {
                promptForDownload(exportFormat, response);

                dispatch({
                    type: actions.EXPORT_PUBLICATIONS_LOADED,
                    payload: exportFormat
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.EXPORT_PUBLICATIONS_FAILED,
                    payload: error.message
                });
            });
    };
}

