import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import * as routes from 'repositories/routes';


/**
 * Returns the org units list
 * @returns {action}
 */
export function listOrgUnits() {
    return dispatch => {
        dispatch({type: actions.ORG_UNITS_LOADING});

        get(routes.ORG_UNITS_LIST_API())
            .then((response) => {
                dispatch({
                    type: actions.ORG_UNITS_LOADED,
                    payload: response.data.data
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.ORG_UNITS_LOAD_FAILED,
                    payload: error
                });
            });
    };
}
