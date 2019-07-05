import React from 'react';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { QUALITY_INDICATORS } from 'config/general';

export default (fieldProps) => (
    <GenericSelectField
        itemsList={QUALITY_INDICATORS}
        hideLabel={false}
        locale={{ label: fieldProps.label, placeholder: fieldProps.placeholder }}
        selectedValue={!!fieldProps.input && fieldProps.input.value || []}
        onChange={!!fieldProps.input && fieldProps.input.onChange || undefined}
        errorText={!!fieldProps.meta && fieldProps.meta.error || ''}
        error={!!fieldProps.meta && !!fieldProps.meta.error || false}
        { ...fieldProps }
    />
);
