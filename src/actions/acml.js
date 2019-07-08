import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { GET_ACML_QUICK_TEMPLATES_API } from 'repositories/routes';

/**
 * Load a list of file access types from fez, eg open access, embargo, etc
 * @returns {action}
 */
export function loadAcmlQuickTemplates() {
    return dispatch => {
        dispatch({ type: actions.ACML_QUICK_TEMPLATES_LOADING });
        return get(GET_ACML_QUICK_TEMPLATES_API())
            .then(accessTypes => {
                dispatch({
                    type: actions.ACML_QUICK_TEMPLATES_LOADED,
                    payload: accessTypes.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.ACML_QUICK_TEMPLATES_FAILED,
                    payload: error.message,
                });
            });
    };
}
