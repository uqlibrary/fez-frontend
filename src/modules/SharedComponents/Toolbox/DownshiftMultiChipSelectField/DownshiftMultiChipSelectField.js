import React from 'react';
import DownshiftMultiple from './DownshiftMultiple';

export default function DownshiftMultiChipSelectField(fieldProps) {
    return (
        <DownshiftMultiple
            onChange={fieldProps.input.onChange}
            { ...fieldProps }
        />
    );
}
