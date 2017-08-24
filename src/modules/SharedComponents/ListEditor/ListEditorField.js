import React from 'react';
import ListEditor from './components/ListEditor';

export default function ListEditorField(fieldProps) {
    return(<ListEditor onChange={fieldProps.input.onChange} {...fieldProps} />);
}
