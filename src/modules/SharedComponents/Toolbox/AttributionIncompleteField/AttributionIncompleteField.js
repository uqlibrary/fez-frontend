import React from 'react';
import AttributionIncomplete from './AttributionIncomplete';

export default function AttributionIncompleteField(fieldProps) {
    return (
        <AttributionIncomplete
            isAttributionIncomplete={
                fieldProps.value !== '' &&
                (fieldProps.value === 'on' || fieldProps.value === 1 || fieldProps.value === true)
            }
            {...fieldProps}
        />
    );
}
