import React from 'react';
import LinkedFieldEditor from './components/LinkedFieldEditor';

export default function LinkedFieldEditorField(fieldProps) {
    return(<LinkedFieldEditor onChange={fieldProps.input.onChange} {...fieldProps} />);
}
