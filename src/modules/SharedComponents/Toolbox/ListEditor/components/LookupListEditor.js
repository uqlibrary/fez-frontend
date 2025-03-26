import React from 'react';
import ListEditor from './ListEditor';
import LookupForm from './LookupForm';

export default function LookupListEditor(fieldProps) {
    const errorText = fieldProps?.meta?.error;
    const props = {
        ...fieldProps,
        errorText: typeof errorText === 'string' ? errorText : errorText?.message || '',
    };
    return <ListEditor formComponent={LookupForm} {...props} />;
}
