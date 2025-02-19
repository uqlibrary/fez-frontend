import React from 'react';
import ListEditor from './ListEditor';
import LookupForm from './LookupForm';

export default function LookupListEditor(fieldProps) {
    const props = { ...fieldProps };
    // eslint-disable-next-line react/prop-types
    if (!props.input.value) props.input.value = [];
    return <ListEditor formComponent={LookupForm} {...props} />;
}
