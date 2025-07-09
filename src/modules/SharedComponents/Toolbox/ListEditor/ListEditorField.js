import React from 'react';
import FreeTextListEditor from './components/FreeTextListEditor';

export default function ListEditorField(fieldProps) {
    return (
        <FreeTextListEditor
            error={!!fieldProps.state?.error}
            errorText={fieldProps.state?.error}
            remindToAdd={fieldProps.remindToAdd}
            {...fieldProps}
        />
    );
}
