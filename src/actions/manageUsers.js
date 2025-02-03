import {
    APP_ALERT_HIDE,
    BULK_USER_ITEMS_DELETE_FAILED,
    BULK_USER_ITEMS_DELETE_SUCCESS,
    BULK_USER_ITEMS_DELETING,
    CHECKING_EXISTING_USER,
    CHECKING_EXISTING_USER_FAILED,
    EXISTING_USER_FOUND,
    EXISTING_USER_NOT_FOUND,
    USER_ADD_FAILED,
    USER_ADD_SUCCESS,
    USER_ADDING,
    USER_CLEAR_ALERTS,
    USER_ITEM_DELETE_FAILED,
    USER_ITEM_DELETE_SUCCESS,
    USER_ITEM_DELETING,
    USER_ITEM_UPDATE_FAILED,
    USER_ITEM_UPDATE_SUCCESS,
    USER_ITEM_UPDATING,
    USER_LIST_FAILED,
    USER_LIST_LOADED,
    USER_LIST_LOADING,
} from './actionTypes';
import { destroy, get, post, put } from 'repositories/generic';
import { MANAGE_USERS_LIST_API, USER_API, USERS_SEARCH_API } from 'repositories/routes';
import { createSentryFriendlyError } from '../config/axios';

/*
"usr_id"
"usr_created_date"
"usr_status"
"usr_given_names"
"usr_family_name"
"usr_full_name"
"usr_email"
"usr_preferences"
"usr_sms_email"
"usr_username"
"usr_shib_username"
"usr_administrator"
"usr_ldap_authentication"
"usr_login_count"
"usr_shib_login_count"
"usr_last_login_date"
"usr_external_usr_id"
"usr_super_administrator"
"usr_auth_rule_groups"
"usr_real_last_login_date"
*/

export function loadUserList({ page, pageSize, search }) {
    return async dispatch => {
        dispatch({ type: USER_LIST_LOADING });

        try {
            const response = await get(MANAGE_USERS_LIST_API({ page, pageSize, query: search }));
            dispatch({
                type: USER_LIST_LOADED,
            });
            return Promise.resolve({
                data: response.data,
                page: response.current_page - 1,
                totalCount: response.total,
            });
        } catch (e) {
            dispatch({
                type: USER_LIST_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
}

export function updateUserListItem(newData) {
    return async dispatch => {
        try {
            dispatch({ type: USER_ITEM_UPDATING });

            const response = await put(USER_API({ userId: newData.usr_id }), {
                ...newData,
            });

            dispatch({
                type: USER_ITEM_UPDATE_SUCCESS,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: USER_ITEM_UPDATE_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
}

export function deleteUserListItem(oldData) {
    return async dispatch => {
        dispatch({ type: USER_ITEM_DELETING });

        try {
            const response = await destroy(USER_API({ userId: oldData.usr_id }));
            dispatch({
                type: USER_ITEM_DELETE_SUCCESS,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: USER_ITEM_DELETE_FAILED,
                payload: e.data,
            });

            return Promise.reject(e);
        }
    };
}

export function bulkDeleteUserListItems(oldData) {
    return async dispatch => {
        dispatch({ type: BULK_USER_ITEMS_DELETING });
        const userIds = oldData.map(user => user.usr_id);
        const ids = new URLSearchParams();
        userIds.map(id => ids.append('usr_ids[]', id));
        try {
            const response = await post(USER_API({ userIds }), ids);
            dispatch({
                type: BULK_USER_ITEMS_DELETE_SUCCESS,
                payload: response.data,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: BULK_USER_ITEMS_DELETE_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
}

export function addUser(data) {
    return async dispatch => {
        dispatch({ type: USER_ADDING });

        try {
            const response = await post(USER_API(), data);
            dispatch({
                type: USER_ADD_SUCCESS,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: USER_ADD_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
}

export function checkForExistingUser(search, searchField, id, validation, asyncErrors) {
    let exceptionCaught = true;
    return async dispatch => {
        dispatch({ type: CHECKING_EXISTING_USER });
        return get(USERS_SEARCH_API({ query: search }))
            .then(response => {
                exceptionCaught = false;
                console.log('response', response);
                if (
                    response.total >= 1 &&
                    response.data.filter(user => user.usr_id !== id && user[searchField] === search).length > 0
                ) {
                    console.log('username found');
                    dispatch({
                        type: EXISTING_USER_FOUND,
                    });
                    return Promise.reject(
                        createSentryFriendlyError(validation[searchField], {
                            ...asyncErrors,
                            [searchField]: validation[searchField],
                        }),
                    );
                } else {
                    dispatch({
                        type: EXISTING_USER_NOT_FOUND,
                    });
                    return Promise.resolve();
                }
            })
            .catch(e => {
                if (exceptionCaught) {
                    dispatch({
                        type: CHECKING_EXISTING_USER_FAILED,
                        payload: e,
                    });
                }

                return Promise.reject(e);
            });
    };
}
export function clearUserAlerts() {
    return dispatch => {
        dispatch({ type: USER_CLEAR_ALERTS });
        dispatch({ type: APP_ALERT_HIDE });
    };
}
