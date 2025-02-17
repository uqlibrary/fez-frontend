import React from 'react';
import ListEditor from './ListEditor';
import LookupForm from './LookupForm';

export default function LookupListEditor(fieldProps) {
    if (!!!fieldProps.input.value) return <></>;
    return <ListEditor formComponent={LookupForm} {...fieldProps} />;
}
