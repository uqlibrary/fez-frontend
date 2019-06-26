import React from 'react';
import MultiSelectWithChip from './MultiSelectWithChip';

/* istanbul ignore next */
export default function DownshiftMultiChipSelectField(fieldProps) {
    return (
        <MultiSelectWithChip
            onChange={fieldProps.input.onChange}
            {...fieldProps}
        />
    );
}
