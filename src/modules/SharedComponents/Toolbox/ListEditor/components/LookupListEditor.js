import React from 'react';
import ListEditor from './ListEditor';
import LookupForm from './LookupForm';

export default function LookupListEditor(fieldProps) {
    console.log('LookupListEditor', fieldProps);
    return(<ListEditor formComponent={LookupForm} {...fieldProps} />);
}
