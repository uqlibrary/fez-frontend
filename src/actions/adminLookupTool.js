import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import {ADMIN_LOOKUP_API_1FIELD, ADMIN_LOOKUP_API_2FIELD} from 'repositories/routes';

/**
 * Load publication
 * @param {object}
 * @returns {action}
 */
export function loadRecord(type, field1, field2) {
    return dispatch => {
        dispatch({type: actions.ADMIN_LOOKUP_TOOL_LOADING});

        return get(this.getAdminLookupApi({type: type, field1: field1, field2: field2}))
            .then(response => {
                dispatch({
                    type: actions.ADMIN_LOOKUP_TOOL_SUCCESS,
                    payload: response.data
                });

                return Promise.resolve(response.data);
            })
            .catch(error => {
                dispatch({
                    type: actions.FIX_RECORD_LOAD_FAILED,
                    payload: error.message
                });
            });
    };
}

export function getAdminLookupApi(type, field1, field2) {
    if (typeof field2 !== 'undefined') {
        return ADMIN_LOOKUP_API_2FIELD({type: type, field1: field1, field2: field2});
    } else {
        return ADMIN_LOOKUP_API_1FIELD({type: type, field1: field1});
    }
}

export function loadAdminLookup(type, field1, field2) {
    console.log('loadAdminLookup');
    return dispatch => {
        dispatch({type: actions.ADMIN_LOOKUP_TOOL_LOADING});

        return get(getAdminLookupApi({type, field1, field2}))
            .then(response => {
                dispatch({
                    type: actions.ADMIN_LOOKUP_TOOL_SUCCESS,
                    payload: response.data
                });

                return Promise.resolve(response.data);
            })
            .catch(error => {
                dispatch({
                    type: actions.ADMIN_LOOKUP_TOOL_LOAD_FAILED,
                    payload: error.message
                });
            });
    };
}
