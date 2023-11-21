import { checkForExistingAuthor, clearAuthorAlerts } from 'actions';
import { default as locale } from 'locale/components';

/* istanbul ignore next */
export const checkForExisting = (values, dispatch, props, field) =>
    dispatch(
        checkForExistingAuthor(
            values.get(field),
            field,
            values.get('aut_id'),
            locale.components.manageAuthors.editRow.validation,
            (!!props.asyncErrors && props.asyncErrors.toJS()) || {},
        ),
    );

/* istanbul ignore next */
export const clearAlerts = dispatch => dispatch(clearAuthorAlerts());
