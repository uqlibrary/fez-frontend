import React from 'react';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { UNPUBLISHED_STATUS } from 'config/general';

export const UnpublishedStatusField = fieldProps => {
    const itemsList = fieldProps.itemsList || UNPUBLISHED_STATUS;

    return (
        <NewGenericSelectField
            disabled={fieldProps.disabled}
            error={(!!fieldProps.meta && !!fieldProps.meta.error) || !!fieldProps.error}
            errorText={(!!fieldProps.meta && fieldProps.meta.error) || fieldProps.error}
            itemsList={itemsList}
            onChange={(!!fieldProps.input && fieldProps.input.onChange) || fieldProps.onChange}
            value={(!!fieldProps.input && fieldProps.input.value) || fieldProps.value || ''}
            {...fieldProps}
        />
    );
};

UnpublishedStatusField.displayName = 'UnpublishedStatusField';

export default UnpublishedStatusField;
