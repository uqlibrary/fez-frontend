import React from 'react';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { LICENSES } from 'config/general';

export default function LicenseSelectorField(fieldProps) {
    return (
        <GenericSelectField
            hideLabel={false}
            locale={{ label: fieldProps.label }}
            selectedValue={fieldProps.input.value}
            onChange={!!fieldProps.input && fieldProps.input.onChange}
            itemsList={LICENSES}
            errorText={!!fieldProps.meta && fieldProps.meta.error || ''}
            error={!!fieldProps.meta && !!fieldProps.meta.error || false}
            { ...fieldProps }
        />
    );
}
