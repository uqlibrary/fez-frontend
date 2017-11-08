import React from 'react';
import LookupListEditor from './components/LookupListEditor';

export default function LookupListEditorField(fieldProps) {
    return(<LookupListEditor onChange={fieldProps.input.onChange} {...fieldProps} />);
}
