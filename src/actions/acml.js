import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import * as routes from 'repositories/routes';

/**
 * Load a list of file access types from fez, eg open access, embargo, etc
 * @returns {action}
 */
export function loadAcmlQuickTemplates() {
    return dispatch => {
        dispatch({type: actions.ACML_QUICK_TEMPLATES_LOADING});
        get(routes.GET_ACML_QUICK_TEMPLATES_API())
            .then(accessTypes => {
                dispatch({
                    type: actions.ACML_QUICK_TEMPLATES_LOADED,
                    payload: accessTypes.data
                });
            })
            .catch(error => {
                if (error.status === 403) dispatch({type: actions.ACCOUNT_ANONYMOUS});
                dispatch({
                    type: actions.ACML_QUICK_TEMPLATES_FAILED,
                    payload: error
                });
            });
    };
}
