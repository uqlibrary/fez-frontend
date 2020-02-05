import React from 'react';
import IssnListEditor from './components/IssnListEditor';

export default function IssnListEditorField(fieldProps) {
    return (
        <IssnListEditor
            errorText={fieldProps.meta ? fieldProps.meta.error : null}
            error={fieldProps.meta && fieldProps.meta.error}
            onChange={fieldProps.input.onChange}
            {...fieldProps}
        />
    );
}
