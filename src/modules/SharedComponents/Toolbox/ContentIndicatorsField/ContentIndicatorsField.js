import React from 'react';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { CONTENT_INDICATORS } from 'config/general';

export default (fieldProps) => (
    <GenericSelectField
        itemsList={CONTENT_INDICATORS}
        hideLabel={false}
        locale={{ label: fieldProps.label }}
        selectedValue={!!fieldProps.input && fieldProps.input.value || []}
        onChange={!!fieldProps.input && fieldProps.input.onChange || undefined}
        errorText={!!fieldProps.meta && fieldProps.meta.error || ''}
        error={!!fieldProps.meta && !!fieldProps.meta.error || false}
        {...fieldProps}
    />
);
