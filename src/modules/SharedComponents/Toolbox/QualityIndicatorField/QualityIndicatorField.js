import React from 'react';
import {GenericSelectField} from 'modules/SharedComponents/GenericSelectField';

export default function QualityIndicatorField(fieldProps) {
    return (
        <GenericSelectField
            hideLabel={false}
            locale={{label: fieldProps.label}}
            selectedValue={fieldProps.input.value || []}
            onChange={!!fieldProps.input && fieldProps.input.onChange}
            errorText={!!fieldProps.meta && fieldProps.meta.error || ''}
            error={!!fieldProps.meta && !!fieldProps.meta.error || false}
            { ...fieldProps }
        />
    );
}
