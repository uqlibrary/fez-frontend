import React from 'react';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { THESIS_SUBTYPES } from 'config/general';

export const ThesisSubtypeSelectField = fieldProps => {
    const itemsList = fieldProps.itemsList || THESIS_SUBTYPES;

    return (
        <NewGenericSelectField
            disabled={fieldProps.disabled}
            error={!!fieldProps.state?.error}
            errorText={(!!fieldProps.state && fieldProps.state.error) || fieldProps.errorText}
            itemsList={itemsList}
            value={(!!fieldProps && fieldProps.value) || fieldProps.value || ''}
            genericSelectFieldId="rek-genre-type"
            {...fieldProps}
        />
    );
};

ThesisSubtypeSelectField.displayName = 'ThesisSubtypeSelectField';

export default ThesisSubtypeSelectField;
