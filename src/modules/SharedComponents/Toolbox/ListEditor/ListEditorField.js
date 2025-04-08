import React from 'react';
import FreeTextListEditor from './components/FreeTextListEditor';

export default function ListEditorField(fieldProps) {
    return (
        <FreeTextListEditor
            errorText={fieldProps.meta ? fieldProps.meta.error : null}
            error={fieldProps.meta && !!fieldProps.meta.error}
            remindToAdd={fieldProps.remindToAdd}
            {...fieldProps}
        />
    );
}
