import { checkForExistingUser } from 'actions';
import { default as locale } from 'locale/components';

export const checkForExisting = (values, dispatch, props, field) =>
    dispatch(
        checkForExistingUser(
            values.get(field),
            field,
            values.get('usr_id'),
            locale.components.manageUsers.editRow.validation,
            (!!props.asyncErrors && props.asyncErrors.toJS()) || {},
        ),
    );
