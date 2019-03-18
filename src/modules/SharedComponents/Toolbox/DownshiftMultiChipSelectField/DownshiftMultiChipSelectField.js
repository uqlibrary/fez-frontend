import React from 'react';
import MultiSelectWithChip from './MultiSelectWithChip';

export default function DownshiftMultiChipSelectField(fieldProps) {
    return (
        <MultiSelectWithChip
            onChange={fieldProps.input.onChange}
            { ...fieldProps }
        />
    );
}
