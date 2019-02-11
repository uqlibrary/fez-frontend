import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import {THIRD_PARTY_LOOKUP_API_1FIELD, THIRD_PARTY_LOOKUP_API_2FIELD} from 'repositories/routes';
import {locale} from 'locale';

/**
 * build the api url
 * @param type
 * @param field1
 * @param field2
 * @returns {*}
 */
export function getThirdPartyLookupApiUrl(type, field1, field2) {
    if (typeof field2 !== 'undefined') {
        return THIRD_PARTY_LOOKUP_API_2FIELD({type: type, field1: field1, field2: field2});
    } else {
        return THIRD_PARTY_LOOKUP_API_1FIELD({type: type, field1: field1});
    }
}

/**
 * fetch and dispatch the data from api
 * @param type
 * @param field1
 * @param field2
 * @returns {function(*): (*|void|Promise<T | never>)}
 */
export function loadThirdPartyLookup(type, field1, field2) {
    return dispatch => {
        dispatch({type: actions.THIRD_PARTY_LOOKUP_TOOL_LOADING});

        return get(getThirdPartyLookupApiUrl(type, field1, field2))
            .then(response => {
                if (response.data.length === 0) {
                    dispatch({
                        type: actions.THIRD_PARTY_LOOKUP_TOOL_LOAD_FAILED,
                        payload: ['No Results']
                    });
                } else {
                    dispatch({
                        type: actions.THIRD_PARTY_LOOKUP_TOOL_SUCCESS,
                        payload: response.data
                    });
                }

                // return Promise.resolve(response.data);
            })
            .catch(error => {
                let message;
                if (error.message === locale.global.errorMessages[403].message) {
                    message = ['Invalid authentication credentials - use a valid api key'];
                } else {
                    message = [error.message];
                }
                dispatch({
                    type: actions.THIRD_PARTY_LOOKUP_TOOL_LOAD_FAILED,
                    payload: message
                });
            });
    };
}

export function clearThirdPartyLookup() {
    return dispatch => {
        dispatch({
            type: actions.THIRD_PARTY_LOOKUP_TOOL_CLEAR
        });
    };
}
