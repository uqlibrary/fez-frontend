import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import * as routes from 'repositories/routes';


/**
 * Returns the org units list
 * @returns {action}
 */
export function loadOrgUnits(id) {
    return dispatch => {
        dispatch({type: actions.ORG_UNITS_LOADING});

        get(routes.VOCABULARIES_API({id: id}))
            .then((response) => {
                dispatch({
                    type: actions.ORG_UNITS_LOADED,
                    payload: response.data
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
