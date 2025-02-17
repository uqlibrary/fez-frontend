import React from 'react';
import AlternateIdentifierListEditor from './components/AlternateIdentifierListEditor';

export default function AlternateIdentifierListEditorField(fieldProps) {
    return (
        <AlternateIdentifierListEditor
            errorText={fieldProps.meta ? fieldProps.meta.error : null}
            error={fieldProps.meta && fieldProps.meta.error}
            onChange={fieldProps.input?.onChange}
            {...fieldProps}
        />
    );
}
