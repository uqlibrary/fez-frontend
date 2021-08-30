import React from 'react';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { THESIS_SUBTYPES } from 'config/general';

export const ThesisSubtypeSelectField = fieldProps => {
    const itemsList = fieldProps.itemsList || THESIS_SUBTYPES;

    return (
        <NewGenericSelectField
            disabled={fieldProps.disabled}
            error={(!!fieldProps.meta && !!fieldProps.meta.error) || !!fieldProps.error}
            errorText={(!!fieldProps.meta && fieldProps.meta.error) || fieldProps.errorText}
            itemsList={itemsList}
            onChange={(!!fieldProps.input && fieldProps.input.onChange) || fieldProps.onChange}
            value={(!!fieldProps.input && fieldProps.input.value) || fieldProps.value || ''}
            genericSelectFieldId="rek-genre-type"
            {...fieldProps}
        />
    );
};

ThesisSubtypeSelectField.displayName = 'ThesisSubtypeSelectField';

export default ThesisSubtypeSelectField;
