import React from 'react';
import AttributionIncomplete from './AttributionIncomplete';

export default function AttributionIncompleteField(fieldProps) {
    return (
        <AttributionIncomplete
            onChange={fieldProps.input?.onChange}
            isAttributionIncomplete={
                fieldProps.input.value !== '' &&
                (fieldProps.input.value === 'on' || fieldProps.input.value === 1 || fieldProps.input.value === true)
            }
            {...fieldProps}
        />
    );
}
