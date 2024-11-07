import React from 'react';
import ListEditor from './components/ListEditor';
import IssnForm from './components/IssnForm';

export default function IssnListEditorField(fieldProps) {
    return (
        <ListEditor
            formComponent={IssnForm}
            errorText={fieldProps.meta ? fieldProps.meta.error : null}
            error={fieldProps.meta && !!fieldProps.meta.error}
            onChange={fieldProps.input?.onChange}
            remindToAdd={fieldProps.remindToAdd}
            {...fieldProps}
        />
    );
}
