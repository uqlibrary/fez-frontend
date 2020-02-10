import React from 'react';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { CURRENT_LICENCES } from 'config/general';

export default function LicenceSelectorField(fieldProps) {
    return (
        <GenericSelectField
            hideLabel={false}
            locale={{ label: fieldProps.label }}
            selectedValue={fieldProps.input.value}
            onChange={!!fieldProps.input && fieldProps.input.onChange}
            itemsList={CURRENT_LICENCES}
            errorText={(!!fieldProps.meta && fieldProps.meta.error) || ''}
            error={(!!fieldProps.meta && !!fieldProps.meta.error) || false}
            {...fieldProps}
        />
    );
}
