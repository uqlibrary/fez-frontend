import React from 'react';
import GrantListEditor from './components/GrantListEditor';

export default function GrantListEditorField(fieldProps) {
    return <GrantListEditor onChange={fieldProps.input?.onChange} {...fieldProps} />;
}
