import { checkForExistingUser, clearUserAlerts } from 'actions';
import { default as locale } from 'locale/components';

/* c8 ignore next */
export const checkForExisting = (values, dispatch, props, field) =>
    dispatch(
        checkForExistingUser(
            values.get(field),
            field,
            values.get('usr_id'),
            locale.components.manageUsers.editRow.validation,
            props.asyncErrors || {},
        ),
    );

/* c8 ignore next */
export const clearAlerts = dispatch => dispatch(clearUserAlerts());
