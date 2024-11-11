import React from 'react';
import PartialDateForm from './PartialDateForm';

export default function PartialDateField(fieldProps) {
    return (
        <PartialDateForm
            onChange={fieldProps.input?.onChange}
            partialDateFormId={fieldProps.partialDateFieldId}
            {...fieldProps}
        />
    );
}
