import {getAcmlQuickTemplates} from '../repositories';

export const ACML_QUICK_TEMPLATES_LOADING = 'ACML_QUICK_TEMPLATES_LOADING';
export const ACML_QUICK_TEMPLATES_LOADED = 'ACML_QUICK_TEMPLATES_LOADED';
export const ACML_QUICK_TEMPLATES_FAILED = 'ACML_QUICK_TEMPLATES_FAILED';


/**
 * Load a list of file access types from fez, eg open access, embargo, etc
 */
export function loadAcmlQuickTemplates() {
    return dispatch => {
        dispatch({type: ACML_QUICK_TEMPLATES_LOADING});
        getAcmlQuickTemplates().then(accessTypes => {
            dispatch({
                type: ACML_QUICK_TEMPLATES_LOADED,
                payload: accessTypes
            });
        }).catch((error) => {
            dispatch({
                type: ACML_QUICK_TEMPLATES_FAILED,
                payload: error
            });
        });
    };
}
