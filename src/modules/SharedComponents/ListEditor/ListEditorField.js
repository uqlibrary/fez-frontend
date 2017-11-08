import React from 'react';
import FreeTextListEditor from './components/FreeTextListEditor';

export default function ListEditorField(fieldProps) {
    return(<FreeTextListEditor onChange={fieldProps.input.onChange} {...fieldProps} />);
}
