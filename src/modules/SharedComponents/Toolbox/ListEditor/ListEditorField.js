import React from 'react';
import FreeTextListEditor from './components/FreeTextListEditor';

export default function ListEditorField(fieldProps) {
    return (
        <FreeTextListEditor
            errorText={fieldProps.state ? fieldProps.state.error : null}
            error={fieldProps.state && !!fieldProps.state.error}
            remindToAdd={fieldProps.remindToAdd}
            {...fieldProps}
        />
    );
}
