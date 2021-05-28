import { checkForExistingAuthor } from 'actions';
import { default as locale } from 'locale/components';

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
