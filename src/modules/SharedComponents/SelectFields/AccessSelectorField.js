import React from 'react';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';

export const AccessSelectorField = fieldProps => {
    return (
        <NewGenericSelectField
            genericSelectFieldId={fieldProps.accessSelectorFieldId}
            disabled={fieldProps.disabled}
            error={(!!fieldProps.meta && !!fieldProps.meta.error) || !!fieldProps.error}
            errorText={(!!fieldProps.meta && fieldProps.meta.error) || fieldProps.error}
            onChange={(!!fieldProps.input && fieldProps.input.onChange) || fieldProps.onChange}
            value={(!!fieldProps.input && fieldProps.input.value) || fieldProps.value || ''}
            {...fieldProps}
        />
    );
};

AccessSelectorField.displayName = 'AccessSelectorField';

export default AccessSelectorField;
