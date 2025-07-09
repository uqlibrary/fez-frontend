import React from 'react';
import PartialDateForm from './PartialDateForm';

export default function PartialDateField(fieldProps) {
    return <PartialDateForm partialDateFormId={fieldProps.partialDateFieldId} {...fieldProps} />;
}
