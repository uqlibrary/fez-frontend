import React from 'react';
import {GenericSelectField} from 'modules/SharedComponents/GenericSelectField';
import {QUALITY_INDICATORS} from 'config/general';

export default function QualityIndicatorField(fieldProps) {
    return (
        <GenericSelectField
            itemsList={QUALITY_INDICATORS}
            hideLabel={false}
            locale={{label: fieldProps.label, placeholder: fieldProps.placeholder}}
            selectedValue={fieldProps.input.value || []}
            onChange={!!fieldProps.input && fieldProps.input.onChange}
            errorText={!!fieldProps.meta && fieldProps.meta.error || ''}
            error={!!fieldProps.meta && !!fieldProps.meta.error || false}
            { ...fieldProps }
        />
    );
}
